"use client"

import Link from "next/link"
import type { ElementType, ReactNode } from "react"
import {
  Check,
  Code2,
  Download,
  ExternalLink,
  Fingerprint,
  Github,
  LineChart,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { memoryPlan } from "@/lib/memory/plan"
import {
  certifications,
  educationTimeline,
  experienceTimeline,
  personnelIdentity,
  resumeHref,
  technicalCapabilities,
  type Certification,
} from "@/lib/content/personnel"
import { StatBand, type Stat } from "./StatBand"

type Bilingual = { ar: string; en: string }

// ── Design tokens (from the Personnel Dossier concept) ──────────────────────
const ISSUER_COLOR: Record<string, string> = {
  LetsDefend: "#f43f5e",
  Google: "#10b981",
  IBM: "#3b82f6",
  Simplilearn: "#a855f7",
  "Google Digital Academy": "#eab308",
  "Taylor's University": "#f97316",
  CASUGOL: "#22d3ee",
}

// Keyed by the stable English `key` carried on each capability group.
const CAP_STYLE: Record<string, { color: string; dim: string; meta: Bilingual; Icon: ElementType }> = {
  Cybersecurity: { color: "#f43f5e", dim: "rgba(244,63,94,.4)", meta: { ar: "تخصص أساسي", en: "core discipline" }, Icon: Shield },
  "Creative & Multimedia": { color: "#a855f7", dim: "rgba(168,85,247,.4)", meta: { ar: "حِرفة", en: "craft" }, Icon: Palette },
  Development: { color: "#3b82f6", dim: "rgba(59,130,246,.4)", meta: { ar: "هندسة", en: "engineering" }, Icon: Code2 },
  "Strategy & Tools": { color: "#10b981", dim: "rgba(16,185,129,.4)", meta: { ar: "رافعة", en: "leverage" }, Icon: LineChart },
}

// Presentational progress label per roadmap area (the data carries area + targets).
const PROG_LABEL: Record<string, Bilingual> = {
  Cybersecurity: { ar: "قيد التنفيذ", en: "in progress" },
  "Systems & DevOps": { ar: "نشط", en: "active" },
  "Full-Stack Development": { ar: "قيد الإطلاق", en: "shipping" },
}

const STAT_LABELS: Bilingual[] = [
  { ar: "الشهادات الأكاديمية", en: "Degrees" },
  { ar: "الاعتمادات", en: "Credentials" },
  { ar: "التخصصات", en: "Disciplines" },
  { ar: "القدرات", en: "Capabilities" },
]

// Section register — every section is filed as a numbered form reference.
const SECTIONS: { idx: string; code: string; title: Bilingual }[] = [
  { idx: "01", code: "capability.matrix", title: { ar: "مصفوفة القدرات", en: "Capability Matrix" } },
  { idx: "02", code: "credentials.ledger", title: { ar: "سجلّ الاعتمادات", en: "Credential Register" } },
  { idx: "03", code: "service.record", title: { ar: "سجلّ الخدمة", en: "Service Record" } },
  { idx: "04", code: "active.builds", title: { ar: "العمليات الجارية", en: "Active Operations" } },
  { idx: "05", code: "direct.channels", title: { ar: "قنوات الاتصال", en: "Establish Contact" } },
]

export function PersonnelContent() {
  const { t, dir } = useLanguage()
  const { name, alias, title, tagline, location, contact } = personnelIdentity

  // Stat band — every figure is derived from the same data the page renders.
  const capabilityCount = technicalCapabilities.reduce((n, c) => n + c.items.length, 0)
  const stats: Stat[] = [
    { to: educationTimeline.length, label: t(STAT_LABELS[0].ar, STAT_LABELS[0].en), fill: 50 },
    { to: certifications.length, label: t(STAT_LABELS[1].ar, STAT_LABELS[1].en), fill: 100 },
    { to: technicalCapabilities.length, label: t(STAT_LABELS[2].ar, STAT_LABELS[2].en), fill: 80 },
    { to: capabilityCount, plus: true, label: t(STAT_LABELS[3].ar, STAT_LABELS[3].en), fill: 90 },
  ]

  // Issuer distribution (ledger bar) — counted + ranked from the credential list.
  const issuerCounts = certifications.reduce<Record<string, number>>((m, c) => {
    m[c.issuer] = (m[c.issuer] ?? 0) + 1
    return m
  }, {})
  const issuerOrder = Object.keys(issuerCounts).sort((a, b) => issuerCounts[b] - issuerCounts[a])
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 md:py-10" dir={dir}>
        <div className="flex flex-col gap-[18px]">

          {/* ── COVER SHEET ─────────────────────────────────────────────── */}
          <Win label="personnel.exe" status="dossier · authorized access" flush className="os-panel-in dossier-grain">
            {/* classification banner — semantic emerald = cleared */}
            <ClassificationBanner />

            <div className="relative grid lg:grid-cols-[1.6fr_0.95fr]">
              {/* Left — subject brief */}
              <div className="border-b border-zinc-800/70 p-[30px] sm:p-[38px] lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l">
                <FieldLabel>{t("الموضوع / الملف", "Subject / Case File")}</FieldLabel>
                <h1 className="mt-2 text-balance text-[clamp(42px,6.4vw,72px)] font-bold leading-[0.92] tracking-[-0.038em] text-zinc-100">
                  {name}
                </h1>
                <p className="mt-3.5 font-mono text-[clamp(13px,1.5vw,16px)] font-medium tracking-[0.04em] text-emerald-500">
                  {t("اسم مستعار", "alias")} <span className="text-zinc-700">/</span> {alias}
                </p>

                <p className="mt-[22px] text-[clamp(15px,1.7vw,18px)] font-medium text-zinc-400">{title}</p>

                <p className="mt-[18px] max-w-[58ch] text-pretty text-[14.5px] leading-[1.72] text-zinc-500">
                  {t(
                    "خبير أمن سيبراني ومصمم وسائط متعددة مبدع — يجمع بين معرفة أمنية عميقة وعين للتصميم والسرد. من تحليل التهديدات والتحقيق في البرمجيات الخبيثة إلى هوية العلامة التجارية وبناء full-stack، يدور العمل دائماً حول صنع شيء ذي قيمة.",
                    "Cybersecurity expert and creative multimedia designer — combining deep security knowledge with an eye for design and storytelling. From threat analysis and malware investigation to brand identity and full-stack builds, the work is always about making something that matters.",
                  )}
                </p>

                <p className="mt-6 inline-flex items-center gap-2.5 font-mono text-[12px] tracking-[0.04em] text-emerald-400">
                  <span className="font-bold text-emerald-500 rtl:rotate-180">›</span> {tagline}
                </p>
              </div>

              {/* Right — identity card (raised surface for depth) */}
              <div className="bg-zinc-950/55 p-[26px] sm:p-[30px]">
                <IdentityCard
                  initials={initials}
                  location={location}
                  focus={t("أمن + تصميم + أتمتة", "Security + design + automation")}
                  clearance={t("مفتوح · جاهز لجهات التوظيف", "Open · recruiter-ready")}
                />
              </div>

              {/* Verdict stamp — overlaps the column seam for depth */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 -rotate-[9deg] lg:block">
                <div className="dossier-stamp px-4 py-2 text-center">
                  <div className="text-[15px] font-bold uppercase tracking-[0.18em] leading-none">{t("تم التحقق", "Verified")}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.28em] text-emerald-500/70">subject · GNB-01</div>
                </div>
              </div>
            </div>

            <StatBand stats={stats} />
          </Win>

          {/* ── 01 · CAPABILITY MATRIX ─────────────────────────────────── */}
          <section className="os-panel-in [animation-delay:80ms]">
            <SecLabel section={SECTIONS[0]} />
            <div className="grid gap-3.5 md:grid-cols-2">
              {technicalCapabilities.map((group) => (
                <DomainCard key={group.key} groupKey={group.key} label={t(group.label.ar, group.label.en)} items={group.items.map((it) => t(it.ar, it.en))} />
              ))}
            </div>
          </section>

          {/* ── 02 · CREDENTIAL REGISTER ───────────────────────────────── */}
          <section className="os-panel-in [animation-delay:120ms]">
            <SecLabel section={SECTIONS[1]} />
            <Win label="credentials.ledger" status={t("موثّق", "verified")} statusDot={false}>
              {/* summary + issuer distribution */}
              <div className="mb-[18px] flex flex-wrap items-center gap-[18px]">
                <div>
                  <div className="font-mono text-[30px] font-semibold leading-none text-zinc-100">
                    <b className="font-semibold text-emerald-500">{certifications.length}</b> {t("موثّقة", "verified")}
                  </div>
                  <div className="mt-[5px] font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                    {t("اعتماد", "credentials")} · {issuerOrder.length} {t("جهة", "issuers")}
                  </div>
                </div>
                <div className="min-w-[280px] flex-1">
                  <div className="flex h-2.5 overflow-hidden rounded-[5px] border border-zinc-800/70">
                    {issuerOrder.map((issuer) => (
                      <span
                        key={issuer}
                        className="block h-full"
                        style={{ flexGrow: issuerCounts[issuer], backgroundColor: ISSUER_COLOR[issuer] ?? "#52525b" }}
                      />
                    ))}
                  </div>
                  <div className="mt-[11px] flex flex-wrap gap-x-4 gap-y-2">
                    {issuerOrder.map((issuer) => (
                      <span key={issuer} className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.04em] text-zinc-500">
                        <i className="h-2 w-2 rounded-sm" style={{ backgroundColor: ISSUER_COLOR[issuer] ?? "#52525b" }} />
                        {issuer} <b className="ml-0.5 font-medium text-zinc-600">×{issuerCounts[issuer]}</b>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* cert cards */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert) => (
                  <CertCard key={cert.name} cert={cert} />
                ))}
              </div>
            </Win>
          </section>

          {/* ── 03 · SERVICE RECORD ────────────────────────────────────── */}
          <section className="os-panel-in [animation-delay:160ms]">
            <SecLabel section={SECTIONS[2]} />
            <div className="grid gap-3.5 lg:grid-cols-2">
              <Win label="experience.timeline" status={t("سجلّ العمل", "work history")}>
                <Timeline items={experienceTimeline} />
              </Win>
              <Win label="education.records" status={t("أكاديمي", "academic")} statusDot={false}>
                <Timeline items={educationTimeline} />
              </Win>
            </div>
          </section>

          {/* ── 04 · ACTIVE OPERATIONS (roadmap) ───────────────────────── */}
          <section className="os-panel-in [animation-delay:200ms]">
            <SecLabel section={SECTIONS[3]} trailing={t("— ما نبنيه", "— what we're building")} />
            <Win label="active.builds" status={t("المسار", "trajectory")} statusDot={false}>
              <p className="mb-4 max-w-[70ch] font-mono text-[11.5px] leading-[1.7] text-zinc-600">
                {t(
                  "إلى جانب الاعتمادات المكتسبة بالفعل، هذا هو المسار الحالي — الأنظمة والمهارات والبنية التحتية قيد التنفيذ فعلياً.",
                  "Beyond the credentials already earned, here's the current trajectory — the systems, skills, and infrastructure actively in progress.",
                )}
              </p>
              <div className="grid gap-3.5 md:grid-cols-3">
                {memoryPlan.goals.map((goal) => (
                  <BuildCard key={goal.area} area={goal.area} targets={goal.targets} />
                ))}
              </div>
            </Win>
          </section>

          {/* ── 05 · DIRECT CHANNELS ───────────────────────────────────── */}
          <section className="os-panel-in [animation-delay:240ms]">
            <SecLabel section={SECTIONS[4]} />
            <Win label="direct.channels" status={t("مفتوح", "open")} statusDot={false}>
              <div className="grid items-center gap-[30px] lg:grid-cols-[1fr_auto]">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <Channel Icon={Mail} k={t("البريد", "Email")} v={contact.email} href={`mailto:${contact.email}`} />
                  <Channel Icon={Phone} k={t("الهاتف", "Phone")} v={contact.phone} href={`tel:${contact.phone.replace(/\s+/g, "")}`} />
                  <Channel Icon={Linkedin} k="LinkedIn" v="in/hamzah-al-ramli-505" href={contact.linkedin} external />
                  <Channel Icon={Github} k="GitHub" v="github.com/Goodnbadexe" href={contact.github} external />
                </div>
                <div className="flex flex-col items-stretch gap-3 lg:min-w-[230px] lg:items-end">
                  <p className="font-mono text-[10px] leading-[1.7] text-zinc-600 lg:text-right rtl:lg:text-left">
                    <span className="text-emerald-500">$</span> {t("الملف المهني الكامل", "full professional profile")}
                    <br />
                    {t("أسرع طريق لمراجعة جهات التوظيف", "fastest path for recruiter review")}
                  </p>
                  <Link
                    href={resumeHref}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2.5 rounded-[7px] border border-emerald-500 bg-emerald-500 px-[22px] py-[13px] font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-950 transition-all duration-200 hover:-translate-y-px hover:bg-emerald-400 hover:shadow-[0_0_22px_rgba(16,185,129,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    <Download className="h-[15px] w-[15px]" />
                    {t("تحميل السيرة الذاتية", "Download resume")}
                  </Link>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-700 lg:text-right rtl:lg:text-left" dir="ltr">
                    hamzah-al-ramli-resume.pdf
                  </span>
                </div>
              </div>
            </Win>
          </section>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 mt-[30px] border-t border-zinc-800/70 bg-zinc-950/40" dir={dir}>
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-2.5 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-700 sm:flex-row sm:items-center sm:px-8">
          <span>{t("ملف الموظف متزامن", "personnel file synced")} — GOODNBAD.EXE © {new Date().getFullYear()}</span>
          <div className="flex gap-5">
            <Link href={contact.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-400">GitHub</Link>
            <Link href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-400">LinkedIn</Link>
            <Link href={resumeHref} target="_blank" className="transition-colors hover:text-zinc-400">{t("السيرة الذاتية", "Resume")} ↗</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

// ── Classification banner — edge-to-edge cleared strip ──────────────────────
function ClassificationBanner() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3 border-b border-emerald-900/60 bg-emerald-950/20 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-emerald-500/90 sm:px-[38px]">
      <span className="flex items-center gap-2">
        <span className="os-signal-dot" aria-hidden />
        {t("سري · مُصرّح للإفراج", "Confidential · Cleared for Release")}
      </span>
      <span aria-hidden className="hidden flex-1 truncate text-emerald-900/70 sm:block">
        {"// ".repeat(18)}
      </span>
      <span className="ml-auto shrink-0 tracking-[0.18em] text-zinc-600">file&nbsp;#GNB-01</span>
    </div>
  )
}

// ── Identity card — raised passport-style panel with barcode (depth) ────────
function IdentityCard({
  initials,
  location,
  focus,
  clearance,
}: {
  initials: string
  location: string
  focus: string
  clearance: string
}) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-zinc-800 bg-zinc-900/55 p-[18px] shadow-[0_24px_60px_-26px_rgba(0,0,0,0.85)]">
      {/* card header */}
      <div className="flex items-center gap-2 border-b border-zinc-800/70 pb-2.5">
        <Fingerprint className="h-3.5 w-3.5 text-emerald-500" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{t("بطاقة الهوية", "Identity Card")}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-emerald-400">{t("متاح", "Available")}</span>
        </span>
      </div>

      {/* monogram + barcode */}
      <div className="flex items-stretch gap-3">
        <div className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-[8px] border border-emerald-900/70 bg-emerald-950/20 font-mono text-[22px] font-bold tracking-[0.04em] text-emerald-400">
          {initials}
        </div>
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div className="dossier-barcode h-[26px] w-full rounded-[3px]" aria-hidden />
          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-zinc-700" dir="ltr">SUBJECT&nbsp;ID&nbsp;·&nbsp;GNB-01-HA</span>
        </div>
      </div>

      {/* field rows */}
      <div className="flex flex-col gap-2">
        <Fact Icon={MapPin} k={t("الموقع", "Location")} v={location} />
        <Fact Icon={ShieldCheck} k={t("التركيز", "Focus")} v={focus} />
        <Fact Icon={UserRound} k={t("التصريح", "Clearance")} v={clearance} />
      </div>

      <p className="font-mono text-[9.5px] leading-[1.7] text-zinc-600">
        {t(
          "متاح لفرص الأمن السيبراني واستخبارات التهديدات وتصميم الوسائط المتعددة وتطوير full-stack — عن بُعد وفي الموقع في دول الخليج.",
          "Open to cybersecurity, threat intelligence, multimedia design & full-stack work — remote & on-site across the GCC.",
        )}
      </p>
    </div>
  )
}

