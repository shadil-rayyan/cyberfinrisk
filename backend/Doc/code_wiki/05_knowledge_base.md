# Knowledge Base: The Risk Intelligence

FinRisk is a data-driven engine. This document details the role of the `knowledge_base/` JSON files and how they can be customized to match your organization's risk profile.

## 📂 Knowledge Base Structure

The `knowledge_base/` directory contains JSON files that define benchmarks for every stage of the risk calculation.

| File | Role | Key Metrics |
| :--- | :--- | :--- |
| `bug_taxonomy.json` | Classification | Data exfiltration potential, fix effort, and categorization. |
| `exploit_probability.json` | Probability (P) | Baseline exploit probability by exposure (Public, Internal, Private). |
| `breach_costs.json` | Financial (I) | Cost per record by industry, incident response costs, and churn rates. |
| `regulatory_models.json` | Regulatory (I) | Formulas for calculating potential fines for GDPR, PCI DSS, and HIPAA. |
| `downtime_estimates.json` | Operational (I) | Estimated operational downtime (in hours) caused by various bug types. |

---

## 🛠 Customizing the Knowledge Base

You can tune the entire risk engine without changing a single line of Python code by editing these files.

### 💳 1. Adjusting Costs (`breach_costs.json`)
If your organization has specialized insurance or higher incident response costs:
- **`incident_response_cost`**: Update the fixed costs based on your size (Startup, Mid-market, Enterprise).
- **`cost_per_record_by_industry`**: Tune the record-level cost if your data is more or less valuable than industry averages.

### 📉 2. Tuning Probabilities (`exploit_probability.json`)
If your internal controls are exceptionally strong:
- **`P` values**: Lower the baseline probabilities for `INTERNAL` or `PRIVATE` exposures.

### 🏢 3. Modeling Regulatory Risk (`regulatory_models.json`)
Update the `fine_percentage_of_arr` or `max_fine_usd` if regulatory environments change.

## 🏗 Data Types & Frameworks

The `CompanyContext` (provided in the API request) maps to the Knowledge Base via keywords:
- **Industries**: `finance`, `healthcare`, `technology`, `retail`, `education`.
- **Sensitive Data**: `PII`, `financial`, `health`, `payment_cards`.
- **Frameworks**: `GDPR`, `PCI_DSS`, `HIPAA`, `CCPA`.

FinRisk uses these mappings to dynamically select the correct cost benchmarks and regulatory fine models during each analysis.
