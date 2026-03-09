"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderOpen,
    Scan,
    FileText,
    Settings,
    Users,
    CreditCard,
    LogOut,
    User,
    ChevronDown,
    Check,
    ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TEAMS } from "@/lib/mock-data";

const NAV_MAIN = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
    { href: "/dashboard/scan", icon: Scan, label: "Scans" },
    { href: "/dashboard/reports", icon: FileText, label: "Reports" },
];

const NAV_TEAM = [
    { href: "/dashboard/settings", icon: Settings, label: "Team Settings" },
    { href: "/dashboard/members", icon: Users, label: "Members" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [teamOpen, setTeamOpen] = useState(false);
    const [activeTeam, setActiveTeam] = useState(TEAMS[1]); // Acme Corp

    function isActive(href: string) {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    }

    return (
        <aside
            className="flex flex-col h-screen sticky top-0 flex-shrink-0"
            style={{
                width: "var(--sidebar-width)",
                background: "var(--card)",
                borderRight: "1px solid var(--border)",
            }}
        >
            {/* Logo */}
            <div
                className="flex items-center gap-2.5 px-4 py-4"
                style={{ borderBottom: "1px solid var(--border)" }}
            >
                <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                    style={{ background: "var(--accent)" }}
                >
                    F
                </div>
                <span className="font-bold text-sm tracking-tight">FinRisk</span>
                <ShieldAlert size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </div>

            {/* Team Selector */}
            <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                    onClick={() => setTeamOpen(o => !o)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-colors hover:bg-zinc-800"
                >
                    <span
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "var(--blue)" }}
                    >
                        {activeTeam.name[0]}
                    </span>
                    <span className="flex-1 truncate font-medium">{activeTeam.name}</span>
                    <ChevronDown size={14} style={{ color: "var(--muted)" }} className={cn("transition-transform", teamOpen && "rotate-180")} />
                </button>

                {teamOpen && (
                    <div
                        className="mt-1 rounded-lg overflow-hidden"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                        {TEAMS.map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setActiveTeam(t); setTeamOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-700 transition-colors"
                            >
                                <span
                                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                    style={{ background: "var(--blue)" }}
                                >
                                    {t.name[0]}
                                </span>
                                <span className="flex-1 text-left">
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-[11px]" style={{ color: "var(--muted)" }}>{t.plan}</div>
                                </span>
                                {activeTeam.id === t.id && <Check size={12} style={{ color: "var(--green)" }} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main nav */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto">
                <div className="mb-4">
                    {NAV_MAIN.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors",
                                isActive(item.href)
                                    ? "text-white"
                                    : "hover:bg-zinc-800"
                            )}
                            style={
                                isActive(item.href)
                                    ? { background: "rgba(230,57,70,0.15)", color: "var(--accent)" }
                                    : { color: "var(--muted-foreground)" }
                            }
                        >
                            <item.icon size={15} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest px-2.5 mb-2" style={{ color: "var(--muted)" }}>
                        Team
                    </p>
                    {NAV_TEAM.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors hover:bg-zinc-800"
                            style={{ color: "var(--muted-foreground)" }}
                        >
                            <item.icon size={15} />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom profile */}
            <div className="px-3 py-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "var(--surface2)" }}
                    >
                        <User size={12} style={{ color: "var(--muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">demo@finrisk.app</div>
                        <div className="text-[11px]" style={{ color: "var(--muted)" }}>Pro Plan</div>
                    </div>
                    <LogOut size={13} style={{ color: "var(--muted)" }} />
                </div>
            </div>
        </aside>
    );
}
