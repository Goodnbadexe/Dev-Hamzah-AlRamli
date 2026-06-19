"use client"

import Link from "next/link"
import { ArrowRight, Shield, Terminal, Layers, Zap, MapPin, GraduationCap, UserRound } from "lucide-react"
import { OSWindow } from "@/components/os"
import { useLanguage } from "@/components/language-provider"

type Bilingual = { ar: string; en: string }

const FOCUS_AREAS: {
  icon: typeof Shield
  label: Bilingual
  sub: Bilingual
  color: string
  border: string
}[] = [
  {
    icon: Shield,
    label: { ar: "الأمن السيبراني", en: "Cybersecurity" },
    sub: {
      ar: "تحليل التهديدات · الاستجابة للحوادث · إدارة الثغرات",
      en: "Threat analysis · Incident response · Vulnerability management",
    },
    color: "text-emerald-400",
    border: "border-emerald-800/50 hover:border-emerald-700",
  },
  {
    icon: Zap,
    label: { ar: "أتمتة سير العمل", en: "Workflow Automation" },
    sub: {
      ar: "n8n · مسارات API · هندسة العمليات",
      en: "n8n · API pipelines · Process engineering",
    },
    color: "text-yellow-400",
    border: "border-yellow-800/40 hover:border-yellow-700/70",
  },
  {
    icon: Terminal,
    label: { ar: "وكلاء الذكاء الاصطناعي", en: "AI Agents" },
    sub: {
      ar: "أنظمة وكلاء · تنسيق LLM · Claude Code",
      en: "Agentic systems · LLM orchestration · Claude Code",
    },
    color: "text-purple-400",
    border: "border-purple-800/40 hover:border-purple-700/70",
  },
  {
    icon: Layers,
    label: { ar: "هندسة الأنظمة", en: "Systems Architecture" },
    sub: {
      ar: "البنية الرقمية · أنماط تصميم آمنة",
      en: "Digital infrastructure · Secure design patterns",
    },
    color: "text-blue-400",
    border: "border-blue-800/40 hover:border-blue-700/70",
  },
]

const PRINCIPLES: Bilingual[] = [
  {
    ar: "التنفيذ قبل النظرية — أطلِق، كرّر، تعلّم.",
    en: "Execution over theory — ship, iterate, learn.",
  },
  {
    ar: "القابلية للتوسّع قبل الحلول المؤقتة — ابنِ لما هو قادم.",
    en: "Scalability over temporary fixes — build for what comes next.",
  },
  {
    ar: "الوضوح قبل التعقيد — أبسط تصميم يصمد.",
    en: "Clarity over complexity — the simplest design that holds.",
  },
  {
    ar: "الأمن أولاً — في كل نظام، لا الواضحة منها فحسب.",
    en: "Security-first — every system, not just the obvious ones.",
  },
]

const QUICK_FACTS: {
  icon: typeof UserRound
  label: Bilingual
  value: Bilingual
}[] = [
  {
    icon: UserRound,
    label: { ar: "الاسم المستعار", en: "Alias" },
    value: { ar: "Goodnbad.exe", en: "Goodnbad.exe" },
  },
  {
    icon: MapPin,
    label: { ar: "الموقع", en: "Location" },
    value: { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },
  },
  {
    icon: GraduationCap,
    label: { ar: "التعليم", en: "Education" },
    value: {
      ar: "بكالوريوس علوم الحاسب — Taylor's University",
      en: "BSc Computer Science — Taylor's University",
    },
  },
  {
    icon: Shield,
    label: { ar: "التركيز", en: "Focus" },
    value: { ar: "الأمن السيبراني + أتمتة الذكاء الاصطناعي", en: "Cybersecurity + AI automation" },
  },
]

const CTA_CARDS: {
  href: string
  label: Bilingual
  desc: Bilingual
  color: string
}[] = [
  {
    href: "/personnel",
    label: { ar: "الملف", en: "Dossier" },
    desc: { ar: "السيرة الكاملة والشهادات والخبرة", en: "Full CV, credentials, experience" },
    color: "border-emerald-800/60 hover:border-emerald-700",
  },
  {
    href: "/deployments",
    label: { ar: "المشاريع", en: "Projects" },
    desc: { ar: "الأنظمة المنشورة والأعمال", en: "Shipped systems and builds" },
    color: "border-blue-800/60 hover:border-blue-700",
  },
  {
    href: "/contact",
    label: { ar: "تواصل", en: "Contact" },
    desc: { ar: "افتح قناة تواصل مباشرة", en: "Open a direct channel" },
    color: "border-purple-800/60 hover:border-purple-700",
  },
]

