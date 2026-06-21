import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About Hamzah Al-Ramli (Goodnbad)",
  description:
    "Hamzah Al-Ramli (Goodnbad) is a cybersecurity and automation-focused systems architect based in Saudi Arabia.",
  alternates: {
    canonical: "https://www.goodnbad.info/personnel",
  },
}

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://www.goodnbad.info/about#aboutpage",
    "url": "https://www.goodnbad.info/about",
    "name": "About Hamzah Al-Ramli (Goodnbad)",
    "mainEntity": {
      "@id": "https://www.goodnbad.info/#person",
    },
  }

  return (
    <OSPageShell osName="about.sys" label="About">
      <AboutContent />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
    </OSPageShell>
  )
}
