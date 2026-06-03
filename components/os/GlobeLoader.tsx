"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// GlobeLoader — a self-contained, dark/emerald port of the Claude Design
// "Globe Loader". An orthographic wireframe globe spins on a tilted axis while
// four comet trails whirl around it. No network fetch, no external data — it
// paints instantly and can never fail, which is what a loading screen demands.
//
// Visual lineage: the orbiting "whirl" (comet radii / speeds / tilts) is ported
// faithfully from the design prototype; the palette is retuned to the
// goodnbad.exe OS (zinc-950 + emerald #10b981) instead of the off-white original.
// ---------------------------------------------------------------------------

const EMERALD = "16,185,129" // rgb channels for #10b981, used in rgba() strings

// Timing — kept a touch quicker than BootSequence (which exits at 2600ms).
const EXIT_DELAY = 2100 // ms — overlay begins fading out
const DONE_DELAY = 2600 // ms — parent is told we're done

interface Comet {
  r: number // orbital radius, relative to globe radius (added at draw time)
  speed: number // radians/sec; sign sets direction
  tilt: number // ellipse rotation (orbital plane tilt)
  len: number // trail length in radians
  w: number // base stroke width
  a: number // base alpha
  phase: number // random starting angle
}

// Ported from the design prototype — radii are offsets from the globe radius.
const COMET_SPECS: Omit<Comet, "phase">[] = [
  { r: 9, speed: -2.4, tilt: -0.3, len: 1.5, w: 2.2, a: 0.55 },
  { r: 18, speed: 1.7, tilt: 0.42, len: 1.9, w: 1.7, a: 0.4 },
  { r: 28, speed: -1.1, tilt: -0.12, len: 2.4, w: 1.3, a: 0.26 },
  { r: 6, speed: 3.1, tilt: 0.18, len: 1.1, w: 1.5, a: 0.3 },
]

interface Point2D {
  x: number
  y: number
  visible: boolean
}

/** Orthographic projection of a lat/lng onto the visible hemisphere. */
function project(
  lat: number,
  lng: number,
  rotation: number,
  radius: number,
  cx: number,
  cy: number,
): Point2D {
  const phi = (lat * Math.PI) / 180
  const lambda = ((lng + rotation) * Math.PI) / 180
  const x = radius * Math.cos(phi) * Math.sin(lambda)
  const y = -radius * Math.sin(phi)
  const z = radius * Math.cos(phi) * Math.cos(lambda)
  return { x: cx + x, y: cy + y, visible: z > -radius * 0.06 }
}

interface GlobeLoaderProps {
  /** Called once the loader has finished (ignored when `loop` is true). */
  onComplete?: () => void
  /** Render inside the parent box (absolute) instead of a fixed full-screen overlay. */
  embedded?: boolean
  /** Run forever without exiting or calling onComplete — for previews. */
  loop?: boolean
  className?: string
}

