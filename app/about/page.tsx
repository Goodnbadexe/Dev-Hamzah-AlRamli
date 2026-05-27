import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Shield, Terminal, Layers, Zap, MapPin, GraduationCap, UserRound } from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata: Metadata = {
  title: "About Hamzah Al-Ramli (Goodnbad)",
  description:
    "Hamzah Al-Ramli (Goodnbad) is a cybersecurity and automation-focused systems architect based in Saudi Arabia.",
  alternates: {
    canonical: "https://www.goodnbad.info/about",
  },
}

const FOCUS_AREAS = [
  {
    icon: Shield,
    label: "Cybersecurity",
    sub: "Threat analysis · Incident response · Vulnerability management",
    color: "text-emerald-400",
    border: "border-emerald-800/50 hover:border-emerald-700",
  },
  {
    icon: Zap,
    label: "Workflow Automation",
    sub: "n8n · API pipelines · Process engineering",
    color: "text-yellow-400",
    border: "border-yellow-800/40 hover:border-yellow-700/70",
  },
  {
    icon: Terminal,
    label: "AI Agents",
    sub: "Agentic systems · LLM orchestration · Claude Code",
    color: "text-purple-400",
    border: "border-purple-800/40 hover:border-purple-700/70",
  },
  {
    icon: Layers,
    label: "Systems Architecture",
    sub: "Digital infrastructure · Secure design patterns",
    color: "text-blue-400",
    border: "border-blue-800/40 hover:border-blue-700/70",
  },
]

const PRINCIPLES = [
  "Execution over theory — ship, iterate, learn.",
  "Scalability over temporary fixes — build for what comes next.",
  "Clarity over complexity — the simplest design that holds.",
  "Security-first — every system, not just the obvious ones.",
]

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://www.goodnbad.info/about#aboutpage",
    "url": "https://www.goodnbad.info/about",
    "name": "About Hamzah Al-Ramli (Goodnbad)",
    "mainEntity": {
      "@id": "https://www.goodnbad.info/#person",
    },
  }

  return (
    <OSPageShell osName="about.sys" label="About">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">

        {/* Identity header */}
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <OSWindow label="identity.brief" title="subject profile" status="active" className="os-panel-in">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-emerald-500">
                <UserRound className="h-5 w-5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">About</p>
              </div>

              <div>
                <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                  Hamzah Al-Ramli / Goodnbad.exe
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-zinc-100 md:text-4xl">
                  Cybersecurity & Automation Architect
                </h1>
              </div>

              <p className="text-sm leading-7 text-zinc-300 md:text-base">
                Hamzah Al-Ramli, known digitally as Goodnbad, is a cybersecurity-driven systems thinker
                focused on building scalable digital architectures. His work centers around automation,
                AI integration, workflow orchestration, and secure infrastructure design.
              </p>

              <p className="text-sm leading-7 text-zinc-400">
                He prioritizes execution over theory, scalability over temporary fixes, and clarity over
                complexity. His approach combines cybersecurity principles with automation engineering to
                create systems that are efficient, controlled, and future-ready.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/personnel"
                  className="group inline-flex items-center gap-2 rounded border border-emerald-800 bg-emerald-950/30 px-3 py-2 font-mono text-xs text-emerald-400 transition-all hover:border-emerald-700 hover:bg-emerald-950/60"
                >
                  View full dossier
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900/40 px-3 py-2 font-mono text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200"
                >
                  Hire me
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </OSWindow>

          <OSWindow label="quick.facts" title="identity markers" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Markers</p>

              {[
                { icon: UserRound, label: "Alias",    value: "Goodnbad.exe"                  },
                { icon: MapPin,    label: "Location", value: "Riyadh, Saudi Arabia"           },
                { icon: GraduationCap, label: "Education", value: "BSc Computer Science — Taylor's University" },
                { icon: Shield,    label: "Focus",    value: "Cybersecurity + AI automation"  },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-md border border-zinc-800 bg-zinc-950/35 p-3">
                  <Icon className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
                    <p className="text-sm text-zinc-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </OSWindow>
        </section>

        {/* Focus areas */}
        <section className="mt-4">
          <OSWindow label="core.focus" title="what I work on" status="active" className="os-panel-in">
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Core Focus Areas</p>
              <h2 className="text-xl font-semibold text-zinc-100">Where the work lives</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FOCUS_AREAS.map(({ icon: Icon, label, sub, color, border }) => (
                <div
                  key={label}
                  className={`rounded-md border ${border} bg-zinc-950/45 p-4 transition-all duration-200 hover:bg-zinc-950/70`}
                >
                  <Icon className={`h-5 w-5 mb-3 ${color}`} />
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1">{label}</h3>
                  <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
          </OSWindow>
        </section>

        {/* Principles */}
        <section className="mt-4">
          <OSWindow label="operating.principles" title="how I think" status="idle" className="os-panel-in">
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Operating Principles</p>
              <h2 className="text-xl font-semibold text-zinc-100">The guiding logic</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((principle, i) => (
                <div key={i} className="flex gap-3 rounded-md border border-zinc-800 bg-zinc-950/35 p-4">
                  <span className="font-mono text-[10px] text-emerald-700 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <p className="text-sm leading-6 text-zinc-300">{principle}</p>
                </div>
              ))}
            </div>
          </OSWindow>
        </section>

        {/* CTA row */}
        <section className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { href: "/personnel", label: "Dossier", desc: "Full CV, credentials, experience", color: "border-emerald-800/60 hover:border-emerald-700" },
            { href: "/deployments", label: "Projects", desc: "Shipped systems and builds", color: "border-blue-800/60 hover:border-blue-700" },
            { href: "/contact", label: "Contact", desc: "Open a direct channel", color: "border-purple-800/60 hover:border-purple-700" },
          ].map(({ href, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className={`group rounded-md border ${color} bg-zinc-900/60 p-4 transition-all duration-200 hover:bg-zinc-900/90 hover:-translate-y-px hover:shadow-md os-panel-in`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold text-zinc-100 mb-1">{label}</p>
                  <p className="font-mono text-[10px] text-zinc-500">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5" />
              </div>
            </Link>
          ))}
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
    </OSPageShell>
  )
}
