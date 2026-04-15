/**
 * SIGNAL FEED — Source Fetchers
 *
 * Each function fetches one approved external source, normalizes the response
 * to SignalFeedItem[], and catches its own errors so one failure doesn't take
 * down the whole feed.
 *
 * To add a new source: implement a function matching SourceResult, add it to
 * the SOURCES export, and add the domain to SOURCE_ALLOWLIST in types.ts.
 */

import type { SignalFeedItem } from "./types"

export interface SourceResult {
  items:  SignalFeedItem[]
  error?: string  // Non-fatal — present when the source partially or fully failed
}

// ---------------------------------------------------------------------------
// Minimal dependency-free RSS 2.0 / Atom parser
// ---------------------------------------------------------------------------
function rssText(block: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(
    `<${escaped}(?:\\s[^>]*)?>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*<\\/${escaped}>`,
    "i"
  )
  const m = block.match(re)
  if (!m) return ""
  return decodeEntities(m[1].trim())
}

function rssLink(block: string): string {
  // Atom: <link href="URL" /> or <link rel="alternate" href="URL" />
  const atom =
    block.match(/<(?:atom:)?link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["'][^>]*\/?>/i) ||
    block.match(/<(?:atom:)?link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)
  if (atom?.[1]?.startsWith("http")) return atom[1]

  // RSS 2.0: <link>URL</link>
  const text = rssText(block, "link")
  if (text.startsWith("http")) return text

  // Fallback: <guid isPermaLink="true">URL</guid>
  const guid = rssText(block, "guid")
  if (guid.startsWith("http")) return guid

  return ""
}

function rssItems(xml: string): Array<{ title: string; link: string; pubDate: string; description?: string }> {
  const out: Array<{ title: string; link: string; pubDate: string; description?: string }> = []
  const re = /<item[^>]*>([\s\S]*?)<\/item>|<entry[^>]*>([\s\S]*?)<\/entry>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    const b = m[1] ?? m[2]
    if (!b) continue
    const title   = rssText(b, "title")
    const link    = rssLink(b)
    const pubDate =
      rssText(b, "pubDate") ||
      rssText(b, "published") ||
      rssText(b, "updated") ||
      rssText(b, "dc:date")
    const description =
      rssText(b, "description") ||
      rssText(b, "summary") ||
      rssText(b, "content") || undefined
    if (title && link && pubDate) {
      out.push({ title, link, pubDate, description })
    }
  }
  return out
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)))
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200)
}

function safeDate(s: string): string | null {
  try {
    const d = new Date(s)
    if (isNaN(d.getTime())) return null
    return d.toISOString()
  } catch {
    return null
  }
}

/** Parse "2025-04-08 10:00:00 UTC" → ISO */
function abuseDate(s: string): string | null {
  return safeDate(s.replace(" UTC", "Z").replace(" ", "T"))
}

