import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Memory Plan | Hamzah Al-Ramli",
  description: "Personal learning plan, timeline, goals, and CTF achievements.",
  alternates: {
    canonical: "https://www.goodnbad.info/memory",
  },
}

export default function MemoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
