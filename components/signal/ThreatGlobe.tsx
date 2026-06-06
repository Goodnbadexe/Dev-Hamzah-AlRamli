"use client"

/**
 * ThreatGlobe — IOC mode
 * ----------------------
 * WebGL 3D globe rendering live cyber threat indicators (IOCs) as honest,
 * color-coded scatter dots — NOT fabricated attack arcs. Each dot is real
 * malicious infrastructure (C2 server, malware host, phishing, malicious URL,
 * ransomware victim) geo-located by /api/threats.
 *
 * Why dots, not arcs: the upstream feeds (Feodo, URLhaus, C2IntelFeeds,
 * Ransomware.live, OTX, AbuseIPDB) are indicators of compromise — they have a
 * LOCATION, not a direction. Drawing "A → B" arcs would invent a relationship
 * that doesn't exist in the data. Dots are the honest rendering.
 *
 * World-layers (infra HQ/cloud/datacenters, undersea cables, events, night
 * mode) are retained and filterable via `activeLayers`. The "Cyber Threats"
 * layer toggles the IOC dots.
 *
 * Modes:
 *  "background" (default) — fixed behind content, pointer-events:none
 *  "interactive" — drag/zoom + hover-to-inspect (used on /threats)
 *
 * Callbacks:
 *  onIoc(ioc)        — fired on a drip cadence so parents can stream a live feed
 *  onIocSelect(ioc)  — fired on hover/click of a dot (null on leave) for inspectors
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import * as THREE from "three"
import type { ThreatIoc, IocType } from "@/app/api/threats/route"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as any

// ---------------------------------------------------------------------------
// IOC palette — emerald stays reserved for "you"; threat families use warm/cool
// ---------------------------------------------------------------------------
export const IOC_COLOR: Record<IocType, string> = {
  c2_server:     "rgba(244,63,94,0.92)",   // red
  malware_host:  "rgba(249,115,22,0.88)",  // orange
  phishing:      "rgba(234,179,8,0.88)",   // amber
  malicious_url: "rgba(56,189,248,0.85)",  // cyan
  ransomware:    "rgba(168,85,247,0.92)",  // violet
}

const SEV_R: Record<ThreatIoc["severity"], number> = {
  critical: 0.50, high: 0.38, medium: 0.27, low: 0.19,
}

const SEV_RING: Record<ThreatIoc["severity"], string> = {
  critical: "rgba(244,63,94,0.80)",
  high:     "rgba(249,115,22,0.66)",
  medium:   "rgba(234,179,8,0.40)",
  low:      "rgba(148,163,184,0.20)",
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DRIP_MS_BACKGROUND  = 900
const DRIP_MS_INTERACTIVE = 1400
const POLL_MS = 5 * 60 * 1000 // route caches 10 min; poll every 5

// ---------------------------------------------------------------------------
// World-monitor layers (retained from the world-layers feature)
// ---------------------------------------------------------------------------
type WorldMarkerKind =
  | "datacenter" | "cloud" | "accelerator" | "hq"
  | "event" | "fire" | "natural" | "outage" | "cyber"

type WorldMarker = { id: string; lat: number; lng: number; title: string; kind: WorldMarkerKind }
type CablePath = { id: string; name: string; color: string; points: { lat: number; lng: number }[] }

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
  { id: "cable-atlantic", name: "Atlantic data corridor", color: "rgba(34,211,238,.78)",
    points: [{ lat: 40.71, lng: -74.00 }, { lat: 44.00, lng: -45.00 }, { lat: 50.10, lng: -5.00 }, { lat: 51.51, lng: -0.13 }, { lat: 50.11, lng: 8.68 }] },
  { id: "cable-mena-asia", name: "MENA to Asia backbone", color: "rgba(16,185,129,.72)",
    points: [{ lat: 51.51, lng: -0.13 }, { lat: 43.30, lng: 5.37 }, { lat: 31.20, lng: 29.92 }, { lat: 24.71, lng: 46.67 }, { lat: 19.08, lng: 72.88 }, { lat: 1.35, lng: 103.82 }, { lat: 35.68, lng: 139.76 }] },
  { id: "cable-pacific", name: "Pacific cloud route", color: "rgba(96,165,250,.68)",
    points: [{ lat: 37.78, lng: -122.42 }, { lat: 30.00, lng: -155.00 }, { lat: 21.30, lng: -157.85 }, { lat: 35.68, lng: 139.76 }, { lat: 37.56, lng: 126.97 }, { lat: 1.35, lng: 103.82 }] },
  { id: "cable-south-atlantic", name: "South Atlantic resilience path", color: "rgba(45,212,191,.58)",
    points: [{ lat: -23.55, lng: -46.63 }, { lat: -8.84, lng: 13.23 }, { lat: 6.52, lng: 3.37 }, { lat: 38.72, lng: -9.14 }, { lat: 51.51, lng: -0.13 }] },
]

// Layer name → WorldMarkerKind mapping (used by parent to filter)
export const LAYER_KIND_MAP: Record<string, WorldMarkerKind | "__cable__"> = {
  "Tech HQ":         "hq",
  "Accelerators":    "accelerator",
  "Cloud Regions":   "cloud",
  "AI Data Centers": "datacenter",
  "Undersea Cables": "__cable__",
  "Cyber Threats":   "cyber",
  "Internet Outages":"outage",
  "Tech Events":     "event",
  "Fires":           "fire",
  "Natural Events":  "natural",
}

interface Props {
  interactive?: boolean
  /** Fired on a drip cadence so parents can stream a live IOC feed. */
  onIoc?: (ioc: ThreatIoc) => void
  /** Fired on hover/click of a dot (null on leave) — for the inspector. */
  onIocSelect?: (ioc: ThreatIoc | null) => void
  onGlobeClick?: () => void
  showWorldLayers?: boolean
  /** Per-layer filtering — set of layer labels that are active. */
  activeLayers?: Set<string>
  /** Night mode — use city-lights texture instead of blue marble. */
  nightMode?: boolean
  /**
   * Background-mode horizontal anchor. "center" (default) keeps the globe
   * dead-centre; "right" pushes it to ~71% width, partly off-canvas, so a
   * left-anchored hero owns the page (per the Goodnbad OS homepage concept).
   * Ignored in interactive mode, which always centres.
   */
  align?: "center" | "right"
  width?: number
  height?: number
}

