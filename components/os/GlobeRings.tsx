"use client"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// GlobeRings — a canvas-FREE globe for the OS loader. The mobile/reduced-motion
// counterpart to GlobeCanvas: an SVG orthographic wireframe sphere with emerald
// comet dots whirling around it via pure CSS transforms (compositor-friendly,
// 60fps, no main-thread paint).
//
// Why canvas-free: tests/e2e/site.spec.ts asserts zero <canvas> nodes < 768px,
// and ui-ux-pro-max's mobile guidance is transform/opacity-only motion with
// prefers-reduced-motion honored. This satisfies both — phones still get a
// globe, just rendered as SVG + CSS instead of a 2D context.
// ---------------------------------------------------------------------------

const R = 80 // sphere radius in the 200×200 viewBox

// Latitude rings: horizontal ellipses squashed by perspective.
const LAT_OFFSETS = [-56, -30, 0, 30, 56]
// Longitude rings: vertical ellipses of decreasing width toward the edge.
const LNG_RX = [16, 42, 64]

interface CometSpec {
  dur: string // orbit period
  delay: string
  tilt: number // orbital-plane tilt in degrees
  flatten: number // scaleY to make the orbit elliptical
  inset: string // negative inset → orbit just outside the sphere
  size: number // dot diameter in px
  reverse?: boolean
}

const COMETS: CometSpec[] = [
  { dur: "2.4s", delay: "0s", tilt: -17, flatten: 0.62, inset: "-4%", size: 6 },
  { dur: "3.6s", delay: "-0.8s", tilt: 24, flatten: 0.55, inset: "-11%", size: 5, reverse: true },
  { dur: "5.2s", delay: "-1.5s", tilt: -7, flatten: 0.78, inset: "-17%", size: 4 },
  { dur: "1.9s", delay: "-0.4s", tilt: 10, flatten: 0.7, inset: "-2%", size: 5, reverse: true },
]

interface GlobeRingsProps {
  className?: string
}

export function GlobeRings({ className }: GlobeRingsProps) {
  return (
    <div
      className={cn("relative aspect-square w-[min(56vw,220px)] select-none", className)}
      aria-hidden="true"
    >
      {/* Wireframe sphere */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="globe-ocean" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="70%" stopColor="#040d1a" />
            <stop offset="100%" stopColor="#020810" />
          </radialGradient>
        </defs>

        {/* Ocean disk */}
        <circle cx="100" cy="100" r={R} fill="url(#globe-ocean)" />

        {/* Graticule, clipped to the disk */}
        <g stroke="rgba(16,185,129,0.16)" strokeWidth="0.7" fill="none">
          {LAT_OFFSETS.map((off) => {
            const rx = Math.sqrt(Math.max(R * R - off * off, 0))
            return <ellipse key={`lat${off}`} cx="100" cy={100 + off} rx={rx} ry={rx * 0.16} />
          })}
          {LNG_RX.map((rx) => (
            <ellipse key={`lng${rx}`} cx="100" cy="100" rx={rx} ry={R} />
          ))}
        </g>

        {/* Terminator edge with emerald glow */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="rgba(16,185,129,0.85)"
          strokeWidth="1.4"
          className="[filter:drop-shadow(0_0_4px_rgba(16,185,129,0.55))]"
        />
      </svg>

      {/* Comet whirl — each dot rides an animated rotation inside a statically
          tilted, flattened wrapper, tracing an elliptical orbit. */}
      {COMETS.map((c, i) => (
        <div
          key={i}
          className="pointer-events-none absolute inset-0"
          style={{ transform: `rotate(${c.tilt}deg) scaleY(${c.flatten})` }}
        >
          <div
            className="absolute origin-center motion-reduce:animate-none"
            style={{
              inset: c.inset,
              animation: `cometOrbit ${c.dur} linear infinite`,
              animationDelay: c.delay,
              animationDirection: c.reverse ? "reverse" : "normal",
            }}
          >
            <span
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-emerald-400"
              style={{
                width: c.size,
                height: c.size,
                boxShadow: "0 0 8px 2px rgba(16,185,129,0.6)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
