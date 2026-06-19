import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { OSPageShell } from "@/components/os/OSPageShell"
import { deployments, getDeploymentBySlug } from "@/lib/content/deployments"
import { DeploymentDetailContent } from "./deployment-detail-content"

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
    title: `${deployment.name.en} | Deployments`,
    description: deployment.summary.en,
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
      <DeploymentDetailContent deployment={deployment} />
    </OSPageShell>
  )
}
