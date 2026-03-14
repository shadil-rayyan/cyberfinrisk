"use client";

import { useState } from "react";
import { Save, Key, Shield, User, Copy, Check, Plus, Trash2 } from "lucide-react";

export default function ProfilePage() {
    const [form, setForm] = useState({
        name: "Demo User",
        email: "demo@finrisk.app",
        currentPassword: "",
        newPassword: "",
    });

    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const MOCK_TOKENS = [
        { id: "pat_1", name: "GitHub Actions", lastUsed: "2 mins ago", expires: "Never" },
        { id: "pat_2", name: "Local FinRisk CLI", lastUsed: "Yesterday", expires: "In 30 days" },
    ];

    const copyToClipboard = (text: string) => {
        // Mock copy
        setCopiedToken(text);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div className="px-6 md:px-10 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Personal Settings</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage your personal profile, security credentials, and API access.
                    </p>
                </div>
                <button 
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                    style={{ background: "var(--accent)" }}
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>

            {/* General Profile */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <User size={18} style={{ color: "var(--muted-foreground)" }}/> 
                    <h2 className="text-lg font-bold">Profile Details</h2>
                </div>
                
                <div className="p-6">
                    <div className="flex items-start gap-6 mb-8">
                        <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0"
                            style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}
                        >
                            {form.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Profile Photo</h3>
                            <p className="text-xs mb-3 max-w-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                We use Gravatar linked to your email address, or you can upload a custom avatar.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors hover:bg-zinc-800"
                                    style={{ border: "1px solid var(--border)" }}
                                >
                                    Change Avatar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                Full Name
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
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                value={form.email}
                                disabled
                                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors opacity-70 cursor-not-allowed"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
                            />
                            <p className="text-[10px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>Your email address is managed via your SSO provider.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <Shield size={18} style={{ color: "var(--muted-foreground)" }}/> 
                    <h2 className="text-lg font-bold">Security</h2>
                </div>
                
                <div className="p-6">
                    <h3 className="text-sm font-semibold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                Current Password
                            </label>
                            <input 
                                type="password" 
                                value={form.currentPassword}
                                onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                onBlur={e => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                New Password
                            </label>
                            <input 
                                type="password" 
                                value={form.newPassword}
                                onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                onBlur={e => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>
                    </div>
                    <button 
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-zinc-800"
                        style={{ border: "1px solid var(--border)" }}
                    >
                        Update Password
                    </button>

                    <div className="my-8" style={{ borderTop: "1px solid var(--border)" }} />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Two-Factor Authentication (2FA)</h3>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Add an extra layer of security to your account.</p>
                        </div>
                        <button 
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-emerald-500 hover:bg-emerald-500/10"
                            style={{ border: "1px solid rgba(16,185,129,0.3)" }}
                        >
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Access Tokens */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                        <Key size={18} style={{ color: "var(--muted-foreground)" }}/> 
                        <h2 className="text-lg font-bold">Personal Access Tokens</h2>
                    </div>
                    <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors hover:bg-zinc-800"
                        style={{ border: "1px solid var(--border)" }}
                    >
                        <Plus size={14} /> Generate Token
                    </button>
                </div>
                
                <div className="p-0">
                    <p className="text-xs px-6 py-4 leading-relaxed" style={{ color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>
                        Tokens you have generated that can be used to access the FinRisk API. Keep these secret.
                    </p>
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Name</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Last Used</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Expires</th>
                                <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TOKENS.map((token, i) => (
                                <tr 
                                    key={token.id} 
                                    className="hover:bg-zinc-800/50 transition-colors"
                                    style={{ borderBottom: i < MOCK_TOKENS.length - 1 ? "1px solid var(--border)" : "none" }}
                                >
                                    <td className="px-6 py-4 font-medium" style={{ color: "var(--foreground)" }}>
                                        {token.name}
                                        <div className="text-[10px] mt-1 font-mono flex items-center gap-2" style={{ color: "var(--muted)" }}>
                                            fin_pat_•••••••
                                            <button 
                                                onClick={() => copyToClipboard(token.id)}
                                                className="hover:text-white transition-colors"
                                            >
                                                {copiedToken === token.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>{token.lastUsed}</td>
                                    <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>{token.expires}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            className="p-1.5 rounded-md transition-colors text-red-400 hover:bg-red-400/10 inline-flex items-center justify-center"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
