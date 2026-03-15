// ─── FinRisk Mock Data ────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Severity = "low" | "medium" | "high" | "critical";

// ── Projects ──────────────────────────────────────────────────────────────────

export interface Project {
    id: string;
    name: string;
    repoUrl: string;
    lastScan: string;
    risk: RiskLevel;
    vulnerabilities: number;
    estimatedLoss: number;
    language: string;
    branch: string;
}

export const PROJECTS: Project[] = [
    {
        id: "1",
        name: "Payment API",
        repoUrl: "github.com/acme/payment-api",
        lastScan: "2 hours ago",
        risk: "critical",
        vulnerabilities: 14,
        estimatedLoss: 2_400_000,
        language: "Python",
        branch: "main",
    },
    {
        id: "2",
        name: "Auth Service",
        repoUrl: "github.com/acme/auth-service",
        lastScan: "5 hours ago",
        risk: "high",
        vulnerabilities: 8,
        estimatedLoss: 980_000,
        language: "TypeScript",
        branch: "main",
    },
    {
        id: "3",
        name: "Data Pipeline",
        repoUrl: "github.com/acme/data-pipeline",
        lastScan: "1 day ago",
        risk: "medium",
        vulnerabilities: 3,
        estimatedLoss: 120_000,
        language: "Go",
        branch: "develop",
    },
    {
        id: "4",
        name: "Admin Dashboard",
        repoUrl: "github.com/acme/admin-ui",
        lastScan: "3 days ago",
        risk: "low",
        vulnerabilities: 1,
        estimatedLoss: 18_000,
        language: "TypeScript",
        branch: "main",
    },
    {
        id: "5",
        name: "Reporting Engine",
        repoUrl: "github.com/acme/reporting",
        lastScan: "6 hours ago",
        risk: "high",
        vulnerabilities: 6,
        estimatedLoss: 540_000,
        language: "Java",
        branch: "main",
    },
    {
        id: "6",
        name: "Notification Service",
        repoUrl: "github.com/acme/notifications",
        lastScan: "12 hours ago",
        risk: "medium",
        vulnerabilities: 2,
        estimatedLoss: 65_000,
        language: "Python",
        branch: "main",
    },
];

// ── Vulnerabilities ───────────────────────────────────────────────────────────

export interface Vulnerability {
    id: string;
    title: string;
    file: string;
    line: number;
    severity: Severity;
    type: string;
    expectedLoss: number;
    fixCost: number;
    roi: number;
    description: string;
    suggestedFix: string;
    codeSnippet: string;
}

export const VULNERABILITIES: Vulnerability[] = [
    {
        id: "v1",
        title: "SQL Injection",
        file: "auth/login.py",
        line: 42,
        severity: "critical",
        type: "Injection",
        expectedLoss: 480_000,
        fixCost: 3_200,
        roi: 150,
        description:
            "User-controlled input is directly interpolated into a SQL query without parameterization. An attacker can extract the entire database or modify records.",
        suggestedFix:
            "Replace string interpolation with parameterized queries using cursor.execute(query, params).",
        codeSnippet: `# BEFORE (vulnerable)
query = f"SELECT * FROM users WHERE email = '{email}'"
cursor.execute(query)

# AFTER (safe)
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))`,
    },
    {
        id: "v2",
        title: "Insecure Direct Object Reference",
        file: "api/accounts.py",
        line: 118,
        severity: "high",
        type: "Access Control",
        expectedLoss: 320_000,
        fixCost: 1_800,
        roi: 177,
        description:
            "The endpoint returns account data based solely on a user-supplied account_id without verifying ownership.",
        suggestedFix:
            "Add ownership check: ensure the requesting user's id matches the account owner before returning data.",
        codeSnippet: `# BEFORE (vulnerable)
def get_account(account_id):
    return Account.get(account_id)

# AFTER (safe)
def get_account(account_id, current_user):
    account = Account.get(account_id)
    if account.owner_id != current_user.id:
        raise PermissionError("Access denied")
    return account`,
    },
    {
        id: "v3",
        title: "Hardcoded Secret Key",
        file: "config/settings.py",
        line: 7,
        severity: "critical",
        type: "Secret Exposure",
        expectedLoss: 900_000,
        fixCost: 400,
        roi: 2250,
        description:
            "A private API key is hardcoded in source code and committed to the repository, exposing it to anyone with repo access.",
        suggestedFix: "Move secrets to environment variables and use a secrets manager like AWS Secrets Manager or HashiCorp Vault.",
        codeSnippet: `# BEFORE (vulnerable)
STRIPE_SECRET = "sk_live_aBcD1234..."

# AFTER (safe)
import os
STRIPE_SECRET = os.environ["STRIPE_SECRET_KEY"]`,
    },
    {
        id: "v4",
        title: "Cross-Site Scripting (XSS)",
        file: "templates/dashboard.html",
        line: 89,
        severity: "high",
        type: "Injection",
        expectedLoss: 180_000,
        fixCost: 900,
        roi: 200,
        description:
            "User-supplied data is rendered without escaping into the HTML template, allowing script injection.",
        suggestedFix: "Use the template engine's built-in auto-escaping or explicitly escape output with html.escape().",
        codeSnippet: `# BEFORE (vulnerable)
return f"<p>Hello {username}</p>"

# AFTER (safe)
import html
return f"<p>Hello {html.escape(username)}</p>"`,
    },
    {
        id: "v5",
        title: "Missing Rate Limiting",
        file: "api/auth.py",
        line: 201,
        severity: "medium",
        type: "Brute Force",
        expectedLoss: 95_000,
        fixCost: 1_600,
        roi: 59,
        description:
            "The login endpoint has no rate limiting, allowing automated brute-force attacks against user accounts.",
        suggestedFix: "Add rate limiting middleware (e.g. Flask-Limiter) with a limit of 5 attempts per minute per IP.",
        codeSnippet: `from flask_limiter import Limiter

limiter = Limiter(app, key_func=get_remote_address)

@app.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    ...`,
    },
    {
        id: "v6",
        title: "Unvalidated Redirect",
        file: "api/oauth.py",
        line: 55,
        severity: "medium",
        type: "Open Redirect",
        expectedLoss: 45_000,
        fixCost: 600,
        roi: 75,
        description:
            "The redirect_uri parameter is not validated against an allowlist, enabling open redirect attacks.",
        suggestedFix: "Validate redirect_uri against a hardcoded allowlist of trusted domains.",
        codeSnippet: `ALLOWED_REDIRECTS = ["https://app.acme.com/callback"]

def validate_redirect(uri):
    if uri not in ALLOWED_REDIRECTS:
        raise ValueError("Unauthorized redirect URI")`,
    },
];

