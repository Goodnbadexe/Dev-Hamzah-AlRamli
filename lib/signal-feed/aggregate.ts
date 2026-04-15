/**
 * SIGNAL FEED — Aggregation, Deduplication & Validation
 *
 * Runs all source fetchers in parallel, validates each item, deduplicates
 * across sources, then sorts by priority (KEV first) then by date.
 *
 * Rules enforced here:
 *  1. URL must be https:// and non-empty
 *  2. Title must be non-empty
 *  3. publishedAt must parse to a valid Date
 *  4. Dedup: canonical URL → normalized title → CVE
 *  5. Order: category priority (0=kev, 1=advisory, 2=ioc, 3=news) then newest first
 */

import { SOURCES } from "./sources"
import { CATEGORY_PRIORITY } from "./types"
import type { SignalFeedItem, SignalFeedResponse } from "./types"

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function isValidUrl(url: string): boolean {
  if (!url.startsWith("https://")) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidItem(item: SignalFeedItem): boolean {
  if (!item.title?.trim()) return false
  if (!isValidUrl(item.url)) return false
  if (isNaN(new Date(item.publishedAt).getTime())) return false
  return true
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    // Drop trailing slash, remove query params and hash for dedup purposes
    return (u.origin + u.pathname).toLowerCase().replace(/\/$/, "")
  } catch {
    return url.toLowerCase()
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function dedup(items: SignalFeedItem[]): SignalFeedItem[] {
  const seenUrl   = new Set<string>()
  const seenTitle = new Set<string>()
  const seenCve   = new Set<string>()

  return items.filter((item) => {
    const normUrl   = normalizeUrl(item.url)
    const normTitle = normalizeTitle(item.title)

    // URL dedup — unless the URL is the KEV catalog (shared across all KEV items)
    // KEV items are differentiated by CVE instead
    if (!item.cve && seenUrl.has(normUrl)) return false
    if (!item.cve) seenUrl.add(normUrl)

    // Title dedup
    if (seenTitle.has(normTitle)) return false
    seenTitle.add(normTitle)

    // CVE dedup — cross-source (e.g. CISA advisory + KEV for same CVE)
    if (item.cve) {
      const normCve = item.cve.toUpperCase()
      // KEV takes priority — if already seen this CVE from another source, skip
      // If this IS the KEV entry and we saw it from advisory, keep KEV
      if (seenCve.has(normCve) && item.category !== "kev") return false
      seenCve.add(normCve)
    }

    return true
  })
}

// ---------------------------------------------------------------------------
// Sort
// ---------------------------------------------------------------------------
function sort(items: SignalFeedItem[]): SignalFeedItem[] {
  return [...items].sort((a, b) => {
    const pA = CATEGORY_PRIORITY[a.category]
    const pB = CATEGORY_PRIORITY[b.category]
    if (pA !== pB) return pA - pB
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
}

// ---------------------------------------------------------------------------
// Main aggregator — run all sources in parallel
// ---------------------------------------------------------------------------
export async function aggregateSignalFeed(): Promise<SignalFeedResponse> {
  const results = await Promise.allSettled(
    SOURCES.map((s) => s.fn())
  )

  const allItems: SignalFeedItem[]  = []
  const sourceErrors: string[]      = []

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      allItems.push(...result.value.items)
      if (result.value.error) sourceErrors.push(result.value.error)
    } else {
      const label = SOURCES[i]?.label ?? `source[${i}]`
      sourceErrors.push(`${label}: ${String(result.reason)}`)
      console.error(`[signal-feed] ${label} rejected:`, result.reason)
    }
  })

  const valid   = allItems.filter(isValidItem)
  const unique  = dedup(valid)
  const ordered = sort(unique)

  return {
    items:        ordered,
    fetchedAt:    new Date().toISOString(),
    sourceErrors,
  }
}
