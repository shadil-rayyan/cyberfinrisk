
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
Risk Assessment — Spree Commerce ✦ AI Analyzed
$1629.6M
Total Expected Loss
$13K
Total Fix Cost
127661×
ROI of Fixing Everything
22
Vulnerabilities Found
21
Critical This Sprint
0
Attack Chains
Board Summary
=================================================================
  SECURITY RISK EXECUTIVE SUMMARY
  Spree Commerce — Board / Leadership Review
=================================================================

BOTTOM LINE
  We have 22 known security vulnerabilities.
  Total exposure if all exploited:              $9402.2M
  Expected loss (probability-adjusted):        $1629.6M
  Total cost to fix everything:                $12,765 (111 hours)
  Fixing costs 127661× less than the expected loss of not fixing.


RISK BREAKDOWN
  🔴 Critical — act this week:   21 vulnerabilities
  🟠 High — act this sprint:     1 vulnerability
  🟡 Medium / Low — schedule:    0 vulnerabilities

TOP 3 RISKS BY FINANCIAL EXPOSURE
  #1  Idor                             Expected loss: $312.4M       Fix: 5.0h
  #2  Idor                             Expected loss: $312.4M       Fix: 5.0h
  #3  Sql Injection                    Expected loss: $343.7M       Fix: 6.0h

WHAT HAPPENS IF WE DO NOTHING
  Based on breach rates for retail companies our size, at least one
  of these vulnerabilities is likely to be found and exploited within
  6–18 months if unaddressed.

WHAT WE ARE ASKING FOR
  Approval to allocate 111 engineering hours to address
  the 21 critical and 1 high-priority vulnerabilities.
  Estimated cost: $12,765.

=================================================================
Vulnerabilities — Ranked by Financial Priority
=================================================================
  🔴 CRITICAL BUSINESS RISK
  Requires decision this week
  Location: /tmp/tmp9y3agxj6/spree/admin/app/controllers/spree/admin/users_controller.rb, line 59
=================================================================

WHAT IS BROKEN (plain English)
  Someone slips a listening device into an envelope. When you open it, it starts recording everything in the room.
  Technical name: Xss
  Accessible from: The public internet

HOW A REAL BREACH HAPPENS — STEP BY STEP
  Step 1: Attacker crafts a malicious link containing hidden code and sends it to our customers via email or social media.
  Step 2: When a logged-in customer clicks the link, the malicious script runs silently in their browser.
  Step 3: The script steals their session token — functionally equivalent to their password — and sends it to the attacker.
  Step 4: Attacker logs in as the customer without needing their password. Customer has no idea this happened.

  Attacker effort required: medium — requires crafting malicious links and targeting users
  How hard to detect:       hard — runs inside user browsers, invisible to server logs
  Real-world precedent:     British Airways (2018) — XSS-related attack injected a script into the payment page. 500,000 customers had card details stolen in real time. £20M ICO fine.

WHAT THIS COSTS SPREE COMMERCE IF NOT FIXED
  Regulatory fines (GDPR/PCI_DSS):           $1.2M
  Lost customers (estimated churn):          $384,000
  Incident response + legal:                 $100,000
  System downtime cost:                      $90,000
  ───────────────────────────────────────────────────────
  TOTAL POTENTIAL LOSS:                      $1.8M

  Probability of exploitation: 18%
  (Based on industry data for this exposure level)

  EXPECTED LOSS (probability × impact): $328,320
  This is the actuarial cost of carrying this risk unresolved.

WHAT THE FIX COSTS
  Engineer time:  3.0 hours
  Salary cost:    $345
  ROI of fixing:  951× — every $1 spent saves $951 in expected loss.

WHAT THE PRESS WOULD WRITE IF THIS IS EXPLOITED
  "Spree Commerce Customer Accounts Hijacked via Website Security Flaw"

DECISION REQUIRED
  Fix immediately — this sprint, not next.
  → Approve fix this sprint?   [ YES / NO ]
  → Accept risk and delay?     [ YES — requires written sign-off / NO ]
=================================================================
$328K
Expected Loss
$345
Fix Cost (3h)
951.7×
ROI of Fixing
18%
Exploit Probability
