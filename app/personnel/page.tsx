import type { Metadata } from "next"
import { OSPageShell } from "@/components/os/OSPageShell"
import { PersonnelContent } from "./personnel-content"

export const metadata: Metadata = {
  title: "Personnel File | Hamzah Al-Ramli",
  description:
    "Recruiter dossier for Hamzah Al-Ramli — cybersecurity & creative multimedia: identity, capability matrix, verified credentials, service record, roadmap, and direct channels.",
  alternates: { canonical: "https://www.goodnbad.info/personnel" },
}

export default function PersonnelPage() {
  return (
    <OSPageShell osName="personnel.exe" label="Career & Credentials">
      <PersonnelContent />
    </OSPageShell>
  )
}
