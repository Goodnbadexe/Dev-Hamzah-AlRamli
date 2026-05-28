import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import {
  ArrowDownToLine,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Shield,
  Sparkles,
  Terminal,
  UserRound,
} from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import {
  certifications,
  educationTimeline,
  experienceTimeline,
  personnelIdentity,
  recruiterHighlights,
  resumeHref,
  technicalCapabilities,
} from "@/lib/content/personnel"

export const metadata: Metadata = {
  title: "Personnel File | Hamzah Al-Ramli",
  description:
    "Recruiter-friendly dossier for Hamzah Al-Ramli: experience, education, certifications, technical capabilities, and resume.",
  alternates: {
    canonical: "https://www.goodnbad.info/personnel",
  },
}

// Skill group accent colors: maps to the site's established tech-exp color system
const CAPABILITY_ACCENTS: Record<string, { border: string; dot: string; heading: string; bg: string }> = {
  "Cybersecurity Operations":  { border: "border-l-red-500/50",    dot: "bg-red-500",    heading: "text-red-300",    bg: "hover:border-red-800/60" },
  "Systems & Infrastructure":  { border: "border-l-blue-500/50",   dot: "bg-blue-500",   heading: "text-blue-300",   bg: "hover:border-blue-800/60" },
  "Software Engineering":      { border: "border-l-emerald-500/50", dot: "bg-emerald-500", heading: "text-emerald-300", bg: "hover:border-emerald-800/60" },
  "Automation & Tooling":      { border: "border-l-purple-500/50", dot: "bg-purple-500", heading: "text-purple-300", bg: "hover:border-purple-800/60" },
}

