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

type WorldMarkerKind =
  | "datacenter"
  | "cloud"
  | "accelerator"
  | "hq"
  | "event"
  | "fire"
  | "natural"
  | "outage"
  | "cyber"

type WorldMarker = {
  id: string
  lat: number
  lng: number
  title: string
  kind: WorldMarkerKind
}

type CablePath = {
  id: string
  name: string
  color: string
  points: { lat: number; lng: number }[]
}

const KIND_STYLE: Record<WorldMarkerKind, { icon: string; color: string; glow: string }> = {
  datacenter:  { icon: "🖥", color: "#88aaff", glow: "rgba(136,170,255,.55)" },
  cloud:       { icon: "☁",  color: "#38bdf8", glow: "rgba(56,189,248,.5)" },
  accelerator: { icon: "✦",  color: "#22c55e", glow: "rgba(34,197,94,.45)" },
  hq:          { icon: "◆",  color: "#a78bfa", glow: "rgba(167,139,250,.45)" },
  event:       { icon: "💻", color: "#44aaff", glow: "rgba(68,170,255,.5)" },
  fire:        { icon: "🔥", color: "#fb923c", glow: "rgba(251,146,60,.55)" },
  natural:     { icon: "⚠",  color: "#facc15", glow: "rgba(250,204,21,.45)" },
  outage:      { icon: "📡", color: "#ff2020", glow: "rgba(255,32,32,.55)" },
  cyber:       { icon: "🛡", color: "#ff0044", glow: "rgba(255,0,68,.55)" },
}

