# FinRisk: Vulnerability Financial Impact Engine (VFIE)

![FinRisk Header](https://raw.githubusercontent.com/shadil-rayyan/finrisk/main/static/banner.png) <!-- Replace with actual banner if available or remove -->

FinRisk is a powerful security tool designed to translate technical vulnerabilities into actionable business metrics. By combining static analysis (Semgrep) with a sophisticated financial risk model and Gemini AI analysis, FinRisk helps organizations prioritize security efforts based on potential dollar loss and Return on Investment (ROI).

## 🚀 Key Features

- **Automated Scanning**: Clones and scans GitHub repositories using Semgrep security rulesets.
- **Financial Risk Modeling**: Calculates **Expected Loss (EL)** using the formula: `EL = Probability of Exploit × Total Financial Impact`.
- **Comprehensive Impact Analysis**: Breaks down costs into:
  - Data Breach (Industry-adjusted cost per record)
  - Incident Response
  - Operational Downtime
  - Regulatory Penalties (GDPR, PCI DSS, HIPAA, etc.)
  - Reputational Damage (Churn-based)
- **AI-Powered Insights**: Integrates Google Gemini to confirm exploitability, refine probabilities, and provide contextualized remediation advice.
- **ROI Ranking**: Ranks vulnerabilities by priority score (Expected Loss saved per engineering hour).
- **Business Briefings**: Generates plain-English executive summaries and briefings for management.

## 🛠 Tech Stack

- **Backend**: Python 3.11+, FastAPI
- **Analysis Engine**: Semgrep CLI
- **AI Integration**: Google Gemini (generative-ai)
- **Data Models**: Pydantic
- **Development Tools**: GitPython, Uvicorn

## 📋 Prerequisites

- **Python 3.11+**
- **Semgrep CLI**: Installed and available in PATH.
  ```bash
  pip install semgrep
  ```
- **Gemini API Key** (Optional): For advanced AI analysis.

## ⚙️ Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shadil-rayyan/finrisk.git
   cd finrisk
   ```

2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## 🚀 Usage

### Starting the Server
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`. You can access the UI at `http://localhost:8000/`.

### API Endpoints

- **`POST /scan-repo`**: Scans a GitHub repository.
  - Required: `repo_url`, `company` context.
- **`POST /analyze-manual`**: Analyzes specific vulnerability data manually.
- **`GET /health`**: System health check.

### Example Request Body (Company Context)
```json
{
  "company_name": "Acme Corp",
  "industry": "finance",
  "annual_revenue": 10000000,
  "active_users": 50000,
  "arpu": 20,
  "engineer_hourly_cost": 100,
  "infrastructure_type": "cloud",
  "deployment_exposure": "public",
  "sensitive_data_types": ["PII", "financial"],
  "regulatory_frameworks": ["GDPR", "PCI_DSS"],
  "estimated_records_stored": 100000,
  "company_size": "mid_size"
}
```

## 📂 Project Structure

- `main.py`: Entry point for the FastAPI application.
- `engine/`: Core logic for scanning, classification, and risk calculation.
- `models/`: Pydantic data models for company context and vulnerability results.
- `knowledge_base/`: JSON files containing industry benchmarks for probability and costs.
- `Doc/`: Detailed documentation (Architecture, API, Engine details).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
