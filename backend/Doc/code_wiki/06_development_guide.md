# Development & Contribution Guide

This document provides instructions for developers who want to contribute to FinRisk or set up a local development environment for extending the engine.

## 🛠 Tech Stack Deep Dive

- **Backend**: FastAPI (Python 3.11+)
- **Static Analysis**: Semgrep CLI
- **AI**: Google Generative AI (Gemini 1.5 Flash)
- **Data Handling**: Pydantic v2
- **Version Control Integration**: GitPython

## 🏗 Project Layout

```text
finrisk/
├── main.py              # FastAPI application and endpoint definitions
├── engine/              # Core logic modules
│   ├── scanner.py       # Git cloning and Semgrep orchestration
│   ├── classifier.py    # Rule-to-bug-type mapping logic
│   ├── impact_model.py  # Financial impact calculation logic
│   ├── gemini_analyzer.py # AI-powered context analysis
│   └── ...              # Other engine components
├── models/              # Pydantic models for data validation
├── knowledge_base/      # JSON benchmark data
├── static/              # Static assets for the frontend
└── Doc/                 # Project documentation
```

## 🚀 Setting Up for Development

### 1. Prerequisite: Semgrep
FinRisk requires the Semgrep CLI to be installed on your machine.
```bash
pip install semgrep
```

### 2. Local Setup
1. Clone the repo and create a virtual environment:
   ```bash
   git clone https://github.com/shadil-rayyan/finrisk.git
   cd finrisk
   python -m venv venv
   source venv/bin/activate
   ```
2. Install dev dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your `.env` file with a `GEMINI_API_KEY`.

### 3. Running the Dev Server
```bash
uvicorn main:app --reload --port 8000
```
- **API Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Frontend**: `http://localhost:8000/`

## 🧪 Testing the Engine

### Manual Testing
You can use the `/analyze-manual` endpoint to test the risk logic without needing a full GitHub repo. Use the examples in [`Doc/07_test_cases.md`](./07_test_cases.md) for sample payloads.

### Scan Testing
Use a public, small repository for testing the full pipeline:
```json
{
  "repo_url": "https://github.com/basecamp/demo-repo",
  "company": { ... }
}
```

## 🤝 Contribution Guidelines

1. **Bug Classification**: If you find Semgrep rules that aren't being mapped correctly, update `engine/classifier.py` and the `RULE_MAPPING` dictionary.
2. **Impact Models**: To add new regulatory frameworks, update `knowledge_base/regulatory_models.json` and the logic in `engine/impact_model.py`.
3. **AI Prompts**: Improvements to AI analysis should be made in `engine/gemini_analyzer.py` or `engine/attack_chain.py`.

## 📜 Coding Standards
- Use **Type Hints** for all function signatures.
- Ensure all new data structures are defined as **Pydantic Models** in the `models/` directory.
- Follow **PEP 8** style guidelines.
