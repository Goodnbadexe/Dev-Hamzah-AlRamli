"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { BootLog } from "./BootLog"

// ---------------------------------------------------------------------------
// BootSequence — the classified terminal entry overlay (boot log only, no
// globe). The original canvas-free loader, kept as a standalone variant and for
// the /lab preview. The log itself lives in BootLog so it stays in sync with
// the merged OSLoader. This wrapper just owns the full-screen overlay + exit.
// ---------------------------------------------------------------------------

const EXIT_DELAY = 2600 // ms — overlay starts fading out
const DONE_DELAY = 3200 // ms — parent is told we're done

interface BootSequenceProps {
  onComplete: () => void
  /** Render inside the parent box (absolute) and stay visible without fading —
   *  used by the loader preview, which owns replay via remount. */
  embedded?: boolean
  className?: string
}

export function BootSequence({ onComplete, embedded = false, className }: BootSequenceProps) {
  const [exiting, setExiting] = useState(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (embedded) return // preview holds the final frame
    const timers = [
      setTimeout(() => setExiting(true), EXIT_DELAY),
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current()
        }
      }, DONE_DELAY),
    ]
    return () => timers.forEach(clearTimeout)
  }, [embedded])

  return (
    <div
      className={cn(
        embedded ? "absolute inset-0" : "fixed inset-0 z-[100]",
        "flex flex-col items-center justify-center bg-zinc-950",
        "transition-opacity duration-500",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
      <div className="px-6 md:px-0">
        <BootLog />
      </div>
    </div>
  )
}
