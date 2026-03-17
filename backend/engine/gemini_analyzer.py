import os
import json
import google.generativeai as genai
import requests
import threading
from typing import Optional
from models.risk_result import GeminiAnalysis
from models.company import CompanyContext, AssetContext
from engine.criticality import get_asset_criticality

MAX_RETRIES = 2
AI_CONCURRENCY_LIMIT = 2  # Limit for local AI to prevent CPU/Memory thrashing
OLLAMA_SEMAPHORE = threading.Semaphore(AI_CONCURRENCY_LIMIT)

def init_gemini(api_key: str):
    genai.configure(api_key=api_key)

def analyze_with_ollama(prompt: str) -> Optional[dict]:
    """Fallback to local Ollama if Gemini quota reached."""
    try:
        url = "http://localhost:11434/api/generate"
        payload = {
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return json.loads(data["response"])
    except Exception as e:
        print(f"Ollama fallback failed: {e}")
        return None

def analyze_vulnerability(
    bug_type: str,
    file: str,
    line: int,
    code_context: str,
    message: str,
    exposure: str,
    company: CompanyContext,
    baseline_probability: float,
    asset: Optional[AssetContext] = None,
    gemini_api_key: Optional[str] = None
) -> Optional[GeminiAnalysis]:
    
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Instruction sets
    core_instructions = f"""Analyze finding: {bug_type} at {file}:{line}
Scanner: {message}
Context: {code_context[:800] if code_context else "N/A"}

Respond ONLY with raw JSON:
{{
  "is_exploitable": bool,
  "exploitability_confidence": "high"|"medium"|"low",
  "exploitability_reasoning": "Technical reasoning",
  "business_context": "Function description",
  "authentication_required": "admin_only"|"public"|"authenticated",
  "data_scope": "database"|"system"|"none",
  "adjusted_probability": float,
  "false_positive_likelihood": "low"|"medium"|"high",
  "recommended_fix": "Specific fix command",
  "fix_complexity": "simple"|"moderate"
}}"""

    def _parse_ai_json(text: str) -> dict:
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            inner = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            text = inner.strip()
        return json.loads(text)

    # 1. Ollama Immediate Fallback (if no key)
    if not gemini_api_key:
        print(f"AI: No Gemini key — queueing Ollama for {file}")
        with OLLAMA_SEMAPHORE:
            data = analyze_with_ollama(core_instructions)
            if data:
                try:
                    return GeminiAnalysis(
                        is_exploitable=bool(data.get("is_exploitable", True)),
                        exploitability_confidence=data.get("exploitability_confidence", "medium"),
                        exploitability_reasoning=data.get("exploitability_reasoning", "Analyzed via local AI fallback."),
                        business_context=data.get("business_context", ""),
                        authentication_required=data.get("authentication_required", "unknown"),
                        data_scope=data.get("data_scope", "unknown"),
                        adjusted_probability=float(data.get("adjusted_probability", baseline_probability)),
                        false_positive_likelihood=data.get("false_positive_likelihood", "medium"),
                        recommended_fix=data.get("recommended_fix", "Review manually."),
                        fix_complexity=data.get("fix_complexity", "moderate"),
                        is_local=True
                    )
                except Exception as pe:
                    print(f"AI: Ollama parse error: {pe}")
        return None

    # 2. Gemini with Ollama Fallback
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = model.generate_content(core_instructions)
            data = _parse_ai_json(response.text)
            return GeminiAnalysis(
                is_exploitable=bool(data.get("is_exploitable", True)),
                exploitability_confidence=data.get("exploitability_confidence", "medium"),
                exploitability_reasoning=data.get("exploitability_reasoning", ""),
                business_context=data.get("business_context", ""),
                authentication_required=data.get("authentication_required", "unknown"),
                data_scope=data.get("data_scope", "unknown"),
                adjusted_probability=float(data.get("adjusted_probability", baseline_probability)),
                false_positive_likelihood=data.get("false_positive_likelihood", "medium"),
                recommended_fix=data.get("recommended_fix", "Review manually."),
                fix_complexity=data.get("fix_complexity", "moderate"),
                is_local=False
            )
        except Exception as e:
            if attempt < MAX_RETRIES:
                continue
            print(f"AI: Gemini failed ({e}) — switching to Ollama for {file}")
            with OLLAMA_SEMAPHORE:
                data = analyze_with_ollama(core_instructions)
                if data:
                    try:
                        return GeminiAnalysis(
                            is_exploitable=bool(data.get("is_exploitable", True)),
                            exploitability_confidence=data.get("exploitability_confidence", "medium"),
                            exploitability_reasoning=data.get("exploitability_reasoning", "Analyzed via local AI fallback."),
                            business_context=data.get("business_context", ""),
                            authentication_required=data.get("authentication_required", "unknown"),
                            data_scope=data.get("data_scope", "unknown"),
                            adjusted_probability=float(data.get("adjusted_probability", baseline_probability)),
                            false_positive_likelihood=data.get("false_positive_likelihood", "medium"),
                            recommended_fix=data.get("recommended_fix", "Review manually."),
                            fix_complexity=data.get("fix_complexity", "moderate"),
                            is_local=True
                        )
                    except:
                        pass
            return None
