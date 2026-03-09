# VFIE Test Targets — Enriched Company Contexts
Use these JSON contexts to test the Risk Engine for different open-source projects.

## 1. Analytics SaaS: Plausible Analytics
- **GitHub**: https://github.com/plausible/analytics
- **Branch**: master 
- **Profile**: Privacy-friendly analytics alternative.

```json
{
  "company_name": "Plausible Analytics",
  "industry": "technology / web analytics",
  "annual_revenue": 3100000,
  "monthly_revenue": 258000,
  "active_users": 9000,
  "arpu": 29,
  "estimated_records_stored": 173000000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 110,
  "estimated_downtime_cost_per_hour": 8000,
  "regulatory_frameworks": ["GDPR", "CCPA"],
  "sensitive_data_types": ["aggregated analytics data", "site traffic metrics"],
  "company_size": "startup",
  "product_description": "Privacy-focused web analytics platform designed as a lightweight alternative to Google Analytics without cookies or personal tracking.",
  "stack_description": "Elixir (Phoenix framework), PostgreSQL, ClickHouse for event analytics, hosted on cloud infrastructure."
}
```

---

## 1. **E‑Commerce Platform: Spree Commerce**

* **GitHub**: [https://github.com/spree/spree](https://github.com/spree/spree)
* **Branch**: `main`
* **Profile**: Open‑source, API‑first e‑commerce framework supporting multi‑store, multi‑vendor, and headless commerce. ([Wikipedia][1])

```json
{
  "company_name": "Spree Commerce Deployment (Online Retailer)",
  "industry": "retail / e-commerce",
  "annual_revenue": 12000000,
  "monthly_revenue": 1000000,
  "active_users": 60000,
  "arpu": 200,
  "estimated_records_stored": 8000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 130,
  "estimated_downtime_cost_per_hour": 90000,
  "regulatory_frameworks": ["PCI_DSS", "GDPR"],
  "sensitive_data_types": [
    "customer PII",
    "payment data",
    "order history",
    "credentials"
  ],
  "company_size": "mid-size company",
  "product_description": "Headless e-commerce platform powering an online retail storefront.",
  "stack_description": "Ruby on Rails backend with React storefront."
}
```

---

## 2. **Enterprise ERP: ERPNext**

* **GitHub**: [https://github.com/frappe/erpnext](https://github.com/frappe/erpnext)
* **Branch**: `main`
* **Profile**: Full enterprise resource planning (ERP) system covering accounting, CRM, inventories, manufacturing, HR, and more. ([GitHub][2])

```json
{
  "company_name": "ERPNext Deployment (Mid-Size Manufacturing Company)",
  "industry": "manufacturing / enterprise",
  "annual_revenue": 50000000,
  "monthly_revenue": 4200000,
  "active_users": 350,
  "arpu": null,
  "estimated_records_stored": 15000000,
  "deployment_exposure": "internal / vpn",
  "infrastructure_type": "cloud / on-premise",
  "engineer_hourly_cost": 150,
  "estimated_downtime_cost_per_hour": 120000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": [
    "financial records",
    "employee payroll",
    "supplier contracts",
    "inventory data"
  ],
  "company_size": "mid-size enterprise",
  "product_description": "ERP system managing financials, HR, inventory, and supply chain operations.",
  "stack_description": "Python (Frappe framework), MariaDB, JavaScript frontend."
}
```

---

## 3. **Open‑Source Wiki: Gollum**

* **GitHub**: [https://github.com/gollum/gollum](https://github.com/gollum/gollum)
* **Branch**: `master`
* **Profile**: Wiki system powered by Git; used for documentation, knowledge bases, and versioned content. ([Wikipedia][3])

```json
{
  "company_name": "TechCorp Internal Documentation System",
  "industry": "technology / knowledge management",
  "annual_revenue": 15000000,
  "monthly_revenue": 1250000,
  "active_users": 450,
  "arpu": null,
  "estimated_records_stored": 2000000,
  "deployment_exposure": "internal",
  "infrastructure_type": "private cloud",
  "engineer_hourly_cost": 100,
  "estimated_downtime_cost_per_hour": 15000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": [
    "internal documentation",
    "architecture diagrams",
    "engineering procedures"
  ],
  "company_size": "mid-size company",
  "product_description": "Internal Git-based documentation and knowledge management system used by engineering teams.",
  "stack_description": "Ruby backend with Git repository storage."
}
```

---

## 4. **Industrial Machine Learning Library: Infer.NET**

* **GitHub**: [https://github.com/dotnet/infer](https://github.com/dotnet/infer)
* **Branch**: `main`
* **Profile**: Microsoft Research library for probabilistic programming and Bayesian inference — used in AI/ML systems across industries. ([Wikipedia][4])

```json
{
  "company_name": "AI Research Lab ML Platform",
  "industry": "artificial intelligence / research",
  "annual_revenue": 25000000,
  "monthly_revenue": 2100000,
  "active_users": 120,
  "arpu": null,
  "estimated_records_stored": 8000000,
  "deployment_exposure": "internal",
  "infrastructure_type": "research compute cluster",
  "engineer_hourly_cost": 180,
  "estimated_downtime_cost_per_hour": 40000,
  "regulatory_frameworks": [],
  "sensitive_data_types": [
    "machine learning models",
    "training datasets",
    "research experiments"
  ],
  "company_size": "research organization",
  "product_description": "Probabilistic programming library used to develop and run machine learning models for research and product development.",
  "stack_description": "C# / .NET probabilistic programming framework running on research compute infrastructure."
}
```

---

## 5. **Legacy E‑Commerce: osCommerce**

* **GitHub**: [https://github.com/osCommerce/osCommerce-V4](https://github.com/osCommerce/osCommerce-V4)
* **Branch**: `main`
* **Profile**: Classic open‑source e‑commerce store platform widely used in smaller online retail setups. ([Wikipedia][5])

```json
{
  "company_name": "Small Online Retail Store",
  "industry": "retail / e-commerce",
  "annual_revenue": 2500000,
  "monthly_revenue": 210000,
  "active_users": 15000,
  "arpu": 165,
  "estimated_records_stored": 1200000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud hosting",
  "engineer_hourly_cost": 110,
  "estimated_downtime_cost_per_hour": 20000,
  "regulatory_frameworks": ["PCI_DSS", "GDPR"],
  "sensitive_data_types": [
    "customer PII",
    "payment transactions",
    "user credentials"
  ],
  "company_size": "small business",
  "product_description": "Online storefront platform used to sell consumer goods through a web-based retail site.",
  "stack_description": "PHP backend with MySQL database hosted on shared or cloud infrastructure."
}
```


## 1. **Mojaloop — Open Financial Interoperability Platform**

* **GitHub**: [https://github.com/mojaloop/](https://github.com/mojaloop/)
* **Branch**: `main`
* **Profile**: Platform enabling **interoperable digital payments**, designed to facilitate financial inclusion by connecting banks, mobile money providers, and fintechs. Used as a reference implementation for national/region‑wide payments rails. ([Wikipedia][1])

```json
{
  "company_name": "National Digital Payments Network",
  "industry": "financial services / fintech",
  "annual_revenue": 350000000,
  "monthly_revenue": 29000000,
  "active_users": 2000000,
  "arpu": null,
  "estimated_records_stored": 150000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud microservices",
  "engineer_hourly_cost": 140,
  "estimated_downtime_cost_per_hour": 150000,
  "regulatory_frameworks": ["PCI_DSS", "financial payments compliance"],
  "sensitive_data_types": [
    "financial transactions",
    "bank account identifiers",
    "PII"
  ],
  "company_size": "large financial infrastructure",
  "product_description": "Real-time interoperable digital payment platform connecting banks, mobile wallets, and financial institutions.",
  "stack_description": "Node.js and TypeScript microservices with REST APIs for routing, clearing, and settlement."
}
```

---

## 2. **FarmBot — Precision Agriculture Robotics**

* **GitHub Source**: (Repo implied, project originates from [https://github.com/FarmBot](https://github.com/FarmBot))
* **Profile**: **Precision agriculture CNC robot** that automates farming tasks — planting seeds, watering, performing repeatable crop care. Useful for agritech and robotics research. ([Wikipedia][2])

```json
{
  "company_name": "Smart Agriculture Farm Network",
  "industry": "agriculture / automation",
  "annual_revenue": 5000000,
  "monthly_revenue": 420000,
  "active_users": 50,
  "arpu": null,
  "estimated_records_stored": 300000,
  "deployment_exposure": "private farm network",
  "infrastructure_type": "IoT / embedded systems",
  "engineer_hourly_cost": 130,
  "estimated_downtime_cost_per_hour": 4000,
  "regulatory_frameworks": ["agriculture equipment safety"],
  "sensitive_data_types": [
    "crop production data",
    "farm automation schedules",
    "sensor telemetry"
  ],
  "company_size": "agriculture business",
  "product_description": "Autonomous robotic farming platform used to automate crop planting, watering, and monitoring.",
  "stack_description": "Embedded firmware with Raspberry Pi control system and web-based management dashboard."
}
```

---

## 3. **Imhotep Smart Clinic — Healthcare Management System**

* **GitHub**: [https://github.com/topics/open-source-healthcare](https://github.com/topics/open-source-healthcare)
* **Profile**: **Clinic management and medical records platform** that supports patient scheduling, prescriptions, and practice workflows. Suitable for healthtech domain testing. ([GitHub][3])

```json
{
  "company_name": "CityCare Medical Clinic Network",
  "industry": "healthcare",
  "annual_revenue": 18000000,
  "monthly_revenue": 1500000,
  "active_users": 300,
  "arpu": null,
  "estimated_records_stored": 4000000,
  "deployment_exposure": "internal",
  "infrastructure_type": "cloud / on-premise hybrid",
  "engineer_hourly_cost": 150,
  "estimated_downtime_cost_per_hour": 80000,
  "regulatory_frameworks": ["HIPAA", "GDPR"],
  "sensitive_data_types": [
    "patient medical records",
    "prescriptions",
    "insurance information",
    "PII"
  ],
  "company_size": "mid-size healthcare organization",
  "product_description": "Clinic management system handling patient records, appointment scheduling, and clinical workflows.",
  "stack_description": "Django backend with relational database and modern web frontend."
}
```

---

## 4. **OpenMRS — Electronic Medical Records (EMR) Platform**

* **GitHub**: [https://github.com/openmrs](https://github.com/openmrs)
* **Profile**: Widely used **open‑source healthcare EMR/EHR** system for clinical workflows, patient record management, lab results, and health data interoperability. (Directory includes multiple repos.) ([Facile Technolab][4])

```json
{
  "company_name": "OpenMRS Deployment (Regional Hospital Network)",
  "industry": "healthcare",
  "annual_revenue": 90000000,
  "monthly_revenue": 7500000,
  "active_users": 1200,
  "arpu": null,
  "estimated_records_stored": 25000000,
  "deployment_exposure": "internal",
  "infrastructure_type": "on-premise / cloud hybrid",
  "engineer_hourly_cost": 160,
  "estimated_downtime_cost_per_hour": 100000,
  "regulatory_frameworks": ["HIPAA", "GDPR"],
  "sensitive_data_types": [
    "electronic medical records",
    "patient diagnostics",
    "insurance information",
    "PII"
  ],
  "company_size": "large organization",
  "product_description": "Electronic medical record system used by hospitals to manage patient care.",
  "stack_description": "Java backend with REST APIs and modular healthcare services."
}
```

---

## 5. **Ekylibre — Farm & Business Management**

* **GitHub**: (Listed on Awesome agriculture but widely available on GitHub)
* **Profile**: **Farm business and agricultural management** software — tracks production, planning, inventory and farm economics. Good for business/ops domain analysis. ([GitHub][5])

```json
{
  "company_name": "AgriCo Farm Operations Platform",
  "industry": "agriculture / agribusiness",
  "annual_revenue": 12000000,
  "monthly_revenue": 1000000,
  "active_users": 120,
  "arpu": null,
  "estimated_records_stored": 2500000,
  "deployment_exposure": "internal",
  "infrastructure_type": "cloud / on-premise",
  "engineer_hourly_cost": 140,
  "estimated_downtime_cost_per_hour": 30000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": [
    "crop production records",
    "supply chain data",
    "farm financials"
  ],
  "company_size": "mid-size agricultural enterprise",
  "product_description": "Farm management platform tracking production, planning, inventory, and agricultural economics.",
  "stack_description": "Ruby on Rails backend with PostgreSQL and analytics dashboards."
}
```

## 6. **Sarvwigyan — Educational Content Platform**

* **GitHub**: [https://github.com/Sarvwigyan](https://github.com/Sarvwigyan) (example static repo)
* **Profile**: **Open educational content and knowledge portal** with science/tech learning resources — representing edtech and community knowledge systems. ([Wikipedia][6])

```json
{
  "company_name": "OpenScience Education Portal",
  "industry": "education / edtech",
  "annual_revenue": 2000000,
  "monthly_revenue": 165000,
  "active_users": 300000,
  "arpu": 6,
  "estimated_records_stored": 10000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud hosting",
  "engineer_hourly_cost": 90,
  "estimated_downtime_cost_per_hour": 10000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": [
    "user accounts",
    "learning progress",
    "educational content"
  ],
  "company_size": "education platform",
  "product_description": "Online learning portal providing science and technology educational resources.",
  "stack_description": "Static frontend hosted on cloud infrastructure with backend services for user accounts and analytics."
}
```

