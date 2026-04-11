import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Hammer,
  Lightbulb,
  ListChecks,
  Target,
} from "lucide-react"
import { OSPageShell } from "@/components/os/OSPageShell"
import { OSWindow } from "@/components/os"
import { deployments, getDeploymentBySlug, type Deployment } from "@/lib/content/deployments"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return deployments.map((deployment) => ({
    slug: deployment.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const deployment = getDeploymentBySlug(slug)

  if (!deployment) {
    return {
      title: "Project Not Found | Goodnbad.exe",
    }
  }

  return {
    title: `${deployment.name} | Deployments`,
    description: deployment.summary,
    alternates: {
      canonical: `https://www.goodnbad.info/deployments/${deployment.slug}`,
    },
  }
}

export default async function MissionFilePage({ params }: Props) {
  const { slug } = await params
  const deployment = getDeploymentBySlug(slug)

  if (!deployment) {
    notFound()
  }

  return (
    <OSPageShell osName="deployments.sys" label="Project File">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-4">
          <Link
            href="/deployments"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/45 px-3 py-2 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all projects
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <OSWindow label={deployment.code.toLowerCase()} title="project overview" status="active" className="os-panel-in">
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-blue-900 bg-blue-950/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-blue-300">
                    {deployment.status}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    {deployment.category}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    {deployment.year}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
                  {deployment.name}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                  {deployment.summary}
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-5 sm:flex-row">
                {deployment.href && (
                  <Link
                    href={deployment.href}
                    target={deployment.href.startsWith("http") ? "_blank" : undefined}
                    rel={deployment.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-800 bg-blue-950/40 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:border-blue-600 hover:bg-blue-950/70"
                  >
                    Visit project
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
                >
                  Discuss this work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </OSWindow>

          <OSWindow label="quick.summary" title="review checklist" status="idle" className="os-panel-in">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-100">Project summary</h2>
              <SummaryRow label="What it is" value={deployment.what} />
              <SummaryRow label="Why it mattered" value={deployment.why} />
              <SummaryRow label="Result" value={deployment.result} />
            </div>
          </OSWindow>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <ProjectSection
            icon={<Boxes className="h-5 w-5" />}
            label="What it is"
            title="Scope"
            text={deployment.what}
          />
          <ProjectSection
            icon={<Target className="h-5 w-5" />}
            label="Why it mattered"
            title="Purpose"
            text={deployment.why}
          />
          <ProjectSection
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Result"
            title="Outcome"
            text={deployment.result}
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <OSWindow label="tools.used" title="technical stack" status="active" className="os-panel-in">
            <div>
              <div className="flex items-center gap-2 text-blue-400">
                <Hammer className="h-5 w-5" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                  Tools used
                </p>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-100">Technology and methods</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {deployment.tools.map((tool) => (
                  <span key={tool} className="rounded border border-zinc-800 bg-zinc-950/50 px-3 py-1.5 text-sm text-zinc-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </OSWindow>

          <OSWindow label="implementation.notes" title="proof points" status="idle" className="os-panel-in">
            <div className="grid gap-5 md:grid-cols-2">
              <ListBlock
                icon={<ListChecks className="h-5 w-5" />}
                label="Highlights"
                items={deployment.highlights}
              />
              <ListBlock
                icon={<Lightbulb className="h-5 w-5" />}
                label="Lessons"
                items={deployment.lessons}
              />
            </div>
          </OSWindow>
        </section>
      </div>
    </OSPageShell>
  )
}

function ProjectSection({
  icon,
  label,
  title,
  text,
}: {
  icon: ReactNode
  label: string
  title: string
  text: string
}) {
  return (
    <OSWindow label={label.toLowerCase().replaceAll(" ", ".")} title={title} status="idle" className="os-panel-in">
      <div>
        <div className="flex items-center gap-2 text-blue-400">
          {icon}
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
        </div>
        <h2 className="mt-2 text-xl font-semibold text-zinc-100">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
      </div>
    </OSWindow>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{value}</p>
    </div>
  )
}

function ListBlock({
  icon,
  label,
  items,
}: {
  icon: ReactNode
  label: string
  items: Deployment["highlights"]
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-blue-400">
        {icon}
        <h2 className="text-xl font-semibold text-zinc-100">{label}</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
