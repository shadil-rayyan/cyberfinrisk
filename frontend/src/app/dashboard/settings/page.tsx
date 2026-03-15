"use client";

import { useState } from "react";
import { ORGANIZATIONS } from "@/lib/mock-data";
import { Upload, Save, ShieldCheck, Mail, Globe, AlertTriangle } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";

export default function SettingsPage() {
    // In a real app, this would be the actual org from context/state
    const org = ORGANIZATIONS[1]!;
    
    const [form, setForm] = useState({
        name: org.name,
        slug: "acme-corp",
        supportEmail: "security@acme.com",
        domain: "acme.com",
        ssoEnforced: true,
        mfaEnforced: false,
    });

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    <button 
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:opacity-90 text-white"
                        style={{ background: "var(--accent)" }}
                    >
                        <Save size={14} /> Save Changes
                    </button>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Organization Settings</h1>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            Manage configuration, security, and preferences for {org.name}
                        </p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                        <h2 className="text-lg font-bold">General Information</h2>
                    </div>
                    
                    <div className="p-6">
                        {/* Avatar Upload */}
                        <div className="flex items-start gap-6 mb-8">
                            <div 
                                className="w-20 h-20 rounded-xl flex items-center justify-center font-bold text-2xl flex-shrink-0"
                                style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}
                            >
                                {org.name[0]}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Organization Logo</h3>
                                <p className="text-xs mb-3 max-w-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    This logo will be displayed on reports and throughout the dashboard. Recommended size: 256x256px.
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        className="px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors hover:bg-zinc-800"
                                        style={{ border: "1px solid var(--border)" }}
                                    >
                                        <Upload size={14} /> Upload Image
                                    </button>
                                    <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-red-400 transition-colors hover:bg-red-950/30">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Organization Name
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
                                    URL Slug
                                </label>
                                <input 
                                    type="text" 
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    <span className="flex items-center gap-1.5"><Mail size={12}/> Support Email</span>
                                </label>
                                <input 
                                    type="email" 
                                    value={form.supportEmail}
                                    onChange={e => setForm(f => ({ ...f, supportEmail: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    <span className="flex items-center gap-1.5"><Globe size={12}/> Primary Domain</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={form.domain}
                                    onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" size={18} /> Security & Compliance
                        </h2>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}>
                            Enterprise Feature
                        </span>
                    </div>
                    
                    <div className="p-0">
                        {/* SSO Toggle */}
                        <div className="px-6 py-5 flex items-start sm:items-center justify-between gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Enforce Single Sign-On (SSO)</h3>
                                <p className="text-xs max-w-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    Require all organization members to authenticate via your identity provider (e.g., Okta, Google Workspace).
                                </p>
                            </div>
                            <button 
                                onClick={() => setForm(f => ({ ...f, ssoEnforced: !f.ssoEnforced }))}
                                className={`w-10 h-5.5 rounded-full relative transition-colors ${form.ssoEnforced ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                            >
                                <span 
                                    className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${form.ssoEnforced ? 'right-0.5' : 'left-0.5'}`} 
                                />
                            </button>
                        </div>

                        {/* MFA Toggle */}
                        <div className="px-6 py-5 flex items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Require Two-Factor Authentication (2FA)</h3>
                                <p className="text-xs max-w-lg leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    Mandate that all users without an SSO connection must configure 2FA to access projects within this organization.
                                </p>
                            </div>
                            <button 
                                onClick={() => setForm(f => ({ ...f, mfaEnforced: !f.mfaEnforced }))}
                                className={`w-10 h-5.5 rounded-full relative transition-colors ${form.mfaEnforced ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                            >
                                <span 
                                    className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${form.mfaEnforced ? 'right-0.5' : 'left-0.5'}`} 
                                />
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
                    
                    <div className="p-0">
                        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderBottom: "1px solid rgba(220,38,38,0.1)" }}>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Transfer Ownership</h3>
                                <p className="text-xs max-w-md" style={{ color: "var(--muted-foreground)" }}>
                                    Transfer this organization to another user. You will lose owner access.
                                </p>
                            </div>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors hover:bg-zinc-900" style={{ border: "1px solid var(--border)" }}>
                                Transfer Org
                            </button>
                        </div>

                        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">Delete Organization</h3>
                                <p className="text-xs max-w-md" style={{ color: "var(--muted-foreground)" }}>
                                    Permanently delete the {org.name} organization, all teams, projects, and scan history. This action cannot be undone.
                                </p>
                            </div>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap text-red-500 transition-colors hover:bg-red-500/10" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                                Delete Organization
                            </button>
                        </div>
                    </div>
                </div> {/* End Danger Zone */}
            </div> 
        </div> 
    );
}