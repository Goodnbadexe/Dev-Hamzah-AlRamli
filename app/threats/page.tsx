"use client"

/**
 * /threats — Cyber Threat Globe
 *
 * Full-screen live 3D cyber threat visualization.
 * Keeps the OS taskbar for navigation but otherwise fills 100% of the
 * viewport. No panels, no clutter — just the globe and a minimal HUD.
 *
 * Features:
 *  - 3D WebGL globe with animated attack arcs (drip-fed, one at a time)
 *  - Web Audio API notification ping on each new attack (no library needed)
 *  - Severity-coded ping tones: critical = high pitched, low = soft
 *  - Mute / unmute toggle
 *  - HUD: attack counter, top source country, last event strip
 *  - Auto-refreshes threat pool every 30 s
 */

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Globe2, Volume2, VolumeX, Zap, Shield, Activity } from "lucide-react"
import { OSDesktop } from "@/components/os/OSDesktop"
import { OSTaskbar } from "@/components/os/OSTaskbar"
import type { ThreatEvent } from "@/app/api/threats/route"

const ThreatGlobe = dynamic(
  () => import("@/components/signal/ThreatGlobe").then((m) => ({ default: m.ThreatGlobe })),
  { ssr: false, loading: () => null }
)

// ---------------------------------------------------------------------------
// Web Audio ping — no library, no audio file, zero overhead
// ---------------------------------------------------------------------------
function playPing(severity: ThreatEvent["severity"], muted: boolean) {
  if (muted || typeof window === "undefined") return
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    // Severity → frequency + character
    const freqMap = { critical: 1100, high: 820, medium: 580, low: 380 }
    osc.type      = severity === "critical" ? "square" : "sine"
    osc.frequency.setValueAtTime(freqMap[severity], ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freqMap[severity] * 0.6, ctx.currentTime + 0.18)

    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)

    // Critical attacks get a second short blip
    if (severity === "critical") {
      const osc2  = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = "square"
      osc2.frequency.setValueAtTime(1400, ctx.currentTime + 0.28)
      gain2.gain.setValueAtTime(0.05, ctx.currentTime + 0.28)
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42)
      osc2.start(ctx.currentTime + 0.28)
      osc2.stop(ctx.currentTime + 0.45)
    }
  } catch {
    // AudioContext blocked by browser policy (user hasn't interacted yet)
  }
}

// ---------------------------------------------------------------------------
// Severity colours
// ---------------------------------------------------------------------------
const SEV: Record<string, { text: string; dot: string }> = {
  critical: { text: "text-red-400",    dot: "bg-red-500 shadow-[0_0_8px_theme(colors.red.500)]"    },
  high:     { text: "text-orange-400", dot: "bg-orange-500 shadow-[0_0_6px_theme(colors.orange.500)]" },
  medium:   { text: "text-yellow-400", dot: "bg-yellow-500"  },
  low:      { text: "text-zinc-400",   dot: "bg-zinc-600"    },
}

