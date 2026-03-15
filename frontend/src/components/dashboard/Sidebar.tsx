"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TENANTS } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
    { href: "/dashboard/scan", icon: Scan, label: "Integrations" },
    { href: "/dashboard/members", icon: Users, label: "Members" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
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
    const { user, loginWithGoogle, logout } = useAuth();
    const { activeTenant, setActiveTenant, activeGroup, setActiveGroup, activeOrg, setActiveOrg } = useOrg();
    
    // State for interactive dropdowns
    const [activeDropdown, setActiveDropdown] = useState<"tenant" | "group" | "org" | null>(null);
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
        activeId 
    }: { 
        items: { id: string; name: string }[]; 
        onSelect: (item: any) => void;
        activeId: string;
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
                <span className="font-bold text-sm tracking-tight text-white">snyk</span>
            </div>

            {/* ── Switchers ── */}
            <div className="px-2 pt-2 pb-2 relative" style={{ borderBottom: "1px solid var(--border)" }}>
                <SectionLabel>Tenant</SectionLabel>
                <SwitcherItem 
                    name={activeTenant.name} 
                    onClick={() => setActiveDropdown(activeDropdown === "tenant" ? null : "tenant")}
                    isOpen={activeDropdown === "tenant"}
                />
                {activeDropdown === "tenant" && (
                    <DropdownMenu 
                        items={TENANTS} 
                        onSelect={(t) => setActiveTenant(t)} 
                        activeId={activeTenant.id} 
                    />
                )}
            </div>

            <div className="px-2 pt-1 pb-2 relative" style={{ borderBottom: "1px solid var(--border)" }}>
                <SectionLabel>Group</SectionLabel>
                <SwitcherItem 
                    name={activeGroup.name} 
                    onClick={() => setActiveDropdown(activeDropdown === "group" ? null : "group")}
                    isOpen={activeDropdown === "group"}
                />
                {activeDropdown === "group" && (
                    <DropdownMenu 
                        items={activeTenant.groups} 
                        onSelect={(g) => setActiveGroup(g)} 
                        activeId={activeGroup.id} 
                    />
                )}
            </div>

            <div className="px-2 pt-1 pb-2 relative" style={{ borderBottom: "1px solid var(--border)" }}>
                <SectionLabel>Organization</SectionLabel>
                <SwitcherItem 
                    name={activeOrg?.name || "No Teams"} 
                    onClick={() => setActiveDropdown(activeDropdown === "org" ? null : "org")}
                    isOpen={activeDropdown === "org"}
                />
                {activeDropdown === "org" && activeGroup.teams.length > 0 && (
                    <DropdownMenu 
                        items={activeGroup.teams} 
                        onSelect={(team) => setActiveOrg(team)} 
                        activeId={activeOrg?.id} 
                    />
                )}
            </div>

            {/* ── Main navigation ── */}
            <nav className="flex-1 px-2 py-2 overflow-y-auto">
                {NAV_ITEMS.map(item => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={isActive(item.href)}
                    />
                ))}
            </nav>

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
