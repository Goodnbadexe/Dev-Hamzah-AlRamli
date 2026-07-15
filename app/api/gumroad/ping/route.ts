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
import { sendEmail, isEmailConfigured } from "@/lib/email/resend"
import { getPostHogClient } from "@/lib/posthog-server"

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

  // Track sale server-side. Use email as distinctId; no PII in event properties.
  try {
    const ph = getPostHogClient()
    ph.capture({
      distinctId: email,
      event: "gumroad_sale_received",
      properties: {
        product_name: sale.product_name,
        product_permalink: sale.product_permalink,
        price_cents: sale.price_cents,
        currency: sale.currency,
        recurrence: sale.recurrence,
        is_recurring_charge: sale.is_recurring_charge,
        refunded: sale.refunded,
        has_offer_code: !!sale.offer_code,
      },
    })
    await ph.flush()
  } catch (e) {
    console.error("[gumroad ping] posthog capture failed:", e)
  }

  // 4) Welcome the buyer on their FIRST charge (not renewals). Never throw.
  if (!sale.is_recurring_charge && isEmailConfigured()) {
    try {
      const product = sale.product_name ?? "your Toolkit Vault"
      await sendEmail({
        to: email,
        subject: "Welcome to The Toolkit Vault 🗝️",
        replyTo: process.env.LEAD_TO,
        html: `<div style="font:15px/1.6 ui-sans-serif,system-ui;color:#18181b;max-width:520px">
          <p>You're in — thanks for grabbing <b>${product.replace(/[<>]/g, "")}</b>.</p>
          <p><b>Week 1</b> is on your Gumroad receipt (and in your Gumroad library). Over the next month, <b>Weeks 2–4</b> land in your inbox automatically — one short, designed PDF each week, tuned for your setup.</p>
          <p style="direction:rtl">وصلك العدد الأول مع إيصال Gumroad. الأسابيع ٢–٤ بتوصلك تلقائيًا خلال الشهر — ملف PDF واحد كل أسبوع.</p>
          <p style="color:#71717a;font-size:13px">The Toolkit Vault · goodnbad.info</p>
        </div>`,
      })
    } catch (e) {
      console.error("[gumroad ping] welcome email failed:", e)
    }
  }

  return NextResponse.json({ ok: true })
}
