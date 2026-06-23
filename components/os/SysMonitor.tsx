"use client"

/**
 * SysMonitor — eDEX-UI-style telemetry panel for the Goodnbad OS.
 *
 * Renders three rolling line-chart gauges driven by SIMULATED data. This is a
 * public portfolio site with security requirements — it never reads real OS,
 * network, or host telemetry. Every metric here is fabricated and explicitly
 * framed as "classified intel" theater.
 *
 * Implementation notes:
 *  - Vanilla <canvas> + requestAnimationFrame (no smoothie dependency).
 *  - Data lives in refs (no React state for the animation loop → no re-renders).
 *  - A single rAF loop drives all three canvases; a single setInterval advances
 *    the data buffers. Both are cleaned up on unmount.
 *  - ResizeObserver keeps each canvas backing store crisp at device DPR and
 *    responsive to container width.
 *  - Respects prefers-reduced-motion: renders static bars instead of animation.
 */

import { cn } from "@/lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"

// --- Theme / constants -----------------------------------------------------
// Mirrors --os-signal (#10b981 / emerald-500) from globals.css.
const SIGNAL_RGB = "16, 185, 129"
const STROKE = `rgb(${SIGNAL_RGB})`
const FILL = `rgba(${SIGNAL_RGB}, 0.06)`
const GRID = `rgba(${SIGNAL_RGB}, 0.07)`

const BUFFER_SIZE = 60 // data points per graph
const DATA_INTERVAL_MS = 500 // simulated sample cadence
const DOT_COUNT = 60 // dot-matrix status cells

type MetricKey = "threat" | "uplink" | "entropy"

interface MetricDef {
  key: MetricKey
  label: string
  /** What the (fake) metric is themed as — shown in the panel as flavor. */
  caption: string
}

const METRICS: readonly MetricDef[] = [
  { key: "threat", label: "THREAT.INDEX", caption: "threat activity" },
  { key: "uplink", label: "UPLINK.SIGNAL", caption: "connection integrity" },
  { key: "entropy", label: "ENTROPY", caption: "session entropy" },
] as const

// --- Per-metric simulation state -------------------------------------------
interface SimState {
  threat: number
  uplink: number
  uplinkPhase: number
  entropy: number
}

function nextThreat(prev: number): number {
  // Jittery biased random walk, 10–95.
  return Math.max(10, Math.min(95, prev + (Math.random() - 0.45) * 12))
}

function nextUplink(prev: number, phase: number): { value: number; phase: number } {
  // Smooth sine carrier + light noise, lands roughly 60–95.
  const nextPhase = phase + 0.05
  const value = 75 + Math.sin(nextPhase) * 15 + (Math.random() - 0.5) * 5
  return { value: Math.max(0, Math.min(100, value)), phase: nextPhase }
}

function nextEntropy(prev: number): number {
  // Slower symmetric random walk, 5–85.
  return Math.max(5, Math.min(85, prev + (Math.random() - 0.5) * 8))
}

// --- Canvas drawing --------------------------------------------------------
function drawGraph(canvas: HTMLCanvasElement, buffer: readonly number[]): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const dpr = canvas.dataset.dpr ? Number(canvas.dataset.dpr) : 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, w, h)

  // Faint horizontal grid lines (eDEX panel texture).
  ctx.strokeStyle = GRID
  ctx.lineWidth = 1
  for (let g = 1; g < 3; g++) {
    const gy = (h / 3) * g
    ctx.beginPath()
    ctx.moveTo(0, gy)
    ctx.lineTo(w, gy)
    ctx.stroke()
  }

  if (buffer.length < 2) {
    ctx.restore()
    return
  }

  const step = w / (buffer.length - 1)
  const pointY = (val: number) => h - (val / 100) * h

  // Filled area under the line.
  ctx.beginPath()
  ctx.moveTo(0, pointY(buffer[0]))
  for (let i = 1; i < buffer.length; i++) {
    ctx.lineTo(i * step, pointY(buffer[i]))
  }
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fillStyle = FILL
  ctx.fill()

  // Signal line.
  ctx.beginPath()
  ctx.moveTo(0, pointY(buffer[0]))
  for (let i = 1; i < buffer.length; i++) {
    ctx.lineTo(i * step, pointY(buffer[i]))
  }
  ctx.strokeStyle = STROKE
  ctx.lineWidth = 1.5
  ctx.lineJoin = "round"
  ctx.stroke()

  // Leading-edge marker dot.
  const lastX = (buffer.length - 1) * step
  const lastY = pointY(buffer[buffer.length - 1])
  ctx.beginPath()
  ctx.arc(lastX, lastY, 1.8, 0, Math.PI * 2)
  ctx.fillStyle = STROKE
  ctx.fill()

  ctx.restore()
}

/** Size a canvas backing store to its CSS box at device DPR. */
function syncCanvasSize(canvas: HTMLCanvasElement): void {
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)
  canvas.dataset.dpr = String(dpr)
}

// --- Component -------------------------------------------------------------
interface SysMonitorProps {
  className?: string
  /** Override the panel title. Defaults to "SYS.MONITOR". */
  title?: string
}

