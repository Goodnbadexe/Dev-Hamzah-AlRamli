import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { aggregateSignalFeed } from "@/lib/signal-feed/aggregate"
import { NewsContent } from "./news-content"

// Revalidate every 5 minutes (ISR) — individual source fetches cache at their
// own rates inside aggregateSignalFeed(); the curated feed is rendered server-side.
export const revalidate = 300

export const metadata: Metadata = {
  title: "Threat Wire | Hamzah Al-Ramli",
  description:
    "Live cyber threat intelligence: CISA Known Exploited Vulnerabilities, advisories, malware IOCs, and security news — interactive threat map plus a curated live feed.",
  alternates: {
    canonical: "https://www.goodnbad.info/news",
  },
  openGraph: {
    title: "Threat Wire | Goodnbad.exe",
    description:
      "Live cyber threat intelligence — CISA KEV, advisories, malware IOCs, and security news with an interactive global threat map.",
    url: "https://www.goodnbad.info/news",
  },
}

export default async function NewsPage() {
  // Curated signal feed (KEV / advisory / IOC / news) aggregated server-side.
  const { items, fetchedAt, sourceErrors } = await aggregateSignalFeed()

  return (
    <OSPageShell osName="threat.wire" label="Cyber Threat Intelligence">
      <NewsContent
        signalItems={items}
        signalFetchedAt={fetchedAt}
        signalSourceErrors={sourceErrors}
      />
    </OSPageShell>
  )
}
