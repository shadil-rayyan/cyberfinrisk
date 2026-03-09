
V
Vulnerability Business Impact Engine
v3.0
Turn security bugs into financial decisions
🔍 Scan Repository
📋 Manual Input
Quick JSON Import
Paste Company JSON
Company Context
Company Name
Industry
Company Size
Annual Revenue (USD)
Monthly Revenue (USD)
Active Users
Avg Revenue per User / Month
Engineer Hourly Cost (USD)
Records Stored
Deployment Exposure
Downtime Cost / Hour (USD)
Sensitive Data Types
PII
Financial
Health
Credentials
Regulatory Frameworks
GDPR
PCI DSS
HIPAA
CCPA
Product Description (helps AI understand business context)
Tech Stack (helps AI assess real exploitability)
Repository Scan
GitHub Repository URL
Branch
AI Analysis (Gemini)
Enable Gemini AI Analysis
Assesses real exploitability + finds attack chains
Gemini API Key (free at aistudio.google.com)
With AI enabled, the engine will:
• Read actual code context to filter false positives
• Adjust exploit probability based on real code patterns
• Understand what each endpoint actually does
• Find attack chains across multiple vulnerabilities
• Generate specific fix code for each vulnerability
What Happens Next
1. Repository is cloned and scanned with Semgrep
2. Each finding is classified and financially modeled
3. Gemini analyzes actual code to filter false positives
4. Results ranked by expected dollar loss
5. Executive brief generated per vulnerability
6. Board-level summary produced
Risk Assessment — Plausible Analytics ✦ AI Analyzed
$810.4M
Total Expected Loss
$4K
Total Fix Cost
230222×
ROI of Fixing Everything
6
Vulnerabilities Found
6
Critical This Sprint
0
Attack Chains
Board Summary
=================================================================
  SECURITY RISK EXECUTIVE SUMMARY
  Plausible Analytics — Board / Leadership Review
=================================================================

BOTTOM LINE
  We have 6 known security vulnerabilities.
  Total exposure if all exploited:              $3601.7M
  Expected loss (probability-adjusted):        $810.4M
  Total cost to fix everything:                $3,520 (32 hours)
  Fixing costs 230221× less than the expected loss of not fixing.


RISK BREAKDOWN
  🔴 Critical — act this week:   6 vulnerabilities
  🟠 High — act this sprint:     0 vulnerabilities
  🟡 Medium / Low — schedule:    0 vulnerabilities

TOP 3 RISKS BY FINANCIAL EXPOSURE
  #1  Hardcoded Credentials            Expected loss: $150.1M       Fix: 2.0h
  #2  Sql Injection                    Expected loss: $132.1M       Fix: 6.0h
  #3  Sql Injection                    Expected loss: $132.1M       Fix: 6.0h

WHAT HAPPENS IF WE DO NOTHING
  Based on breach rates for technology companies our size, at least one
  of these vulnerabilities is likely to be found and exploited within
  6–18 months if unaddressed.

WHAT WE ARE ASKING FOR
  Approval to allocate 32 engineering hours to address
  the 6 critical and 0 high-priority vulnerabilities.
  Estimated cost: $3,520.

=================================================================
Vulnerabilities — Ranked by Financial Priority
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/Makefile, line 83
=================================================================

WHAT IS BROKEN (plain English)
  Like printing your house keys on your business card.
  Technical name: Hardcoded Credentials
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Our source code contains an API key or password written directly in the code.
  Step 2: Automated bots scan GitHub, npm, and public repositories constantly for credential patterns. Discovery often happens within hours of exposure.
  Step 3: Attacker uses the credential to authenticate as us — with full system permissions.
  Step 4: They read all data, move money, delete records, or install backdoors. The breach may go undetected for months because they appear as a legitimate user.

  Attacker effort required: extremely low — bots scan public code repositories 24/7 for exactly this
  How hard to detect:       very hard — looks like legitimate access in logs
  Real-world precedent:     Toyota (2023) — a hardcoded key in code pushed to GitHub exposed 2.15 million customers' vehicle data for 5 years before discovery.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 25%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $150.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  2.0 hours
  Salary cost:    $220
  ROI of fixing:  682138× — every $1 spent saves $682138 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Suffers Breach After API Keys Found Exposed in Source Code"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$150.1M
Expected Loss
$220
Fix Cost (2h)
682138.6×
ROI of Fixing
25%
Exploit Probability
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/tracker/compiler/analyze-sizes.js, line 294
=================================================================

WHAT IS BROKEN (plain English)
  Like leaving your filing cabinet unlocked in a public lobby. Anyone walking past can take everything inside.
  Technical name: Sql Injection
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker discovers our payment API using automated scanning tools (Shodan, Google dorks). Thousands of APIs are scanned this way every day.
  Step 2: They send a crafted request that tricks our database into returning all records instead of just one. No password required. A free tool does this automatically.
  Step 3: In minutes, they download all 20,000,000 customer records including customer personal information and login credentials.
  Step 4: We do not know this happened. They sell the data on dark web markets, use it for fraud, or contact us with a ransom demand.

  Attacker effort required: low — automated tools find and exploit this in under an hour
  How hard to detect:       hard — SQL injection attacks leave no obvious trace in standard logs
  Real-world precedent:     Heartland Payment Systems — SQL injection through a single web form stole 130 million credit card numbers. $140M in settlements. Stock dropped 77%.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 22%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $132.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  6.0 hours
  Salary cost:    $660
  ROI of fixing:  200094× — every $1 spent saves $200094 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Exposes 20,000,000 Customer Records in SQL Injection Attack"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$132.1M
Expected Loss
$660
Fix Cost (6h)
200094×
ROI of Fixing
22%
Exploit Probability
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/tracker/compiler/analyze-sizes.js, line 294
=================================================================

