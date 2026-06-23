import type { Metadata } from "next"

// /news is retired and redirects to /signal. Canonicalize to /signal so search
// engines consolidate any legacy /news links onto the live feed.
export const metadata: Metadata = {
  title: "Threat Intel | Hamzah Al-Ramli",
  description:
    "Live CISA Known Exploited Vulnerabilities and cybersecurity intelligence — now at /signal.",
  alternates: {
    canonical: "https://www.goodnbad.info/signal",
  },
  robots: { index: false, follow: true },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
