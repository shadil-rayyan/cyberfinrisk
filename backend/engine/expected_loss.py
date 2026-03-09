def compute_expected_loss(probability: float, total_impact: float) -> float:
    return round(probability * total_impact, 2)

def compute_priority_score(expected_loss: float, fix_effort_hours: float) -> float:
    if fix_effort_hours <= 0: return 0.0
    return round(expected_loss / fix_effort_hours, 2)

def compute_fix_cost(fix_effort_hours: float, engineer_hourly_cost: float) -> float:
    return round(fix_effort_hours * engineer_hourly_cost, 2)

def compute_roi(expected_loss: float, fix_cost: float) -> float:
    if fix_cost <= 0: return 0.0
    return round(expected_loss / fix_cost, 1)
