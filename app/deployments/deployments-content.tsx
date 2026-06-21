"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, Boxes, CheckCircle2, ExternalLink, Hammer, Target } from "lucide-react"
import { OSWindow } from "@/components/os"
import { useLanguage } from "@/components/language-provider"
import {
  deployments,
  getFeaturedDeployments,
  type Deployment,
  type DeploymentStatus,
} from "@/lib/content/deployments"

const featuredDeployments = getFeaturedDeployments()

// Displayed status label per language (the union itself stays English for logic).
const STATUS_LABEL: Record<DeploymentStatus, { ar: string; en: string }> = {
  Live: { ar: "حيّ", en: "Live" },
  "Case study": { ar: "دراسة حالة", en: "Case study" },
  Archived: { ar: "مؤرشف", en: "Archived" },
  Rebuilding: { ar: "قيد إعادة البناء", en: "Rebuilding" },
}

export function DeploymentsContent() {
  const { t, dir } = useLanguage()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <OSWindow label="project.registry" title="project system" status="active" className="os-panel-in">
          <div className="space-y-5" dir={dir}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
                {t("سجلّ المشاريع", "Project registry")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                {t("عمليات نشر تُظهر العمل", "Deployments that show the work")}
              </h1>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
              {t(
                "نظام مقروء من المشاريع المنشورة والنماذج الأولية ودراسات الحالة التقنية. يشرح كل ملف ماهية المشروع وسبب أهميته والأدوات المستخدمة والنتيجة.",
                "A readable system of shipped projects, prototypes, and technical case studies. Each file explains what the project is, why it mattered, the tools used, and the result.",
              )}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label={t("المشاريع المدرجة", "Projects listed")} value={deployments.length.toString()} dir={dir} />
              <Metric label={t("الروابط الحيّة", "Live links")} value={deployments.filter((item) => item.href).length.toString()} dir={dir} />
              <Metric label={t("التركيز", "Focus")} value={t("الأمن + البرمجيات", "Security + software")} dir={dir} />
            </div>
          </div>
        </OSWindow>

        <OSWindow label="featured.work" title="fast review" status="idle" className="os-panel-in">
          <div className="space-y-4" dir={dir}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {t("قائمة مختصرة", "Shortlist")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-100">{t("أفضل نقاط البداية", "Best starting points")}</h2>
            </div>
            <div className="space-y-3">
              {featuredDeployments.map((deployment) => (
                <Link
                  key={deployment.slug}
                  href={`/deployments/${deployment.slug}`}
                  dir={dir}
                  className="group block rounded-md border border-zinc-800 bg-zinc-950/40 p-3 transition hover:border-blue-800 hover:bg-zinc-950/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
                        {deployment.code}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-zinc-100">{t(deployment.shortName.ar, deployment.shortName.en)}</h3>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-700 transition group-hover:text-blue-400 rtl:rotate-180" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{t(deployment.result.ar, deployment.result.en)}</p>
                </Link>
              ))}
            </div>
          </div>
        </OSWindow>
      </section>

      <section className="mt-4">
        <div className="mb-4 flex items-center gap-3" dir={dir}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            {t("جميع ملفات المشاريع", "All project files")}
          </span>
          <span className="h-px flex-1 bg-zinc-900" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {deployments.map((deployment) => (
            <DeploymentCard key={deployment.slug} deployment={deployment} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const { t, dir } = useLanguage()
  const statusLabel = STATUS_LABEL[deployment.status]

  return (
    <OSWindow label={deployment.code.toLowerCase()} title={t(deployment.category.ar, deployment.category.en)} status={deployment.status === "Live" ? "active" : "idle"} className="os-panel-in">
      <article className="flex h-full flex-col gap-5" dir={dir}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                deployment.status === "Live"        ? "border-emerald-900 bg-emerald-950/30 text-emerald-400" :
                deployment.status === "Rebuilding" ? "border-amber-900 bg-amber-950/30 text-amber-400" :
                deployment.status === "Archived"   ? "border-zinc-800 bg-zinc-900/30 text-zinc-500" :
                                                     "border-blue-900 bg-blue-950/30 text-blue-300"
              }`}>
                {t(statusLabel.ar, statusLabel.en)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {deployment.year}
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-zinc-100">{t(deployment.name.ar, deployment.name.en)}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{t(deployment.summary.ar, deployment.summary.en)}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ProjectFact
            icon={<Boxes className="h-4 w-4" />}
            label={t("ما هو", "What it is")}
            text={t(deployment.what.ar, deployment.what.en)}
          />
          <ProjectFact
            icon={<Target className="h-4 w-4" />}
            label={t("سبب أهميته", "Why it mattered")}
            text={t(deployment.why.ar, deployment.why.en)}
          />
        </div>

        <ProjectFact
          icon={<CheckCircle2 className="h-4 w-4" />}
          label={t("النتيجة", "Result")}
          text={t(deployment.result.ar, deployment.result.en)}
        />

        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-400">
            <Hammer className="h-4 w-4" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{t("الأدوات المستخدمة", "Tools used")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {deployment.tools.map((tool) => (
              <span key={tool} dir="ltr" className="rounded border border-zinc-800 bg-zinc-950/50 px-2.5 py-1 text-xs text-zinc-300">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-zinc-800 pt-4 sm:flex-row">
          <Link
            href={`/deployments/${deployment.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-blue-800 bg-blue-950/35 px-3 py-2.5 text-sm font-semibold text-blue-300 transition hover:border-blue-600 hover:bg-blue-950/60"
          >
            {t("افتح ملف المشروع", "Open project file")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          {deployment.href && (
            <Link
              href={deployment.href}
              target={deployment.href.startsWith("http") ? "_blank" : undefined}
              rel={deployment.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
            >
              {t("زر المشروع", "Visit project")}
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </article>
    </OSWindow>
  )
}

function ProjectFact({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="flex items-center gap-2 text-blue-400">
        {icon}
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  )
}

function Metric({ label, value, dir }: { label: string; value: string; dir: "rtl" | "ltr" }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/45 p-3" dir={dir}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
      <p className="mt-2 text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  )
}
