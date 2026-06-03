"use client"

/**
 * PortfolioAssistant
 *
 * Floating AI chat widget powered by inference.sh agent-ui.
 * Visitors can ask questions about Hamzah's work, services,
 * certifications, and projects — answered by an agent with
 * full context about the portfolio.
 *
 * Requires:
 *   INFERENCE_API_KEY in Vercel env vars
 *   npm install @inferencesh/sdk
 *   npx shadcn@latest add https://ui.inference.sh/r/agent.json
 */

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"

// NOTE: the agent UI is TEMPORARILY STUBBED to unblock the build.
// The original lazy-loaded "@/registry/blocks/agent/agent", which is not
// committed to the repo, so the build failed on a clean checkout. To restore:
//   npx shadcn@latest add https://ui.inference.sh/r/agent.json   (creates registry/blocks/agent/agent)
//   npm install @inferencesh/sdk
//   restore the dynamic import + the <Agent /> usage below.

export function PortfolioAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-200",
          open
            ? "border-zinc-700 bg-zinc-900 text-zinc-400"
            : "border-emerald-800 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 shadow-[0_0_16px_theme(colors.emerald.900)]"
        )}
        aria-label={open ? "Close assistant" : "Ask the portfolio assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-h-[520px] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-800/60 px-4 py-3 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)] animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Portfolio Assistant
            </span>
            <span className="ml-auto font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
              goodnbad.info
            </span>
          </div>

          {/* Agent component — stubbed until @inferencesh/sdk + registry block are restored */}
          <div className="flex-1 min-h-0">
            <div className="flex flex-col items-center justify-center h-32 gap-2 px-4 text-center">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                Assistant not configured
              </span>
              <span className="font-mono text-[9px] text-zinc-700">
                Restore the inference.sh agent block to enable
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
