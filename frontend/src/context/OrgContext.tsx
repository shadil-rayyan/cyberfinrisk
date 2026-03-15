"use client";

import React, { createContext, useContext, useState } from "react";
import { TENANTS } from "@/lib/mock-data";
import type { Tenant, OrgGroup, OrgTeam } from "@/lib/mock-data";

interface OrgContextType {
    activeTenant: Tenant;
    setActiveTenant: (tenant: Tenant) => void;
    activeGroup: OrgGroup;
    setActiveGroup: (group: OrgGroup) => void;
    activeOrg: OrgTeam;
    setActiveOrg: (org: OrgTeam) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
    // Default initializations
    const [activeTenant, _setActiveTenant] = useState<Tenant>(TENANTS[1]!);
    const [activeGroup, _setActiveGroup] = useState<OrgGroup>(TENANTS[1]!.groups[0]!);
    const [activeOrg, _setActiveOrg] = useState<OrgTeam>(TENANTS[1]!.groups[0]!.teams[0]!);

    // Cascading updates
    function setActiveTenant(tenant: Tenant) {
        _setActiveTenant(tenant);
        if (tenant.groups.length > 0) {
            const firstGroup = tenant.groups[0]!;
            _setActiveGroup(firstGroup);
            if (firstGroup.teams.length > 0) {
                _setActiveOrg(firstGroup.teams[0]!);
            }
        }
    }

    function setActiveGroup(group: OrgGroup) {
        _setActiveGroup(group);
        if (group.teams.length > 0) {
            _setActiveOrg(group.teams[0]!);
        }
    }

    function setActiveOrg(org: OrgTeam) {
        _setActiveOrg(org);
    }

    return (
        <OrgContext.Provider 
            value={{ 
                activeTenant, setActiveTenant, 
                activeGroup, setActiveGroup, 
                activeOrg, setActiveOrg 
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
