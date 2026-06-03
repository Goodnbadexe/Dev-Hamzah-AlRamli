import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Repo Vault — Subscribe | Hamzah Al-Ramli",
  description:
    "Subscribe to Repo Vault — a curated weekly digest of underground GitHub repositories, hand-picked for builders, automators, and side-project hackers.",
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
