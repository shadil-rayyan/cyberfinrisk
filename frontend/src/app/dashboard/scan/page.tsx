"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import ScanTab from "@/components/ScanTab";
import ManualTab from "@/components/ManualTab";
import { api } from "@/lib/api";
import { ScanResults, CompanyContext, VulnInput } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import TopBar from "@/components/dashboard/TopBar";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

type ScanState = "idle" | "scanning" | "done" | "error";

const SEV_COLORS: Record<string, string> = {
    critical: "#e63946",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
};

function SevBadge({ sev }: { sev: string }) {
    const s = sev.toLowerCase();
    return (
        <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${SEV_COLORS[s] || "#71717a"}22`, color: SEV_COLORS[s] || "#71717a" }}
        >
            {sev}
        </span>
    );
}

export default function ScanPage() {
    const [state, setState] = useState<ScanState>("idle");
    const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");
    const [results, setResults] = useState<ScanResults | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const { activeOrg } = useOrg();

    // Mock company context for ManualTab shared context note or simple defaults
    const getCompanyInternal = (): CompanyContext => {
        // This is used by ManualTab to get company context if shared.
        // In a real app, this might be managed by a global state or form.
        return {
            company_name: "ACME Corp",
            industry: "finance",
            annual_revenue: 12000000,
            monthly_revenue: 1000000,
            active_users: 20000,
            arpu: 50,
            engineer_hourly_cost: 80,
            deployment_exposure: "public",
            infrastructure_type: "cloud",
            system_role: "saas_product",
            sensitive_data_types: ["PII", "financial"],
            regulatory_frameworks: ["GDPR", "PCI_DSS"],
            estimated_records_stored: 200000,
            company_size: "mid_size",
            estimated_downtime_cost_per_hour: 12000,
            stack_description: null,
            product_description: null,
        };
    };

    async function handleScan(payload: {
        company: CompanyContext;
        repo_url: string;
        branch: string;
        gemini_api_key: string | null;
    }) {
        if (!user || !activeOrg) {
            setError("Please log in and select an organization before scanning.");
            return;
        }

        setLoading(true);
        setState("scanning");
        setError("");
        try {
            const data = await api.scanRepo(payload);

            setResults({
                results: data.results,
                attack_chains: data.attack_chains,
                executive_summary: data.executive_summary,
                total_expected_loss: data.total_expected_loss,
                total_fix_cost: data.total_fix_cost,
                vulnerability_count: data.vulnerability_count,
                filtered_count: data.filtered_count,
                gemini_enabled: data.gemini_enabled,
            });
            setState("done");
        } catch (err: any) {
            setError(err.message || "Failed to scan repository");
            setState("error");
        } finally {
            setLoading(false);
        }
    }

    async function handleAnalyze(payload: {
        vulnerabilities: VulnInput[];
        company: CompanyContext;
        gemini_api_key: string | null;
    }) {
        setLoading(true);
        setState("scanning");
        setError("");
        try {
            const data = await api.analyzeManual(payload);
            setResults(data);
            setState("done");
        } catch (err: any) {
            setError(err.message || "Failed to analyze vulnerabilities");
            setState("error");
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setState("idle");
        setResults(null);
        setError("");
    }

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    state === "idle" && (
                        <div className="flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800">
                            <button
                                onClick={() => setActiveTab("scan")}
                                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${activeTab === "scan" ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                            >
                                Repository Scan
                            </button>
                            <button
                                onClick={() => setActiveTab("manual")}
                                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${activeTab === "manual" ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                            >
                                Manual Analysis
                            </button>
                        </div>
                    )
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Security Engine</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Translate vulnerabilities into financial risk using static analysis and AI
                    </p>
                </div>

                {state === "idle" && (
                    <div>
                        {activeTab === "scan" ? (
                            <ScanTab onScan={handleScan} error={error} loading={loading} />
                        ) : (
                            <ManualTab
                                onSwitchToScan={() => setActiveTab("scan")}
                                onAnalyze={handleAnalyze}
                                error={error}
                                loading={loading}
                                geminiEnabled={false}
                                geminiKey=""
                                getCompany={getCompanyInternal}
                            />
                        )}
                    </div>
                )}

            {state === "scanning" && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                    <Loader2 size={40} className="mx-auto mb-4 animate-spin" style={{ color: "var(--accent)" }} />
                    <h3 className="font-bold text-lg mb-1">
                        {activeTab === "scan" ? "Scanning repository..." : "Analyzing vulnerabilities..."}
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                        {activeTab === "scan" ? "This may take a minute depending on repo size" : "Applying financial models and processing AI requests"}
                    </p>
                    <div className="w-full rounded-full h-1.5 mb-2 overflow-hidden" style={{ background: "var(--surface)" }}>
                        <div className="h-full bg-[var(--accent)] animate-progress" style={{ width: "30%" }} />
                    </div>
                </div>
            )}

            {state === "error" && (
                <div
                    className="rounded-xl p-8 text-center"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                    <AlertTriangle size={40} className="mx-auto mb-4 text-[var(--accent)]" />
                    <h3 className="font-bold text-lg mb-2">Analysis Failed</h3>
                    <p className="text-sm mb-6 text-[var(--muted-foreground)]">{error}</p>
                    <button
                        onClick={() => setState("idle")}
                        className="px-6 py-2 rounded-lg font-semibold text-white"
                        style={{ background: "var(--accent)" }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {state === "done" && results && (
                <div>
                    {/* Success banner */}
                    <div
                        className="flex items-center gap-3 rounded-xl p-4 mb-6"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                        <CheckCircle size={16} style={{ color: "var(--green)" }} />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>
                                Analysis Complete
                            </p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                Found {results.results.length} vulnerabilities · Adjusted by AI: {results.gemini_enabled ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>

                    {/* Summary metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: "Total Expected Loss", val: fmtMoney(results.total_expected_loss), color: "var(--accent)" },
                            { label: "Vulnerabilities", val: String(results.results.length) },
                            { label: "Total Fix Cost", val: fmtMoney(results.total_fix_cost) },
                            { label: "Attack Chains", val: String(results.attack_chains.length), color: results.attack_chains.length > 0 ? "var(--accent)" : "var(--foreground)" },
                        ].map(m => (
                            <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                                <div className="text-xl font-extrabold" style={{ color: m.color || "var(--foreground)" }}>{m.val}</div>
                                <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Vuln table */}
                    <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                            <h3 className="font-bold text-sm">Action Items (Priority Ranked)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                        {["Bug Type", "Location", "Severity", "Expected Loss", "ROI"].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.results.map((v, i) => (
                                        <tr key={v.vulnerability_id} className="hover:bg-zinc-900 transition-colors" style={{ borderBottom: i < results.results.length - 1 ? "1px solid var(--border)" : undefined }}>
                                            <td className="px-5 py-4 font-medium capitalize">{v.bug_type.replace(/_/g, " ")}</td>
                                            <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{v.file}:{v.line}</td>
                                            <td className="px-5 py-4"><SevBadge sev={v.severity} /></td>
                                            <td className="px-5 py-3 font-bold" style={{ color: "var(--accent)" }}>{fmtMoney(v.expected_loss)}</td>
                                            <td className="px-5 py-4 font-semibold text-[var(--green)]">{v.roi_of_fixing.toFixed(1)}x</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {results.executive_summary && (
                        <div className="rounded-xl p-6 mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                            <h3 className="font-bold text-sm mb-4">Executive Summary</h3>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--muted-foreground)]">
                                {results.executive_summary}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
                        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                    >
                        <ArrowLeft size={16} /> Run Another Scan
                    </button>
                </div>
            )}
        </div>
        </div>
    );
}
