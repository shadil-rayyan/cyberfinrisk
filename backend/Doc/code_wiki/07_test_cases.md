# VFIE Test Targets — Enriched Company Contexts
Use these JSON contexts to test the Risk Engine for different open-source projects.

## 1. Analytics SaaS: Plausible Analytics
- **GitHub**: https://github.com/plausible/analytics
- **Profile**: Privacy-friendly analytics alternative.

```json
{
  "company_name": "Plausible Analytics",
  "industry": "technology",
  "annual_revenue": 2500000,
  "monthly_revenue": 210000,
  "active_users": 4000,
  "arpu": 50,
  "estimated_records_stored": 20000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 110,
  "estimated_downtime_cost_per_hour": 8000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": ["PII", "credentials"],
  "company_size": "startup",
  "product_description": "Privacy-friendly website analytics platform used as a cookie-less alternative to Google Analytics.",
  "stack_description": "Elixir (Phoenix), PostgreSQL, ClickHouse for large-scale event storage, hosted on DigitalOcean/Fastly."
}
```

## 2. Product Analytics: PostHog
- **GitHub**: https://github.com/PostHog/posthog
- **Profile**: Complete event tracking & session recording platform.

```json
{
  "company_name": "PostHog",
  "industry": "technology",
  "annual_revenue": 15000000,
  "monthly_revenue": 1250000,
  "active_customers": 12000,
  "arpu": 100,
  "estimated_records_stored": 100000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 130,
  "estimated_downtime_cost_per_hour": 40000,
  "regulatory_frameworks": ["GDPR", "CCPA"],
  "sensitive_data_types": ["PII", "credentials"],
  "company_size": "mid_size",
  "product_description": "Open-source product analytics platform that captures user events, session recordings, and feature flags.",
  "stack_description": "Django (Python) backend, React frontend, ClickHouse database, PostHog-owned cloud infrastructure on AWS."
}
```

## 3. Scheduling SaaS: Cal.com
- **GitHub**: https://github.com/calcom/cal.com
- **Profile**: Open-source scheduling infrastructure.

```json
{
  "company_name": "Cal.com",
  "industry": "technology",
  "annual_revenue": 10000000,
  "monthly_revenue": 830000,
  "active_users": 200000,
  "arpu": 12,
  "estimated_records_stored": 50000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 120,
  "estimated_downtime_cost_per_hour": 35000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": ["PII", "credentials"],
  "company_size": "mid_size",
  "product_description": "Open-source scheduling infrastructure that handles meeting bookings, calendar sync, and payment processing for appointments.",
  "stack_description": "Next.js (TypeScript), Prisma ORM, PostgreSQL, TailwindCSS, hosted on Vercel."
}
```

## 4. Search Infra: Meilisearch
- **GitHub**: https://github.com/meilisearch/meilisearch
- **Profile**: Search engine infrastructure for apps.

```json
{
  "company_name": "Meilisearch",
  "industry": "technology",
  "annual_revenue": 8000000,
  "monthly_revenue": 650000,
  "active_customers": 7000,
  "arpu": 90,
  "estimated_records_stored": 120000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 125,
  "estimated_downtime_cost_per_hour": 50000,
  "regulatory_frameworks": ["GDPR"],
  "sensitive_data_types": ["PII", "credentials"],
  "company_size": "mid_size",
  "product_description": "Open-source, lightning-fast search infrastructure allowing developers to index and search millions of documents instantly.",
  "stack_description": "Rust (core engine), HTTP API exposed via Actix, custom storage engine built on LMDB."
}
```

## 5. Backend Platform: Supabase
- **GitHub**: https://github.com/supabase/supabase
- **Profile**: Firebase alternative (DB, Auth, Edge functions).

```json
{
  "company_name": "Supabase",
  "industry": "technology",
  "annual_revenue": 80000000,
  "monthly_revenue": 6500000,
  "developers_using_platform": 1700000,
  "arpu": 25,
  "estimated_records_stored": 300000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 150,
  "estimated_downtime_cost_per_hour": 200000,
  "regulatory_frameworks": ["GDPR", "SOC2"],
  "sensitive_data_types": ["PII", "financial", "credentials"],
  "company_size": "enterprise",
  "product_description": "Open-source Firebase alternative providing Realtime Database, Authentication, and Edge Functions for developers.",
  "stack_description": "PostgreSQL with PostgREST, Go (auth service), Elixir (realtime), hosted on AWS and fly.io."
}
```

## 6. Ecommerce: Spree Commerce
- **GitHub**: https://github.com/spree/spree
- **Profile**: Headless Rails-based ecommerce.

```json
{
  "company_name": "Spree Commerce",
  "industry": "retail",
  "annual_revenue": 25000000,
  "monthly_revenue": 2000000,
  "active_stores": 8000,
  "arpu": 40,
  "estimated_records_stored": 60000000,
  "deployment_exposure": "public",
  "infrastructure_type": "cloud",
  "engineer_hourly_cost": 115,
  "estimated_downtime_cost_per_hour": 90000,
  "regulatory_frameworks": ["PCI_DSS", "GDPR"],
  "sensitive_data_types": ["PII", "financial", "credentials"],
  "company_size": "mid_size",
  "product_description": "Headless e-commerce platform powering thousands of high-volume online storefronts globaly.",
  "stack_description": "Ruby on Rails, PostgreSQL, Redis, custom checkout APIs with PCI-DSS compliance requirements."
}
```