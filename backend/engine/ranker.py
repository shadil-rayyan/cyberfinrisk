from typing import List
from models.risk_result import RiskResult

def rank_vulnerabilities(results: List[RiskResult]) -> List[RiskResult]:
    return sorted(results, key=lambda r: r.priority_score, reverse=True)
