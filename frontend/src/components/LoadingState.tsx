"use client";

import { useEffect, useRef } from "react";

interface LoadingStateProps {
    withGemini: boolean;
}

const STEPS = [
    "Scanning repository for vulnerabilities",
    "Classifying and modeling financial impact",
    "Running AI analysis on code context",
    "Detecting attack chains",
    "Generating executive briefs",
];

export default function LoadingState({ withGemini }: LoadingStateProps) {
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Reset all steps
        stepRefs.current.forEach((el, i) => {
            if (!el) return;
            el.className = "loading-step";
            el.textContent = `⏳ ${STEPS[i]}`;
            el.style.opacity = (!withGemini && (i === 2 || i === 3)) ? "0.3" : "1";
        });

        let current = 0;
        const interval = setInterval(() => {
            if (current > 0) {
                const prev = stepRefs.current[current - 1];
                if (prev) {
                    prev.className = "loading-step done";
                    prev.textContent = `✅ ${STEPS[current - 1]}`;
                }
            }
            if (current < STEPS.length) {
                const curr = stepRefs.current[current];
                if (curr) curr.className = "loading-step active";
                current++;
            } else {
                clearInterval(interval);
            }
        }, withGemini ? 2500 : 1200);

        return () => clearInterval(interval);
    }, [withGemini]);

    return (
        <div className="text-center py-16">
            {/* Spinner */}
            <div
                className="mx-auto mb-5"
                style={{
                    width: 48,
                    height: 48,
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--accent)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <p className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>
                Analyzing your codebase...
            </p>

            <div id="loading_steps" className="text-[13px]">
                {STEPS.map((step, i) => (
                    <div
                        key={i}
                        ref={el => { stepRefs.current[i] = el; }}
                        className="loading-step"
                        id={`step${i + 1}`}
                    >
                        ⏳ {step}
                    </div>
                ))}
            </div>
        </div>
    );
}
