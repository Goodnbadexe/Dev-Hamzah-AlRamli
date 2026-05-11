'use client'

import { useEffect, useRef, useState } from 'react'

interface Vec3 { x: number; y: number; z: number }
interface Point2D { x: number; y: number; visible: boolean; z: number }

interface ThreatArc {
  from: [number, number]
  to: [number, number]
  type: 'APT' | 'Ransomware' | 'DDoS' | 'Phishing' | 'Exploit'
  progress: number
  speed: number
  color: string
  tail: number
}

const THREAT_COLORS = {
  APT: '#ef4444',
  Ransomware: '#f97316',
  DDoS: '#eab308',
  Phishing: '#3b82f6',
  Exploit: '#a855f7',
}

// [lat, lng] for major threat actor origins and targets
const NODES: Record<string, [number, number]> = {
  US: [37.09, -95.71],
  China: [35.86, 104.19],
  Russia: [61.52, 105.31],
  Iran: [32.42, 53.68],
  NK: [40.33, 127.51],
  UK: [55.37, -3.43],
  Germany: [51.16, 10.45],
  India: [20.59, 78.96],
  Brazil: [-14.23, -51.92],
  Israel: [31.04, 34.85],
  Ukraine: [48.37, 31.16],
  Australia: [-25.27, 133.77],
  Japan: [36.20, 138.25],
  KSA: [23.88, 45.07],
  France: [46.22, 2.21],
  Canada: [56.13, -106.34],
  Netherlands: [52.13, 5.29],
  Singapore: [1.35, 103.82],
}

const INITIAL_ARCS: Array<{ from: keyof typeof NODES; to: keyof typeof NODES; type: ThreatArc['type'] }> = [
  { from: 'China', to: 'US', type: 'APT' },
  { from: 'Russia', to: 'Ukraine', type: 'Ransomware' },
  { from: 'NK', to: 'US', type: 'APT' },
  { from: 'Iran', to: 'Israel', type: 'APT' },
  { from: 'Russia', to: 'Germany', type: 'Phishing' },
  { from: 'China', to: 'India', type: 'APT' },
  { from: 'Russia', to: 'UK', type: 'Phishing' },
  { from: 'Iran', to: 'KSA', type: 'DDoS' },
  { from: 'NK', to: 'Japan', type: 'Exploit' },
  { from: 'China', to: 'Australia', type: 'APT' },
  { from: 'Russia', to: 'France', type: 'Ransomware' },
  { from: 'Iran', to: 'US', type: 'DDoS' },
  { from: 'China', to: 'Netherlands', type: 'Exploit' },
  { from: 'NK', to: 'Singapore', type: 'Phishing' },
]

function latLngToVec3(lat: number, lng: number): Vec3 {
  const phi = (lat * Math.PI) / 180
  const lambda = (lng * Math.PI) / 180
  return {
    x: Math.cos(phi) * Math.cos(lambda),
    y: Math.sin(phi),
    z: Math.cos(phi) * Math.sin(lambda),
  }
}

function slerp3(v1: Vec3, v2: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y + v1.z * v2.z))
  const omega = Math.acos(dot)
  if (omega < 0.001) return v1
  const sinOmega = Math.sin(omega)
  const s1 = Math.sin((1 - t) * omega) / sinOmega
  const s2 = Math.sin(t * omega) / sinOmega
  return { x: s1 * v1.x + s2 * v2.x, y: s1 * v1.y + s2 * v2.y, z: s1 * v1.z + s2 * v2.z }
}

function vec3ToLatLng(v: Vec3): [number, number] {
  return [(Math.asin(v.y) * 180) / Math.PI, (Math.atan2(v.z, v.x) * 180) / Math.PI]
}

function project(lat: number, lng: number, rotation: number, radius: number, cx: number, cy: number): Point2D {
  const phi = (lat * Math.PI) / 180
  const lambda = ((lng + rotation) * Math.PI) / 180
  const x = radius * Math.cos(phi) * Math.sin(lambda)
  const y = -radius * Math.sin(phi)
  const z = radius * Math.cos(phi) * Math.cos(lambda)
  return { x: cx + x, y: cy + y, visible: z > -radius * 0.1, z }
}

function randomArc(): ThreatArc {
  const event = INITIAL_ARCS[Math.floor(Math.random() * INITIAL_ARCS.length)]
  const type = event.type
  return {
    from: NODES[event.from],
    to: NODES[event.to],
    type,
    progress: Math.random(),
    speed: 0.003 + Math.random() * 0.003,
    color: THREAT_COLORS[type],
    tail: 0.25 + Math.random() * 0.25,
  }
}

interface Props {
  className?: string
  height?: number
}

