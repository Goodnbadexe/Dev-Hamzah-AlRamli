"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

// Boot log lines — deliberately sparse and purposeful, not spam
const BOOT_LINES = [
  { delay: 0,    text: "GOODNBAD.EXE v2.0 — INITIALIZING SECURE ENVIRONMENT",  dim: false },
  { delay: 200,  text: "loading kernel modules...",                              dim: true  },
  { delay: 450,  text: "establishing encrypted session",                         dim: true  },
  { delay: 700,  text: "identity verification: PASS",                            dim: false },
  { delay: 900,  text: "clearance level: RESTRICTED",                            dim: false },
  { delay: 1100, text: "mounting personnel dossier",                             dim: true  },
  { delay: 1300, text: "mounting deployment registry",                           dim: true  },
  { delay: 1500, text: "live signal feed: CONNECTED",                            dim: false },
  { delay: 1700, text: "SYSTEM READY",                                           dim: false },
]

const REDACTED_LABEL = "[ CLASSIFIED FILE RESOLVED ]"
const EXIT_DELAY = 2600   // ms — when the overlay starts fading out
const DONE_DELAY = 3200   // ms — when the parent is told we're done

interface BootSequenceProps {
  onComplete: () => void
  className?: string
}

/**
 * BootSequence — the classified entry state.
 * Full-screen overlay that plays a boot log, then resolves into the OS.
 * Designed to be cinematic but not excessive — under 3 seconds total.
 */
export function BootSequence({ onComplete, className }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [showRedacted, setShowRedacted]   = useState(false)
  const [exiting, setExiting]             = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Reveal each log line at its scheduled delay
    BOOT_LINES.forEach(({ delay }, idx) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, idx])
      }, delay))
    })

    // Show the classified file resolved banner
    timers.push(setTimeout(() => setShowRedacted(true), 1900))

    // Start exit fade
    timers.push(setTimeout(() => setExiting(true), EXIT_DELAY))

    // Signal completion to parent
    timers.push(setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete()
      }
    }, DONE_DELAY))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950",
        "transition-opacity duration-500",
        exiting ? "opacity-0 pointer-events-none" : "opacity-100",
        className
      )}
    >
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />

      <div className="relative w-full max-w-2xl px-6 md:px-0 font-mono">
        {/* Wordmark */}
        <div className="mb-8 flex items-center gap-3">
          <span className="text-emerald-500 text-2xl font-bold tracking-tighter">
            GOODNBAD
          </span>
          <span className="text-zinc-600 text-2xl font-bold tracking-tighter">.EXE</span>
          <span className="text-zinc-700 text-xs uppercase tracking-[0.3em] self-end mb-0.5">
            OS
          </span>
        </div>

        {/* Boot log */}
        <div className="space-y-1 min-h-[200px]">
          {BOOT_LINES.map(({ text, dim }, idx) => (
            <div
              key={idx}
              className={cn(
                "text-xs transition-opacity duration-300 flex items-start gap-2",
                visibleLines.includes(idx) ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="text-emerald-800 select-none shrink-0">›</span>
              <span className={dim ? "text-zinc-600" : "text-zinc-400"}>
                {text}
              </span>
              {!dim && visibleLines.includes(idx) && (
                <span className="text-emerald-700 ml-auto shrink-0 text-[10px] uppercase tracking-widest">
                  OK
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Classified file resolved banner */}
        <div
          className={cn(
            "mt-8 border border-zinc-800 rounded px-4 py-3 transition-all duration-500",
            showRedacted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-1">
            status
          </p>
          <p className="text-sm text-emerald-400 tracking-wider">
            {REDACTED_LABEL}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-px w-full bg-zinc-900 overflow-hidden rounded-full">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all"
            style={{
              width: `${(visibleLines.length / BOOT_LINES.length) * 100}%`,
              transitionDuration: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  )
}