export function AboutContent() {
  const { t, dir } = useLanguage()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">

      {/* Identity header */}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <OSWindow label="identity.brief" title="subject profile" status="active" className="os-panel-in">
          <div className="space-y-5" dir={dir}>
            <div className="flex items-center gap-2 text-emerald-500">
              <UserRound className="h-5 w-5" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {t("نبذة", "About")}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                Hamzah Al-Ramli / Goodnbad.exe
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-zinc-100 md:text-4xl">
                {t("أخصائي أمن سيبراني وأتمتة", "Cybersecurity & Automation Architect")}
              </h1>
            </div>

            <p className="text-sm leading-7 text-zinc-300 md:text-base">
              {t(
                "حمزة الرملي، المعروف رقمياً باسم Goodnbad، مفكّر أنظمة مدفوع بالأمن السيبراني يركّز على بناء بنى رقمية قابلة للتوسّع. يتمحور عمله حول الأتمتة ودمج الذكاء الاصطناعي وتنسيق سير العمل وتصميم البنية التحتية الآمنة.",
                "Hamzah Al-Ramli, known digitally as Goodnbad, is a cybersecurity-driven systems thinker focused on building scalable digital architectures. His work centers around automation, AI integration, workflow orchestration, and secure infrastructure design.",
              )}
            </p>

            <p className="text-sm leading-7 text-zinc-400">
              {t(
                "يفضّل التنفيذ على النظرية، والقابلية للتوسّع على الحلول المؤقتة، والوضوح على التعقيد. يجمع نهجه بين مبادئ الأمن السيبراني وهندسة الأتمتة لإنشاء أنظمة فعّالة ومُحكَمة وجاهزة للمستقبل.",
                "He prioritizes execution over theory, scalability over temporary fixes, and clarity over complexity. His approach combines cybersecurity principles with automation engineering to create systems that are efficient, controlled, and future-ready.",
              )}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/personnel"
                className="group inline-flex items-center gap-2 rounded border border-emerald-800 bg-emerald-950/30 px-3 py-2 font-mono text-xs text-emerald-400 transition-all hover:border-emerald-700 hover:bg-emerald-950/60"
              >
                {t("عرض الملف الكامل", "View full dossier")}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded border border-zinc-700 bg-zinc-900/40 px-3 py-2 font-mono text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200"
              >
                {t("وظّفني", "Hire me")}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </OSWindow>

        <OSWindow label="quick.facts" title="identity markers" status="idle" className="os-panel-in">
          <div className="space-y-4" dir={dir}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {t("المؤشرات", "Markers")}
            </p>

            {QUICK_FACTS.map(({ icon: Icon, label, value }) => (
              <div key={label.en} className="flex items-start gap-3 rounded-md border border-zinc-800 bg-zinc-950/35 p-3">
                <Icon className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">{t(label.ar, label.en)}</p>
                  <p className="text-sm text-zinc-200">{t(value.ar, value.en)}</p>
                </div>
              </div>
            ))}
          </div>
        </OSWindow>
      </section>

      {/* Focus areas */}
      <section className="mt-4">
        <OSWindow label="core.focus" title="what I work on" status="active" className="os-panel-in">
          <div className="mb-4" dir={dir}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              {t("مجالات التركيز الأساسية", "Core Focus Areas")}
            </p>
            <h2 className="text-xl font-semibold text-zinc-100">{t("حيث يعيش العمل", "Where the work lives")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FOCUS_AREAS.map(({ icon: Icon, label, sub, color, border }) => (
              <div
                key={label.en}
                dir={dir}
                className={`rounded-md border ${border} bg-zinc-950/45 p-4 transition-all duration-200 hover:bg-zinc-950/70`}
              >
                <Icon className={`h-5 w-5 mb-3 ${color}`} />
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">{t(label.ar, label.en)}</h3>
                <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">{t(sub.ar, sub.en)}</p>
              </div>
            ))}
          </div>
        </OSWindow>
      </section>

      {/* Principles */}
      <section className="mt-4">
        <OSWindow label="operating.principles" title="how I think" status="idle" className="os-panel-in">
          <div className="mb-4" dir={dir}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
              {t("مبادئ التشغيل", "Operating Principles")}
            </p>
            <h2 className="text-xl font-semibold text-zinc-100">{t("المنطق الموجّه", "The guiding logic")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRINCIPLES.map((principle, i) => (
              <div key={i} dir={dir} className="flex gap-3 rounded-md border border-zinc-800 bg-zinc-950/35 p-4">
                <span className="font-mono text-[10px] text-emerald-700 mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <p className="text-sm leading-6 text-zinc-300">{t(principle.ar, principle.en)}</p>
              </div>
            ))}
          </div>
        </OSWindow>
      </section>

      {/* CTA row */}
      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        {CTA_CARDS.map(({ href, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            dir={dir}
            className={`group rounded-md border ${color} bg-zinc-900/60 p-4 transition-all duration-200 hover:bg-zinc-900/90 hover:-translate-y-px hover:shadow-md os-panel-in`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-semibold text-zinc-100 mb-1">{t(label.ar, label.en)}</p>
                <p className="font-mono text-[10px] text-zinc-500">{t(desc.ar, desc.en)}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5 rtl:rotate-180" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
