"use client";

import { useState } from "react";
import { Scan, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { MOCK_SCAN_RESULT } from "@/lib/mock-data";
import { fmtMoney, fmtRange } from "@/lib/utils";
import type { Severity } from "@/lib/mock-data";

type ScanState = "idle" | "scanning" | "done";

const SEV_COLORS: Record<Severity, string> = {
    critical: "#e63946",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
};

const INDUSTRIES = [
    "Finance / Fintech",
    "Healthcare",
    "Technology / SaaS",
    "Retail / E-commerce",
    "Education",
    "Government",
    "Media & Entertainment",
];

function SevBadge({ sev }: { sev: Severity }) {
    return (
        <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${SEV_COLORS[sev]}22`, color: SEV_COLORS[sev] }}
        >
            {sev}
        </span>
    );
}

export default function ScanPage() {
    const [state, setState] = useState<ScanState>("idle");
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState("");
    const [form, setForm] = useState({
        repoUrl: "",
        industry: "Finance / Fintech",
        revenue: "",
        users: "",
        exposure: "public",
    });

    const STEPS = [
        "Cloning repository...",
        "Running Semgrep analysis...",
        "Classifying findings...",
        "Modelling financial impact...",
        "Generating report...",
    ];

    function handleScan(e: React.FormEvent) {
        e.preventDefault();
        setState("scanning");
        setProgress(0);

        let s = 0;
        setStep(STEPS[0]);
        const interval = setInterval(() => {
            s += 1;
            setProgress(Math.min(s * 20, 100));
            if (s < STEPS.length) setStep(STEPS[s]);
            if (s >= 5) {
                clearInterval(interval);
                setState("done");
            }
        }, 900);
    }

    function reset() {
        setState("idle");
        setProgress(0);
        setStep("");
    }

    return (
        <div className="px-6 md:px-10 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold tracking-tight mb-1">Scan Repository</h1>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Analyse a GitHub repository and convert vulnerabilities to financial risk
                </p>
            </div>

            {state === "idle" && (
                <form onSubmit={handleScan}>
                    <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Repo URL */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    GitHub Repository URL *
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://github.com/acme/payment-api"
                                    value={form.repoUrl}
                                    onChange={e => setForm(f => ({ ...f, repoUrl: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Industry
                                </label>
                                <select
                                    value={form.industry}
                                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                >
                                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                                </select>
                            </div>

                            {/* Exposure */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Exposure Type
                                </label>
                                <select
                                    value={form.exposure}
                                    onChange={e => setForm(f => ({ ...f, exposure: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                >
                                    <option value="public">Public Internet</option>
                                    <option value="internal">Internal Only</option>
                                    <option value="private">Private / Air-gapped</option>
                                </select>
                            </div>

                            {/* Annual Revenue */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Annual Revenue (USD)
                                </label>
                                <input
                                    type="number"
                                    placeholder="12000000"
                                    value={form.revenue}
                                    onChange={e => setForm(f => ({ ...f, revenue: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>

                            {/* Users */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Number of Active Users
                                </label>
                                <input
                                    type="number"
                                    placeholder="20000"
                                    value={form.users}
                                    onChange={e => setForm(f => ({ ...f, users: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: "var(--accent)" }}
                        >
                            <Scan size={16} /> Scan Repository
                        </button>
                    </div>
                </form>
            )}

            {state === "scanning" && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                    <Loader2 size={40} className="mx-auto mb-4 animate-spin" style={{ color: "var(--accent)" }} />
                    <h3 className="font-bold text-lg mb-1">Scanning repository...</h3>
                    <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>{step}</p>

                    {/* Progress bar */}
                    <div className="w-full rounded-full h-1.5 mb-2" style={{ background: "var(--surface)" }}>
                        <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: "var(--accent)" }}
                        />
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{progress}%</span>
                </div>
            )}

            {state === "done" && (
                <div>
                    {/* Success banner */}
                    <div
                        className="flex items-center gap-3 rounded-xl p-4 mb-6"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                        <CheckCircle size={16} style={{ color: "var(--green)" }} />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--green)" }}>
                                Scan complete — {MOCK_SCAN_RESULT.scanDuration}
                            </p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                Analysed {MOCK_SCAN_RESULT.totalFiles} files · Found {MOCK_SCAN_RESULT.vulnerabilities.length} vulnerabilities
                            </p>
                        </div>
                    </div>

                    {/* Summary metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: "Expected Loss", val: fmtMoney(MOCK_SCAN_RESULT.totalLoss), color: "var(--accent)" },
                            { label: "Files Scanned", val: String(MOCK_SCAN_RESULT.totalFiles) },
                            { label: "Vulnerabilities", val: String(MOCK_SCAN_RESULT.vulnerabilities.length) },
                            { label: "Critical", val: String(MOCK_SCAN_RESULT.vulnerabilities.filter(v => v.severity === "critical").length), color: "var(--accent)" },
                        ].map(m => (
                            <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                                <div className="text-xl font-extrabold" style={{ color: m.color || "var(--foreground)" }}>{m.val}</div>
                                <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Vuln table */}
                    <div className="rounded-xl overflow-hidden mb-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                            <h3 className="font-bold text-sm">Vulnerabilities Found</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    {["Vulnerability", "File", "Severity", "Expected Loss"].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_SCAN_RESULT.vulnerabilities.map((v, i) => (
                                    <tr key={v.id} className="hover:bg-zinc-900 transition-colors" style={{ borderBottom: i < MOCK_SCAN_RESULT.vulnerabilities.length - 1 ? "1px solid var(--border)" : undefined }}>
                                        <td className="px-5 py-3 font-medium">{v.title}</td>
                                        <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{v.file}</td>
                                        <td className="px-5 py-3"><SevBadge sev={v.severity} /></td>
                                        <td className="px-5 py-3 font-bold" style={{ color: "var(--accent)" }}>{fmtRange(v.expectedLoss)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Alert for unscanned vulns */}
                    <div className="flex items-start gap-2 text-xs p-3 rounded-lg mb-5" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", color: "var(--muted-foreground)" }}>
                        <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--yellow)" }} />
                        <span>This is a mock scan using static demo data. In production, Semgrep would analyse your real code.</span>
                    </div>

                    <button
                        onClick={reset}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
                        style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                    >
                        ← Run Another Scan
                    </button>
                </div>
            )}
        </div>
    );
}
