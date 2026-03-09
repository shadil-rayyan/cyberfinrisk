
1. Why do we need "Company Context"?
Traditional security tools (like Snyk or Checkmarx) tell you how bad a bug is technically. VFIE tells you how expensive it is for your specific business.

Industry (Finance vs. Retail): A data breach in Healthcare costs ~3x more per record than in Retail due to HIPAA regulations. The engine uses your industry to pick the correct "Cost Per Record" multiplier.
Annual Revenue: We need this to calculate Regulatory Fines. For example, GDPR fines are calculated as a percentage (up to 4%) of your Annual Global Turnover.
Active Users & ARPU: If a bug causes 4 hours of Downtime, we calculate exactly how much revenue you lose based on your Average Revenue Per User (ARPU) and how many users couldn't transact.
Sensitive Data Types (PII, Financial): If you store Credit Card numbers, the engine automatically adds PCI-DSS non-compliance fines to the impact report.
2. How the Engine Works (Step-by-Step)
Step 1: The Code Scan
When you provide a repo, the engine clones it and runs Semgrep. This finds technical patterns (e.g., user_input going directly into db.execute()).

Step 2: AI Contextualization (Gemini)
This is where v3 is special. The engine sends the "vulnerable" code snippet to Gemini. Gemini looks at it and asks:

"Is this just a test file?" (If yes, it lowers the priority).
"Does this code actually handle payments?" (If yes, it marks it as a Critical Business Function).
Step 3: Calculating Total Impact (I)
The engine runs your Company Context through its math models: Impact = Breach Cost + Incident Response + Regulatory Fines + Reputation Loss

Without your revenue/industry input, this number would just be a guess.
Step 4: Calculating Expected Loss (EL)
Now it applies the "Risk" factor: Expected Loss = Probability of Exploit × Total Impact

Example: A bug might cause $1M in damage. But if it's on an internal-only server, the chance of exploit is 1%. Your "Expected Loss" (risk cost) is $10,000.
If that same bug is on a public server, the chance might be 20%. Your risk cost jumps to $200,000.
Step 5: Finding Attack Chains
Gemini looks at all the findings together. It might notice that a small "Information Leak" in one file provides the credentials needed to exploit a "SQL Injection" in another. It "chains" these together into a Critical Breach Path.

Summary: The "So What?"
The end result of all this input isn't a technical report for developers—it's a Business Case.

Instead of telling your boss:

"We have a SQL Injection in line 42 of api.py." (Response: "Okay, put it in the backlog.")

You can say:

"We have a 22% chance of losing $1.4M this quarter. Fixing it takes 6 hours and costs $480. We are choosing to carry $1.4M in risk to save $480." (Response: "Fix it now.")

That is why your input is needed—it turns "Security Debt" into "Financial Risk."