WHAT IS BROKEN (plain English)
  Like leaving your filing cabinet unlocked in a public lobby. Anyone walking past can take everything inside.
  Technical name: Sql Injection
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker discovers our payment API using automated scanning tools (Shodan, Google dorks). Thousands of APIs are scanned this way every day.
  Step 2: They send a crafted request that tricks our database into returning all records instead of just one. No password required. A free tool does this automatically.
  Step 3: In minutes, they download all 20,000,000 customer records including customer personal information and login credentials.
  Step 4: We do not know this happened. They sell the data on dark web markets, use it for fraud, or contact us with a ransom demand.

  Attacker effort required: low — automated tools find and exploit this in under an hour
  How hard to detect:       hard — SQL injection attacks leave no obvious trace in standard logs
  Real-world precedent:     Heartland Payment Systems — SQL injection through a single web form stole 130 million credit card numbers. $140M in settlements. Stock dropped 77%.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 22%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $132.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  6.0 hours
  Salary cost:    $660
  ROI of fixing:  200094× — every $1 spent saves $200094 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Exposes 20,000,000 Customer Records in SQL Injection Attack"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$132.1M
Expected Loss
$660
Fix Cost (6h)
200094×
ROI of Fixing
22%
Exploit Probability
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/tracker/compiler/analyze-sizes.js, line 295
=================================================================

WHAT IS BROKEN (plain English)
  Like leaving your filing cabinet unlocked in a public lobby. Anyone walking past can take everything inside.
  Technical name: Sql Injection
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker discovers our payment API using automated scanning tools (Shodan, Google dorks). Thousands of APIs are scanned this way every day.
  Step 2: They send a crafted request that tricks our database into returning all records instead of just one. No password required. A free tool does this automatically.
  Step 3: In minutes, they download all 20,000,000 customer records including customer personal information and login credentials.
  Step 4: We do not know this happened. They sell the data on dark web markets, use it for fraud, or contact us with a ransom demand.

  Attacker effort required: low — automated tools find and exploit this in under an hour
  How hard to detect:       hard — SQL injection attacks leave no obvious trace in standard logs
  Real-world precedent:     Heartland Payment Systems — SQL injection through a single web form stole 130 million credit card numbers. $140M in settlements. Stock dropped 77%.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 22%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $132.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  6.0 hours
  Salary cost:    $660
  ROI of fixing:  200094× — every $1 spent saves $200094 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Exposes 20,000,000 Customer Records in SQL Injection Attack"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$132.1M
Expected Loss
$660
Fix Cost (6h)
200094×
ROI of Fixing
22%
Exploit Probability
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/tracker/compiler/analyze-sizes.js, line 295
=================================================================

WHAT IS BROKEN (plain English)
  Like leaving your filing cabinet unlocked in a public lobby. Anyone walking past can take everything inside.
  Technical name: Sql Injection
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker discovers our payment API using automated scanning tools (Shodan, Google dorks). Thousands of APIs are scanned this way every day.
  Step 2: They send a crafted request that tricks our database into returning all records instead of just one. No password required. A free tool does this automatically.
  Step 3: In minutes, they download all 20,000,000 customer records including customer personal information and login credentials.
  Step 4: We do not know this happened. They sell the data on dark web markets, use it for fraud, or contact us with a ransom demand.

  Attacker effort required: low — automated tools find and exploit this in under an hour
  How hard to detect:       hard — SQL injection attacks leave no obvious trace in standard logs
  Real-world precedent:     Heartland Payment Systems — SQL injection through a single web form stole 130 million credit card numbers. $140M in settlements. Stock dropped 77%.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 22%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $132.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  6.0 hours
  Salary cost:    $660
  ROI of fixing:  200094× — every $1 spent saves $200094 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Exposes 20,000,000 Customer Records in SQL Injection Attack"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$132.1M
Expected Loss
$660
Fix Cost (6h)
200094×
ROI of Fixing
22%
Exploit Probability
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmpel53a65o/tracker/compiler/analyze-sizes.js, line 314
=================================================================

WHAT IS BROKEN (plain English)
  Like leaving your filing cabinet unlocked in a public lobby. Anyone walking past can take everything inside.
  Technical name: Sql Injection
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker discovers our payment API using automated scanning tools (Shodan, Google dorks). Thousands of APIs are scanned this way every day.
  Step 2: They send a crafted request that tricks our database into returning all records instead of just one. No password required. A free tool does this automatically.
  Step 3: In minutes, they download all 20,000,000 customer records including customer personal information and login credentials.
  Step 4: We do not know this happened. They sell the data on dark web markets, use it for fraud, or contact us with a ransom demand.

  Attacker effort required: low — automated tools find and exploit this in under an hour
  How hard to detect:       hard — SQL injection attacks leave no obvious trace in standard logs
  Real-world precedent:     Heartland Payment Systems — SQL injection through a single web form stole 130 million credit card numbers. $140M in settlements. Stock dropped 77%.

WHAT THIS COSTS PLAUSIBLE ANALYTICS IF NOT FIXED
  Customer data breach cost:                 $600.0M
  Regulatory fines (GDPR):                   $100,000
  Lost customers (estimated churn):          $120,000
  Incident response + legal:                 $30,000
  System downtime cost:                      $32,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $600.3M

  Probability of exploitation: 22%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $132.1M
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  6.0 hours
  Salary cost:    $660
  ROI of fixing:  200094× — every $1 spent saves $200094 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Plausible Analytics Exposes 20,000,000 Customer Records in SQL Injection Attack"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$132.1M
Expected Loss
$660
Fix Cost (6h)
200094×
ROI of Fixing
22%
Exploit Probability
