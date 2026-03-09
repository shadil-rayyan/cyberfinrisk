# Financial Risk Model Details

A core differentiator of FinRisk is its actuarial approach to security. This document details the formulas and logic used to calculate the financial impact of vulnerabilities.

## 🧮 The Core Formula

FinRisk uses the Standard Risk Equation:

$$Expected\ Loss\ (EL) = Probability\ of\ Exploit\ (P) \times Total\ Financial\ Impact\ (I)$$

- **Expected Loss**: The "Actuarial Fair Value" of the risk. It represents how much the vulnerability costs the company, adjusted for the likelihood of it actually happening.
- **Priority Score**: `Expected Loss / Fix Effort (Hours)`. This measures the "Dollar Loss Saved" per engineering hour, allowing for high-ROI prioritization.

---

## 📉 1. Probability of Exploit (P)

The probability is determined by two main factors:

### A. Baseline Probability
A lookup table (`exploit_probability.json`) assigns a baseline `P` based on the **Bug Type** and the **Deployment Exposure**.
- **PUBLIC**: Highest probability (exposed to the open internet).
- **INTERNAL**: Medium probability (exposed to employees or authenticated users).
- **PRIVATE**: Lowest probability (exposed to back-end services only).

*Example: SQL Injection on a **PUBLIC** endpoint has a higher baseline `P` than on an **INTERNAL** endpoint.*

### B. Context & Asset Adjustments (Phase 1)
Instead of a simple "one-size-fits-all" model, probabilities and impact are heavily adjusted by mapping the vulnerability to its specific **Asset** (`AssetContext`):
- **Asset Linkage**: The model automatically detects if a vulnerability resides in a specific asset (e.g. `Payment API` vs `Logging DB`).
- **Environment Override**: A vulnerability's baseline exposure is overwritten by the Asset’s environment setting (e.g., overriding a public `P` to an internal `P` if the asset is strictly internal).
- **Gemini Context**: When Gemini AI analyzes the code, it uses the mapped asset's business value, environment, and handled data to deduce a much more accurate `P` score.

---

## 💰 2. Total Financial Impact (I)

The total impact is the sum of five distinct cost categories:

$$Total\ Impact = Data\ Breach + Incident\ Response + Downtime + Regulatory + Reputation$$

### A. Data Breach Cost
Calculated as: `(Estimated Records × Exposure Factor) × Cost Per Record`.
- **Cost Per Record**: Industry-adjusted (e.g., Healthcare costs more than Retail).
- **Exposure Factor**: Fixed at 20% by default (assuming a significant but not total breach).
- **Asset-Linked Data Types**: If the vulnerability maps to a specific asset, we only measure risk against the *specific data types* handled by that asset (avoiding noise).

### B. Incident Response (IR)
Fixed costs based on **Company Size**:
- **Startup**: ~$30,000
- **Mid-market**: ~$100,000
- **Enterprise**: ~$500,000

### C. Operational Downtime
Calculated as: `Downtime Hours × Cost Per Hour`.
- **Downtime Hours**: Determined by the specific bug type (e.g., RCE causes more downtime than XSS).
- **Cost Per Hour**: Based on the `Asset's Value` ($/hour) if available, falling back to `Company Revenue` benchmarks.

### D. Regulatory Penalties
The engine checks applicable frameworks (e.g., GDPR, PCI-DSS, HIPAA, CCPA) based on industry and sensitive data types:
- **GDPR**: 4% of Annual Revenue (capped at $20M).
- **PCI-DSS**: Average fine of $250,000.
- **HIPAA**: Annual maximum fine of $1.9M.

### E. Reputational Damage (Churn)
Models the loss of customers after a public breach:
- **Formula**: `(Active Users × Churn Rate) × ARPU × 12 months`.
- **Churn Rate**: Varies by data sensitivity (High sensitivity = 10% churn).

---

## 📉 3. Environment & Exposure Scaling

Not all environments face the same risk. Findings are automatically scaled before calculating Priority Scores:
- **Production (`prod`)**: 100% of Expected Loss.
- **Staging (`staging`)**: Scaled down drastically (10%), as it may occasionally contain sanitized production data.
- **Development/Test (`dev`/`test`)**: Scaled effectively to zero (1%) mitigating noise about regulatory fines or customer churn against mock data.

---

## 📈 3. ROI and Priority Scoring

FinRisk helps CISOs decide *what to fix first* by calculating the ROI of remediation:

- **ROI of Fixing**: `Expected Loss / (Fix Effort Hours × Hourly Engineering Cost)`.
- **Priority Score**: `Expected Loss / Fix Effort Hours`.

A vulnerability with an EL of $100,000 that takes 2 hours to fix (Priority Score: 50,000) should always be prioritized over an EL of $200,000 that takes 40 hours to fix (Priority Score: 5,000).
