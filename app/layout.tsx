import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Noto_Kufi_Arabic } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FullscreenButton } from "@/components/fullscreen"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })
const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Hamzah Al-Ramli (Goodnbad) | Cybersecurity & Automation Architect",
  description: "Hamzah Al-Ramli (Goodnbad) is a cybersecurity and automation-focused systems architect based in Saudi Arabia, specializing in digital infrastructure optimization, workflow automation, and security-driven architecture design.",
  metadataBase: new URL('https://www.goodnbad.info'),
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    "cybersecurity portfolio", "ethical hacker", "penetration testing", "malware analysis", 
    "Microsoft Azure security", "Entra ID", "cybersecurity expert", "threat detection",
    "vulnerability assessment", "network security", "information security", "CTF",
    "cybersecurity certifications", "reverse engineering", "security risk management",
    "Hamzah Al-Ramli", "Goodnbad.exe", "cybersecurity professional", "security analyst",
    "certified ethical hacker", "CEH", "CompTIA Security+", "Microsoft security",
    "Azure security engineer", "incident response", "digital forensics", "cybersecurity consultant",
    "threat hunting", "security architecture", "risk assessment", "compliance security",
    "Saudi Arabia cybersecurity", "Middle East security expert", "GCC cybersecurity",
    "enterprise security solutions", "security audit", "vulnerability management",
    "security operations center", "SOC analyst", "security information management",
    "cybersecurity training", "security awareness", "phishing simulation", "security testing"
  ],
  authors: [{ name: "Hamzah Al-Ramli", url: "https://www.goodnbad.info" }],
  creator: "Hamzah Al-Ramli",
  publisher: "Goodnbad",
  openGraph: {
    title: 'Hamzah Al-Ramli - Certified Cybersecurity Expert & Ethical Hacker',
    description: 'Certified cybersecurity professional with expertise in ethical hacking, Microsoft security solutions, malware analysis, and advanced threat protection. View my security portfolio, certifications, and enterprise security experience.',
    url: 'https://www.goodnbad.info',
    siteName: 'Goodnbad.exe - Cybersecurity Professional Portfolio',
    images: [
      { url: '/images/logo-green.png', width: 512, height: 512, alt: 'Hamzah Al-Ramli Cybersecurity Expert Portfolio - Certified Security Professional' }
    ],
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamzah Al-Ramli - Cybersecurity Expert & Ethical Hacker Portfolio',
    description: 'Certified cybersecurity professional specializing in ethical hacking, malware analysis, Microsoft enterprise security solutions, and advanced threat protection.',
    images: ['/images/logo-green.png'],
    creator: '@Goodnbadexe'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},

  alternates: {
    canonical: 'https://www.goodnbad.info',
    languages: {
      'en-US': 'https://www.goodnbad.info',
    },
  },
  category: 'cybersecurity',
  classification: 'Cybersecurity Professional Portfolio',
  other: {
    'page-topic': 'Cybersecurity, Ethical Hacking, Penetration Testing',
    'page-type': 'Portfolio',
    'audience': 'Security professionals, recruiters, enterprises',
    'author': 'Hamzah Al-Ramli',
    'copyright': '© 2024 Hamzah Al-Ramli. All rights reserved.',
    'reply-to': 'contact@goodnbad.info',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '7 days',
    'language': 'en-us',
    'geo.region': 'SA',
    'geo.placename': 'Saudi Arabia',
    'geo.position': '24.7136;46.6753',
    'ICBM': '24.7136, 46.6753'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.goodnbad.info/#person",
        "name": "Hamzah Al-Ramli",
        "alternateName": ["Goodnbad", "goodnbad.exe", "goodnbad505"],
        "url": "https://www.goodnbad.info",
        "image": "https://www.goodnbad.info/images/logo-green.png",
        "email": "mailto:Goodnbadexe@hotmail.com",
        "jobTitle": "Cybersecurity and Automation Architect",
        "description": "Hamzah Al-Ramli (Goodnbad) is a cybersecurity and automation-focused systems architect based in Saudi Arabia. He specializes in digital infrastructure optimization, workflow automation, and security-driven architecture design.",
        "nationality": {
          "@type": "Country",
          "name": "Saudi Arabia"
        },
        "knowsAbout": [
          "Cybersecurity",
          "Ethical Hacking",
          "Workflow Automation",
          "n8n",
          "AI Agents",
          "Systems Architecture",
          "Digital Infrastructure",
          "IT Optimization",
          "Process Engineering"
        ],
        "sameAs": [
          "https://www.linkedin.com/in/hamzah-al-ramli-505",
          "https://github.com/Goodnbadexe"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.goodnbad.info/#website",
        "url": "https://www.goodnbad.info",
        "name": "Goodnbad",
        "publisher": {
          "@id": "https://www.goodnbad.info/#person"
        }
      }
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/Taylors-University-Logo-Vector.svg-.png"
        />
        <link rel="canonical" href="https://www.goodnbad.info" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} ${notoKufiArabic.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <FullscreenButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
