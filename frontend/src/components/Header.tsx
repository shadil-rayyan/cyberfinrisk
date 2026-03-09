"use client";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center gap-4 px-10 py-5 border-b"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            {/* Logo badge */}
            <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                style={{ background: "var(--accent)" }}
            >
                V
            </div>

            {/* Title */}
            <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
                Vulnerability Business Impact Engine
            </span>

            {/* Version badge */}
            <span
                className="px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                style={{
                    background: "rgba(230, 57, 70, 0.15)",
                    border: "1px solid rgba(230, 57, 70, 0.3)",
                    color: "var(--accent)",
                }}
            >
                v3.0
            </span>

            {/* Subtitle */}
            <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
                Turn security bugs into financial decisions
            </span>
        </header>
    );
}
