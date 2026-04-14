"use client"

/**
 * ThreatGlobe
 * -----------
 * WebGL 3D globe that visualises cyber-attack arcs.
 * Built on react-globe.gl (Three.js under the hood).
 *
 * - Fetches /api/threats on mount and every 30 s
 * - Drips arcs onto the globe one-by-one (800 ms interval)
 * - Fires onAttackClick(attack) on EVERY drip (not just user clicks)
 *   — the parent uses this to play sounds and update HUD stats
 * - Keeps max 25 visible arcs for GPU budget
 * - `interactive` prop: false = auto-rotate only; true = drag/zoom enabled
 */

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { ThreatEvent } from "@/app/api/threats/route"

// SSR-safe: react-globe.gl touches `window` on import
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as any

// ---------------------------------------------------------------------------
// Attack type → arc colour
// ---------------------------------------------------------------------------
const ARC_COLORS: Record<string, string> = {
  DDoS:       "rgba(239,68,68,0.85)",
  Bruteforce: "rgba(249,115,22,0.85)",
  Ransomware: "rgba(168,85,247,0.85)",
  SQLi:       "rgba(59,130,246,0.85)",
  RCE:        "rgba(236,72,153,0.85)",
  Recon:      "rgba(34,197,94,0.85)",
  Phishing:   "rgba(234,179,8,0.85)",
  PortScan:   "rgba(20,184,166,0.85)",
}

const SEVERITY_RING: Record<string, string> = {
  critical: "rgba(239,68,68,0.75)",
  high:     "rgba(249,115,22,0.65)",
  medium:   "rgba(234,179,8,0.50)",
  low:      "rgba(148,163,184,0.30)",
}

const MAX_ARCS = 25    // GPU budget — never more than this visible at once
const DRIP_MS  = 900   // ms between each new arc appearing

interface Props {
  /** When true: user can drag/zoom. When false: auto-rotate only. */
  interactive?: boolean
  /**
   * Fires on EVERY new arc drip (not just user clicks).
   * Use this to trigger sounds / HUD updates in the parent.
   */
  onAttackClick?: (attack: ThreatEvent) => void
}

export function ThreatGlobe({ interactive = false, onAttackClick }: Props) {
  const globeRef = useRef<any>(null)
  const [pool, setPool]   = useState<ThreatEvent[]>([])
  const [arcs, setArcs]   = useState<ThreatEvent[]>([])
  const [rings, setRings] = useState<{ lat: number; lng: number; color: string; maxR: number; id: string }[]>([])
  const dripRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const poolIdxRef = useRef(0)

  // ---------------------------------------------------------------------------
  // Fetch threat pool from API
  // ---------------------------------------------------------------------------
  const fetchThreats = useCallback(async () => {
    try {
      const res = await fetch("/api/threats")
      if (!res.ok) return
      const data = await res.json()
      const threats = data.threats as ThreatEvent[]
      if (threats?.length) {
        setPool(threats)
        poolIdxRef.current = 0
      }
    } catch {
      // silent — globe is cosmetic, never crashes the page
    }
  }, [])

  useEffect(() => {
    fetchThreats()
    const poll = setInterval(fetchThreats, 30_000)
    return () => clearInterval(poll)
  }, [fetchThreats])

  // ---------------------------------------------------------------------------
  // Drip arcs onto the globe one-by-one
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (pool.length === 0) return

    if (dripRef.current) clearInterval(dripRef.current)

    dripRef.current = setInterval(() => {
      const idx    = poolIdxRef.current % pool.length
      const attack = pool[idx]
      poolIdxRef.current++

      // Add arc (cap at MAX_ARCS)
      setArcs(prev => [...prev, attack].slice(-MAX_ARCS))

      // Impact ring at target
      setRings(prev => [
        ...prev.slice(-20),
        {
          id:    attack.id,
          lat:   attack.tgtLat,
          lng:   attack.tgtLng,
          color: SEVERITY_RING[attack.severity] ?? "rgba(148,163,184,0.3)",
          maxR:  attack.severity === "critical" ? 5 : attack.severity === "high" ? 3.5 : 2,
        },
      ])

      // Notify parent — this is how sounds + HUD get triggered
      onAttackClick?.(attack)
    }, DRIP_MS)

    return () => {
      if (dripRef.current) clearInterval(dripRef.current)
    }
  }, [pool, onAttackClick])

  // ---------------------------------------------------------------------------
  // Camera + controls after globe mounts
  // ---------------------------------------------------------------------------
  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) return
    globeRef.current.pointOfView({ lat: 20, lng: 15, altitude: 2.1 }, 1200)
    const controls = globeRef.current.controls()
    if (!controls) return
    controls.autoRotate      = true
    controls.autoRotateSpeed = 0.3
    controls.enableZoom      = interactive
    controls.enablePan       = false
  }, [interactive])

  // Sync interactive mode after mount
  useEffect(() => {
    const controls = globeRef.current?.controls()
    if (!controls) return
    controls.autoRotate = !interactive
    controls.enableZoom = interactive
  }, [interactive])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <Globe
      ref={globeRef}
      width={typeof window !== "undefined" ? window.innerWidth : 1200}
      height={typeof window !== "undefined" ? window.innerHeight - 44 : 800}

      // Globe appearance
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundColor="rgba(0,0,0,0)"
      atmosphereColor="#0ea5e9"
      atmosphereAltitude={0.11}

      // Attack arcs
      arcsData={arcs}
      arcStartLat="srcLat"
      arcStartLng="srcLng"
      arcEndLat="tgtLat"
      arcEndLng="tgtLng"
      arcColor={(d: ThreatEvent) => [
        ARC_COLORS[d.type] ?? "rgba(148,163,184,0.7)",
        "rgba(255,255,255,0.04)",
      ]}
      arcAltitudeAutoScale={0.45}
      arcStroke={(d: ThreatEvent) =>
        d.severity === "critical" ? 0.75 : d.severity === "high" ? 0.55 : 0.35
      }
      arcDashLength={0.35}
      arcDashGap={0.2}
      arcDashAnimateTime={2200}
      arcLabel={(d: ThreatEvent) =>
        `<div style="font-family:monospace;font-size:11px;background:#09090b;border:1px solid #27272a;padding:6px 10px;border-radius:4px;color:#e4e4e7;pointer-events:none;">
          <span style="color:${ARC_COLORS[d.type]};font-weight:600;">${d.type}</span>&nbsp;·&nbsp;<span style="color:${d.severity === "critical" ? "#f87171" : "#71717a"}">${d.severity}</span><br/>
          ${d.srcCountry} <span style="color:#3f3f46">→</span> ${d.tgtCountry}<br/>
          <span style="color:#52525b">${d.count.toLocaleString()} events</span>
        </div>`
      }
      onArcClick={(d: ThreatEvent) => onAttackClick?.(d)}

      // Impact rings at targets
      ringsData={rings}
      ringLat="lat"
      ringLng="lng"
      ringColor="color"
      ringMaxRadius="maxR"
      ringPropagationSpeed={2.2}
      ringRepeatPeriod={900}

      // Performance
      rendererConfig={{ antialias: false, alpha: true }}
      enablePointerInteraction={interactive}
      onGlobeReady={handleGlobeReady}
    />
  )
}
