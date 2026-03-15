"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Group {
    id: string;
    name: string;
    description?: string;
    org_id: string;
    creator_uuid: string;
    auto_scan: boolean;
    enforce_policies: boolean;
    created_at: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    plan: string;
    creator_uuid: string;
    groups: Group[];
    created_at: string;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface OrgContextType {
    organizations: Organization[];
    activeOrg: Organization | null;
    setActiveOrg: (org: Organization) => void;
    activeGroup: Group | null;
    setActiveGroup: (group: Group) => void;
    loading: boolean;
    refetchOrgs: () => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);



export function OrgProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);
    const [activeGroup, setActiveGroupState] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    const CACHE_KEY = `org_cache_${user?.uid}`;
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const fetchOrgs = async (force = false) => {
        if (!user?.uid) { setLoading(false); return; }
        
        // 1. Check Cache
        if (!force) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_TTL) {
                        setOrganizations(data);
                        if (data.length > 0) {
                            setActiveOrgState(data[0]);
                            setActiveGroupState(data[0].groups?.[0] ?? null);
                        }
                        setLoading(false);
                        // We still fetch in background to stay fresh
                    }
                } catch (e) {
                    localStorage.removeItem(CACHE_KEY);
                }
            }
        }

        try {
            if (!localStorage.getItem(CACHE_KEY) || force) setLoading(true);
            const orgs: Organization[] = await api.listOrganizations(user.uid);
            setOrganizations(orgs);
            
            // Sync active items if they changed or were not set
            if (orgs.length > 0) {
                setActiveOrgState(prev => {
                    const found = orgs.find(o => o.id === prev?.id);
                    return found || orgs[0] || null;
                });
                // Note: group sync is trickier, keeping it simple for now
            }

            // 2. Save to Cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: orgs,
                timestamp: Date.now()
            }));
        } catch (err) {
            console.error("Failed to fetch organizations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, [user?.uid]);

    function setActiveOrg(org: Organization) {
        setActiveOrgState(org);
        setActiveGroupState(org.groups?.[0] ?? null);
    }

    function setActiveGroup(group: Group) {
        setActiveGroupState(group);
    }

    return (
        <OrgContext.Provider
            value={{
                organizations,
                activeOrg,
                setActiveOrg,
                activeGroup,
                setActiveGroup,
                loading,
                refetchOrgs: fetchOrgs,
            }}
        >
            {children}
        </OrgContext.Provider>
    );
}

export function useOrg() {
    const context = useContext(OrgContext);
    if (context === undefined) {
        throw new Error("useOrg must be used within an OrgProvider");
    }
    return context;
}
