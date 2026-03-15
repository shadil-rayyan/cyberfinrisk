"use client";

import { useState, useEffect } from "react";
import { 
    Bell, 
    CheckCircle2, 
    Trash2, 
    Clock, 
    ExternalLink,
    Loader2,
    MailOpen
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import TopBar from "@/components/dashboard/TopBar";
import Link from "next/link";

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user?.uid) return;
        setLoading(true);
        try {
            const data = await api.getNotifications(user.uid);
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user?.uid]);

    const markAsRead = async (id: string) => {
        try {
            await api.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const deleteNotif = async (id: string) => {
        try {
            await api.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const clearAllRead = async () => {
        // Implementation for multiple deletes if needed
    };

    return (
        <div className="flex flex-col h-full">
            <TopBar 
                action={
                    <button
                        onClick={fetchNotifications}
                        className="p-2 rounded-md transition-colors hover:bg-zinc-800"
                        style={{ color: "var(--muted-foreground)" }}
                        title="Refresh"
                    >
                        <Clock size={16} />
                    </button>
                }
            />
            <div className="px-6 md:px-10 py-8 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight mb-1">Notifications</h1>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                            Stay updated with team invites and system alerts
                        </p>
                    </div>
                    {notifications.some(n => n.is_read) && (
                        <button 
                            className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors hover:bg-red-500/10 text-red-400 border border-red-500/20"
                            onClick={clearAllRead}
                        >
                            Clear All Read
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                            <Loader2 className="animate-spin mb-4" size={24} />
                            <p className="text-sm">Fetching notifications...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div 
                                key={notif.id}
                                className="group relative rounded-xl p-5 flex gap-4 transition-all"
                                style={{ 
                                    background: "var(--card)", 
                                    border: "1px solid var(--border)",
                                    opacity: notif.is_read ? 0.7 : 1
                                }}
                            >
                                <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        notif.type === 'invite' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-500/10 text-zinc-500'
                                    }`}
                                >
                                    {notif.type === 'invite' ? <Bell size={18} /> : <Bell size={18} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className={`text-sm font-bold ${notif.is_read ? 'text-zinc-300' : 'text-zinc-100'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                        {notif.body}
                                    </p>
                                    
                                    <div className="flex items-center gap-4">
                                        {notif.link && (
                                            <Link 
                                                href={notif.link}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                View details <ExternalLink size={12} />
                                            </Link>
                                        )}
                                        {!notif.is_read && (
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                Mark as read <CheckCircle2 size={12} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotif(notif.id)}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Delete <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center" style={{ borderColor: "var(--border)" }}>
                            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                <MailOpen size={24} className="text-zinc-600" />
                            </div>
                            <h3 className="text-base font-bold mb-1">All caught up!</h3>
                            <p className="text-sm px-10" style={{ color: "var(--muted-foreground)" }}>
                                You have no new notifications. We'll let you know when something important happens.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
