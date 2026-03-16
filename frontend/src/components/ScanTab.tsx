"use client";

import { useEffect, useRef, useState } from "react";
import type { CompanyContext, PresetContext } from "@/lib/types";
import { api } from "@/lib/api";

// ─── Style helpers ────────────────────────────────────────────────────────────

const fieldStyle = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
};

const inputCls =
    "w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none transition-colors";

const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        (e.target.style.borderColor = "var(--accent)"),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        (e.target.style.borderColor = "var(--border)"),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div
            className="rounded-xl p-6 mb-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
            <div
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "var(--muted)" }}
            >
                <span className="inline-block w-0.5 h-3.5 rounded-sm" style={{ background: "var(--accent)" }} />
                {title}
            </div>
            {children}
        </div>
    );
}

function FL({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
            {children}
        </label>
    );
}

// ─── CheckboxGroup ────────────────────────────────────────────────────────────

interface CBItem { value: string; label: string }

function CheckboxGroup({ items, selected, onChange }: {
    items: CBItem[];
    selected: string[];
    onChange: (next: string[]) => void;
}) {
    const toggle = (v: string) =>
        onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {items.map(item => {
                const checked = selected.includes(item.value);
                return (
                    <label
                        key={item.value}
                        className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-md cursor-pointer transition-all select-none"
                        style={{
                            background: checked ? "rgba(230,57,70,0.08)" : "var(--bg)",
                            border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
                            color: "var(--text)",
                        }}
                    >
                        <input
                            type="checkbox"
                            className="accent-[#e63946] w-auto p-0 mb-0 border-0"
                            checked={checked}
                            onChange={() => toggle(item.value)}
                        />
                        {item.label}
                    </label>
                );
            })}
        </div>
    );
}

// ─── GeminiToggle ─────────────────────────────────────────────────────────────

function GeminiToggle({ enabled, onToggle, apiKey, onKeyChange }: {
    enabled: boolean;
    onToggle: (v: boolean) => void;
    apiKey: string;
    onKeyChange: (v: string) => void;
}) {
    return (
        <Card title="AI Analysis (Gemini)">
            <div
                className="flex items-center gap-3 p-3.5 rounded-lg mb-4"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
                <button
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => onToggle(!enabled)}
                    className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200"
                    style={{ background: enabled ? "var(--accent)" : "var(--border)" }}
                >
                    <span
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                        style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
                    />
                </button>
                <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>Enable Gemini AI Analysis</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>Assesses real exploitability + finds attack chains</div>
                </div>
            </div>

            {enabled && (
                <div>
                    <FL>Gemini API Key (free at aistudio.google.com)</FL>
                    <input
                        id="gemini_key"
                        type="password"
                        placeholder="AIza..."
                        value={apiKey}
                        onChange={e => onKeyChange(e.target.value)}
                        className={inputCls}
                        style={fieldStyle}
                        {...focusHandlers}
                    />
                    <div
                        className="rounded-lg p-3.5 text-[13px] leading-relaxed"
                        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}
                    >
                        <strong style={{ color: "var(--text)" }}>With AI enabled, the engine will:</strong><br />
                        • Read actual code context to filter false positives<br />
                        • Adjust exploit probability based on real code patterns<br />
                        • Understand what each endpoint actually does<br />
                        • Find attack chains across multiple vulnerabilities<br />
                        • Generate specific fix code for each vulnerability
                    </div>
                </div>
            )}
        </Card>
    );
}

// ─── Main ScanTab ─────────────────────────────────────────────────────────────

export interface ScanTabProps {
    onScan: (payload: {
        company: CompanyContext;
        repo_url: string;
        branch: string;
        gemini_api_key: string | null;
    }) => void;
    error: string;
    loading: boolean;
}

const DATA_TYPES: CBItem[] = [
    { value: "PII", label: "PII" },
    { value: "financial", label: "Financial" },
    { value: "health", label: "Health" },
    { value: "credentials", label: "Credentials" },
];

const REGULATIONS: CBItem[] = [
    { value: "GDPR", label: "GDPR" },
    { value: "PCI_DSS", label: "PCI DSS" },
    { value: "HIPAA", label: "HIPAA" },
    { value: "CCPA", label: "CCPA" },
];

