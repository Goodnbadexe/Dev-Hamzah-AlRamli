'use client'

import { useCallback, useState, useEffect, type ElementType } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { ArrowRight, Shield, Terminal, Layers, Radio, Mail, User, ChevronRight, Maximize2, X, Briefcase, Newspaper, Building2, Rocket, Cloud, Database, Cable, Zap, WifiOff, Calendar, Flame, AlertTriangle, Sun, ChevronDown } from "lucide-react"
import { OSDesktop, OSTaskbar, OSWindow, AmbientFeed } from "@/components/os"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"
import type { FeedEntry } from "@/components/os"
import type { ThreatIoc } from "@/app/api/threats/route"
import { IocInspector } from "@/components/signal/IocInspector"
import { MobileSignalOverlay } from "@/components/signal/MobileSignalOverlay"

// Globe — deferred: only loads after initial paint (via requestIdleCallback)
// and never SSR'd. This keeps the homepage TTI fast; the globe fades in
// once the browser is idle or when the user taps inspect.
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
  { href: "/personnel",  code: "01", label: "PERSONNEL",  sub: "Dossier · CV · Clearance",      Icon: User,      accent: "emerald" },
  { href: "/deployments",code: "02", label: "DEPLOYMENTS",sub: "Mission files · Architecture",   Icon: Layers,    accent: "blue"    },
  { href: "/signal",     code: "03", label: "SIGNAL",     sub: "Live activity · Feed",            Icon: Radio,     accent: "yellow"  },
  { href: "/contact",    code: "04", label: "CONTACT",    sub: "Encrypted channel",               Icon: Mail,      accent: "purple"  },
  { href: "/terminal",   code: "05", label: "TERMINAL",   sub: "Command interface",               Icon: Terminal,  accent: "zinc"    },
  { href: "/services",   code: "06", label: "HIRE ME",    sub: "Services · Booking",              Icon: Briefcase, accent: "red"     },
  { href: "/news",       code: "07", label: "THREAT INTEL",sub: "Live CISA feed · Globe",         Icon: Newspaper, accent: "cyan"    },
  { href: "/security",   code: "08", label: "ATLAS",      sub: "Attacks · Actors · Incidents",    Icon: Shield,    accent: "emerald" },
]

// Single-accent system (per the homepage concept): every module is neutral and
// only lights emerald on hover. Color now means something — emerald = you.
// The `accent` keys on APP_ITEMS all resolve to this one style.
const NEUTRAL_ACCENT = {
  border: "hover:border-emerald-800/80",
  dot:    "bg-zinc-600",
  icon:   "text-zinc-400 group-hover:text-emerald-400",
  hover:  "group-hover:text-emerald-300",
}
const ACCENT: Record<string, typeof NEUTRAL_ACCENT> = new Proxy(
  {},
  { get: () => NEUTRAL_ACCENT },
) as Record<string, typeof NEUTRAL_ACCENT>

