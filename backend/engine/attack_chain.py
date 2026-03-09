import json
import google.generativeai as genai
from typing import List, Dict
from models.risk_result import AttackChain, RiskResult
from models.company import CompanyContext


def find_attack_chains(
    results: List[RiskResult],
    company: CompanyContext
) -> List[AttackChain]:
    """
    Send all vulnerabilities to Gemini together.
    Ask it to identify which ones could be chained into multi-step attack paths.
    """
    if len(results) < 2:
        return []

    model = genai.GenerativeModel("gemini-2.5-flash")

    # Build vulnerability summary for Gemini
    vuln_summary = []
    for r in results:
        vuln_summary.append({
            "id":       r.vulnerability_id,
            "type":     r.bug_type,
            "file":     r.file,
            "line":     r.line,
            "exposure": r.exposure,
            "gemini_context": r.gemini_analysis.business_context if r.gemini_analysis else "",
            "exploitable": r.gemini_analysis.is_exploitable if r.gemini_analysis else True
        })

    prompt = f"""You are a senior penetration tester analyzing a set of vulnerabilities
found in {company.company_name}'s codebase ({company.industry} company, {company.deployment_exposure} deployment).

VULNERABILITIES FOUND:
{json.dumps(vuln_summary, indent=2)}

TASK: Identify attack chains — sequences of 2 or more vulnerabilities that an attacker
could exploit in sequence to cause greater damage than any single vulnerability alone.

Classic chain examples:
- XSS → steal session → auth bypass → access admin → SQLi → full database
- Path traversal → read credentials → auth bypass → RCE
- IDOR → enumerate users → credential stuffing → account takeover

Respond ONLY with valid JSON in exactly this format:
{{
  "chains": [
    {{
      "chain_id": "CHAIN_001",
      "vulnerability_ids": ["VULN_001", "VULN_002"],
      "chain_description": "Plain English description of the full attack path (2-3 sentences, no jargon)",
      "combined_severity": "critical" or "high" or "medium",
      "severity_reasoning": "Why chaining makes this worse than the individual bugs",
      "steps": [
        "Step 1: Attacker exploits [VULN_001] to...",
        "Step 2: Using what they gained, they exploit [VULN_002] to...",
        "Step 3: The result is..."
      ]
    }}
  ]
}}

If no meaningful chains exist, return {{"chains": []}}.
Only include chains where the combination is genuinely more dangerous.
Write all descriptions for a non-technical CEO audience — no CVE IDs, no jargon."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        data = json.loads(text)

        chains = []
        for c in data.get("chains", []):
            # Compute combined expected loss
            involved_results = [r for r in results if r.vulnerability_id in c["vulnerability_ids"]]
            combined_loss = sum(r.expected_loss for r in involved_results) * 1.5  # 50% amplifier for chaining

            chains.append(AttackChain(
                chain_id=c["chain_id"],
                vulnerability_ids=c["vulnerability_ids"],
                chain_description=c["chain_description"],
                combined_severity=c.get("combined_severity", "high"),
                combined_expected_loss=round(combined_loss, 2),
                chain_steps=c.get("steps", [])
            ))
        return chains
    except Exception as e:
        print(f"Attack chain analysis failed: {e}")
        return []
