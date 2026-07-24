// === METADATA ===
// Purpose: Learning Lab route (/learn) — academy.exe. Server component: metadata +
//          learningLab flag gate (the kill switch; middleware handles the prod
//          dark-ship, this handles post-launch disable). Spec: docs/learning-lab/PRD.md.
// Author: @Goodnbad.exe
// Inputs: learningLab flag (flags/index.ts)
// Outputs: OSPageShell-wrapped Learning Lab page
// Tests: tests/learn-assessment.test.ts; middleware coverage in tests/security.test.ts
// Complexity: O(1)
// === END METADATA ===
import { notFound } from "next/navigation"
import { OSPageShell } from "@/components/os"
import { osPageMetadata } from "@/lib/os-metadata"
import { learningLab } from "@/flags"
import { LearnContent } from "./learn-content"

export const metadata = osPageMetadata({
  title: "Learning Lab",
  description:
    "Personalized technical learning — cybersecurity, programming, data, AI. Free diagnostic, mentor-approved plan, teaching that unlocks one verified step at a time. Arabic & English.",
  path: "/learn",
})

export default async function LearnPage() {
  if (!(await learningLab())) notFound()

  return (
    <OSPageShell osName="academy.exe" label="Learning Lab">
      <LearnContent />
    </OSPageShell>
  )
}
