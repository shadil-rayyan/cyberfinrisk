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
    Plus,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ORGANIZATIONS } from "@/lib/mock-data";

const NAV_MAIN = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
    { href: "/dashboard/scan", icon: Scan, label: "Scans" },
    { href: "/dashboard/reports", icon: FileText, label: "Reports" },
];

const NAV_TEAM = [
    { href: "/dashboard/settings", icon: Settings, label: "Org Settings" },
    { href: "/dashboard/members", icon: Users, label: "Members" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [teamOpen, setTeamOpen] = useState(false);
    const [activeOrg, setActiveOrg] = useState(ORGANIZATIONS[1]!); // Acme Corp
    const [activeTeam, setActiveTeam] = useState(ORGANIZATIONS[1]!.teams[0]!); // Frontend Team

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
                        {activeOrg.name[0]}
                    </span>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="truncate font-medium leading-tight">{activeTeam.name}</span>
                        <span className="text-[11px] truncate leading-tight mt-0.5" style={{ color: "var(--muted)" }}>{activeOrg.name}</span>
                    </div>
                    <ChevronDown size={14} style={{ color: "var(--muted)" }} className={cn("transition-transform", teamOpen && "rotate-180")} />
                </button>

                {teamOpen && (
                    <div
                        className="mt-1 rounded-lg overflow-hidden py-1 shadow-xl"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
                    >
                        {ORGANIZATIONS.map(org => (
                            <div key={org.id} className="mb-2 last:mb-0">
                                <div className="px-3 py-1.5 flex items-center gap-2">
                                     <span
                                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                        style={{ background: "var(--blue)" }}
                                    >
                                        {org.name[0]}
                                    </span>
                                    <span className="text-[11px] font-semibold tracking-wider uppercase flex-1 truncate" style={{ color: "var(--muted)" }}>
                                        {org.name}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium uppercase tracking-wider" style={{ background: "var(--surface2)", color: "var(--muted-foreground)" }}>
                                        {org.plan}
                                    </span>
                                </div>
                                <div className="mt-0.5">
                                    {org.teams.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setActiveOrg(org); setActiveTeam(t); setTeamOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-zinc-700 transition-colors pl-[38px]"
                                        >
                                            <span className="flex-1 text-left">
                                                <div className="font-medium text-[13px]" style={{ color: activeTeam.id === t.id ? "white" : "var(--muted-foreground)" }}>
                                                    {t.name}
                                                </div>
                                            </span>
                                            {activeTeam.id === t.id && <Check size={14} style={{ color: "var(--green)" }} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="mt-2 pt-2 px-2" style={{ borderTop: "1px solid var(--border)" }}>
                            <Link 
                                href="/dashboard/team/new"
                                onClick={() => setTeamOpen(false)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-zinc-700 transition-colors"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                <Plus size={14} /> Create Team
                            </Link>
                            <Link 
                                href="/dashboard/org/new"
                                onClick={() => setTeamOpen(false)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md hover:bg-zinc-700 transition-colors mb-1"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                <Building2 size={14} /> Create Organization
                            </Link>
                        </div>
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
                        Organization
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
                <Link 
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                >
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
                </Link>
            </div>
        </aside>
    );
}
