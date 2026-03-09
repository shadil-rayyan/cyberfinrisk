# Experiment Report: Plausible Analytics
- **Date**: 2026-03-09 04:20:25
- **Source Repo**: [https://github.com/plausible/analytics](https://github.com/plausible/analytics)
- **Branch**: `master`

## 🔍 Scan Metrics
- **Total Raw Findings (Semgrep)**: 6
- **AI-Verified Exploitability Count**: 2
- **AI-Assisted Reduction**: **4** (66.7%)

## 💰 Top Financial Risks (Ranked by ROI)
| Rank | Type | Expected Loss | Priority (EL/Hour) | File |
| :--- | :--- | :--- | :--- | :--- |
| 1 | HARDCODED_CREDENTIALS | $150,070,500.00 | 75,035,250.00 | `Makefile` |
| 2 | SQL_INJECTION | $132,062,040.00 | 22,010,340.00 | `tracker/compiler/analyze-sizes.js (lines 294, 295, 314)` |

## 📝 Executive Summary
=================================================================
  SECURITY RISK EXECUTIVE SUMMARY
  Plausible Analytics — Board / Leadership Review
=================================================================

BOTTOM LINE
  We have 2 distinct grouped security vulnerabilities.
  Total exposure if all exploited:              $960.5M – $1440.7M
  Expected loss (probability-adjusted):         $225.7M – $338.6M
  Total cost to fix everything:                 $880 (8 hours)
  Fixing yields up to $320,605× ROI compared to expected loss.


RISK BREAKDOWN
  🔴 Critical — act this week:   2 vulnerabilities
  🟠 High — act this sprint:     0 vulnerabilities
  🟡 Medium / Low — schedule:    0 vulnerabilities

TOP 3 RISKS BY FINANCIAL EXPOSURE
  #1  Hardcoded Credentials            Expected loss: $120.1M – $180.1M  Fix: 2.0h
  #2  Sql Injection                    Expected loss: $105.6M – $158.5M  Fix: 6.0h

WHAT HAPPENS IF WE DO NOTHING
  Based on breach rates for technology saas products our size, at least one
  of these vulnerabilities is likely to be found and exploited within
  6–18 months if unaddressed.

WHAT WE ARE ASKING FOR
  Approval to allocate 8 engineering hours to address
  the 2 critical and 0 high-priority vulnerabilities.
  Estimated cost: $880.

=================================================================