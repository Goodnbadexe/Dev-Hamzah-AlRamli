// =============================================================================
// lib/geo.ts — IP → geolocation enrichment
// =============================================================================
//
// Mirrors the worldmonitor cyber layer: every IP-based IOC is geo-enriched
// using a primary provider with a fallback, results cached for 24h, lookups
// run concurrently with a per-IP timeout and a hard cap per run.
//
//   primary : ipinfo.io     (free ~50k/mo with IPINFO_TOKEN, limited without)
//   fallback: freeipapi.com  (free, no key)
//
// In production swap the in-memory CACHE for Redis (worldmonitor caches geo
// for 24h in Redis) so the cache survives serverless cold starts.
// =============================================================================

export type Geo = { lat: number; lng: number; country: string }

const TTL_MS      = 24 * 60 * 60 * 1000 // 24h
const TIMEOUT_MS  = 12_000              // per-IP timeout
const CONCURRENCY = 16                  // parallel lookups
const MAX_PER_RUN = 250                 // cap IPs processed per collection run

// In-memory cache. Replace with Redis (GET/SETEX geo:{ip}) in production.
const CACHE = new Map<string, { geo: Geo | null; exp: number }>()

function fromCache(ip: string): Geo | null | undefined {
  const hit = CACHE.get(ip)
  if (!hit) return undefined
  if (hit.exp < Date.now()) { CACHE.delete(ip); return undefined }
  return hit.geo
}

function isPublicIPv4(ip: string): boolean {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return false
  const [a, b] = [Number(m[1]), Number(m[2])]
  if (a === 10 || a === 127 || a === 0) return false          // private / loopback
  if (a === 192 && b === 168) return false                    // private
  if (a === 172 && b >= 16 && b <= 31) return false           // private
  if (a === 169 && b === 254) return false                    // link-local
  return a <= 255
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
async function viaIpinfo(ip: string): Promise<Geo | null> {
  const token = process.env.IPINFO_TOKEN
  const url   = `https://ipinfo.io/${ip}/json${token ? `?token=${token}` : ""}`
  const res   = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`ipinfo ${res.status}`)
  const d = await res.json()
  if (!d.loc) return null                       // bogon / no location
  const [lat, lng] = String(d.loc).split(",").map(Number)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, country: d.country ?? "??" }
}

async function viaFreeIpApi(ip: string): Promise<Geo | null> {
  const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`freeipapi ${res.status}`)
  const d = await res.json()
  const lat = Number(d.latitude), lng = Number(d.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, country: d.countryCode ?? "??" }
}

// ---------------------------------------------------------------------------
// Single IP — cache → ipinfo → freeipapi
// ---------------------------------------------------------------------------
export async function geoEnrich(ip: string): Promise<Geo | null> {
  const cached = fromCache(ip)
  if (cached !== undefined) return cached
  if (!isPublicIPv4(ip)) { CACHE.set(ip, { geo: null, exp: Date.now() + TTL_MS }); return null }

  let geo: Geo | null = null
  try {
    geo = await viaIpinfo(ip)
  } catch {
    try { geo = await viaFreeIpApi(ip) } catch { geo = null }
  }
  CACHE.set(ip, { geo, exp: Date.now() + TTL_MS })
  return geo
}

// ---------------------------------------------------------------------------
// Batch — concurrency-limited pool, hard cap per run
// Returns a Map keyed by IP (missing entries = enrichment failed / private)
// ---------------------------------------------------------------------------
export async function geoEnrichMany(ips: string[]): Promise<Map<string, Geo>> {
  const unique = Array.from(new Set(ips)).slice(0, MAX_PER_RUN)
  const out = new Map<string, Geo>()
  let cursor = 0

  async function worker() {
    while (cursor < unique.length) {
      const ip = unique[cursor++]
      const geo = await geoEnrich(ip)
      if (geo) out.set(ip, geo)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, unique.length) }, worker)
  )
  return out
}
