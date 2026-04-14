'use client'

import { useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowRight, Shield, Terminal, Layers, Radio, Mail, User, ChevronRight, Maximize2, X } from "lucide-react"
import { OSDesktop, OSTaskbar, OSWindow, AmbientFeed } from "@/components/os"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"
import type { FeedEntry } from "@/components/os"
import type { ThreatEvent } from "@/app/api/threats/route"

// Globe — SSR-safe lazy load
const ThreatGlobe = dynamic(
  () => import("@/components/signal/ThreatGlobe").then((m) => ({ default: m.ThreatGlobe })),
  { ssr: false, loading: () => null }
)

// ---------------------------------------------------------------------------
// Static ambient feed — shown until live attacks populate
// ---------------------------------------------------------------------------
const STATIC_ENTRIES: FeedEntry[] = [
  { ts: "04:12", type: "system",  label: "GOODNBAD.EXE OS v2.0 — session started" },
  { ts: "04:11", type: "deploy",  label: "deployment: goodnbad-os-rebuild", detail: "branch main" },
  { ts: "04:09", type: "cert",    label: "cert: Google Cybersecurity — active" },
  { ts: "04:07", type: "signal",  label: "monitoring: threat surface — nominal" },
  { ts: "04:05", type: "commit",  label: "commit: security hardening — middleware extended" },
  { ts: "04:02", type: "deploy",  label: "deployment: vercel — production" },
  { ts: "03:58", type: "signal",  label: "signal: identity layer — verified" },
  { ts: "03:55", type: "cert",    label: "cert: IBM Cybersecurity Assessment — active" },
  { ts: "03:50", type: "system",  label: "system: all modules nominal" },
]

// ---------------------------------------------------------------------------
// App launcher
// ---------------------------------------------------------------------------
const APP_ITEMS = [
  { href: "/personnel",  code: "01", label: "PERSONNEL",  sub: "Dossier · CV · Clearance",      Icon: User,    accent: "emerald" },
  { href: "/deployments",code: "02", label: "DEPLOYMENTS",sub: "Mission files · Architecture",   Icon: Layers,  accent: "blue"    },
  { href: "/signal",     code: "03", label: "SIGNAL",     sub: "Live activity · Feed",            Icon: Radio,   accent: "yellow"  },
  { href: "/contact",    code: "04", label: "CONTACT",    sub: "Encrypted channel",               Icon: Mail,    accent: "purple"  },
  { href: "/terminal",   code: "05", label: "TERMINAL",   sub: "Command interface",               Icon: Terminal,accent: "zinc"    },
]

const ACCENT: Record<string, { border: string; dot: string; icon: string; hover: string }> = {
  emerald: { border: "hover:border-emerald-800", dot: "bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]", icon: "text-emerald-500", hover: "group-hover:text-emerald-400" },
  blue:    { border: "hover:border-blue-800",    dot: "bg-blue-500 shadow-[0_0_6px_theme(colors.blue.500)]",       icon: "text-blue-400",    hover: "group-hover:text-blue-300"    },
  yellow:  { border: "hover:border-yellow-800",  dot: "bg-yellow-500 shadow-[0_0_6px_theme(colors.yellow.500)]",   icon: "text-yellow-400",  hover: "group-hover:text-yellow-300"  },
  purple:  { border: "hover:border-purple-800",  dot: "bg-purple-500 shadow-[0_0_6px_theme(colors.purple.500)]",   icon: "text-purple-400",  hover: "group-hover:text-purple-300"  },
  zinc:    { border: "hover:border-zinc-600",    dot: "bg-zinc-500",                                                icon: "text-zinc-400",    hover: "group-hover:text-zinc-300"    },
}

const WORLD_LAYERS = [
  "Tech HQ",
  "Accelerators",
  "Cloud Regions",
  "AI Data Centers",
  "Undersea Cables",
  "Cyber Threats",
  "Internet Outages",
  "Tech Events",
  "Fires",
  "Natural Events",
  "Day / Night",
]

