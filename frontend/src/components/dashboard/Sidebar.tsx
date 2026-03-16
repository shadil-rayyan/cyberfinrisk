"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FolderOpen,
    Scan,
    Settings,
    Users,
    LogOut,
    User,
    LogIn,
    ArrowRightLeft,
    Plus,
    Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

const ORG_NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
    { href: "/dashboard/members", icon: Users, label: "Members" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const GROUP_NAV_ITEMS = [
    { href: "/dashboard/scan", icon: Scan, label: "Integrations" },
    { href: "/dashboard/settings/group", icon: Settings, label: "Group Settings" },
];

/** Small uppercase section label — identical to Snyk's TENANT/GROUP/ORGANIZATION labels */
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1 mt-3 select-none"
            style={{ color: "var(--sidebar-group-label)" }}
        >
            {children}
        </p>
    );
}

/** Clean switcher button for Tenant/Group/Org matching Snyk */
function SwitcherItem({ name, onClick, isOpen }: { name: string; onClick?: () => void; isOpen?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-left transition-colors",
                isOpen ? "bg-white/5" : "hover:bg-white/5"
            )}
        >
            <span
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "#d946ef" }} // Snyk pink color
            >
                {name[0]?.toUpperCase()}
            </span>
            <span className="text-sm font-medium flex-1 truncate" style={{ color: "var(--foreground)" }}>
                {name}
            </span>
            <ArrowRightLeft size={12} className="flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
        </button>
    );
}

/** A sidebar nav link item */
function NavItem({
    href,
    icon: Icon,
    label,
    active,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium mb-0.5 transition-colors",
                active ? "text-white" : "hover:bg-white/5"
            )}
            style={
                active
                    ? { background: "#4c1d95" } // Snyk active dark purple
                    : { color: "var(--muted-foreground)" }
            }
        >
            <Icon size={14} className="flex-shrink-0" />
            {label}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loginWithGoogle, logout } = useAuth();
    const { activeOrg, setActiveOrg, activeGroup, setActiveGroup, organizations, loading } = useOrg();

    // State for interactive dropdowns
    const [activeDropdown, setActiveDropdown] = useState<"org" | "group" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function isActive(href: string) {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    }

    // Helper for rendering the floating dropdown menu
    function DropdownMenu({
        items,
        onSelect,
        activeId,
        onCreate,
        createLabel
    }: {
        items: { id: string; name: string }[];
        onSelect: (item: any) => void;
        activeId: string;
        onCreate?: () => void;
        createLabel?: string;
    }) {
        return (
            <div
                ref={dropdownRef}
                className="absolute left-2 right-2 mt-1 z-50 rounded-md border shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
                <div className="max-h-[250px] overflow-y-auto py-1">
                    {items.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSelect(item);
                                setActiveDropdown(null);
                            }}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors hover:bg-white/5",
                                activeId === item.id ? "text-white font-medium" : "text-[var(--muted-foreground)]"
                            )}
                        >
                            <span className="truncate">{item.name}</span>
                        </button>
                    ))}
                </div>
                {onCreate && (
                    <button
                        onClick={onCreate}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-white/5"
                        style={{ borderTop: "1px solid var(--border)", color: "var(--accent)" }}
                    >
                        <Plus size={14} />
                        <span>{createLabel || "Create New"}</span>
                    </button>
                )}
            </div>
        );
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
            {/* ── Logo ── */}
            <div
                className="flex items-center gap-2 px-3 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
            >
                <div
                    className="w-5 h-5 rounded flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                    style={{ background: "#d946ef" }} // Logo color similar to context
                >
                    S
                </div>
                <span className="font-bold text-sm tracking-tight text-white">afiq</span>
            </div>

            {/* ── Switcher & Nav Hierarchy ── */}
            <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-6">

                {loading && (
                    <div className="px-3 py-4 text-xs text-zinc-500 animate-pulse">Loading...</div>
                )}

                {!loading && !activeOrg && (
                    <div className="px-3 py-4 text-xs text-zinc-500">
                        No organizations yet.
                        <button onClick={() => router.push("/dashboard/org/new")} className="block mt-1 text-accent underline">Create one →</button>
                    </div>
                )}

                {/* ── Organization Level ── */}
                {activeOrg && (
                    <div className="flex flex-col gap-1">
                        <SectionLabel>Organization</SectionLabel>
                        <div className="relative">
                            <SwitcherItem
                                name={activeOrg.name}
                                onClick={() => setActiveDropdown(activeDropdown === "org" ? null : "org")}
                                isOpen={activeDropdown === "org"}
                            />
                            {activeDropdown === "org" && (
                                <DropdownMenu
                                    items={organizations}
                                    onSelect={(o) => setActiveOrg(o)}
                                    activeId={activeOrg.id}
                                    onCreate={() => router.push("/dashboard/org/new")}
                                    createLabel="New Organization"
                                />
                            )}
                        </div>
                        <div className="mt-2 space-y-0.5 ml-1 pl-1 border-l border-zinc-800/50">
                            {ORG_NAV_ITEMS.map(item => (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    active={isActive(item.href)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Group Level ── */}
                {activeOrg && (
                    <div className="flex flex-col gap-1">
                        <SectionLabel>Group</SectionLabel>
                        <div className="relative">
                            <SwitcherItem
                                name={activeGroup?.name ?? "No Groups"}
                                onClick={() => setActiveDropdown(activeDropdown === "group" ? null : "group")}
                                isOpen={activeDropdown === "group"}
                            />
                            {activeDropdown === "group" && (
                                <DropdownMenu
                                    items={activeOrg.groups}
                                    onSelect={(g) => setActiveGroup(g)}
                                    activeId={activeGroup?.id ?? ""}
                                    onCreate={() => router.push("/dashboard/group/new")}
                                    createLabel="New Group"
                                />
                            )}
                        </div>
                        <div className="mt-2 space-y-0.5 ml-1 pl-1 border-l border-zinc-800/50">
                            {GROUP_NAV_ITEMS.map(item => (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    active={isActive(item.href)}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* ── Bottom profile ── */}
            <div className="px-2 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                {user ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-800/60 transition-colors">
                        <Link href="/dashboard/profile" className="flex items-center gap-2 flex-1 min-w-0">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="w-5 h-5 rounded-full flex-shrink-0"
                                />
                            ) : (
                                <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: "var(--surface2)" }}
                                >
                                    <User size={11} style={{ color: "var(--muted)" }} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{user.displayName || user.email}</div>
                                <div className="text-[10px]" style={{ color: "var(--muted)" }}>Org Admin</div>
                            </div>
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="p-1 rounded hover:bg-zinc-700 transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={12} style={{ color: "var(--muted)" }} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => loginWithGoogle()}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors hover:bg-zinc-800/60 font-semibold"
                        style={{ color: "var(--accent)" }}
                    >
                        <LogIn size={14} />
                        <span className="text-sm">Sign In</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
