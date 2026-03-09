"use client";

import { useRef, useState } from "react";
import type { CompanyContext, VulnInput } from "@/lib/types";

interface ManualTabProps {
    onSwitchToScan: () => void;
    onAnalyze: (payload: {
        vulnerabilities: VulnInput[];
        company: CompanyContext;
        gemini_api_key: string | null;
    }) => void;
    error: string;
    loading: boolean;
    geminiEnabled: boolean;
    geminiKey: string;
    getCompany: () => CompanyContext;
}

const PLACEHOLDER = `[
  {
    "id": "VULN_001",
    "raw_rule_id": "sql-injection",
    "file": "payments/api.py",
    "line": 102,
    "message": "Unsanitized input in SQL query",
    "severity": "high",
    "exposure": "PUBLIC"
  },
  {
    "id": "VULN_002",
    "raw_rule_id": "hardcoded-secret",
    "file": "config/settings.py",
    "line": 14,
    "message": "Hardcoded API key found",
    "severity": "critical",
    "exposure": "PUBLIC"
  }
]`;

export default function ManualTab({
    onSwitchToScan,
    onAnalyze,
    error,
    loading,
    geminiEnabled,
    geminiKey,
    getCompany,
}: ManualTabProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [parseError, setParseError] = useState("");

    function handleAnalyze() {
        const raw = textareaRef.current?.value || "";
        let vulns: VulnInput[];
        try {
            vulns = JSON.parse(raw);
        } catch {
            setParseError("Invalid JSON. Please check the vulnerability input.");
            return;
        }
        setParseError("");
        onAnalyze({
            vulnerabilities: vulns,
            company: getCompany(),
            gemini_api_key: geminiEnabled && geminiKey ? geminiKey : null,
        });
    }

    const combinedError = parseError || error;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — context note */}
            <div>
                <div
                    className="rounded-xl p-6"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <div
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
                        style={{ color: "var(--muted)" }}
                    >
                        <span
                            className="inline-block w-0.5 h-3.5 rounded-sm"
                            style={{ background: "var(--accent)" }}
                        />
                        Company Context
                    </div>
                    <p className="text-[13px] mb-4" style={{ color: "var(--muted)" }}>
                        Same as the Scan tab. Fill in the fields there — they are shared.
                    </p>
                    <button
                        onClick={onSwitchToScan}
                        className="text-[13px] transition-colors"
                        style={{ color: "var(--accent)" }}
                    >
                        ← Fill in company context in the Scan tab
                    </button>
                </div>
            </div>

            {/* Right — vulnerability JSON input */}
            <div>
                <div
                    className="rounded-xl p-6"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <div
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-5"
                        style={{ color: "var(--muted)" }}
                    >
                        <span
                            className="inline-block w-0.5 h-3.5 rounded-sm"
                            style={{ background: "var(--accent)" }}
                        />
                        Vulnerabilities (JSON)
                    </div>
                    <p className="text-[13px] mb-3" style={{ color: "var(--muted)" }}>
                        Paste vulnerability data directly. Useful for testing without a repo.
                    </p>
                    <textarea
                        ref={textareaRef}
                        id="manual_vulns"
                        placeholder={PLACEHOLDER}
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm mb-4 outline-none resize-y"
                        style={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            minHeight: "300px",
                        }}
                        onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={e => (e.target.style.borderColor = "var(--border)")}
                    />

                    <button
                        id="manual_btn"
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full rounded-lg py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "var(--accent)" }}
                        onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = "var(--accent2)"; }}
                        onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "var(--accent)"; }}
                    >
                        📊 Analyze Vulnerabilities
                    </button>

                    {combinedError && (
                        <div
                            className="mt-3 rounded-lg px-5 py-4 text-sm"
                            style={{
                                background: "rgba(230,57,70,0.1)",
                                border: "1px solid rgba(230,57,70,0.3)",
                                color: "var(--accent2)",
                            }}
                        >
                            {combinedError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
