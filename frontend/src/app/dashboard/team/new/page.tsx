"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Mail, Plus } from "lucide-react";

export default function CreateTeamPage() {
    const [name, setName] = useState("");
    const [invites, setInvites] = useState([{ email: "", role: "Developer" }]);

    const addInvite = () => setInvites([...invites, { email: "", role: "Developer" }]);

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
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)"}}>
                    <Users size={24} style={{ color: "var(--blue)" }} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create a New Team</h1>
                <p style={{ color: "var(--muted-foreground)" }}>
                    Teams allow you to group projects and manage access for specific groups of users within your organization.
                </p>
            </div>

            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="p-6 sm:p-8" style={{ borderBottom: "1px solid var(--border)" }}>
                    <label className="block text-sm font-bold mb-2">
                        Team Name
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Frontend Engineering"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        onFocus={e => e.target.style.borderColor = "var(--blue)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
                        This team will be created within your currently active organization <strong>Acme Corp</strong>.
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    <h2 className="text-base font-bold mb-4">Invite Members (Optional)</h2>
                    <div className="space-y-3 mb-4">
                        {invites.map((inv, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "var(--muted-foreground)" }} />
                                    <input 
                                        type="email" 
                                        placeholder="colleague@acme.com"
                                        value={inv.email}
                                        onChange={e => {
                                            const newInv = [...invites];
                                            newInv[i]!.email = e.target.value;
                                            setInvites(newInv);
                                        }}
                                        className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-colors"
                                        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                        onFocus={e => e.target.style.borderColor = "var(--blue)"}
                                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                                    />
                                </div>
                                <select 
                                    value={inv.role}
                                    onChange={e => {
                                        const newInv = [...invites];
                                        newInv[i]!.role = e.target.value;
                                        setInvites(newInv);
                                    }}
                                    className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                >
                                    <option>Admin</option>
                                    <option>Developer</option>
                                    <option>Viewer</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={addInvite}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        <Plus size={14} /> Add another invite
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    You can manage team members later in Team Settings.
                </span>
                <Link 
                    href="/dashboard"
                    className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors hover:bg-zinc-800"
                    style={{ 
                        background: name.length > 2 ? "var(--foreground)" : "var(--muted)", 
                        color: name.length > 2 ? "var(--background)" : "rgba(255,255,255,0.3)",
                        cursor: name.length > 2 ? "pointer" : "not-allowed" 
                    }}
                >
                    Create Team
                </Link>
            </div>

        </div>
    );
}