export function ThreatGlobe({ className = '', height = 420 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const arcsRef = useRef<ThreatArc[]>([])
  const rotationRef = useRef(20)
  const rafRef = useRef<number>(0)
  const [stats, setStats] = useState({ arcs: 0, activeCountries: 0 })

  useEffect(() => {
    // Initialize arcs staggered
    arcsRef.current = Array.from({ length: 8 }, (_, i) => {
      const arc = randomArc()
      arc.progress = i / 8
      return arc
    })

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0

    function draw() {
      const W = canvas!.width
      const H = canvas!.height
      const cx = W / 2
      const cy = H / 2
      const radius = Math.min(W, H) * 0.42

      ctx!.clearRect(0, 0, W, H)

      // Sphere background gradient
      const grad = ctx!.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, 0, cx, cy, radius)
      grad.addColorStop(0, '#0a1628')
      grad.addColorStop(0.7, '#040d1a')
      grad.addColorStop(1, '#020810')
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()

      // Globe border glow
      const borderGrad = ctx!.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.05)
      borderGrad.addColorStop(0, 'rgba(16,185,129,0.3)')
      borderGrad.addColorStop(1, 'rgba(16,185,129,0)')
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius * 1.02, 0, Math.PI * 2)
      ctx!.fillStyle = borderGrad
      ctx!.fill()

      // Clip to sphere
      ctx!.save()
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.clip()

      // Latitude lines
      ctx!.strokeStyle = 'rgba(16,185,129,0.08)'
      ctx!.lineWidth = 0.5
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx!.beginPath()
        let first = true
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = project(lat, lng, rotationRef.current, radius, cx, cy)
          if (!p.visible) { first = true; continue }
          if (first) { ctx!.moveTo(p.x, p.y); first = false }
          else ctx!.lineTo(p.x, p.y)
        }
        ctx!.stroke()
      }

      // Longitude lines
      for (let lng = -180; lng < 180; lng += 30) {
        ctx!.beginPath()
        let first = true
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lat, lng, rotationRef.current, radius, cx, cy)
          if (!p.visible) { first = true; continue }
          if (first) { ctx!.moveTo(p.x, p.y); first = false }
          else ctx!.lineTo(p.x, p.y)
        }
        ctx!.stroke()
      }

      // Draw threat arcs
      const arcs = arcsRef.current
      arcs.forEach((arc) => {
        const fromVec = latLngToVec3(arc.from[0], arc.from[1])
        const toVec = latLngToVec3(arc.to[0], arc.to[1])

        const tailStart = Math.max(0, arc.progress - arc.tail)
        const steps = 60
        const points: Array<{ x: number; y: number; visible: boolean; t: number }> = []

        for (let i = 0; i <= steps; i++) {
          const t = tailStart + (arc.progress - tailStart) * (i / steps)
          const v = slerp3(fromVec, toVec, t)
          const [lat, lng] = vec3ToLatLng(v)
          const p = project(lat, lng, rotationRef.current, radius, cx, cy)
          points.push({ ...p, t })
        }

        // Draw arc as gradient path
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1]
          const curr = points[i]
          if (!prev.visible || !curr.visible) continue
          const alpha = (i / points.length) * 0.9
          ctx!.strokeStyle = arc.color + Math.round(alpha * 255).toString(16).padStart(2, '0')
          ctx!.lineWidth = 1.5
          ctx!.shadowColor = arc.color
          ctx!.shadowBlur = 4
          ctx!.beginPath()
          ctx!.moveTo(prev.x, prev.y)
          ctx!.lineTo(curr.x, curr.y)
          ctx!.stroke()
        }

        // Arc head dot
        const head = points[points.length - 1]
        if (head.visible) {
          ctx!.shadowBlur = 10
          ctx!.fillStyle = arc.color
          ctx!.beginPath()
          ctx!.arc(head.x, head.y, 2.5, 0, Math.PI * 2)
          ctx!.fill()
        }

        ctx!.shadowBlur = 0
      })

      // Node dots (countries)
      const activeNodes = new Set<string>()
      arcs.forEach((arc) => {
        activeNodes.add(JSON.stringify(arc.from))
        activeNodes.add(JSON.stringify(arc.to))
      })

      Object.entries(NODES).forEach(([name, [lat, lng]]) => {
        const p = project(lat, lng, rotationRef.current, radius, cx, cy)
        if (!p.visible) return

        const isActive = Array.from(activeNodes).some((k) => {
          const [nlat, nlng] = JSON.parse(k)
          return Math.abs(nlat - lat) < 0.1 && Math.abs(nlng - lng) < 0.1
        })

        if (isActive) {
          // Pulsing ring
          const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08 + lat + lng)
          ctx!.strokeStyle = `rgba(16,185,129,${0.2 + pulse * 0.3})`
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, 6 + pulse * 4, 0, Math.PI * 2)
          ctx!.stroke()

          ctx!.fillStyle = '#10b981'
          ctx!.shadowColor = '#10b981'
          ctx!.shadowBlur = 6
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, 3, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.shadowBlur = 0
        } else {
          ctx!.fillStyle = 'rgba(16,185,129,0.25)'
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
          ctx!.fill()
        }
      })

      ctx!.restore()

      // Outer sphere ring
      ctx!.strokeStyle = 'rgba(16,185,129,0.2)'
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx!.stroke()

      // Advance arcs
      arcs.forEach((arc, i) => {
        arc.progress += arc.speed
        if (arc.progress > 1.1) {
          arcs[i] = randomArc()
          arcs[i].progress = 0
        }
      })

      rotationRef.current += 0.04
      frame++

      if (frame % 30 === 0) {
        setStats({ arcs: arcs.length, activeCountries: Object.keys(NODES).length })
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [height])

  const typeColors = Object.entries(THREAT_COLORS)

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px` }}
        className="block rounded-xl"
      />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1">
        {typeColors.map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className="h-1.5 w-4 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-mono" style={{ color }}>{type}</span>
          </div>
        ))}
      </div>
      {/* Stats overlay */}
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
        <div className="rounded border border-emerald-500/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
          {stats.activeCountries} NODES ACTIVE
        </div>
        <div className="rounded border border-red-500/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-red-400">
          LIVE TRACKING
        </div>
      </div>
    </div>
  )
}
