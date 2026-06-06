"use client"

/**
 * GlobeLegend
 * -----------
 * A self-contained, on-globe key + live counter. It answers the two questions
 * the raw dots can't: "what do the colors mean?" and "how live is this?".
 *
 * It fetches its own metadata from /api/threats (the route already returns
 * `count`, `sources` and `generatedAt` — the globe just discards them), so it
 * drops into any page with zero plumbing. The route is cached ~10 min upstream,
 * so polling every 5 min is effectively free.
 *
 * variant:
 *   "bar"  — horizontal strip, for the full-screen /threats globe
 *   "card" — stacked panel, for the homepage backdrop corner
 */

import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"
import { IOC_COLOR } from "@/components/signal/ThreatGlobe"
import type { IocType } from "@/app/api/threats/route"

const TYPE_LABEL: Record<IocType, string> = {
  c2_server:     "C2 server",
  malware_host:  "Malware host",
  phishing:      "Phishing",
  malicious_url: "Malicious URL",
  ransomware:    "Ransomware",
}
const TYPES = Object.keys(TYPE_LABEL) as IocType[]

type Meta = { count: number; sources: string[]; generatedAt?: string }

function timeAgo(iso?: string): string {
  if (!iso) return "—"
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

interface Props {
  variant?: "bar" | "card"
  className?: string
}

export function GlobeLegend({ variant = "bar", className = "" }: Props) {
  const [meta, setMeta] = useState<Meta | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch("/api/threats")
        if (!res.ok) return
        const d = await res.json()
        if (!alive) return
        setMeta({
          count: d.count ?? (Array.isArray(d.iocs) ? d.iocs.length : 0),
          sources: Array.isArray(d.sources) ? d.sources : [],
          generatedAt: d.generatedAt,
        })
      } catch { /* cosmetic — never blocks the globe */ }
    }
    load()
    const t = setInterval(load, 5 * 60 * 1000)
    return () => { alive = false; clearInterval(t) }
  }, [])

  const Swatch = ({ t }: { t: IocType }) => (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: IOC_COLOR[t], boxShadow: `0 0 6px ${IOC_COLOR[t]}` }}
      />
      <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
        {TYPE_LABEL[t]}
      </span>
    </span>
  )

  const count = meta?.count
  const feeds = meta?.sources.length ?? 0
  const updated = timeAgo(meta?.generatedAt)

  // ── Horizontal bar (full-screen globe) ──────────────────────────────
  if (variant === "bar") {
    return (
      <div
        className={`pointer-events-none flex max-w-[94vw] flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-zinc-800/70 bg-zinc-950/70 px-4 py-2 backdrop-blur-md ${className}`}
      >
        <span className="flex items-center gap-2">
          <ShieldAlert className="h-3 w-3 text-rose-400" />
          <span className="font-mono text-[10px] font-semibold tabular-nums text-zinc-100">
            {count != null ? count.toLocaleString() : "—"}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            live indicators
          </span>
        </span>
        <span className="hidden h-3 w-px bg-zinc-800 sm:block" />
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {TYPES.map((t) => <Swatch key={t} t={t} />)}
        </span>
        <span className="hidden h-3 w-px bg-zinc-800 sm:block" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          {feeds} feeds · {updated}
        </span>
      </div>
    )
  }

  // ── Stacked card (backdrop corner) ──────────────────────────────────
  return (
    <div
      className={`pointer-events-none w-[190px] rounded-md border border-zinc-800/70 bg-zinc-950/70 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-zinc-800/70 px-3 py-2">
        <ShieldAlert className="h-3 w-3 text-rose-400" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
          threat surface
        </span>
        <span className="ml-auto font-mono text-[11px] font-semibold tabular-nums text-zinc-100">
          {count != null ? count.toLocaleString() : "—"}
        </span>
      </div>
      <div className="space-y-1.5 px-3 py-2.5">
        {TYPES.map((t) => <Swatch key={t} t={t} />)}
      </div>
      <div className="border-t border-zinc-800/70 px-3 py-1.5 font-mono text-[8px] uppercase tracking-widest text-zinc-600">
        {feeds} feeds · {updated}
      </div>
    </div>
  )
}
