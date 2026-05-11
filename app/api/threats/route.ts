import { NextResponse } from "next/server"

// =============================================================================
// /api/threats — Cyber Threat Feed
// =============================================================================
//
// Currently runs on a synthetic OSINT feed that looks and behaves like real
// threat data. Seeded per 30-second window so it "refreshes" on every poll.
//
// UPGRADING TO REAL DATA — free options, no payment needed:
//
//  1. Feodo Tracker (Abuse.ch) — COMPLETELY FREE, no account needed
//     https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json
//     Returns ~300 active botnet C2 servers with country_code.
//     Set env var:  FEODO_ENABLED=true  (no API key needed)
//
//  2. AlienVault OTX — FREE community tier, just register at otx.alienvault.com
//     Great geo data, attack indicators, CVE tagging.
//     Set env var:  OTX_API_KEY=your_key_here
//
//  3. AbuseIPDB — FREE tier: 1000 checks/day
//     Returns reported malicious IPs with country codes.
//     Set env var:  ABUSEIPDB_API_KEY=your_key_here
//
//  4. ip-api.com — COMPLETELY FREE (HTTP only), no key, 45 req/min
//     Geolocation for any IP. Use this to turn any IP list into coordinates.
//     No env var needed — just call https://ip-api.com/json/{ip}
//
// GreyNoise integration is commented out below — their free tier restricts
// the GNQL endpoint to paid plans. Uncomment if you upgrade.
//
// =============================================================================

export type ThreatEvent = {
  id:         string
  srcLat:     number
  srcLng:     number
  tgtLat:     number
  tgtLng:     number
  srcCountry: string
  tgtCountry: string
  type:       string
  count:      number
  severity:   "low" | "medium" | "high" | "critical"
  timestamp:  string
}

// ---------------------------------------------------------------------------
// Country centroids — 35 nodes
// ---------------------------------------------------------------------------
const COORDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 37.09,  lng: -95.71 }, CN: { lat: 35.86, lng: 104.19 },
  RU: { lat: 55.75,  lng: 37.62  }, DE: { lat: 52.52, lng: 13.40  },
  UK: { lat: 51.50,  lng: -0.12  }, GB: { lat: 51.50, lng: -0.12  },
  FR: { lat: 48.86,  lng: 2.35   }, SG: { lat: 1.35,  lng: 103.82 },
  JP: { lat: 35.68,  lng: 139.69 }, AU: { lat: -33.87,lng: 151.21 },
  CA: { lat: 45.42,  lng: -75.69 }, IN: { lat: 28.61, lng: 77.20  },
  NL: { lat: 52.37,  lng: 4.90   }, IR: { lat: 35.70, lng: 51.42  },
  KP: { lat: 39.03,  lng: 125.75 }, BR: { lat: -15.78,lng: -47.93 },
  UA: { lat: 50.45,  lng: 30.52  }, NG: { lat: 9.07,  lng: 7.40   },
  ZA: { lat: -25.75, lng: 28.19  }, KR: { lat: 37.56, lng: 126.97 },
  SA: { lat: 24.69,  lng: 46.72  }, TR: { lat: 39.92, lng: 32.85  },
  ID: { lat: -6.21,  lng: 106.84 }, MX: { lat: 19.43, lng: -99.13 },
  AR: { lat: -34.60, lng: -58.38 }, PL: { lat: 52.22, lng: 21.01  },
  RO: { lat: 44.43,  lng: 26.09  }, VN: { lat: 21.02, lng: 105.83 },
  TW: { lat: 25.04,  lng: 121.56 }, HK: { lat: 22.30, lng: 114.17 },
  SE: { lat: 59.33,  lng: 18.07  }, CH: { lat: 46.95, lng: 7.45   },
  EG: { lat: 30.06,  lng: 31.25  }, PK: { lat: 33.72, lng: 73.06  },
  TH: { lat: 13.75,  lng: 100.52 },
}

const SOURCES  = ["CN","RU","IR","KP","BR","NG","UA","TR","RO","VN","PK","ID"]
const TARGETS  = ["US","DE","UK","SG","JP","AU","FR","CA","IN","KR","NL","SA","TW","SE"]
const TYPES    = ["DDoS","Bruteforce","Ransomware","SQLi","RCE","Recon","Phishing","PortScan"]

// ---------------------------------------------------------------------------
// Synthetic feed — seeded per 30-second window, loops endlessly
// ---------------------------------------------------------------------------
function rng(n: number) { const x = Math.sin(n) * 10000; return x - Math.floor(x) }

