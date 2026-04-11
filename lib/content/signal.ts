import { deployments } from "@/lib/content/deployments"
import { certifications } from "@/lib/content/personnel"

export type SignalEntry = {
  id: string
  date: string
  type: "Project" | "Credential" | "System" | "Career"
  title: string
  summary: string
  href?: string
}

export const signalSummary = {
  title: "Clean activity feed",
  description:
    "A quiet log of meaningful updates: shipped projects, credentials, site improvements, and current professional signals.",
  status: "Curated",
}

export const signalEntries: SignalEntry[] = [
  {
    id: "phase-6-deployments",
    date: "2026",
    type: "System",
    title: "Project system rebuilt",
    summary:
      "Deployments now use scalable project files with clear summaries, tools, outcomes, and technical notes.",
    href: "/deployments",
  },
  {
    id: "phase-5-personnel",
    date: "2026",
    type: "System",
    title: "Recruiter dossier published",
    summary:
      "Personnel page now presents identity, experience, education, certifications, capabilities, and resume access.",
    href: "/personnel",
  },
  ...deployments.slice(0, 4).map((deployment) => ({
    id: deployment.slug,
    date: deployment.year,
    type: "Project" as const,
    title: deployment.name,
    summary: deployment.result,
    href: `/deployments/${deployment.slug}`,
  })),
  ...certifications.slice(0, 3).map((certification) => ({
    id: certification.credentialId,
    date: certification.date,
    type: "Credential" as const,
    title: certification.name,
    summary: `${certification.issuer} credential added to the professional profile.`,
    href: certification.href,
  })),
  {
    id: "current-role",
    date: "Aug 2025 - Present",
    type: "Career",
    title: "IT Systems & Support Administrator",
    summary:
      "On-site systems administration, help desk operations, infrastructure support, and business application maintenance in Riyadh.",
    href: "/personnel",
  },
]

export const signalFilters = ["All", "Project", "Credential", "System", "Career"] as const