const WORLD_MARKERS: WorldMarker[] = [
  { id: "dc-stargate-uae", lat: 24.45, lng: 54.38, title: "Stargate UAE Phase 1", kind: "datacenter" },
  { id: "dc-humain-saudi", lat: 24.71, lng: 46.67, title: "HUMAIN Saudi Arabia / NVIDIA", kind: "datacenter" },
  { id: "dc-aramco-groq", lat: 26.42, lng: 50.09, title: "Aramco Groq Inference Cluster", kind: "datacenter" },
  { id: "dc-kaust", lat: 22.31, lng: 39.10, title: "KAUST Shaheen-III", kind: "datacenter" },
  { id: "dc-julich", lat: 50.91, lng: 6.41, title: "JUPITER, Julich", kind: "datacenter" },
  { id: "dc-lumi", lat: 64.23, lng: 27.73, title: "EuroHPC LUMI", kind: "datacenter" },
  { id: "dc-isambard", lat: 51.45, lng: -2.59, title: "Isambard-AI Bristol", kind: "datacenter" },
  { id: "dc-new-jersey", lat: 40.73, lng: -74.17, title: "Nebius New Jersey", kind: "datacenter" },
  { id: "dc-atlanta", lat: 33.75, lng: -84.39, title: "OpenAI / Microsoft Atlanta", kind: "datacenter" },
  { id: "dc-wisconsin", lat: 42.73, lng: -87.78, title: "OpenAI / Microsoft Mt Pleasant", kind: "datacenter" },
  { id: "dc-singapore", lat: 1.35, lng: 103.82, title: "Sustainable Metal Cloud Singapore", kind: "datacenter" },
  { id: "dc-johor", lat: 1.49, lng: 103.76, title: "YTL AI Johor", kind: "datacenter" },
  { id: "dc-seoul", lat: 37.56, lng: 126.97, title: "Naver / Samsung AI compute cluster", kind: "datacenter" },
  { id: "cloud-va", lat: 39.04, lng: -77.49, title: "AWS us-east-1 / Azure East US", kind: "cloud" },
  { id: "cloud-frankfurt", lat: 50.11, lng: 8.68, title: "Frankfurt cloud region", kind: "cloud" },
  { id: "cloud-dublin", lat: 53.35, lng: -6.26, title: "Dublin cloud region", kind: "cloud" },
  { id: "cloud-bahrain", lat: 26.22, lng: 50.58, title: "Bahrain cloud region", kind: "cloud" },
  { id: "cloud-mumbai", lat: 19.08, lng: 72.88, title: "Mumbai cloud region", kind: "cloud" },
  { id: "cloud-tokyo", lat: 35.68, lng: 139.76, title: "Tokyo cloud region", kind: "cloud" },
  { id: "cloud-sydney", lat: -33.87, lng: 151.21, title: "Sydney cloud region", kind: "cloud" },
  { id: "hq-openai", lat: 37.78, lng: -122.42, title: "OpenAI HQ", kind: "hq" },
  { id: "hq-microsoft", lat: 47.67, lng: -122.12, title: "Microsoft HQ", kind: "hq" },
  { id: "hq-nvidia", lat: 37.37, lng: -121.96, title: "NVIDIA HQ", kind: "hq" },
  { id: "hq-google", lat: 37.42, lng: -122.08, title: "Google HQ", kind: "hq" },
  { id: "hq-meta", lat: 37.48, lng: -122.15, title: "Meta HQ", kind: "hq" },
  { id: "acc-riyadh", lat: 24.71, lng: 46.67, title: "Riyadh accelerator grid", kind: "accelerator" },
  { id: "acc-london", lat: 51.51, lng: -0.13, title: "London startup accelerator", kind: "accelerator" },
  { id: "acc-berlin", lat: 52.52, lng: 13.40, title: "Berlin startup hub", kind: "accelerator" },
  { id: "acc-bangalore", lat: 12.97, lng: 77.59, title: "Bengaluru startup hub", kind: "accelerator" },
  { id: "acc-singapore", lat: 1.35, lng: 103.82, title: "Singapore accelerator", kind: "accelerator" },
  { id: "event-collision", lat: 43.65, lng: -79.38, title: "Collision 2026", kind: "event" },
  { id: "event-consensus", lat: 30.27, lng: -97.74, title: "CoinDesk Consensus", kind: "event" },
  { id: "event-token", lat: 25.20, lng: 55.27, title: "TOKEN2049 Dubai", kind: "event" },
  { id: "event-leap", lat: 24.71, lng: 46.67, title: "LEAP Riyadh", kind: "event" },
  { id: "fire-florida", lat: 26.07, lng: -81.43, title: "Florida wildfire signal", kind: "fire" },
  { id: "fire-wisconsin", lat: 43.07, lng: -89.40, title: "Wisconsin prescribed fire", kind: "fire" },
  { id: "natural-afghanistan", lat: 34.56, lng: 69.21, title: "Flood signal: Afghanistan", kind: "natural" },
  { id: "natural-kenya", lat: -1.29, lng: 36.82, title: "Drought signal: Kenya / Somalia", kind: "natural" },
  { id: "natural-brazil", lat: -15.79, lng: -47.88, title: "Drought signal: Brazil / Bolivia", kind: "natural" },
  { id: "outage-sudan", lat: 15.50, lng: 32.56, title: "Internet disruption: Sudan", kind: "outage" },
  { id: "outage-iran", lat: 35.69, lng: 51.39, title: "Internet disruption: Iran", kind: "outage" },
]

