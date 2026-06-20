// === METADATA ===
// Purpose: Authoritative entitlement check for gated vault downloads, backed by
//          Supabase. Resolves the buyer's stored stack ({tool,os}) so the gated
//          route can hand back the right tuned PDF variant.
// Note:    Until a payments-confirmed column/orders table exists, entitlement =
//          "the buyer's most recent lead row selected this deliverable's track".
//          A Moyasar webhook should later set a `paid` flag and this gate should
//          tighten to require it. Fails CLOSED when Supabase is unconfigured.
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

/** Most recent lead row for an email, normalized. null when none / unconfigured. */
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

export async function hasEntitlement(email: string, deliverableId: string): Promise<boolean> {
  const hit = deliverableById(deliverableId)
  if (!hit) return false
  const ent = await getEntitlement(email)
  if (!ent) return false
  return ent.tracks.includes(hit.track)
}
