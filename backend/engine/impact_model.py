import json
from models.company import CompanyContext, AssetContext
from models.risk_result import ImpactBreakdown, GeminiAnalysis
from typing import Optional

def compute_total_impact(company: CompanyContext, bug_type: str, gemini_result: Optional[GeminiAnalysis] = None, asset: Optional[AssetContext] = None):
    with open("knowledge_base/breach_costs.json")     as f: bc  = json.load(f)
    with open("knowledge_base/regulatory_models.json") as f: rm  = json.load(f)
    with open("knowledge_base/downtime_estimates.json") as f: de  = json.load(f)
    with open("knowledge_base/bug_taxonomy.json")     as f: tax = json.load(f)

    bug_info = tax.get(bug_type, {})

    # Data breach cost
    if bug_info.get("data_exfiltration", False):
        cpr = bc["cost_per_record_by_industry"].get(
            company.industry.lower(), bc["cost_per_record_by_industry"]["default"])
        
        # 3, 5, 8, 10: Adjust dataset size based on data_scope and system_role
        scope_multiplier = 0.20 # baseline
        if gemini_result:
            if gemini_result.data_scope == "full_database":
                scope_multiplier = 1.0
            elif gemini_result.data_scope == "single_user_record":
                scope_multiplier = 0.0001
            elif gemini_result.data_scope == "none":
                scope_multiplier = 0.0
                
        # If it's a framework, the users impacted could be 0 for the company, but HUGE for the ecosystem. 
        # But this engine models risk for the *Company*, so framework vendor has 0 data records but huge reputation.
        if company.system_role in ["framework", "infrastructure"] and not gemini_result:
            scope_multiplier = 0.05

        records = int(company.estimated_records_stored * scope_multiplier)
        data_breach = records * cpr
    else:
        data_breach = 0.0

    # Incident response
    incident = bc["incident_response_cost"].get(company.company_size, 100000)

    # Downtime
    hours    = de["downtime_hours_by_bug_type"].get(bug_type, 2)
    
    # Use asset value directly for downtime cost if available, else fallback
    if asset and "value_per_hour" in asset.description.lower():
        # Heuristic: let's calculate per-hour cost if asset name implies it
        cph = asset.estimated_value_usd / 24 if "day" in asset.description.lower() else company.estimated_downtime_cost_per_hour or bc["downtime_cost_per_hour"].get(company.company_size, 12000)
    else:
        cph = company.estimated_downtime_cost_per_hour or bc["downtime_cost_per_hour"].get(company.company_size, 12000)
    downtime = hours * cph

    # Regulatory fines
    reg = 0.0
    fw  = [r.upper() for r in company.regulatory_frameworks]
    # Use asset-level sensitive data if available to avoid assessing company-wide fines for an asset that doesn't hold that data!
    dt  = [d.upper() for d in (asset.sensitive_data_types if asset else company.sensitive_data_types)]
    
    if "GDPR"    in fw or "PII"       in dt:
        reg += min(company.annual_revenue * rm["GDPR"]["fine_percentage_of_arr"],
                   rm["GDPR"]["max_fine_usd"])
    if "PCI_DSS" in fw or "FINANCIAL" in dt:
        reg += rm["PCI_DSS"]["avg_fine"]
    if "HIPAA"   in fw or "HEALTH"    in dt:
        reg += rm["HIPAA"]["max_annual"]

    # Churn / reputation
    if any(d in dt for d in ["FINANCIAL", "HEALTH"]):
        cr = bc["churn_rate_after_breach"]["high_sensitivity"]
    elif "PII" in dt:
        cr = bc["churn_rate_after_breach"]["medium_sensitivity"]
    else:
        cr = bc["churn_rate_after_breach"]["low_sensitivity"]
    reputation = company.active_users * cr * company.arpu * 12

    breakdown = ImpactBreakdown(
        data_breach_cost=round(data_breach, 2),
        incident_response_cost=round(incident, 2),
        downtime_cost=round(downtime, 2),
        regulatory_penalty=round(reg, 2),
        reputation_damage=round(reputation, 2)
    )
    
    total = data_breach + incident + downtime + reg + reputation
    
    # 7. Environment & Exposure Adjustment
    if asset:
        # Heavily discount impact for lower environments
        if asset.environment.lower() in ("dev", "test"):
            total *= 0.01  # 1% residual risk of pivot to prod
            breakdown.data_breach_cost *= 0.01
            breakdown.regulatory_penalty = 0  # No fines for dev data breach usually
            breakdown.reputation_damage = 0
            breakdown.incident_response_cost *= 0.1
        elif asset.environment.lower() == "staging":
            total *= 0.1 # 10% risk (might contain scrubbed prod data or be linked)
            for k in breakdown.dict().keys():
                setattr(breakdown, k, getattr(breakdown, k) * 0.1)

    return breakdown, round(total, 2)
