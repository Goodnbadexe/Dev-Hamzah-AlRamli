import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get your personalized AI plan | Goodnbad Toolkit Vault",
  description:
    "Answer a few quick questions and get a personalized AI toolkit plan — a weekly kit of curated tools and underground repos you drop straight into Claude, ChatGPT, or Codex. Arabic-first. Cancel anytime.",
  robots: { index: true, follow: true },
}

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {children}
    </div>
  )
}