function nowTs() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [liveEntries, setLiveEntries] = useState<FeedEntry[]>([])
  const [globeInspect, setGlobeInspect] = useState(false)

  // Each globe drip fires this — converts attack → ambient feed entry
  const handleAttack = useCallback((attack: ThreatEvent) => {
    const entry: FeedEntry = {
      ts:     nowTs(),
      type:   "threat",
      label:  `${attack.type}: ${attack.srcCountry} → ${attack.tgtCountry}`,
      detail: `${attack.count.toLocaleString()} events · ${attack.severity}`,
    }
    setLiveEntries(prev => [entry, ...prev].slice(0, 20))
  }, [])

  return (
    <OSDesktop>
      {/* ------------------------------------------------------------------ */}
      {/* GLOBE — fixed full-viewport background layer                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed inset-0 z-0">
        <ThreatGlobe
          interactive={globeInspect}
          showWorldLayers
          onAttack={handleAttack}
          onGlobeClick={() => setGlobeInspect(true)}
        />
      </div>

      {/* Dark radial vignette — keeps content readable over globe */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            globeInspect
              ? "radial-gradient(ellipse 80% 75% at 38% 50%, rgba(9,9,11,0.12) 0%, rgba(9,9,11,0.62) 100%)"
              : "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(9,9,11,0.35) 0%, rgba(9,9,11,0.82) 100%)",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* SITE CHROME                                                          */}
      {/* ------------------------------------------------------------------ */}
      <OSTaskbar />

      <div className="fixed left-4 top-16 z-20 hidden max-w-[340px] flex-wrap gap-2 lg:flex">
        {WORLD_LAYERS.map((layer) => (
          <span
            key={layer}
            className="rounded border border-zinc-800 bg-zinc-950/55 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500 backdrop-blur-sm"
          >
            {layer}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setGlobeInspect(true)}
        className={cn(
          "fixed left-4 bottom-16 z-30 flex items-center gap-2 rounded border border-emerald-900 bg-zinc-950/70 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-emerald-400 backdrop-blur-md transition-all hover:border-emerald-700 hover:bg-emerald-950/40",
          globeInspect && "opacity-0 pointer-events-none"
        )}
      >
        <Maximize2 className="h-3.5 w-3.5" />
        inspect world monitor
      </button>

      {globeInspect && (
        <button
          type="button"
          onClick={() => setGlobeInspect(false)}
          className="fixed right-4 top-16 z-40 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/75 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 backdrop-blur-md transition-colors hover:border-zinc-600 hover:text-zinc-200"
        >
          <X className="h-3.5 w-3.5" />
          exit globe preview
        </button>
      )}

      <main
        className={cn(
          "relative z-10 os-page-offset min-h-screen transition-all duration-700 ease-out",
          globeInspect
            ? "pointer-events-none fixed right-4 top-12 bottom-12 w-[min(440px,calc(100vw-2rem))] overflow-y-auto pr-1"
            : "pointer-events-auto"
        )}
      >

        {/* ── HERO IDENTITY ─────────────────────────────────── */}
        <section className={cn(globeInspect ? "px-0 pt-4 pb-3" : "container mx-auto px-4 pt-16 pb-10 md:pt-20 md:pb-14")}>
          <div className={cn(globeInspect ? "w-full pointer-events-auto" : "max-w-4xl mx-auto")}>
            <OSWindow
              label="personnel.identity"
              title="GOODNBAD.EXE — ACTIVE SESSION"
              status="active"
              className={cn("os-panel-in transition-all duration-700", globeInspect && "bg-zinc-950/70")}
            >
              <div className={cn("flex gap-6 items-start", globeInspect ? "flex-col" : "flex-col sm:flex-row sm:items-center")}>
                {/* Avatar */}
                <div className="shrink-0 relative h-16 w-16 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900">
                  <Image
                    src="/images/newlogovector.png"
                    alt="Goodnbad.exe"
                    fill
                    sizes="64px"
                    className="object-cover p-1"
                    priority
                  />
                </div>

                {/* Identity block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">subject</span>
                    <span className="h-px flex-1 bg-zinc-800" />
                    <span className="font-mono text-[10px] text-emerald-700 uppercase tracking-widest">verified</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 leading-tight">
                    <GlitchText text="Goodnbad.exe" />
                  </h1>
                  <p className="text-zinc-400 text-sm mt-0.5">
                    Hamzah Al-Ramli — Cybersecurity & Automation Architect
                  </p>
                  <p className="font-mono text-[11px] text-zinc-600 mt-2">
                    Riyadh, SA · CEH (pursuing) · Security+ (pursuing) · Taylor's University BSc CS
                  </p>
                </div>

                {/* Status */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    available
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    Riyadh · SA
                  </span>
                </div>
              </div>

              {/* Capability strip */}
              <div className={cn("mt-5 pt-4 border-t border-zinc-800 flex flex-wrap gap-x-6 gap-y-2", globeInspect && "gap-x-3")}>
                {[
                  { label: "Threat Analysis",          Icon: Shield   },
                  { label: "Vulnerability Management", Icon: Shield   },
                  { label: "Incident Response",         Icon: Shield   },
                  { label: "Security Automation",       Icon: Terminal },
                ].map(({ label, Icon }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Icon className="w-3 h-3 text-emerald-700" />
                    {label}
                  </span>
                ))}
              </div>
            </OSWindow>
          </div>
        </section>

        {/* ── APP LAUNCHER ──────────────────────────────────── */}
        <section className={cn(globeInspect ? "px-0 pb-3" : "container mx-auto px-4 pb-10")}>
          <div className={cn(globeInspect ? "w-full pointer-events-auto" : "max-w-4xl mx-auto")}>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">os.modules</span>
              <span className="h-px flex-1 bg-zinc-900" />
            </div>
            <div className={cn("grid grid-cols-1 gap-3", !globeInspect && "sm:grid-cols-2 lg:grid-cols-3")}>
              {APP_ITEMS.map(({ href, code, label, sub, Icon, accent }, i) => {
                const a = ACCENT[accent]
                return (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      "group flex items-center gap-4 rounded-md border border-zinc-800",
                      "bg-zinc-900/75 px-4 py-3.5 transition-all duration-200 backdrop-blur-md",
                      "hover:bg-zinc-900/95 hover:shadow-md",
                      a.border, "os-panel-in",
                    ].join(" ")}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                      <Icon className={`w-4 h-4 ${a.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[9px] text-zinc-700">{code}</span>
                        <span className={`font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wide ${a.hover} transition-colors`}>
                          {label}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-zinc-600 truncate">{sub}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 shrink-0 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── SIGNAL PREVIEW + CTA ROW ──────────────────────── */}
        <section className={cn(globeInspect ? "px-0 pb-16" : "container mx-auto px-4 pb-16")}>
          <div className={cn("grid grid-cols-1 gap-4", globeInspect ? "w-full pointer-events-auto" : "max-w-4xl mx-auto md:grid-cols-5")}>

            {/* Live threat feed — 3 cols */}
            <div className={cn("os-panel-in", !globeInspect && "md:col-span-3")} style={{ animationDelay: "320ms" }}>
              <OSWindow label="signal.feed" title="live · ambient" status="active">
                <AmbientFeed
                  entries={STATIC_ENTRIES}
                  liveEntries={liveEntries}
                  interval={8000}
                  maxLines={6}
                />
                <div className="mt-4 pt-3 border-t border-zinc-800">
                  <Link
                    href="/signal"
                    className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600 hover:text-emerald-500 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    open full signal feed
                  </Link>
                </div>
              </OSWindow>
            </div>

            {/* Contact CTA — 2 cols */}
            <div className={cn("os-panel-in", !globeInspect && "md:col-span-2")} style={{ animationDelay: "400ms" }}>
              <OSWindow label="comms.channel" title="encrypted" status="idle" className="h-full">
                <div className="flex flex-col h-full gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">open channel</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Discussing opportunities, collaborations, or security work.
                    </p>
                  </div>
                  <div className="mt-auto space-y-2">
                    <Link
                      href="/contact"
                      className="flex items-center justify-between w-full rounded border border-emerald-900 bg-emerald-950/30 px-3 py-2.5 font-mono text-xs text-emerald-400 hover:bg-emerald-950/60 hover:border-emerald-800 transition-all"
                    >
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />SEND ENCRYPTED MESSAGE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/personnel"
                      className="flex items-center justify-between w-full rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2.5 font-mono text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all"
                    >
                      <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" />VIEW FULL DOSSIER</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </OSWindow>
            </div>
          </div>
        </section>
      </main>

      {/* ── SYSTEM FOOTER ─────────────────────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-900/70 bg-zinc-950/35 py-3 backdrop-blur-sm">
        <div className="px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
              GOODNBAD.EXE © {new Date().getFullYear()} — world monitor active
            </span>
            <div className="flex items-center gap-4">
              {[
                { href: "https://github.com/Goodnbadexe", label: "GitHub",   external: true  },
                { href: "https://www.linkedin.com/in/hamzah-al-ramli-505", label: "LinkedIn", external: true  },
                { href: "/files/hamzah-al-ramli-resume.pdf", label: "Resume ↗", external: true },
              ].map(({ href, label, external }) => (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="font-mono text-[10px] text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </OSDesktop>
  )
}
