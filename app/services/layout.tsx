import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | Hamzah Al-Ramli",
  description:
    "Cybersecurity services: penetration testing, security audits, Microsoft Azure hardening, malware analysis, and security awareness training.",
  alternates: {
    canonical: "https://www.goodnbad.info/services",
  },
  openGraph: {
    title: "Cybersecurity Services | Goodnbad.exe",
    description:
      "Penetration testing, security audits, Microsoft Azure hardening, malware analysis, and security awareness training by Hamzah Al-Ramli.",
    url: "https://www.goodnbad.info/services",
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
