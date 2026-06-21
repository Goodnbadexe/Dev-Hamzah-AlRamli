import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { SecurityContent } from "./security-content"

export const metadata: Metadata = {
  title: "Security Atlas | Hamzah Al-Ramli",
  description:
    "Live threat intelligence dashboard — real-time global attack visualisation, malware tracking, and cybersecurity incident mapping by Hamzah Al-Ramli.",
  alternates: { canonical: "https://www.goodnbad.info/security" },
  openGraph: {
    title: "Security Atlas — Live Threat Intelligence",
    description:
      "Real-time global attack map and cybersecurity threat tracking by Hamzah Al-Ramli (Goodnbad).",
    url: "https://www.goodnbad.info/security",
    images: [{ url: "/images/newlogovector.png", width: 512, height: 512 }],
  },
}

export default function SecurityPage() {
  return (
    <OSPageShell osName="security.atlas" label="Security Atlas">
      <SecurityContent />
    </OSPageShell>
  )
}
