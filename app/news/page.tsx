'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, ArrowUpRight, Calendar, Zap, AlertTriangle } from 'lucide-react'

const ThreatGlobe = dynamic(
  () => import('@/components/threat-globe').then((m) => ({ default: m.ThreatGlobe })),
  { ssr: false, loading: () => null }
)

interface NewsItem {
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
}

interface NewsResponse {
  ok: boolean
  items: NewsItem[]
  total: number
  source: string
  fetchedAt: string
  error?: string
}

type Severity = NewsItem['severity']
type Filter = 'all' | 'critical' | 'high' | 'medium'

const SEVERITY: Record<Severity, { tag: string; dot: string; bar: string; text: string }> = {
  critical: { tag: 'border-rose-500/40 bg-rose-500/10 text-rose-300', dot: 'bg-rose-500', bar: 'bg-rose-500', text: 'text-rose-400' },
  high: { tag: 'border-orange-500/40 bg-orange-500/10 text-orange-300', dot: 'bg-orange-500', bar: 'bg-orange-500', text: 'text-orange-400' },
  medium: { tag: 'border-yellow-500/35 bg-yellow-500/10 text-yellow-200', dot: 'bg-yellow-500', bar: 'bg-yellow-500', text: 'text-yellow-400' },
}

const FILTERS: Filter[] = ['all', 'critical', 'high', 'medium']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

const SEV_WEIGHT: Record<Severity, number> = { critical: 30, high: 15, medium: 5 }

/** Recency window (days) over which a fresh KEV addition still counts as "hot". */
const HYPE_WINDOW_DAYS = 30
/** Weaponization beats everything: a ransomware-linked CVE is the headline. */
const RANSOMWARE_WEIGHT = 40

/**
 * hypeScore — approximate "how much is this advisory trending right now" from the
 * real signals CISA KEV actually carries (no CVSS, no external news API):
 *   • ransomware campaign use  → the ones making headlines      (+40)
 *   • how recently it hit KEV   → freshness decays over 30 days  (0..30)
 *   • severity                  → critical > high > medium       (5..30)
 * Higher = hotter. Honest proxy: every input is a fact from the feed, not invented.
 */
function hypeScore(i: NewsItem): number {
  const ageDays = Math.max(0, (Date.now() - new Date(i.date).getTime()) / 86_400_000)
  const recency = Math.max(0, HYPE_WINDOW_DAYS - ageDays)
  const ransomware = i.ransomware === 'Known' ? RANSOMWARE_WEIGHT : 0
  return ransomware + SEV_WEIGHT[i.severity] + recency
}

/**
 * pickLead — promote the most "trending" advisory to the hero "TOP ADVISORY" slot.
 *
 * The original concept used "newest critical, else highest CVSS". CISA KEV has no
 * CVSS, so the lead is the highest hypeScore() instead — actively-weaponized and
 * fresh rises to the top, an old critical loses to a hot new one. Ties break newest.
 */
function pickLead(items: NewsItem[]): NewsItem | null {
  if (!items.length) return null
  return [...items].sort((a, b) => {
    const d = hypeScore(b) - hypeScore(a)
    return d !== 0 ? d : new Date(b.date).getTime() - new Date(a.date).getTime()
  })[0]
}