const CABLE_PATHS: CablePath[] = [
  {
    id: "cable-atlantic",
    name: "Atlantic data corridor",
    color: "rgba(34,211,238,.78)",
    points: [
      { lat: 40.71, lng: -74.00 },
      { lat: 44.00, lng: -45.00 },
      { lat: 50.10, lng: -5.00 },
      { lat: 51.51, lng: -0.13 },
      { lat: 50.11, lng: 8.68 },
    ],
  },
  {
    id: "cable-mena-asia",
    name: "MENA to Asia backbone",
    color: "rgba(16,185,129,.72)",
    points: [
      { lat: 51.51, lng: -0.13 },
      { lat: 43.30, lng: 5.37 },
      { lat: 31.20, lng: 29.92 },
      { lat: 24.71, lng: 46.67 },
      { lat: 19.08, lng: 72.88 },
      { lat: 1.35, lng: 103.82 },
      { lat: 35.68, lng: 139.76 },
    ],
  },
  {
    id: "cable-pacific",
    name: "Pacific cloud route",
    color: "rgba(96,165,250,.68)",
    points: [
      { lat: 37.78, lng: -122.42 },
      { lat: 30.00, lng: -155.00 },
      { lat: 21.30, lng: -157.85 },
      { lat: 35.68, lng: 139.76 },
      { lat: 37.56, lng: 126.97 },
      { lat: 1.35, lng: 103.82 },
    ],
  },
  {
    id: "cable-south-atlantic",
    name: "South Atlantic resilience path",
    color: "rgba(45,212,191,.58)",
    points: [
      { lat: -23.55, lng: -46.63 },
      { lat: -8.84, lng: 13.23 },
      { lat: 6.52, lng: 3.37 },
      { lat: 38.72, lng: -9.14 },
      { lat: 51.51, lng: -0.13 },
    ],
  },
]

interface Props {
  interactive?: boolean
  onAttack?: (attack: ThreatEvent) => void
  onGlobeClick?: () => void
  showWorldLayers?: boolean
  /** Width / height override (defaults to window dimensions) */
  width?: number
  height?: number
}

