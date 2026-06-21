"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, CheckCircle2, Download, Github, Linkedin, Mail, MessageSquareText } from "lucide-react"
import { OSWindow } from "@/components/os"
import { useLanguage } from "@/components/language-provider"
import { ContactSubscribeCTA } from "@/components/contact-subscribe-cta"
import {
  contactActions,
  contactEyebrow,
  contactProfile,
  contactResponseHeader,
  contactTopics,
} from "@/lib/content/contact"

const actionIcons: Record<string, ReactNode> = {
  "Email Hamzah": <Mail className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
  GitHub: <Github className="h-5 w-5" />,
  Resume: <Download className="h-5 w-5" />,
}

export function ContactContent() {
  const { t, dir } = useLanguage()

  const primaryAction = contactActions.find((action) => action.primary) ?? contactActions[0]
  const secondaryActions = contactActions.filter((action) => action !== primaryAction)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <OSWindow label="contact.channel" title="direct contact" status="active" className="os-panel-in">
          <div className="space-y-6" dir={dir}>
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageSquareText className="h-5 w-5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  {t(contactEyebrow.ar, contactEyebrow.en)}
                </p>
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                {t(contactProfile.title.ar, contactProfile.title.en)}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {t(contactProfile.description.ar, contactProfile.description.en)}
              </p>
            </div>

            <Link
              href={primaryAction.href}
              className="group flex flex-col gap-3 rounded-md border border-emerald-800 bg-emerald-950/35 p-5 transition hover:border-emerald-600 hover:bg-emerald-950/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex min-w-0 items-start gap-3">
                <span className="mt-1 text-emerald-300">{actionIcons[primaryAction.key]}</span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold text-emerald-100">
                    {t(primaryAction.label.ar, primaryAction.label.en)}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-emerald-200/75">
                    {t(primaryAction.description.ar, primaryAction.description.en)}
                  </span>
                  <span className="mt-2 block truncate font-mono text-xs text-emerald-300/80" dir="ltr">
                    {primaryAction.value}
                  </span>
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400 transition group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>

            <ContactSubscribeCTA />
          </div>
        </OSWindow>

        <OSWindow label="response.notes" title="make outreach easy" status="idle" className="os-panel-in">
          <div className="space-y-4" dir={dir}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {t(contactResponseHeader.eyebrow.ar, contactResponseHeader.eyebrow.en)}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-100">
                {t(contactResponseHeader.title.ar, contactResponseHeader.title.en)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {t(contactProfile.responseNote.ar, contactProfile.responseNote.en)}
              </p>
            </div>
            <ul className="space-y-3 border-t border-zinc-800 pt-4">
              {contactTopics.map((topic) => (
                <li key={topic.en} className="flex gap-3 text-sm leading-6 text-zinc-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{t(topic.ar, topic.en)}</span>
                </li>
              ))}
            </ul>
          </div>
        </OSWindow>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {secondaryActions.map((action) => (
          <OSWindow key={action.key} label={action.key.toLowerCase()} title={action.value} status="idle" className="os-panel-in">
            <Link
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block"
              dir={dir}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-emerald-400">{actionIcons[action.key]}</span>
                <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:text-emerald-400 rtl:rotate-180" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                {t(action.label.ar, action.label.en)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {t(action.description.ar, action.description.en)}
              </p>
              <p className="mt-3 truncate font-mono text-[11px] text-zinc-600" dir="ltr">
                {action.value}
              </p>
            </Link>
          </OSWindow>
        ))}
      </section>
    </div>
  )
}
