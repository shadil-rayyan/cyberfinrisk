"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { useOrg } from "@/context/OrgContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

// Maps path segments to human-readable labels
const SEGMENT_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    scan: "Scans",
    reports: "Reports",
    settings: "Settings",
    members: "Members",
    notifications: "Notifications",
    billing: "Billing",
    profile: "Profile",
    org: "Organization",
    team: "Teams",
};

interface TopBarProps {
    /** Optional button or element to render on the right side */
    action?: React.ReactNode;
}

export default function TopBar({ action }: TopBarProps) {
    const pathname = usePathname();
    const { activeOrg } = useOrg();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    // Build breadcrumb segments from the URL path
    const segments = pathname
        .split("/")
        .filter(Boolean)
        .map((seg, idx, arr) => ({
            label: SEGMENT_LABELS[seg] ?? seg.replace(/-/g, " "),
            href: "/" + arr.slice(0, idx + 1).join("/"),
        }));

    useEffect(() => {
        if (!user?.uid) return;
        
        const fetchUnreadCount = async () => {
            try {
                const notifs = await api.getNotifications(user.uid);
                setUnreadCount(notifs.filter(n => !n.is_read).length);
            } catch (err) {
                console.error("Failed to fetch notification count", err);
            }
        };

        fetchUnreadCount();
        // Set up an interval to refresh occasionally
        const interval = setInterval(fetchUnreadCount, 60000); // every minute
        return () => clearInterval(interval);
    }, [user?.uid, pathname]);

    return (
        <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 flex-shrink-0"
            style={{
                height: "var(--topbar-height)",
                borderBottom: "1px solid var(--border)",
                background: "var(--card)",
            }}
        >
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-sm">
                <Link
                    href="/dashboard"
                    className="font-medium transition-colors hover:text-white"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    {activeOrg?.name ?? "FinRisk"}
                </Link>

                {segments.slice(1).map((seg, i, arr) => (
                    <span key={seg.href} className="flex items-center gap-1">
                        <ChevronRight size={13} style={{ color: "var(--muted)" }} />
                        {i === arr.length - 1 ? (
                            <span className="font-medium text-white">{seg.label}</span>
                        ) : (
                            <Link
                                href={seg.href}
                                className="font-medium transition-colors hover:text-white capitalize"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                {seg.label}
                            </Link>
                        )}
                    </span>
                ))}
            </nav>

            {/* Right-side elements */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/dashboard/notifications" 
                    className="relative p-2 rounded-md transition-colors hover:bg-zinc-800"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span 
                            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--card)]"
                            style={{ background: "var(--accent)" }}
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Link>
                {action && <div className="flex items-center gap-2">{action}</div>}
            </div>
        </div>
    );
}
