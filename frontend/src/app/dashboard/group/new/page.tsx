"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { useOrg } from "@/context/OrgContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function CreateGroupPage() {
    const { activeOrg, refetchOrgs } = useOrg();
    const { user } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!name || name.length < 3 || !activeOrg || !user?.uid) return;
        setLoading(true);
        setError(null);
        try {
            await api.createGroup(activeOrg.id, {
                name,
                description: description || undefined,
                creator_uuid: user.uid,
            });
            await refetchOrgs();
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create group.");
            setLoading(false);
        }
    };

    return (
        <div className="px-6 py-12 max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
            <div className="mb-8">
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white mb-6"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)"}}>
                    <Users size={24} className="text-blue-500" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create a Group</h1>
                <p style={{ color: "var(--muted-foreground)" }}>
                    Groups help you organize projects within{" "}
                    <span className="text-white font-semibold">{activeOrg?.name ?? "your organization"}</span>.
                </p>
            </div>

            {error && (
                <div className="mb-6 px-4 py-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
                    {error}
                </div>
            )}

            <div className="rounded-xl mb-10 p-8 sm:p-10" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black mb-3 uppercase tracking-widest text-zinc-500">
                            Group Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Engineering Division"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full rounded-lg px-5 h-14 text-base outline-none transition-all"
                            style={{ 
                                background: "var(--surface2)", 
                                border: "1px solid var(--border)", 
                                color: "var(--foreground)" 
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "var(--blue)";
                                e.target.style.background = "var(--surface)";
                                e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.2)";
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = "var(--border)";
                                e.target.style.background = "var(--surface2)";
                                e.target.style.boxShadow = "none";
                            }}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black mb-3 uppercase tracking-widest text-zinc-500">
                            Description <span className="normal-case tracking-normal font-normal text-zinc-600">(optional)</span>
                        </label>
                        <textarea 
                            placeholder="Describe the purpose of this group..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg px-5 py-3 text-base outline-none transition-all resize-none"
                            style={{ 
                                background: "var(--surface2)", 
                                border: "1px solid var(--border)", 
                                color: "var(--foreground)" 
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "var(--blue)";
                                e.target.style.background = "var(--surface)";
                                e.target.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.2)";
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = "var(--border)";
                                e.target.style.background = "var(--surface2)";
                                e.target.style.boxShadow = "none";
                            }}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    New groups inherit organization-level security policies.
                </span>
                <button 
                    onClick={handleCreate}
                    disabled={loading || name.length < 3 || !activeOrg}
                    className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white flex items-center gap-2"
                    style={{ 
                        background: name.length > 2 ? "var(--blue)" : "var(--muted)", 
                        cursor: (loading || name.length < 3) ? "not-allowed" : "pointer" 
                    }}
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Creating..." : "Create Group"}
                </button>
            </div>
        </div>
    );
}
