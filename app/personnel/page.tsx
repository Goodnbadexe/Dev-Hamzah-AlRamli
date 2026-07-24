import { OSPageShell } from "@/components/os/OSPageShell"
import { osPageMetadata } from "@/lib/os-metadata"
import { PersonnelContent } from "./personnel-content"

export const metadata = osPageMetadata({
  title: "Personnel File",
  description:
    "Recruiter dossier for Hamzah Al-Ramli — cybersecurity & creative multimedia: identity, capability matrix, verified credentials, service record, roadmap, and direct channels.",
  path: "/personnel",
})

export default function PersonnelPage() {
  return (
    <OSPageShell osName="personnel.exe" label="Career & Credentials">
      <PersonnelContent />
    </OSPageShell>
  )
}
