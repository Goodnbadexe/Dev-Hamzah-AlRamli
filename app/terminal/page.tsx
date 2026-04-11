import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, BriefcaseBusiness, CircleHelp, Keyboard, Mail, UserRound } from "lucide-react"
import { HackerTerminal } from "@/components/hacker-terminal"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"

export const metadata: Metadata = {
  title: "Terminal | Goodnbad.exe",
  description:
    "Optional advanced command interface for Goodnbad.exe. Normal navigation remains available through the main website pages.",
  robots: { index: false },
}

const standardRoutes = [
  {
    href: "/personnel",
    label: "Career dossier",
    description: "Resume, experience, education, certifications, and technical capabilities.",
    icon: <UserRound className="h-4 w-4" />,
  },
  {
    href: "/deployments",
    label: "Projects",
    description: "Readable project files with tools, purpose, and outcomes.",
    icon: <BriefcaseBusiness className="h-4 w-4" />,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Direct email, LinkedIn, GitHub, and resume links.",
    icon: <Mail className="h-4 w-4" />,
  },
]

export default function TerminalPage() {
  return (
    <OSPageShell osName="terminal.sh" label="Advanced Terminal">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/45 px-3 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to normal site
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <OSWindow label="advanced.mode" title="system terminal" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Keyboard className="h-5 w-5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  raw access
                </p>
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                System Terminal
              </h1>
              <p className="text-sm leading-7 text-zinc-300 md:text-base">
                This interface allows for deep system exploration and technical interaction. It is strictly optional and not required to review standard dossier materials.
              </p>
            </div>
          </OSWindow>

          <OSWindow label="normal.navigation" title="recommended paths" status="active" className="os-panel-in">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CircleHelp className="h-5 w-5" />
                <h2 className="text-xl font-semibold text-zinc-100">Need the normal pages?</h2>
              </div>
              <p className="text-sm leading-6 text-zinc-400">
                Use these if you are reviewing Hamzah professionally.
              </p>
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                {standardRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="flex items-start gap-3 rounded-md border border-zinc-800 bg-zinc-950/40 p-3 transition hover:border-emerald-900 hover:bg-zinc-950/70"
                  >
                    <span className="mt-1 text-emerald-500">{route.icon}</span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-100">{route.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-zinc-500">{route.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </OSWindow>
        </section>

        <section className="mt-4">
          <OSWindow label="terminal.session" title="interactive command interface" status="active" className="os-panel-in">
            <div className="mb-4 rounded-md border border-zinc-800 bg-zinc-950/45 p-3 text-xs leading-6 text-zinc-400 font-mono">
              System ready. Try <span className="text-emerald-400">help</span>, <span className="text-emerald-400">ls</span>, or <span className="text-emerald-400">cat ~/README.md</span>.
            </div>
            <HackerTerminal />
          </OSWindow>
        </section>
      </div>
    </OSPageShell>
  )
}