function synthetic(seed: number, count = 40): ThreatEvent[] {
  return Array.from({ length: count }, (_, i) => {
    const s   = seed + i * 7
    const src = SOURCES[Math.floor(rng(s + 1) * SOURCES.length)]
    let   tgt = TARGETS[Math.floor(rng(s + 2) * TARGETS.length)]
    if (tgt === src) tgt = TARGETS[(Math.floor(rng(s + 3) * TARGETS.length) + 1) % TARGETS.length]

    const sc  = COORDS[src] ?? { lat: 0, lng: 0 }
    const tc  = COORDS[tgt] ?? COORDS.US
    const typ = TYPES[Math.floor(rng(s + 4) * TYPES.length)]
    const cnt = Math.floor(rng(s + 5) * 9800) + 200
    const sev = cnt > 7000 ? "critical" : cnt > 4000 ? "high" : cnt > 1500 ? "medium" : "low"
    const ago = Math.floor(rng(s + 6) * 900)

    return {
      id:         `syn-${src}-${tgt}-${i}-${seed}`,
      srcLat:     sc.lat + (rng(s + 10) - 0.5) * 4,
      srcLng:     sc.lng + (rng(s + 11) - 0.5) * 4,
      tgtLat:     tc.lat + (rng(s + 12) - 0.5) * 4,
      tgtLng:     tc.lng + (rng(s + 13) - 0.5) * 4,
      srcCountry: src,
      tgtCountry: tgt,
      type:       typ,
      count:      cnt,
      severity:   sev as ThreatEvent["severity"],
      timestamp:  new Date(Date.now() - ago * 1000).toISOString(),
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// ---------------------------------------------------------------------------
// Feodo Tracker (Abuse.ch) — FREE real botnet C2 data, no API key
// Always enabled — falls back to synthetic if fetch fails
// ---------------------------------------------------------------------------
async function fetchFeodo(): Promise<ThreatEvent[]> {
  const res = await fetch(
    "https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.json",
    { next: { revalidate: 300 } } // 5-min cache — Feodo updates hourly
  )
  if (!res.ok) throw new Error(`Feodo ${res.status}`)
  const list: Array<{ ip_address: string; country: string; first_seen: string; last_online: string }> = await res.json()

  const seed = Math.floor(Date.now() / 30_000)
  return list.slice(0, 40).map((entry, i) => {
    const srcCode = entry.country ?? "CN"
    const src     = COORDS[srcCode] ?? { lat: 0, lng: 0 }
    let tgtCode = TARGETS[(i + 3) % TARGETS.length]
    if (tgtCode === srcCode) {
      tgtCode = TARGETS[(i + 7) % TARGETS.length]
    }
    const tgt     = COORDS[tgtCode]!
    // Vary the attack type based on list position + seed for visual diversity
    const typ     = TYPES[(i + seed) % TYPES.length]
    const cnt     = Math.floor(rng(seed + i) * 2000) + 50
    const sev: ThreatEvent["severity"] = cnt > 1500 ? "high" : cnt > 800 ? "medium" : "low"
    return {
      id:         `feodo-${entry.ip_address}`,
      srcLat:     src.lat + (rng(seed + i * 3) - 0.5) * 3,
      srcLng:     src.lng + (rng(seed + i * 5) - 0.5) * 3,
      tgtLat:     tgt.lat + (rng(seed + i * 7) - 0.5) * 3,
      tgtLng:     tgt.lng + (rng(seed + i * 9) - 0.5) * 3,
      srcCountry: srcCode,
      tgtCountry: tgtCode,
      type:       typ,
      count:      cnt,
      severity:   sev,
      timestamp:  entry.last_online ?? new Date().toISOString(),
    }
  })
}

// ---------------------------------------------------------------------------
// URLhaus (Abuse.ch) — FREE, ~29k recent malware URLs with hostname/IP, no key
// Uses ip-api.com batch endpoint to geolocate (free, 100 IPs/call, 15 req/min)
// ---------------------------------------------------------------------------
const URLHAUS_URL = "https://urlhaus.abuse.ch/downloads/json_recent/"
const IP_API_BATCH = "http://ip-api.com/batch"

const IP_RE = /^https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?/i

interface UrlhausEntry {
  dateadded: string
  url: string
  url_status: string
  threat: string
  tags: string[] | null
}

function tagToType(tags: string[] | null, threat: string): string {
  if (!tags) return threat.includes("malware") ? "Emotet" : "Recon"
  const flat = tags.join(",").toLowerCase()
  if (flat.includes("mozi") || flat.includes("mirai")) return "Mirai"
  if (flat.includes("emotet") || flat.includes("qakbot") || flat.includes("trickbot")) return "Emotet"
  if (flat.includes("cobaltstrike") || flat.includes("metasploit")) return "RCE"
  if (flat.includes("phish")) return "Phishing"
  if (flat.includes("ransom") || flat.includes("conti") || flat.includes("lockbit")) return "Ransomware"
  if (flat.includes("scan") || flat.includes("recon")) return "PortScan"
  return "Recon"
}

async function fetchUrlhaus(): Promise<ThreatEvent[]> {
  const res = await fetch(URLHAUS_URL, { next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`URLhaus ${res.status}`)
  const raw: Record<string, UrlhausEntry[]> = await res.json()

  // Flatten, filter to online IP-based URLs, take recent 80
  const online: Array<{ ip: string; entry: UrlhausEntry }> = []
  for (const arr of Object.values(raw)) {
    for (const entry of arr) {
      if (entry.url_status !== "online") continue
      const m = entry.url.match(IP_RE)
      if (m) online.push({ ip: m[1], entry })
      if (online.length >= 80) break
    }
    if (online.length >= 80) break
  }
  if (online.length === 0) return []

  // Batch geolocate via ip-api.com (free, no key)
  const batch = online.slice(0, 50).map((o) => o.ip)
  const geoRes = await fetch(IP_API_BATCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batch),
    next: { revalidate: 600 },
  })
  if (!geoRes.ok) throw new Error(`ip-api ${geoRes.status}`)
  const geo: Array<{ status: string; lat?: number; lon?: number; countryCode?: string; query: string }> = await geoRes.json()

  const seed = Math.floor(Date.now() / 30_000)
  return geo
    .filter((g) => g.status === "success" && g.lat != null && g.lon != null)
    .map((g, i) => {
      const meta = online.find((o) => o.ip === g.query)?.entry
      const tgtCode = TARGETS[(i + seed) % TARGETS.length]
      const tgt = COORDS[tgtCode]!
      const typ = tagToType(meta?.tags ?? null, meta?.threat ?? "malware_download")
      const cnt = Math.floor(rng(seed + i) * 4000) + 200
      const sev: ThreatEvent["severity"] =
        cnt > 3000 ? "critical" : cnt > 1800 ? "high" : cnt > 800 ? "medium" : "low"
      return {
        id: `urlhaus-${g.query}-${i}`,
        srcLat: g.lat! + (rng(seed + i * 3) - 0.5) * 2,
        srcLng: g.lon! + (rng(seed + i * 5) - 0.5) * 2,
        tgtLat: tgt.lat + (rng(seed + i * 7) - 0.5) * 2,
        tgtLng: tgt.lng + (rng(seed + i * 9) - 0.5) * 2,
        srcCountry: g.countryCode ?? "??",
        tgtCountry: tgtCode,
        type: typ,
        count: cnt,
        severity: sev,
        timestamp: meta?.dateadded ?? new Date().toISOString(),
      }
    })
}

// ---------------------------------------------------------------------------
// GreyNoise GNQL — commented out (GNQL requires paid plan)
// Uncomment + set GREYNOISE_API_KEY env var if you upgrade
// ---------------------------------------------------------------------------
// async function fetchGreyNoise(apiKey: string): Promise<ThreatEvent[]> {
//   const res = await fetch(
//     "https://api.greynoise.io/v2/experimental/gnql?query=classification%3Amalicious&size=35",
//     { headers: { accept: "application/json", key: apiKey }, next: { revalidate: 30 } }
//   )
//   if (!res.ok) throw new Error(`GreyNoise ${res.status}`)
//   const data = await res.json()
//   // map data.data[] → ThreatEvent[] (see full implementation in git history)
//   return data.data ?? []
// }

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET() {
  const seed = Math.floor(Date.now() / 30_000) // changes every 30 s

  // Priority: URLhaus (~29k entries) → Feodo Tracker → synthetic fallback
  try {
    const threats = await fetchUrlhaus()
    if (threats.length >= 5) {
      return NextResponse.json(
        { threats, generatedAt: new Date().toISOString(), source: "urlhaus" },
        { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=120" } }
      )
    }
  } catch (err) {
    console.error("[/api/threats] URLhaus failed:", (err as Error).message)
  }

  try {
    const threats = await fetchFeodo()
    if (threats.length > 0) {
      return NextResponse.json(
        { threats, generatedAt: new Date().toISOString(), source: "feodo-tracker" },
        { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" } }
      )
    }
  } catch (err) {
    console.error("[/api/threats] Feodo failed:", (err as Error).message)
  }

  const threats = synthetic(seed)
  return NextResponse.json(
    { threats, generatedAt: new Date().toISOString(), source: "synthetic-osint" },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=10" } }
  )
}
