import { ScanResults, CompanyContext, VulnInput, Project, ProjectDetail, PresetContext } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    console.log(`[API] Fetching: ${url}`);
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || "An unexpected error occurred");
    }

    return response.json();
}

export const api = {
    async health(): Promise<{ status: string; version: string }> {
        return fetchAPI("/health");
    },

    async demoPresets(): Promise<PresetContext[]> {
        return fetchAPI("/demo-presets");
    },

    async analyzeManual(payload: {
        vulnerabilities: VulnInput[];
        company: CompanyContext;
        gemini_api_key: string | null;
    }): Promise<ScanResults> {
        return fetchAPI("/analyze-manual", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async scanRepo(payload: {
        company: CompanyContext;
        repo_url: string;
        branch: string;
        gemini_api_key: string | null;
    }): Promise<ScanResults> {
        // Fallback or legacy wrapper if needed, but we'll use scanRepoStream for live updates
        return fetchAPI("/scan-repo", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async scanRepoStream(
        payload: {
            company: CompanyContext;
            repo_url: string;
            branch: string;
            gemini_api_key: string | null;
            org_id: string;
            group_id: string;
            user_uuid: string;
            project_id?: string;
        },
        onMessage: (msg: { status: string; message?: string; percent?: number; data?: ScanResults; project_id?: string }) => void
    ): Promise<void> {
        const response = await fetch(`${API_URL}/scan-repo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "Scan failed" }));
            throw new Error(err.detail || "Scan request failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No response body");

        let buffer = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const msg = JSON.parse(line);
                    onMessage(msg);
                } catch (e) {
                    console.error("Failed to parse NDJSON line:", e);
                }
            }
        }
    },

    async createOrganization(payload: {
        name: string;
        slug: string;
        plan: string;
        creator_uuid: string;
    }): Promise<any> {
        return fetchAPI("/api/orgs", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async listOrganizations(user_uuid?: string): Promise<any[]> {
        const endpoint = user_uuid ? `/api/orgs?user_uuid=${user_uuid}` : "/api/orgs";
        return fetchAPI(endpoint);
    },

    async updateOrganization(org_id: string, payload: { name?: string; plan?: string }): Promise<any> {
        return fetchAPI(`/api/orgs/${org_id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    },

    async deleteOrganization(org_id: string): Promise<void> {
        await fetchAPI(`/api/orgs/${org_id}`, { method: "DELETE" });
    },

    async listGroups(org_id: string): Promise<any[]> {
        return fetchAPI(`/api/orgs/${org_id}/groups`);
    },

    async createGroup(org_id: string, payload: {
        name: string;
        description?: string;
        creator_uuid: string;
    }): Promise<any> {
        return fetchAPI(`/api/orgs/${org_id}/groups`, {
            method: "POST",
            body: JSON.stringify({ ...payload, org_id }),
        });
    },

    async updateGroup(group_id: string, payload: {
        name?: string;
        description?: string;
        auto_scan?: boolean;
        enforce_policies?: boolean;
    }): Promise<any> {
        return fetchAPI(`/api/groups/${group_id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    },

    async deleteGroup(group_id: string): Promise<void> {
        await fetchAPI(`/api/groups/${group_id}`, { method: "DELETE" });
    },

    // ── Members & Invites ────────────────────────────────────────────────────

    async listMembers(org_id: string): Promise<any[]> {
        return fetchAPI(`/api/orgs/${org_id}/members`);
    },

    async inviteMember(org_id: string, payload: { invited_email: string; role: string; inviter_uuid: string }): Promise<any> {
        return fetchAPI(`/api/orgs/${org_id}/invite`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getInvite(token: string): Promise<any> {
        return fetchAPI(`/api/invites/${token}`);
    },

    async acceptInvite(token: string, user_uuid: string): Promise<any> {
        return fetchAPI(`/api/invites/${token}/accept?user_uuid=${user_uuid}`, {
            method: "POST",
        });
    },

    // ── Notifications ────────────────────────────────────────────────────────

    async getNotifications(user_uuid: string): Promise<any[]> {
        return fetchAPI(`/api/notifications/${user_uuid}`);
    },

    async markNotificationRead(id: string): Promise<any> {
        return fetchAPI(`/api/notifications/${id}/read`, { method: "PATCH" });
    },

    async deleteNotification(id: string): Promise<void> {
        await fetchAPI(`/api/notifications/${id}`, { method: "DELETE" });
    },

    // ── Projects ──────────────────────────────────────────────────────────────

    async createProject(payload: {
        repo_url: string;
        branch: string;
        company: CompanyContext;
        org_id: string;
        group_id: string;
        created_by: string;
        gemini_api_key: string | null;
    }): Promise<ProjectDetail> {
        return fetchAPI("/api/projects", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async listProjects(org_id: string, group_id?: string, user_uuid?: string): Promise<Project[]> {
        let endpoint = `/api/projects?org_id=${org_id}`;
        if (group_id) endpoint += `&group_id=${group_id}`;
        if (user_uuid) endpoint += `&user_uuid=${user_uuid}`;
        return fetchAPI(endpoint);
    },

    async getProject(project_id: string): Promise<ProjectDetail> {
        return fetchAPI(`/api/projects/${project_id}`);
    },

    async updateProjectContext(project_id: string, company: CompanyContext): Promise<ProjectDetail> {
        return fetchAPI(`/api/projects/${project_id}/context`, {
            method: "PATCH",
            body: JSON.stringify({ company }),
        });
    },

    async deleteProject(project_id: string): Promise<void> {
        await fetchAPI(`/api/projects/${project_id}`, { method: "DELETE" });
    },

    async scanAllProjects(org_id: string, group_id?: string, user_uuid?: string): Promise<any> {
        let endpoint = `/api/projects/scan-all?org_id=${org_id}`;
        if (group_id) endpoint += `&group_id=${group_id}`;
        if (user_uuid) endpoint += `&user_uuid=${user_uuid}`;
        return fetchAPI(endpoint, { method: "POST" });
    },

    // ── Dashboard Metrics ────────────────────────────────────────────────────

    async getDashboardMetrics(org_id?: string, group_id?: string): Promise<any> {
        let endpoint = "/api/dashboard/metrics";
        const params: string[] = [];
        if (org_id) params.push(`org_id=${org_id}`);
        if (group_id) params.push(`group_id=${group_id}`);
        if (params.length) endpoint += `?${params.join("&")}`;
        return fetchAPI(endpoint);
    },

    async sendReport(payload: any): Promise<any> {
        return fetchAPI("/api/send-report", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    },
};