export function ThreatGlobe({
  interactive = false, onIoc, onIocSelect, onGlobeClick,
  showWorldLayers = false, activeLayers, nightMode = false, align = "center", width, height,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const [iocs, setIocs] = useState<ThreatIoc[]>([])
  // Zoom-aware dot scaling — when the user zooms OUT (interactive mode), dots
  // shrink in world-space; bump their radius so attacks stay legible at any zoom.
  const [zoomScale, setZoomScale] = useState(1)
  const [viewport, setViewport] = useState({ width: width ?? 1440, height: height ?? 900 })
  const [dayPhase, setDayPhase] = useState(0)
  const dripRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dripIdxRef = useRef(0)

  const dripMs = interactive ? DRIP_MS_INTERACTIVE : DRIP_MS_BACKGROUND
  const cyberActive = !activeLayers || activeLayers.has("Cyber Threats")

  // ---- Fetch IOCs ----------------------------------------------------------
  const fetchIocs = useCallback(async () => {
    try {
      const res = await fetch("/api/threats")
      if (!res.ok) return
      const data = await res.json()
      const list = data.iocs as ThreatIoc[] | undefined
      if (list?.length) { setIocs(list); dripIdxRef.current = 0 }
    } catch { /* silent — cosmetic */ }
  }, [])

  useEffect(() => {
    fetchIocs()
    const poll = setInterval(fetchIocs, POLL_MS)
    return () => clearInterval(poll)
  }, [fetchIocs])

  // ---- Viewport ------------------------------------------------------------
  useEffect(() => {
    if (width && height) { setViewport({ width, height }); return }
    const sync = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [width, height])

  // ---- Drip — stream IOCs to the parent feed -------------------------------
  useEffect(() => {
    if (!onIoc || iocs.length === 0) return
    if (dripRef.current) clearInterval(dripRef.current)
    dripRef.current = setInterval(() => {
      const ioc = iocs[dripIdxRef.current % iocs.length]
      dripIdxRef.current++
      onIoc(ioc)
    }, dripMs)
    return () => { if (dripRef.current) clearInterval(dripRef.current) }
  }, [iocs, dripMs, onIoc])

  // ---- Camera + material ---------------------------------------------------
  const handleReady = useCallback(() => {
    if (!globeRef.current) return
    // Right-aligned hero: the homepage concept renders the globe LARGE (D3
    // radius ≈ 0.46·min(W,H)) and pushed right so it bleeds off the right edge,
    // with the veil — not the camera — keeping the left text column readable.
    // Lower altitude = larger apparent globe. altitude 2.0 reproduces the
    // concept's radius (≈0.46·min(W,H) ⇒ ~828px Ø at 1440×900) almost exactly:
    // camera distance d = 100·(1+a); apparent Ø = (2·asin(100/d)/fov50)·canvasH.
    const bgAltitude = align === "right" ? 2.0 : 1.72
    globeRef.current.pointOfView({ lat: 29, lng: 44, altitude: interactive ? 1.85 : bgAltitude }, 1200)
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
    ctrl.autoRotate = true
    ctrl.autoRotateSpeed = interactive ? 0.18 : 0.08
    ctrl.enableZoom = interactive
    ctrl.enablePan = false
    ctrl.minDistance = 170
    ctrl.maxDistance = 460
  }, [interactive, align])

  useEffect(() => {
    const ctrl = globeRef.current?.controls()
    if (!ctrl) return
    ctrl.autoRotate = true
    ctrl.enableZoom = interactive
  }, [interactive])

  useEffect(() => {
    const sync = () => {
      const now = new Date()
      const s = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()
      setDayPhase(s / 86400)
    }
    sync()
    const t = setInterval(sync, 5_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const material = globeRef.current?.globeMaterial?.()
    if (!material) return
    const pulse = 0.48 + Math.sin(dayPhase * Math.PI * 2) * 0.12
    material.emissiveIntensity = interactive ? pulse : pulse + 0.1
    material.needsUpdate = true
  }, [dayPhase, interactive])

  // ---- Derived datasets ----------------------------------------------------
  const iocPoints = useMemo<ThreatIoc[]>(
    () => (showWorldLayers && !cyberActive ? [] : iocs),
    [iocs, showWorldLayers, cyberActive],
  )

  const iocRings = useMemo(
    () => iocPoints.filter((d) => d.severity === "critical" || d.severity === "high"),
    [iocPoints],
  )

  const worldMarkers = useMemo<WorldMarker[]>(() => {
    if (!showWorldLayers) return []
    const kindActive = (kind: WorldMarkerKind): boolean => {
      if (kind === "cyber") return false // cyber is now rendered as IOC dots, not markers
      if (!activeLayers) return true
      const label = Object.entries(LAYER_KIND_MAP).find(([, v]) => v === kind)?.[0]
      return label ? activeLayers.has(label) : true
    }
    return WORLD_MARKERS.filter((m) => kindActive(m.kind))
  }, [showWorldLayers, activeLayers])

  const w = width ?? Math.ceil(viewport.width * (interactive ? 1 : 1.18))
  const h = height ?? Math.ceil(viewport.height * (interactive ? 1 : 1.18))
  // Background hero: centre the globe vertically (the concept fixes cy = H·0.5).
  const globeOffset = interactive ? "translate(-50%, -50%)" : "translate(-50%, -50%)"
  // Right-aligned background hero: stay centred on small/tablet (where there's
  // no room for a side hero), push to ~71% width from lg up.
  const rightAligned = align === "right" && !interactive

  // ---- Render --------------------------------------------------------------
  return (
    <div
      aria-hidden={!interactive}
      className={rightAligned ? "absolute top-1/2 left-1/2 lg:left-[72%]" : "absolute top-1/2 left-1/2"}
      style={{ width: w, height: h, transform: globeOffset }}
    >
      <Globe
        ref={globeRef}
        width={w}
        height={h}

        globeImageUrl={
          nightMode
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        }
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor={nightMode ? "#f59e0b" : "#22d3ee"}
        atmosphereAltitude={interactive ? 0.18 : 0.16}

        // IOC scatter dots (honest — no arcs)
        pointsData={iocPoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius={(d: ThreatIoc) => SEV_R[d.severity] * (interactive ? zoomScale : 1)}
        pointColor={(d: ThreatIoc) => IOC_COLOR[d.type]}
        pointResolution={8}
        pointLabel={(d: ThreatIoc) =>
          `<div style="font-family:monospace;font-size:11px;background:#050505cc;border:1px solid #334155;padding:6px 10px;border-radius:4px;color:#e4e4e7;pointer-events:none;box-shadow:0 0 24px rgba(34,211,238,.16);">
            <span style="color:${IOC_COLOR[d.type]};font-weight:700;">${d.type.replace("_", " ").toUpperCase()}</span>&nbsp;·&nbsp;<span style="color:#94a3b8">${d.severity}</span><br/>
            <span style="color:#cbd5e1">${d.ref ?? d.country}</span><br/>
            <span style="color:#64748b">${d.source} · ${d.country}</span>
          </div>`
        }
        onPointHover={(d: ThreatIoc | null) => onIocSelect?.(d ?? null)}
        onPointClick={(d: ThreatIoc) => onIocSelect?.(d)}

        // Severity pulse rings (critical / high only)
        ringsData={iocRings}
        ringLat="lat"
        ringLng="lng"
        ringColor={(d: ThreatIoc) => SEV_RING[d.severity]}
        ringMaxRadius={(d: ThreatIoc) => (d.severity === "critical" ? 5.5 : 3.4)}
        ringPropagationSpeed={interactive ? 2.0 : 3.4}
        ringRepeatPeriod={interactive ? 1100 : 620}

        // World-monitor cable paths
        pathsData={showWorldLayers && (!activeLayers || activeLayers.has("Undersea Cables")) ? CABLE_PATHS : []}
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

        // World-monitor infra / event markers
        htmlElementsData={worldMarkers}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.04}
        htmlElement={(d: WorldMarker) => {
          const style = KIND_STYLE[d.kind]
          const el = document.createElement("div")
          el.title = d.title
          el.style.width = "20px"
          el.style.height = "20px"
          el.style.display = "flex"
          el.style.alignItems = "center"
          el.style.justifyContent = "center"
          el.style.pointerEvents = interactive ? "auto" : "none"
          el.style.cursor = interactive ? "pointer" : "default"
          el.style.userSelect = "none"
          el.innerHTML = `<div style="font-size:11px;color:${style.color};text-shadow:0 0 5px ${style.glow};font-weight:700">${style.icon}</div>`
          return el
        }}

        rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        enablePointerInteraction={interactive || Boolean(onGlobeClick) || Boolean(onIocSelect)}
        onGlobeReady={handleReady}
        onGlobeClick={onGlobeClick}
        onZoom={(pov: { altitude: number }) => {
          if (!interactive) return
          // zoomed out (higher altitude) → scale dots up, clamped, so attacks
          // never shrink into invisibility
          const s = Math.min(2.4, Math.max(1, pov.altitude / 1.6))
          setZoomScale((prev) => (Math.abs(prev - s) > 0.04 ? s : prev))
        }}
      />
    </div>
  )
}
