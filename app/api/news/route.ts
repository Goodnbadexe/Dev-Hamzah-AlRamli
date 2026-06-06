import { NextResponse } from 'next/server'

/**
 * THREAT WIRE feed — multi-source aggregation.
 *
 * CISA KEV is the guaranteed baseline (actively-exploited vulns, ransomware +
 * remediation deadlines). GitHub Security Advisory DB extends + enriches it with
 * real CVSS scores, ecosystems and CWEs. NVD optionally fills remaining CVSS gaps
 * when a key is present. The Hacker News + BleepingComputer RSS feeds ride along as
 * a separate `headlines` channel (they're articles, not CVEs — different shape).
 *
 * Every feed is isolated: one failing source degrades gracefully, it never breaks
 * the route. KEV alone always yields a usable wire.
 */

export const revalidate = 1800
const REVALIDATE = 1800
const FEED_CAP = 30

/* ── unified feed item (superset; UI fields stay backward-compatible) ── */
interface FeedItem {
  id: string
  title: string
  vendor: string
  product: string
  description: string
  date: string
  dueDate: string
  ransomware: string
  cwes: string[]
  category: string
  severity: 'critical' | 'high' | 'medium'
  action: string
  nvdUrl: string
  cvss: number | null
  ecosystem: string | null
  source: string
}

interface Headline {
  title: string
  link: string
  source: string
  date: string
}

interface SourceStatus {
  name: string
  type: 'live' | 'rss' | 'detail' | 'class'
  ok: boolean
  count: number
}

/* ─────────────────────────── CISA KEV ─────────────────────────── */

interface KevEntry {
  cveID: string
  vendorProject: string
  product: string
  vulnerabilityName: string
  dateAdded: string
  shortDescription: string
  requiredAction: string
  dueDate: string
  knownRansomwareCampaignUse: string
  notes: string
  cwes: string[]
}

async function fetchKev(): Promise<{ items: FeedItem[]; total: number; ok: boolean }> {
  try {
    const res = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      { next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(10_000) }
    )
    if (!res.ok) throw new Error(`CISA ${res.status}`)
    const data = await res.json()
    const vulns: KevEntry[] = data.vulnerabilities ?? []
    const items = vulns
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 24)
      .map(
        (v): FeedItem => ({
          id: v.cveID,
          title: v.vulnerabilityName,
          vendor: v.vendorProject,
          product: v.product,
          description: v.shortDescription,
          date: v.dateAdded,
          dueDate: v.dueDate,
          ransomware: v.knownRansomwareCampaignUse,
          cwes: v.cwes ?? [],
          category: categorizeCVE(v.vulnerabilityName, v.shortDescription, v.cwes ?? []),
          severity: kevSeverity(v),
          action: v.requiredAction,
          nvdUrl: `https://nvd.nist.gov/vuln/detail/${v.cveID}`,
          cvss: null,
          ecosystem: null,
          source: 'CISA KEV',
        })
      )
    return { items, total: vulns.length, ok: true }
  } catch {
    return { items: [], total: 0, ok: false }
  }
}

/* ──────────────────── GitHub Security Advisory DB ──────────────────── */

interface GhAdvisory {
  ghsa_id: string
  cve_id: string | null
  summary: string
  description: string
  severity: string
  published_at: string
  html_url: string
  cvss?: { score: number | null } | null
  cvss_severities?: { cvss_v4?: { score: number | null }; cvss_v3?: { score: number | null } } | null
  cwes?: { cwe_id: string }[]
  vulnerabilities?: { package?: { ecosystem?: string; name?: string } }[]
}

function ghCvss(a: GhAdvisory): number | null {
  const s = a.cvss?.score ?? a.cvss_severities?.cvss_v4?.score ?? a.cvss_severities?.cvss_v3?.score
  return typeof s === 'number' && s > 0 ? s : null
}

function ghSeverity(s: string): 'critical' | 'high' | 'medium' | null {
  const v = (s || '').toLowerCase()
  if (v === 'critical') return 'critical'
  if (v === 'high') return 'high'
  if (v === 'medium' || v === 'moderate') return 'medium'
  return null // drop low/unknown — keeps the wire and severity-mix meaningful
}

