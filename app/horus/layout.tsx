import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HORUS Eye | Hamzah Al-Ramli",
  description:
    "HORUS-EYE Intelligence Platform: live aircraft tracking via OpenSky Network with real-time globe visualization.",
  alternates: {
    canonical: "https://www.goodnbad.info/horus",
  },
  openGraph: {
    title: "HORUS Eye Intelligence Platform | Goodnbad.exe",
    description:
      "Live aircraft and global intelligence tracking platform built by Hamzah Al-Ramli.",
    url: "https://www.goodnbad.info/horus",
  },
}

export default function HorusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
