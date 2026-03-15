"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Users, ShieldCheck, AlertTriangle } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import { useOrg } from "@/context/OrgContext";
import { api } from "@/lib/api";

export default function GroupSettingsPage() {
    const router = useRouter();
    const { activeGroup, activeOrg, refetchOrgs } = useOrg();

    const [form, setForm] = useState({
        name: activeGroup?.name ?? "",
        description: activeGroup?.description ?? "",
        autoScan: activeGroup?.auto_scan ?? true,
        enforcePolicies: activeGroup?.enforce_policies ?? false,
    });

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!activeGroup || !activeOrg) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-zinc-500 text-sm">
                No group selected.
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await api.updateGroup(activeGroup.id, {
                name: form.name,
                description: form.description,
                auto_scan: form.autoScan,
                enforce_policies: form.enforcePolicies,
            });
            await refetchOrgs();
        } catch (err: any) {
            setError(err.message || "Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${activeGroup.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await api.deleteGroup(activeGroup.id);
            await refetchOrgs();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to delete group.");
            setDeleting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:opacity-90 text-white disabled:opacity-50"
                        style={{ background: "var(--accent)" }}
                    >
                        {saving ? "Saving..." : <><Save size={14} /> Save Changes</>}
                    </button>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Group Settings</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage settings for <span className="text-white font-semibold">{activeGroup.name}</span> within <span className="text-white font-semibold">{activeOrg.name}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* General Section */}
                <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="px-6 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                        <Users size={18} style={{ color: "var(--muted-foreground)" }} />
                        <h2 className="text-lg font-bold">General Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Group Name
                                </label>
                                <input 
                                    type="text" 
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Description (Internal Use)
                                </label>
                                <textarea 
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors resize-none"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Policies Section */}
                <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="text-blue-500" size={18} /> Group Policies
                        </h2>
                    </div>
                    <div className="p-0">
                        <div className="px-6 py-5 flex items-start sm:items-center justify-between gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Automated Security Scanning</h3>
                                <p className="text-xs max-w-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    Automatically trigger scans for all projects within this group when changes are detected.
                                </p>
                            </div>
                            <button 
                                onClick={() => setForm(f => ({ ...f, autoScan: !f.autoScan }))}
                                className={`w-10 h-5.5 rounded-full relative transition-colors flex-shrink-0 ${form.autoScan ? 'bg-blue-500' : 'bg-zinc-700'}`}
                            >
                                <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${form.autoScan ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                        </div>
                        <div className="px-6 py-5 flex items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Strict Policy Enforcement</h3>
                                <p className="text-xs max-w-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    Block pull requests if any critical vulnerabilities are found within projects in this group.
                                </p>
                            </div>
                            <button 
                                onClick={() => setForm(f => ({ ...f, enforcePolicies: !f.enforcePolicies }))}
                                className={`w-10 h-5.5 rounded-full relative transition-colors flex-shrink-0 ${form.enforcePolicies ? 'bg-blue-500' : 'bg-zinc-700'}`}
                            >
                                <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${form.enforcePolicies ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(220,38,38,0.02)", border: "1px solid rgba(220,38,38,0.2)" }}>
                    <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(220,38,38,0.1)" }}>
                        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--red)" }}>
                            <AlertTriangle size={18} /> Danger Zone
                        </h2>
                    </div>
                    <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Delete Group</h3>
                            <p className="text-xs max-w-md" style={{ color: "var(--muted-foreground)" }}>
                                Permanently delete the <strong>{activeGroup.name}</strong> group and all its associated projects. This cannot be undone.
                            </p>
                        </div>
                        <button 
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50" 
                            style={{ border: "1px solid rgba(239,68,68,0.3)" }}
                        >
                            {deleting ? "Deleting..." : "Delete Group"}
                        </button>
                    </div>
                </div>
            </div> 
        </div> 
    );
}