export default function ScanTab({ onScan, error, loading }: ScanTabProps) {
    const [dataTypes, setDataTypes] = useState(["PII", "financial"]);
    const [regulations, setRegulations] = useState(["GDPR", "PCI_DSS"]);
    const [geminiEnabled, setGeminiEnabled] = useState(false);
    const [geminiKey, setGeminiKey] = useState("");
    const [jsonImport, setJsonImport] = useState("");
    const [importSuccess, setImportSuccess] = useState(false);
    const [presets, setPresets] = useState<PresetContext[]>([]);
    const [selectedPresetId, setSelectedPresetId] = useState<string>("");

    // native element refs
    const companyName = useRef<HTMLInputElement>(null);
    const industry = useRef<HTMLSelectElement>(null);
    const companySize = useRef<HTMLSelectElement>(null);
    const systemRole = useRef<HTMLSelectElement>(null);
    const annualRevenue = useRef<HTMLInputElement>(null);
    const monthlyRevenue = useRef<HTMLInputElement>(null);
    const activeUsers = useRef<HTMLInputElement>(null);
    const engineerCost = useRef<HTMLInputElement>(null);
    const arpu = useRef<HTMLInputElement>(null);
    const exposure = useRef<HTMLSelectElement>(null);
    const records = useRef<HTMLInputElement>(null);
    const downtimeCost = useRef<HTMLInputElement>(null);
    const productDesc = useRef<HTMLTextAreaElement>(null);
    const stackDesc = useRef<HTMLTextAreaElement>(null);
    const repoUrl = useRef<HTMLInputElement>(null);
    const branch = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;
        api.demoPresets()
            .then((data) => {
                if (!cancelled) {
                    setPresets(data);
                }
            })
            .catch(() => {
                // best-effort: ignore errors and leave presets empty
            });
        return () => {
            cancelled = true;
        };
    }, []);

    function getCompany(): CompanyContext {
        return {
            company_name: companyName.current?.value || "ACME Corp",
            industry: industry.current?.value || "finance",
            annual_revenue: Number(annualRevenue.current?.value) || 12000000,
            monthly_revenue: Number(monthlyRevenue.current?.value) || 1000000,
            active_users: Number(activeUsers.current?.value) || 20000,
            arpu: Number(arpu.current?.value) || 50,
            engineer_hourly_cost: Number(engineerCost.current?.value) || 80,
            deployment_exposure: exposure.current?.value || "public",
            infrastructure_type: "cloud",
            system_role: systemRole.current?.value || "saas_product",
            sensitive_data_types: dataTypes,
            regulatory_frameworks: regulations,
            estimated_records_stored: Number(records.current?.value) || 200000,
            company_size: companySize.current?.value || "mid_size",
            estimated_downtime_cost_per_hour: Number(downtimeCost.current?.value) || null,
            stack_description: stackDesc.current?.value || null,
            product_description: productDesc.current?.value || null,
        };
    }

    function applyCompanyToForm(data: any) {
        if (companyName.current && data.company_name) companyName.current.value = data.company_name;
        if (industry.current && data.industry) industry.current.value = data.industry;
        if (companySize.current && data.company_size) companySize.current.value = data.company_size;
        if (systemRole.current && data.system_role) systemRole.current.value = data.system_role;
        if (annualRevenue.current && data.annual_revenue) annualRevenue.current.value = String(data.annual_revenue);
        if (monthlyRevenue.current && data.monthly_revenue) monthlyRevenue.current.value = String(data.monthly_revenue);
        if (activeUsers.current) activeUsers.current.value = String(data.active_users || data.active_customers || 0);
        if (arpu.current && data.arpu) arpu.current.value = String(data.arpu);
        if (engineerCost.current && data.engineer_hourly_cost) engineerCost.current.value = String(data.engineer_hourly_cost);
        if (records.current && data.estimated_records_stored) records.current.value = String(data.estimated_records_stored);
        if (downtimeCost.current && data.estimated_downtime_cost_per_hour) downtimeCost.current.value = String(data.estimated_downtime_cost_per_hour);
        if (productDesc.current && data.product_description) productDesc.current.value = data.product_description;
        if (stackDesc.current && data.stack_description) stackDesc.current.value = data.stack_description;
        if (data.deployment_exposure && exposure.current) {
            const exp = (data.deployment_exposure as string).toLowerCase();
            exposure.current.value = exp.includes("public") ? "public" : exp.includes("internal") ? "internal" : "private";
        }
        if (data.sensitive_data_types) setDataTypes(data.sensitive_data_types);
        if (data.regulatory_frameworks) setRegulations(data.regulatory_frameworks);
    }

    function importJSON() {
        try {
            const data = JSON.parse(jsonImport);
            applyCompanyToForm(data);
            setImportSuccess(true);
            setTimeout(() => setImportSuccess(false), 3000);
        } catch {
            alert("Invalid JSON format. Please check your input.");
        }
    }

    function handlePresetSelect(presetId: string) {
        setSelectedPresetId(presetId);
        const preset = presets.find((p) => p.id === presetId);
        if (!preset) return;

        // Apply company context into the form
        applyCompanyToForm(preset.company);

        // Also populate the JSON textarea so the user can see/edit it
        try {
            const pretty = JSON.stringify(preset.company, null, 2);
            setJsonImport(pretty);
        } catch {
            // ignore stringify errors, still keep form filled
        }

        // Pre-fill repo URL and branch
        if (repoUrl.current && preset.repo_url) {
            repoUrl.current.value = preset.repo_url;
        }
        if (branch.current && preset.branch) {
            branch.current.value = preset.branch;
        }
    }

    function handleScan() {
        onScan({
            company: getCompany(),
            repo_url: repoUrl.current?.value || "",
            branch: branch.current?.value || "main",
            gemini_api_key: geminiEnabled && geminiKey ? geminiKey : null,
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── LEFT COLUMN ── */}
            <div>
                {/* Presets + JSON Import */}
                <Card title="Quick JSON Import">
                    {presets.length > 0 && (
                        <div className="mb-4">
                            <FL>Load Sample Profile</FL>
                            <select
                                value={selectedPresetId}
                                onChange={(e) => handlePresetSelect(e.target.value)}
                                className={inputCls}
                                style={fieldStyle}
                                {...focusHandlers}
                            >
                                <option value="">Select a sample (Spree, ERPNext, ...)</option>
                                {presets.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <FL>Paste Company JSON</FL>
                    <textarea
                        id="company_json_paste"
                        placeholder='{ "company_name": "PostHog", ... }'
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none resize-y"
                        style={{ ...fieldStyle, fontFamily: "var(--font-mono)", fontSize: "13px", minHeight: "100px" }}
                        value={jsonImport}
                        onChange={e => setJsonImport(e.target.value)}
                        {...focusHandlers}
                    />
                    <button
                        onClick={importJSON}
                        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                        style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text)" }}
                        onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--accent)"; (e.currentTarget).style.color = "var(--accent)"; }}
                        onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--text)"; }}
                    >
                        ✨ Auto-populate Form
                    </button>
                    {importSuccess && <p className="text-[11px] mt-2" style={{ color: "var(--green)" }}>✓ JSON imported successfully!</p>}
                </Card>

                {/* Company Context */}
                <Card title="Company Context">
                    <FL>Company Name</FL>
                    <input ref={companyName} id="company_name" type="text" placeholder="PayFlow Inc" className={inputCls} style={fieldStyle} {...focusHandlers} />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FL>Industry</FL>
                            <select ref={industry} id="industry" className={inputCls} style={fieldStyle} {...focusHandlers}>
                                <option value="finance">Finance / Fintech</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="technology">Technology / SaaS</option>
                                <option value="retail">Retail / E-commerce</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                        <div>
                            <FL>Company Size</FL>
                            <select ref={companySize} id="company_size" defaultValue="mid_size" className={inputCls} style={fieldStyle} {...focusHandlers}>
                                <option value="startup">Startup (&lt;50 employees)</option>
                                <option value="mid_size">Mid-size (50–500)</option>
                                <option value="enterprise">Enterprise (500+)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FL>Annual Revenue (USD)</FL>
                            <input ref={annualRevenue} id="annual_revenue" type="number" placeholder="12000000" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                        <div>
                            <FL>Monthly Revenue (USD)</FL>
                            <input ref={monthlyRevenue} id="monthly_revenue" type="number" placeholder="1000000" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FL>System Role</FL>
                            <select ref={systemRole} id="system_role" defaultValue="saas_product" className={inputCls} style={fieldStyle} {...focusHandlers}>
                                <option value="saas_product">SaaS Product</option>
                                <option value="infrastructure">Infrastructure Component</option>
                                <option value="framework">Framework / Library</option>
                                <option value="internal_tool">Internal Tool</option>
                                <option value="microservice">Microservice</option>
                            </select>
                        </div>
                        <div>
                            <FL>Active Users</FL>
                            <input ref={activeUsers} id="active_users" type="number" placeholder="20000" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FL>Engineer Hourly Cost (USD)</FL>
                            <input ref={engineerCost} id="engineer_cost" type="number" placeholder="80" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                        <div>
                            <FL>Avg Revenue per User / Month</FL>
                            <input ref={arpu} id="arpu" type="number" placeholder="50" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FL>Deployment Exposure</FL>
                            <select ref={exposure} id="exposure" defaultValue="public" className={inputCls} style={fieldStyle} {...focusHandlers}>
                                <option value="public">Public Internet</option>
                                <option value="internal">Internal Only</option>
                                <option value="private">Private / Air-gapped</option>
                            </select>
                        </div>
                        <div>
                            <FL>Records Stored</FL>
                            <input ref={records} id="records" type="number" placeholder="200000" className={inputCls} style={fieldStyle} {...focusHandlers} />
                        </div>
                    </div>

                    <FL>Downtime Cost / Hour (USD)</FL>
                    <input ref={downtimeCost} id="downtime_cost" type="number" placeholder="12000" className={inputCls} style={fieldStyle} {...focusHandlers} />
                </Card>

                <FL>Sensitive Data Types</FL>
                <CheckboxGroup items={DATA_TYPES} selected={dataTypes} onChange={setDataTypes} />

                <FL>Regulatory Frameworks</FL>
                <CheckboxGroup items={REGULATIONS} selected={regulations} onChange={setRegulations} />

                <FL>Product Description</FL>
                <textarea
                    ref={productDesc}
                    id="product_desc"
                    placeholder="e.g. B2B SaaS payments platform serving SMBs..."
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none resize-y min-h-[80px]"
                    style={{ ...fieldStyle, fontFamily: "var(--font-mono)", fontSize: "13px" }}
                    {...focusHandlers}
                />

                <FL>Tech Stack</FL>
                <textarea
                    ref={stackDesc}
                    id="stack_desc"
                    placeholder="e.g. Django REST API, PostgreSQL, Redis, hosted on AWS ECS..."
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none resize-y min-h-[80px]"
                    style={{ ...fieldStyle, fontFamily: "var(--font-mono)", fontSize: "13px" }}
                    {...focusHandlers}
                />
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div>
                <Card title="Repository Scan">
                    <FL>GitHub Repository URL</FL>
                    <input ref={repoUrl} id="repo_url" type="text" placeholder="https://github.com/company/payment-api" className={inputCls} style={fieldStyle} {...focusHandlers} />
                    <FL>Branch</FL>
                    <input ref={branch} id="branch" type="text" placeholder="main" defaultValue="main" className={inputCls} style={fieldStyle} {...focusHandlers} />
                </Card>

                <GeminiToggle
                    enabled={geminiEnabled}
                    onToggle={setGeminiEnabled}
                    apiKey={geminiKey}
                    onKeyChange={setGeminiKey}
                />

                <Card title="What Happens Next">
                    <div className="text-[13px] leading-loose" style={{ color: "var(--muted)" }}>
                        1. Repository is cloned and scanned with Semgrep<br />
                        2. Each finding is classified and financially modeled<br />
                        3.{" "}{geminiEnabled ? "Gemini analyzes actual code to filter false positives" : "Financial impact calculated from company context"}<br />
                        4. Results ranked by expected dollar loss<br />
                        5. Executive brief generated per vulnerability<br />
                        6. Board-level summary produced
                    </div>
                </Card>

                <button
                    id="scan_btn"
                    onClick={handleScan}
                    disabled={loading}
                    className="w-full rounded-lg py-4 text-base font-semibold text-white transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "var(--accent)" }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--accent2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; }}
                >
                    🔍 Run Security Scan
                </button>

                {error && (
                    <div
                        className="mt-3 rounded-lg px-5 py-4 text-sm"
                        style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", color: "var(--accent2)" }}
                    >
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
