// === METADATA ===
// Purpose: Buy + unlock page for the standalone "Workflow Tools" one-time pack
//          (30 SAR). Server component for metadata; the interactive purchase /
//          unlock UI lives in WorkflowToolsPurchase (client).
// Payment: Gumroad product checkout (NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS) +
//          Supabase `sales` entitlement — the same pattern the rest of the site
//          uses. Set the Gumroad product "Redirect after purchase" to
//          /workflow-tools so buyers land back here to unlock.
// === END METADATA ===
import type { Metadata } from "next"
import { WORKFLOW_TOOLS } from "@/lib/workflow-tools/config"
import { WorkflowToolsPurchase } from "./WorkflowToolsPurchase"

export const metadata: Metadata = {
  title: `${WORKFLOW_TOOLS.nameEn} · ${WORKFLOW_TOOLS.priceSar} SAR`,
  description: WORKFLOW_TOOLS.taglineEn,
}

const INCLUDES = [
  "Ready-to-run workflow templates you drop straight into your stack",
  "Automations that wire your tools together so the busywork runs itself",
  "Setup notes tuned for a lean, one-person side business",
]

export default function WorkflowToolsPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
        <header className="text-center">
          <span className="mb-4 inline-block rounded border border-emerald-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-700">
            goodnbad · workflow tools
          </span>
          <h1 className="text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl">
            {WORKFLOW_TOOLS.nameEn}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{WORKFLOW_TOOLS.taglineEn}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500" dir="rtl">
            {WORKFLOW_TOOLS.taglineAr}
          </p>
        </header>

        <ul className="mt-8 space-y-2 text-sm text-zinc-300">
          {INCLUDES.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="text-emerald-500">→</span>
              {line}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <WorkflowToolsPurchase />
        </div>
      </div>
    </main>
  )
}