async function fetchGitHub(): Promise<{ items: FeedItem[]; ok: boolean }> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'goodnbad-threatwire',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

    const res = await fetch(
      'https://api.github.com/advisories?per_page=50&sort=published&direction=desc&type=reviewed',
      { headers, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(8_000) }
    )
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    const data: GhAdvisory[] = await res.json()
    if (!Array.isArray(data)) throw new Error('GitHub: unexpected shape')

    const items: FeedItem[] = []
    for (const a of data) {
      const severity = ghSeverity(a.severity)
      if (!severity) continue
      const pkg = a.vulnerabilities?.[0]?.package
      const cwes = (a.cwes ?? []).map((c) => c.cwe_id).filter(Boolean).slice(0, 3)
      items.push({
        id: a.cve_id || a.ghsa_id,
        title: a.summary || 'Security advisory',
        vendor: pkg?.ecosystem || 'GitHub',
        product: pkg?.name || a.ghsa_id,
        description: a.description || a.summary || '',
        date: a.published_at,
        dueDate: '',
        ransomware: 'Unknown',
        cwes,
        category: categorizeCVE(a.summary || '', a.description || '', cwes),
        severity,
        action: '',
        nvdUrl: a.cve_id ? `https://nvd.nist.gov/vuln/detail/${a.cve_id}` : a.html_url,
        cvss: ghCvss(a),
        ecosystem: pkg?.ecosystem || null,
        source: 'GitHub Advisory',
      })
    }
    return { items, ok: true }
  } catch {
    return { items: [], ok: false }
  }
}

/* ──────────────────── NVD CVSS enrichment (opt-in) ──────────────────── */

/**
 * Fill CVSS for items still missing a score, via NVD. Gated on NVD_API_KEY —
 * the unauthenticated limit (5 req / 30s) is too flaky for production, so without
 * a key we rely on GitHub's CVSS cross-match and leave the rest honestly blank.
 */
