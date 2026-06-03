import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security News | Hamzah Al-Ramli",
  description:
    "Latest CISA Known Exploited Vulnerabilities and cybersecurity news curated for security professionals.",
  alternates: {
    canonical: "https://www.goodnbad.info/news",
  },
  openGraph: {
    title: "Security News | Goodnbad.exe",
    description:
      "Latest CISA Known Exploited Vulnerabilities and cybersecurity news curated for security professionals.",
    url: "https://www.goodnbad.info/news",
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
