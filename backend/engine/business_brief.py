import json
from models.risk_result import RiskResult, GeminiAnalysis
from models.company import CompanyContext


def load_attack_stories() -> dict:
    with open("knowledge_base/attack_stories.json") as f:
        return json.load(f)


def fmt(amount: float) -> str:
    if amount >= 1_000_000:
        return f"${amount/1_000_000:.1f}M"
    return f"${amount:,.0f}"

def fmt_range(amount: float) -> str:
    if amount <= 0: return "$0"
    low = amount * 0.8
    high = amount * 1.2
    return f"{fmt(low)} – {fmt(high)}"


def humanize_data_types(data_types: list) -> str:
    mapping = {
        "pii": "customer personal information",
        "financial": "payment and financial data",
        "health": "medical records",
        "credentials": "login credentials"
    }
    labels = [mapping.get(d.lower(), d) for d in data_types]
    if len(labels) == 1: return labels[0]
    return ", ".join(labels[:-1]) + " and " + labels[-1]


def get_urgency(expected_loss: float) -> dict:
    if expected_loss >= 100000:
        return {"icon": "🔴", "label": "CRITICAL BUSINESS RISK", "subtitle": "Requires decision this week",
                "action": "Fix immediately — this sprint, not next."}
    elif expected_loss >= 30000:
        return {"icon": "🟠", "label": "HIGH BUSINESS RISK",     "subtitle": "Requires decision this sprint",
                "action": "Fix this sprint. Do not defer to backlog."}
    elif expected_loss >= 5000:
        return {"icon": "🟡", "label": "MEDIUM BUSINESS RISK",   "subtitle": "Schedule within 30 days",
                "action": "Assign to next sprint. Monitor in the meantime."}
    return     {"icon": "🟢", "label": "LOW BUSINESS RISK",      "subtitle": "Schedule within 90 days",
                "action": "Add to backlog. Fix during next refactor cycle."}


def generate_business_brief(result: RiskResult, company: CompanyContext) -> str:
    stories    = load_attack_stories()
    story      = stories.get(result.bug_type, stories["UNKNOWN"])
    urgency    = get_urgency(result.expected_loss)
    bug_label  = result.bug_type.replace("_", " ").title()
    prob_pct   = round(result.effective_probability * 100)
    b          = result.impact_breakdown
    records    = f"{company.estimated_records_stored:,}"
    data_label = humanize_data_types(company.sensitive_data_types)
    fix_cost   = result.fix_effort_hours * company.engineer_hourly_cost
    roi_mult   = int(result.expected_loss / fix_cost) if fix_cost > 0 else 0
    frameworks = "/".join(company.regulatory_frameworks)

    # Format attack steps with company context
    steps_text = ""
    for i, step in enumerate(story["steps"]):
        step = step.replace("{records}", records).replace("{data_types}", data_label)\
                   .replace("{company}", company.company_name)
        steps_text += f"  Step {i+1}: {step}\n"

    headline = story["headline_template"]\
        .replace("{company}", company.company_name).replace("{records}", records)

    # Gemini enhancement block
    gemini_block = ""
    if result.gemini_analysis:
        g = result.gemini_analysis
        if not g.is_exploitable:
            gemini_block = f"""
AI ANALYSIS: POTENTIAL FALSE POSITIVE
  Confidence: {g.exploitability_confidence}
  Reason: {g.exploitability_reasoning}
  Recommendation: Have a security engineer verify before prioritizing.
"""
        else:
            gemini_block = f"""
AI ANALYSIS OF THIS SPECIFIC CODE
  What this code does: {g.business_context}
  Why it's exploitable: {g.exploitability_reasoning}
  Authentication required: {g.authentication_required.upper()}
  Data Scope: {g.data_scope.upper()}
"""

    # Cost lines
    cost_lines = ""
    if b.data_breach_cost > 0:
        cost_lines += f"  {'Data breach cost:':<42} {fmt_range(b.data_breach_cost)}\n"
    if b.regulatory_penalty > 0:
        cost_lines += f"  {f'Regulatory fines ({frameworks}):':<42} {fmt_range(b.regulatory_penalty)}\n"
    if b.reputation_damage > 0:
        cost_lines += f"  {'Lost customers (estimated churn):':<42} {fmt_range(b.reputation_damage)}\n"
    cost_lines += f"  {'Incident response + legal:':<42} {fmt_range(b.incident_response_cost)}\n"
    cost_lines += f"  {'System downtime cost:':<42} {fmt_range(b.downtime_cost)}\n"

    # Fix guidance from Gemini
    fix_guidance = ""
    if result.gemini_analysis and result.gemini_analysis.recommended_fix:
        fix_guidance = f"""
HOW TO FIX IT
  Complexity: {result.gemini_analysis.fix_complexity}
  {result.gemini_analysis.recommended_fix}
"""

    return f"""{'='*65}
  {urgency['icon']} {urgency['label']}
  {urgency['subtitle']}
  Location: {result.file}, line {result.line}
{'='*65}

WHAT IS BROKEN (plain English)
  {story['real_world_analogy']}
  Technical name: {bug_label}
  Accessible from: {'The public internet' if result.exposure == 'PUBLIC' else 'Internal network only'}
{gemini_block}
HOW A REAL BREACH HAPPENS — STEP BY STEP
{steps_text}
  Attacker effort required: {story['attacker_effort']}
  How hard to detect:       {story['detection_difficulty']}
  Real-world precedent:     {story.get('comparable_breach', 'N/A')}

WHAT THIS COSTS {company.company_name.upper()} IF NOT FIXED
{cost_lines}  {'─'*55}
  {'TOTAL POTENTIAL LOSS:':<42} {fmt_range(result.total_impact)}

  Probability of exploitation: {prob_pct}%
  {'(AI-adjusted from baseline based on code analysis and system role)' if result.gemini_analysis else '(Based on industry data for this exposure level)'}

  EXPECTED LOSS (probability × impact): {fmt_range(result.expected_loss)}
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  {result.fix_effort_hours} hours
  Salary cost:    {fmt(fix_cost)}
  ROI of fixing:  {roi_mult}× — every $1 spent saves ${roi_mult} in expected loss.
{fix_guidance}
WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "{headline}"

DECISION REQUIRED
  {urgency['action']}
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
{'='*65}""".strip()