// ── Window chrome (Personnel Dossier .win) ──────────────────────────────────
function Win({
  label,
  status,
  statusDot = true,
  flush,
  className,
  children,
}: {
  label: string
  status?: string
  statusDot?: boolean
  flush?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border border-zinc-800 bg-zinc-900/[0.62] backdrop-blur-[10px]",
        className,
      )}
    >
      <div className="flex h-[34px] items-center gap-2.5 border-b border-zinc-800/70 bg-zinc-950/50 px-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
        <span className="mr-1 flex gap-1.5">
          <i className="block h-[9px] w-[9px] rounded-full bg-zinc-800" />
          <i className="block h-[9px] w-[9px] rounded-full bg-zinc-800" />
          <i className="block h-[9px] w-[9px] rounded-full bg-emerald-950" />
        </span>
        <span className="text-zinc-500">{label}</span>
        {status && (
          <span className="ml-auto flex items-center gap-1.5 text-zinc-600">
            {statusDot && (
              <span className="h-[5px] w-[5px] rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
            )}
            {status}
          </span>
        )}
      </div>
      {flush ? children : <div className="p-[26px]">{children}</div>}
    </div>
  )
}

// ── Section header — filed as a numbered form reference (tab + code + title) ──
function SecLabel({ section, trailing }: { section: { idx: string; code: string; title: Bilingual }; trailing?: string }) {
  const { t } = useLanguage()
  return (
    <div className="mb-3.5 flex items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-[5px] border border-emerald-900/70 bg-emerald-950/15 px-2.5 py-[5px]">
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-emerald-500">{section.idx}</span>
        <span className="h-3 w-px bg-emerald-900/70" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{section.code}</span>
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
        {t(section.title.ar, section.title.en)}
        {trailing && <span className="ml-2 normal-case tracking-normal text-zinc-700">{trailing}</span>}
      </span>
      <span className="h-px flex-1 bg-zinc-800/70" />
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-700">{children}</p>
}

function Fact({ Icon, k, v }: { Icon: ElementType; k: string; v: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
      <span className="min-w-[58px] font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-700">{k}</span>
      <span className="text-[13px] text-zinc-400">{v}</span>
    </div>
  )
}

function DomainCard({ groupKey, label, items }: { groupKey: string; label: string; items: string[] }) {
  const { t } = useLanguage()
  const s = CAP_STYLE[groupKey] ?? { color: "#71717a", dim: "rgba(113,113,122,.4)", meta: { ar: "", en: "" }, Icon: Sparkles }
  const Icon = s.Icon
  return (
    <div
      className="rounded-[9px] border border-zinc-800 bg-zinc-900/50 p-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800/40"
      style={{ borderInlineStartWidth: 3, borderInlineStartColor: s.color }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-[30px] w-[30px] place-items-center rounded-[7px] border bg-white/[0.02]"
          style={{ borderColor: s.dim, color: s.color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold tracking-[-0.01em] text-zinc-100">{label}</h3>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: s.color }}>
            {t(s.meta.ar, s.meta.en)}
          </div>
        </div>
        <span className="font-mono text-[11px] text-zinc-600">{String(items.length).padStart(2, "0")}</span>
      </div>
      <ul className="mt-3.5 flex flex-col gap-[7px]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-zinc-500">
            <span className="mt-1.5 h-[5px] w-[5px] shrink-0 rounded-[1.5px] opacity-90" style={{ backgroundColor: s.color }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CertCard({ cert }: { cert: Certification }) {
  const { t } = useLanguage()
  const color = ISSUER_COLOR[cert.issuer] ?? "#52525b"
  const credentialId = cert.credentialId

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-0.5 opacity-0 transition-opacity duration-200 group-hover/cert:opacity-70 group-focus-visible/cert:opacity-70 rtl:left-auto rtl:right-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between gap-2.5">
        <span
          className="rounded font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color, border: `1px solid ${color}59`, backgroundColor: `${color}1a`, padding: "3px 7px" }}
        >
          {cert.issuer}
        </span>
        {cert.href && (
          <ExternalLink className="h-[13px] w-[13px] shrink-0 text-zinc-700 transition-colors group-hover/cert:text-emerald-500 group-focus-visible/cert:text-emerald-500" />
        )}
      </div>
      <h4 className="mt-3 flex-1 text-[13.5px] font-semibold leading-[1.35] text-zinc-100">{cert.name}</h4>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-zinc-600">{cert.date}</span>
        {credentialId ? (
          <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-zinc-700">ID: {credentialId}</span>
        ) : (
          <span className="flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-emerald-500/80">
            <Check className="h-2.5 w-2.5" /> {t("موثّق", "verified")}
          </span>
        )}
      </div>
    </>
  )

  const cardClass =
    "group/cert relative flex flex-col overflow-hidden rounded-[9px] border border-zinc-800 bg-zinc-950/40 p-[15px] transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800/40 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"

  return cert.href ? (
    <Link href={cert.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {inner}
    </Link>
  ) : (
    <div className={cardClass}>{inner}</div>
  )
}

type TLItem = { date: string; title: string; details: string[] }

function Timeline({ items }: { items: TLItem[] }) {
  return (
    <div className="relative mt-4 pl-[22px] rtl:pl-0 rtl:pr-[22px]">
      <span aria-hidden className="absolute bottom-1.5 left-[5px] top-1.5 w-px bg-zinc-800 rtl:left-auto rtl:right-[5px]" />
      <div className="flex flex-col">
        {items.map((it, i) => {
          const active = /present/i.test(it.date)
          return (
            <div key={it.title} className={i < items.length - 1 ? "relative pb-4" : "relative"}>
              <span
                aria-hidden
                className={cn(
                  "absolute left-[-22px] top-[5px] h-[11px] w-[11px] rounded-full border-2 bg-zinc-950 shadow-[0_0_0_3px_theme(colors.zinc.950)] rtl:left-auto rtl:right-[-22px]",
                  active
                    ? "border-emerald-500 bg-emerald-950 shadow-[0_0_0_3px_theme(colors.zinc.950),0_0_9px_rgba(16,185,129,0.5)]"
                    : "border-emerald-900/70",
                )}
              />
              <span className="inline-flex items-center gap-1.5 rounded border border-emerald-900/70 bg-emerald-950/15 px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em] text-emerald-500">
                {active && <span className="h-[5px] w-[5px] rounded-full bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]" />}
                {it.date}
              </span>
              <h4 className="mt-2.5 text-[13.5px] font-semibold leading-[1.4] text-zinc-100">{it.title}</h4>
              <ul className="mt-2 flex flex-col gap-1.5">
                {it.details.map((d) => (
                  <li key={d} className="flex gap-2 text-[12px] leading-[1.5] text-zinc-500">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-700" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BuildCard({ area, targets }: { area: string; targets: string[] }) {
  const { t } = useLanguage()
  const prog = PROG_LABEL[area] ?? { ar: "نشط", en: "active" }
  return (
    <div className="rounded-[9px] border border-zinc-800 bg-zinc-900/50 p-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-900/70">
      <div className="flex items-center gap-2.5 border-b border-zinc-800/70 pb-3">
        <span className="rounded border border-emerald-900/70 bg-emerald-950/15 px-1.5 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-500">
          {area}
        </span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-600">{t(prog.ar, prog.en)}</span>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {targets.map((tg) => (
          <li key={tg} className="flex gap-2.5 text-[12.5px] leading-[1.5] text-zinc-500">
            <span className="mt-0.5 grid h-[13px] w-[13px] shrink-0 place-items-center rounded-[3px] border border-emerald-900/70 text-emerald-500">
              <Check className="h-2.5 w-2.5" />
            </span>
            <span>{tg}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Channel({ Icon, k, v, href, external }: { Icon: ElementType; k: string; v: string; href: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3.5 py-3 transition-all duration-200 hover:-translate-y-px hover:border-emerald-900/70 hover:bg-emerald-950/15 focus-visible:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
    >
      <Icon className="h-4 w-4 shrink-0 text-emerald-500" />
      <span className="min-w-0">
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-700">{k}</span>
        <span className="mt-0.5 block truncate font-mono text-[12px] text-zinc-400" dir="ltr">{v}</span>
      </span>
    </Link>
  )
}
