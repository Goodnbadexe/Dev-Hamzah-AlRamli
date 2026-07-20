// lib/events/log.ts — fail-soft writer for the first-party business-event audit trail
// (the "brain seed"). Insert a row per significant lifecycle event so the funnel and
// fulfillment become observable instead of guessed.
//
// Design: NEVER throws and NEVER blocks the caller's happy path — mirrors the email /
// analytics helpers. If Supabase is unconfigured or the insert fails, it logs to
// console.error and returns; the webhook/download/cron continues normally. Events are
// telemetry, not the authoritative gate (that stays the `sales` table).
import "server-only"
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/server"

export interface BusinessEvent {
  type: string // e.g. "webhook_received", "sale_stored", "week_sent", "pdf_downloaded", "sale_refunded"
  email?: string | null
  product?: string | null
  source?: string | null
  meta?: Record<string, unknown>
}

// Telemetry must never block the caller's critical path (e.g. the Gumroad money-path
// webhook) for longer than this, even if Supabase is slow. If the insert exceeds the
// budget it keeps running in the background — we just stop awaiting it.
const INSERT_TIMEOUT_MS = 1500

export async function logEvent(event: BusinessEvent): Promise<void> {
  if (!isSupabaseConfigured()) return
  const write = (async () => {
    try {
      const { error } = await supabaseAdmin()
        .from("events")
        .insert({
          type: event.type,
          email: event.email ?? null,
          product: event.product ?? null,
          source: event.source ?? null,
          meta: event.meta ?? {},
        })
      if (error) console.error(`[events] insert failed (${event.type}): ${error.message}`)
    } catch (e) {
      console.error(`[events] threw (${event.type}):`, e)
    }
  })()
  await Promise.race([write, new Promise<void>((resolve) => setTimeout(resolve, INSERT_TIMEOUT_MS))])
}
