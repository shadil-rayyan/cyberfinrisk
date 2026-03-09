import Link from "next/link";
import { GitBranch, Clock, ExternalLink, Play, FileText } from "lucide-react";
import { PROJECTS } from "@/lib/mock-data";
import { fmtMoney } from "@/lib/utils";
import type { RiskLevel } from "@/lib/mock-data";

function RiskBadge({ risk }: { risk: RiskLevel }) {
    const cfg: Record<RiskLevel, { label: string; bg: string; color: string }> = {
        critical: { label: "Critical", bg: "rgba(230,57,70,0.15)", color: "#e63946" },
        high: { label: "High", bg: "rgba(249,115,22,0.15)", color: "#f97316" },
        medium: { label: "Medium", bg: "rgba(234,179,8,0.15)", color: "#eab308" },
        low: { label: "Low", bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
    };
    const c = cfg[risk];
    return (
        <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}33` }}
        >
            {c.label}
        </span>
    );
}

export default function ProjectsPage() {
    return (
        <div className="px-6 md:px-10 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Projects</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {PROJECTS.length} repositories tracked
                    </p>
                </div>
                <Link
                    href="/dashboard/scan"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--accent)" }}
                >
                    <Play size={14} /> Run New Scan
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {PROJECTS.map(p => (
                    <div
                        key={p.id}
                        className="rounded-xl p-5 flex flex-col gap-4 transition-colors hover:border-zinc-600"
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                        {/* Top */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="font-bold text-sm mb-0.5 truncate">{p.name}</div>
                                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                    <GitBranch size={11} />
                                    <span className="truncate">{p.repoUrl}</span>
                                </div>
                            </div>
                            <RiskBadge risk={p.risk} />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg p-3 text-center" style={{ background: "var(--surface)" }}>
                                <div className="text-base font-extrabold" style={{ color: "var(--accent)" }}>
                                    {fmtMoney(p.estimatedLoss)}
                                </div>
                                <div className="text-[11px]" style={{ color: "var(--muted)" }}>Expected Loss</div>
                            </div>
                            <div className="rounded-lg p-3 text-center" style={{ background: "var(--surface)" }}>
                                <div className="text-base font-extrabold">{p.vulnerabilities}</div>
                                <div className="text-[11px]" style={{ color: "var(--muted)" }}>Vulnerabilities</div>
                            </div>
                        </div>

                        {/* Meta */}
                        <div
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "var(--muted-foreground)", borderTop: "1px solid var(--border)", paddingTop: "12px" }}
                        >
                            <Clock size={11} />
                            Last scan {p.lastScan} · {p.language}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Link
                                href={`/dashboard/project/${p.id}`}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
                                style={{ background: "var(--accent)", color: "white" }}
                            >
                                <ExternalLink size={12} /> Open Project
                            </Link>
                            <Link
                                href="/dashboard/scan"
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-zinc-700"
                                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                            >
                                <Play size={12} />
                            </Link>
                            <Link
                                href="/dashboard/reports"
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-zinc-700"
                                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                            >
                                <FileText size={12} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
