import Link from "next/link";
import {
  ShieldCheck,
  GitBranch,
  Bot,
  Trophy,
  ArrowRight,
  Github,
  Scan,
  DollarSign,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

// ── Feature card data ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: GitBranch,
    title: "Scan GitHub Repositories",
    desc: "Connect any public or private GitHub repo and trigger a deep security scan in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Detect with Semgrep",
    desc: "Powered by Semgrep's industry-leading static analysis rules across 20+ languages.",
  },
  {
    icon: DollarSign,
    title: "Financial Risk Translation",
    desc: "Every vulnerability is automatically converted into an expected dollar loss based on your company profile.",
  },
  {
    icon: Bot,
    title: "AI-Powered Analysis",
    desc: "Gemini AI reads your actual code context to filter false positives and assess true exploitability.",
  },
  {
    icon: Trophy,
    title: "ROI-Based Prioritization",
    desc: "Fix vulnerabilities in order of financial impact. Lowest cost, highest ROI first.",
  },
];

// ── Pipeline steps ────────────────────────────────────────────────────────────

const PIPELINE = [
  { icon: GitBranch, label: "GitHub Repo" },
  { icon: Scan, label: "Security Scan" },
  { icon: ShieldCheck, label: "Risk Model" },
  { icon: DollarSign, label: "Financial Impact" },
  { icon: LayoutDashboard, label: "Dashboard" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-6 md:px-16 py-4 sticky top-0 z-50"
        style={{ background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center font-black text-sm text-white"
            style={{ background: "var(--accent)" }}
          >
            F
          </div>
          <span className="font-bold text-base tracking-tight">FinRisk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-1.5 rounded-lg font-semibold text-white transition-colors"
            style={{ background: "var(--accent)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* gradient blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #e63946 0%, transparent 70%)" }}
        />

        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-6"
          style={{ background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", color: "var(--accent)" }}
        >
          <ShieldCheck size={12} />
          Security meets finance
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6 max-w-4xl">
          Translate security{" "}
          <span style={{ color: "var(--accent)" }}>vulnerabilities</span>{" "}
          into financial risk
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-10" style={{ color: "var(--muted-foreground)" }}>
          FinRisk scans your GitHub repositories, detects vulnerabilities, and converts each one
          into an expected dollar loss — ranked by financial priority for your board.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-base transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base transition-all hover:opacity-80"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            <Github size={16} />
            Sign in with Google
          </Link>
        </div>

        {/* Hero mock card */}
        <div
          className="mt-16 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: "1px solid var(--border)", background: "var(--card)" }}
        >
          {/* window bar */}
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map(c => (
              <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
            <span className="ml-3 text-xs font-mono" style={{ color: "var(--muted)" }}>
              finrisk.app/dashboard/project/payment-api
            </span>
          </div>
          {/* mock table */}
          <div className="p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-bold">Payment API</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>github.com/acme/payment-api</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(230,57,70,0.15)", color: "var(--accent)", border: "1px solid rgba(230,57,70,0.3)" }}>
                CRITICAL RISK
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Total Expected Loss", val: "$2.4M" },
                { label: "Vulnerabilities", val: "14" },
                { label: "ROI of Fixing", val: "312×" },
              ].map(m => (
                <div key={m.label} className="rounded-lg p-3" style={{ background: "var(--surface)" }}>
                  <div className="text-lg font-extrabold" style={{ color: "var(--accent)" }}>{m.val}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>{m.label}</div>
                </div>
              ))}
            </div>
            {[
              { vuln: "SQL Injection", file: "auth/login.py", sev: "Critical", loss: "$480K" },
              { vuln: "Hardcoded Secret", file: "config/settings.py", sev: "Critical", loss: "$900K" },
              { vuln: "IDOR", file: "api/accounts.py", sev: "High", loss: "$320K" },
            ].map(r => (
              <div key={r.vuln} className="flex items-center gap-3 py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-sm font-medium flex-1">{r.vuln}</span>
                <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{r.file}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(230,57,70,0.15)", color: "var(--accent)" }}>{r.sev}</span>
                <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{r.loss}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 md:px-16 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Everything your security team needs
          </h2>
          <p style={{ color: "var(--muted-foreground)" }}>
            Built for engineers and executives alike.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="rounded-xl p-6 transition-colors hover:border-zinc-600"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "rgba(230,57,70,0.12)" }}
              >
                <f.icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="font-bold mb-1.5 text-sm">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 md:px-16 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">How it works</h2>
          <p style={{ color: "var(--muted-foreground)" }}>From code to dollar figure in under 2 minutes.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 max-w-4xl mx-auto">
          {PIPELINE.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <step.icon size={20} style={{ color: i === 4 ? "var(--green)" : "var(--accent)" }} />
                </div>
                <span className="text-xs font-medium text-center" style={{ color: "var(--muted-foreground)" }}>
                  {step.label}
                </span>
              </div>
              {i < PIPELINE.length - 1 && (
                <ChevronRight size={16} className="mb-5 flex-shrink-0" style={{ color: "var(--muted)" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-16 py-20 text-center">
        <div
          className="max-w-2xl mx-auto rounded-2xl p-12"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Ready to put a price on your risks?
          </h2>
          <p className="mb-8" style={{ color: "var(--muted-foreground)" }}>
            Free to start. No credit card required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Start scanning for free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center text-white font-black text-xs" style={{ background: "var(--accent)" }}>F</div>
          <span className="text-sm font-bold">FinRisk</span>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
          {["Documentation", "GitHub", "Privacy Policy", "Contact"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>© 2026 FinRisk. All rights reserved.</p>
      </footer>
    </div>
  );
}
