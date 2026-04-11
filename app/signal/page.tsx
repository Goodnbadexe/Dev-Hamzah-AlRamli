import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ArrowRight, Activity, BriefcaseBusiness, CheckCircle2, Radio, Shield } from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import { signalEntries, signalFilters, signalSummary, type SignalEntry } from "@/lib/content/signal"

export const metadata: Metadata = {
  title: "Signal Feed | Hamzah Al-Ramli",
  description:
    "A clean activity feed for Hamzah Al-Ramli: projects, credentials, site updates, and current professional signals.",
  alternates: {
    canonical: "https://www.goodnbad.info/signal",
  },
}

const typeStyles: Record<SignalEntry["type"], { icon: ReactNode; className: string }> = {
  Project: {
    icon: <BriefcaseBusiness className="h-4 w-4" />,
    className: "border-blue-900 bg-blue-950/30 text-blue-300",
  },
  Credential: {
    icon: <Shield className="h-4 w-4" />,
    className: "border-yellow-900 bg-yellow-950/25 text-yellow-300",
  },
  System: {
    icon: <Activity className="h-4 w-4" />,
    className: "border-emerald-900 bg-emerald-950/25 text-emerald-300",
  },
  Career: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "border-zinc-700 bg-zinc-950/50 text-zinc-300",
  },
}

export default function SignalPage() {
  return (
    <OSPageShell osName="signal.feed" label="Activity Feed">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <OSWindow label="activity.feed" title="clean signal" status="active" className="os-panel-in">
            <div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Radio className="h-5 w-5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Signal feed
                </p>
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                {signalSummary.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {signalSummary.description}
              </p>
            </div>
          </OSWindow>

          <OSWindow label="feed.controls" title="simple filters" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Feed status
                </p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-100">{signalSummary.status}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  This page shows selected updates only. It is intentionally quiet so visitors can understand progress quickly.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {signalFilters.map((filter) => (
                  <span
                    key={filter}
                    className="rounded border border-zinc-800 bg-zinc-950/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          </OSWindow>
        </section>

        <section className="mt-4">
          <OSWindow label="recent.activity" title="meaningful updates" status="active" className="os-panel-in">
            <div className="space-y-3">
              {signalEntries.map((entry) => (
                <SignalRow key={entry.id} entry={entry} />
              ))}
            </div>
          </OSWindow>
        </section>
      </div>
    </OSPageShell>
  )
}

function SignalRow({ entry }: { entry: SignalEntry }) {
  const type = typeStyles[entry.type]

  const content = (
    <article className="group rounded-md border border-zinc-800 bg-zinc-950/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-950/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${type.className}`}>
              {type.icon}
              {entry.type}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {entry.date}
            </span>
          </div>
          <h2 className="mt-3 text-base font-semibold text-zinc-100">{entry.title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{entry.summary}</p>
        </div>
        {entry.href && (
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700 transition group-hover:text-yellow-400" />
        )}
      </div>
    </article>
  )

  if (!entry.href) {
    return content
  }

  return (
    <Link
      href={entry.href}
      target={entry.href.startsWith("http") ? "_blank" : undefined}
      rel={entry.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="block"
    >
      {content}
    </Link>
  )
}
