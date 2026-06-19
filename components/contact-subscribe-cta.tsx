"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

/**
 * ContactSubscribeCTA — emerald OS-themed call-to-action that funnels contact
 * visitors into the /subscribe "Toolkit Vault" flow. Bilingual via useLanguage.
 */
export function ContactSubscribeCTA() {
  const { t, dir } = useLanguage()

  return (
    <Link
      href="/subscribe"
      dir={dir}
      className="group flex items-center gap-4 rounded-md border border-emerald-700 bg-emerald-950/25 p-5 transition hover:border-emerald-500 hover:bg-emerald-950/50"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-emerald-700/70 bg-emerald-950/50 text-emerald-300 transition group-hover:border-emerald-500 group-hover:text-emerald-200">
        <Lock className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-emerald-100">
          {t("اشترك في خزينة الأدوات", "Subscribe to the Toolkit Vault")}
        </span>
        <span className="mt-1 block text-sm leading-6 text-emerald-200/75">
          {t("أدوات أمن وذكاء اصطناعي أسبوعية", "Weekly security + AI tools")}
        </span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  )
}