// All layer labels (used to seed the default active set)
const ALL_LAYER_LABELS = [
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

type LayerConfig = {
  label: string
  Icon: ElementType
  color: string
  glowColor: string
}

type LayerGroup = {
  category: string
  layers: LayerConfig[]
}

const LAYER_GROUPS: LayerGroup[] = [
  {
    category: "Infrastructure",
    layers: [
      { label: "Tech HQ",         Icon: Building2,     color: "#a78bfa", glowColor: "rgba(167,139,250,.5)" },
      { label: "Accelerators",    Icon: Rocket,        color: "#22c55e", glowColor: "rgba(34,197,94,.45)"  },
      { label: "Cloud Regions",   Icon: Cloud,         color: "#38bdf8", glowColor: "rgba(56,189,248,.5)"  },
      { label: "AI Data Centers", Icon: Database,      color: "#88aaff", glowColor: "rgba(136,170,255,.5)" },
      { label: "Undersea Cables", Icon: Cable,         color: "#22d3ee", glowColor: "rgba(34,211,238,.5)"  },
    ],
  },
  {
    category: "Threats",
    layers: [
      { label: "Cyber Threats",    Icon: Zap,          color: "#ff0044", glowColor: "rgba(255,0,68,.55)"   },
      { label: "Internet Outages", Icon: WifiOff,      color: "#ff2020", glowColor: "rgba(255,32,32,.5)"   },
      { label: "Fires",            Icon: Flame,        color: "#fb923c", glowColor: "rgba(251,146,60,.5)"  },
      { label: "Natural Events",   Icon: AlertTriangle,color: "#facc15", glowColor: "rgba(250,204,21,.45)" },
    ],
  },
  {
    category: "Events",
    layers: [
      { label: "Tech Events",     Icon: Calendar,      color: "#44aaff", glowColor: "rgba(68,170,255,.5)"  },
    ],
  },
  {
    category: "Display",
    layers: [
      { label: "Day / Night",     Icon: Sun,           color: "#fbbf24", glowColor: "rgba(251,191,36,.5)"  },
    ],
  },
]

const LS_KEY = "goodnbad_active_layers"

function loadActiveLayers(): Set<string> {
  if (typeof window === "undefined") return new Set(ALL_LAYER_LABELS)
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return new Set(ALL_LAYER_LABELS)
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set(parsed as string[])
  } catch { /* ignore */ }
  return new Set(ALL_LAYER_LABELS)
}

function saveActiveLayers(layers: Set<string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(layers)))
  } catch { /* ignore */ }
}

function nowTs() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

// ---------------------------------------------------------------------------
// Layer Config Panel
// ---------------------------------------------------------------------------
interface LayerPanelProps {
  activeLayers: Set<string>
  onToggle: (label: string) => void
}

