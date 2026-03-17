"use client";

import React, { useState, useEffect, use } from "react";
import { 
    ChevronLeft,
    ShieldAlert, 
    History, 
    Lock,
    Globe,
    ExternalLink,
    Shield,
    Zap,
    AlertCircle,
    Loader2,
    RefreshCw,
    ChevronDown,
    X,
    Pencil
} from "lucide-react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/dashboard/TopBar";
import { api } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import { ExecReport } from "@/components/report/ExecReport";

// ── Components ──────────────────────────────────────────────────────────────

const SEV_COLORS: Record<string, string> = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
};

function SevBadge({ sev }: { sev: string }) {
    const s = sev.toLowerCase();
    return (
        <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider"
            style={{ background: `${SEV_COLORS[s] || "#71717a"}22`, color: SEV_COLORS[s] || "#71717a", border: `1px solid ${SEV_COLORS[s] || "#71717a"}44` }}
        >
            {sev}
        </span>
    );
}

/**
 * Simple component to render text that might contain code blocks.
 */
function MarkdownFix({ content, className = "" }: { content: string, className?: string }) {
    if (!content) return null;
    
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return (
        <div className={`space-y-3 ${className}`}>
            {parts.map((part, i) => {
                if (part.startsWith("```")) {
                    const codeMatch = part.match(/```(?:\w+)?\n?([\s\S]*?)```/);
                    const codeSnippet = (codeMatch && codeMatch[1]) ? codeMatch[1].trim() : (part ? part.replace(/```(?:\w+)?\n?/g, "").replace(/```/g, "").trim() : "");
                    if (!codeSnippet) return null;
                    return (
                        <div key={i} className="relative group">
                            <pre className="p-4 rounded-lg bg-[#09090b] border border-zinc-800 text-[12px] font-mono text-zinc-300 overflow-x-auto custom-scrollbar leading-relaxed">
                                {codeSnippet}
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">Code Fix</span>
                            </div>
                        </div>
                    );
                }
                
                // Handle bold/italics/headers/lists very simply for this specific context
                const lines = part.split("\n").filter(l => l.trim() !== "");
                return (
                    <div key={i} className="space-y-4">
                        {lines.map((line, li) => {
                            // Headers
                            if (line.startsWith("# ")) return <h1 key={li} className="text-2xl font-black text-white mt-6 mb-2">{line.replace("# ", "")}</h1>;
                            if (line.startsWith("## ")) return <h2 key={li} className="text-xl font-bold text-white mt-5 mb-1">{line.replace("## ", "")}</h2>;
                            if (line.startsWith("### ")) return <h3 key={li} className="text-lg font-bold text-white mt-4">{line.replace("### ", "")}</h3>;
                            if (line.startsWith("#### ")) return <h4 key={li} className="text-sm font-bold text-zinc-200 mt-2 uppercase tracking-wider">{line.replace("#### ", "")}</h4>;
                            
                            // Blockquotes
                            if (line.startsWith("> ")) return <blockquote key={li} className="border-l-2 border-[var(--accent)] pl-4 py-2 italic text-zinc-400 text-sm bg-zinc-900/50 rounded-r-lg">{line.replace("> ", "").replace(/"/g, "")}</blockquote>;
                            
                            // Lists
                            if (line.startsWith("- ")) return <li key={li} className="text-sm text-zinc-300 ml-4 list-disc marker:text-[var(--accent)]">{line.replace("- ", "")}</li>;
                            
                            // Mixed Text (Bolding)
                            // This splits the line by ** as a delimiter and alternates between normal text and bold text
                            const segments = line.split(/(\*\*.*?\*\*)/);
                            return (
                                <p key={li} className="text-sm text-zinc-300 leading-relaxed">
                                    {segments.map((seg, si) => {
                                        if (seg.startsWith("**") && seg.endsWith("**")) {
                                            return <strong key={si} className="text-white font-bold">{seg.slice(2, -2)}</strong>;
                                        }
                                        return seg;
                                    })}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    
    const [detail, setDetail] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVulnId, setSelectedVulnId] = useState<number | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState({ message: "", percent: 0 });
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);

    const fetchProject = async () => {
        try {
            const data = await api.getProject(id);
            setDetail(data);
        } catch (err) {
            console.error("Failed to fetch project:", err);
            setError("Project not found or access denied.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const handleUpdateContext = async (company: any) => {
        try {
            const updated = await api.updateProjectContext(id, company);
            setDetail(updated);
            setIsContextModalOpen(false);
        } catch (err: any) {
            console.error("Failed to update context:", err);
            alert("Failed to update context: " + err.message);
        }
    };

    const handleRescan = async () => {
        if (!detail) return;
        setScanning(true);
        setScanProgress({ message: "Initializing rescan...", percent: 0 });

        try {
            await api.scanRepoStream({
                repo_url: detail.repo_url,
                branch: detail.branch,
                company: detail.company as any,
                org_id: detail.org_id,
                group_id: detail.group_id,
                user_uuid: detail.created_by,
                project_id: detail.id,
                gemini_api_key: localStorage.getItem("gemini_api_key"),
            }, (msg) => {
                if (msg.status === "progress") {
                    setScanProgress({ 
                        message: msg.message || "Scanning...", 
                        percent: msg.percent || 0 
                    });
                } else if (msg.status === "done") {
                    setScanning(false);
                    fetchProject();
                } else if (msg.status === "error") {
                    throw new Error(msg.message);
                }
            });
        } catch (err: any) {
            console.error("Rescan failed:", err);
            alert("Rescan failed: " + err.message);
            setScanning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-[#0d0f11]">
                <TopBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-[var(--accent)] mb-4" />
                    <p className="text-zinc-400">Analyzing repository data...</p>
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="flex flex-col h-full bg-[#0d0f11]">
                <TopBar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <ShieldAlert size={48} className="text-red-500 mb-4 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-zinc-400 mb-6 max-w-sm">{error || "Unable to load project details."}</p>
                    <button 
                        onClick={() => router.push("/dashboard/projects")}
                        className="px-6 py-2 rounded-lg bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const getRepoName = (url: string) => {
        try {
            const parts = url.replace(/\/$/, "").split("/");
            return parts[parts.length - 1];
        } catch {
            return url;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0f11] overflow-hidden">
            <TopBar />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-8 py-8 max-w-7xl mx-auto w-full">
                    {/* Back button & Breadcrumbs */}
                    <button 
                        onClick={() => router.push("/dashboard/projects")}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group text-sm font-medium"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </button>

                    {/* Project Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-10 border-b border-zinc-800/50">
                        <div className="flex items-start gap-5">
                            <div className="bg-zinc-900 w-16 h-16 rounded-xl flex items-center justify-center border border-zinc-800 shadow-xl">
                                <Shield size={32} className="text-[var(--accent)]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-black text-white tracking-tight">
                                        {getRepoName(detail.repo_url)}
                                    </h1>
                                    <SevBadge sev={detail.vulnerability_count > 0 ? "critical" : "low"} />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-zinc-500">
                                        {detail.branch}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <History size={14} /> Scan completed on {new Date(detail.last_scanned_at || detail.created_at).toLocaleDateString()}
                                    </span>
                                    <a 
                                        href={detail.repo_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                                    >
                                        <ExternalLink size={14} /> View Source
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block mr-4">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Financial Exposure</div>
                                <div className="text-2xl font-black text-[var(--accent)] font-mono">{fmtMoney(detail.total_expected_loss)}</div>
                            </div>
                            <button 
                                onClick={handleRescan}
                                disabled={scanning}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all border border-zinc-700 disabled:opacity-50"
                            >
                                {scanning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                {scanning ? "Scanning..." : "Rescan"}
                            </button>
                            <button 
                                onClick={() => setIsReportOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:brightness-110 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-500/20"
                            >
                                <History size={14} />
                                Executive Report
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 space-y-10">
                            
                            {/* Vulnerability List */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <ShieldAlert size={20} className="text-[var(--accent)]" />
                                        Vulnerability Analysis
                                    </h2>
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                        Showing {detail.vulnerability_count} findings
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {detail.scan_results.map((v, i) => {
                                        const isExpanded = selectedVulnId === i;
                                        return (
                                            <div 
                                                key={i} 
                                                className={`rounded-xl border transition-all duration-200 overflow-hidden ${isExpanded ? "border-zinc-500 bg-[#15171a] shadow-xl" : "border-zinc-800 bg-[#0d0f11] hover:border-zinc-700"}`}
                                            >
                                                <div 
                                                    onClick={() => setSelectedVulnId(isExpanded ? null : i)}
                                                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: SEV_COLORS[v.severity.toLowerCase()] }} />
                                                        <div>
                                                            <h4 className="font-bold text-white capitalize text-[15px] mb-1">
                                                                {v.bug_type.replace(/_/g, " ")}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                                                                <span>{v.file}:{v.line}</span>
                                                                <span className="text-zinc-700">|</span>
                                                                <span className="text-[var(--accent)] font-bold">{fmtMoney(v.expected_loss)} Impact</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <SevBadge sev={v.severity} />
                                                        <div className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                                                            <ChevronDown size={20} className="text-zinc-600" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="px-5 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="pt-4 border-t border-zinc-800/50 space-y-6">
                                                            {/* AI Insights Bar */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#09090b] border border-zinc-800">
                                                                <div>
                                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Risk Adjusted</div>
                                                                    <div className="text-sm font-bold text-white">{Math.round(v.effective_probability * 100)}%</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">ROI of Fix</div>
                                                                    <div className="text-sm font-bold text-green-400">{v.roi_of_fixing}x</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Fix Effort</div>
                                                                    <div className="text-sm font-bold text-zinc-300">{v.fix_effort_hours}h</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Complexity</div>
                                                                    <div className="text-sm font-bold text-zinc-300 capitalize">{v.gemini_analysis?.fix_complexity || "Unknown"}</div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-3">
                                                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Business Impact</h5>
                                                                    <MarkdownFix content={v.business_brief} />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-green-500">Remediation Recommendation</h5>
                                                                    <MarkdownFix content={v.gemini_analysis?.recommended_fix || "Consult scanner documentation or CVE database for specific remediation steps."} />
                                                                </div>
                                                            </div>

                                                            {v.gemini_analysis?.exploitability_reasoning && (
                                                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
                                                                        <Zap size={10} /> Exploitability Reasoning
                                                                    </h5>
                                                                    <p className="text-[13px] text-blue-100/80 leading-relaxed">
                                                                        {v.gemini_analysis.exploitability_reasoning}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Attack Chains */}
                            {detail.attack_chains.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <AlertCircle size={20} className="text-orange-400" />
                                            Exploitable Attack Chains
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        {detail.attack_chains.map((chain, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-orange-600/5 border border-orange-500/20 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <AlertCircle size={80} className="text-orange-500" />
                                                </div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Critical Breach Path Detection</div>
                                                        <h4 className="text-lg font-bold text-white italic">"{chain.chain_description}"</h4>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black text-[var(--accent)] font-mono">{fmtMoney(chain.combined_expected_loss)}</div>
                                                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Aggregated Liability</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 mt-8 flex-wrap">
                                                    {chain.chain_steps.map((step, si) => (
                                                        <React.Fragment key={si}>
                                                            <div className="px-4 py-2 rounded-lg bg-[#09090b] border border-zinc-800 text-[11px] font-bold text-zinc-300 shadow-lg">
                                                                {step}
                                                            </div>
                                                            {si < chain.chain_steps.length - 1 && (
                                                                <ArrowRight size={14} className="text-zinc-700" />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Executive Summary Mini */}
                             {detail.executive_summary && (
                                <div className="bg-[#15171a] rounded-2xl p-6 border border-zinc-800 relative shadow-2xl overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--accent)]" />
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--accent)]">Executive Brief</h4>
                                        <Shield size={14} className="text-zinc-700" />
                                    </div>
                                    <MarkdownFix content={detail.executive_summary} className="!space-y-2 opacity-90" />
                                </div>
                            )}

                            {/* Risk Overview Table */}
                            <div className="bg-[#15171a] rounded-2xl p-6 border border-zinc-800 shadow-xl">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <History size={14} className="text-zinc-600" /> 
                                        Internal Risk Context
                                    </div>
                                    <button 
                                        onClick={() => setIsContextModalOpen(true)}
                                        className="p-1.5 rounded hover:bg-zinc-800 text-zinc-600 hover:text-white transition-colors"
                                        title="Edit Context"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </h4>
                                <div className="space-y-4">
                                    <RiskRow label="Organization" value={(detail.company as any).company_name} />
                                    <RiskRow label="Asset Industry" value={(detail.company as any).industry} />
                                    <RiskRow 
                                        label="System Exposure" 
                                        value={(detail.company as any).deployment_exposure} 
                                        icon={(detail.company as any).deployment_exposure === "public" ? <Globe size={14} className="text-red-400" /> : <Lock size={14} className="text-green-400" />}
                                    />
                                    <RiskRow label="Avg. Loss per Vuln" value={fmtMoney(detail.total_expected_loss / (detail.vulnerability_count || 1))} highlight />
                                    <RiskRow label="Estimated Remediation" value={fmtMoney(detail.total_fix_cost)} />
                                </div>
                                <div className="mt-8 pt-8 border-t border-zinc-800">
                                    <h5 className="text-[10px] font-bold text-zinc-500 uppercase mb-4">Affected Data Types</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {((detail.company as any).sensitive_data_types || []).map((t: string) => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                                                {t.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Risk Score Widget */}
                            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border border-zinc-800 shadow-2xl text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-red-500/5 opacity-20" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Financial Risk</div>
                                    <div className="text-4xl font-black text-white font-mono mb-2">{fmtMoney(detail.total_expected_loss)}</div>
                                    <div className="text-[11px] text-[var(--accent)] font-bold uppercase tracking-tighter mb-6">High Risk Exposure</div>
                                    
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-6">
                                        <div 
                                            className="h-full bg-[var(--accent)] shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                                            style={{ width: `${Math.min(100, (detail.total_expected_loss / 100000) * 100)}%` }} 
                                        />
                                    </div>

                                    <button 
                                        onClick={() => window.print()}
                                        className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-white text-black font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={16} /> PDF Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Progress Overlay */}
            {scanning && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="bg-[#0f1117] w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-200">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                            <div 
                                className="absolute inset-0 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" 
                                style={{ animationDuration: '2s' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white">{scanProgress.percent}%</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">Analyzing Repository</h3>
                        <p className="text-sm text-zinc-500 text-center mb-6">
                            {scanProgress.message}
                        </p>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[var(--accent)] transition-all duration-500 shadow-[0_0_10px_rgba(230,57,70,0.5)]"
                                style={{ width: `${scanProgress.percent}%` }}
                            />
                        </div>
                        <p className="mt-6 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                            Updating security findings & financial risk models
                        </p>
                    </div>
                </div>
            )}

            {/* Full Report Modal */}
            {isReportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="bg-[#0f1117] w-full max-w-5xl max-h-full rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-none">Executive Security Risk Assessment</h3>
                                    <p className="text-xs text-zinc-500 mt-1">{detail.repo_url} / {detail.branch}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsReportOpen(false)}
                                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <ExecReport 
                                results={{
                                    results: detail.scan_results,
                                    attack_chains: detail.attack_chains,
                                    executive_summary: detail.executive_summary,
                                    total_expected_loss: detail.total_expected_loss,
                                    total_fix_cost: detail.total_fix_cost,
                                    vulnerability_count: detail.vulnerability_count,
                                    filtered_count: detail.filtered_count,
                                    gemini_enabled: detail.gemini_enabled
                                }}
                                companyName={(detail.company as any).company_name}
                                repoUrl={detail.repo_url}
                                scanDate={new Date(detail.created_at).toLocaleDateString()}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                            <div className="text-xs text-zinc-500 font-medium">
                                Confidential: Board of Directors Strategic Assessment
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => window.print()}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-zinc-300 hover:text-white transition-colors"
                                >
                                    Print PDF
                                </button>
                                <button 
                                    onClick={() => setIsReportOpen(false)}
                                    className="px-6 py-2 rounded-lg text-sm font-black bg-white text-black hover:bg-zinc-200 transition-colors"
                                >
                                    Close Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Context Edit Modal */}
            <CompanyContextModal 
                isOpen={isContextModalOpen}
                onClose={() => setIsContextModalOpen(false)}
                currentContext={detail.company}
                onSave={handleUpdateContext}
            />
        </div>
    );
}

function CompanyContextModal({ 
    isOpen, 
    onClose, 
    currentContext, 
    onSave 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    currentContext: any, 
    onSave: (ctx: any) => void 
}) {
    const [ctx, setCtx] = useState(currentContext);

    useEffect(() => {
        if (isOpen) setCtx(currentContext);
    }, [isOpen, currentContext]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#15171a] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
                <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="font-bold text-white">Edit Company Context</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">Organization Name</label>
                        <input 
                            type="text" 
                            value={ctx.company_name} 
                            onChange={e => setCtx({...ctx, company_name: e.target.value})}
                            className="w-full bg-[#0d0f11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--accent)] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">Industry</label>
                        <input 
                            type="text" 
                            value={ctx.industry} 
                            onChange={e => setCtx({...ctx, industry: e.target.value})}
                            className="w-full bg-[#0d0f11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--accent)] outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">Deployment Exposure</label>
                        <select 
                            value={ctx.deployment_exposure} 
                            onChange={e => setCtx({...ctx, deployment_exposure: e.target.value})}
                            className="w-full bg-[#0d0f11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--accent)] outline-none transition-colors"
                        >
                            <option value="public">Public (Internet Facing)</option>
                            <option value="internal">Internal (Private Network)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">Sensitive Data Types (Comma Separated)</label>
                        <input 
                            type="text" 
                            value={(ctx.sensitive_data_types || []).join(", ")} 
                            onChange={e => setCtx({...ctx, sensitive_data_types: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")})}
                            className="w-full bg-[#0d0f11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--accent)] outline-none transition-colors"
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={() => onSave(ctx)}
                        className="px-6 py-2 rounded-lg bg-[var(--accent)] text-white font-bold text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-all outline-none"
                    >
                        Save Context
                    </button>
                </div>
            </div>
        </div>
    );
}

function RiskRow({ label, value, icon, highlight }: { label: string, value: string, icon?: React.ReactNode, highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center text-sm py-1">
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className={`flex items-center gap-1.5 font-bold ${highlight ? "text-[var(--accent)]" : "text-zinc-300"}`}>
                {icon}
                {value}
            </span>
        </div>
    );
}

function ArrowRight({ className, size }: { className?: string, size?: number }) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}
