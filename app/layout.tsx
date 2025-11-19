import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hamzah Al‑Ramli — Cybersecurity Portfolio",
  description: "Personal CV and projects: cybersecurity, systems administration, development, and CTFs.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Hamzah Al‑Ramli — Cybersecurity Portfolio',
    description: 'Personal CV and projects with terminal, CTFs, and security atlas.',
    url: 'https://www.goodnbad.info',
    siteName: 'Goodnbad.exe',
    images: [
      { url: '/images/logo-green.png', width: 512, height: 512, alt: 'Goodnbad.exe' }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamzah Al‑Ramli — Cybersecurity Portfolio',
    description: 'CV, projects, terminal CTFs, and security atlas.',
    images: ['/images/logo-green.png']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/Taylors-University-Logo-Vector.svg-.png"
        />
        <link rel="canonical" href="https://www.goodnbad.info" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
