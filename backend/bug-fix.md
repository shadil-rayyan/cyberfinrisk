

# **FinRisk AI — Brutal, Prioritized Roadmap**

## **Phase 0 — Core Foundation (Ship Fast, Build Trust)**

1. **AI Validation of Scanner Results**

   * Integrate Gemini to validate exploitability.
   * Ensure every finding has `adjusted_probability`.
2. **False Positive Filtering**

   * Automatically filter noise across repos & stacks.
   * Test with multiple real-world codebases.
3. **Structured Output**

   * Produce JSON: `adjusted_probability`, `business_context`, `recommended_fix`.
4. **Executive Summaries**

   * Auto-generate board-level, plain-language summaries.
   * Focus on clarity, not perfection.

---

## **Phase 1 — Asset & Data Awareness (Business-Relevant Risk)**

5. **Asset-to-Business Mapping**

   * Map assets → business function → estimated value.
   * Example: DB → $5M records, Payment API → $500k/day, Auth service → critical.
6. **Data-Type Linkage**

   * Link each asset to handled data: PII, financial, public, sensitive.
7. **Environment & Exposure**

   * Track dev/staging/prod + internal vs internet-facing.
8. **Dynamic Probability Adjustments**

   * Adjust AI scoring (`P`) and Expected Loss (EL) using asset & exposure context.

---

## **Phase 2 — Dynamic Financial Modeling (Board-Level Accuracy)**

9. **Rule-Based Expected Loss**

   * Replace static JSON with AI-driven, configurable model.
   * Inputs:

     * Data classification → base cost
     * Regulatory fines → jurisdiction-aware
     * Reputational impact → traffic + user base
10. **ROI & Priority Scoring**

    * Tie EL to remediation effort: `Priority Score = EL / Fix Hours`.
    * Enables rational, high-ROI prioritization.
11. **Downtime & Operational Loss Modeling**

    * Include downtime per asset type & cost per hour.
    * Can start with defaults; refine over time.

