// === METADATA ===
// Purpose: Client UI for the Workflow Tools one-time purchase (30 SAR). Buy CTA
//          opens the Gumroad overlay checkout (same mechanism as /subscribe); an
//          "already bought?" form verifies ownership via POST /api/workflow-tools
//          /access and reveals unlock instructions.
// Security: no secrets here. The checkout link is the public NEXT_PUBLIC_* var;
//           ownership is verified server-side against the Supabase `sales` table.
// === END METADATA ===
"use client"

import { useEffect, useState } from "react"
import {
  WORKFLOW_TOOLS,
  workflowToolsCheckoutUrl,
  isWorkflowToolsCheckoutConfigured,
} from "@/lib/workflow-tools/config"

type CheckState = "idle" | "loading" | "granted" | "denied" | "error"

export function WorkflowToolsPurchase() {
  const buyUrl = workflowToolsCheckoutUrl()
  const checkoutReady = isWorkflowToolsCheckoutConfigured()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<CheckState>("idle")

  // Load Gumroad's overlay script so the buy button opens an in-page checkout.
  useEffect(() => {
    if (!checkoutReady) return
    if (document.querySelector("script[data-gumroad]")) return
    const s = document.createElement("script")
    s.src = "https://gumroad.com/js/gumroad.js"
    s.setAttribute("data-gumroad", "1")
    s.async = true
    document.body.appendChild(s)
  }, [checkoutReady])

  async function checkAccess(e: React.FormEvent) {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/workflow-tools/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok?: boolean; access?: boolean }
      if (!res.ok || !data.ok) {
        setState("error")
        return
      }
      setState(data.access ? "granted" : "denied")
    } catch {
      setState("error")
    }
  }

  return (
    <div className="space-y-6">
      {/* Price + buy CTA */}
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-zinc-100">{WORKFLOW_TOOLS.priceSar} SAR</span>
          <span className="font-mono text-sm text-zinc-500">≈ ${WORKFLOW_TOOLS.priceUsd} · one-time</span>
        </div>

        {checkoutReady ? (
          <a
            href={buyUrl}
            data-gumroad-overlay-checkout="true"
            className="gumroad-button mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-4 font-mono text-sm font-bold uppercase tracking-wide text-emerald-950 transition-all hover:-translate-y-px hover:bg-emerald-400"
          >
            Get the workflow tools
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Checkout not configured yet"
            className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-md bg-zinc-800 px-4 py-4 font-mono text-sm font-bold uppercase tracking-wide text-zinc-500"
          >
            Checkout coming soon
          </button>
        )}
        <p className="mt-3 text-center font-mono text-[11px] text-zinc-600">
          instant access · secure payment via Gumroad
        </p>
      </div>

      {/* Already bought? → verify + unlock */}
      <form onSubmit={checkAccess} className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
          already bought? unlock here
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="the email you paid with"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="rounded-md border border-emerald-700 bg-emerald-950/40 px-4 py-2.5 font-mono text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-900/40 disabled:opacity-50"
          >
            {state === "loading" ? "Checking…" : "Unlock"}
          </button>
        </div>

        {state === "granted" && (
          <div className="mt-4 rounded-md border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-200">
            <p className="font-semibold">Access confirmed — you own the Workflow Tools pack.</p>
            <p className="mt-1 text-emerald-300/80">
              Your download is on your Gumroad receipt and in your email. Open it and start with one tool today.
            </p>
          </div>
        )}
        {state === "denied" && (
          <p className="mt-3 text-sm text-zinc-400">
            No purchase found for that email yet. If you just paid, give it a minute and try again, or use the
            buy button above.
          </p>
        )}
        {state === "error" && (
          <p className="mt-3 text-sm text-amber-400">Something went wrong checking your access. Please try again.</p>
        )}
      </form>
    </div>
  )
}