export function ThreatGlobe({ interactive = false, onAttack, onGlobeClick, showWorldLayers = false, width, height }: Props) {
  const globeRef   = useRef<any>(null)
  const [pool, setPool]   = useState<ThreatEvent[]>([])
  const [arcs, setArcs]   = useState<ThreatEvent[]>([])
  const [rings, setRings] = useState<{ lat: number; lng: number; color: string; maxR: number; id: string }[]>([])
  const [viewport, setViewport] = useState({ width: width ?? 1440, height: height ?? 900 })
  const [dayPhase, setDayPhase] = useState(0)
  const dripRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const poolIdxRef   = useRef(0)
  const cloudMeshRef = useRef<THREE.Mesh | null>(null)
  const cloudAnimRef = useRef<number>(0)
  const sunLightRef  = useRef<THREE.DirectionalLight | null>(null)

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

    // NASA-realistic material — let the Blue Marble texture speak naturally
    const material = globeRef.current.globeMaterial?.()
    if (material) {
      material.color             = new THREE.Color("#ffffff")   // no colour tint
      material.emissive          = new THREE.Color("#030a14")
      material.emissiveIntensity = 0.04                         // barely any self-glow
      material.shininess         = 22                           // ocean specular sheen
      material.needsUpdate       = true
    }

    // Three.js scene: sun directional light + cloud sphere
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scene = (globeRef.current as any).scene?.()
    if (scene) {
      // Warm directional sun — positioned at current UTC solar angle
      const now   = new Date()
      const phase = (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 86400
      const angle = (0.5 - phase) * 2 * Math.PI
      const sun   = new THREE.DirectionalLight("#fff8ea", 1.8)
      sun.position.set(Math.cos(angle) * 300, 70, Math.sin(angle) * 300)
      scene.add(sun)
      sunLightRef.current = sun

      // Cloud sphere — radius 101.5 sits just outside the globe surface (radius 100)
      const loader = new THREE.TextureLoader()
      loader.load(
        "//unpkg.com/three-globe/example/img/earth-clouds.png",
        (cloudTex) => {
          const cloudGeo  = new THREE.SphereGeometry(101.5, 64, 64)
          const cloudMat  = new THREE.MeshPhongMaterial({
            map: cloudTex,
            transparent: true,
            opacity: 0.78,
            depthWrite: false,
          })
          const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
          scene.add(cloudMesh)
          cloudMeshRef.current = cloudMesh

          const rotateCloud = () => {
            if (cloudMeshRef.current) cloudMeshRef.current.rotation.y += 0.00011
            cloudAnimRef.current = requestAnimationFrame(rotateCloud)
          }
          rotateCloud()
        }
      )
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

  useEffect(() => {
    const syncDayPhase = () => {
      const now = new Date()
      const seconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()
      setDayPhase(seconds / 86400)
    }

    syncDayPhase()
    const timer = setInterval(syncDayPhase, 5_000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Move sun to real-time UTC solar longitude so day/night terminator is accurate
    if (sunLightRef.current) {
      const angle = (0.5 - dayPhase) * 2 * Math.PI
      sunLightRef.current.position.set(Math.cos(angle) * 300, 70, Math.sin(angle) * 300)
    }
    // Very subtle emissive pulse — the directional sun does the heavy lifting now
    const material = globeRef.current?.globeMaterial?.()
    if (!material) return
    material.emissiveIntensity = 0.04 + Math.sin(dayPhase * Math.PI * 2) * 0.02
    material.needsUpdate = true
  }, [dayPhase])

  // Cloud mesh + animation cleanup on unmount
  useEffect(() => {
    return () => {
      if (cloudAnimRef.current) cancelAnimationFrame(cloudAnimRef.current)
      if (cloudMeshRef.current) {
        cloudMeshRef.current.geometry.dispose()
        ;(cloudMeshRef.current.material as THREE.MeshPhongMaterial).dispose()
        cloudMeshRef.current = null
      }
    }
  }, [])

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

  const worldMarkers = useMemo<WorldMarker[]>(() => {
    if (!showWorldLayers) return []

    const cyberMarkers = points
      .filter((point) => point.role === "source")
      .slice(-80)
      .map((point, index) => ({
        id: `cyber-${point.id}-${index}`,
        lat: point.lat,
        lng: point.lng,
        title: `Cyber threat source: ${point.country}`,
        kind: "cyber" as const,
      }))

    return [...WORLD_MARKERS, ...cyberMarkers]
  }, [points, showWorldLayers])

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
        atmosphereColor="#4a9eda"
        atmosphereAltitude={interactive ? 0.24 : 0.20}

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

        // World monitor layers
        pathsData={showWorldLayers ? CABLE_PATHS : []}
        pathPoints="points"
        pathPointLat="lat"
        pathPointLng="lng"
        pathColor={(d: CablePath) => d.color}
        pathStroke={interactive ? 0.62 : 0.42}
        pathDashLength={0.05}
        pathDashGap={0.025}
        pathDashAnimateTime={interactive ? 3200 : 5200}
        pathLabel={(d: CablePath) =>
          `<div style="font-family:monospace;font-size:11px;background:#050505cc;border:1px solid #164e63;padding:6px 10px;border-radius:4px;color:#e4e4e7;pointer-events:none;box-shadow:0 0 24px rgba(34,211,238,.16);">${d.name}</div>`
        }
        htmlElementsData={worldMarkers}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={(d: WorldMarker) => d.kind === "cyber" ? 0.055 : 0.04}
        htmlElement={(d: WorldMarker) => {
          const style = KIND_STYLE[d.kind]
          const element = document.createElement("div")
          element.title = d.title
          element.style.width = "20px"
          element.style.height = "20px"
          element.style.display = "flex"
          element.style.alignItems = "center"
          element.style.justifyContent = "center"
          element.style.pointerEvents = interactive ? "auto" : "none"
          element.style.cursor = interactive ? "pointer" : "default"
          element.style.userSelect = "none"
          element.innerHTML = `<div style="font-size:${d.kind === "cyber" ? "10px" : "11px"};color:${style.color};text-shadow:0 0 5px ${style.glow};font-weight:700">${style.icon}</div>`
          return element
        }}

        // Performance
        rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        enablePointerInteraction={interactive || Boolean(onGlobeClick)}
        onGlobeReady={handleReady}
        onGlobeClick={onGlobeClick}
      />
    </div>
  )
}
