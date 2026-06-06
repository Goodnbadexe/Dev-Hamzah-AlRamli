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

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const LeadSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  plan: z.string().trim().max(40).optional(),
  promo: z.string().trim().max(60).optional(),
  answers: z.record(z.string(), z.string()).optional(),
})

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function formatLead(lead: z.infer<typeof LeadSchema>): string {
  const lines = [
    "🟢 New Repo Vault lead",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.plan ? `Plan: ${lead.plan}` : null,
    lead.promo ? `Promo: ${lead.promo}` : null,
  ].filter(Boolean) as string[]

  if (lead.answers && Object.keys(lead.answers).length) {
    lines.push("—", "Answers:")
    for (const [k, v] of Object.entries(lead.answers)) lines.push(`• ${k}: ${v}`)
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

async function notifyEmail(text: string): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_TO) return false
  try {
    const nodemailer = (await import("nodemailer")).default
    const port = Number(SMTP_PORT || 587)
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    await transport.sendMail({
      from: `Repo Vault <${SMTP_USER}>`,
      to: LEAD_TO,
      subject: "New Repo Vault lead",
      text,
    })
    return true
  } catch {
    return false
  }
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
  const [tg, mail] = await Promise.all([notifyTelegram(text), notifyEmail(text)])

  if (!tg && !mail) {
    // No delivery channel configured — log so the lead isn't silently lost.
    console.log("[subscribe lead] (no channel configured)\n" + text)
  }

  return NextResponse.json({ ok: true, delivered: { telegram: tg, email: mail } })
}
