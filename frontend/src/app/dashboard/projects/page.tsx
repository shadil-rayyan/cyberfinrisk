"use client";

import React, { useState, useEffect } from "react";
import { 
    Github, 
    Search, 
    RefreshCw, 
    Trash2, 
    ExternalLink, 
    History, 
    ShieldAlert, 
    ChevronDown, 
    ChevronUp,
    Loader2,
    Lock,
    Globe
} from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import { useOrg } from "@/context/OrgContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Project, ProjectDetail } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";

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

export default function ProjectsPage() {
    const { activeOrg, activeGroup } = useOrg();
    const { user } = useAuth();
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanningAll, setScanningAll] = useState(false);
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const [projectDetails, setProjectDetails] = useState<Record<string, ProjectDetail>>({});
    const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProjects = async () => {
        if (!activeOrg) return;
        setLoading(true);
        try {
            const data = await api.listProjects(activeOrg.id, activeGroup?.id, user?.uid);
            setProjects(data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [activeOrg?.id, activeGroup?.id, user?.uid]);

    const handleScanAll = async () => {
        if (!activeOrg || scanningAll) return;
        setScanningAll(true);
        try {
            await api.scanAllProjects(activeOrg.id, activeGroup?.id, user?.uid);
            await fetchProjects();
        } catch (err) {
            console.error("Scan all failed", err);
        } finally {
            setScanningAll(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this project? Results will be permanently removed.")) return;
        try {
            await api.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete project", err);
        }
    };

    const toggleExpand = async (id: string) => {
        if (expandedProjectId === id) {
            setExpandedProjectId(null);
            return;
        }

        setExpandedProjectId(id);
        if (!projectDetails[id]) {
            setLoadingDetail(id);
            try {
                const detail = await api.getProject(id);
                setProjectDetails(prev => ({ ...prev, [id]: detail }));
            } catch (err) {
                console.error("Failed to fetch project detail", err);
            } finally {
                setLoadingDetail(null);
            }
        }
    };

    const filteredProjects = projects.filter(p => 
        p.repo_url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRepoName = (url: string) => {
        try {
            const parts = url.replace(/\/$/, "").split("/");
            return parts[parts.length - 1];
        } catch {
            return url;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0f11]">
            <TopBar 
                action={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleScanAll}
                            disabled={scanningAll || projects.length === 0}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold text-white transition-all hover:bg-zinc-800 border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: scanningAll ? "var(--accent)" : "transparent" }}
                        >
                            {scanningAll ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            {scanningAll ? "Scanning..." : "Scan all projects"}
                        </button>
                    </div>
                }
            />
            
            <div className="px-8 py-8 md:py-10 max-w-6xl mx-auto w-full flex-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                            {activeGroup ? `${activeGroup.name} Projects` : `${activeOrg?.name} Projects`}
                        </h1>
                        <p className="text-sm text-zinc-400">
                            Monitor and manage security risk across your repositories.
                        </p>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input 
                            type="text"
                            placeholder="Filter by repo name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#15171a] border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={40} className="animate-spin text-[var(--accent)] mb-4" />
                        <p className="text-zinc-400 animate-pulse">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 border-dashed p-20 text-center bg-[#15171a]/50">
                        <div className="bg-zinc-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Github size={30} className="text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
                        <p className="text-zinc-400 max-w-xs mx-auto mb-6 text-sm">
                            {searchTerm ? "No projects match your search criteria." : "Get started by scanning your first repository in the Security Engine."}
                        </p>
                        {!searchTerm && (
                            <a 
                                href="/dashboard/scan"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
                            >
                                <RefreshCw size={16} /> Run First Scan
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map((project) => {
                            const isExpanded = expandedProjectId === project.id;
                            const detail = projectDetails[project.id];
                            
                            return (
                                <div 
                                    key={project.id}
                                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${isExpanded ? "border-zinc-600 bg-[#1a1c1f] ring-1 ring-zinc-600/50 shadow-2xl" : "border-zinc-800 bg-[#15171a] hover:border-zinc-700"}`}
                                >
                                    {/* Header Row */}
                                    <div 
                                        onClick={() => toggleExpand(project.id)}
                                        className="p-5 flex items-center gap-6 cursor-pointer select-none"
                                    >
                                        <div className="flex-shrink-0 bg-zinc-900 w-12 h-12 rounded-lg flex items-center justify-center border border-zinc-800 shadow-inner group">
                                            <Github size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white truncate max-w-[200px]">
                                                    {getRepoName(project.repo_url)}
                                                </h3>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                                                    {project.branch}
                                                </div>
                                                {project.gemini_enabled && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-tighter">
                                                        AI Powered
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                                                <span className="flex items-center gap-1 border-r border-zinc-800 pr-3">
                                                    <History size={12} /> {new Date(project.last_scanned_at || project.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1 border-r border-zinc-800 pr-3">
                                                    <ShieldAlert size={12} className={project.vulnerability_count > 0 ? "text-red-400" : "text-green-400"} />
                                                    {project.vulnerability_count} Vulns
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Lock size={12} /> {project.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex flex-col items-end gap-1 px-6 border-l border-zinc-800">
                                            <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">Expected Loss</span>
                                            <span className="text-lg font-black text-[var(--accent)] font-mono leading-none">
                                                {fmtMoney(project.total_expected_loss)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => handleDelete(e, project.id)}
                                                className="p-2.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="p-2.5 rounded-lg text-zinc-500">
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail View */}
                                    {isExpanded && (
                                        <div className="border-t border-zinc-700/50 bg-[#0d0f11]/50 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                            {loadingDetail === project.id ? (
                                                <div className="flex items-center justify-center py-10 gap-3">
                                                    <Loader2 className="animate-spin text-[var(--accent)]" size={24} />
                                                    <span className="text-sm text-zinc-400">Loading full report...</span>
                                                </div>
                                            ) : detail ? (
                                                <div>
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                                        <div className="lg:col-span-2 space-y-6">
                                                            <div className="bg-[#15171a] rounded-xl p-5 border border-zinc-800">
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                                                    <ShieldAlert size={14} className="text-[var(--accent)]" /> 
                                                                    Vulnerability Profile
                                                                </h4>
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-[13px]">
                                                                        <thead>
                                                                            <tr className="text-left border-b border-zinc-800 text-zinc-500">
                                                                                <th className="pb-3 font-semibold">Type</th>
                                                                                <th className="pb-3 font-semibold">Location</th>
                                                                                <th className="pb-3 font-semibold">Severity</th>
                                                                                <th className="pb-3 font-semibold text-right">E. Loss</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-zinc-800/50">
                                                                            {detail.scan_results.slice(0, 10).map((v, i) => (
                                                                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                                                                    <td className="py-3 font-medium text-zinc-300 group-hover:text-white capitalize">{v.bug_type.replace(/_/g, " ")}</td>
                                                                                    <td className="py-3 font-mono text-[11px] text-zinc-500">{v.file.split("/").pop()}:{v.line}</td>
                                                                                    <td className="py-3"><SevBadge sev={v.severity} /></td>
                                                                                    <td className="py-3 text-right font-bold text-[var(--accent)]">{fmtMoney(v.expected_loss)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                    {detail.scan_results.length > 10 && (
                                                                        <div className="mt-4 text-center text-xs text-zinc-500 bg-zinc-900/50 py-2 rounded-md border border-zinc-800/50">
                                                                            + {detail.scan_results.length - 10} more vulnerabilities not shown in summary
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="bg-[#15171a] rounded-xl p-5 border border-zinc-800">
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                                                    <History size={14} className="text-blue-400" />
                                                                    Business Context
                                                                </h4>
                                                                <div className="space-y-4">
                                                                    <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                                                                        <span className="text-zinc-500">Company</span>
                                                                        <span className="text-zinc-300 font-bold">{(detail.company as any).company_name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                                                                        <span className="text-zinc-500">Industry</span>
                                                                        <span className="text-zinc-300 uppercase text-[11px] font-bold">{(detail.company as any).industry}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                                                                        <span className="text-zinc-500">Exposure</span>
                                                                        <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                                                                            {(detail.company as any).deployment_exposure === "public" ? <Globe size={14} className="text-red-400" /> : <Lock size={14} className="text-green-400" />}
                                                                            {(detail.company as any).deployment_exposure}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-zinc-500">Avg. Loss / Bug</span>
                                                                        <span className="text-[var(--accent)] font-bold">{fmtMoney(detail.total_expected_loss / (detail.vulnerability_count || 1))}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-xl p-5 border border-zinc-800 shadow-xl overflow-hidden relative group">
                                                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Total Financial Risk</h4>
                                                                <div className="text-3xl font-black text-white font-mono mb-1">{fmtMoney(detail.total_expected_loss)}</div>
                                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Projected Annual Liability</div>
                                                                
                                                                <div className="mt-6 pt-6 border-t border-zinc-800/50">
                                                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[13px] font-bold transition-all active:scale-95 shadow-lg border border-zinc-700">
                                                                       View Internal Report <ExternalLink size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {detail.executive_summary && (
                                                        <div className="bg-[#15171a] rounded-xl p-6 border border-zinc-800 relative group overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
                                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-4">Executive Brief</h4>
                                                            <div className="text-sm leading-relaxed text-zinc-300 font-medium italic">
                                                                "{detail.executive_summary}"
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-red-400 text-sm font-medium">
                                                    Failed to load project details. Please try again.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