// ---------------------------------------------------------------------------
// 1. CISA Cybersecurity Advisories (RSS)
// ---------------------------------------------------------------------------
export async function fetchCisaAdvisories(): Promise<SourceResult> {
  try {
    const res = await fetch(
      "https://www.cisa.gov/cybersecurity-advisories/all.xml",
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error(`CISA RSS ${res.status}`)
    const xml   = await res.text()
    const parsed = rssItems(xml)

    const items: SignalFeedItem[] = parsed.slice(0, 15).flatMap(({ title, link, pubDate, description }) => {
      const publishedAt = safeDate(pubDate)
      if (!publishedAt) return []
      const item: SignalFeedItem = {
        url:          link,
        title:        title.trim(),
        source:       "CISA Advisory",
        sourceDomain: "cisa.gov",
        sourceBadge:  "emerald",
        publishedAt,
        category:     "advisory",
      }
      if (description) {
        const clean = stripHtml(description)
        if (clean.length > 20) item.summary = clean
      }
      return [item]
    })

    return { items }
  } catch (err) {
    console.error("[signal-feed] CISA advisories:", err)
    return { items: [], error: "CISA Advisories unavailable" }
  }
}

// ---------------------------------------------------------------------------
// 2. CISA Known Exploited Vulnerabilities (KEV)
// ---------------------------------------------------------------------------
interface KevEntry {
  cveID:             string
  vendorProject:     string
  product:           string
  vulnerabilityName: string
  dateAdded:         string
  shortDescription:  string
}

export async function fetchCisaKev(): Promise<SourceResult> {
  try {
    const res = await fetch(
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
      { next: { revalidate: 1800 } }  // 30 min — KEV updates daily
    )
    if (!res.ok) throw new Error(`CISA KEV ${res.status}`)
    const data: { vulnerabilities: KevEntry[] } = await res.json()

    // Sort by dateAdded desc, take 20 most recent
    const sorted = [...data.vulnerabilities]
      .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
      .slice(0, 20)

    const items: SignalFeedItem[] = sorted.flatMap((v) => {
      const publishedAt = safeDate(v.dateAdded + "T00:00:00Z")
      if (!publishedAt) return []
      const item: SignalFeedItem = {
        url:          `https://nvd.nist.gov/vuln/detail/${v.cveID}`,
        title:        v.vulnerabilityName,
        source:       "CISA KEV",
        sourceDomain: "cisa.gov",
        sourceBadge:  "emerald",
        publishedAt,
        category:     "kev",
        cve:          v.cveID,
      }
      if (v.shortDescription?.length > 20) {
        item.summary = v.shortDescription.slice(0, 200)
      }
      return [item]
    })

    return { items }
  } catch (err) {
    console.error("[signal-feed] CISA KEV:", err)
    return { items: [], error: "CISA KEV unavailable" }
  }
}

// ---------------------------------------------------------------------------
// 3. Microsoft Security Response Center (MSRC)
// ---------------------------------------------------------------------------
interface MsrcUpdate {
  ID:                  string
  Alias:               string
  DocumentTitle:       string
  InitialReleaseDate:  string
  CurrentReleaseDate:  string
}

export async function fetchMsrc(): Promise<SourceResult> {
  try {
    const res = await fetch(
      "https://api.msrc.microsoft.com/cvrf/v2.0/Updates",
      { next: { revalidate: 3600 } }  // 1 hr — patch Tuesday monthly
    )
    if (!res.ok) throw new Error(`MSRC ${res.status}`)
    const data: { value: MsrcUpdate[] } = await res.json()

    // Most recent 5 updates
    const recent = [...data.value]
      .sort((a, b) => b.CurrentReleaseDate.localeCompare(a.CurrentReleaseDate))
      .slice(0, 5)

    const items: SignalFeedItem[] = recent.flatMap((u) => {
      const publishedAt = safeDate(u.CurrentReleaseDate)
      if (!publishedAt) return []
      return [{
        url:          `https://msrc.microsoft.com/update-guide/releaseNote/${u.ID}`,
        title:        u.DocumentTitle,
        source:       "MSRC",
        sourceDomain: "msrc.microsoft.com",
        sourceBadge:  "blue",
        publishedAt,
        category:     "advisory" as const,
      }]
    })

    return { items }
  } catch (err) {
    console.error("[signal-feed] MSRC:", err)
    return { items: [], error: "MSRC unavailable" }
  }
}

// ---------------------------------------------------------------------------
// 4. ThreatFox — Malware IOC feed (Abuse.ch)
// ---------------------------------------------------------------------------
interface ThreatFoxIoc {
  id:                string
  ioc:               string
  threat_type:       string
  threat_type_desc:  string
  ioc_type:          string
  ioc_type_desc:     string
  malware:           string
  malware_printable: string
  confidence_level:  number
  first_seen:        string
  last_seen:         string | null
  reporter:          string
}

export async function fetchThreatFox(): Promise<SourceResult> {
  try {
    const res = await fetch("https://threatfox-api.abuse.ch/api/v1/", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ query: "get_iocs", days: 1 }),
      next:    { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`ThreatFox ${res.status}`)
    const data: { query_status: string; data: ThreatFoxIoc[] } = await res.json()
    if (data.query_status !== "ok" || !Array.isArray(data.data)) {
      return { items: [], error: "ThreatFox: no data" }
    }

    const items: SignalFeedItem[] = data.data
      .filter((ioc) => ioc.confidence_level >= 75)
      .slice(0, 15)
      .flatMap((ioc) => {
        const publishedAt = abuseDate(ioc.first_seen)
        if (!publishedAt) return []
        const title = `${ioc.malware_printable} — ${ioc.ioc_type_desc}`
        return [{
          url:          `https://threatfox.abuse.ch/ioc/${ioc.id}/`,
          title,
          source:       "ThreatFox",
          sourceDomain: "threatfox.abuse.ch",
          sourceBadge:  "red",
          publishedAt,
          category:     "ioc" as const,
        }]
      })

    return { items }
  } catch (err) {
    console.error("[signal-feed] ThreatFox:", err)
    return { items: [], error: "ThreatFox unavailable" }
  }
}