export function SysMonitor({ className, title = "SYS.MONITOR" }: SysMonitorProps) {
  const canvasRefs = useRef<Record<MetricKey, HTMLCanvasElement | null>>({
    threat: null,
    uplink: null,
    entropy: null,
  })
  const buffers = useRef<Record<MetricKey, number[]>>({
    threat: Array(BUFFER_SIZE).fill(50),
    uplink: Array(BUFFER_SIZE).fill(80),
    entropy: Array(BUFFER_SIZE).fill(45),
  })
  const sim = useRef<SimState>({ threat: 55, uplink: 80, uplinkPhase: 0, entropy: 45 })
  const animFrame = useRef<number | null>(null)
  const dataTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Displayed values + dot-matrix are React state (low-frequency, ~2 Hz).
  const [values, setValues] = useState<Record<MetricKey, number>>({
    threat: 55,
    uplink: 80,
    entropy: 45,
  })
  const [dots, setDots] = useState<number[]>(() => Array(DOT_COUNT).fill(0.15))
  const [timestamp, setTimestamp] = useState("--:--:--")
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect prefers-reduced-motion (and react to changes).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // Clock — independent of the graph animation.
  useEffect(() => {
    const tick = () =>
      setTimestamp(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Data simulation — advances buffers + publishes display values.
  useEffect(() => {
    const advance = () => {
      const s = sim.current

      s.threat = nextThreat(s.threat)
      const up = nextUplink(s.uplink, s.uplinkPhase)
      s.uplink = up.value
      s.uplinkPhase = up.phase
      s.entropy = nextEntropy(s.entropy)

      const push = (key: MetricKey, val: number) => {
        const buf = buffers.current[key]
        buf.push(val)
        if (buf.length > BUFFER_SIZE) buf.shift()
      }
      push("threat", s.threat)
      push("uplink", s.uplink)
      push("entropy", s.entropy)

      setValues({ threat: s.threat, uplink: s.uplink, entropy: s.entropy })

      // Dot-matrix: rolling activity map seeded by current threat level.
      setDots((prev) => {
        const next = prev.slice(1)
        const lit = Math.random() < s.threat / 120
        next.push(lit ? 0.4 + Math.random() * 0.6 : 0.1 + Math.random() * 0.12)
        return next
      })
    }

    advance()
    dataTimer.current = setInterval(advance, DATA_INTERVAL_MS)
    return () => {
      if (dataTimer.current) clearInterval(dataTimer.current)
    }
  }, [])

  // Canvas rendering loop + responsive sizing (skipped under reduced motion).
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return

    const canvases = METRICS.map((m) => canvasRefs.current[m.key]).filter(
      (c): c is HTMLCanvasElement => c !== null
    )
    if (canvases.length === 0) return

    canvases.forEach(syncCanvasSize)

    const ro = new ResizeObserver(() => canvases.forEach(syncCanvasSize))
    canvases.forEach((c) => ro.observe(c))

    const render = () => {
      for (const m of METRICS) {
        const canvas = canvasRefs.current[m.key]
        if (canvas) drawGraph(canvas, buffers.current[m.key])
      }
      animFrame.current = requestAnimationFrame(render)
    }
    animFrame.current = requestAnimationFrame(render)

    return () => {
      if (animFrame.current !== null) cancelAnimationFrame(animFrame.current)
      ro.disconnect()
    }
  }, [reducedMotion])

  const setCanvasRef = useMemo(
    () => (key: MetricKey) => (el: HTMLCanvasElement | null) => {
      canvasRefs.current[key] = el
    },
    []
  )

  return (
    <div className={cn("flex flex-col gap-3 p-3 font-mono", className)}>
      {/* Panel header — bracket-tick style */}
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_theme(colors.emerald.500)] animate-pulse" />
          <span className="text-[10px] tracking-widest text-emerald-500/80">{title}</span>
        </span>
        <span className="text-[10px] tabular-nums tracking-widest text-zinc-600">{timestamp}</span>
      </div>

      {/* Metric rows */}
      {METRICS.map((metric) => (
        <div key={metric.key} className="space-y-1">
          <div className="flex items-baseline justify-between text-[9px] uppercase tracking-widest">
            <span className="text-zinc-600">
              {metric.label}
              <span className="ml-1.5 text-zinc-700 normal-case tracking-wide">
                / {metric.caption}
              </span>
            </span>
            <span className="tabular-nums text-emerald-400">
              {values[metric.key].toFixed(1)}%
            </span>
          </div>

          {reducedMotion ? (
            // Static bar fallback — no animation, no canvas.
            <div className="h-8 w-full overflow-hidden border-y border-emerald-500/10 bg-emerald-500/[0.02]">
              <div
                className="h-full bg-emerald-500/25"
                style={{ width: `${values[metric.key]}%` }}
              />
            </div>
          ) : (
            <canvas
              ref={setCanvasRef(metric.key)}
              className="block h-8 w-full border-y border-emerald-500/10"
              aria-hidden
            />
          )}
        </div>
      ))}

      {/* Dot-matrix status row (eDEX RAM-map pattern) */}
      <div
        className="mt-1 grid h-3 gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${DOT_COUNT}, minmax(0, 1fr))` }}
        aria-hidden
      >
        {dots.map((opacity, i) => (
          <div
            key={i}
            className="rounded-[1px] transition-opacity duration-300"
            style={{ backgroundColor: STROKE, opacity }}
          />
        ))}
      </div>

      {/* Honesty footer — this is theater, not real telemetry */}
      <p className="text-[8px] uppercase tracking-widest text-zinc-700">
        simulated telemetry · classified intel theater
      </p>
    </div>
  )
}
