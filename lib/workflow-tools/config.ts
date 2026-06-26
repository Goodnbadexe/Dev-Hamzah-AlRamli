// === METADATA ===
// Purpose: Product config for the standalone "Workflow Tools" one-time purchase
//          (30 SAR). Mirrors the Gumroad-link + Supabase-entitlement pattern the
//          rest of the site already uses to gate paid content. Pure constants +
//          a build-inlined checkout URL — NO secrets live here.
// Payment: NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS holds the Gumroad product checkout
//          link (inlined at build → REDEPLOY after changing). When unset, the buy
//          button is disabled instead of opening a broken/fake checkout.
// Entitlement: scoped server-side by WORKFLOW_TOOLS_PERMALINK (see
//          lib/vault/entitlement.ts) against the `sales` table that the EXISTING
//          Gumroad Ping webhook (app/api/gumroad/ping) already populates — so NO
//          new webhook is required for this product.
// === END METADATA ===
import { SAR_PER_USD } from "@/lib/subscribe/config"

/** One-time price for the Workflow Tools pack, in SAR. */
export const WORKFLOW_TOOLS_PRICE_SAR = 30

/** Honest USD equivalent, derived from the repo-wide SAR/USD rate (≈ $8). */
export const WORKFLOW_TOOLS_PRICE_USD = Math.round(WORKFLOW_TOOLS_PRICE_SAR / SAR_PER_USD)

export const WORKFLOW_TOOLS = {
  id: "workflow-tools",
  nameEn: "Side-Business Workflow Tools",
  nameAr: "أدوات سير العمل للأعمال الجانبية",
  taglineEn:
    "A one-time pack of the workflow tools, templates & automations that run a lean side business.",
  taglineAr:
    "حزمة لمرة واحدة من أدوات وقوالب وأتمتة سير العمل التي تدير عملاً جانبياً خفيفاً.",
  priceSar: WORKFLOW_TOOLS_PRICE_SAR,
  priceUsd: WORKFLOW_TOOLS_PRICE_USD,
} as const

/** Gumroad checkout link (build-inlined). Empty string when unconfigured. */
export function workflowToolsCheckoutUrl(): string {
  return (process.env.NEXT_PUBLIC_GUMROAD_WORKFLOW_TOOLS ?? "").trim()
}

/** True when a real checkout link is configured. */
export function isWorkflowToolsCheckoutConfigured(): boolean {
  return workflowToolsCheckoutUrl().length > 0
}