function LayerPanel({ activeLayers, onToggle }: LayerPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed left-4 top-16 z-20 hidden lg:block">
      {/* Collapsed pill */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500 backdrop-blur-sm transition-all hover:border-zinc-700 hover:text-zinc-300"
        >
          <Layers className="h-3 w-3" />
          LAYERS
          <span className="ml-1 text-[8px] text-zinc-600">
            {activeLayers.size}/{ALL_LAYER_LABELS.length}
          </span>
          <ChevronDown className="h-3 w-3" />
        </button>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div
          className="w-[220px] rounded-md border border-zinc-800 bg-zinc-950/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
            <div className="flex items-center gap-2">
              <Layers className="h-3 w-3 text-zinc-500" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">World Layers</span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
              aria-label="Collapse layer panel"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Layer groups */}
          <div className="p-2 space-y-3">
            {LAYER_GROUPS.map((group) => (
              <div key={group.category}>
                <p className="px-1 mb-1.5 font-mono text-[8px] uppercase tracking-widest text-zinc-700">
                  {group.category}
                </p>
                <div className="space-y-1">
                  {group.layers.map(({ label, Icon, color, glowColor }) => {
                    const isActive = activeLayers.has(label)
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => onToggle(label)}
                        className={[
                          "w-full flex items-center gap-2 rounded px-2 py-1.5 font-mono text-[10px] transition-all duration-150",
                          "border",
                          isActive
                            ? "border-zinc-700/60 bg-zinc-900/60"
                            : "border-transparent bg-transparent opacity-40 hover:opacity-60",
                          "hover:border-zinc-700/80 hover:bg-zinc-900/70",
                        ].join(" ")}
                        style={isActive ? { boxShadow: `inset 0 0 0 1px ${glowColor}` } : undefined}
                      >
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded"
                          style={
                            isActive
                              ? { color, textShadow: `0 0 6px ${glowColor}` }
                              : { color: "#52525b" }
                          }
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                        <span
                          className="flex-1 text-left"
                          style={isActive ? { color, textShadow: `0 0 8px ${glowColor}` } : { color: "#71717a" }}
                        >
                          {label}
                        </span>
                        {/* Active indicator dot */}
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-150",
                            isActive ? "animate-pulse" : "opacity-0",
                          ].join(" ")}
                          style={isActive ? { backgroundColor: color, boxShadow: `0 0 4px ${glowColor}` } : undefined}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer — reset all */}
          <div className="border-t border-zinc-800/80 px-3 py-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                ALL_LAYER_LABELS.forEach((l) => { if (!activeLayers.has(l)) onToggle(l) })
              }}
              className="font-mono text-[8px] uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              all on
            </button>
            <span className="font-mono text-[8px] text-zinc-800">·</span>
            <button
              type="button"
              onClick={() => {
                ALL_LAYER_LABELS.forEach((l) => { if (activeLayers.has(l)) onToggle(l) })
              }}
              className="font-mono text-[8px] uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              all off
            </button>
            <span className="ml-auto font-mono text-[8px] text-zinc-700">
              {activeLayers.size}/{ALL_LAYER_LABELS.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HomePage() {
  const [liveEntries,  setLiveEntries]  = useState<FeedEntry[]>([])
  const [recentIocs,   setRecentIocs]   = useState<ThreatIoc[]>([])
  const [hoveredIoc,   setHoveredIoc]   = useState<ThreatIoc | null>(null)
  const [globeInspect, setGlobeInspect] = useState(false)
  // Detect mobile on mount (no SSR mismatch — starts false)
  const [isMobile, setIsMobile] = useState(false)
  // Globe is deferred until the browser is idle (or user taps inspect).
  // This makes the homepage TTI ~300-500ms faster on mobile.
  const [globeReady, setGlobeReady] = useState(false)
  // Layer state — initialised to all layers on; loaded from localStorage on mount
  const [activeLayers, setActiveLayers] = useState<Set<string>>(() => new Set(ALL_LAYER_LABELS))

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  // Defer globe mounting until after first paint settles.
  // Uses requestIdleCallback where available, falls back to setTimeout.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setGlobeReady(true), { timeout: 2500 })
    } else {
      timeoutId = setTimeout(() => setGlobeReady(true), 1800)
    }

    return () => {
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // If the user taps inspect before the idle callback fires, mount immediately.
  useEffect(() => {
    if (globeInspect) setGlobeReady(true)
  }, [globeInspect])

  // Load persisted layer preferences from localStorage on mount
  useEffect(() => {
    setActiveLayers(loadActiveLayers())
  }, [])

  // Toggle a single layer in/out of the active set
  const handleLayerToggle = useCallback((label: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      saveActiveLayers(next)
      return next
    })
  }, [])

  // Each globe drip fires this — converts an IOC → ambient feed entry + rail.
  const handleIoc = useCallback((ioc: ThreatIoc) => {
    const entry: FeedEntry = {
      ts:     nowTs(),
      type:   "threat",
      label:  `${ioc.type.replace("_", " ")}: ${ioc.country}`,
      detail: `${ioc.source} · ${ioc.severity}`,
    }
    setLiveEntries(prev => [entry, ...prev].slice(0, 20))
    setRecentIocs(prev => {
      if (prev[0]?.id === ioc.id) return prev
      return [ioc, ...prev].slice(0, 12)
    })
  }, [])

  return (
    <OSDesktop>
      {/* ------------------------------------------------------------------ */}
      {/* GLOBE — fixed full-viewport background layer                        */}
      {/* Renders a lightweight gradient until idle, then fades in the globe. */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed inset-0 z-0">
        {!globeReady && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(16,185,129,0.08) 0%, rgba(9,9,11,0) 55%), radial-gradient(ellipse 100% 100% at 50% 50%, #0a0a0c 40%, #000 100%)",
            }}
            aria-hidden
          />
        )}
        {globeReady && (
          <div className="absolute inset-0 animate-[fadeIn_700ms_ease-out_forwards]">
            <ThreatGlobe
              interactive={globeInspect}
              showWorldLayers
              activeLayers={activeLayers}
              nightMode={activeLayers.has("Day / Night")}
              onIoc={handleIoc}
              onIocSelect={setHoveredIoc}
              onGlobeClick={() => setGlobeInspect(true)}
            />
          </div>
        )}
      </div>

      {/* Dark radial vignette — keeps content readable over globe */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            globeInspect
              ? "radial-gradient(ellipse 80% 75% at 38% 50%, rgba(9,9,11,0.08) 0%, rgba(9,9,11,0.5) 100%)"
              : "radial-gradient(120% 90% at 72% 44%, rgba(9,9,11,0) 0%, rgba(9,9,11,0.32) 58%, rgba(9,9,11,0.72) 100%)",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* SITE CHROME                                                          */}
      {/* ------------------------------------------------------------------ */}
      <OSTaskbar />

      <LayerPanel activeLayers={activeLayers} onToggle={handleLayerToggle} />

      {/* Live IOC surface — side rail + slide-to-center inspector */}
      <IocInspector recent={recentIocs} hovered={hoveredIoc} railHidden={globeInspect || isMobile} />

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
              className={cn("hero-enter transition-all duration-700", globeInspect && "bg-zinc-950/70")}
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
                  <h1 className={cn(
                    "font-bold text-zinc-100 tracking-tight leading-[0.95]",
                    globeInspect ? "text-2xl" : "text-3xl sm:text-4xl md:text-5xl"
                  )}>
                    <GlitchText text="Goodnbad.exe" />
                  </h1>
                  <p className="text-zinc-300 text-sm sm:text-base mt-1.5">
                    Hamzah Al-Ramli — <span className="text-zinc-100 font-semibold">Cybersecurity &amp; Automation Architect</span>
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
            <div className="mb-4 flex items-center gap-3" style={{ animationDelay: "180ms" }}>
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">os.modules</span>
              <span className="h-px flex-1 bg-gradient-to-r from-zinc-800 via-zinc-900 to-transparent" />
              <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">{APP_ITEMS.length} loaded</span>
            </div>
            <div className={cn("grid grid-cols-1 gap-3", !globeInspect && "sm:grid-cols-2 lg:grid-cols-3")}>
              {APP_ITEMS.map(({ href, code, label, sub, Icon, accent }, i) => {
                const a = ACCENT[accent]
                return (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      "group relative flex items-center gap-4 rounded-md border border-zinc-800",
                      "bg-zinc-900/75 px-4 py-3.5 backdrop-blur-md overflow-hidden",
                      "transition-all duration-250",
                      "hover:bg-zinc-900/95 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
                      "hover:-translate-y-px",
                      a.border, "card-enter",
                    ].join(" ")}
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    {/* Subtle sweep on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.025)_50%,transparent_70%)]"
                    />
                    <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded bg-zinc-950 border border-zinc-800 group-hover:border-zinc-600 transition-all duration-250 group-hover:shadow-[0_0_12px_rgba(0,0,0,0.4)]`}>
                      <Icon className={`w-4 h-4 ${a.icon} transition-transform duration-250 group-hover:scale-110`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono text-[9px] text-zinc-700">{code}</span>
                        <span className={`font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wide ${a.hover} transition-colors duration-200`}>
                          {label}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-zinc-600 truncate group-hover:text-zinc-500 transition-colors duration-200">{sub}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 shrink-0 transition-all duration-200" />
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
            <div className={cn("card-enter", !globeInspect && "md:col-span-3")} style={{ animationDelay: "380ms" }}>
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
            <div className={cn("card-enter", !globeInspect && "md:col-span-2")} style={{ animationDelay: "460ms" }}>
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

      {/* ── MOBILE SIGNAL OVERLAY ─────────────────────────── */}
      {/* On mobile, globe inspect mode shows SIGNAL.FEED fullscreen instead of
          the compressed right-panel layout used on desktop. Content is hidden
          by the overlay (z-50 covers everything including OSTaskbar). */}
      {globeInspect && isMobile && (
        <MobileSignalOverlay onClose={() => setGlobeInspect(false)} />
      )}

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
