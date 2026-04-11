import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ArrowRight, CheckCircle2, Download, Github, Linkedin, Mail, MessageSquareText } from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import { contactActions, contactProfile, contactTopics } from "@/lib/content/contact"

export const metadata: Metadata = {
  title: "Contact | Hamzah Al-Ramli",
  description:
    "Contact Hamzah Al-Ramli for cybersecurity, IT systems, automation, software projects, recruiter outreach, and collaborations.",
  alternates: {
    canonical: "https://www.goodnbad.info/contact",
  },
}

const actionIcons: Record<string, ReactNode> = {
  "Email Hamzah": <Mail className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
  GitHub: <Github className="h-5 w-5" />,
  Resume: <Download className="h-5 w-5" />,
}

export default function ContactPage() {
  const primaryAction = contactActions.find((action) => action.primary) ?? contactActions[0]
  const secondaryActions = contactActions.filter((action) => action !== primaryAction)

  return (
    <OSPageShell osName="contact.enc" label="Contact">
      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <OSWindow label="contact.channel" title="direct contact" status="active" className="os-panel-in">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <MessageSquareText className="h-5 w-5" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Contact
                  </p>
                </div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                  {contactProfile.title}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                  {contactProfile.description}
                </p>
              </div>

              <Link
                href={primaryAction.href}
                className="group flex flex-col gap-3 rounded-md border border-emerald-800 bg-emerald-950/35 p-5 transition hover:border-emerald-600 hover:bg-emerald-950/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-1 text-emerald-300">{actionIcons[primaryAction.label]}</span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-emerald-100">{primaryAction.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-emerald-200/75">{primaryAction.description}</span>
                    <span className="mt-2 block truncate font-mono text-xs text-emerald-300/80">{primaryAction.value}</span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </OSWindow>

          <OSWindow label="response.notes" title="make outreach easy" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Best message format
                </p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-100">Send the useful details first</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{contactProfile.responseNote}</p>
              </div>
              <ul className="space-y-3 border-t border-zinc-800 pt-4">
                {contactTopics.map((topic) => (
                  <li key={topic} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </OSWindow>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {secondaryActions.map((action) => (
            <OSWindow key={action.label} label={action.label.toLowerCase()} title={action.value} status="idle" className="os-panel-in">
              <Link
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group block"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-emerald-400">{actionIcons[action.label]}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:text-emerald-400" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-zinc-100">{action.label}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{action.description}</p>
                <p className="mt-3 truncate font-mono text-[11px] text-zinc-600">{action.value}</p>
              </Link>
            </OSWindow>
          ))}
        </section>
      </div>
    </OSPageShell>
  )
}
