// === METADATA ===
// Purpose: Capture a /subscribe funnel lead (name, email, quiz answers, chosen
//          plan + promo) so Hamzah can deliver the weekly toolkit PDF.
// Delivery: Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) and/or SMTP email
//          (SMTP_HOST/SMTP_USER/SMTP_PASS/LEAD_TO via nodemailer). If neither is
//          configured the route still returns ok (the lead is logged server-side)
//          so the funnel never breaks — wire a channel in env to start receiving.
// Security: input validated with zod; no secrets in responses; nodejs runtime.
// === END METADATA ===

import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, isEmailConfigured } from "@/lib/email/resend"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  plan: z.string().trim().max(40).optional(), // duration id
  bundle: z.string().trim().max(20).optional(), // tier: single | duo | all
  promo: z.string().trim().max(60).optional(),
  tracks: z.array(z.string().trim().max(40)).max(8).optional(),
  tool: z.string().trim().max(20).optional(),
  os: z.string().trim().max(20).optional(),
  readFactor: z.number().int().min(0).max(100).optional(),
  source: z.enum(["funnel", "promo", "waitlist"]).default("funnel"),
  // back-compat: accept string OR string[] per answer; normalize to string[] so
  // old clients sending Record<string,string> still validate.
  answers: z
    .record(
      z.string(),
      z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : [v])),
    )
    .optional(),
})

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function formatLead(lead: z.infer<typeof LeadSchema>): string {
  const lines = [
    "🟢 New Repo Vault lead",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.source ? `Source: ${lead.source}` : null,
    lead.plan ? `Plan: ${lead.plan}` : null,
    lead.bundle ? `Bundle: ${lead.bundle}` : null,
    lead.tracks?.length ? `Tracks: ${lead.tracks.join(", ")}` : null,
    lead.tool ? `Tool: ${lead.tool}` : null,
    lead.os ? `OS: ${lead.os}` : null,
    typeof lead.readFactor === "number" ? `Match: ${lead.readFactor}%` : null,
    lead.promo ? `Promo: ${lead.promo}` : null,
  ].filter(Boolean) as string[]

  if (lead.answers && Object.keys(lead.answers).length) {
    lines.push("—", "Answers:")
    for (const [k, v] of Object.entries(lead.answers)) lines.push(`• ${k}: ${v.join(", ")}`)
  }
  return lines.join("\n")
}

async function notifyTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return false
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text: `<pre>${escapeHtml(text)}</pre>`,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

// Notify the owner (Hamzah) that a new lead came in. Uses Resend; LEAD_TO is the
// inbox. Returns false (logged inside sendEmail) when email isn't configured.
async function notifyOwner(text: string): Promise<boolean> {
  const to = process.env.LEAD_TO
  if (!to || !isEmailConfigured()) return false
  const { ok } = await sendEmail({
    to,
    subject: "🟢 New Toolkit Vault lead",
    html: `<pre style="font:14px/1.5 ui-monospace,monospace">${escapeHtml(text)}</pre>`,
    text,
  })
  return ok
}

// Confirm to the LEAD that we got them — keeps the funnel feeling alive. Bilingual.
async function confirmToLead(lead: z.infer<typeof LeadSchema>): Promise<boolean> {
  if (!isEmailConfigured()) return false
  const vault = lead.tracks?.length ? lead.tracks.join(" + ") : "your toolkit"
  const html = `<div style="font:15px/1.6 ui-sans-serif,system-ui;color:#18181b;max-width:520px">
    <p>Hi ${escapeHtml(lead.name)},</p>
    <p>You're on the list for <b>${escapeHtml(vault)}</b>. Each week you'll get one short, designed PDF — 5 real open-source tools, each with a paste-ready AI prompt tuned for your setup.</p>
    <p>I'll email you the moment your first issue is ready. No noise, cancel anytime.</p>
    <p style="direction:rtl">سجّلناك في <b>${escapeHtml(vault)}</b> — كل أسبوع ملف PDF واحد مختصر: ٥ أدوات مفتوحة المصدر، كل وحدة معها برومبت جاهز. بنرسل لك أول عدد أول ما يجهز.</p>
    <p style="color:#71717a;font-size:13px">The Toolkit Vault · goodnbad.info</p>
  </div>`
  const { ok } = await sendEmail({
    to: lead.email,
    subject: "You're in — The Toolkit Vault",
    html,
    replyTo: process.env.LEAD_TO,
  })
  return ok
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid lead" }, { status: 422 })
  }

  const text = formatLead(parsed.data)
  const [tg, mail, confirm] = await Promise.all([
    notifyTelegram(text),
    notifyOwner(text),
    confirmToLead(parsed.data),
  ])

  // Additive: persist every signup to Supabase. Wrapped so an outage or missing
  // config never breaks the funnel — Telegram/SMTP delivery is unaffected.
  let stored = false
  try {
    if (isSupabaseConfigured()) {
      const d = parsed.data
      const { error } = await supabaseAdmin().from("leads").insert({
        name: d.name,
        email: d.email,
        plan: d.plan ?? null,
        bundle: d.bundle ?? null,
        promo: d.promo ?? null,
        tracks: d.tracks ?? [],
        tool: d.tool ?? null,
        os: d.os ?? null,
        read_factor: d.readFactor ?? null,
        answers: d.answers ?? {},
        source: d.source,
      })
      stored = !error
      if (error) console.error("[subscribe lead] supabase insert error:", error.message)
    }
  } catch (e) {
    console.error("[subscribe lead] supabase insert failed:", e)
  }

  if (!tg && !mail && !stored) {
    // No delivery channel + no DB — log so the lead isn't silently lost.
    console.log("[subscribe lead] (no channel configured)\n" + text)
  }

  return NextResponse.json({
    ok: true,
    delivered: { telegram: tg, ownerEmail: mail, leadConfirm: confirm, supabase: stored },
  })
}
