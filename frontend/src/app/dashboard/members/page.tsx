"use client";

import { useState, useEffect } from "react";
import { 
    UserPlus, 
    MoreHorizontal, 
    Shield, 
    Mail,
    Search,
    X,
    Send,
    Loader2
} from "lucide-react";
import { useOrg } from "@/context/OrgContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import TopBar from "@/components/dashboard/TopBar";

const TABS = ["All Members", "Admins", "Pending Invites"];

export default function MembersPage() {
    const { activeOrg } = useOrg();
    const { user } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteRole, setInviteRole] = useState("Developer");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviting, setInviting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async () => {
        if (!activeOrg) return;
        setLoading(true);
        try {
            const data = await api.listMembers(activeOrg.id);
            setMembers(data);
        } catch (err: any) {
            console.error("Failed to fetch members:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [activeOrg?.id]);

    const handleInvite = async () => {
        if (!inviteEmail || !activeOrg || !user?.uid) return;
        setInviting(true);
        setError(null);
        try {
            await api.inviteMember(activeOrg.id, {
                invited_email: inviteEmail,
                role: inviteRole,
                inviter_uuid: user.uid,
            });
            setShowInviteModal(false);
            setInviteEmail("");
            // In a real app we might want to show pending invites in the list
            // For now let's just refresh or show success
        } catch (err: any) {
            setError(err.message || "Failed to send invite.");
        } finally {
            setInviting(false);
        }
    };

    const filteredMembers = members.filter(m => {
        const name = m.full_name || "Unknown User";
        const email = m.email || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              email.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === "Admins") return matchesSearch && (m.role === "Owner" || m.role === "Admin");
        // Pending invites logic would need a separate API or filtered list
        if (activeTab === "Pending Invites") return false; 
        return matchesSearch;
    });

    if (!activeOrg) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-zinc-500 text-sm">
                No organization selected.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:opacity-90 text-white"
                        style={{ background: "var(--accent)" }}
                    >
                        <UserPlus size={14} /> Invite Member
                    </button>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Organization Members</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage access and roles for {activeOrg.name}
                    </p>
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
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Status</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-right" style={{ color: "var(--muted-foreground)" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" /> Loading members...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map((member, i) => (
                                    <tr 
                                        key={member.id} 
                                        className="hover:bg-zinc-800/50 transition-colors"
                                        style={{ borderBottom: i < filteredMembers.length - 1 ? "1px solid var(--border)" : "none" }}
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase"
                                                    style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}
                                                >
                                                    {(member.full_name || "U")[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{member.full_name || "Unknown User"}</div>
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
                                            <span 
                                                className="text-[11px] font-semibold px-2 py-1 rounded-md"
                                                style={{ 
                                                    background: "rgba(34,197,94,0.1)", 
                                                    color: "var(--green)",
                                                }}
                                            >
                                                Active
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
                                    <td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
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
                                Invite to {activeOrg.name}
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
                            {error && (
                                <div className="mb-4 px-3 py-2 rounded-lg text-xs text-red-400 bg-red-500/10 border border-red-500/20">
                                    {error}
                                </div>
                            )}

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
                                    disabled={inviting}
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
                                            onClick={() => !inviting && setInviteRole(role.id)}
                                            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border"
                                            style={{ 
                                                background: inviteRole === role.id ? "rgba(230,57,70,0.05)" : "var(--surface)",
                                                borderColor: inviteRole === role.id ? "var(--accent)" : "var(--border)",
                                                opacity: inviting ? 0.7 : 1
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
                        </div>

                        <div className="p-5 flex justify-end gap-3" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
                            <button 
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-zinc-800"
                                style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                                disabled={inviting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleInvite}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white"
                                style={{ 
                                    background: inviteEmail ? "var(--accent)" : "var(--muted)",
                                    cursor: (inviteEmail && !inviting) ? "pointer" : "not-allowed"
                                }}
                                disabled={!inviteEmail || inviting}
                            >
                                {inviting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                {inviting ? "Sending..." : "Send Invite"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            </div>
        </div>
    );
}
