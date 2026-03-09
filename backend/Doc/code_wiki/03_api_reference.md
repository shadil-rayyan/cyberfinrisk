# API Reference

The FinRisk API provides endpoints for scanning repositories and performing manual risk analysis. This document details the available endpoints and their request/response schemas.

## 📡 Base URL
The API is available at: `http://localhost:8000/`

---

## 🔍 Endpoints

### 1. Scan Repository
Runs a full Semgrep analysis on a GitHub repository and computes financial risk results.

- **URL**: `/scan-repo`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### **Request Body**
| Key | Type | Description |
| :--- | :--- | :--- |
| `repo_url` | `string` | The full HTTP(S) URL of the GitHub repository. |
| `branch` | `string` | The branch to scan (default: `main`). |
| `company` | `object` | The [Company Context](#company-context-schema). |
| `gemini_api_key` | `string` | (Optional) API key for AI-assisted analysis. |

#### **Response Body (Success)**
```json
{
  "results": [ ... ],
  "attack_chains": [ ... ],
  "executive_summary": "English summary of findings...",
  "total_expected_loss": 1250000.0,
  "total_fix_cost": 4500.0,
  "vulnerability_count": 12,
  "gemini_enabled": true
}
```

---

### 2. Manual Analysis
Computes risk for a list of pre-identified vulnerabilities without running a live scanner. Useful for testing risk modeling.

- **URL**: `/analyze-manual`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### **Request Body**
```json
{
  "vulnerabilities": [
    {
      "id": "V_001",
      "raw_rule_id": "python.sqlalchemy.injection",
      "file": "app/db.py",
      "line": 42,
      "message": "Potential SQL Injection",
      "severity": "CRITICAL",
      "exposure": "PUBLIC"
    }
  ],
  "company": { ... },
  "gemini_api_key": "..."
}
```

---

### 3. Health Check
Returns the current status and version of the engine.

- **URL**: `/health`
- **Method**: `GET`

#### **Response**
```json
{
  "status": "ok",
  "version": "3.0.0"
}
```

---

## 🏢 Data Schemas

### Company Context Schema
```json
{
  "company_name": "string",
  "industry": "finance | healthcare | technology | retail | education",
  "annual_revenue": 1000000.0,
  "active_users": 50000,
  "arpu": 15.0,
  "engineer_hourly_cost": 80.0,
  "infrastructure_type": "cloud | on_prem | hybrid",
  "deployment_exposure": "public | internal | private",
  "sensitive_data_types": ["PII", "financial", "health"],
  "regulatory_frameworks": ["GDPR", "PCI_DSS", "HIPAA", "CCPA"],
  "estimated_records_stored": 100000,
  "company_size": "startup | mid_size | enterprise"
}
```

### Risk Result Schema
```json
{
  "vulnerability_id": "string",
  "bug_type": "string",
  "file": "string",
  "line": 123,
  "severity": "string",
  "exposure": "string",
  "probability_of_exploit": 0.25,
  "impact_breakdown": {
    "data_breach_cost": 100000.0,
    "incident_response_cost": 50000.0,
    "downtime_cost": 25000.0,
    "regulatory_penalty": 10000.0,
    "reputation_damage": 5000.0
  },
  "total_impact": 190000.0,
  "expected_loss": 47500.0,
  "fix_effort_hours": 6.0,
  "priority_score": 7916.67,
  "business_brief": "Plain English explanation..."
}
```
