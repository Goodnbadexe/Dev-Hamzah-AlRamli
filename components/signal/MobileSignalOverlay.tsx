"use client"

/**
 * MobileSignalOverlay
 *
 * Full-screen overlay shown on mobile when globe inspect mode is active.
 * Hides all page content and displays only SIGNAL.FEED — live cyber threat
 * intelligence pulled from /api/signal-feed.
 *
 * Auto-refreshes every 60 s. Manual refresh + close controls included.
 * "Get updates" prompt is shown until the user dismisses it.
 */

import { useEffect, useState, useCallback, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { X, RefreshCw, Radio, ExternalLink, AlertTriangle, Bell, BellOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SignalFeedItem, FeedItemCategory, SignalFeedResponse } from "@/lib/signal-feed/types"

// ---------------------------------------------------------------------------
// Styling helpers
// ---------------------------------------------------------------------------
const CAT_DOT: Record<FeedItemCategory, string> = {
  kev:      "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]",
  advisory: "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.7)]",
  ioc:      "bg-orange-500",
  news:     "bg-zinc-600",
}

const CAT_LABEL: Record<FeedItemCategory, string> = {
  kev:      "KEV",
  advisory: "ADVISORY",
  ioc:      "IOC",
  news:     "NEWS",
}

const CAT_TEXT: Record<FeedItemCategory, string> = {
  kev:      "text-red-400",
  advisory: "text-amber-400",
  ioc:      "text-orange-400",
  news:     "text-zinc-400",
}

function relativeTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

// ---------------------------------------------------------------------------
// Compact item row for mobile list
// ---------------------------------------------------------------------------
function MobileItem({ item }: { item: SignalFeedItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-md border border-zinc-800/70 bg-zinc-950/60 px-3 py-3 transition hover:border-zinc-700 hover:bg-zinc-900/70 active:bg-zinc-900"
    >
      {/* Severity dot */}
      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", CAT_DOT[item.category])} />

      <div className="min-w-0 flex-1">
        {/* Source + category */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className={cn("font-mono text-[9px] uppercase tracking-widest font-semibold", CAT_TEXT[item.category])}>
            {CAT_LABEL[item.category]}
          </span>
          <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
            · {item.source}
          </span>
          {item.cve && (
            <span className="font-mono text-[9px] text-zinc-700 truncate">{item.cve}</span>
          )}
        </div>

        {/* Title */}
        <p className="text-xs text-zinc-300 leading-snug group-hover:text-zinc-100 transition-colors line-clamp-2">
          {item.title}
        </p>

        {/* Time */}
        <p className="mt-1 font-mono text-[9px] text-zinc-700">
          {relativeTime(item.publishedAt)}
        </p>
      </div>

      <ExternalLink className="h-3 w-3 shrink-0 text-zinc-800 group-hover:text-zinc-500 mt-1 transition-colors" />
    </a>
  )
}

// ---------------------------------------------------------------------------
// Main overlay
// ---------------------------------------------------------------------------
interface MobileSignalOverlayProps {
  onClose: () => void
}

export function MobileSignalOverlay({ onClose }: MobileSignalOverlayProps) {
  const [items,       setItems]       = useState<SignalFeedItem[]>([])
  const [fetchedAt,   setFetchedAt]   = useState<string>("")
  const [loading,     setLoading]     = useState(true)
  const [refreshing,  setRefreshing]  = useState(false)
  const [errors,      setErrors]      = useState<string[]>([])
  const [subscribed,  setSubscribed]  = useState(false)
  const [showPrompt,  setShowPrompt]  = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch("/api/signal-feed")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: SignalFeedResponse = await res.json()
      setItems(data.items)
      setFetchedAt(data.fetchedAt)
      setErrors(data.sourceErrors)
    } catch (err) {
      console.error("[MobileSignalOverlay] fetch failed:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    load()
  }, [load])

  // Auto-refresh when subscribed
  useEffect(() => {
    if (!subscribed) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => load(true), 60_000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [subscribed, load])

  function handleSubscribe() {
    setSubscribed(true)
    setShowPrompt(false)
  }

  function handleDismissPrompt() {
    setShowPrompt(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-950/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Radio className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-mono text-sm font-semibold text-emerald-500 uppercase tracking-widest">
            SIGNAL.FEED
          </span>
          <span className="h-3 w-px bg-zinc-800 shrink-0" />
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest truncate">
            Cyber Intelligence
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Subscription indicator */}
          {subscribed && (
            <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-700 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AUTO
            </span>
          )}

          {/* Manual refresh */}
          <button
            onClick={() => load(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 rounded border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw className={cn("h-3 w-3", refreshing && "animate-spin")} />
          </button>

          {/* Close — exits globe inspect */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
            aria-label="Close signal feed"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* "Get updates" prompt */}
      {showPrompt && !subscribed && (
        <div className="shrink-0 border-b border-zinc-800/60 bg-emerald-950/20 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Bell className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <p className="font-mono text-[10px] text-emerald-400 leading-relaxed">
              Would you like auto-updates every 60s?
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSubscribe}
              className="rounded border border-emerald-800 bg-emerald-950/50 px-3 py-1.5 font-mono text-[10px] text-emerald-400 uppercase tracking-widest transition hover:bg-emerald-950/80"
            >
              Yes
            </button>
            <button
              onClick={handleDismissPrompt}
              className="rounded border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-600 transition hover:text-zinc-400"
            >
              <BellOff className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {!loading && items.length > 0 && (
        <div className="shrink-0 border-b border-zinc-900/60 px-4 py-2 flex items-center gap-4">
          {(["kev", "advisory", "ioc", "news"] as FeedItemCategory[]).map((cat) => {
            const count = items.filter(i => i.category === cat).length
            if (count === 0) return null
            return (
              <span key={cat} className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", CAT_DOT[cat])} />
                <span className={cn("font-mono text-[9px] uppercase tracking-widest", CAT_TEXT[cat])}>
                  {count} {CAT_LABEL[cat]}
                </span>
              </span>
            )
          })}
          <span className="ml-auto font-mono text-[9px] text-zinc-700">
            {fetchedAt ? relativeTime(fetchedAt) : ""}
          </span>
        </div>
      )}

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <RefreshCw className="h-5 w-5 text-zinc-700 animate-spin" />
            <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
              Loading signals…
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <AlertTriangle className="h-5 w-5 text-zinc-700" />
            <p className="font-mono text-[11px] text-zinc-600 uppercase tracking-widest">
              No signals available
            </p>
            <p className="font-mono text-[10px] text-zinc-800">
              {errors.length > 0 ? `${errors.length} source(s) unreachable` : "Check back shortly"}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {items.map((item, i) => (
              <MobileItem key={`${item.url}-${i}`} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-zinc-900/60 px-4 py-2 text-center">
        <p className="font-mono text-[9px] text-zinc-800 uppercase tracking-widest">
          CISA · MSRC · ThreatFox · URLhaus · BleepingComputer
        </p>
      </div>
    </div>
  )
}
