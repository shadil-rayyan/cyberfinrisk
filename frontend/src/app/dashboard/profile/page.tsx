"use client";

import { useState, useEffect } from "react";
import { Save, User, Key, Check, Copy, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [tokens, setTokens] = useState<{id: number, name: string, token: string, created_at: string}[]>([]);
    const [newToken, setNewToken] = useState({ name: "", value: "" });
    const [addingToken, setAddingToken] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.uid}`);
                if (response.ok) {
                    const data = await response.json();
                    setForm({
                        name: data.full_name || user.displayName || "",
                        email: data.email || user.email || "",
                    });
                    setTokens(data.tokens || []);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user?.uid]);

    const handleSaveProfile = async () => {
        if (!user?.uid) return;
        setSaving(true);
        try {
            await fetch(`http://localhost:8000/api/user/${user.uid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ full_name: form.name }),
            });
        } catch (error) {
            console.error("Failed to save profile", error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddToken = async () => {
        if (!user?.uid || !newToken.name) return;
        setAddingToken(true);
        try {
            const response = await fetch(`http://localhost:8000/api/user/${user.uid}/tokens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newToken.name,
                    token: newToken.value || undefined,
                }),
            });
            if (response.ok) {
                const addedToken = await response.json();
                setTokens([...tokens, addedToken]);
                setNewToken({ name: "", value: "" });
            }
        } catch (error) {
            console.error("Failed to add token", error);
        } finally {
            setAddingToken(false);
        }
    };

    const handleDeleteToken = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/tokens/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setTokens(tokens.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete token", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    if (loading) {
        return <div className="p-10 text-zinc-500">Loading profile...</div>;
    }

    return (
        <div className="px-6 md:px-10 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-1">Personal Settings</h1>
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage your profile details and API access credentials.
                    </p>
                </div>
                <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 text-white disabled:opacity-50"
                    style={{ background: "var(--accent)" }}
                >
                    {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            {/* General Profile */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                        <User size={18} style={{ color: "var(--muted-foreground)" }} />
                    </div>
                    <h2 className="text-lg font-bold">Profile Details</h2>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-6 mb-8">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full border-2 border-slate-700" />
                        ) : (
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl"
                                style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}
                            >
                                {form.name[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Profile Identity</h3>
                            <p className="text-[11px] max-w-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                Your profile photo and email are managed via <b>{user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'SSO'}</b> and cannot be changed here.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full rounded-lg px-3.5 py-2 text-sm outline-none transition-all"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                disabled
                                className="w-full rounded-lg px-3.5 py-2 text-sm outline-none transition-colors opacity-60 cursor-not-allowed"
                                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* API Access Tokens */}
            <div className="rounded-xl overflow-hidden mb-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                     <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                        <Key size={18} style={{ color: "var(--muted-foreground)" }} />
                    </div>
                    <h2 className="text-lg font-bold">Personal Access Tokens</h2>
                </div>

                <div className="p-6">
                    {/* Token Creation Form */}
                    <div className="mb-8 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                        <h3 className="text-sm font-bold mb-4">Add New Token</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>Token Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. GitHub Actions" 
                                    value={newToken.name}
                                    onChange={e => setNewToken({ ...newToken, name: e.target.value })}
                                    className="w-full bg-black/20 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="flex-[2]">
                                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted-foreground)" }}>Token Value (optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Keep empty to auto-generate" 
                                    value={newToken.value}
                                    onChange={e => setNewToken({ ...newToken, value: e.target.value })}
                                    className="w-full bg-black/20 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 font-mono"
                                />
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={handleAddToken}
                                    disabled={addingToken || !newToken.name}
                                    className="h-[38px] px-6 rounded-lg text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                >
                                    {addingToken ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tokens List */}
                    <div className="space-y-3">
                        {tokens.length === 0 ? (
                            <p className="text-xs text-center py-4" style={{ color: "var(--muted-foreground)" }}>No active tokens found.</p>
                        ) : (
                            tokens.map(token => (
                                <div key={token.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 group">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm tracking-tight">{token.name}</div>
                                        <div className="flex items-center gap-2 mt-1 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            <span className="truncate max-w-[200px]">{token.token}</span>
                                            <button 
                                                onClick={() => copyToClipboard(token.token)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-zinc-500">
                                        Added {new Date(token.created_at).toLocaleDateString()}
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteToken(token.id)}
                                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
