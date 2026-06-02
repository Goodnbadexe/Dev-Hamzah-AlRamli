import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Security Atlas | Hamzah Al-Ramli",
  description: "Live threat intelligence dashboard — real-time global attack visualisation, malware tracking, and cybersecurity incident mapping by Hamzah Al-Ramli.",
  alternates: { canonical: "https://www.goodnbad.info/security" },
  openGraph: {
    title: "Security Atlas — Live Threat Intelligence",
    description: "Real-time global attack map and cybersecurity threat tracking by Hamzah Al-Ramli (Goodnbad).",
    url: "https://www.goodnbad.info/security",
    images: [{ url: "/images/newlogovector.png", width: 512, height: 512 }],
  },
}

export default function SecurityLayout({ children }: { children: ReactNode }) {
  return children
}
