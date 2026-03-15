"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    LogIn, 
    ArrowRight,
    UserCircle,
    LogOut,
    AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

export default function AcceptInvitePage() {
    const { token } = useParams();
    const router = useRouter();
    const { user, logout, loginWithGoogle } = useAuth();
    const { refetchOrgs } = useOrg();
    
    const [status, setStatus] = useState<"loading" | "preview" | "success" | "error">("loading");
    const [inviteData, setInviteData] = useState<{ org_name: string, invited_email: string, status: string } | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    // 1. Load invite details
    useEffect(() => {
        if (!token || token === "None") {
            setStatus("error");
            setErrorMsg("This invitation link is invalid (missing token). Please request a new invite.");
            return;
        }

        const loadInvite = async () => {
            try {
                const data = await api.getInvite(token as string);
                setInviteData(data);
                setStatus("preview");
            } catch (err: any) {
                console.error("Failed to load invite:", err);
                setStatus("error");
                setErrorMsg(err.message || "This invitation is invalid or has already been used.");
            }
        };

        loadInvite();
    }, [token]);

    const handleAccept = async () => {
        if (!user?.uid || !token) return;
        setIsJoining(true);
        try {
            await api.acceptInvite(token as string, user.uid);
            setStatus("success");
            refetchOrgs();
        } catch (err: any) {
            console.error("Failed to accept invite:", err);
            setStatus("error");
            setErrorMsg(err.message || "Failed to join organization.");
        } finally {
            setIsJoining(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        // The page will re-evaluate and show the "Log In" state
    };

    const isEmailMismatch = user && inviteData && user.email?.toLowerCase() !== inviteData.invited_email.toLowerCase();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div 
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
                {status === "loading" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-accent" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold mb-2">Loading Invitation...</h1>
                        </div>
                    </>
                )}

                {status === "preview" && inviteData && (
                    <>
                        {isEmailMismatch ? (
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <UserCircle size={32} />
                            </div>
                        )}
                        
                        <div>
                            <h1 className="text-xl font-bold mb-1">
                                {isEmailMismatch ? "Wrong Account Logged In" : "Organization Invite"}
                            </h1>
                            <p className="text-sm text-zinc-400">
                                You have been invited to join <span className="text-white font-semibold">{inviteData.org_name}</span>
                            </p>
                        </div>

                        <div className="w-full text-left space-y-3">
                            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Invited Email</p>
                                <p className="text-sm font-medium text-zinc-200">{inviteData.invited_email}</p>
                            </div>

                            {user && (
                                <div className={`p-4 rounded-xl border ${isEmailMismatch ? 'bg-red-500/5 border-red-500/20' : 'bg-zinc-900/50 border-zinc-800'}`}>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Current Account</p>
                                    <p className="text-sm font-medium text-zinc-200">{user.email}</p>
                                </div>
                            )}
                        </div>

                        {!user ? (
                            <div className="w-full space-y-4">
                                <p className="text-sm text-zinc-500 font-medium">Please log in with <span className="text-accent">{inviteData.invited_email}</span> to join.</p>
                                <button
                                    onClick={async () => {
                                        try {
                                            await loginWithGoogle();
                                        } catch (err) {
                                            console.error("Login failed:", err);
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                                    style={{ background: "var(--accent)" }}
                                >
                                    Log In with Google <LogIn size={18} />
                                </button>
                            </div>
                        ) : isEmailMismatch ? (
                            <div className="w-full space-y-4">
                                <p className="text-sm text-red-400 font-medium">Email mismatch detected. Please switch to the invited account.</p>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all hover:bg-zinc-800"
                                    style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                                >
                                    Switch Account <LogOut size={18} />
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    Stay logged in as {user.email} & cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAccept}
                                disabled={isJoining}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ background: "var(--accent)" }}
                            >
                                {isJoining ? <Loader2 className="animate-spin" size={18} /> : "Accept Invitation"} <ArrowRight size={18} />
                            </button>
                        )}
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold mb-2">Welcome aboard!</h1>
                            <p className="text-sm text-zinc-500">You are now a member of {inviteData?.org_name}.</p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                            style={{ background: "var(--accent)" }}
                        >
                            Go to Dashboard <ArrowRight size={18} />
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <XCircle size={32} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold mb-2">Invitation Error</h1>
                            <p className="text-sm text-zinc-500">{errorMsg}</p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all hover:bg-zinc-800"
                            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
                        >
                            Back to Dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
