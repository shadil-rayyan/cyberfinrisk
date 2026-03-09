# VFIE (Vulnerability Financial Impact Engine) — Logic & Edge Cases Covered

This document serves as a comprehensive reference for the core logical flows, architectural decisions, and edge cases we have handled in the development of the VFIE.

---

## 1. Core Engine Logic

The VFIE translates technical security flaws into business language and actuarial financial risk through a multi-stage pipeline:

### A. Scanning & Normalization
- **Repository Ingestion**: The engine temporarily clones a target repository (or accepts manual JSON inputs).
- **Semgrep Analysis**: We run static analysis with custom and standard OWASP rules.
- **Taxonomy Mapping**: Raw `check_ids` (e.g., `javascript.express.security.injection.sqli`) are unified into a standard bug taxonomy (e.g., `SQL_INJECTION`, `XSS`, `IDOR`) to map them to historical breach data and exploit probabilities.

### B. Financial Impact Modeling (`engine/impact_model.py`)
Impact is calculated across five distinct cost pillars, scaled by company context variables:
1. **Data Breach Cost**: `Estimated Stored Records × Cost Per Record (Industry specific)`. Modified by the AI's contextual `data_scope` assessment.
2. **Regulatory Penalties**: 
   - **GDPR**: Modeled as a % of Annual Revenue if `PII` is stored.
   - **PCI DSS / HIPAA**: Flat or capped maximum fines applied if `Financial` or `Health` data is identified.
3. **Reputation & Churn Damage**: Expected customer loss calculated as `Active Users × Churn Rate (based on data sensitivity) × ARPU × 12 months`.
4. **Downtime Cost**: `Estimated downtime hours (by bug type) × Company Downtime Cost / Hour`.
5. **Incident Response**: Fixed baseline costs scaled by Company Size (e.g., Startup vs Mid-Size).

### C. Contextual Exploit Probability
Instead of static CVSS scores, probability is dynamic:
- **Baseline Probability**: Derived from table data (`exploit_probability.json`) mapping Bug Type + Deployment Exposure (Public/Internal/Private).
- **AI Adjustment (Gemini)**: The engine reads ±40 lines of surrounding source code context. The LLM acts as an AppSec engineer, adjusting the baseline probability up or down based on realistic exploitability, identifying constraints like `authentication_required`, and flagging false positives.

### D. Prioritization & Reporting
- **Expected Loss**: `Total Impact × Effective Probability`.
- **Fix Cost**: `Engineer Hourly Cost × Typical Fix Hours (by bug type)`.
- **ROI of Fixing**: `Expected Loss ÷ Fix Cost`.
- **Board Summaries**: The engine dynamically injects these numbers into human-readable, non-technical executive briefs featuring physical analogies and real-world breach precedents.

---

## 2. Edge Cases and Structural Flaws Handled

As the engine scaled to scan real, large open-source repositories, several critical edge cases emerged and have been mitigated:

### A. Vulnerability Noise & Inflation
- **Duplicate Finding Clusters**: Static scanners often flag the same vulnerability signature across 5 consecutive lines.
  - **Fix**: Implemented *Root-Cause Clustering*. The engine groups findings by `rule_id` + `file_path`, reducing 10 repetitive findings into 1 actionable root cause, preventing absurdly inflated risk totals.
- **Non-Production Attack Surfaces**: Scanners flag vulnerabilities in unit tests, documentation, or local scripts.
  - **Fix**: The scanner explicitly filters out paths containing `test/`, `mock/`, `docs/`, `scripts/`, or `.env.example`. Test files do not cause data breaches.

### B. Context and Data Assumptions
- **The "Full Database Dump" Fallacy**: Assuming every SQL injection results in total exposure of all company records.
  - **Fix**: Gemini analyzes the code to define the `data_scope` (`full_database`, `single_user_record`, `none`, `system_files`). The impact model scales the dataset size drastically based on this scope (e.g., an IDOR might only expose 1 record, meaning a 0.0001 multiplier on data breach computations).
- **The Infrastructure / Framework Misattribution**: If a framework (like React or Express) has a security flaw, the *framework maintainer's* liability is completely different from a SaaS company using it.
  - **Fix**: Introduced `system_role` (`saas_product`, `framework`, `infrastructure`). The financial model recognizes that framework maintainers don't hold the PII of their end-users, zeroing out direct data-exfiltration costs while retaining ecosystem reputation damage.
- **Assuming Public Access**: Assuming all internal or admin routes are publicly accessible.
  - **Fix**: The Gemini prompt derives `authentication_required` directly from route paths, namespaces, or middleware in the code context, heavily discounting the payload probability for strictly authenticated or admin-only routes.

### C. Mathematical Accuracy in Reporting
- **Overlapping Risk Duplication**: If Vuln A (Auth Bypass) and Vuln B (SQLi) are part of an attack chain, summing their independent Expected Losses artificially doubles the company's financial exposure.
  - **Fix**: Total Company Exposure dynamically models *Attack Chains*. It groups linked vulnerabilities, applies a combined maximum loss for the chain, and deduplicates those individual losses from the final unchained aggregate.
- **False Precision Delusion**: Presenting the board with figures like "$328,320 Expected Loss". Actuarial technology models risk, not exact accounting statements.
  - **Fix**: Re-wrote UI and CLI outputs to use `fmtRange()`, reporting dynamic bounds (e.g., "$262K – $394K") instead of single-point illusions of precision.
