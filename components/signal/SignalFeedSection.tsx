"use client"

/**
 * SignalFeedSection — live cyber-threat intelligence feed.
 *
 * Renders the initial server-provided items and can refresh on demand
 * by hitting /api/signal-feed. No external fetches happen in the browser
 * on initial render — only on manual refresh.
 */

import { useState, useCallback, useTransition } from "react"
import { formatDistanceToNow } from "date-fns"
import { RefreshCw, ExternalLink, AlertTriangle, Shield, Rss, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SignalFeedItem, FeedItemCategory, SignalFeedResponse } from "@/lib/signal-feed/types"

// ---------------------------------------------------------------------------
// Badge configs
// ---------------------------------------------------------------------------
const CATEGORY_BADGE: Record<FeedItemCategory, { label: string; className: string }> = {
  kev:      { label: "KEV",      className: "border-red-800/70    bg-red-950/40    text-red-400"     },
  advisory: { label: "ADVISORY", className: "border-amber-800/70  bg-amber-950/40  text-amber-400"   },
  ioc:      { label: "IOC",      className: "border-orange-800/70 bg-orange-950/40 text-orange-400"  },
  news:     { label: "NEWS",     className: "border-zinc-700      bg-zinc-900/50   text-zinc-400"    },
}

const SOURCE_BADGE_COLOR: Record<string, string> = {
  emerald: "text-emerald-400 border-emerald-900/60 bg-emerald-950/30",
  blue:    "text-blue-400    border-blue-900/60    bg-blue-950/30",
  red:     "text-red-400     border-red-900/60     bg-red-950/30",
  orange:  "text-orange-400  border-orange-900/60  bg-orange-950/30",
  yellow:  "text-yellow-400  border-yellow-900/60  bg-yellow-950/30",
  zinc:    "text-zinc-400    border-zinc-800        bg-zinc-900/30",
}

const CATEGORY_ICON: Record<FeedItemCategory, React.ElementType> = {
  kev:      AlertTriangle,
  advisory: Shield,
  ioc:      Wifi,
  news:     Rss,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

function absTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch {
    return iso
  }
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------
const FILTERS: Array<{ key: FeedItemCategory | "all"; label: string }> = [
  { key: "all",      label: "All"      },
  { key: "kev",      label: "KEV"      },
  { key: "advisory", label: "Advisory" },
  { key: "ioc",      label: "IOC"      },
  { key: "news",     label: "News"     },
]

// ---------------------------------------------------------------------------
// Single feed item
// ---------------------------------------------------------------------------
function FeedItem({ item }: { item: SignalFeedItem }) {
  const cat    = CATEGORY_BADGE[item.category]
  const srcClr = SOURCE_BADGE_COLOR[item.sourceBadge] ?? SOURCE_BADGE_COLOR.zinc
  const Icon   = CATEGORY_ICON[item.category]

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-md border border-zinc-800 bg-zinc-950/40 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-950/70"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">

          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Category badge */}
            <span className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
              cat.className
            )}>
              <Icon className="h-2.5 w-2.5 shrink-0" />
              {cat.label}
            </span>

            {/* Source badge */}
            <span className={cn(
              "inline-flex items-center rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest",
              srcClr
            )}>
              {item.source}
            </span>

            {/* CVE chip */}
            {item.cve && (
              <span className="inline-flex items-center rounded border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 font-mono text-[9px] text-zinc-500">
                {item.cve}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition-colors">
            {item.title}
          </h3>

          {/* Summary — only if source provided it */}
          {item.summary && (
            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">
              {item.summary}
            </p>
          )}

          {/* Timestamp */}
          <p className="mt-2 font-mono text-[10px] text-zinc-700" title={absTime(item.publishedAt)}>
            {relativeTime(item.publishedAt)}
          </p>
        </div>

        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition group-hover:text-zinc-400 mt-0.5" />
      </div>
    </a>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface SignalFeedSectionProps {
  initialItems:  SignalFeedItem[]
  fetchedAt:     string
  sourceErrors?: string[]
}

export function SignalFeedSection({ initialItems, fetchedAt, sourceErrors = [] }: SignalFeedSectionProps) {
  const [items,     setItems]     = useState<SignalFeedItem[]>(initialItems)
  const [updatedAt, setUpdatedAt] = useState<string>(fetchedAt)
  const [errors,    setErrors]    = useState<string[]>(sourceErrors)
  const [filter,    setFilter]    = useState<FeedItemCategory | "all">("all")
  const [isPending, startTransition] = useTransition()

  const refresh = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/signal-feed")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: SignalFeedResponse = await res.json()
        setItems(data.items)
        setUpdatedAt(data.fetchedAt)
        setErrors(data.sourceErrors)
      } catch (err) {
        console.error("[SignalFeedSection] refresh failed:", err)
      }
    })
  }, [])

  const visible = filter === "all" ? items : items.filter((i) => i.category === filter)

  return (
    <div className="space-y-4">

      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => {
            const count = key === "all" ? items.length : items.filter(i => i.category === key).length
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors",
                  filter === key
                    ? "border-emerald-800 bg-emerald-950/50 text-emerald-400"
                    : "border-zinc-800 bg-zinc-950/30 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                )}
              >
                {label}
                {count > 0 && (
                  <span className="ml-1.5 text-zinc-700 font-normal">{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Last updated + refresh */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
            updated {relativeTime(updatedAt)}
          </span>
          <button
            onClick={refresh}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-950/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300 disabled:opacity-40"
            aria-label="Refresh feed"
          >
            <RefreshCw className={cn("h-3 w-3", isPending && "animate-spin")} />
            {isPending ? "Fetching…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Source error notices — non-fatal, shown as subtle warnings */}
      {errors.length > 0 && (
        <div className="rounded border border-zinc-800/60 bg-zinc-950/30 px-3 py-2 flex items-start gap-2">
          <AlertTriangle className="h-3 w-3 text-yellow-700 shrink-0 mt-0.5" />
          <p className="font-mono text-[10px] text-zinc-700">
            {errors.length} source{errors.length > 1 ? "s" : ""} unavailable — remaining feeds active.
          </p>
        </div>
      )}

      {/* Feed list */}
      {visible.length === 0 ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-950/30 p-8 text-center">
          <p className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest">
            {isPending ? "Fetching signals…" : "No signals in this category"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((item, i) => (
            <FeedItem key={`${item.url}-${i}`} item={item} />
          ))}
        </div>
      )}

      {/* Source attribution */}
      <p className="font-mono text-[9px] text-zinc-800 uppercase tracking-widest text-center pt-2">
        Sourced from trusted feeds and advisories · CISA · MSRC · ThreatFox · URLhaus · BleepingComputer
      </p>
    </div>
  )
}