// ── Dashboard metrics ─────────────────────────────────────────────────────────

export const DASHBOARD_METRICS = {
    totalProjects: 6,
    totalVulnerabilities: 34,
    estimatedFinancialRisk: 4_120_000,
    lastScanTime: "2 hours ago",
    criticalCount: 9,
    highCount: 14,
    mediumCount: 8,
    lowCount: 3,
};

// ── Risk by type (bar chart) ──────────────────────────────────────────────────

export const RISK_BY_TYPE = [
    { name: "Injection", count: 8, loss: 660_000 },
    { name: "Access Control", count: 7, loss: 320_000 },
    { name: "Secret Exposure", count: 4, loss: 900_000 },
    { name: "Brute Force", count: 5, loss: 95_000 },
    { name: "Open Redirect", count: 3, loss: 45_000 },
    { name: "XSS", count: 4, loss: 180_000 },
    { name: "SSRF", count: 3, loss: 210_000 },
];

// ── Loss over time (area chart) ───────────────────────────────────────────────

export const LOSS_OVER_TIME = [
    { month: "Sep", loss: 120_000 },
    { month: "Oct", loss: 340_000 },
    { month: "Nov", loss: 280_000 },
    { month: "Dec", loss: 540_000 },
    { month: "Jan", loss: 890_000 },
    { month: "Feb", loss: 1_200_000 },
    { month: "Mar", loss: 4_120_000 },
];

// ── Report charts ─────────────────────────────────────────────────────────────

export const BREACH_COST = [
    { name: "Data Exfiltration", value: 1_800_000 },
    { name: "Downtime", value: 640_000 },
    { name: "Legal / Compliance", value: 980_000 },
    { name: "Reputational", value: 420_000 },
    { name: "Incident Response", value: 280_000 },
];

export const DOWNTIME_ESTIMATE = [
    { scenario: "Minor", hours: 2, cost: 24_000 },
    { scenario: "Moderate", hours: 8, cost: 96_000 },
    { scenario: "Major", hours: 24, cost: 288_000 },
    { scenario: "Full Breach", hours: 72, cost: 864_000 },
];

export const COMPLIANCE_FINES = [
    { regulation: "GDPR", fine: 420_000 },
    { regulation: "PCI DSS", fine: 250_000 },
    { regulation: "HIPAA", fine: 180_000 },
    { regulation: "CCPA", fine: 75_000 },
];

// ── Organizations & Teams ─────────────────────────────────────────────────────

export interface OrgTeam {
    id: string;
    name: string;
}

export interface OrgGroup {
    id: string;
    name: string;
    teams: OrgTeam[];
}

export interface Tenant {
    id: string;
    name: string;
    plan: string;
    groups: OrgGroup[];
}

export const TENANTS: Tenant[] = [
    {
        id: "tenant-personal",
        name: "Personal",
        plan: "Free",
        groups: [
            {
                id: "group-personal-default",
                name: "Personal Projects",
                teams: [
                    { id: "team-personal-1", name: "Hobby projects" },
                    { id: "team-personal-2", name: "Open Source" }
                ]
            }
        ]
    },
    {
        id: "tenant-acme",
        name: "Acme Corporation",
        plan: "Enterprise",
        groups: [
            {
                id: "group-engineering",
                name: "Engineering Division",
                teams: [
                    { id: "team-frontend", name: "Frontend Platform" },
                    { id: "team-backend", name: "Backend Services" },
                    { id: "team-mobile", name: "Mobile App" }
                ]
            },
            {
                id: "group-security",
                name: "Security Labs",
                teams: [
                    { id: "team-red", name: "Red Team Ops" },
                    { id: "team-blue", name: "Blue Team Analytics" }
                ]
            }
        ]
    }
];

// ── Mock scan result (used after form submit) ─────────────────────────────────

export const MOCK_SCAN_RESULT = {
    repoUrl: "github.com/demo/scanned-repo",
    scanDuration: "14.2s",
    totalFiles: 87,
    vulnerabilities: VULNERABILITIES.slice(0, 4),
    totalLoss: 1_880_000,
};