export function GlobeLoader({ onComplete, embedded = false, loop = false, className }: GlobeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exiting, setExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // ---- Animation -----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const comets: Comet[] = COMET_SPECS.map((c) => ({ ...c, phase: Math.random() * Math.PI * 2 }))

    let dpr = 1
    let cx = 0
    let cy = 0
    let radius = 0

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      const w = parent?.clientWidth ?? window.innerWidth
      const h = parent?.clientHeight ?? window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      cx = canvas.width / 2
      cy = canvas.height / 2
      // Globe diameter scales with the smaller viewport edge, capped for sanity.
      radius = Math.min(Math.min(w, h) * 0.16, 150) * dpr
    }

    function drawGlobe(rotation: number) {
      if (!ctx) return
      // Ocean sphere — radial gradient for a lit, dimensional feel.
      const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.35, 0, cx, cy, radius)
      grad.addColorStop(0, "#0a1628")
      grad.addColorStop(0.7, "#040d1a")
      grad.addColorStop(1, "#020810")
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Clip subsequent wireframe to the sphere disk.
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()

      // Graticule — latitude lines.
      ctx.strokeStyle = `rgba(${EMERALD},0.13)`
      ctx.lineWidth = 0.6 * dpr
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath()
        let first = true
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = project(lat, lng, rotation, radius, cx, cy)
          if (!p.visible) {
            first = true
            continue
          }
          if (first) {
            ctx.moveTo(p.x, p.y)
            first = false
          } else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }

      // Graticule — longitude lines.
      for (let lng = -180; lng < 180; lng += 20) {
        ctx.beginPath()
        let first = true
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lng, rotation, radius, cx, cy)
          if (!p.visible) {
            first = true
            continue
          }
          if (first) {
            ctx.moveTo(p.x, p.y)
            first = false
          } else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
      ctx.restore()

      // Crisp emerald terminator with a soft outer glow.
      ctx.shadowColor = `rgba(${EMERALD},0.5)`
      ctx.shadowBlur = 12 * dpr
      ctx.strokeStyle = `rgba(${EMERALD},0.85)`
      ctx.lineWidth = 1.4 * dpr
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    function drawWhirl(sec: number) {
      if (!ctx) return
      comets.forEach((c) => {
        const orbit = radius + c.r * dpr
        const head = c.phase + sec * c.speed
        const segs = 26
        for (let i = 0; i < segs; i++) {
          const f0 = i / segs
          const f1 = (i + 1) / segs
          const a0 = head - c.len * f0
          const a1 = head - c.len * f1
          const fade = 1 - f0
          ctx.beginPath()
          ctx.ellipse(cx, cy, orbit, orbit * Math.cos(c.tilt), c.tilt, a1, a0)
          ctx.lineWidth = c.w * dpr * (0.35 + 0.65 * fade)
          ctx.strokeStyle = `rgba(${EMERALD},${(c.a * fade * fade).toFixed(3)})`
          ctx.lineCap = "round"
          ctx.stroke()
        }
        // Bright head dot (rotated-ellipse point).
        const ex = orbit * Math.cos(head)
        const ey = orbit * Math.cos(c.tilt) * Math.sin(head)
        const px = cx + ex * Math.cos(c.tilt) - ey * Math.sin(c.tilt)
        const py = cy + ex * Math.sin(c.tilt) + ey * Math.cos(c.tilt)
        ctx.shadowColor = `rgba(${EMERALD},0.7)`
        ctx.shadowBlur = 8 * dpr
        ctx.beginPath()
        ctx.arc(px, py, c.w * dpr * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${EMERALD},${Math.min(1, c.a + 0.3).toFixed(3)})`
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    resize()
    window.addEventListener("resize", resize)

    let raf = 0
    let start: number | null = null
    function frame(t: number) {
      if (start === null) start = t
      const elapsed = t - start
      const sec = elapsed / 1000
      // ~20s per revolution, matching the prototype's pace (slowed when reduced).
      const rotation = ((elapsed * (reduceMotion ? 0.004 : 0.018)) % 360) + 20

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      drawWhirl(reduceMotion ? sec * 0.2 : sec) // whirl behind the globe
      drawGlobe(rotation)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ---- Exit lifecycle (skipped in loop/preview mode) ------------------------
  useEffect(() => {
    if (loop) return
    const timers = [
      setTimeout(() => setExiting(true), EXIT_DELAY),
      setTimeout(() => onCompleteRef.current?.(), DONE_DELAY),
    ]
    return () => timers.forEach(clearTimeout)
  }, [loop])

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        embedded ? "absolute inset-0" : "fixed inset-0 z-[100]",
        "flex items-center justify-center bg-zinc-950 overflow-hidden",
        "transition-opacity duration-500",
        exiting ? "opacity-0 pointer-events-none" : "opacity-100",
        className,
      )}
    >
      {/* Faint scanline texture to match the OS aesthetic. */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />
      <canvas ref={canvasRef} className="block" />
      <span className="sr-only">Initializing secure environment…</span>
    </div>
  )
}
