// === METADATA ===
// Purpose: Server-only Supabase admin client (service-role). Used by API routes
//          to write leads + read entitlements. NEVER import this from a client
//          component — the service-role key bypasses RLS and must never reach the
//          browser bundle.
// Guard:   `import "server-only"` makes any client-side import a build error.
// Env:     SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (NOT NEXT_PUBLIC_*).
// === END METADATA ===
import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

/** True when both env vars are present — callers degrade gracefully when false. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/** Lazy singleton admin client. Throws only when actually used while unconfigured. */
export function supabaseAdmin(): SupabaseClient {
  if (_client) return _client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)")
  }
  _client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return _client
}
