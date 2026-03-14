"use client";

import { useState } from "react";
import { 
    UserPlus, 
    MoreHorizontal, 
    Shield, 
    Mail,
    Search,
    X,
    Send,
    Check
} from "lucide-react";
import { ORGANIZATIONS } from "@/lib/mock-data";

// ── Mock Data for Members ───────────────────────────────────────────────────

const MOCK_MEMBERS = [
    {
        id: "usr_1",
        name: "Alice Administrator",
        email: "alice@acme.com",
        role: "Owner",
        status: "Active",
        teams: ["Frontend Team", "Backend Team", "DevOps"],
        lastActive: "2 mins ago"
    },
    {
        id: "usr_2",
        name: "Bob Builder",
        email: "bob@acme.com",
        role: "Admin",
        status: "Active",
        teams: ["Frontend Team", "Backend Team"],
        lastActive: "1 hour ago"
    },
    {
        id: "usr_3",
        name: "Charlie Charlie",
        email: "charlie@acme.com",
        role: "Developer",
        status: "Active",
        teams: ["Backend Team"],
        lastActive: "Yesterday"
    },
    {
        id: "usr_4",
        name: "Diana Developer",
        email: "diana@acme.com",
        role: "Developer",
        status: "Active",
        teams: ["Frontend Team"],
        lastActive: "3 days ago"
    },
    {
        id: "usr_5",
        name: "Eve External",
        email: "eve@external.com",
        role: "Viewer",
        status: "Invited",
        teams: ["Frontend Team"],
        lastActive: "Never"
    }
];

const TABS = ["All Members", "Admins", "Pending Invites"];

export default function MembersPage() {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteRole, setInviteRole] = useState("Developer");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteTeams, setInviteTeams] = useState<string[]>([]);
    
    // In a real app, this would be the actual org from context/state
    const org = ORGANIZATIONS[1]!;

    const filteredMembers = MOCK_MEMBERS.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              m.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === "Admins") return matchesSearch && (m.role === "Owner" || m.role === "Admin");
        if (activeTab === "Pending Invites") return matchesSearch && m.status === "Invited";
        return matchesSearch;
    });

    return (
        <div className="px-6 md:px-10 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Organization Members</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage access and roles for {org.name}
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                    style={{ background: "var(--accent)" }}
                >
                    <UserPlus size={16} /> Invite Member
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <div className="flex p-1 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
                            style={{
                                background: activeTab === tab ? "var(--card)" : "transparent",
                                color: activeTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "var(--muted)" }} />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none transition-colors"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        onFocus={e => e.target.style.borderColor = "var(--accent)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                </div>
            </div>

            {/* Members Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Member</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Role</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Teams</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Status</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member, i) => (
                                    <tr 
                                        key={member.id} 
                                        className="hover:bg-zinc-800/50 transition-colors"
                                        style={{ borderBottom: i < filteredMembers.length - 1 ? "1px solid var(--border)" : "none" }}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                                                    style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}
                                                >
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--muted)" }}>
                                                        <Mail size={10} /> {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {(member.role === "Owner" || member.role === "Admin") && 
                                                    <Shield size={12} style={{ color: member.role === "Owner" ? "var(--accent)" : "var(--blue)" }} />
                                                }
                                                <span className="font-medium" style={{ color: member.role === "Owner" ? "var(--accent)" : "var(--foreground)" }}>
                                                    {member.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                {member.teams.slice(0, 2).map(t => (
                                                    <span 
                                                        key={t}
                                                        className="text-[10px] px-2 py-0.5 rounded-full border"
                                                        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted-foreground)" }}
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                                {member.teams.length > 2 && (
                                                    <span 
                                                        className="text-[10px] px-2 py-0.5 rounded-full border"
                                                        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted-foreground)" }}
                                                    >
                                                        +{member.teams.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span 
                                                className="text-[11px] font-semibold px-2 py-1 rounded-md"
                                                style={{ 
                                                    background: member.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)", 
                                                    color: member.status === "Active" ? "var(--green)" : "var(--orange)",
                                                }}
                                            >
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button 
                                                className="p-1.5 rounded-md transition-colors hover:bg-zinc-700"
                                                style={{ color: "var(--muted)" }}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        No members found matching your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Invite Modal Overlay */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={() => setShowInviteModal(false)}
                    />
                    
                    {/* Modal Content */}
                    <div 
                        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--border)" }}>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <UserPlus size={18} style={{ color: "var(--accent)" }} /> 
                                Invite to {org.name}
                            </h2>
                            <button 
                                onClick={() => setShowInviteModal(false)}
                                className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-5">
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
                                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                                    autoFocus
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Role
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: "Admin", desc: "Can manage billing, settings, and all projects." },
                                        { id: "Developer", desc: "Can view and scan projects but cannot change billing." },
                                        { id: "Viewer", desc: "Can only view reports and scan results." },
                                    ].map(role => (
                                        <div 
                                            key={role.id}
                                            onClick={() => setInviteRole(role.id)}
                                            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border"
                                            style={{ 
                                                background: inviteRole === role.id ? "rgba(230,57,70,0.05)" : "var(--surface)",
                                                borderColor: inviteRole === role.id ? "var(--accent)" : "var(--border)"
                                            }}
                                        >
                                            <div className="mt-0.5">
                                                <div 
                                                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                                                    style={{ 
                                                        borderColor: inviteRole === role.id ? "var(--accent)" : "var(--muted)",
                                                    }}
                                                >
                                                    {inviteRole === role.id && <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">{role.id}</div>
                                                <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{role.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                                    Teams (Optional)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                                    {org.teams.map(team => (
                                        <div 
                                            key={team.id}
                                            onClick={() => setInviteTeams(prev => prev.includes(team.id) ? prev.filter(t => t !== team.id) : [...prev, team.id])}
                                            className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors border"
                                            style={{ 
                                                background: inviteTeams.includes(team.id) ? "var(--surface2)" : "var(--surface)",
                                                borderColor: inviteTeams.includes(team.id) ? "var(--accent)" : "var(--border)"
                                            }}
                                        >
                                            <div 
                                                className="w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0"
                                                style={{ 
                                                    borderColor: inviteTeams.includes(team.id) ? "var(--accent)" : "var(--muted)",
                                                    background: inviteTeams.includes(team.id) ? "var(--accent)" : "transparent"
                                                }}
                                            >
                                                {inviteTeams.includes(team.id) && <Check size={10} className="text-white" />}
                                            </div>
                                            <div className="text-xs font-semibold truncate">{team.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 flex justify-end gap-3" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
                            <button 
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-zinc-800"
                                style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setShowInviteModal(false)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                                style={{ 
                                    background: inviteEmail ? "var(--accent)" : "var(--muted)",
                                    cursor: inviteEmail ? "pointer" : "not-allowed"
                                }}
                                disabled={!inviteEmail}
                            >
                                <Send size={14} /> Send Invite
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
