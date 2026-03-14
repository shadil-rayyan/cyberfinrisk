"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Shield, CheckCircle } from "lucide-react";

export default function CreateOrganizationPage() {
    const [form, setForm] = useState({
        name: "",
        slug: "",
    });

    const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "enterprise">("pro");

    const PLANS = [
        { id: "free", name: "Free", price: "$0", desc: "For individuals", features: ["1 Project", "100 Scans/mo", "Basic Rules"] },
        { id: "pro", name: "Pro", price: "$249", desc: "For teams", features: ["25 Projects", "1k Scans/mo", "FinRisk Engine"] },
        { id: "enterprise", name: "Enterprise", price: "Custom", desc: "For large orgs", features: ["Unlimited", "Custom Rules", "SSO & Audit Logs"] },
    ] as const;

    return (
        <div className="px-6 py-12 max-w-3xl mx-auto min-h-screen flex flex-col justify-center">
            
            <div className="mb-8">
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white mb-6"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(230,57,70,0.1)"}}>
                    <Building2 size={24} style={{ color: "var(--accent)" }} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create an Organization</h1>
                <p style={{ color: "var(--muted-foreground)" }}>
                    Organizations allow you to group teams, manage billing, and enforce security policies across your company.
                </p>
            </div>

            <div className="rounded-xl overflow-hidden mb-8 p-6 sm:p-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Organization Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Acme Corp"
                            value={form.name}
                            onChange={e => {
                                const val = e.target.value;
                                setForm({ name: val, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                            }}
                            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                            onFocus={e => e.target.style.borderColor = "var(--accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--border)"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Organization URL Slug
                        </label>
                        <div className="flex pr-2 rounded-lg items-center transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} >
                            <span className="px-4 text-sm font-medium" style={{ color: "var(--muted-foreground)", borderRight: "1px solid var(--border)" }}>
                                finrisk.app/
                            </span>
                            <input 
                                type="text" 
                                placeholder="acme-corp"
                                value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                                className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                                style={{ color: "var(--foreground)" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Select a Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PLANS.map(plan => (
                    <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className="rounded-xl p-5 cursor-pointer transition-all hover:border-zinc-500 relative overflow-hidden"
                        style={{ 
                            background: "var(--card)", 
                            border: `2px solid ${selectedPlan === plan.id ? 'var(--accent)' : 'var(--border)'}`,
                        }}
                    >
                        {selectedPlan === plan.id && (
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-white" style={{ background: "var(--accent)", borderBottomLeftRadius: "8px" }}>
                                <CheckCircle size={14} />
                            </div>
                        )}
                        <h3 className="text-sm font-bold mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-extrabold">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>/mo</span>}
                        </div>
                        <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>{plan.desc}</p>
                        
                        <ul className="space-y-2">
                            {plan.features.map(f => (
                                <li key={f} className="text-xs flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}>
                                    <Shield size={12} style={{ color: "var(--muted)" }} /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    You will become the Owner of this organization.
                </span>
                <Link 
                    href="/dashboard"
                    className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                    style={{ background: form.name.length > 2 ? "var(--accent)" : "var(--muted)", cursor: form.name.length > 2 ? "pointer" : "not-allowed" }}
                >
                    Create Organization
                </Link>
            </div>

        </div>
    );
}