const TYPE_COLOR: Record<string, string> = {
  DDoS:       "text-red-400",
  Bruteforce: "text-orange-400",
  Ransomware: "text-purple-400",
  SQLi:       "text-blue-400",
  RCE:        "text-pink-400",
  Recon:      "text-emerald-400",
  Phishing:   "text-yellow-400",
  PortScan:   "text-teal-400",
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ThreatsPage() {
  const [muted,        setMuted]        = useState(false)
  const [totalCount,   setTotalCount]   = useState(0)
  const [recentEvents, setRecentEvents] = useState<ThreatEvent[]>([])
  const [topSource,    setTopSource]    = useState<string>("—")
  const [lastEvent,    setLastEvent]    = useState<ThreatEvent | null>(null)
  const [tickerOn,     setTickerOn]     = useState(false)
  const tickerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sourceCounts = useRef<Record<string, number>>({})

  // Called by ThreatGlobe each time a new arc fires
  const handleAttack = useCallback((attack: ThreatEvent) => {
    playPing(attack.severity, muted)

    setTotalCount(c => c + 1)

    setRecentEvents(prev => [attack, ...prev].slice(0, 6))

    sourceCounts.current[attack.srcCountry] = (sourceCounts.current[attack.srcCountry] ?? 0) + 1
    const top = Object.entries(sourceCounts.current).sort((a, b) => b[1] - a[1])[0]
    setTopSource(top ? top[0] : "—")

    setLastEvent(attack)
    setTickerOn(true)
    if (tickerRef.current) clearTimeout(tickerRef.current)
    tickerRef.current = setTimeout(() => setTickerOn(false), 4000)
  }, [muted])

  // Unlock AudioContext on first interaction (browser policy)
  const handleFirstInteraction = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      ctx.resume().catch(() => {})
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    window.addEventListener("click", handleFirstInteraction, { once: true })
    window.addEventListener("keydown", handleFirstInteraction, { once: true })
    return () => {
      window.removeEventListener("click", handleFirstInteraction)
      window.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [handleFirstInteraction])

  return (
    <OSDesktop skipBoot>
      <OSTaskbar />

      {/* ------------------------------------------------------------------ */}
      {/* Full-screen container — globe fills everything                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed inset-0 pt-11 bg-zinc-950">

        {/* Globe — fills remaining viewport */}
        <div className="absolute inset-0 pt-11">
          <ThreatGlobe interactive onAttack={handleAttack} />
        </div>

        {/* Subtle edge vignette — keeps HUD text readable */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(9,9,11,0.6) 100%)",
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/* TOP-LEFT HUD — identity                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="pointer-events-none absolute left-4 top-16 z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Globe2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
              threat.globe
            </span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
            <span className="font-mono text-[9px] text-emerald-700 uppercase tracking-widest">live</span>
          </div>
          <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
            goodnbad.exe / cyber-intelligence
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TOP-RIGHT HUD — stats                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="pointer-events-none absolute right-4 top-16 z-10 flex flex-col items-end gap-2">

          {/* Attack counter */}
          <div className="rounded border border-zinc-800/60 bg-zinc-950/70 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              Events detected
            </p>
            <p className="mt-0.5 font-mono text-2xl font-bold text-zinc-100 tabular-nums">
              {totalCount.toLocaleString()}
            </p>
          </div>

          {/* Top source */}
          <div className="rounded border border-zinc-800/60 bg-zinc-950/70 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
              Top source
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-red-400">
              {topSource}
            </p>
          </div>

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM-LEFT — recent event log (last 6)                         */}
        {/* ---------------------------------------------------------------- */}
        <div className="pointer-events-none absolute bottom-8 left-4 z-10 w-72 space-y-1">
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-700 mb-2 flex items-center gap-1.5">
            <Activity className="h-3 w-3" />
            Recent events
          </p>
          {recentEvents.map((ev, i) => (
            <div
              key={`${ev.id}-${i}`}
              className="flex items-center gap-2 rounded border border-zinc-800/50 bg-zinc-950/60 px-2.5 py-1.5 backdrop-blur-sm"
              style={{ opacity: 1 - i * 0.13 }}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${SEV[ev.severity]?.dot ?? "bg-zinc-600"}`} />
              <span className={`font-mono text-[10px] font-semibold shrink-0 w-20 ${TYPE_COLOR[ev.type] ?? "text-zinc-400"}`}>
                {ev.type}
              </span>
              <span className="font-mono text-[10px] text-zinc-500 truncate">
                {ev.srcCountry} → {ev.tgtCountry}
              </span>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM-RIGHT — new attack ticker + mute toggle                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="absolute bottom-8 right-4 z-10 flex flex-col items-end gap-3">

          {/* Mute button */}
          <button
            onClick={() => setMuted(m => !m)}
            className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-950/70 px-3 py-2
                       font-mono text-[10px] uppercase tracking-widest text-zinc-500
                       backdrop-blur-sm transition hover:border-zinc-600 hover:text-zinc-300"
            aria-label={muted ? "Unmute alerts" : "Mute alerts"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {muted ? "sound off" : "sound on"}
          </button>

          {/* Incoming attack toast */}
          <div
            className={`transition-all duration-500 ${tickerOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
          >
            {lastEvent && (
              <div
                className={`flex items-start gap-2.5 rounded-md border bg-zinc-950/80 px-3 py-2.5 backdrop-blur-md font-mono text-[11px] max-w-[220px]
                  ${lastEvent.severity === "critical"
                    ? "border-red-800/70 text-red-400"
                    : lastEvent.severity === "high"
                    ? "border-orange-800/70 text-orange-400"
                    : "border-zinc-700/60 text-zinc-300"}`}
              >
                <Zap className="h-3 w-3 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{lastEvent.type}</span>
                    <span className={`text-[9px] uppercase tracking-widest ${SEV[lastEvent.severity]?.text}`}>
                      {lastEvent.severity}
                    </span>
                  </div>
                  <div className="mt-0.5 text-zinc-500">
                    {lastEvent.srcCountry}
                    <span className="mx-1 text-zinc-700">→</span>
                    {lastEvent.tgtCountry}
                  </div>
                  <div className="mt-0.5 text-[9px] text-zinc-700">
                    {lastEvent.count.toLocaleString()} events detected
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM-CENTER — subtle instruction                               */}
        {/* ---------------------------------------------------------------- */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-800 flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            NASA Blue Marble · cloud layer · real-time solar angle · Feodo Tracker C2 feed · refreshes every 30s
          </p>
        </div>

      </div>
    </OSDesktop>
  )
}
