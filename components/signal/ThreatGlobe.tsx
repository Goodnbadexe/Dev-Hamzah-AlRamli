"use client"

/**
 * ThreatGlobe
 * -----------
 * WebGL 3D globe — cyber attack arc visualiser.
 * Used as a full-viewport background layer across the site.
 *
 * Modes
 *  "background" (default) — fixed behind content, pointer-events:none,
 *    fast drip (250 ms), 60 arcs max, no user interaction
 *  "interactive" — user can drag/zoom (used on /threats page)
 *
 * Every drip fires onAttack(event) so parents can:
 *  - play notification sounds
 *  - push events into AmbientFeed
 *  - update HUD stats
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import * as THREE from "three"
import type { ThreatEvent } from "@/app/api/threats/route"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as any

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------
const ARC_COLORS: Record<string, string> = {
  DDoS:       "rgba(239,68,68,0.90)",
  Bruteforce: "rgba(249,115,22,0.85)",
  Ransomware: "rgba(168,85,247,0.90)",
  SQLi:       "rgba(59,130,246,0.85)",
  RCE:        "rgba(236,72,153,0.90)",
  Recon:      "rgba(34,197,94,0.80)",
  Phishing:   "rgba(234,179,8,0.85)",
  PortScan:   "rgba(20,184,166,0.80)",
  Emotet:     "rgba(168,85,247,0.90)",
  Mirai:      "rgba(239,68,68,0.90)",
}

const SEVERITY_RING: Record<string, string> = {
  critical: "rgba(239,68,68,0.80)",
  high:     "rgba(249,115,22,0.70)",
  medium:   "rgba(234,179,8,0.55)",
  low:      "rgba(148,163,184,0.25)",
}

const POINT_COLOR: Record<string, string> = {
  source: "rgba(248,113,113,0.92)",
  target: "rgba(45,212,191,0.86)",
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DRIP_MS_BACKGROUND  = 250   // super speed in background mode
const DRIP_MS_INTERACTIVE = 900   // normal speed when user is watching /threats
const MAX_ARCS_BACKGROUND  = 90
const MAX_ARCS_INTERACTIVE = 55

type ThreatPoint = {
  id: string
  lat: number
  lng: number
  role: "source" | "target"
  country: string
  severity: ThreatEvent["severity"]
}

interface Props {
  interactive?: boolean
  onAttack?: (attack: ThreatEvent) => void
  /** Width / height override (defaults to window dimensions) */
  width?: number
  height?: number
}

