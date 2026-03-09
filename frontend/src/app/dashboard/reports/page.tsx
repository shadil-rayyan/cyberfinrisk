"use client";

import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, TrendingDown, ShieldAlert, FileText } from "lucide-react";
import { VULNERABILITIES, BREACH_COST, DOWNTIME_ESTIMATE, COMPLIANCE_FINES } from "@/lib/mock-data";
import { fmtMoney } from "@/lib/utils";

const PIE_COLORS = ["#e63946", "#f97316", "#eab308", "#3b82f6", "#8b5cf6"];
const TOTAL_LOSS = VULNERABILITIES.reduce((s, v) => s + v.expectedLoss, 0);

function ChartTooltip({ active, payload, label }: {
    active?: boolean; payload?: { value: number; name: string }[]; label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="font-semibold mb-0.5">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: "var(--accent)" }}>{fmtMoney(p.value)}</p>
            ))}
        </div>
    );
}

export default function ReportsPage() {
    return (
        <div className="px-6 md:px-10 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Financial Risk Report</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Acme Corp · Generated March 9, 2026
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-800"
                    style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                >
                    <FileText size={14} /> Export PDF
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Expected Loss", val: fmtMoney(TOTAL_LOSS), icon: DollarSign, color: "var(--accent)" },
                    { label: "Vulnerabilities", val: String(VULNERABILITIES.length), icon: ShieldAlert, color: "var(--accent)" },
                    { label: "Max Downtime Cost", val: "$864K", icon: TrendingDown, color: "var(--yellow)" },
                    { label: "Est. Compliance Fines", val: "$925K", icon: FileText, color: "var(--orange)" },
                ].map(m => (
                    <div key={m.label} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.label}</span>
                            <m.icon size={14} style={{ color: m.color }} />
                        </div>
                        <div className="text-2xl font-extrabold" style={{ color: m.color }}>{m.val}</div>
                    </div>
                ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Breach cost pie */}
                <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-bold mb-1">Breach Cost Breakdown</h3>
                    <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
                        How a full breach would distribute across cost categories
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={BREACH_COST} dataKey="value" cx="50%" cy="50%" outerRadius={90} strokeWidth={0} nameKey="name">
                                {BREACH_COST.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(v: number) => [fmtMoney(v), "Cost"]}
                                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                            />
                            <Legend
                                iconSize={8} iconType="circle"
                                formatter={v => <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{v}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Downtime bar */}
                <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-bold mb-1">Downtime Cost Scenarios</h3>
                    <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
                        Projected downtime cost at different incident severity levels
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={DOWNTIME_ESTIMATE}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="scenario" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="cost" fill="var(--yellow)" radius={6} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Compliance fines */}
            <div className="rounded-xl p-5 mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-bold mb-1">Estimated Compliance Fines</h3>
                <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
                    Potential regulatory penalties based on identified data exposure risks
                </p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={COMPLIANCE_FINES} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                        <YAxis dataKey="regulation" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={60} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="fine" fill="var(--orange)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Vulnerability fix recommendations */}
            <h2 className="text-lg font-bold mb-4">Vulnerability Fix Recommendations</h2>
            <div className="flex flex-col gap-4">
                {VULNERABILITIES.map((v, i) => (
                    <div
                        key={v.id}
                        className="rounded-xl overflow-hidden"
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-start justify-between gap-4 px-5 py-4"
                            style={{ borderBottom: "1px solid var(--border)" }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--surface)", color: "var(--muted)" }}>
                                    #{i + 1}
                                </span>
                                <div>
                                    <h3 className="font-bold text-sm">{v.title}</h3>
                                    <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{v.file}:{v.line}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="font-extrabold text-sm" style={{ color: "var(--accent)" }}>{fmtMoney(v.expectedLoss)}</div>
                                <div className="text-[11px]" style={{ color: "var(--muted)" }}>expected loss</div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>Description</p>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{v.description}</p>

                                <p className="text-xs font-semibold uppercase tracking-wide mt-3 mb-1.5" style={{ color: "var(--muted)" }}>Suggested Fix</p>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{v.suggestedFix}</p>

                                <div className="flex gap-4 mt-3">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>Fix Cost</div>
                                        <div className="text-sm font-bold" style={{ color: "var(--green)" }}>{fmtMoney(v.fixCost)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>ROI</div>
                                        <div className="text-sm font-bold" style={{ color: "var(--orange)" }}>{v.roi}×</div>
                                    </div>
                                </div>
                            </div>

                            {/* Code snippet */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                                    ✦ AI-Generated Fix
                                </p>
                                <pre
                                    className="rounded-lg p-4 text-xs leading-relaxed overflow-x-auto"
                                    style={{
                                        background: "var(--background)",
                                        border: "1px solid var(--border)",
                                        color: "#a0c0e8",
                                        fontFamily: "ui-monospace, monospace",
                                    }}
                                >
                                    {v.codeSnippet}
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
