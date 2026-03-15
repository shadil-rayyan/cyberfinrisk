import Link from "next/link";
import { ArrowLeft, GitBranch, Clock, DollarSign } from "lucide-react";
import { PROJECTS, VULNERABILITIES } from "@/lib/mock-data";
import { fmtMoney, fmtRange } from "@/lib/utils";
import type { Severity } from "@/lib/mock-data";
import ProjectCharts from "./ProjectCharts";

// ── Severity badge ────────────────────────────────────────────────────────────

const SEV_COLORS: Record<Severity, string> = {
    critical: "#e63946",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
};

function SevBadge({ sev }: { sev: Severity }) {
    return (
        <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{
                background: `${SEV_COLORS[sev]}22`,
                color: SEV_COLORS[sev],
                border: `1px solid ${SEV_COLORS[sev]}44`,
            }}
        >
            {sev}
        </span>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

import TopBar from "@/components/dashboard/TopBar";

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = PROJECTS.find(p => p.id === id);

    if (!project) {
        return (
            <div className="flex flex-col h-full">
                <TopBar />
                <div className="px-10 py-16 text-center">
                    <p className="text-lg font-semibold">Project not found</p>
                    <Link href="/dashboard/projects" className="text-sm mt-4 inline-block" style={{ color: "var(--accent)" }}>
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const totalLoss = VULNERABILITIES.reduce((s, v) => s + v.expectedLoss, 0);
    const totalFix = VULNERABILITIES.reduce((s, v) => s + v.fixCost, 0);

    return (
        <div className="flex flex-col h-full">
            <TopBar />
            <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
                {/* Back */}
                <Link
                    href="/dashboard/projects"
                    className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-80"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    <ArrowLeft size={14} /> Back to Projects
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight mb-1">{project.name}</h1>
                        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <span className="flex items-center gap-1"><GitBranch size={12} /> {project.repoUrl}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {project.lastScan}</span>
                        </div>
                    </div>
                </div>

                {/* Overview metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Expected Loss", val: fmtRange(totalLoss), color: "var(--accent)" },
                        { label: "Total Fix Cost", val: fmtMoney(totalFix), color: "var(--green)" },
                        { label: "Vulnerabilities", val: String(VULNERABILITIES.length) },
                        {
                            label: "Critical Risk",
                            val: String(VULNERABILITIES.filter(v => v.severity === "critical").length),
                            color: "var(--accent)",
                        },
                    ].map(m => (
                        <div key={m.label} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                            <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>{m.label}</div>
                            <div className="text-xl font-extrabold" style={{ color: m.color || "var(--foreground)" }}>{m.val}</div>
                        </div>
                    ))}
                </div>

                {/* Vulnerability Table */}
                <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                        <h2 className="font-bold text-sm">Vulnerabilities</h2>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Ranked by expected financial loss</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    {["Vulnerability", "File", "Severity", "Expected Loss", "Fix Cost", "ROI"].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {VULNERABILITIES.map((v, i) => (
                                    <tr
                                        key={v.id}
                                        className="transition-colors hover:bg-zinc-900"
                                        style={{ borderBottom: i < VULNERABILITIES.length - 1 ? "1px solid var(--border)" : undefined }}
                                    >
                                        <td className="px-5 py-3.5 font-medium">{v.title}</td>
                                        <td className="px-5 py-3.5 text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                                            {v.file}:{v.line}
                                        </td>
                                        <td className="px-5 py-3.5"><SevBadge sev={v.severity} /></td>
                                        <td className="px-5 py-3.5 font-bold" style={{ color: "var(--accent)" }}>{fmtRange(v.expectedLoss)}</td>
                                        <td className="px-5 py-3.5 text-xs" style={{ color: "var(--green)" }}>{fmtMoney(v.fixCost)}</td>
                                        <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--orange)" }}>{v.roi}×</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts (client component) */}
                <ProjectCharts />

                {/* Financial summary */}
                <div className="flex items-center gap-3 mt-6 rounded-xl p-4" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <DollarSign size={16} style={{ color: "var(--green)" }} />
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Fixing all {VULNERABILITIES.length} vulnerabilities costs{" "}
                        <strong style={{ color: "var(--green)" }}>{fmtMoney(totalFix)}</strong> and saves an
                        estimated{" "}
                        <strong style={{ color: "var(--accent)" }}>{fmtMoney(totalLoss)}</strong> in expected losses.
                        That&apos;s a{" "}
                        <strong style={{ color: "var(--orange)" }}>
                            {Math.round(totalLoss / totalFix)}× ROI.
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
