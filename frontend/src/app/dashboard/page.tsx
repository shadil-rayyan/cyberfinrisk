"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShieldAlert, DollarSign, Clock, AlertTriangle, Loader2 } from "lucide-react";
import {
    BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fmtMoney } from "@/lib/utils";
import { api } from "@/lib/api";
import TopBar from "@/components/dashboard/TopBar";
import { useOrg } from "@/context/OrgContext";

// ── Types ────────────────────────────────────────────────────────────────────

interface DashboardMetrics {
    total_projects: number;
    total_vulnerabilities: number;
    total_expected_loss: number;
    total_fix_cost: number;
    total_attack_chains: number;
    last_scan_at: string | null;
    last_scan_display: string;
    last_scan_repo: string;
    severity_breakdown: { critical: number; high: number; medium: number; low: number };
    risk_by_type: { name: string; count: number; loss: number }[];
    loss_over_time: { date: string; loss: number }[];
}

// ── Metric card ──────────────────────────────────────────────────────────────

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

// ── Custom tooltip ───────────────────────────────────────────────────────────

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

// ── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div
            className="rounded-xl p-5 animate-pulse"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
            <div className="h-3 w-24 rounded" style={{ background: "var(--border)" }} />
            <div className="h-7 w-16 rounded mt-3" style={{ background: "var(--border)" }} />
            <div className="h-2 w-20 rounded mt-2" style={{ background: "var(--border)" }} />
        </div>
    );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyDashboard() {
    return (
        <div className="text-center py-20">
            <ShieldAlert size={48} className="mx-auto mb-4" style={{ color: "var(--muted)" }} />
            <h2 className="text-xl font-bold mb-2">No scan data yet</h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
                Run your first scan to see real financial risk metrics here.
            </p>
            <a
                href="/dashboard/scan"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--accent)" }}
            >
                <ShieldAlert size={14} /> Start a scan
            </a>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { activeOrg } = useOrg();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);
                // Don't filter by org_id — old projects were saved without it;
                // Dashboard shows aggregated data across all scans.
                const data = await api.getDashboardMetrics();
                setMetrics(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to load dashboard metrics:", err);
                setError(err.message || "Failed to load metrics");
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    const m = metrics;
    const sev = m?.severity_breakdown;

    return (
        <div className="flex flex-col h-full">
            <TopBar
                action={
                    <a
                        href="/dashboard/scan"
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:opacity-90 text-white"
                        style={{ background: "var(--accent)" }}
                    >
                        <ShieldAlert size={14} /> Start a new scan
                    </a>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Dashboard</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Security risk overview for {activeOrg?.name ?? "your organization"}
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                        </div>
                        <div className="flex items-center justify-center py-12 gap-2" style={{ color: "var(--muted-foreground)" }}>
                            <Loader2 size={16} className="animate-spin" /> Loading metrics…
                        </div>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="text-center py-12">
                        <AlertTriangle size={32} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{error}</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && m && m.total_projects === 0 && <EmptyDashboard />}

                {/* Real data */}
                {!loading && !error && m && m.total_projects > 0 && (
                    <>
                        {/* Metric cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <MetricCard
                                icon={TrendingUp}
                                label="Total Projects"
                                value={String(m.total_projects)}
                                sub={`${m.total_attack_chains} attack chains detected`}
                            />
                            <MetricCard
                                icon={ShieldAlert}
                                label="Total Vulnerabilities"
                                value={String(m.total_vulnerabilities)}
                                sub={`${sev!.critical} critical`}
                                color="var(--accent)"
                            />
                            <MetricCard
                                icon={DollarSign}
                                label="Estimated Financial Risk"
                                value={fmtMoney(m.total_expected_loss)}
                                sub={`Fix cost: ${fmtMoney(m.total_fix_cost)}`}
                                color="var(--accent)"
                            />
                            <MetricCard
                                icon={Clock}
                                label="Last Scan"
                                value={m.last_scan_display}
                                sub={m.last_scan_repo || "—"}
                            />
                        </div>

                        {/* Alert banner — only if critical vulns exist */}
                        {sev!.critical > 0 && (
                            <div
                                className="flex items-start gap-3 rounded-xl p-4 mb-8"
                                style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)" }}
                            >
                                <AlertTriangle size={16} style={{ color: "var(--accent)" }} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                                        {sev!.critical} critical vulnerabilit{sev!.critical === 1 ? "y" : "ies"} require{sev!.critical === 1 ? "s" : ""} immediate attention
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                                        Total expected loss: {fmtMoney(m.total_expected_loss)}. Fixing everything costs only {fmtMoney(m.total_fix_cost)}.
                                    </p>
                                </div>
                            </div>
                        )}

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
                                {m.risk_by_type.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={m.risk_by_type} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="loss" fill="var(--accent)" radius={6} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-xs text-center py-12" style={{ color: "var(--muted)" }}>No data</p>
                                )}
                            </div>

                            {/* Loss over time */}
                            <div
                                className="rounded-xl p-5"
                                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                            >
                                <h3 className="text-sm font-bold mb-1">Expected Loss by Scan Date</h3>
                                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>
                                    Financial exposure from each scan
                                </p>
                                {m.loss_over_time.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <AreaChart data={m.loss_over_time} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                                            <defs>
                                                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#e63946" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Area type="monotone" dataKey="loss" stroke="var(--accent)" fill="url(#lossGrad)" strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-xs text-center py-12" style={{ color: "var(--muted)" }}>Run more scans to see trends</p>
                                )}
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
                                    { label: "Critical", count: sev!.critical, color: "#e63946" },
                                    { label: "High", count: sev!.high, color: "#f97316" },
                                    { label: "Medium", count: sev!.medium, color: "#eab308" },
                                    { label: "Low", count: sev!.low, color: "#22c55e" },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.count}</div>
                                        <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            {(sev!.critical + sev!.high + sev!.medium + sev!.low) > 0 && (
                                <div className="mt-4 rounded-full h-2 flex overflow-hidden gap-0.5">
                                    {[
                                        { count: sev!.critical, color: "#e63946" },
                                        { count: sev!.high, color: "#f97316" },
                                        { count: sev!.medium, color: "#eab308" },
                                        { count: sev!.low, color: "#22c55e" },
                                    ].filter(s => s.count > 0).map((s, i, arr) => (
                                        <div
                                            key={i}
                                            style={{
                                                flex: s.count,
                                                background: s.color,
                                                borderRadius: i === 0 ? "9999px 0 0 9999px" : i === arr.length - 1 ? "0 9999px 9999px 0" : "0",
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
