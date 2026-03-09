# VFIE — Vulnerability Financial Impact Engine (v3.0)
## Complete Project Documentation

### **1. Executive Overview**
The Vulnerability Financial Impact Engine (VFIE) is a full-stack security assessment platform designed to close the communication gap between specialized security engineering and executive leadership.

While traditional vulnerability scanners output "High/Medium/Low" severities, VFIE categorizes vulnerabilities into **Estimated Dollar Loss**, **Priority Scores (ROI of fixing)**, and **Plain English Attack Stories**. With the v3.0 upgrade, it leverages the **Google Gemini Pro (LLM)** to perform deep code-context analysis, drastically reducing false positives and identifying complex **Attack Chains** where multiple low-risk bugs combine into a critical breach path.

---

### **2. Core Architecture**
The system is built as a modular Python-based backend with a lightweight, high-performance Single Page Application (SPA) frontend.

#### **A. Backend (FastAPI)**
- **API Framework**: FastAPI provides the high-performance asynchronous REST endpoints (`/scan-repo`, `/analyze-manual`).
- **Orchestration**: `main.py` coordinates the data flow from cloning a repository to running the scanner, classifier, financial modeler, and AI analyzer.

#### **B. Engine Modules (`vfie/engine/`)**
1.  **Scanner (`scanner.py`)**: Uses GitPython to clone repositories securely into temporary directories and triggers the **Semgrep CLI** for static analysis using specialized security-audit and OWASP rule sets.
2.  **Classifier (`classifier.py`)**: Maps raw Semgrep Rule IDs (e.g., `python.sqlalchemy.security.injection`) to high-level "Bug Types" (e.g., `SQL_INJECTION`) using a keyword-based mapping system.
3.  **Gemini Analyzer (`gemini_analyzer.py`)**: The "Brain" of v3. It sends the vulnerable code context (lines around the finding) to Gemini-1.5-Flash to:
    -   Validate if the vulnerability is truly exploitable (filtering out test files/dead code).
    -   Determine the exact business function of the affected code.
    -   Suggest precise, actionable fix code.
4.  **Attack Chain Detector (`attack_chain.py`)**: Analyzes the *set* of vulnerabilities found in a repo and uses LLM reasoning to find sequences that can be chained (e.g., XSS -> Authentication Bypass -> Data Exfiltration).
5.  **Financial Impact Modeler (`impact_model.py` & `expected_loss.py`)**: Performs recursive math based on the `CompanyContext` (Revenue, Industry, Users) and `Knowledge Base` constants to calculate total potential impact.

#### **C. Frontend (`vfie/frontend/`)**
- **Dashboard**: A premium CSS-based SPA (`index.html`) that provides real-time progress indicators, animated dollar-loss charts, and interactive vulnerability cards.
- **Manual Mode**: Allows users to input findings manually to test the financial modeling without a full codebase scan.

---

### **3. The Financial Modeling Logic**
The engine uses an **actuarial approach** to represent security risk as a carrying cost.

#### **A. The Probability Variable (P)**
- **Baseline**: Industry-default probabilities based on bug type and exposure (Public vs. Private).
- **AI-Adjusted**: Gemini adjusts the probability based on real factors (e.g., "This input is directly user-controllable from a public API endpoint" increases P).

#### **B. The Impact Variable (I)**
Calculated as: `Data Breach Cost + Incident Response + Downtime + Regulatory Fines + Reputation Damage`.
-   **Data Breach**: `(Estimated Records * Exposure Factor) * Cost Per Record (Industry-Specific)`.
-   **Regulatory**: Automated fine calculation for frameworks like GDPR (4% ARR), PCI-DSS, and HIPAA.
-   **Reputation**: Churn rate modeling (Lost Users * ARPU * 12 Months).

#### **C. Expected Loss (EL)**
`Expected Loss = Probability (P) * Total Impact (I)`
This is the single most important number for a CISO/CEO. It represents the "Actuarial Fair Value" of the risk.

#### **D. Priority Score & ROI**
-   **Priority Score**: `Expected Loss / Fix Effort (Hours)`.
-   **ROI**: `Expected Loss / Cost of Engineer Time`.

---

### **4. AI Logic & Prompting Strategy**
VFIE v3 uses a sophisticated multi-stage prompting strategy for Gemini:
1.  **Vulnerability Triage**: Gemini is provided with the `CompanyContext` and the specific code context. It is instructed to reject findings that are non-exploitable (e.g., in `tests/` or using hardcoded mock data).
2.  **Attack Narratives**: The LLM translates technical scanner messages into "Attack Stories" provided in the `business_brief`.
3.  **Chain Discovery**: The engine provides a summarized JSON of ALL findings to the LLM and asks: "Which of these, if exploited in sequence, lead to a greater failure than individual parts?"

---

### **5. Knowledge Base Structure (`vfie/knowledge_base/`)**
The engine is "data-driven" and can be tuned without changing code:
-   `bug_taxonomy.json`: Defines fix effort (hours) and whether a bug causes data exfiltration.
-   `breach_costs.json`: Contains industry-standard costs (e.g., Healthcare data is more expensive than Retail).
-   `regulatory_models.json`: Holds the logic for global fine calculations.
-   `attack_stories.json`: Maps technical terms to real-world analogies (e.g., SQLi = "unlocked filing cabinet in a lobby").

---

### **6. Setup & Prerequisites**
1.  **Python 3.11+**
2.  **Semgrep CLI**: Must be installed on the system path (`pip install semgrep`).
3.  **Git**: Required for cloning repositories.
4.  **Google Gemini API Key**: Required for AI-assisted reasoning and attack chains.

#### **Installation**
```bash
# Clone and enter repo
git clone https://github.com/shadil-rayyan/finrisk.git && cd finrisk/vfie

# Install dependencies
pip install fastapi uvicorn semgrep gitpython httpx pydantic google-generativeai

# Run Server
uvicorn main:app --reload --port 8000
```

---

### **7. Security & Limitations**
-   **Read-Only**: The engine performs static analysis and never executes the code it scans.
-   **Estimation**: Financial figures are order-of-magnitude estimates for prioritization, not legal guarantees.
-   **Context Depth**: Gemini analysis is limited to the ~80 lines of code provided per finding (context window optimization).

---
*VFIE v3.0 Documentation — Built for Strategic Security Decision-Making.*
