"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { GlobeCanvas } from "./GlobeCanvas"

// ---------------------------------------------------------------------------
// GlobeLoader — globe-only entry overlay (the canvas globe with no boot log).
// Kept as a standalone variant and for the /lab preview; the live entry path
// now uses the merged OSLoader. The globe painting lives in GlobeCanvas so the
// two share one implementation.
//
// NOTE: GlobeCanvas mounts a <canvas> — only render this on desktop. The merged
// OSLoader handles the desktop/mobile choice automatically.
// ---------------------------------------------------------------------------

const EXIT_DELAY = 2100 // ms — overlay begins fading out
const DONE_DELAY = 2600 // ms — parent is told we're done

interface GlobeLoaderProps {
  /** Called once the loader has finished (ignored when `loop` is true). */
  onComplete?: () => void
  /** Render inside the parent box (absolute) instead of a fixed overlay. */
  embedded?: boolean
  /** Run forever without exiting or calling onComplete — for previews. */
  loop?: boolean
  className?: string
}

export function GlobeLoader({ onComplete, embedded = false, loop = false, className }: GlobeLoaderProps) {
  const [exiting, setExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

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
        "flex items-center justify-center overflow-hidden bg-zinc-950",
        "transition-opacity duration-500",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />
      <GlobeCanvas className="absolute inset-0" />
      <span className="sr-only">Initializing secure environment…</span>
    </div>
  )
}