def generate_executive_summary(results: list, company: CompanyContext,
                                 chains: list = None) -> str:
    total_impact   = sum(r.total_impact for r in results)
    total_hours    = sum(r.fix_effort_hours for r in results)
    total_fix_cost = total_hours * company.engineer_hourly_cost

    # 11. Deduplicate/Aggregate losses accurately using attack chains
    chained_vuln_ids = set()
    chain_loss_total = 0
    if chains:
        for c in chains:
            chain_loss_total += c.combined_expected_loss
            for vid in c.vulnerability_ids:
                chained_vuln_ids.add(vid)
                
    unchained_loss = sum(r.expected_loss for r in results if r.vulnerability_id not in chained_vuln_ids)
    total_loss = chain_loss_total + unchained_loss

    # If ROI is absurd, cap it at max. Or calculate based on range avg.
    roi = int(total_loss / total_fix_cost) if total_fix_cost > 0 else 0

    critical = [r for r in results if r.expected_loss >= 100000]
    high     = [r for r in results if 30000 <= r.expected_loss < 100000]
    other    = [r for r in results if r.expected_loss < 30000]

    top3 = ""
    for i, r in enumerate(results[:3]):
        label = r.bug_type.replace("_", " ").title()
        gemini_note = " ✓ AI-verified" if (r.gemini_analysis and r.gemini_analysis.is_exploitable) else ""
        top3 += f"  #{i+1}  {label:<32} Expected loss: {fmt_range(r.expected_loss):<18} Fix: {r.fix_effort_hours}h{gemini_note}\n"

    chain_block = ""
    if chains:
        chain_block = f"\nATTACK CHAINS DETECTED: {len(chains)}\n"
        for c in chains:
            chain_block += f"  {c.chain_id}: {c.chain_description}\n"
            chain_block += f"  Combined exposure: {fmt_range(c.combined_expected_loss)} | Severity: {c.combined_severity.upper()}\n\n"

    gemini_note = "\n  Note: Probabilities and Impacts have been adjusted by AI analysis of actual code context and data scopes." \
                  if any(r.gemini_analysis for r in results) else ""

    if len(results) == 0:
        do_nothing = """WHAT HAPPENS IF WE DO NOTHING
  This scan found no reportable vulnerabilities, so there is no quantified
  expected loss from known issues in this codebase at this time.
  Residual risk remains (e.g., new disclosures, misconfiguration, supply-chain
  changes, and vulnerabilities not covered by this scan). Re-scan on each
  release and at least weekly.
"""
    else:
        do_nothing = f"""WHAT HAPPENS IF WE DO NOTHING
  Based on breach rates for {company.industry} {company.system_role.replace('_', ' ')}s our size, at least one
  of these vulnerabilities is likely to be found and exploited within
  6–18 months if unaddressed.
"""

    return f"""{'='*65}
  SECURITY RISK EXECUTIVE SUMMARY
  {company.company_name} — Board / Leadership Review
{'='*65}

BOTTOM LINE
  We have {len(results)} distinct grouped security vulnerabilities.
  Total exposure if all exploited:              {fmt_range(total_impact)}
  Expected loss (probability-adjusted):         {fmt_range(total_loss)}
  Total cost to fix everything:                 {fmt(total_fix_cost)} ({total_hours:.0f} hours)
  Fixing yields up to {roi}× ROI compared to expected loss.
{gemini_note}

RISK BREAKDOWN
  🔴 Critical — act this week:   {len(critical)} {'vulnerability' if len(critical)==1 else 'vulnerabilities'}
  🟠 High — act this sprint:     {len(high)} {'vulnerability' if len(high)==1 else 'vulnerabilities'}
  🟡 Medium / Low — schedule:    {len(other)} {'vulnerability' if len(other)==1 else 'vulnerabilities'}

TOP 3 RISKS BY FINANCIAL EXPOSURE
{top3}{chain_block}
{do_nothing}

WHAT WE ARE ASKING FOR
  Approval to allocate {total_hours:.0f} engineering hours to address
  the {len(critical)} critical and {len(high)} high-priority vulnerabilities.
  Estimated cost: {fmt(total_fix_cost)}.

{'='*65}""".strip()
