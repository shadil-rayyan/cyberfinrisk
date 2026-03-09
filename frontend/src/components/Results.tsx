"use client";

import { useState } from "react";
import type { ScanResults, VulnerabilityResult, AttackChain } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
}

function fmtRange(n: number): string {
    if (n <= 0) return "$0";
    return `${fmtMoney(n * 0.8)} – ${fmtMoney(n * 1.2)}`;
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({
    value,
    label,
    color,
}: {
    value: string;
    label: string;
    color?: string;
}) {
    return (
        <div
            className="rounded-xl p-5 text-center"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
            <div
                className="text-2xl font-extrabold leading-none mb-1"
                style={{ color: color || "var(--accent)", fontFamily: "var(--font-mono)" }}
            >
                {value}
            </div>
            <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                {label}
            </div>
        </div>
    );
}

// ─── AttackChainCard ──────────────────────────────────────────────────────────

function AttackChainCard({ chain }: { chain: AttackChain }) {
    return (
        <div
            className="rounded-xl p-5 mb-4"
            style={{
                background: "linear-gradient(135deg, rgba(230,57,70,0.08), rgba(243,156,18,0.05))",
                border: "1px solid rgba(230,57,70,0.3)",
            }}
        >
            <div className="flex items-center gap-2 font-bold text-sm mb-2" style={{ color: "var(--accent2)" }}>
                ⛓️ {chain.chain_id}
                <span
                    className="text-[11px] px-2 py-0.5 rounded"
                    style={{ background: "rgba(230,57,70,0.2)", color: "var(--accent2)" }}
                >
                    {chain.combined_severity.toUpperCase()}
                </span>
            </div>
            <p className="text-sm mb-3" style={{ color: "#c0c0d8" }}>{chain.chain_description}</p>
            <div className="mb-3">
                {chain.chain_steps.map((step, i) => (
                    <div
                        key={i}
                        className="px-3 py-2 text-sm mb-1.5 rounded-r-md"
                        style={{
                            borderLeft: "2px solid var(--accent)",
                            background: "rgba(0,0,0,0.2)",
                            color: "#b0b0c8",
                        }}
                    >
                        {step}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
                <div>
                    <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>
                        Combined Expected Loss
                    </div>
                    <div
                        className="text-lg font-extrabold"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                    >
                        {fmtRange(chain.combined_expected_loss)}
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                    Involves: {chain.vulnerability_ids.join(", ")}
                </div>
            </div>
        </div>
    );
}

// ─── VulnCard ─────────────────────────────────────────────────────────────────

function VulnCard({ result }: { result: VulnerabilityResult }) {
    const [open, setOpen] = useState(false);

    const tier =
        result.expected_loss >= 100_000
            ? "🔴"
            : result.expected_loss >= 30_000
                ? "🟠"
                : result.expected_loss >= 5_000
                    ? "🟡"
                    : "🟢";

    const hasGemini = !!result.gemini_analysis;
    const isFP = result.gemini_analysis?.false_positive_likelihood === "high";
    const inChain = result.attack_chains?.length > 0;

    return (
        <div
            className="rounded-xl mb-4 overflow-hidden transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--muted)")}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)")}
        >
            {/* Header row (clickable) */}
            <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
                onClick={() => setOpen(o => !o)}
            >
                <span className="text-xl flex-shrink-0">{tier}</span>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[15px]" style={{ color: "var(--text)" }}>
                            {result.bug_type.replace(/_/g, " ")}
                        </span>
                        {hasGemini && (
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                    background: "rgba(52,152,219,0.15)",
                                    border: "1px solid rgba(52,152,219,0.3)",
                                    color: "var(--blue)",
                                }}
                            >
                                ✦ AI
                            </span>
                        )}
                        {isFP && (
                            <span
                                className="text-[11px] px-2 py-0.5 rounded"
                                style={{ background: "rgba(241,196,15,0.2)", color: "var(--yellow)" }}
                            >
                                ⚠️ Possible false positive
                            </span>
                        )}
                        {inChain && (
                            <span
                                className="text-[11px] px-2 py-0.5 rounded"
                                style={{ background: "rgba(230,57,70,0.2)", color: "var(--accent)" }}
                            >
                                ⛓️ In attack chain
                            </span>
                        )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                        {result.file}:{result.line} · {result.exposure}
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <div
                        className="font-extrabold text-base"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                    >
                        {fmtRange(result.expected_loss)}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                        expected loss
                    </div>
                </div>

                <span className="text-xs flex-shrink-0" style={{ color: "var(--muted)" }}>
                    {open ? "▲" : "▼"}
                </span>
            </div>

            {/* Expanded body */}
            {open && (
                <div className="px-5 pb-5">
                    {/* Gemini analysis block */}
                    {result.gemini_analysis && (
                        <div
                            className="rounded-lg p-3.5 mb-4"
                            style={{
                                background: "rgba(52,152,219,0.08)",
                                border: "1px solid rgba(52,152,219,0.2)",
                            }}
                        >
                            <div
                                className="text-[11px] font-bold uppercase tracking-wide mb-2"
                                style={{ color: "var(--blue)" }}
                            >
                                ✦ Gemini AI Analysis
                            </div>
                            <p className="text-[13px] mb-1.5" style={{ color: "#b0cce8" }}>
                                <strong>What this code does:</strong> {result.gemini_analysis.business_context}
                            </p>
                            <p className="text-[13px] mb-1.5" style={{ color: "#b0cce8" }}>
                                <strong>Exploitable?</strong>{" "}
                                {result.gemini_analysis.is_exploitable ? "Yes" : "No"} (
                                {result.gemini_analysis.exploitability_confidence} confidence)
                            </p>
                            <p className="text-[13px] mb-1.5" style={{ color: "#b0cce8" }}>
                                <strong>Why:</strong> {result.gemini_analysis.exploitability_reasoning}
                            </p>
                            <p className="text-[13px]" style={{ color: "#b0cce8" }}>
                                <strong>Fix:</strong> {result.gemini_analysis.recommended_fix}
                            </p>
                        </div>
                    )}

                    {/* Business brief */}
                    <div className="brief-pre">{result.business_brief}</div>

                    {/* Mini metric grid */}
                    <div className="flex gap-3 flex-wrap mt-3">
                        {[
                            { val: fmtRange(result.expected_loss), label: "Expected Loss", color: "var(--accent)" },
                            { val: fmtMoney(result.fix_cost_usd), label: `Fix Cost (${result.fix_effort_hours}h)`, color: "var(--green)" },
                            { val: `${result.roi_of_fixing}×`, label: "ROI of Fixing", color: "var(--orange)" },
                            {
                                val: `${Math.round(result.effective_probability * 100)}%`,
                                label: result.gemini_analysis ? "AI-Adjusted Probability" : "Exploit Probability",
                                color: "var(--text)",
                            },
                        ].map(({ val, label, color }) => (
                            <div
                                key={label}
                                className="flex-1 min-w-[130px] rounded-lg p-3 text-center"
                                style={{ background: "var(--surface2)" }}
                            >
                                <div
                                    className="text-lg font-extrabold"
                                    style={{ fontFamily: "var(--font-mono)", color }}
                                >
                                    {val}
                                </div>
                                <div className="text-[11px]" style={{ color: "var(--muted)" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Results component ───────────────────────────────────────────────────

interface ResultsProps {
    data: ScanResults;
    companyName: string;
    onReset: () => void;
}

export default function Results({ data, companyName, onReset }: ResultsProps) {
    const {
        results,
        attack_chains,
        executive_summary,
        total_expected_loss,
        total_fix_cost,
        gemini_enabled,
    } = data;

    const critical = results.filter(r => r.expected_loss >= 100_000).length;
    const roi = total_fix_cost > 0 ? Math.round(total_expected_loss / total_fix_cost) : 0;

    return (
        <div>
            {/* Section title */}
            <h2 className="text-2xl font-extrabold tracking-tight mb-5" style={{ color: "var(--text)" }}>
                Risk Assessment —{" "}
                <span style={{ color: "var(--accent)" }}>{companyName || "Company"}</span>
                {gemini_enabled && (
                    <span
                        className="inline-flex items-center gap-1 ml-3 px-2 py-0.5 rounded-full text-[11px] font-semibold align-middle"
                        style={{
                            background: "rgba(52,152,219,0.15)",
                            border: "1px solid rgba(52,152,219,0.3)",
                            color: "var(--blue)",
                        }}
                    >
                        ✦ AI Analyzed
                    </span>
                )}
            </h2>

            {/* Metric cards (3-col grid) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <MetricCard value={fmtRange(total_expected_loss)} label="Total Expected Loss" />
                <MetricCard value={fmtMoney(total_fix_cost)} label="Total Fix Cost" color="var(--green)" />
                <MetricCard value={`${roi}×`} label="ROI of Fixing Everything" color="var(--orange)" />
                <MetricCard value={String(results.length)} label="Vulnerabilities Found" />
                <MetricCard value={String(critical)} label="Critical This Sprint" />
                <MetricCard value={String(attack_chains.length)} label="Attack Chains" />
            </div>

            {/* Executive summary */}
            <h3 className="text-xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text)" }}>
                Board Summary
            </h3>
            <div className="summary-pre mb-8">{executive_summary}</div>

            {/* Attack chains */}
            {attack_chains.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-extrabold tracking-tight mb-2" style={{ color: "var(--text)" }}>
                        ⚠️ Attack <span style={{ color: "var(--accent)" }}>Chains Detected</span>
                    </h3>
                    <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>
                        These vulnerabilities can be combined by an attacker into a single multi-step breach
                        path, causing greater damage than any individual bug.
                    </p>
                    {attack_chains.map((chain, i) => (
                        <AttackChainCard key={i} chain={chain} />
                    ))}
                </div>
            )}

            {/* Vuln list */}
            <h3 className="text-xl font-extrabold tracking-tight mb-4" style={{ color: "var(--text)" }}>
                Vulnerabilities —{" "}
                <span style={{ color: "var(--accent)" }}>Ranked by Financial Priority</span>
            </h3>
            <div id="vuln_list">
                {results.map((r, i) => (
                    <VulnCard key={r.id ?? i} result={r} />
                ))}
            </div>

            {/* Reset */}
            <button
                onClick={onReset}
                className="mt-5 rounded-lg px-7 py-3 text-sm font-semibold transition-colors"
                style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                }}
                onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.target as HTMLButtonElement).style.color = "var(--accent)";
                }}
                onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.target as HTMLButtonElement).style.color = "var(--text)";
                }}
            >
                ← Run Another Scan
            </button>
        </div>
    );
}
