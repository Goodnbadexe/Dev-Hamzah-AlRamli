"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { GlobeCanvas } from "./GlobeCanvas"
import { GlobeRings } from "./GlobeRings"
import { BootLog } from "./BootLog"

// ---------------------------------------------------------------------------
// OSLoader — the unified entry loader. Merges the two former loaders into one
// 50/50 composition that crossfades in and out as a single piece, replacing the
// old hard either/or (desktop saw only the globe, mobile saw only the boot log).
//
// Layout is responsive:
//   • desktop (md+) → side-by-side: boot log | globe  (globe on the right, to
//     echo the homepage's globe-pushed-right placement)
//   • mobile        → stacked:      globe over boot log  (a horizontal split
//     would crush the mono boot-log column on a phone — ui-ux-pro-max)
//
// Globe variant is chosen for the device, NOT swapped abruptly mid-flight:
//   • desktop, motion allowed → GlobeCanvas  (2D-context globe)
//   • mobile OR reduced-motion → GlobeRings   (canvas-free SVG/CSS globe)
// Mobile therefore never mounts a <canvas>, keeping the E2E guard green
// (tests/e2e/site.spec.ts) while still showing a globe.
// ---------------------------------------------------------------------------

// Timing — long enough for the boot log to resolve ("SYSTEM READY" + banner at
// ~1900ms) before we begin the crossfade, so nothing is cut off mid-sequence.
const EXIT_DELAY = 2400 // ms — overlay begins fading out
const DONE_DELAY = 2900 // ms — parent is told we're done

type GlobeVariant = "canvas" | "rings"

/** Decide which globe to paint. Canvas only on a roomy, motion-allowed desktop. */
function pickGlobeVariant(): GlobeVariant {
  if (typeof window === "undefined") return "rings"
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) return "rings"
  return window.innerWidth >= 768 ? "canvas" : "rings"
}

interface OSLoaderProps {
  /** Called once the loader has finished (ignored when `loop` is true). */
  onComplete?: () => void
  /** Render inside the parent box (absolute) instead of a fixed overlay. */
  embedded?: boolean
  /** Run forever without exiting — for the /lab preview. */
  loop?: boolean
  className?: string
}

export function OSLoader({ onComplete, embedded = false, loop = false, className }: OSLoaderProps) {
  const [variant, setVariant] = useState<GlobeVariant>("rings")
  const [exiting, setExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Resolve the globe variant on the client after mount (window-safe).
  useEffect(() => {
    setVariant(pickGlobeVariant())
  }, [])

  // Exit lifecycle — skipped in loop/preview mode.
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
        // Stacked on mobile, side-by-side (globe right) on desktop.
        "flex flex-col overflow-hidden bg-zinc-950 md:flex-row-reverse",
        "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
        "transition-opacity duration-500",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
        className,
      )}
    >
      {/* Faint scanline texture to match the OS aesthetic. */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />

      {/* Globe — top half (mobile) / right half (desktop) */}
      <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center">
        {variant === "canvas" ? (
          <GlobeCanvas className="absolute inset-0" sizeFactor={0.34} maxRadius={200} />
        ) : (
          <GlobeRings />
        )}
      </div>

      {/* Hairline seam between the two halves — horizontal (mobile) / vertical (desktop) */}
      <div className="mx-auto h-px w-2/3 max-w-md shrink-0 bg-gradient-to-r from-transparent via-emerald-900/40 to-transparent md:mx-0 md:my-auto md:h-2/3 md:w-px md:max-h-md md:bg-gradient-to-b" />

      {/* Boot log — bottom half (mobile) / left half (desktop) */}
      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center px-6">
        <BootLog />
      </div>

      <span className="sr-only">Initializing secure environment…</span>
    </div>
  )
}
