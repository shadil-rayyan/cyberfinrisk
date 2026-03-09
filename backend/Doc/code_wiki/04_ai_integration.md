# AI Integration: The Power of Gemini

FinRisk integrates **Google Gemini 1.5 Flash** to transform raw vulnerability scan data into high-quality security intelligence. This document describes the role of AI in the system.

## 🤖 The Role of AI

Traditional vulnerability scanners (like Semgrep) are powerful but often report findings that are mathematically possible but practically non-exploitable (False Positives). Gemini solves this by:
1.  **Validating Exploitability**: Confirming if the code logic actually allows for exploitation.
2.  **Context Alignment**: Understanding the *business purpose* of the code.
3.  **Risk Calibration**: Adjusting probabilities based on real attack paths.
4.  **Remediation Mapping**: Providing code-level fixes that fit the context.

## ⚙️ Core AI Workflows

### 1. Vulnerability Context Analysis (`engine/gemini_analyzer.py`)
For every finding where code context is available, Gemini performs a deep-dive analysis.
- **Prompt Stage**: Gemini receives the vulnerable code (80+ lines), company industry, and the scanner finding.
- **Analysis Stage**: It determines:
  - Is it a high-confidence exploit?
  - Does it require authentication?
  - What is the data scope (full DB vs single record)?
- **Output Stage**: It returns a structured JSON result that directly feeds into the risk engine.

### 2. Attack Chain Discovery (`engine/attack_chain.py`)
The most advanced feature of FinRisk is identifying sequences of vulnerabilities.
- **The Concept**: A "Medium" severity XSS and an "Internal" SQL injection might be harmless on their own but together could lead to full Data Exfiltration.
- **The Workflow**: The engine sends a summary of ALL findings to Gemini and asks: "Which of these vulnerabilities can be combined to bypass secondary controls?".
- **The Result**: A set of logical `Attack Chains` with a combined (higher) impact score.

### 3. Business Briefings (`engine/business_brief.py`)
AI translates technical jargon (e.g., "CWE-89") into language that a CEO or Board Member can understand.
- **Narratives**: It frames the risk in terms of real-world impact (e.g., "This vulnerability could allow an attacker to view the credit card details of all users in Germany").
- **Executive Summaries**: It compiles all findings into a concise, 2-paragraph summary of the company's overall security posture.

## 🛠 Configuration

To enable AI features, you must provide a `GEMINI_API_KEY`:
- **API Request**: Send the key in the `gemini_api_key` field.
- **Environment Variable**: Set `GEMINI_API_KEY` in your `.env` file.

## 📊 AI-Driven Metrics

When Gemini is enabled, the following fields are enriched:
- **`adjusted_probability`**: Replaces the baseline probability for higher accuracy.
- **`false_positive_likelihood`**: Helps triage noise.
- **`recommended_fix`**: Provides specific, actionable code snippets.
- **`business_context`**: Explains *why* this piece of code matters to the business.