async function enrichCvssNvd(items: FeedItem[]): Promise<boolean> {
  const key = process.env.NVD_API_KEY
  if (!key) return false
  const targets = items.filter((i) => i.cvss == null && /^CVE-/i.test(i.id)).slice(0, 15)
  if (!targets.length) return false

  const results = await Promise.allSettled(
    targets.map(async (item) => {
      const res = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${encodeURIComponent(item.id)}`,
        { headers: { apiKey: key }, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(6_000) }
      )
      if (!res.ok) throw new Error(`NVD ${res.status}`)
      const data = await res.json()
      const metrics = data?.vulnerabilities?.[0]?.cve?.metrics
      const score =
        metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ??
        metrics?.cvssMetricV30?.[0]?.cvssData?.baseScore ??
        metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore
      if (typeof score === 'number') item.cvss = score
    })
  )
  return results.some((r) => r.status === 'fulfilled')
}

/* ──────────────────────────── RSS digest ──────────────────────────── */

const RSS_FEEDS = [
  { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
  { url: 'https://www.bleepingcomputer.com/feed/', source: 'BleepingComputer' },
]

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8211;/g, '–')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function parseRss(xml: string, source: string): Headline[] {
  const out: Headline[] = []
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? []
  for (const block of items.slice(0, 6)) {
    const title = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
    const link = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1]
    const date = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]
    if (!title || !link) continue
    out.push({
      title: decodeEntities(title),
      link: decodeEntities(link),
      source,
      date: date ? new Date(date).toISOString() : '',
    })
  }
  return out
}

async function fetchRss(url: string, source: string): Promise<Headline[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'goodnbad-threatwire' },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(6_000),
    })
    if (!res.ok) throw new Error(`${source} ${res.status}`)
    return parseRss(await res.text(), source)
  } catch {
    return []
  }
}

/* ────────────────────────── shared helpers ────────────────────────── */

function categorizeCVE(name: string, desc: string, cwes: string[]): string {
  const text = `${name} ${desc}`.toLowerCase()
  if (cwes.includes('CWE-89') || text.includes('sql injection')) return 'SQL Injection'
  if (cwes.includes('CWE-79') || text.includes('cross-site scripting') || text.includes(' xss')) return 'XSS'
  if (cwes.includes('CWE-78') || text.includes('command injection') || text.includes('os command')) return 'Command Injection'
  if (cwes.includes('CWE-22') || text.includes('path traversal') || text.includes('directory traversal')) return 'Path Traversal'
  if (cwes.includes('CWE-787') || cwes.includes('CWE-119') || text.includes('out-of-bounds') || text.includes('buffer overflow')) return 'Memory Corruption'
  if (cwes.includes('CWE-502') || text.includes('deserialization')) return 'Deserialization'
  if (cwes.includes('CWE-918') || text.includes('ssrf') || text.includes('server-side request forgery')) return 'SSRF'
  if (cwes.includes('CWE-1321') || text.includes('prototype pollution')) return 'Prototype Pollution'
  if (cwes.includes('CWE-20') || text.includes('improper input validation')) return 'Input Validation'
  if (text.includes('remote code execution') || text.includes(' rce')) return 'RCE'
  if (text.includes('privilege escalation')) return 'Privilege Escalation'
  if (text.includes('authentication bypass') || text.includes('improper authentication')) return 'Auth Bypass'
  if (text.includes('use-after-free') || text.includes('use after free')) return 'Use After Free'
  if (text.includes('xxe') || text.includes('xml external')) return 'XXE'
  return 'Vulnerability'
}

function kevSeverity(v: KevEntry): 'critical' | 'high' | 'medium' {
  const desc = v.shortDescription.toLowerCase()
  if (v.knownRansomwareCampaignUse === 'Known') return 'critical'
  if (
    desc.includes('unauthenticated') ||
    desc.includes('remote code execution') ||
    desc.includes('root privilege') ||
    desc.includes('arbitrary code')
  )
    return 'critical'
  if (
    desc.includes('privilege escalation') ||
    desc.includes('authentication bypass') ||
    desc.includes('improper authentication') ||
    desc.includes('command injection') ||
    desc.includes('sql injection') ||
    desc.includes('deserialization') ||
    desc.includes('use-after-free') ||
    desc.includes('use after free') ||
    desc.includes('out-of-bounds') ||
    desc.includes('buffer overflow') ||
    desc.includes('server-side request forgery') ||
    desc.includes('ssrf')
  )
    return 'high'
  return 'medium'
}

/* ──────────────────────────── route ──────────────────────────── */

export async function GET() {
  const [kev, gh, ...rssGroups] = await Promise.all([
    fetchKev(),
    fetchGitHub(),
    ...RSS_FEEDS.map((f) => fetchRss(f.url, f.source)),
  ])

  // KEV is the spine; GitHub fills CVSS for shared CVEs, then extends with its own.
  const ghByCve = new Map(gh.items.filter((i) => /^CVE-/i.test(i.id)).map((i) => [i.id.toUpperCase(), i]))
  for (const item of kev.items) {
    const match = ghByCve.get(item.id.toUpperCase())
    if (match?.cvss != null) item.cvss = match.cvss
    if (!item.ecosystem && match?.ecosystem) item.ecosystem = match.ecosystem
  }

  const seen = new Set(kev.items.map((i) => i.id.toUpperCase()))
  const ghExtra = gh.items.filter((i) => !seen.has(i.id.toUpperCase()))

  const merged = [...kev.items, ...ghExtra]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, FEED_CAP)

  const nvdOk = await enrichCvssNvd(merged)

  const scored = merged.filter((i) => typeof i.cvss === 'number')
  const avgCvss = scored.length
    ? Math.round((scored.reduce((s, i) => s + (i.cvss as number), 0) / scored.length) * 10) / 10
    : null

  const headlines = rssGroups
    .flat()
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 8)

  const usedKev = merged.filter((i) => i.source === 'CISA KEV').length
  const usedGh = merged.filter((i) => i.source === 'GitHub Advisory').length
  const sources: SourceStatus[] = [
    { name: 'CISA KEV Catalog', type: 'live', ok: kev.ok, count: usedKev },
    { name: 'GitHub Advisory DB', type: 'live', ok: gh.ok, count: usedGh },
    { name: 'NVD / NIST', type: 'detail', ok: nvdOk || scored.length > 0, count: scored.length },
    ...RSS_FEEDS.map((f, idx) => ({
      name: f.source,
      type: 'rss' as const,
      ok: (rssGroups[idx]?.length ?? 0) > 0,
      count: rssGroups[idx]?.length ?? 0,
    })),
    { name: 'MITRE CWE', type: 'class', ok: true, count: merged.reduce((n, i) => n + i.cwes.length, 0) },
  ]

  if (!merged.length) {
    return NextResponse.json(
      { ok: false, items: [], total: 0, source: '', fetchedAt: new Date().toISOString(), headlines, sources, avgCvss: null, error: 'All threat feeds are temporarily unavailable.' },
      { status: 503 }
    )
  }

  const activeSources = sources.filter((s) => s.ok && s.type !== 'class').map((s) => s.name)

  return NextResponse.json({
    ok: true,
    items: merged,
    total: kev.total,
    source: activeSources.join(' + ') || 'CISA KEV Catalog',
    fetchedAt: new Date().toISOString(),
    headlines,
    sources,
    avgCvss,
  })
}
