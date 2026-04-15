"use client"

/**
 * HorusGlobe
 * ----------
 * WebGL 3D globe for the Horus-Eye intelligence platform.
 *
 * Phase 1 layers (no API keys required):
 *   ✈  Aircraft — live positions from OpenSky Network (3 000 flights)
 *   🛰  Satellite — NASA GIBS near-real-time Earth imagery (2-day lag)
 *   🔮  Prediction — dead-reckoning forward arc for the selected aircraft
 *
 * Phase 2 (pending keys): Maritime, Weather overlay
 *
 * Design mirrors ThreatGlobe: same react-globe.gl patterns, same material
 * customisation, same control setup — just different data layers.
 */

import { useCallback, useEffect, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import * as THREE from "three"
import type { AircraftState, GlobeMode } from "./types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false }) as any

// ---------------------------------------------------------------------------
// Textures
// ---------------------------------------------------------------------------
const TEXTURES: Record<GlobeMode, string> = {
  bluemarble: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  night:      "//unpkg.com/three-globe/example/img/earth-night.jpg",
  // NASA GIBS VIIRS True Colour — 2048×1024, free, no key, ~2 day lag
  satellite:  (() => {
    const d = new Date()
    d.setDate(d.getDate() - 2)
    const date = d.toISOString().split("T")[0]
    return (
      `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi` +
      `?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0` +
      `&LAYERS=VIIRS_SNPP_CorrectedReflectance_TrueColor&STYLES=` +
      `&CRS=CRS:84&BBOX=-180,-90,180,90&WIDTH=2048&HEIGHT=1024` +
      `&FORMAT=image/jpeg&TIME=${date}`
    )
  })(),
}

// ---------------------------------------------------------------------------
// Altitude → colour (blue = cruise, green = climb/descend, yellow = approach)
// ---------------------------------------------------------------------------
function altColor(metres: number): string {
  if (metres > 10_000) return "rgba(59,130,246,0.90)"   // blue  — cruising
  if (metres >  5_000) return "rgba(52,211,153,0.90)"   // green — en-route
  if (metres >  1_000) return "rgba(234,179,8,0.90)"    // amber — approach
  return                      "rgba(249,115,22,0.90)"   // orange — low
}

// ---------------------------------------------------------------------------
// Dead-reckoning — project position forward by `minutes` based on heading + speed
// ---------------------------------------------------------------------------
function deadReckoning(
  lat: number, lng: number,
  headingDeg: number,
  speedMs: number,
  minutes: number
): { lat: number; lng: number } {
  const R      = 6_371_000              // Earth radius in metres
  const dist   = speedMs * 60 * minutes // metres to travel
  const headR  = (headingDeg * Math.PI) / 180
  const latR   = (lat  * Math.PI) / 180
  const lngR   = (lng  * Math.PI) / 180
  const dR     = dist / R               // angular distance

  const newLatR = Math.asin(
    Math.sin(latR) * Math.cos(dR) +
    Math.cos(latR) * Math.sin(dR) * Math.cos(headR)
  )
  const newLngR = lngR + Math.atan2(
    Math.sin(headR) * Math.sin(dR) * Math.cos(latR),
    Math.cos(dR) - Math.sin(latR) * Math.sin(newLatR)
  )

  return {
    lat: (newLatR * 180) / Math.PI,
    lng: (((newLngR * 180) / Math.PI) + 540) % 360 - 180,
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface HorusGlobeProps {
  aircraft:       AircraftState[]
  selected:       AircraftState | null
  globeMode:      GlobeMode
  showPrediction: boolean
  showLabels:     boolean
  onSelect:       (aircraft: AircraftState | null) => void
  width?:         number
  height?:        number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function HorusGlobe({
  aircraft,
  selected,
  globeMode,
  showPrediction,
  showLabels,
  onSelect,
  width,
  height,
}: HorusGlobeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)

  // -------------------------------------------------------------------
  // Points — all aircraft, radius/colour by altitude; selected = larger
  // -------------------------------------------------------------------
  const pointsData = useMemo(
    () => aircraft.map(a => ({
      ...a,
      _color:  altColor(a.altitude),
      _radius: a.icao24 === selected?.icao24 ? 0.38 : 0.11,
      _alt:    Math.min(a.altitude / 12_000, 1) * 0.018,
    })),
    [aircraft, selected]
  )

  // -------------------------------------------------------------------
  // Ring — pulse at selected aircraft's position
  // -------------------------------------------------------------------
  const ringsData = useMemo(
    () => selected
      ? [{ lat: selected.latitude, lng: selected.longitude, id: selected.icao24 }]
      : [],
    [selected]
  )

  // -------------------------------------------------------------------
  // Prediction arc — 15-min dead reckoning for selected aircraft
  // -------------------------------------------------------------------
  const predictionArcs = useMemo(() => {
    if (!showPrediction || !selected || selected.velocity < 5) return []
    const dest = deadReckoning(
      selected.latitude, selected.longitude,
      selected.heading, selected.velocity, 15
    )
    return [{
      startLat: selected.latitude,
      startLng: selected.longitude,
      endLat:   dest.lat,
      endLng:   dest.lng,
      color:    ["rgba(52,211,153,0.85)", "rgba(52,211,153,0.0)"],
    }]
  }, [selected, showPrediction])

  // -------------------------------------------------------------------
  // Labels — callsign of selected aircraft + nearby aircraft when zoomed
  // -------------------------------------------------------------------
  const labelsData = useMemo(() => {
    if (!showLabels && !selected) return []
    // Always show selected callsign; when showLabels is on, show top 60
    const base = selected ? [selected] : []
    if (!showLabels) return base
    const extra = aircraft
      .filter(a => a.icao24 !== selected?.icao24 && a.callsign)
      .slice(0, 60)
    return [...base, ...extra]
  }, [aircraft, selected, showLabels])

  // -------------------------------------------------------------------
  // Globe ready — material + camera (mirrors ThreatGlobe pattern)
  // -------------------------------------------------------------------
  const handleReady = useCallback(() => {
    if (!globeRef.current) return

    globeRef.current.pointOfView({ lat: 25, lng: 25, altitude: 2.2 }, 1400)

    const mat = globeRef.current.globeMaterial?.()
    if (mat) {
      if (globeMode === "satellite") {
        // Let the satellite image speak — minimal tint
        mat.color             = new THREE.Color("#ffffff")
        mat.emissive          = new THREE.Color("#050a10")
        mat.emissiveIntensity = 0.08
        mat.shininess         = 6
      } else if (globeMode === "night") {
        mat.color             = new THREE.Color("#0a1020")
        mat.emissive          = new THREE.Color("#000408")
        mat.emissiveIntensity = 0.55
        mat.shininess         = 2
      } else {
        mat.color             = new THREE.Color("#1a2a3a")
        mat.emissive          = new THREE.Color("#030810")
        mat.emissiveIntensity = 0.35
        mat.shininess         = 4
      }
      mat.needsUpdate = true
    }

    const ctrl = globeRef.current.controls()
    if (ctrl) {
      ctrl.autoRotate      = true
      ctrl.autoRotateSpeed = 0.12
      ctrl.enableZoom      = true
      ctrl.enablePan       = false
      ctrl.minDistance     = 120
      ctrl.maxDistance     = 500
    }
  }, [globeMode])

  // Re-apply material when mode changes post-ready
  useEffect(() => {
    if (!globeRef.current) return
    const mat = globeRef.current.globeMaterial?.()
    if (!mat) return
    if (globeMode === "satellite") {
      mat.color = new THREE.Color("#ffffff")
      mat.emissiveIntensity = 0.08
    } else if (globeMode === "night") {
      mat.color = new THREE.Color("#0a1020")
      mat.emissiveIntensity = 0.55
    } else {
      mat.color = new THREE.Color("#1a2a3a")
      mat.emissiveIntensity = 0.35
    }
    mat.needsUpdate = true
  }, [globeMode])

  // Stop rotation while user interacts with selected aircraft
  useEffect(() => {
    const ctrl = globeRef.current?.controls()
    if (!ctrl) return
    ctrl.autoRotate = !selected
  }, [selected])

  // -------------------------------------------------------------------
  // Fly camera to selected aircraft
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!selected || !globeRef.current) return
    globeRef.current.pointOfView(
      { lat: selected.latitude, lng: selected.longitude, altitude: 0.9 },
      800
    )
  }, [selected])

  const w = width  ?? (typeof window !== "undefined" ? window.innerWidth  : 1440)
  const h = height ?? (typeof window !== "undefined" ? window.innerHeight : 900)

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ width: w, height: h, transform: "translate(-50%,-50%)" }}
    >
      <Globe
        ref={globeRef}
        width={w}
        height={h}

        // Textures
        globeImageUrl={TEXTURES[globeMode]}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor={globeMode === "night" ? "rgba(30,40,100,0.6)" : "rgba(100,160,220,0.35)"}
        atmosphereAltitude={0.18}

        // ── Aircraft points ────────────────────────────────────────────
        pointsData={pointsData}
        pointLat="latitude"
        pointLng="longitude"
        pointAltitude="_alt"
        pointColor="_color"
        pointRadius="_radius"
        pointResolution={6}
        pointLabel={(d: AircraftState & { _color: string }) =>
          `<div style="font-family:monospace;font-size:11px;background:#050505cc;border:1px solid #1e3a2a;padding:6px 10px;border-radius:4px;color:#e4e4e7;pointer-events:none;white-space:nowrap;">
            <span style="color:#34d399;font-weight:700;">${d.callsign || d.icao24}</span>
            <span style="color:#64748b"> · ${d.country}</span><br/>
            <span style="color:#94a3b8">Alt ${Math.round(d.altitude).toLocaleString()} m</span>
            &nbsp;·&nbsp;
            <span style="color:#94a3b8">${Math.round(d.velocity * 3.6)} km/h</span><br/>
            <span style="color:#64748b">Hdg ${Math.round(d.heading)}° · ${d.verticalRate > 1 ? "↑ climbing" : d.verticalRate < -1 ? "↓ descending" : "→ level"}</span>
          </div>`
        }
        onPointClick={(d: AircraftState) => onSelect(d.icao24 === selected?.icao24 ? null : d)}

        // ── Ring — selected aircraft pulse ────────────────────────────
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "rgba(52,211,153,0.65)"}
        ringMaxRadius={4}
        ringPropagationSpeed={2.5}
        ringRepeatPeriod={900}

        // ── Prediction arc — 15-minute dead reckoning ─────────────────
        arcsData={predictionArcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcAltitude={0.08}
        arcStroke={1.2}
        arcDashLength={0.45}
        arcDashGap={0.22}
        arcDashAnimateTime={2400}
        arcLabel={() =>
          `<div style="font-family:monospace;font-size:11px;background:#050505cc;border:1px solid #1e3a2a;padding:6px 10px;border-radius:4px;color:#34d399;pointer-events:none;">
            15-min projection (dead reckoning)
          </div>`
        }

        // ── Callsign labels ───────────────────────────────────────────
        labelsData={labelsData}
        labelLat="latitude"
        labelLng="longitude"
        labelText={(d: AircraftState) => d.callsign || d.icao24}
        labelSize={(d: AircraftState) => d.icao24 === selected?.icao24 ? 0.75 : 0.45}
        labelDotRadius={(d: AircraftState) => d.icao24 === selected?.icao24 ? 0.28 : 0.12}
        labelColor={(d: AircraftState) =>
          d.icao24 === selected?.icao24 ? "rgba(52,211,153,1)" : "rgba(255,255,255,0.55)"
        }
        labelResolution={2}

        // ── Performance ────────────────────────────────────────────────
        rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        enablePointerInteraction
        onGlobeReady={handleReady}
      />
    </div>
  )
}
