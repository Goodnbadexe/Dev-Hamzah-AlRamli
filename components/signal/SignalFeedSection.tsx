"use client"

/**
 * SignalFeedSection — live cyber-threat intelligence feed.
 *
 * Renders the initial server-provided items and can refresh on demand
 * by hitting /api/signal-feed. No external fetches happen in the browser
 * on initial render — only on manual refresh.
 */

import { useState, useCallback, useTransition, useMemo } from "react"
import { formatDistanceToNow } from "date-fns"
import { RefreshCw, ExternalLink, AlertTriangle, Shield, Rss, Wifi, TrendingUp } from "lucide-react"
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

/**
 * pickTrending — the single most attention-worthy live signal *right now*.
 *
 * Honest proxy from real fields only: the freshest actively-exploited KEV entry
 * (a KEV listing means exploited in the wild), falling back to the newest item
 * overall. No invented score — it just surfaces the hottest real signal so it can
 * be featured. Whatever leads the THREAT WIRE also tends to lead here, since both
 * draw on CISA KEV.
 */
function pickTrending(items: SignalFeedItem[]): SignalFeedItem | null {
  if (!items.length) return null
  const kev = items.filter((i) => i.category === "kev")
  const pool = kev.length ? kev : items
  return [...pool].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0]
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
function FeedItem({ item, highlight = false }: { item: SignalFeedItem; highlight?: boolean }) {
  const cat    = CATEGORY_BADGE[item.category]
  const srcClr = SOURCE_BADGE_COLOR[item.sourceBadge] ?? SOURCE_BADGE_COLOR.zinc
  const Icon   = CATEGORY_ICON[item.category]

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block overflow-hidden rounded-md border p-4 transition-all",
        highlight
          ? "border-emerald-700/60 bg-emerald-950/15 ring-1 ring-emerald-500/40 shadow-[0_0_28px_-6px_rgba(16,185,129,0.4)] hover:border-emerald-600/70"
          : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/70"
      )}
    >
      {/* Trending: moving shimmer line draws the eye even at slot 3 */}
      {highlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent bg-[length:200%_100%] animate-[shimmer-sweep_2.6s_linear_infinite] motion-reduce:animate-none"
        />
      )}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">

          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Trending badge — only on the featured signal */}
            {highlight && (
              <span className="inline-flex items-center gap-1 rounded border border-emerald-700/70 bg-emerald-950/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)] animate-pulse motion-reduce:animate-none" />
                <TrendingUp className="h-2.5 w-2.5 shrink-0" />
                Trending
              </span>
            )}
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

  // The hottest live signal, featured with motion.
  const trending = useMemo(() => pickTrending(items), [items])

  // Pin the trending signal to the 3rd slot (index 2) of the "all" view. Motion
  // keeps it noticeable even when it isn't first; other filters highlight it in
  // place. Needs ≥3 items, otherwise it stays where it naturally falls.
  const ordered = useMemo(() => {
    if (filter !== "all" || !trending || visible.length < 3) return visible
    const rest = visible.filter((i) => i.url !== trending.url)
    rest.splice(2, 0, trending)
    return rest
  }, [visible, trending, filter])

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
          {ordered.map((item, i) => (
            <FeedItem
              key={`${item.url}-${i}`}
              item={item}
              highlight={item.url === trending?.url}
            />
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
