// === METADATA ===
// Purpose: Receive Gumroad's "Ping" webhook (Settings → Advanced → Ping) on every
//          sale/renewal and record it in Supabase `sales`. Unifies real buyers
//          with the website waitlist so every email + purchase is in one place.
// Security: Gumroad Ping is unsigned, so we require a secret token in the URL
//          (?token=…) matched against GUMROAD_PING_TOKEN. Upsert on sale_id makes
//          re-delivery idempotent. Always 200 so Gumroad doesn't retry-storm.
// Payload: application/x-www-form-urlencoded (price in cents).
// === END METADATA ===
import { NextResponse } from "next/server"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  // 1) verify the shared secret in the ping URL
  const token = new URL(req.url).searchParams.get("token")
  const expected = process.env.GUMROAD_PING_TOKEN
  if (expected && token !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  // 2) parse the form-encoded body
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 })
  }
  const str = (k: string): string | null => {
    const v = form.get(k)
    return typeof v === "string" && v.length ? v : null
  }

  const email = str("email")
  if (!email) return NextResponse.json({ ok: true, skipped: "no email" })

  const raw: Record<string, string> = {}
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v

  const sale = {
    sale_id: str("sale_id"),
    order_number: str("order_number"),
    email,
    product_name: str("product_name"),
    product_permalink: str("product_permalink") ?? str("permalink"),
    price_cents: str("price") ? Number(str("price")) : null,
    currency: str("currency"),
    recurrence: str("recurrence"),
    subscription_id: str("subscription_id"),
    is_recurring_charge: str("is_recurring_charge") === "true",
    refunded: str("refunded") === "true",
    offer_code: str("offer_code[name]") ?? str("discount_code") ?? str("offer_code"),
    raw,
  }

  // 3) persist (idempotent on sale_id). Never throw — Gumroad expects a 200.
  try {
    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin().from("sales").upsert(sale, { onConflict: "sale_id" })
      if (error) console.error("[gumroad ping] upsert error:", error.message)
    } else {
      console.log("[gumroad ping] (supabase not configured)\n" + JSON.stringify(sale))
    }
  } catch (e) {
    console.error("[gumroad ping] failed:", e)
  }

  return NextResponse.json({ ok: true })
}
