import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { SignalPageLayout } from "@/components/signal/SignalPageLayout"
import { aggregateSignalFeed } from "@/lib/signal-feed/aggregate"

export const metadata: Metadata = {
  title: "Signal | Hamzah Al-Ramli",
  description:
    "Live cyber-threat signal feed: KEV exploits, vendor advisories, IOCs and security news, aggregated and deduplicated in real time.",
  alternates: {
    canonical: "https://www.goodnbad.info/signal",
  },
}

// The feed aggregates live external sources on every request — never statically
// cache the page itself (the API route handles its own SWR caching).
export const dynamic = "force-dynamic"

export default async function SignalPage() {
  const { items, fetchedAt, sourceErrors } = await aggregateSignalFeed()

  return (
    <OSPageShell osName="signal.exe" label="Threat Signal Feed">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <SignalPageLayout
          initialItems={items}
          fetchedAt={fetchedAt}
          sourceErrors={sourceErrors}
        />
      </div>
    </OSPageShell>
  )
}
