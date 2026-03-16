"use client";

import { ScanResults, VulnerabilityResult, AttackChain } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────

function severityColor(sev: string): string {
    const s = sev.toLowerCase();
    if (s === "critical" || s === "error") return "#e63946";
    if (s === "high" || s === "warning") return "#f97316";
    if (s === "medium") return "#eab308";
    return "#22c55e";
}

function severityLabel(sev: string): string {
    const s = sev.toLowerCase();
    if (s === "error") return "critical";
    if (s === "warning") return "high";
    return s;
}

function range(n: number, lo = 0.667, hi = 1.0): [number, number] {
    return [n * lo, n * hi];
}

function fmtRange(n: number): string {
    const [lo, hi] = range(n);
    return `${fmtMoney(lo)} – ${fmtMoney(hi)}`;
}

// ── Severity counts ───────────────────────────────────────────────────────────

function countBySeverity(results: VulnerabilityResult[]) {
    let critical = 0, high = 0, medium = 0, low = 0;
    for (const r of results) {
        const s = r.severity.toLowerCase();
        if (s === "critical" || s === "error") critical++;
        else if (s === "high" || s === "warning") high++;
        else if (s === "medium") medium++;
        else low++;
    }
    return { critical, high, medium, low };
}

// ── Component ────────────────────────────────────────────────────────────────

interface ExecReportProps {
    results: ScanResults;
    companyName?: string;
    repoUrl?: string;
    scanDate?: string;
}