export function ThreatGlobe({ interactive = false, onAttack, width, height }: Props) {
  const globeRef   = useRef<any>(null)
  const [pool, setPool]   = useState<ThreatEvent[]>([])
  const [arcs, setArcs]   = useState<ThreatEvent[]>([])
  const [rings, setRings] = useState<{ lat: number; lng: number; color: string; maxR: number; id: string }[]>([])
  const [viewport, setViewport] = useState({ width: width ?? 1440, height: height ?? 900 })
  const dripRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const poolIdxRef = useRef(0)

  const dripMs  = interactive ? DRIP_MS_INTERACTIVE  : DRIP_MS_BACKGROUND
  const maxArcs = interactive ? MAX_ARCS_INTERACTIVE : MAX_ARCS_BACKGROUND

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------
  const fetchThreats = useCallback(async () => {
    try {
      const res = await fetch("/api/threats")
      if (!res.ok) return
      const data = await res.json()
      const threats = data.threats as ThreatEvent[]
      if (threats?.length) { setPool(threats); poolIdxRef.current = 0 }
    } catch { /* silent — cosmetic */ }
  }, [])

  useEffect(() => {
    fetchThreats()
    const poll = setInterval(fetchThreats, 30_000)
    return () => clearInterval(poll)
  }, [fetchThreats])

  useEffect(() => {
    if (width && height) {
      setViewport({ width, height })
      return
    }

    const syncViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    syncViewport()
    window.addEventListener("resize", syncViewport)
    return () => window.removeEventListener("resize", syncViewport)
  }, [width, height])

  // ---------------------------------------------------------------------------
  // Drip — one arc every dripMs
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (pool.length === 0) return
    if (dripRef.current) clearInterval(dripRef.current)

    dripRef.current = setInterval(() => {
      const attack = pool[poolIdxRef.current % pool.length]
      poolIdxRef.current++

      setArcs(prev => [...prev, attack].slice(-maxArcs))
      setRings(prev => [
        ...prev.slice(-30),
        {
          id:    attack.id,
          lat:   attack.tgtLat,
          lng:   attack.tgtLng,
          color: SEVERITY_RING[attack.severity] ?? "rgba(148,163,184,0.25)",
          maxR:  attack.severity === "critical" ? 5.5 : attack.severity === "high" ? 3.5 : 2,
        },
      ])

      onAttack?.(attack)
    }, dripMs)

    return () => { if (dripRef.current) clearInterval(dripRef.current) }
  }, [pool, dripMs, maxArcs, onAttack])

  // ---------------------------------------------------------------------------
  // Camera + controls
  // ---------------------------------------------------------------------------
  const handleReady = useCallback(() => {
    if (!globeRef.current) return
    globeRef.current.pointOfView({ lat: 29, lng: 44, altitude: interactive ? 1.85 : 1.72 }, 1200)

    const material = globeRef.current.globeMaterial?.()
    if (material) {
      material.color = new THREE.Color("#132033")
      material.emissive = new THREE.Color("#030712")
      material.emissiveIntensity = 0.65
      material.shininess = 3
      material.needsUpdate = true
    }

    const ctrl = globeRef.current.controls()
    if (!ctrl) return
    ctrl.autoRotate      = true
    ctrl.autoRotateSpeed = interactive ? 0.18 : 0.08
    ctrl.enableZoom      = interactive
    ctrl.enablePan       = false
    ctrl.minDistance     = 170
    ctrl.maxDistance     = 460
  }, [interactive])

  useEffect(() => {
    const ctrl = globeRef.current?.controls()
    if (!ctrl) return
    ctrl.autoRotate  = true
    ctrl.enableZoom  = interactive
  }, [interactive])

  const points = useMemo<ThreatPoint[]>(() => {
    const active = arcs.length ? arcs : pool.slice(0, 24)
    return active.flatMap((attack) => [
      {
        id: `${attack.id}-src`,
        lat: attack.srcLat,
        lng: attack.srcLng,
        role: "source" as const,
        country: attack.srcCountry,
        severity: attack.severity,
      },
      {
        id: `${attack.id}-tgt`,
        lat: attack.tgtLat,
        lng: attack.tgtLng,
        role: "target" as const,
        country: attack.tgtCountry,
        severity: attack.severity,
      },
    ]).slice(-120)
  }, [arcs, pool])

  const labels = useMemo(() => {
    const seen = new Set<string>()
    return points.filter((point) => {
      if (seen.has(point.country)) return false
      seen.add(point.country)
      return point.role === "target" || point.severity === "critical" || point.severity === "high"
    }).slice(0, interactive ? 22 : 12)
  }, [interactive, points])

  const w = width ?? Math.ceil(viewport.width * (interactive ? 1 : 1.18))
  const h = height ?? Math.ceil(viewport.height * (interactive ? 1 : 1.18))
  const globeOffset = interactive ? "translate(-50%, -50%)" : "translate(-50%, -47%)"

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      aria-hidden={!interactive}
      className="absolute left-1/2 top-1/2"
      style={{ width: w, height: h, transform: globeOffset }}
    >
      <Globe
        ref={globeRef}
        width={w}
        height={h}

        // Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#22d3ee"
        atmosphereAltitude={interactive ? 0.18 : 0.16}

        // Arcs
        arcsData={arcs}
        arcStartLat="srcLat"
        arcStartLng="srcLng"
        arcEndLat="tgtLat"
        arcEndLng="tgtLng"
        arcColor={(d: ThreatEvent) => [
          ARC_COLORS[d.type] ?? "rgba(148,163,184,0.7)",
          d.severity === "critical" ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.05)",
        ]}
        arcAltitude={(d: ThreatEvent) =>
          d.severity === "critical" ? 0.46 : d.severity === "high" ? 0.34 : 0.22
        }
        arcStroke={(d: ThreatEvent) =>
          d.severity === "critical" ? 1.15 : d.severity === "high" ? 0.75 : 0.42
        }
        arcDashLength={0.24}
        arcDashGap={0.11}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={interactive ? 1800 : 1200}
        arcLabel={(d: ThreatEvent) =>
          `<div style="font-family:monospace;font-size:11px;background:#050505cc;border:1px solid #334155;padding:6px 10px;border-radius:4px;color:#e4e4e7;pointer-events:none;box-shadow:0 0 24px rgba(34,211,238,.16);">
            <span style="color:${ARC_COLORS[d.type]};font-weight:700;">${d.type}</span>&nbsp;·&nbsp;<span style="color:${d.severity === "critical" ? "#f87171" : "#94a3b8"}">${d.severity}</span><br/>
            ${d.srcCountry} <span style="color:#64748b">→</span> ${d.tgtCountry}<br/>
            <span style="color:#64748b">${d.count.toLocaleString()} events</span>
          </div>`
        }
        onArcClick={(d: ThreatEvent) => onAttack?.(d)}

        // Live nodes
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d: ThreatPoint) => d.role === "source" ? 0.018 : 0.028}
        pointRadius={(d: ThreatPoint) =>
          d.severity === "critical" ? 0.34 : d.severity === "high" ? 0.25 : 0.16
        }
        pointColor={(d: ThreatPoint) => POINT_COLOR[d.role]}
        pointResolution={8}

        // Country tags
        labelsData={labels}
        labelLat="lat"
        labelLng="lng"
        labelText="country"
        labelSize={(d: ThreatPoint) => d.severity === "critical" ? 0.95 : 0.65}
        labelDotRadius={0.18}
        labelColor={(d: ThreatPoint) => d.role === "source" ? "rgba(248,113,113,0.92)" : "rgba(45,212,191,0.86)"}
        labelResolution={2}

        // Impact rings
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed={interactive ? 2.2 : 3.9}
        ringRepeatPeriod={interactive ? 900 : 430}

        // Performance
        rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        enablePointerInteraction={interactive}
        onGlobeReady={handleReady}
      />
    </div>
  )
}
