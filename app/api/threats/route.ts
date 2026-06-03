import { NextResponse } from "next/server"
import { geoEnrichMany } from "@/lib/geo"

// =============================================================================
// /api/threats — Cyber Threat IOC Feed  (worldmonitor-style)
// =============================================================================
//
// WHAT CHANGED vs the old route
// -----------------------------
// The old route fabricated a "target" country for every indicator and shipped
// src→tgt pairs so the globe could draw attack ARCS. But these feeds are IOC
// lists (indicators of compromise): a C2 server, a malware host, a phishing
// page. They have a LOCATION, not a direction. Inventing a target makes the
// globe lie about who is attacking whom.
//
// This route returns IOCs honestly — one geo-located point per indicator,
// typed and severity-ranked — exactly like worldmonitor's cyber layer, which
// renders them as color-coded scatter dots (not arcs).
//
// SIX FEEDS (worldmonitor parity) — all free; two need a free key:
//   1. Feodo Tracker  (abuse.ch)      C2 servers            — no key
//   2. URLhaus        (abuse.ch)      malware/malicious URL — no key
//   3. C2IntelFeeds   (community)     C2 servers            — no key
//   4. Ransomware.live                ransomware victims    — no key
//   5. AlienVault OTX                 mixed pulse IOCs       — OTX_API_KEY
//   6. AbuseIPDB                      malicious IPs          — ABUSEIPDB_API_KEY
//
// Geo: IP IOCs are enriched via lib/geo (ipinfo.io → freeipapi.com, 24h cache,
// 16 concurrent, 12s timeout, ≤250/run). Country-only feeds use centroids.
// Display: 14-day rolling window, capped at 500 IOCs, 10-min cache.
// =============================================================================

export type IocType =
  | "c2_server"
  | "malware_host"
  | "phishing"
  | "malicious_url"
  | "ransomware"

export type Severity = "low" | "medium" | "high" | "critical"

export type ThreatIoc = {
  id:        string
  lat:       number
  lng:       number
  country:   string          // ISO-2
  type:      IocType
  severity:  Severity
  source:    string          // which feed produced it
  malware?:  string
  ref?:      string          // ip / url / group name
  firstSeen?:string
  lastSeen?: string
}

// ---------------------------------------------------------------------------
// Country centroids — fallback for country-only feeds (Feodo, Ransomware.live)
// ---------------------------------------------------------------------------
const COORDS: Record<string, { lat: number; lng: number }> = {
  US:{lat:37.09,lng:-95.71}, CN:{lat:35.86,lng:104.19}, RU:{lat:55.75,lng:37.62},
  DE:{lat:52.52,lng:13.40},  GB:{lat:51.50,lng:-0.12},  FR:{lat:48.86,lng:2.35},
  NL:{lat:52.37,lng:4.90},   SG:{lat:1.35,lng:103.82},  JP:{lat:35.68,lng:139.69},
  KR:{lat:37.56,lng:126.97}, IN:{lat:28.61,lng:77.20},  BR:{lat:-15.78,lng:-47.93},
  IR:{lat:35.70,lng:51.42},  KP:{lat:39.03,lng:125.75}, UA:{lat:50.45,lng:30.52},
  TR:{lat:39.92,lng:32.85},  VN:{lat:21.02,lng:105.83}, ID:{lat:-6.21,lng:106.84},
  HK:{lat:22.30,lng:114.17}, TW:{lat:25.04,lng:121.56}, CA:{lat:45.42,lng:-75.69},
  AU:{lat:-33.87,lng:151.21},SA:{lat:24.69,lng:46.72},  RO:{lat:44.43,lng:26.09},
  PL:{lat:52.22,lng:21.01},  SE:{lat:59.33,lng:18.07},  CH:{lat:46.95,lng:7.45},
  ZA:{lat:-25.75,lng:28.19}, NG:{lat:9.07,lng:7.40},    MX:{lat:19.43,lng:-99.13},
  TH:{lat:13.75,lng:100.52}, PK:{lat:33.72,lng:73.06},  EG:{lat:30.06,lng:31.25},
}
const jitter = (n: number) => (Math.random() - 0.5) * n
const centroid = (cc: string) => COORDS[cc] ?? COORDS.US

const IP_RE = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/

// 14-day rolling window
const WINDOW_MS = 14 * 24 * 60 * 60 * 1000
const inWindow = (iso?: string) =>
  !iso || Date.now() - new Date(iso).getTime() < WINDOW_MS

