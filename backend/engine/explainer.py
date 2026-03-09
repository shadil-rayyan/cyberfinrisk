from models.risk_result import RiskResult
from models.company import CompanyContext


def generate_explanation(result: RiskResult, company: CompanyContext) -> str:
    """Generate plain-English management explanation for this vulnerability."""
    
    bug_label = result.bug_type.replace("_", " ").title()
    prob_pct = round(result.probability_of_exploit * 100, 1)
    impact_fmt = f"${result.total_impact:,.0f}"
    el_fmt = f"${result.expected_loss:,.0f}"
    
    breakdown = result.impact_breakdown
    
    lines = [
        f"A {bug_label} vulnerability was detected in {result.file} (line {result.line}).",
        "",
        f"RISK SUMMARY",
        f"  Exploitation probability: {prob_pct}% — because this endpoint is {result.exposure.lower()} facing.",
        f"  Estimated total financial impact if exploited: {impact_fmt}",
        f"  Expected financial loss (probability-adjusted): {el_fmt}",
        "",
        f"IMPACT BREAKDOWN",
    ]
    
    if breakdown.data_breach_cost > 0:
        lines.append(f"  • Data breach cost:        ${breakdown.data_breach_cost:>12,.0f}")
    lines.append(    f"  • Incident response:       ${breakdown.incident_response_cost:>12,.0f}")
    lines.append(    f"  • Operational downtime:    ${breakdown.downtime_cost:>12,.0f}")
    if breakdown.regulatory_penalty > 0:
        lines.append(f"  • Regulatory penalties:    ${breakdown.regulatory_penalty:>12,.0f}")
    if breakdown.reputation_damage > 0:
        lines.append(f"  • Reputation / churn loss: ${breakdown.reputation_damage:>12,.0f}")
    
    lines += [
        "",
        f"REMEDIATION",
        f"  Estimated fix effort: {result.fix_effort_hours} engineering hours",
        f"  Priority score: {result.priority_score:,.0f} (${result.expected_loss:,.0f} saved per {result.fix_effort_hours}h of work)",
        "",
        f"RECOMMENDATION: {'CRITICAL — remediate immediately.' if result.priority_score > 50000 else 'HIGH — remediate this sprint.' if result.priority_score > 10000 else 'MEDIUM — schedule for next sprint.'}"
    ]
    
    return "\n".join(lines)
