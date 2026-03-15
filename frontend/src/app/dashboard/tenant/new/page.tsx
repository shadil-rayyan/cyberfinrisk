"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Loader2 } from "lucide-react";

export default function CreateTenantPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name || name.length < 3) return;
        setLoading(true);
        
        // Mocking tenant creation for now
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard");
        }, 1000);
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
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(217,70,239,0.1)"}}>
                    <Globe size={24} className="text-pink-500" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create a Tenant</h1>
                <p style={{ color: "var(--muted-foreground)" }}>
                    Tenants are the highest level of organization for your company isolation.
                </p>
            </div>

            <div className="rounded-xl mb-10 p-8 sm:p-10" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}>
                <div className="space-y-8">
                    <div>
                        <label className="block text-xs font-black mb-3 uppercase tracking-widest text-zinc-500">
                            Tenant Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Acme Corporation Global"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full rounded-lg px-5 h-14 text-base outline-none transition-all"
                            style={{ 
                                background: "var(--surface2)", 
                                border: "1px solid var(--border)", 
                                color: "var(--foreground)" 
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = "#d946ef";
                                e.target.style.background = "var(--surface)";
                                e.target.style.boxShadow = "0 0 0 2px rgba(217,70,239,0.2)";
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
                    Tenants provide full data and user isolation.
                </span>
                <button 
                    onClick={handleCreate}
                    disabled={loading || name.length < 3}
                    className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white flex items-center gap-2"
                    style={{ 
                        background: name.length > 2 ? "#d946ef" : "var(--muted)", 
                        cursor: (loading || name.length < 3) ? "not-allowed" : "pointer" 
                    }}
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Creating..." : "Create Tenant"}
                </button>
            </div>
        </div>
    );
}
