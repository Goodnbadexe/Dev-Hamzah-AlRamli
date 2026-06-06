"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// GlobeCanvas — the bare canvas painter for the OS loader's globe.
// An orthographic wireframe globe spins on a tilted axis while four comet
// trails whirl around it. Purely presentational: it fills its parent box and
// owns nothing but a requestAnimationFrame loop — no overlay, no exit, no
// onComplete. The wrappers (GlobeLoader / OSLoader) compose it.
//
// IMPORTANT: this mounts a <canvas>. It must NEVER render on mobile — the E2E
// suite asserts zero <canvas> nodes < 768px (tests/e2e/site.spec.ts). Callers
// pick GlobeRings instead on small viewports / reduced-motion.
// ---------------------------------------------------------------------------

const EMERALD = "16,185,129" // rgb channels for #10b981, used in rgba() strings

interface Comet {
  r: number // orbital radius offset, added to the globe radius at draw time
  speed: number // radians/sec; sign sets direction
  tilt: number // ellipse rotation (orbital plane tilt)
  len: number // trail length in radians
  w: number // base stroke width
  a: number // base alpha
  phase: number // random starting angle
}

// Ported from the Claude Design prototype — radii are offsets from the radius.
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

interface GlobeCanvasProps {
  /** Globe radius as a fraction of the smaller parent edge (default 0.3). */
  sizeFactor?: number
  /** Hard cap on globe radius in CSS px (default 150). */
  maxRadius?: number
  className?: string
}

export function GlobeCanvas({ sizeFactor = 0.3, maxRadius = 150, className }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
      // Globe diameter scales with the smaller parent edge, capped for sanity.
      radius = Math.min(Math.min(w, h) * sizeFactor, maxRadius) * dpr
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
  }, [sizeFactor, maxRadius])

  return <canvas ref={canvasRef} className={cn("block", className)} />
}