// ---------------------------------------------------------------------------
// 5. URLhaus — Malicious URL feed (Abuse.ch)
// ---------------------------------------------------------------------------
interface URLhausEntry {
  id:          string
  url_status:  string
  dateadded:   string
  url:         string
  threat:      string
  tags:        string[] | null
}

export async function fetchUrlhaus(): Promise<SourceResult> {
  try {
    const res = await fetch("https://urlhaus-api.abuse.ch/v1/urls/recent/", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    "limit=20",
      next:    { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`URLhaus ${res.status}`)
    const data: { query_status: string; urls: URLhausEntry[] } = await res.json()
    if (data.query_status !== "ok" || !Array.isArray(data.urls)) {
      return { items: [], error: "URLhaus: no data" }
    }

    const items: SignalFeedItem[] = data.urls
      .filter((u) => u.url_status === "online")
      .slice(0, 10)
      .flatMap((u) => {
        const publishedAt = abuseDate(u.dateadded)
        if (!publishedAt) return []
        // Extract hostname from malicious URL for safe display
        let hostname = u.url
        try { hostname = new URL(u.url).hostname } catch { /* keep raw */ }
        const title = `${u.threat} · ${hostname}`
        return [{
          url:          `https://urlhaus.abuse.ch/url/${u.id}/`,
          title,
          source:       "URLhaus",
          sourceDomain: "urlhaus.abuse.ch",
          sourceBadge:  "orange",
          publishedAt,
          category:     "ioc" as const,
        }]
      })

    return { items }
  } catch (err) {
    console.error("[signal-feed] URLhaus:", err)
    return { items: [], error: "URLhaus unavailable" }
  }
}

// ---------------------------------------------------------------------------
// 6. BleepingComputer — Cybersecurity news (RSS)
// ---------------------------------------------------------------------------
export async function fetchBleepingcomputer(): Promise<SourceResult> {
  try {
    const res = await fetch(
      "https://www.bleepingcomputer.com/feed/",
      { next: { revalidate: 600 } }  // 10 min
    )
    if (!res.ok) throw new Error(`BleepingComputer RSS ${res.status}`)
    const xml    = await res.text()
    const parsed = rssItems(xml)

    const items: SignalFeedItem[] = parsed.slice(0, 10).flatMap(({ title, link, pubDate, description }) => {
      const publishedAt = safeDate(pubDate)
      if (!publishedAt) return []
      const item: SignalFeedItem = {
        url:          link,
        title:        title.trim(),
        source:       "BleepingComputer",
        sourceDomain: "bleepingcomputer.com",
        sourceBadge:  "yellow",
        publishedAt,
        category:     "news",
      }
      if (description) {
        const clean = stripHtml(description)
        if (clean.length > 20) item.summary = clean
      }
      return [item]
    })

    return { items }
  } catch (err) {
    console.error("[signal-feed] BleepingComputer:", err)
    return { items: [], error: "BleepingComputer unavailable" }
  }
}

// ---------------------------------------------------------------------------
// Source registry — add new sources here
// ---------------------------------------------------------------------------
export const SOURCES: Array<{ label: string; fn: () => Promise<SourceResult> }> = [
  { label: "CISA Advisories", fn: fetchCisaAdvisories   },
  { label: "CISA KEV",        fn: fetchCisaKev           },
  { label: "MSRC",            fn: fetchMsrc              },
  { label: "ThreatFox",       fn: fetchThreatFox         },
  { label: "URLhaus",         fn: fetchUrlhaus           },
  { label: "BleepingComputer",fn: fetchBleepingcomputer  },
]
