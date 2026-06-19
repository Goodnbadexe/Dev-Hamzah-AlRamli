'use client'

import { useCallback, useState, useEffect, type ElementType } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, Terminal, Layers, Mail, User, ChevronRight, ChevronDown, Maximize2, X, Building2, Rocket, Cloud, Database, Cable, Zap, WifiOff, Calendar, Flame, AlertTriangle, Sun, Lock } from "lucide-react"
import { OSDesktop, OSTaskbar, AmbientFeed } from "@/components/os"
import { cn } from "@/lib/utils"
import type { FeedEntry } from "@/components/os"
import type { ThreatIoc } from "@/app/api/threats/route"
import { IocInspector } from "@/components/signal/IocInspector"
import { MobileSignalOverlay } from "@/components/signal/MobileSignalOverlay"
import { useLanguage } from "@/components/language-provider"

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
// Module launcher — single-accent (per the homepage concept): every module is
// neutral and only lights emerald on hover. Color means something here:
// emerald = you, red = threat. Nothing else competes.
// ---------------------------------------------------------------------------
const MODULE_ITEMS: { href: string; code: string; label: string; ar: string; sub: string; subAr: string; Icon: ElementType }[] = [
  { href: "/subscribe",   code: "01", label: "TOOLKIT VAULT", ar: "خزينة الأدوات", sub: "Weekly security + AI tools · Subscribe", subAr: "أدوات الأمن والذكاء الاصطناعي أسبوعياً · اشترك", Icon: Lock },
  { href: "/personnel",   code: "02", label: "PERSONNEL",   ar: "الملف الشخصي", sub: "Dossier · CV · Clearance",     subAr: "السيرة الذاتية · الملف · التصريح", Icon: User     },
  { href: "/deployments", code: "03", label: "DEPLOYMENTS", ar: "المشاريع",     sub: "Mission files · Architecture", subAr: "ملفات المهام · البنية",            Icon: Layers   },
  { href: "/contact",     code: "04", label: "CONTACT",     ar: "تواصل",        sub: "Encrypted channel",            subAr: "قناة مشفّرة",                      Icon: Mail     },
  { href: "/terminal",    code: "05", label: "TERMINAL",    ar: "الطرفية",      sub: "Command interface",            subAr: "واجهة الأوامر",                    Icon: Terminal },
]

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
  const { t, dir } = useLanguage()
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

  // Shared section wrapper: a LEFT-anchored content column so the hero, modules
  // and feed all sit on the left half while the globe owns the right half —
  // a true side-by-side split, never stacked on top of the globe. Flush column
  // in inspect mode (content slides to the right rail).
  const wrap = (inspect: boolean, extra: string) =>
    cn(inspect ? "px-0" : "w-full mr-auto px-5 sm:px-8 lg:pl-20 lg:pr-0 lg:max-w-[700px] xl:max-w-[760px]", extra)

  return (
    <OSDesktop>
      {/* ------------------------------------------------------------------ */}
      {/* GLOBE — fixed full-viewport background layer, pushed RIGHT so the   */}
      {/* left-anchored hero owns the page (per the homepage concept).        */}
      {/* Renders a lightweight gradient until idle, then fades in the globe. */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed right-0 top-0 bottom-0 z-0 w-full lg:w-1/2 xl:w-[55%]">
        {/* Mobile: skip WebGL entirely — show animated CSS background */}
        {isMobile ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(16,185,129,0.10) 0%, rgba(9,9,11,0) 55%), radial-gradient(ellipse 100% 100% at 50% 50%, #0a0a0c 40%, #000 100%)",
              animation: "pulse 6s ease-in-out infinite alternate",
            }}
            aria-hidden
          />
        ) : (
          <>
            {!globeReady && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 70% 50%, rgba(16,185,129,0.08) 0%, rgba(9,9,11,0) 55%), radial-gradient(ellipse 100% 100% at 50% 50%, #0a0a0c 40%, #000 100%)",
                }}
                aria-hidden
              />
            )}
            {globeReady && (
              <div className="absolute inset-0 animate-[fadeIn_700ms_ease-out_forwards]" style={{ opacity: 0 }}>
                <ThreatGlobe
                  interactive={globeInspect}
                  align="center"
                  showWorldLayers
                  activeLayers={activeLayers}
                  nightMode={activeLayers.has("Day / Night")}
                  onIoc={handleIoc}
                  onIocSelect={setHoveredIoc}
                  onGlobeClick={() => setGlobeInspect(true)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Faint structural grid — sits above the globe, below the veil */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='48' height='48' fill='none' stroke='rgb(255 255 255 / 0.022)'%3e%3cpath d='M0 .5H47.5V48'/%3e%3c/svg%3e\")",
        }}
      />

      {/* Veil — a far lighter vignette than before (so the globe reads as a
          hero) plus a left-dark gradient that anchors the text column. */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: isMobile
            ? "radial-gradient(120% 80% at 50% 34%, rgba(9,9,11,0.18) 0%, rgba(9,9,11,0.88) 80%)"
            : globeInspect
              ? "radial-gradient(ellipse 80% 75% at 38% 50%, rgba(9,9,11,0.08) 0%, rgba(9,9,11,0.5) 100%)"
              : "radial-gradient(120% 90% at 76% 42%, rgba(9,9,11,0) 0%, rgba(9,9,11,0.35) 55%, rgba(9,9,11,0.86) 100%), linear-gradient(90deg, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.55) 38%, rgba(9,9,11,0) 70%)",
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
        inspect cyberattacks
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
        <section className={wrap(globeInspect, globeInspect ? "pt-4 pb-3" : "pt-[9vh] pb-[7vh]")}>
          <div className="w-full pointer-events-auto" dir={dir}>
            {/* Kicker */}
            <span className="inline-flex items-center gap-2.5 mb-[30px] rounded-[5px] border border-zinc-800 bg-zinc-900/50 px-3.5 py-[7px] font-mono text-[11px] uppercase tracking-[0.26em] text-zinc-400 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]" />
              {t("الهوية موثّقة · الرياض، السعودية", "SUBJECT VERIFIED · RIYADH, SA")}
            </span>

            {/* Identity — display scale (sized to fit the left column), restrained
                chromatic flicker on the name only. */}
            <h1
              className="text-balance font-bold leading-[0.92] tracking-[-0.035em] text-zinc-100"
              style={{ fontSize: globeInspect ? "1.75rem" : "clamp(48px, 8.4vw, 104px)" }}
            >
              <span className="glitch-id" data-t="Goodnbad">Goodnbad</span>
              <span className="text-zinc-600">.exe</span>
            </h1>

            {/* Role line */}
            <p
              className="mt-[26px] max-w-[48ch] leading-[1.5] text-zinc-300"
              style={{ fontSize: globeInspect ? "1rem" : "clamp(17px, 2vw, 21px)" }}
            >
              {t("حمزة الرملي — ", "Hamzah Al-Ramli — ")}<span className="font-semibold text-zinc-100">{t("أخصائي أمن سيبراني وأتمتة.", "Cybersecurity & Automation Architect.")}</span>{" "}
              {t("أبني أنظمة دفاعية وأدوات لرصد التهديدات والأتمتة التي تشغّلها.", "I build defensive systems, threat tooling, and the automation that runs them.")}
            </p>

            {/* Credential chips — cert names stay English; surrounding labels translate */}
            <div className="mt-[22px] flex flex-wrap gap-2.5 font-mono text-[11px] text-zinc-400">
              {[
                t("CEH (قيد الإنجاز)", "CEH (pursuing)"),
                t("Security+ (قيد الإنجاز)", "Security+ (pursuing)"),
                "Google Cybersecurity",
                t("بكالوريوس علوم حاسب · جامعة تايلورز", "BSc CS · Taylor's University"),
              ].map((m) => (
                <span key={m} className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                  {m}
                </span>
              ))}
            </div>

            {/* One primary action; everything else recedes */}
            <div className="mt-[38px] flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-md bg-emerald-500 px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
              >
                <Mail className="h-4 w-4" />
                {t("افتح قناة مشفّرة", "Open encrypted channel")}
              </Link>
              <Link
                href="/personnel"
                className="inline-flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950/40 px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-zinc-100"
              >
                {t("عرض الملف الكامل", "View full dossier")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── MODULE LAUNCHER ───────────────────────────────── */}
        {/* Unlike the hero/feed (narrow left column), the launcher breaks out to
            a full-width left-anchored STRIP — one horizontal row of all five
            modules on desktop. It deliberately overlays the globe on the right
            (cards keep backdrop-blur so they stay legible). */}
        <section className={globeInspect ? wrap(true, "pb-12") : "w-full mr-auto px-5 sm:px-8 lg:pl-20 lg:pr-8 pb-12"}>
          <div className={cn(globeInspect && "w-full pointer-events-auto")}>
            <div className="mb-4 flex items-center gap-3.5 font-mono text-[12px] uppercase tracking-[0.22em] text-zinc-500">
              <span>os.modules</span>
              <span className="h-px flex-1 bg-zinc-900" />
            </div>
            <div className={cn("grid gap-3", globeInspect ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5")}>
              {MODULE_ITEMS.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/55 px-5 py-5 backdrop-blur-md transition-all duration-200 os-panel-in hover:-translate-y-[3px] hover:border-emerald-800/80 hover:bg-zinc-900/90"
                  dir={dir}
                >
                  <span className="font-mono text-[11px] tracking-wider text-zinc-500">{item.code}</span>
                  <ChevronRight className="absolute right-4 top-5 h-4 w-4 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                  <div className="mb-4 mt-4 grid h-10 w-10 place-items-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 transition-all group-hover:border-emerald-900 group-hover:text-emerald-400">
                    <item.Icon className="h-[19px] w-[19px]" />
                  </div>
                  <div className="font-mono text-sm font-semibold tracking-wide text-zinc-100">{t(item.ar, item.label)}</div>
                  <div className="mt-1.5 font-mono text-[11px] leading-[1.5] text-zinc-500">{t(item.subAr, item.sub)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE SIGNAL STRIP ─────────────────────────────── */}
        <section className={wrap(globeInspect, globeInspect ? "pb-16" : "pb-20")}>
          <div className={cn(globeInspect && "w-full pointer-events-auto")}>
            <div
              className="overflow-hidden rounded-[10px] border border-zinc-800 bg-zinc-950/55 backdrop-blur-md os-panel-in"
              style={{ animationDelay: "320ms" }}
            >
              <div className="flex items-center gap-2.5 border-b border-zinc-900 bg-zinc-950/40 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
                signal.feed
                <span className="ml-auto text-zinc-500">live · ambient</span>
              </div>
              <div className="px-4 py-4">
                <AmbientFeed
                  entries={STATIC_ENTRIES}
                  liveEntries={liveEntries}
                  interval={8000}
                  maxLines={6}
                />
                <div className="mt-4 border-t border-zinc-900 pt-3.5">
                  <Link
                    href="/news"
                    className="flex items-center gap-1.5 font-mono text-[12px] text-zinc-500 transition-colors hover:text-emerald-500"
                  >
                    <ArrowRight className="h-3 w-3" />
                    open full signal feed
                  </Link>
                </div>
              </div>
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
              GOODNBAD.EXE © {new Date().getFullYear()} — live cyberattack monitor
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
