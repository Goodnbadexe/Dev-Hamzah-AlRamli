import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import {
  ArrowDownToLine,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Shield,
  Sparkles,
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

export default function PersonnelPage() {
  return (
    <OSPageShell osName="personnel.exe" label="Career & Credentials">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <section className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
          <OSWindow label="identity.summary" title="professional profile" status="active" className="os-panel-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">
                    Recruiter dossier
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                    {personnelIdentity.name}
                  </h1>
                  <p className="mt-2 text-base text-zinc-300 md:text-lg">
                    {personnelIdentity.title}
                  </p>
                </div>

                <div className="rounded-md border border-emerald-900/70 bg-emerald-950/25 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-emerald-400">
                  Available
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {personnelIdentity.summary}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoPill icon={<UserRound className="h-4 w-4" />} label="Alias" value={personnelIdentity.alias} />
                <InfoPill icon={<MapPin className="h-4 w-4" />} label="Location" value={personnelIdentity.location} />
                <InfoPill icon={<Shield className="h-4 w-4" />} label="Focus" value="Cybersecurity + automation" />
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-zinc-400">
                  {personnelIdentity.availability}
                </p>
                <Link
                  href={resumeHref}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-600 hover:bg-emerald-950"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Download resume
                </Link>
              </div>
            </div>
          </OSWindow>

          <OSWindow label="quick.read" title="why shortlist" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Hiring signal
                </p>
                <h2 className="mt-2 text-xl font-semibold text-zinc-100">Fast reasons to review</h2>
              </div>

              <ul className="space-y-3">
                {recruiterHighlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
                <ContactLink href={`mailto:${personnelIdentity.contact.email}`} label={personnelIdentity.contact.email} />
                <ContactLink href={personnelIdentity.contact.linkedin} label="LinkedIn profile" external />
                <ContactLink href={personnelIdentity.contact.github} label="GitHub profile" external />
              </div>
            </div>
          </OSWindow>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <OSWindow label="experience.timeline" title="work history" status="active" className="os-panel-in">
            <SectionHeading
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              eyebrow="Experience"
              title="Professional timeline"
            />
            <div className="mt-5 space-y-4">
              {experienceTimeline.map((item) => (
                <TimelineCard key={item.title} date={item.date} title={item.title} details={item.details} />
              ))}
            </div>
          </OSWindow>

          <OSWindow label="education.records" title="academic background" status="idle" className="os-panel-in">
            <SectionHeading
              icon={<GraduationCap className="h-5 w-5" />}
              eyebrow="Education"
              title="Academic foundation"
            />
            <div className="mt-5 space-y-4">
              {educationTimeline.map((item) => (
                <TimelineCard key={item.title} date={item.date} title={item.title} details={item.details} compact />
              ))}
            </div>
          </OSWindow>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <OSWindow label="certifications" title="verified credentials" status="idle" className="os-panel-in">
            <SectionHeading
              icon={<Shield className="h-5 w-5" />}
              eyebrow="Certifications"
              title="Credential records"
            />
            <div className="mt-5 grid gap-3">
              {certifications.map((cert) => (
                <Link
                  key={cert.credentialId}
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-md border border-zinc-800 bg-zinc-950/45 p-4 transition hover:border-emerald-900 hover:bg-zinc-950/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold leading-6 text-zinc-100">{cert.name}</h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {cert.issuer} - {cert.date}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-zinc-700 transition group-hover:text-emerald-500" />
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Credential ID: {cert.credentialId}
                  </p>
                </Link>
              ))}
            </div>
          </OSWindow>

          <OSWindow label="technical.capabilities" title="skills matrix" status="active" className="os-panel-in">
            <SectionHeading
              icon={<Sparkles className="h-5 w-5" />}
              eyebrow="Technical capabilities"
              title="What Hamzah can operate and build"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {technicalCapabilities.map((group) => (
                <div key={group.label} className="rounded-md border border-zinc-800 bg-zinc-950/45 p-4">
                  <h3 className="text-sm font-semibold text-zinc-100">{group.label}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-400">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </OSWindow>
        </section>

        <section className="mt-4">
          <OSWindow label="resume.download" title="primary action" status="active" className="os-panel-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">
                  Resume ready
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Review the complete resume</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  The PDF contains the full professional profile and is the fastest path for recruiters,
                  hiring managers, and collaborators who need a standard resume format.
                </p>
              </div>
              <Link
                href={resumeHref}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-700 bg-emerald-900/60 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-500 hover:bg-emerald-800/70"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Download Hamzah Al-Ramli resume
              </Link>
            </div>
          </OSWindow>
        </section>
      </div>
    </OSPageShell>
  )
}

function InfoPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/45 p-3">
      <div className="flex items-center gap-2 text-emerald-500">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-200">{value}</p>
    </div>
  )
}

function ContactLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950/35 px-3 py-2 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        <span className="truncate">{label}</span>
      </span>
      {external && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-700" />}
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
    <div>
      <div className="flex items-center gap-2 text-emerald-500">
        {icon}
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{eyebrow}</p>
      </div>
      <h2 className="mt-2 text-xl font-semibold text-zinc-100">{title}</h2>
    </div>
  )
}

function TimelineCard({
  date,
  title,
  details,
  compact,
}: {
  date: string
  title: string
  details: string[]
  compact?: boolean
}) {
  return (
    <article className="rounded-md border border-zinc-800 bg-zinc-950/45 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">{date}</p>
      <h3 className="mt-2 text-sm font-semibold leading-6 text-zinc-100 md:text-base">{title}</h3>
      <ul className={compact ? "mt-3 space-y-1.5" : "mt-4 space-y-2"}>
        {details.map((detail) => (
          <li key={detail} className="flex gap-2 text-sm leading-6 text-zinc-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
