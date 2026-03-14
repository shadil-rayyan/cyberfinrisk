import { ScanResults, CompanyContext, VulnInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
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
        return fetchAPI("/scan-repo", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};