export function ExecReport({ results, companyName, repoUrl, scanDate }: ExecReportProps) {
    const sev = countBySeverity(results.results);
    const topRisks = [...results.results].sort((a, b) => b.expected_loss - a.expected_loss).slice(0, 5);
    const totalHours = results.results.reduce((a, r) => a + (r.fix_effort_hours || 0), 0);
    const maxRoi = results.results.reduce((a, r) => Math.max(a, r.roi_of_fixing || 0), 0);
    const date = scanDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return (
        <div
            id="exec-report"
            style={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                background: "#0f1117",
                color: "#e2e8f0",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #1e2230",
            }}
        >
            {/* ── Header ── */}
            <div style={{
                background: "linear-gradient(135deg, #1a1f2e 0%, #0f1117 100%)",
                borderBottom: "1px solid #1e2230",
                padding: "36px 40px 28px",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)",
                            borderRadius: 999, padding: "4px 14px", marginBottom: 16,
                        }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#e63946", display: "inline-block" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#e63946", textTransform: "uppercase", letterSpacing: 1 }}>
                                Security Risk Report
                            </span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.2 }}>
                            {companyName || "Executive Security Summary"}
                        </h1>
                        {repoUrl && (
                            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b" }}>
                                {repoUrl}
                            </p>
                        )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                        <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>Report Generated</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{date}</div>
                        <div style={{
                            marginTop: 8, padding: "4px 12px", borderRadius: 6,
                            background: sev.critical > 0 ? "rgba(230,57,70,0.15)" : "rgba(234,179,8,0.15)",
                            border: `1px solid ${sev.critical > 0 ? "rgba(230,57,70,0.3)" : "rgba(234,179,8,0.3)"}`,
                            fontSize: 12, fontWeight: 700,
                            color: sev.critical > 0 ? "#e63946" : "#eab308",
                        }}>
                            {sev.critical > 0 ? "⚠ CRITICAL RISK" : "ELEVATED RISK"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Line ── */}
            <div style={{ padding: "28px 40px 0" }}>
                <SectionHeader icon="📋" title="Bottom Line" />
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16, marginBottom: 8,
                }}>
                    <StatBox label="Total Vulnerabilities" value={String(results.vulnerability_count)} accent="#e63946" />
                    <StatBox label="Total Exposure" value={fmtRange(results.total_expected_loss)} accent="#f97316" small />
                    <StatBox label="Expected Loss" value={fmtMoney(results.total_expected_loss)} accent="#e63946" />
                    <StatBox label="Fix Cost" value={`${fmtMoney(results.total_fix_cost)} (${totalHours.toFixed(0)}h)`} accent="#22c55e" small />
                </div>
                {maxRoi > 0 && (
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "10px 0 0" }}>
                        Fixing all vulnerabilities yields up to <strong style={{ color: "#22c55e" }}>{maxRoi.toFixed(0)}× ROI</strong> compared to expected loss.
                    </p>
                )}
            </div>

            {/* ── Risk Breakdown ── */}
            <div style={{ padding: "28px 40px 0" }}>
                <SectionHeader icon="🛡" title="Risk Breakdown" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                    <RiskBreakdownRow emoji="🔴" label="Critical — act this week" count={sev.critical} color="#e63946" />
                    <RiskBreakdownRow emoji="🟠" label="High — act this sprint" count={sev.high} color="#f97316" />
                    <RiskBreakdownRow emoji="🟡" label="Medium / Low — schedule" count={sev.medium + sev.low} color="#eab308" />
                </div>
            </div>

            {/* ── Top Risks Table ── */}
            <div style={{ padding: "28px 40px 0" }}>
                <SectionHeader icon="💸" title="Top Risks by Financial Exposure" />
                <div style={{ marginTop: 14, borderRadius: 10, overflow: "hidden", border: "1px solid #1e2230" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#1a1f2e" }}>
                                {["#", "Type", "Location", "Severity", "Expected Loss", "Fix Cost"].map(h => (
                                    <th key={h} style={{
                                        padding: "10px 14px", textAlign: "left",
                                        fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5,
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {topRisks.map((v, i) => (
                                <tr key={v.vulnerability_id} style={{
                                    borderTop: "1px solid #1e2230",
                                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                                }}>
                                    <td style={{ padding: "10px 14px", color: "#475569", fontWeight: 700 }}>#{i + 1}</td>
                                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#f1f5f9" }}>{v.bug_type}</td>
                                    <td style={{ padding: "10px 14px", color: "#64748b", fontSize: 11 }}>
                                        {v.file.split("\\").pop()?.slice(0, 30)}:{v.line}
                                    </td>
                                    <td style={{ padding: "10px 14px" }}>
                                        <span style={{
                                            padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                                            background: `${severityColor(v.severity)}20`,
                                            color: severityColor(v.severity),
                                            border: `1px solid ${severityColor(v.severity)}40`,
                                            textTransform: "capitalize",
                                        }}>
                                            {severityLabel(v.severity)}
                                        </span>
                                    </td>
                                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#e63946" }}>
                                        {fmtMoney(v.expected_loss)}
                                    </td>
                                    <td style={{ padding: "10px 14px", color: "#22c55e", fontWeight: 600 }}>
                                        {fmtMoney(v.fix_cost_usd)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Attack Chains ── */}
            {results.attack_chains.length > 0 && (
                <div style={{ padding: "28px 40px 0" }}>
                    <SectionHeader icon="⛓" title={`Attack Chains Detected (${results.attack_chains.length})`} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                        {results.attack_chains.map((c, i) => (
                            <ChainCard key={c.chain_id} chain={c} idx={i + 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── What If Nothing Done ── */}
            <div style={{ padding: "28px 40px 0" }}>
                <SectionHeader icon="⏳" title="What Happens If We Do Nothing" />
                <div style={{
                    marginTop: 12, padding: "16px 20px", borderRadius: 10,
                    background: "rgba(230,57,70,0.06)", border: "1px solid rgba(230,57,70,0.15)",
                    fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
                }}>
                    Based on breach rates for companies of this size and industry, at least one of these vulnerabilities is likely to be found and exploited within <strong style={{ color: "#f1f5f9" }}>6–18 months</strong> if left unaddressed.
                </div>
            </div>

            {/* ── What We're Asking ── */}
            <div style={{ padding: "28px 40px 0" }}>
                <SectionHeader icon="✅" title="Recommendation" />
                <div style={{
                    marginTop: 12, padding: "16px 20px", borderRadius: 10,
                    background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)",
                    fontSize: 13, color: "#94a3b8", lineHeight: 1.7,
                }}>
                    Approve allocation of <strong style={{ color: "#22c55e" }}>{totalHours.toFixed(0)} engineering hours</strong> to address the{" "}
                    <strong style={{ color: "#e63946" }}>{sev.critical} critical</strong> and{" "}
                    <strong style={{ color: "#f97316" }}>{sev.high} high-priority</strong> vulnerabilities.{" "}
                    Estimated cost: <strong style={{ color: "#22c55e" }}>{fmtMoney(results.total_fix_cost)}</strong>.
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                margin: "28px 40px 0",
                padding: "20px 0",
                borderTop: "1px solid #1e2230",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 0,
            }}>
                <div style={{ fontSize: 12, color: "#334155" }}>
                    CyberFinRisk — Automated Financial Risk Analysis
                </div>
                <div style={{ fontSize: 12, color: "#334155" }}>
                    Confidential — Board / Leadership Review
                </div>
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
                {title}
            </h2>
            <div style={{ flex: 1, height: 1, background: "#1e2230", marginLeft: 8 }} />
        </div>
    );
}

function StatBox({ label, value, accent, small }: { label: string; value: string; accent: string; small?: boolean }) {
    return (
        <div style={{
            padding: "16px 18px", borderRadius: 10,
            background: "#1a1f2e", border: "1px solid #1e2230",
        }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: small ? 14 : 20, fontWeight: 800, color: accent, lineHeight: 1.2 }}>{value}</div>
        </div>
    );
}

function RiskBreakdownRow({ emoji, label, count, color }: { emoji: string; label: string; count: number; color: string }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", borderRadius: 8,
            background: count > 0 ? `${color}0d` : "rgba(255,255,255,0.02)",
            border: `1px solid ${count > 0 ? color + "30" : "#1e2230"}`,
        }}>
            <span style={{ fontSize: 13, color: count > 0 ? "#e2e8f0" : "#334155" }}>
                {emoji} {label}
            </span>
            <span style={{
                fontWeight: 800, fontSize: 15,
                color: count > 0 ? color : "#334155",
            }}>
                {count} {count === 1 ? "vulnerability" : "vulnerabilities"}
            </span>
        </div>
    );
}

function ChainCard({ chain, idx }: { chain: AttackChain; idx: number }) {
    const color = chain.combined_severity === "critical" ? "#e63946" :
        chain.combined_severity === "high" ? "#f97316" : "#eab308";
    return (
        <div style={{
            padding: "16px 20px", borderRadius: 10,
            background: `${color}08`, border: `1px solid ${color}25`,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Chain {String(idx).padStart(3, "0")}
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                    Combined Exposure: {fmtRange(chain.combined_expected_loss)} | <span style={{ color, textTransform: "capitalize" }}>{chain.combined_severity}</span>
                </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                {chain.chain_description}
            </p>
        </div>
    );
}
