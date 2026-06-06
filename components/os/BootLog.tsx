"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// BootLog — the terminal boot-log visual: wordmark, a sequence of status lines
// that reveal on a timer, a "classified file resolved" banner, and a progress
// bar driven by how many lines have appeared. Presentational and self-timed —
// it owns no overlay and never signals completion; wrappers (BootSequence /
// OSLoader) handle the overlay lifecycle and onComplete.
// ---------------------------------------------------------------------------

// Boot log lines — deliberately sparse and purposeful, not spam.
const BOOT_LINES = [
  { delay: 0, text: "GOODNBAD.EXE v2.0 — INITIALIZING SECURE ENVIRONMENT", dim: false },
  { delay: 200, text: "loading kernel modules...", dim: true },
  { delay: 450, text: "establishing encrypted session", dim: true },
  { delay: 700, text: "identity verification: PASS", dim: false },
  { delay: 900, text: "clearance level: RESTRICTED", dim: false },
  { delay: 1100, text: "mounting personnel dossier", dim: true },
  { delay: 1300, text: "mounting deployment registry", dim: true },
  { delay: 1500, text: "live signal feed: CONNECTED", dim: false },
  { delay: 1700, text: "SYSTEM READY", dim: false },
]

const REDACTED_LABEL = "[ CLASSIFIED FILE RESOLVED ]"
const REDACTED_DELAY = 1900 // ms — banner reveal

/** Total time until the last line + banner are on screen (for callers' exit timing). */
export const BOOT_LOG_DURATION = REDACTED_DELAY

interface BootLogProps {
  className?: string
}

export function BootLog({ className }: BootLogProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [showRedacted, setShowRedacted] = useState(false)

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    // Reduced motion: skip the staggered reveal and show the final frame.
    if (reduceMotion) {
      setVisibleLines(BOOT_LINES.map((_, i) => i))
      setShowRedacted(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach(({ delay }, idx) => {
      timers.push(setTimeout(() => setVisibleLines((prev) => [...prev, idx]), delay))
    })
    timers.push(setTimeout(() => setShowRedacted(true), REDACTED_DELAY))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={cn("w-full max-w-2xl font-mono", className)}>
      {/* Wordmark */}
      <div className="mb-5 flex items-center gap-3 sm:mb-8">
        <span className="text-xl font-bold tracking-tighter text-emerald-500 sm:text-2xl">
          GOODNBAD
        </span>
        <span className="text-xl font-bold tracking-tighter text-zinc-600 sm:text-2xl">.EXE</span>
        <span className="mb-0.5 self-end text-xs uppercase tracking-[0.3em] text-zinc-700">OS</span>
      </div>

      {/* Boot log */}
      <div className="space-y-1">
        {BOOT_LINES.map(({ text, dim }, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-2 text-[11px] transition-opacity duration-300 sm:text-xs",
              visibleLines.includes(idx) ? "opacity-100" : "opacity-0",
            )}
          >
            <span className="shrink-0 select-none text-emerald-800">›</span>
            <span className={dim ? "text-zinc-600" : "text-zinc-400"}>{text}</span>
            {!dim && visibleLines.includes(idx) && (
              <span className="ml-auto shrink-0 text-[10px] uppercase tracking-widest text-emerald-700">
                OK
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Classified file resolved banner */}
      <div
        className={cn(
          "mt-5 rounded border border-zinc-800 px-4 py-3 transition-all duration-500 sm:mt-8",
          showRedacted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <p className="mb-1 text-[10px] uppercase tracking-[0.4em] text-zinc-600">status</p>
        <p className="text-sm tracking-wider text-emerald-400">{REDACTED_LABEL}</p>
      </div>

      {/* Progress bar — fills as lines resolve */}
      <div className="mt-5 h-px w-full overflow-hidden rounded-full bg-zinc-900 sm:mt-6">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{
            width: `${(visibleLines.length / BOOT_LINES.length) * 100}%`,
            transition: "width 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  )
}
