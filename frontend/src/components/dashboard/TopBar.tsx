"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useOrg } from "@/context/OrgContext";

// Maps path segments to human-readable labels
const SEGMENT_LABELS: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    scan: "Scans",
    reports: "Reports",
    settings: "Settings",
    members: "Members",
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

    // Build breadcrumb segments from the URL path
    const segments = pathname
        .split("/")
        .filter(Boolean)
        .map((seg, idx, arr) => ({
            label: SEGMENT_LABELS[seg] ?? seg.replace(/-/g, " "),
            href: "/" + arr.slice(0, idx + 1).join("/"),
        }));

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
                    {activeOrg.name}
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

            {/* Right-side action */}
            {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
    );
}