export default function PersonnelPage() {
  return (
    <OSPageShell osName="personnel.exe" label="Career & Credentials">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">

        {/* ── Row 1: Identity + Signal panel ── */}
        <section className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">

          <OSWindow label="identity.summary" title="professional profile" status="active" className="os-panel-in">
            <div className="flex flex-col gap-6">

              {/* Classification strip */}
              <div className="flex items-center gap-3 rounded border border-emerald-900/60 bg-emerald-950/20 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-600">
                  Dossier — Authorized Access Only
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-emerald-800">
                  clearance: open
                </span>
              </div>

              {/* Name block + availability badge */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Subject / Personnel
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-zinc-100 md:text-5xl">
                    {personnelIdentity.name}
                  </h1>
                  <p className="mt-2 font-mono text-sm text-zinc-400 md:text-base">
                    {personnelIdentity.title}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="rounded border border-emerald-900/70 bg-emerald-950/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-emerald-400">
                    Available
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-700">
                    status: active
                  </span>
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {personnelIdentity.summary}
              </p>

              {/* Quick facts row */}
              <div className="grid gap-2 sm:grid-cols-3">
                <InfoPill icon={<UserRound className="h-3.5 w-3.5" />} label="Alias" value={personnelIdentity.alias} />
                <InfoPill icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={personnelIdentity.location} />
                <InfoPill icon={<Shield className="h-3.5 w-3.5" />} label="Focus" value="Cybersecurity + automation" />
              </div>

              {/* CTA row */}
              <div className="flex flex-col gap-3 border-t border-zinc-800/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[11px] leading-6 text-zinc-500">
                  <span className="mr-2 text-emerald-700">$</span>
                  {personnelIdentity.availability}
                </p>
                <Link
                  href={resumeHref}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded border border-emerald-800 bg-emerald-950/50 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition duration-200 hover:border-emerald-600 hover:bg-emerald-950 hover:text-emerald-200 hover:shadow-[0_0_16px_rgba(16,185,129,0.12)]"
                >
                  <ArrowDownToLine className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  Download resume
                </Link>
              </div>
            </div>
          </OSWindow>

          {/* Hiring signal panel */}
          <OSWindow label="quick.read" title="why shortlist" status="idle" className="os-panel-in [animation-delay:80ms]">
            <div className="flex h-full flex-col gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Hiring signal
                </p>
                <h2 className="mt-1.5 text-lg font-semibold text-zinc-100">Fast reasons to review</h2>
              </div>

              {/* Audit log entries */}
              <ul className="space-y-2.5">
                {recruiterHighlights.map((highlight, i) => (
                  <li
                    key={highlight}
                    className="relative rounded border border-zinc-800/60 bg-zinc-950/30 px-3 py-2.5 text-xs leading-5 text-zinc-300 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-950/50"
                  >
                    <span className="mr-2 font-mono text-[9px] text-zinc-700">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Contact links */}
              <div className="mt-auto space-y-1.5 border-t border-zinc-800/60 pt-4">
                <p className="mb-2.5 font-mono text-[9px] uppercase tracking-widest text-zinc-700">
                  Direct channels
                </p>
                <ContactLink
                  href={`mailto:${personnelIdentity.contact.email}`}
                  label={personnelIdentity.contact.email}
                  icon={<Mail className="h-3 w-3" />}
                />
                <ContactLink
                  href={personnelIdentity.contact.linkedin}
                  label="linkedin.com/in/hamzah-al-ramli"
                  icon={<Linkedin className="h-3 w-3" />}
                  external
                />
                <ContactLink
                  href={personnelIdentity.contact.github}
                  label="github.com/Goodnbadexe"
                  icon={<Github className="h-3 w-3" />}
                  external
                />
              </div>
            </div>
          </OSWindow>
        </section>

        {/* ── Row 2: Experience + Education ── */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">

          <OSWindow label="experience.timeline" title="work history" status="active" className="os-panel-in [animation-delay:120ms]">
            <SectionHeading
              icon={<BriefcaseBusiness className="h-4.5 w-4.5" />}
              eyebrow="Experience"
              title="Professional timeline"
            />
            <div className="relative mt-5">
              {/* Vertical connector line */}
              <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-zinc-800" />
              <div className="space-y-3 pl-5">
                {experienceTimeline.map((item, i) => (
                  <TimelineCard
                    key={item.title}
                    date={item.date}
                    title={item.title}
                    details={item.details}
                    index={i}
                    isLast={i === experienceTimeline.length - 1}
                  />
                ))}
              </div>
            </div>
          </OSWindow>

          <OSWindow label="education.records" title="academic background" status="idle" className="os-panel-in [animation-delay:160ms]">
            <SectionHeading
              icon={<GraduationCap className="h-4.5 w-4.5" />}
              eyebrow="Education"
              title="Academic foundation"
            />
            <div className="relative mt-5">
              <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-zinc-800" />
              <div className="space-y-3 pl-5">
                {educationTimeline.map((item, i) => (
                  <TimelineCard
                    key={item.title}
                    date={item.date}
                    title={item.title}
                    details={item.details}
                    compact
                    index={i}
                    isLast={i === educationTimeline.length - 1}
                  />
                ))}
              </div>
            </div>
          </OSWindow>
        </section>

        {/* ── Row 3: Certifications + Capabilities ── */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">

          <OSWindow label="certifications" title="verified credentials" status="idle" className="os-panel-in [animation-delay:200ms]">
            <SectionHeading
              icon={<Shield className="h-4.5 w-4.5" />}
              eyebrow="Certifications"
              title="Credential records"
            />
            <div className="mt-5 flex flex-col gap-2.5">
              {certifications.map((cert, i) => (
                <Link
                  key={cert.credentialId}
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded border border-zinc-800 bg-zinc-950/40 p-4 transition-all duration-200 hover:border-emerald-900/80 hover:bg-zinc-950/65 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                  style={{ animationDelay: `${200 + i * 50}ms` }}
                >
                  {/* Hover left-glow accent */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-px bg-emerald-500/0 transition-colors duration-200 group-hover:bg-emerald-500/40"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-5 text-zinc-100 group-hover:text-zinc-50">{cert.name}</h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                          {cert.issuer}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-600">{cert.date}</span>
                      </div>
                    </div>
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-700 transition-colors duration-200 group-hover:text-emerald-500" />
                  </div>

                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-700 group-hover:text-zinc-600">
                    ID: {cert.credentialId}
                  </p>
                </Link>
              ))}
            </div>
          </OSWindow>

          <OSWindow label="technical.capabilities" title="skills matrix" status="active" className="os-panel-in [animation-delay:240ms]">
            <SectionHeading
              icon={<Sparkles className="h-4.5 w-4.5" />}
              eyebrow="Technical capabilities"
              title="What Hamzah can operate and build"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {technicalCapabilities.map((group) => {
                const accent = CAPABILITY_ACCENTS[group.label] ?? {
                  border: "border-l-zinc-600/50",
                  dot: "bg-zinc-500",
                  heading: "text-zinc-300",
                  bg: "hover:border-zinc-700",
                }
                return (
                  <div
                    key={group.label}
                    className={`rounded border-l-2 border border-zinc-800 bg-zinc-950/40 p-4 transition-colors duration-200 ${accent.border} ${accent.bg}`}
                  >
                    <h3 className={`text-xs font-semibold uppercase tracking-wide ${accent.heading}`}>
                      {group.label}
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-5 text-zinc-400">
                          <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${accent.dot}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </OSWindow>
        </section>

        {/* ── Row 4: Resume CTA ── */}
        <section className="mt-4">
          <OSWindow label="resume.download" title="primary action" status="active" className="os-panel-in [animation-delay:280ms]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-600" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                    Resume ready
                  </span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Review the complete resume
                </h2>
                <p className="font-mono text-[11px] leading-6 text-zinc-500">
                  <span className="mr-2 text-emerald-700">$</span>
                  PDF · full professional profile · fastest path for recruiter review
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
                <Link
                  href={resumeHref}
                  target="_blank"
                  className="group inline-flex items-center gap-2.5 rounded border border-emerald-700 bg-emerald-900/50 px-6 py-3 text-sm font-semibold text-emerald-100 transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-800/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]"
                >
                  <ArrowDownToLine className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  Download Hamzah Al-Ramli resume
                </Link>
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-700">
                  hamzah-al-ramli-resume.pdf
                </span>
              </div>
            </div>
          </OSWindow>
        </section>

      </div>
    </OSPageShell>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function InfoPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-800/80 bg-zinc-950/50 p-3 transition-colors duration-200 hover:border-zinc-700/80">
      <div className="flex items-center gap-1.5 text-emerald-600">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-700">{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-200">{value}</p>
    </div>
  )
}

function ContactLink({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: ReactNode
  external?: boolean
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between gap-3 rounded border border-zinc-800/60 bg-zinc-950/30 px-3 py-2 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-950/50"
    >
      <span className="flex min-w-0 items-center gap-2 text-zinc-500 group-hover:text-zinc-300">
        <span className="shrink-0 text-emerald-700 group-hover:text-emerald-500 transition-colors duration-200">
          {icon}
        </span>
        <span className="truncate font-mono text-[10px]">{label}</span>
      </span>
      {external && (
        <ExternalLink className="h-3 w-3 shrink-0 text-zinc-700 transition-colors duration-200 group-hover:text-zinc-500" />
      )}
    </Link>
  )
}

function SectionHeading({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-emerald-600">{icon}</span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold leading-tight text-zinc-100">{title}</h2>
      </div>
    </div>
  )
}

function TimelineCard({
  date,
  title,
  details,
  compact,
  index,
  isLast,
}: {
  date: string
  title: string
  details: string[]
  compact?: boolean
  index: number
  isLast?: boolean
}) {
  return (
    <article className="relative">
      {/* Timeline dot */}
      <span
        aria-hidden
        className="absolute -left-5 top-3 flex h-3 w-3 -translate-x-1/2 items-center justify-center"
      >
        <span className="h-2 w-2 rounded-full border border-emerald-800 bg-emerald-950 ring-2 ring-zinc-950" />
      </span>

      <div className="rounded border border-zinc-800/70 bg-zinc-950/40 p-4 transition-all duration-200 hover:border-zinc-700/70 hover:bg-zinc-950/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {/* Date stamp */}
        <span className="inline-flex items-center gap-1.5 rounded border border-emerald-900/60 bg-emerald-950/20 px-2 py-0.5">
          <span className="h-1 w-1 rounded-full bg-emerald-600" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-700">{date}</span>
        </span>

        <h3 className="mt-3 text-sm font-semibold leading-5 text-zinc-100 md:text-base">{title}</h3>

        <ul className={compact ? "mt-3 space-y-1" : "mt-3 space-y-1.5"}>
          {details.map((detail) => (
            <li key={detail} className="flex gap-2 text-xs leading-5 text-zinc-500">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-700" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
