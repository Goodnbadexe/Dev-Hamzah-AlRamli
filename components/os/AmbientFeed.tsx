"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface FeedEntry {
  ts: string
  label: string
  detail?: string
  type?: "deploy" | "cert" | "commit" | "signal" | "system" | "threat"
}

const typeColor: Record<NonNullable<FeedEntry["type"]>, string> = {
  deploy: "text-emerald-500",
  cert:   "text-yellow-500",
  commit: "text-blue-400",
  signal: "text-zinc-400",
  system: "text-zinc-600",
  threat: "text-red-400",
}

interface AmbientFeedProps {
  /** Static entries that cycle on interval as background noise */
  entries: FeedEntry[]
  /**
   * Live entries pushed externally (e.g. globe attack events).
   * Each new entry at index 0 gets prepended to the visible list.
   */
  liveEntries?: FeedEntry[]
  /** Tick interval for static entries in ms. Default: 3000 */
  interval?: number
  /** Max visible lines. Default: 6 */
  maxLines?: number
  className?: string
}

/**
 * AmbientFeed — a live-scrolling signal ticker.
 *
 * Cycles static background entries at a configurable interval.
 * When liveEntries is provided, new entries from the globe/threat
 * feed are prepended in real-time, turning this into a live
 * cyber-intelligence log.
 */
export function AmbientFeed({
  entries,
  liveEntries,
  interval = 3000,
  maxLines = 6,
  className,
}: AmbientFeedProps) {
  const [visible, setVisible] = useState<FeedEntry[]>([])
  const indexRef     = useRef(0)
  const prevLiveRef  = useRef<FeedEntry[]>([])

  // Static ticker — cycles background entries
  useEffect(() => {
    if (entries.length === 0) return
    const tick = () => {
      const entry = entries[indexRef.current % entries.length]
      indexRef.current += 1
      setVisible(prev => [entry, ...prev].slice(0, maxLines))
    }
    tick()
    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [entries, interval, maxLines])

  // Live entries — prepend newest when liveEntries[0] changes
  useEffect(() => {
    if (!liveEntries || liveEntries.length === 0) return
    const prev = prevLiveRef.current
    const newest = liveEntries[0]
    if (!newest) return
    // Only push if it's genuinely new (different from last seen)
    if (prev[0]?.ts === newest.ts && prev[0]?.label === newest.label) return
    prevLiveRef.current = liveEntries
    setVisible(v => [newest, ...v].slice(0, maxLines))
  }, [liveEntries, maxLines])

  return (
    <div className={cn("font-mono text-[11px] space-y-1.5 overflow-hidden", className)}>
      {visible.map((entry, i) => (
        <div
          key={`${entry.ts}-${entry.label}-${i}`}
          className={cn(
            "flex items-start gap-2 transition-opacity duration-500",
            i === 0 ? "opacity-100" : i < 3 ? "opacity-60" : "opacity-25"
          )}
        >
          <span className="text-zinc-700 shrink-0 tabular-nums">{entry.ts}</span>
          <span className={cn("shrink-0 uppercase text-[10px]", typeColor[entry.type ?? "signal"])}>
            [{entry.type ?? "sig"}]
          </span>
          <span className="text-zinc-400 truncate">{entry.label}</span>
          {entry.detail && (
            <span className="text-zinc-600 truncate hidden sm:block">{entry.detail}</span>
          )}
        </div>
      ))}
    </div>
  )
}