// ---------------------------------------------------------------------------
// 1 · Feodo Tracker — C2 servers (no key)
// ---------------------------------------------------------------------------
async function feodo(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const res = await fetch(
    "https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json",
    { next: { revalidate: 600 } }
  )
  if (!res.ok) throw new Error(`feodo ${res.status}`)
  const list: Array<{ ip_address: string; country: string; malware: string; last_online: string; first_seen: string }> =
    await res.json()
  return list.filter(e => inWindow(e.last_online)).map(e => ({
    ip: e.ip_address,
    ioc: {
      id: `feodo:${e.ip_address}`,
      lat: 0, lng: 0, country: e.country ?? "??",
      type: "c2_server", severity: "high",
      source: "Feodo Tracker", malware: e.malware, ref: e.ip_address,
      firstSeen: e.first_seen, lastSeen: e.last_online,
    },
  }))
}

// ---------------------------------------------------------------------------
// 2 · URLhaus — malware distribution URLs (no key)
// ---------------------------------------------------------------------------
function urlhausType(tags: string[] | null): IocType {
  const f = (tags ?? []).join(",").toLowerCase()
  if (f.includes("phish")) return "phishing"
  if (/mirai|mozi|emotet|qakbot|cobalt|c2/.test(f)) return "c2_server"
  return "malware_host"
}
async function urlhaus(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const res = await fetch("https://urlhaus.abuse.ch/downloads/json_recent/", {
    next: { revalidate: 600 },
  })
  if (!res.ok) throw new Error(`urlhaus ${res.status}`)
  const raw: Record<string, Array<{ dateadded: string; url: string; url_status: string; tags: string[] | null }>> =
    await res.json()
  const out: { ioc: ThreatIoc; ip?: string }[] = []
  for (const arr of Object.values(raw)) {
    for (const e of arr) {
      if (e.url_status !== "online" || !inWindow(e.dateadded)) continue
      const m = e.url.match(IP_RE)
      const host = m?.[1]
      const isIp = Boolean(host)
      out.push({
        ip: host,
        ioc: {
          id: `urlhaus:${e.url}`,
          lat: 0, lng: 0, country: "??",
          type: isIp ? urlhausType(e.tags) : "malicious_url",
          severity: "medium",
          source: "URLhaus", ref: e.url, lastSeen: e.dateadded,
        },
      })
      if (out.length >= 150) return out
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// 3 · C2IntelFeeds — community C2 IPs (no key)
// ---------------------------------------------------------------------------
async function c2intel(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/drb-ra/C2IntelFeeds/master/feeds/IPC2s-30day.csv",
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error(`c2intel ${res.status}`)
  const text = await res.text()
  const rows = text.split("\n").slice(1) // skip header
  const out: { ioc: ThreatIoc; ip?: string }[] = []
  for (const row of rows) {
    const ip = row.split(",")[0]?.trim()
    if (!ip || !IP_RE.test(ip)) continue
    out.push({
      ip,
      ioc: {
        id: `c2intel:${ip}`,
        lat: 0, lng: 0, country: "??",
        type: "c2_server", severity: "high",
        source: "C2IntelFeeds", ref: ip,
      },
    })
    if (out.length >= 120) break
  }
  return out
}

// ---------------------------------------------------------------------------
// 4 · Ransomware.live — recent victims, country-located (no key)
// ---------------------------------------------------------------------------
async function ransomwareLive(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const res = await fetch("https://api.ransomware.live/v2/recentvictims", {
    next: { revalidate: 1800 },
  })
  if (!res.ok) throw new Error(`ransomware.live ${res.status}`)
  const list: Array<{ victim: string; group: string; country: string; discovered: string }> =
    await res.json()
  return list
    .filter(v => v.country && COORDS[v.country] && inWindow(v.discovered))
    .slice(0, 80)
    .map(v => {
      const c = centroid(v.country)
      return {
        ioc: {
          id: `ransom:${v.group}:${v.victim}`,
          lat: c.lat + jitter(3), lng: c.lng + jitter(3),
          country: v.country, type: "ransomware", severity: "critical",
          source: "Ransomware.live", malware: v.group,
          ref: v.victim, lastSeen: v.discovered,
        } as ThreatIoc,
      }
    })
}

// ---------------------------------------------------------------------------
// 5 · AlienVault OTX — pulse IOCs (needs OTX_API_KEY)  [optional]
// ---------------------------------------------------------------------------
async function otx(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const key = process.env.OTX_API_KEY
  if (!key) return []
  const res = await fetch(
    "https://otx.alienvault.com/api/v1/indicators/export?types=IPv4&limit=120",
    { headers: { "X-OTX-API-KEY": key }, next: { revalidate: 900 } }
  )
  if (!res.ok) throw new Error(`otx ${res.status}`)
  const data = await res.json()
  const results: Array<{ indicator: string }> = data.results ?? []
  return results.filter(r => IP_RE.test(r.indicator)).slice(0, 120).map(r => ({
    ip: r.indicator,
    ioc: {
      id: `otx:${r.indicator}`,
      lat: 0, lng: 0, country: "??",
      type: "malware_host", severity: "medium",
      source: "AlienVault OTX", ref: r.indicator,
    },
  }))
}

// ---------------------------------------------------------------------------
// 6 · AbuseIPDB — blacklist (needs ABUSEIPDB_API_KEY)  [optional]
// ---------------------------------------------------------------------------
async function abuseipdb(): Promise<{ ioc: ThreatIoc; ip?: string }[]> {
  const key = process.env.ABUSEIPDB_API_KEY
  if (!key) return []
  const res = await fetch(
    "https://api.abuseipdb.com/api/v2/blacklist?limit=200&confidenceMinimum=90",
    { headers: { Key: key, Accept: "application/json" }, next: { revalidate: 900 } }
  )
  if (!res.ok) throw new Error(`abuseipdb ${res.status}`)
  const data = await res.json()
  const list: Array<{ ipAddress: string; countryCode: string; abuseConfidenceScore: number }> =
    data.data ?? []
  return list.slice(0, 200).map(e => ({
    ip: e.ipAddress,
    ioc: {
      id: `abuseipdb:${e.ipAddress}`,
      lat: 0, lng: 0, country: e.countryCode ?? "??",
      type: "malware_host",
      severity: e.abuseConfidenceScore >= 99 ? "high" : "medium",
      source: "AbuseIPDB", ref: e.ipAddress,
    },
  }))
}

// ---------------------------------------------------------------------------
// Route handler — collect → geo-enrich IP IOCs → merge → cap
// ---------------------------------------------------------------------------
export async function GET() {
  const feeds = await Promise.allSettled([
    feodo(), urlhaus(), c2intel(), ransomwareLive(), otx(), abuseipdb(),
  ])

  const collected: { ioc: ThreatIoc; ip?: string }[] = []
  const sources: string[] = []
  feeds.forEach((r, i) => {
    const name = ["Feodo","URLhaus","C2IntelFeeds","Ransomware.live","OTX","AbuseIPDB"][i]
    if (r.status === "fulfilled" && r.value.length) { collected.push(...r.value); sources.push(name) }
    else if (r.status === "rejected") console.error(`[/api/threats] ${name} failed:`, r.reason?.message)
  })

  // Geo-enrich every IP-based IOC (country-only IOCs already have coords)
  const ips = collected.map(c => c.ip).filter((x): x is string => Boolean(x))
  const geo = await geoEnrichMany(ips)

  const iocs: ThreatIoc[] = []
  for (const { ioc, ip } of collected) {
    if (ip) {
      const g = geo.get(ip)
      if (!g) continue                       // drop IOCs we couldn't locate
      ioc.lat = g.lat + jitter(1.5)
      ioc.lng = g.lng + jitter(1.5)
      ioc.country = ioc.country === "??" ? g.country : ioc.country
    } else if (ioc.lat === 0 && ioc.lng === 0) {
      continue
    }
    iocs.push(ioc)
  }

  // de-dupe by id, cap at 500 (worldmonitor's render cap)
  const seen = new Set<string>()
  const deduped = iocs.filter(i => !seen.has(i.id) && seen.add(i.id)).slice(0, 500)

  // graceful fallback if every live feed was down
  if (deduped.length === 0) {
    return NextResponse.json(
      { iocs: [], source: "none", generatedAt: new Date().toISOString(),
        note: "all upstream feeds unavailable" },
      { headers: { "Cache-Control": "public, max-age=30" } }
    )
  }

  return NextResponse.json(
    { iocs: deduped, count: deduped.length, sources, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=120" } }
  )
}
