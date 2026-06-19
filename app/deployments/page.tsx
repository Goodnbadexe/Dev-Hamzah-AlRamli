import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { DeploymentsContent } from "./deployments-content"

export const metadata: Metadata = {
  title: "Deployments | Hamzah Al-Ramli",
  description:
    "Project system for Hamzah Al-Ramli: what each project is, why it mattered, tools used, and outcomes.",
  alternates: {
    canonical: "https://www.goodnbad.info/deployments",
  },
}

export default function DeploymentsPage() {
  return (
    <OSPageShell osName="deployments.sys" label="Projects & Builds">
      <DeploymentsContent />
    </OSPageShell>
  )
}
