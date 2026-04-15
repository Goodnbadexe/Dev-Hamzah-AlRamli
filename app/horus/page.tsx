"use client"

/**
 * /horus — HORUS-EYE Intelligence Platform
 *
 * Phase 1 (no API keys):
 *   ✈  Live aircraft — OpenSky Network (worldwide, refreshes every 30 s)
 *   🛰  Satellite texture — NASA GIBS VIIRS near-real-time (no key, ~2 day lag)
 *   🔮  Route prediction — 15-minute dead reckoning on selected aircraft
 *
 * Phase 2 (keys pending):
 *   ⚓  Maritime — AISHub vessel tracking
 *   🌦  Weather — OpenWeatherMap overlay
 */

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import {
  Eye, RefreshCw, Layers, Globe2, Satellite,
  Moon, Radio, ChevronDown, ChevronUp, X,
  Navigation, Gauge, Wind, TrendingUp, TrendingDown, Minus,
} from "lucide-react"
import { OSDesktop } from "@/components/os/OSDesktop"
import { OSTaskbar } from "@/components/os/OSTaskbar"
import { cn } from "@/lib/utils"
import type { AircraftState, GlobeMode, HorusLayerState, AircraftResponse } from "@/components/horus/types"

// SSR-safe lazy import
const HorusGlobe = dynamic(
  () => import("@/components/horus/HorusGlobe").then(m => ({ default: m.HorusGlobe })),
  { ssr: false, loading: () => null }
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function metresToFeet(m: number) { return Math.round(m * 3.281).toLocaleString() }
function msToKnots(ms: number)   { return Math.round(ms * 1.944) }
function msToKmh(ms: number)     { return Math.round(ms * 3.6) }

function vertRateLabel(vr: number) {
  if (vr >  1) return { text: `+${Math.round(vr)} m/s`, Icon: TrendingUp,   cls: "text-emerald-400" }
  if (vr < -1) return { text: `${Math.round(vr)} m/s`,  Icon: TrendingDown, cls: "text-red-400"     }
  return              { text: "Level",                   Icon: Minus,        cls: "text-zinc-500"    }
}

function modeIcon(mode: GlobeMode) {
  if (mode === "satellite") return <Satellite className="h-3 w-3" />
  if (mode === "night")     return <Moon      className="h-3 w-3" />
  return                           <Globe2    className="h-3 w-3" />
}

const GLOBE_MODES: GlobeMode[] = ["bluemarble", "satellite", "night"]
const GLOBE_MODE_LABELS: Record<GlobeMode, string> = {
  bluemarble: "Blue Marble",
  satellite:  "NASA GIBS",
  night:      "Night Lights",
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HorusPage() {
  const [aircraft,     setAircraft]     = useState<AircraftState[]>([])
  const [fetchedAt,    setFetchedAt]    = useState("")
  const [totalGlobal,  setTotalGlobal]  = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)
  const [fetchError,   setFetchError]   = useState("")

  const [selected,     setSelected]     = useState<AircraftState | null>(null)
  const [globeMode,    setGlobeMode]    = useState<GlobeMode>("bluemarble")
  const [layers,       setLayers]       = useState<HorusLayerState>({
    aircraft:   true,
    prediction: true,
    labels:     false,
    satellite:  false,
  })
  const [layerPanelOpen,  setLayerPanelOpen]  = useState(true)
  const [statsOpen,       setStatsOpen]       = useState(true)
  const [viewportSize,    setViewportSize]     = useState({ w: 1440, h: 900 })

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // -------------------------------------------------------------------
  // Viewport
  // -------------------------------------------------------------------
  useEffect(() => {
    const sync = () => setViewportSize({ w: window.innerWidth, h: window.innerHeight })
    sync()
    window.addEventListener("resize", sync, { passive: true })
    return () => window.removeEventListener("resize", sync)
  }, [])

  // -------------------------------------------------------------------
  // Fetch aircraft
  // -------------------------------------------------------------------
  const fetchAircraft = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch("/api/horus/aircraft")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: AircraftResponse = await res.json()
      setAircraft(data.aircraft)
      setFetchedAt(data.fetchedAt)
      setTotalGlobal(data.total)
      setFetchError(data.error ?? "")
    } catch (err) {
      console.error("[horus] fetch failed:", err)
      setFetchError(String(err))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchAircraft()
    pollRef.current = setInterval(() => fetchAircraft(true), 30_000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchAircraft])

  // -------------------------------------------------------------------
  // Layer toggle — satellite mode also flips globe texture
  // -------------------------------------------------------------------
  function toggleLayer(key: keyof HorusLayerState) {
    if (key === "satellite") {
      setGlobeMode(prev => prev === "satellite" ? "bluemarble" : "satellite")
      setLayers(l => ({ ...l, satellite: !l.satellite }))
    } else {
      setLayers(l => ({ ...l, [key]: !l[key] }))
    }
  }

  function cycleGlobeMode() {
    setGlobeMode(prev => {
      const next = GLOBE_MODES[(GLOBE_MODES.indexOf(prev) + 1) % GLOBE_MODES.length]
      setLayers(l => ({ ...l, satellite: next === "satellite" }))
      return next
    })
  }

  // -------------------------------------------------------------------
  // Compute stats
  // -------------------------------------------------------------------
  const altBands = aircraft.reduce(
    (acc, a) => {
      if (a.altitude > 10_000) acc.cruise++
      else if (a.altitude > 1_000) acc.enroute++
      else acc.approach++
      return acc
    },
    { cruise: 0, enroute: 0, approach: 0 }
  )

  const vr = selected ? vertRateLabel(selected.verticalRate) : null

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <OSDesktop skipBoot>
      <OSTaskbar />

      {/* Full-screen canvas */}
      <div className="fixed inset-0 pt-11 bg-zinc-950">

        {/* Globe — fills remaining viewport */}
        <div className="absolute inset-0 pt-11 overflow-hidden">
          {!loading && (
            <HorusGlobe
              aircraft={layers.aircraft ? aircraft : []}
              selected={selected}
              globeMode={globeMode}
              showPrediction={layers.prediction}
              showLabels={layers.labels}
              onSelect={setSelected}
              width={viewportSize.w}
              height={viewportSize.h - 44}
            />
          )}
        </div>

        {/* Edge vignette — keeps HUD readable */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(9,9,11,0.55) 100%)",
          }}
        />

        {/* ============================================================ */}
        {/* TOP-LEFT — identity + live status                             */}
        {/* ============================================================ */}
        <div className="pointer-events-none absolute left-4 top-16 z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-500" />
            <span className="font-mono text-sm font-bold text-emerald-500 uppercase tracking-widest">
              HORUS-EYE
            </span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
            <span className="font-mono text-[9px] text-emerald-700 uppercase tracking-widest">LIVE</span>
          </div>
          <p className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
            goodnbad.exe / air-intelligence · opensky network
          </p>
        </div>

        {/* ============================================================ */}
        {/* TOP-RIGHT — aircraft stats panel                              */}
        {/* ============================================================ */}
        <div className="absolute right-4 top-16 z-10 w-52">
          <div className="rounded-md border border-zinc-800/70 bg-zinc-950/80 backdrop-blur-sm overflow-hidden">

            {/* Panel header */}
            <button
              onClick={() => setStatsOpen(o => !o)}
              className="flex w-full items-center justify-between px-3 py-2 border-b border-zinc-800/60"
            >
              <div className="flex items-center gap-2">
                <Radio className="h-3 w-3 text-emerald-600" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Air Traffic
                </span>
              </div>
              {statsOpen
                ? <ChevronUp   className="h-3 w-3 text-zinc-700" />
                : <ChevronDown className="h-3 w-3 text-zinc-700" />}
            </button>

            {statsOpen && (
              <div className="p-3 space-y-2.5">

                {/* Total tracked */}
                <div>
                  <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">
                    Tracked / Global
                  </p>
                  <p className="font-mono text-2xl font-bold text-zinc-100 tabular-nums leading-none">
                    {loading ? "—" : aircraft.length.toLocaleString()}
                    <span className="text-zinc-700 text-sm font-normal ml-1">
                      / {totalGlobal.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Altitude bands */}
                {!loading && (
                  <div className="space-y-1">
                    {[
                      { label: "Cruising  >10 km", count: altBands.cruise,   color: "bg-blue-500"   },
                      { label: "En-route  1–10 km", count: altBands.enroute,  color: "bg-emerald-500" },
                      { label: "Low       <1 km",   count: altBands.approach, color: "bg-amber-500"  },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", color)} />
                          <span className="font-mono text-[9px] text-zinc-600">{label}</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 tabular-nums">{count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Refresh row */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                  <span className="font-mono text-[9px] text-zinc-700 truncate">
                    {fetchedAt
                      ? new Date(fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                      : "—"}
                  </span>
                  <button
                    onClick={() => fetchAircraft(true)}
                    disabled={refreshing}
                    className="flex items-center gap-1 font-mono text-[9px] text-zinc-600 hover:text-emerald-500 transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className={cn("h-2.5 w-2.5", refreshing && "animate-spin")} />
                    {refreshing ? "Sync…" : "Refresh"}
                  </button>
                </div>

                {fetchError && (
                  <p className="font-mono text-[9px] text-red-700 truncate">{fetchError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM-LEFT — layer controls                                  */}
        {/* ============================================================ */}
        <div className="absolute bottom-8 left-4 z-10 w-52">
          <div className="rounded-md border border-zinc-800/70 bg-zinc-950/80 backdrop-blur-sm overflow-hidden">

            <button
              onClick={() => setLayerPanelOpen(o => !o)}
              className="flex w-full items-center justify-between px-3 py-2 border-b border-zinc-800/60"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3 w-3 text-zinc-500" />
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Layers
                </span>
              </div>
              {layerPanelOpen
                ? <ChevronDown className="h-3 w-3 text-zinc-700" />
                : <ChevronUp   className="h-3 w-3 text-zinc-700" />}
            </button>

            {layerPanelOpen && (
              <div className="p-3 space-y-1.5">

                {/* Globe mode */}
                <button
                  onClick={cycleGlobeMode}
                  className="flex w-full items-center justify-between rounded border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
                >
                  <div className="flex items-center gap-2">
                    {modeIcon(globeMode)}
                    <span>Globe: {GLOBE_MODE_LABELS[globeMode]}</span>
                  </div>
                  <span className="text-zinc-700 text-[9px]">cycle</span>
                </button>

                {/* Layer toggles */}
                {([
                  { key: "aircraft"  as const, label: "Aircraft",          dot: "bg-blue-500"    },
                  { key: "prediction"as const, label: "Route prediction",  dot: "bg-emerald-500" },
                  { key: "labels"    as const, label: "Callsign labels",   dot: "bg-zinc-500"    },
                ] as const).map(({ key, label, dot }) => (
                  <button
                    key={key}
                    onClick={() => toggleLayer(key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded border px-2.5 py-1.5 font-mono text-[10px] transition",
                      layers[key]
                        ? "border-zinc-700 bg-zinc-900/70 text-zinc-300"
                        : "border-zinc-800/50 bg-zinc-950/30 text-zinc-600 hover:border-zinc-800 hover:text-zinc-500"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", layers[key] ? dot : "bg-zinc-700")} />
                      {label}
                    </div>
                    <span className={layers[key] ? "text-emerald-600" : "text-zinc-700"}>
                      {layers[key] ? "ON" : "OFF"}
                    </span>
                  </button>
                ))}

                {/* Phase 2 stubs — shown as coming soon */}
                <div className="pt-1 border-t border-zinc-900 space-y-1">
                  {[
                    { label: "Maritime vessels",   phase: "AISHub key" },
                    { label: "Weather overlay",    phase: "OWM key"    },
                  ].map(({ label, phase }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-2.5 py-1.5 font-mono text-[10px] text-zinc-700 rounded border border-zinc-900/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-800 shrink-0" />
                        {label}
                      </div>
                      <span className="text-zinc-800 text-[9px]">{phase}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM-RIGHT — selected aircraft dossier                      */}
        {/* ============================================================ */}
        {selected && (
          <div className="absolute bottom-8 right-4 z-10 w-64">
            <div className="rounded-md border border-emerald-900/60 bg-zinc-950/85 backdrop-blur-sm overflow-hidden">

              {/* Dossier header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-900/40 bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)] animate-pulse" />
                  <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest font-semibold">
                    {selected.callsign || selected.icao24}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors"
                  aria-label="Close dossier"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Fields */}
              <div className="p-3 space-y-2">

                {[
                  { label: "ICAO24",     value: selected.icao24.toUpperCase()        },
                  { label: "Country",    value: selected.country                     },
                  { label: "Squawk",     value: selected.squawk || "—"               },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">{label}</span>
                    <span className="font-mono text-[11px] text-zinc-300">{value}</span>
                  </div>
                ))}

                <div className="pt-2 border-t border-zinc-900 grid grid-cols-2 gap-2">

                  {/* Altitude */}
                  <div className="rounded border border-zinc-800 bg-zinc-900/40 px-2.5 py-2">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                      <TrendingUp className="h-2.5 w-2.5" /> Alt
                    </p>
                    <p className="font-mono text-xs font-semibold text-zinc-200">
                      {Math.round(selected.altitude).toLocaleString()} m
                    </p>
                    <p className="font-mono text-[9px] text-zinc-600">
                      {metresToFeet(selected.altitude)} ft
                    </p>
                  </div>

                  {/* Speed */}
                  <div className="rounded border border-zinc-800 bg-zinc-900/40 px-2.5 py-2">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                      <Gauge className="h-2.5 w-2.5" /> Speed
                    </p>
                    <p className="font-mono text-xs font-semibold text-zinc-200">
                      {msToKmh(selected.velocity)} km/h
                    </p>
                    <p className="font-mono text-[9px] text-zinc-600">
                      {msToKnots(selected.velocity)} kt
                    </p>
                  </div>

                  {/* Heading */}
                  <div className="rounded border border-zinc-800 bg-zinc-900/40 px-2.5 py-2">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                      <Navigation className="h-2.5 w-2.5" /> Heading
                    </p>
                    <p className="font-mono text-xs font-semibold text-zinc-200">
                      {Math.round(selected.heading)}°
                    </p>
                  </div>

                  {/* Vertical rate */}
                  <div className="rounded border border-zinc-800 bg-zinc-900/40 px-2.5 py-2">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                      <Wind className="h-2.5 w-2.5" /> V/S
                    </p>
                    {vr && (
                      <p className={cn("font-mono text-xs font-semibold flex items-center gap-1", vr.cls)}>
                        <vr.Icon className="h-3 w-3 shrink-0" />
                        {vr.text}
                      </p>
                    )}
                  </div>

                </div>

                {/* Position */}
                <div className="rounded border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5">
                  <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">Position</p>
                  <p className="font-mono text-[10px] text-zinc-400 tabular-nums">
                    {selected.latitude.toFixed(4)}° N · {selected.longitude.toFixed(4)}° E
                  </p>
                </div>

                {/* 15-min prediction */}
                {layers.prediction && selected.velocity > 5 && (
                  <div className="rounded border border-emerald-900/50 bg-emerald-950/20 px-2.5 py-1.5">
                    <p className="font-mono text-[9px] text-emerald-700 uppercase tracking-widest">
                      15-min projection · dead reckoning
                    </p>
                    <p className="font-mono text-[9px] text-zinc-600 mt-0.5">
                      Assumes constant heading + speed
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LOADING state                                                  */}
        {/* ============================================================ */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
            <Eye className="h-8 w-8 text-emerald-800 animate-pulse" />
            <p className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest">
              Initialising HORUS-EYE · loading airspace data…
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* BOTTOM-CENTER — attribution                                    */}
        {/* ============================================================ */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <p className="font-mono text-[9px] text-zinc-800 uppercase tracking-widest">
            OpenSky Network · NASA GIBS · 30s refresh · click any aircraft to inspect
          </p>
        </div>

      </div>
    </OSDesktop>
  )
}
