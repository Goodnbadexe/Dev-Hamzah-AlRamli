// === METADATA ===
// Purpose: Authoritative entitlement check for gated vault downloads, backed by
//          Supabase.
// Security: Access is granted ONLY when a confirmed, non-refunded sale exists for
//          the email in the `sales` table (written exclusively by the service-role
//          Gumroad Ping webhook — never by the browser, RLS-locked). The `leads`
//          table is self-submitted via a public form and is therefore FORGEABLE,
//          so it MUST NOT grant access — it is used only to resolve which OS-tuned
//          PDF variant to hand a buyer (worst case: wrong variant, never a bypass).
//          Fails CLOSED when Supabase is unconfigured or on any query error.
// === END METADATA ===
import "server-only"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server"
import { deliverableById } from "@/lib/vault/manifest"
import { type ToolId, type OsId, isToolId, isOsId, DEFAULT_TOOL, DEFAULT_OS } from "@/lib/subscribe/tracks"

export interface Entitlement {
  email: string
  tool: ToolId
  os: OsId
  tracks: string[]
}

/**
 * Authoritative payment gate. True only when at least one confirmed, non-refunded
 * sale exists for this email. This is the single source of truth for vault access.
 * Fails CLOSED: unconfigured Supabase, query error, or no matching row → false.
 */
export async function hasConfirmedSale(email: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  try {
    const { data, error } = await supabaseAdmin()
      .from("sales")
      .select("id")
      .eq("email", email)
      .eq("refunded", false)
      .limit(1)
      .maybeSingle()
    return !error && Boolean(data)
  } catch {
    return false
  }
}

/**
 * Product-scoped gate for the standalone Workflow Tools pack. True ONLY when a
 * confirmed, non-refunded sale exists for this email whose `product_permalink`
 * matches WORKFLOW_TOOLS_PERMALINK. Fails CLOSED when the permalink is unset,
 * Supabase is unconfigured, or on any query error — a sale of a DIFFERENT product
 * never unlocks this one (unlike the catalog-wide hasConfirmedSale).
 */
export async function hasWorkflowToolsAccess(email: string): Promise<boolean> {
  const permalink = (process.env.WORKFLOW_TOOLS_PERMALINK ?? "").trim()
  if (!permalink) return false
  if (!isSupabaseConfigured()) return false
  try {
    const { data, error } = await supabaseAdmin()
      .from("sales")
      .select("id")
      .eq("email", email)
      .eq("refunded", false)
      .eq("product_permalink", permalink)
      .limit(1)
      .maybeSingle()
    return !error && Boolean(data)
  } catch {
    return false
  }
}

/**
 * Most recent lead row for an email, normalized — used ONLY for variant
 * resolution (which OS-tuned PDF), never for access. null when none / unconfigured.
 */
export async function getEntitlement(email: string): Promise<Entitlement | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const { data, error } = await supabaseAdmin()
      .from("leads")
      .select("email,tool,os,tracks")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error || !data) return null
    return {
      email: data.email,
      tool: isToolId(data.tool ?? "") ? (data.tool as ToolId) : DEFAULT_TOOL,
      os: isOsId(data.os ?? "") ? (data.os as OsId) : DEFAULT_OS,
      tracks: Array.isArray(data.tracks) ? data.tracks : [],
    }
  } catch {
    return null
  }
}

/**
 * The OS-tuned variant to serve a buyer. Derived from the (forgeable) lead row,
 * defaulting when absent. Safe to trust because it only picks a file variant —
 * access itself is gated separately by hasConfirmedSale().
 */
export async function resolveVariantOs(email: string): Promise<OsId> {
  const ent = await getEntitlement(email)
  return ent?.os ?? DEFAULT_OS
}

/**
 * Is this email entitled to this deliverable? Payment is the gate: the deliverable
 * must exist in the manifest AND the buyer must have a confirmed, non-refunded sale.
 * A lead row alone NEVER grants access.
 */
export async function hasEntitlement(email: string, deliverableId: string): Promise<boolean> {
  if (!deliverableById(deliverableId)) return false
  return hasConfirmedSale(email)
}
