"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Github, Gitlab, Box, Code2 } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";

export default function ProjectsPage() {
    const [activeDropdown, setActiveDropdown] = useState<"top" | "card" | null>(null);
    const topDropdownRef = useRef<HTMLDivElement>(null);
    const cardDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeDropdown === "top" && topDropdownRef.current && !topDropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
            if (activeDropdown === "card" && cardDropdownRef.current && !cardDropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]);

    const INTEGRATION_OPTIONS = [
        { id: "github", label: "GitHub", icon: Github },
        { id: "gitlab", label: "GitLab", icon: Gitlab },
        { id: "bitbucket", label: "Bitbucket", icon: Box },
        { id: "cli", label: "CLI Auth", icon: Code2 },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0d0f11]">
            <TopBar 
                action={
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                            style={{ background: "#4c1d95" }} // Snyk primary purple
                        >
                            Add projects <ChevronDown size={14} />
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-white/5 border border-zinc-700"
                            style={{ color: "var(--foreground)" }}
                        >
                            View import logs
                        </button>
                    </div>
                }
            />
            <div className="px-8 py-8 md:py-12 max-w-6xl mx-auto w-full flex-1">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                        Secure your dependencies with Snyk
                    </h1>
                    <p className="text-base text-zinc-400">
                        Scan your projects to get started.
                    </p>
                </div>

                {/* 3-Column Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1 */}
                    <div className="rounded-lg border border-zinc-800 bg-[#15171a] flex flex-col h-full">
                        <div className="p-5 border-b border-zinc-800">
                            <h2 className="font-semibold text-[15px] text-white">Monitor deployed apps</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <ul className="list-disc list-inside text-[13px] text-zinc-300 space-y-2 mb-8 flex-1">
                                <li>Test apps for vulnerable dependencies</li>
                                <li>Get notifications about new vulnerabilities</li>
                            </ul>
                            <div className="flex justify-center mt-auto">
                                <button className="px-4 py-2 rounded text-[13px] font-semibold text-white bg-[#4c1d95] hover:bg-purple-700 transition-colors">
                                    Browse integrations
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-lg border border-zinc-800 bg-[#15171a] flex flex-col h-full">
                        <div className="p-5 border-b border-zinc-800">
                            <h2 className="font-semibold text-[15px] text-white">Protect your source code</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <ul className="list-disc list-inside text-[13px] text-zinc-300 space-y-2 mb-8 flex-1">
                                <li>Test repos for vulnerable dependencies</li>
                                <li>Create pull requests with fixes and patches</li>
                                <li>Flag fix pull requests that add new vulnerabilities</li>
                                <li>Get notifications for new vulnerabilities</li>
                            </ul>
                            <div className="flex justify-center mt-auto relative" ref={cardDropdownRef}>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === "card" ? null : "card")}
                                    className="flex items-center gap-1 px-4 py-2 rounded text-[13px] font-semibold text-white bg-[#4c1d95] hover:bg-purple-700 transition-colors"
                                >
                                    Add projects <ChevronDown size={14} />
                                </button>
                                
                                {activeDropdown === "card" && (
                                    <div className="absolute top-full mt-2 w-48 rounded-md border border-zinc-700 bg-[#1e1e20] shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                        {INTEGRATION_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setActiveDropdown(null)}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                                            >
                                                <opt.icon size={14} />
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-lg border border-zinc-800 bg-[#15171a] flex flex-col h-full">
                        <div className="p-5 border-b border-zinc-800">
                            <h2 className="font-semibold text-[15px] text-white">Monitor local projects</h2>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <p className="text-[13px] text-zinc-300 mb-4">
                                Install our CLI tool to monitor local projects for known vulnerabilities:
                            </p>
                            <div className="bg-[#1e1e20] border border-zinc-800 rounded p-4 mb-6">
                                <code className="text-xs text-zinc-200 font-mono block whitespace-pre">
                                    npm install -g snyk{"\n"}
                                    cd ~/projects/my-project/{"\n"}
                                    snyk monitor
                                </code>
                            </div>
                            <div className="mt-auto">
                                <Link href="#" className="text-[13px] text-[#a78bfa] hover:underline underline-offset-2">
                                    Full documentation for Snyk CLI
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
