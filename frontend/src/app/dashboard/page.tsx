"use client";

import { TrendingUp, ShieldAlert, DollarSign, Clock, AlertTriangle } from "lucide-react";
import {
    BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DASHBOARD_METRICS, RISK_BY_TYPE, LOSS_OVER_TIME } from "@/lib/mock-data";
import { fmtMoney } from "@/lib/utils";

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub?: string;
    color?: string;
}) {
    return (
        <div
            className="rounded-xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                <Icon size={16} style={{ color: color || "var(--muted)" }} />
            </div>
            <div className="text-2xl font-extrabold tracking-tight" style={{ color: color || "var(--foreground)" }}>
                {value}
            </div>
            {sub && <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{sub}</div>}
        </div>
    );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: { value: number; name: string }[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="font-semibold mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: "var(--accent)" }}>
                    {typeof p.value === "number" && p.value > 100 ? fmtMoney(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

import TopBar from "@/components/dashboard/TopBar";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const m = DASHBOARD_METRICS;

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    <button 
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:opacity-90 text-white"
                        style={{ background: "var(--accent)" }}
                    >
                        <ShieldAlert size={14} /> Start a new scan
                    </button>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Dashboard</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Security risk overview for Acme Corp
                    </p>
                </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    icon={TrendingUp}
                    label="Total Projects"
                    value={String(m.totalProjects)}
                    sub="3 scanned this week"
                />
                <MetricCard
                    icon={ShieldAlert}
                    label="Total Vulnerabilities"
                    value={String(m.totalVulnerabilities)}
                    sub={`${m.criticalCount} critical`}
                    color="var(--accent)"
                />
                <MetricCard
                    icon={DollarSign}
                    label="Estimated Financial Risk"
                    value={fmtMoney(m.estimatedFinancialRisk)}
                    sub="across all projects"
                    color="var(--accent)"
                />
                <MetricCard
                    icon={Clock}
                    label="Last Scan"
                    value={m.lastScanTime}
                    sub="Payment API"
                />
            </div>

            {/* Alert banner */}
            <div
                className="flex items-start gap-3 rounded-xl p-4 mb-8"
                style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)" }}
            >
                <AlertTriangle size={16} style={{ color: "var(--accent)" }} className="flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                        9 critical vulnerabilities require immediate attention
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        Payment API and Auth Service have unresolved critical risks totalling $1.38M in expected loss.
                    </p>
                </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk by type */}
                <div
                    className="rounded-xl p-5"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                    <h3 className="text-sm font-bold mb-1">Risk by Vulnerability Type</h3>
                    <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>
                        Expected financial loss per category
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={RISK_BY_TYPE} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="loss" fill="var(--accent)" radius={6} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Loss over time */}
                <div
                    className="rounded-xl p-5"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                    <h3 className="text-sm font-bold mb-1">Cumulative Expected Loss</h3>
                    <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>
                        Total financial exposure over the last 7 months
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={LOSS_OVER_TIME} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                            <defs>
                                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip content={<ChartTooltip />} />
                            <Area type="monotone" dataKey="loss" stroke="var(--accent)" fill="url(#lossGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Severity breakdown */}
            <div
                className="rounded-xl p-5 mt-6"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
                <h3 className="text-sm font-bold mb-4">Severity Breakdown</h3>
                <div className="flex gap-8">
                    {[
                        { label: "Critical", count: m.criticalCount, color: "#e63946" },
                        { label: "High", count: m.highCount, color: "#f97316" },
                        { label: "Medium", count: m.mediumCount, color: "#eab308" },
                        { label: "Low", count: m.lowCount, color: "#22c55e" },
                    ].map(s => (
                        <div key={s.label}>
                            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.count}</div>
                            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 rounded-full h-2 flex overflow-hidden gap-0.5">
                    {[
                        { count: m.criticalCount, color: "#e63946" },
                        { count: m.highCount, color: "#f97316" },
                        { count: m.mediumCount, color: "#eab308" },
                        { count: m.lowCount, color: "#22c55e" },
                    ].map((s, i) => (
                        <div
                            key={i}
                            style={{
                                flex: s.count,
                                background: s.color,
                                borderRadius: i === 0 ? "9999px 0 0 9999px" : i === 3 ? "0 9999px 9999px 0" : "0",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}