export default function NewsPage() {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const fetchNews = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await fetch('/api/news')
      const json: NewsResponse = await res.json()
      setData(json)
    } catch {
      setData({ ok: false, items: [], total: 0, source: '', fetchedAt: '', error: 'Failed to load threat intelligence feed.' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchNews() }, [fetchNews])

  const items = data?.items ?? []
  const lead = pickLead(items)

  const inFilter = (s: Severity) => {
    if (filter === 'all') return true
    if (filter === 'high') return s === 'high' || s === 'critical'
    return s === filter
  }

  // Feed excludes the lead to avoid duplicating the hero advisory.
  const feed = items.filter((i) => i.id !== lead?.id && inFilter(i.severity))

  const counts = {
    critical: items.filter((i) => i.severity === 'critical').length,
    high: items.filter((i) => i.severity === 'high').length,
    medium: items.filter((i) => i.severity === 'medium').length,
    ransomware: items.filter((i) => i.ransomware === 'Known').length,
  }
  const maxMix = Math.max(counts.critical, counts.high, counts.medium, 1)

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      {/* faint structural grid */}
      <div className="os-grid pointer-events-none fixed inset-0 z-0 opacity-60" aria-hidden />

      <section className="relative z-10 mx-auto max-w-[1240px] px-5 pb-24 pt-14 sm:px-8 md:pt-20">
        {/* Back */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        {/* Page head */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_6px] shadow-rose-500" />
              Live Security Advisories
            </div>
            <h1 className="text-[clamp(2.1rem,5vw,3.5rem)] font-bold leading-[0.95] tracking-tight">
              THREAT<span className="text-emerald-400">_</span>WIRE
            </h1>
            <p className="mt-3 font-mono text-xs text-zinc-600">
              {data
                ? `${data.total.toLocaleString()} KEVs tracked · ${items.length} in feed · CISA`
                : 'Reviewed vulnerability advisories · auto-synced'}
            </p>
          </div>

          <button
            onClick={() => fetchNews(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2.5 self-start rounded-md border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Source chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          <SourceChip label="CISA KEV Catalog" state="live" />
          <SourceChip label="NVD / NIST" state="detail" />
          <SourceChip label="MITRE CWE" state="detail" />
        </div>

        {/* Global threat map (signature) */}
        <div className="mt-7 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-sm font-semibold">GLOBAL THREAT MAP</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-600">live IOC scatter · malicious infrastructure</span>
          </div>
          {isMobile ? (
            <div className="flex h-[120px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Globe — desktop only</span>
            </div>
          ) : (
            <ThreatGlobe height={380} />
          )}
        </div>

        {/* Lead story */}
        <div className="mt-7">
          {loading ? (
            <div className="h-44 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60" />
          ) : lead ? (
            <a
              href={lead.nvdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-rose-500/70"
            >
              <div className="flex items-center gap-2.5 border-b border-zinc-800/80 bg-zinc-950/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_6px] shadow-rose-500" />
                Top Advisory
                <span className="ml-auto text-zinc-600">{lead.id}</span>
              </div>
              <div className="px-6 pb-6 pt-5">
                <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                  <SevTag severity={lead.severity} />
                  <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] text-zinc-300">{lead.category}</span>
                  <span className="rounded border border-zinc-800 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-zinc-500">{lead.vendor}</span>
                  {lead.ransomware === 'Known' && (
                    <span className="rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-rose-300">Ransomware</span>
                  )}
                </div>
                <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-semibold leading-[1.18] tracking-tight text-balance [overflow-wrap:anywhere]">
                  {lead.title}
                </h2>
                <p className="mt-3 max-w-[78ch] text-[15px] leading-relaxed text-zinc-400 text-pretty [overflow-wrap:anywhere]">
                  {lead.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-[11px] text-zinc-500">
                  <span className="text-zinc-300">{lead.product}</span>
                  <span>{formatDate(lead.date)} · {timeSince(lead.date)}</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-400">
                    read advisory <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </a>
          ) : null}
        </div>

        {/* Body grid */}
        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Feed column */}
          <div className="min-w-0">
            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    filter === f
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                      : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
              {data && !loading && (
                <span className="ml-auto font-mono text-[11px] text-zinc-600">{feed.length} advisories</span>
              )}
            </div>

            {/* Feed */}
            {loading ? (
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60" />
                ))}
              </div>
            ) : data?.error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
                <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-rose-400" />
                <p className="text-sm text-rose-300">{data.error}</p>
              </div>
            ) : feed.length === 0 ? (
              <div className="py-6 font-mono text-xs text-zinc-600">No advisories match this filter.</div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {feed.map((item) => (
                  <AdvisoryCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="flex flex-col gap-[18px] lg:sticky lg:top-6">
            <RailPanel title="intelligence">
              <Stat label="Advisories (feed)" value={items.length} className="text-emerald-400" />
              <Stat label="Critical" value={counts.critical} className="text-rose-400" />
              <Stat label="High" value={counts.high} className="text-orange-400" />
              <Stat label="Ransomware linked" value={counts.ransomware} className="text-amber-400" />
            </RailPanel>

            <RailPanel title="severity mix">
              <div className="flex flex-col gap-2.5">
                {(['critical', 'high', 'medium'] as Severity[]).map((s) => (
                  <div key={s} className="grid grid-cols-[64px_1fr_28px] items-center gap-2.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-wide text-zinc-500">{s}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                      <span
                        className={`block h-full rounded-full ${SEVERITY[s].bar}`}
                        style={{ width: `${Math.round((counts[s] / maxMix) * 100)}%` }}
                      />
                    </span>
                    <span className="text-right font-mono text-[10px] tabular-nums text-zinc-500">{counts[s]}</span>
                  </div>
                ))}
              </div>
            </RailPanel>

            <RailPanel title="source feeds">
              <FeedRow name="CISA KEV Catalog" type="live" live />
              <FeedRow name="NVD / NIST" type="detail" />
              <FeedRow name="MITRE CWE" type="class" />
              <p className="mt-3 border-t border-zinc-800/80 pt-3 font-mono text-[9.5px] leading-relaxed text-zinc-600">
                Pulled server-side from the <b className="font-medium text-zinc-400">CISA KEV catalog</b> (no CORS, 30-min revalidate). Per-CVE links resolve to <b className="font-medium text-zinc-400">NVD</b>; weakness classes map to <b className="font-medium text-zinc-400">MITRE CWE</b>.
              </p>
            </RailPanel>
          </aside>
        </div>

        {/* Pinned site update */}
        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Site Update</span>
            <span className="font-mono text-xs text-zinc-600">· March 29, 2026</span>
          </div>
          <h2 className="mb-2 text-lg font-semibold">Calma × Eid Event</h2>
          <p className="mb-4 text-sm text-zinc-400">Event coverage from the Calma × Eid community celebration.</p>
          <div className="overflow-hidden rounded-lg border border-zinc-700 bg-black">
            <video controls preload="metadata" className="h-auto max-h-64 w-full">
              <source src="/NewsAssets/29-3-2026 x Calma x Eid Event.MP4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Footer attribution */}
        {data?.fetchedAt && (
          <p className="mt-8 text-center font-mono text-[10px] text-zinc-700">
            Feed synced {new Date(data.fetchedAt).toLocaleString()} · Source: {data.source}
          </p>
        )}
      </section>
    </main>
  )
}

/* ── pieces ─────────────────────────────────────────────── */

function SevTag({ severity }: { severity: Severity }) {
  const s = SEVERITY[severity]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${s.tag}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {severity}
    </span>
  )
}

function SourceChip({ label, state }: { label: string; state: 'live' | 'detail' }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 font-mono text-[10px] tracking-wide text-zinc-500">
      <span className={`h-1.5 w-1.5 rounded-full ${state === 'live' ? 'bg-emerald-500 shadow-[0_0_5px] shadow-emerald-500' : 'bg-zinc-600'}`} />
      {label}
      {state === 'live' && <b className="ml-0.5 font-medium text-emerald-400">live</b>}
    </span>
  )
}

function AdvisoryCard({ item }: { item: NewsItem }) {
  const overdue = new Date(item.dueDate) < new Date()
  return (
    <a
      href={item.nvdUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-zinc-800 bg-zinc-900/45 p-4 transition-all hover:-translate-y-px hover:border-zinc-600 hover:bg-zinc-900/80"
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <SevTag severity={item.severity} />
        <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">{item.category}</span>
        <span className="font-mono text-[10px] text-zinc-600">{item.id}</span>
        <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-zinc-500">{item.vendor}</span>
        {item.ransomware === 'Known' && (
          <span className="rounded border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-rose-300">Ransomware</span>
        )}
      </div>
      <h3 className="text-sm font-medium leading-snug tracking-tight [overflow-wrap:anywhere]">{item.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-zinc-500 [overflow-wrap:anywhere]">{item.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10.5px] text-zinc-600">
        <span className="text-zinc-400">{item.product}</span>
        {item.cwes.slice(0, 2).map((cwe) => (
          <span key={cwe} className="rounded border border-zinc-800 px-1.5 py-0.5 text-zinc-500">{cwe}</span>
        ))}
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span className="text-zinc-500">due</span>
          <span className={overdue ? 'text-rose-400' : 'text-zinc-400'}>{formatDate(item.dueDate)}</span>
        </span>
        <span className="ml-auto">{timeSince(item.date)}</span>
      </div>
    </a>
  )
}

function RailPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <h4 className="mb-3.5 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        {title}
        <span className="h-px flex-1 bg-zinc-800" />
      </h4>
      {children}
    </div>
  )
}

function Stat({ label, value, className }: { label: string; value: number | string; className?: string }) {
  return (
    <div className="flex items-baseline justify-between border-t border-zinc-800/70 py-1.5 first:border-t-0">
      <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-600">{label}</span>
      <span className={`font-mono text-xl font-semibold leading-none tracking-tight ${className ?? ''}`}>{value}</span>
    </div>
  )
}

function FeedRow({ name, type, live }: { name: string; type: string; live?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1 font-mono text-[11px] text-zinc-400">
      <span className={`h-1.5 w-1.5 flex-none rounded-full ${live ? 'bg-emerald-500 shadow-[0_0_5px] shadow-emerald-500' : 'bg-zinc-700'}`} />
      <span className="text-zinc-200">{name}</span>
      <span className="ml-auto text-[9px] uppercase tracking-wide text-zinc-600">{type}</span>
    </div>
  )
}
