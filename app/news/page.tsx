'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Shield, AlertTriangle, ExternalLink, Calendar, Database, Zap, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ThreatGlobe } from '@/components/threat-globe'

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

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10', dot: 'bg-red-500', label: 'CRITICAL' },
  high: { color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-500/10', dot: 'bg-orange-500', label: 'HIGH' },
  medium: { color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10', dot: 'bg-yellow-500', label: 'MEDIUM' },
}

const CATEGORY_COLORS: Record<string, string> = {
  'RCE': 'border-red-500/40 bg-red-500/10 text-red-400',
  'SQL Injection': 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  'Memory Corruption': 'border-red-500/40 bg-red-500/10 text-red-400',
  'Use After Free': 'border-red-500/40 bg-red-500/10 text-red-400',
  'Auth Bypass': 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  'Privilege Escalation': 'border-orange-500/40 bg-orange-500/10 text-orange-400',
  'XSS': 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  'Command Injection': 'border-red-500/40 bg-red-500/10 text-red-400',
  'Path Traversal': 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  'Deserialization': 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  'SSRF': 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  'XXE': 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  'Input Validation': 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400',
  'Vulnerability': 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function NewsPage() {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'critical' | 'high'>('all')
  const [refreshing, setRefreshing] = useState(false)

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

  const filtered = data?.items?.filter((item) => {
    if (filter === 'critical') return item.severity === 'critical'
    if (filter === 'high') return item.severity === 'high' || item.severity === 'critical'
    return true
  }) ?? []

  const criticalCount = data?.items?.filter((i) => i.severity === 'critical').length ?? 0
  const ransomwareCount = data?.items?.filter((i) => i.ransomware === 'Known').length ?? 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-6xl space-y-10">

          {/* Header */}
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="font-mono text-xs text-red-400 uppercase tracking-widest">Live Threat Intelligence</span>
                </div>
                <h1 className="font-mono text-3xl font-bold text-white md:text-4xl">
                  THREAT<span className="text-emerald-400">_</span>FEED
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  CISA Known Exploited Vulnerabilities · Auto-refreshes every 30 minutes
                </p>
              </div>

              <button
                onClick={() => fetchNews(true)}
                disabled={refreshing}
                className="flex items-center gap-2 self-start rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Feed
              </button>
            </div>
          </div>

          {/* Globe */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-sm font-semibold text-white">GLOBAL THREAT MAP</span>
              </div>
              <span className="font-mono text-xs text-zinc-500">Real-time attack vector visualization</span>
            </div>
            <ThreatGlobe height={380} />
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Database, label: 'Total KEVs', value: data.total.toLocaleString(), color: 'text-emerald-400' },
                { icon: AlertTriangle, label: 'Critical (30d)', value: criticalCount, color: 'text-red-400' },
                { icon: Lock, label: 'Ransomware Linked', value: ransomwareCount, color: 'text-orange-400' },
                { icon: Shield, label: 'Source', value: 'CISA', color: 'text-blue-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                  <Icon className={`mb-1 h-4 w-4 ${color}`} />
                  <div className={`font-mono text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-zinc-500">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2">
            {(['all', 'critical', 'high'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === f
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                    : 'border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
            {data && (
              <span className="ml-auto self-center font-mono text-xs text-zinc-600">
                {filtered.length} advisories
              </span>
            )}
          </div>

          {/* Feed */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60" />
              ))}
            </div>
          ) : data?.error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
              <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-400" />
              <p className="text-sm text-red-400">{data.error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const sev = SEVERITY_CONFIG[item.severity]
                const catColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS['Vulnerability']
                return (
                  <Card key={item.id} className="border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-700">
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${sev.bg} ${sev.color}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                              {sev.label}
                            </span>
                            <Badge className={`border text-[10px] ${catColor}`}>{item.category}</Badge>
                            {item.ransomware === 'Known' && (
                              <Badge className="border border-red-500/40 bg-red-500/10 text-[10px] text-red-400">
                                Ransomware
                              </Badge>
                            )}
                            <span className="font-mono text-[10px] text-zinc-600">{item.id}</span>
                          </div>
                          <h3 className="text-sm font-semibold leading-snug text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            <span className="text-emerald-400">{item.vendor}</span>
                            {' · '}
                            {item.product}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.date)}
                          </div>
                          <span className="font-mono text-[10px] text-zinc-600">{timeSince(item.date)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 pt-0">
                      <p className="mb-3 text-xs leading-relaxed text-zinc-400">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                          <span className="text-zinc-500">Due:</span>
                          <span className={new Date(item.dueDate) < new Date() ? 'text-red-400' : 'text-zinc-400'}>
                            {formatDate(item.dueDate)}
                          </span>
                        </div>
                        {item.cwes.length > 0 && (
                          <div className="flex gap-1">
                            {item.cwes.slice(0, 2).map((cwe) => (
                              <span key={cwe} className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                                {cwe}
                              </span>
                            ))}
                          </div>
                        )}
                        <a
                          href={item.nvdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 transition-colors hover:text-emerald-300"
                        >
                          NVD Details <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pinned site update */}
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Site Update</span>
              <span className="font-mono text-xs text-zinc-600">· March 29, 2026</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-white">Calma × Eid Event</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Event coverage from the Calma × Eid community celebration.
            </p>
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-black">
              <video controls preload="metadata" className="h-auto max-h-64 w-full">
                <source src="/NewsAssets/29-3-2026 x Calma x Eid Event.MP4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Footer attribution */}
          {data?.fetchedAt && (
            <p className="text-center font-mono text-[10px] text-zinc-700">
              Feed synced {new Date(data.fetchedAt).toLocaleString()} · Source: {data.source}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
