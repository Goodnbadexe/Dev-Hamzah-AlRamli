import type { Metadata } from "next"
import { Radio, Shield } from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import { SignalFeedSection } from "@/components/signal/SignalFeedSection"
import { aggregateSignalFeed } from "@/lib/signal-feed/aggregate"

// Revalidate every 5 minutes (ISR) — individual fetches cache at their own rates
export const revalidate = 300

export const metadata: Metadata = {
  title: "Signal Feed | Hamzah Al-Ramli",
  description:
    "Live cyber threat intelligence: CISA advisories, known exploited vulnerabilities, malware IOCs, and security news from trusted official sources.",
  alternates: {
    canonical: "https://www.goodnbad.info/signal",
  },
}

export default async function SignalPage() {
  const { items, fetchedAt, sourceErrors } = await aggregateSignalFeed()

  return (
    <OSPageShell osName="signal.feed" label="Cyber Threat Intelligence">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">

        {/* Header */}
        <section className="mb-4">
          <OSWindow label="signal.feed" title="live · threat intelligence" status="active" className="os-panel-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <Radio className="h-5 w-5" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Signal Feed
                  </p>
                </div>
                <h1 className="text-2xl font-semibold leading-tight text-zinc-100 md:text-3xl">
                  Cyber Threat Intelligence
                </h1>
                <p className="mt-2 text-sm leading-7 text-zinc-400 max-w-2xl">
                  Live signals from CISA advisories, known exploited vulnerabilities, malware indicators,
                  and security news — sourced from trusted official feeds, refreshed automatically.
                </p>
              </div>

              {/* Live indicator */}
              <div className="shrink-0 flex items-center gap-2 rounded border border-emerald-900/60 bg-emerald-950/25 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse shrink-0" />
                <div>
                  <p className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest">Live feed</p>
                  <p className="font-mono text-[9px] text-zinc-700 mt-0.5">Auto-refreshes · 5 min cache</p>
                </div>
              </div>
            </div>

            {/* Source legend */}
            <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap gap-3">
              {[
                { label: "CISA KEV",      dot: "bg-red-500",     desc: "Known Exploited"  },
                { label: "CISA Advisory", dot: "bg-amber-500",   desc: "Official Advisory" },
                { label: "MSRC",          dot: "bg-blue-500",    desc: "Microsoft Patch"  },
                { label: "ThreatFox",     dot: "bg-orange-500",  desc: "Malware IOC"      },
                { label: "URLhaus",       dot: "bg-orange-400",  desc: "Malicious URL"    },
                { label: "BleepingComputer", dot: "bg-yellow-500", desc: "Security News"  },
              ].map(({ label, dot, desc }) => (
                <span key={label} className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                  {label}
                  <span className="text-zinc-800">— {desc}</span>
                </span>
              ))}
            </div>
          </OSWindow>
        </section>

        {/* How it works — safety disclaimer */}
        <section className="mb-4">
          <OSWindow label="feed.info" title="sourcing" status="idle" className="os-panel-in">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 leading-relaxed">
                All items link directly to their original source page. Titles are never rewritten.
                Summaries are only shown when provided by the source.
                This feed does not claim zero false positives.
              </p>
            </div>
          </OSWindow>
        </section>

        {/* Live feed */}
        <section>
          <OSWindow label="threat.signals" title={`${items.length} signals active`} status={items.length > 0 ? "active" : "idle"} className="os-panel-in">
            <SignalFeedSection
              initialItems={items}
              fetchedAt={fetchedAt}
              sourceErrors={sourceErrors}
            />
          </OSWindow>
        </section>

      </div>
    </OSPageShell>
  )
}
