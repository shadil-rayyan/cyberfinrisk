"use client";

import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { VULNERABILITIES, RISK_BY_TYPE } from "@/lib/mock-data";
import { fmtMoney } from "@/lib/utils";

const PIE_COLORS = ["#e63946", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

const ROI_DATA = VULNERABILITIES.slice(0, 5).map(v => ({
    name: v.title.substring(0, 14),
    roi: v.roi,
}));

function CT({ active, payload, label }: {
    active?: boolean; payload?: { value: number }[]; label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="font-semibold mb-0.5">{label}</p>
            <p style={{ color: "var(--accent)" }}>{fmtMoney(payload[0]?.value ?? 0)}</p>
        </div>
    );
}

export default function ProjectCharts() {
    return (
        <>
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk by type bar */}
                <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-bold mb-4">Risk by Vulnerability Type</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={RISK_BY_TYPE.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={v => fmtMoney(v)} />
                            <Tooltip content={<CT />} />
                            <Bar dataKey="loss" fill="var(--accent)" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Loss distribution pie */}
                <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <h3 className="text-sm font-bold mb-4">Loss Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={RISK_BY_TYPE.slice(0, 5)} dataKey="loss" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
                                {RISK_BY_TYPE.slice(0, 5).map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend
                                iconSize={8}
                                iconType="circle"
                                formatter={v => <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>{v}</span>}
                            />
                            <Tooltip
                                formatter={(v: number) => [fmtMoney(v), "Loss"]}
                                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ROI horizontal bar */}
            <div className="rounded-xl p-5 mt-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <h3 className="text-sm font-bold mb-1">ROI of Fixing</h3>
                <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
                    Return on investment: how many times does the fix cost pay off
                </p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ROI_DATA} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} width={100} />
                        <Tooltip
                            formatter={(v: number) => [`${v}×`, "ROI"]}
                            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                        />
                        <Bar dataKey="roi" fill="var(--orange)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
