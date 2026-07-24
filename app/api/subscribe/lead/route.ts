// === METADATA ===
// Purpose: Capture a /subscribe funnel lead (name, email, quiz answers, chosen
//          plan + promo) AND send the subscriber a personalized welcome + free
//          teaser email so signing up has an immediate, visible payoff.
// Delivery: To Hamzah — Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID) and/or an
//          SMTP alert to LEAD_TO. To the subscriber — an SMTP welcome email
//          (sendWelcomeEmail) with a teaser link for their matched track. Every
//          channel fails soft: an unconfigured/erroring channel still returns ok
//          (the lead is logged server-side) so the funnel never breaks.
// Security: input validated with zod; user-supplied name escaped before HTML; the
//          teaser link is built from a validated track enum; no secrets in responses.
// === END METADATA ===

import { NextResponse } from "next/server"
import { z } from "zod"
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server"
import { isTrackId, orderTracksByDisplay, trackById, type TrackId } from "@/lib/subscribe/tracks"
import { getPostHogClient } from "@/lib/posthog-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Canonical site origin for links in the subscriber welcome email. Hardcoded to
// match the rest of the app (layout metadataBase etc.); overridable for previews.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.goodnbad.info").replace(/\/+$/, "")

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

// Shared nodemailer transport for BOTH the internal lead alert (to Hamzah) and the
// subscriber welcome email. Returns null when SMTP isn't configured so callers
// degrade gracefully instead of throwing.
async function smtpTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  const nodemailer = (await import("nodemailer")).default
  const port = Number(SMTP_PORT || 587)
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

// Internal alert → Hamzah (LEAD_TO). Plain text; this is an ops notification.
async function notifyEmail(text: string): Promise<boolean> {
  const { SMTP_USER, LEAD_TO } = process.env
  if (!LEAD_TO) return false
  try {
    const transport = await smtpTransport()
    if (!transport) return false
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

// The subscriber's matched track decides which teaser we hand them. The quiz stores
// track ids in lead.tracks; keep only real TrackIds, order by display, and fall back
// to the flagship Security vault when the quiz wasn't taken (waitlist/promo entry).
function primaryTrack(tracks?: string[]): TrackId {
  const valid = orderTracksByDisplay((tracks ?? []).filter(isTrackId) as TrackId[])
  return valid[0] ?? "security"
}

// Subscriber-facing welcome + free teaser. Fires for ANYONE who submits the funnel.
// Bilingual (EN + AR), personalized to their matched track. Never throws — the
// Hamzah-facing alerts and the funnel response are unaffected if this fails.
async function sendWelcomeEmail(lead: z.infer<typeof LeadSchema>): Promise<boolean> {
  const { SMTP_USER, LEAD_TO } = process.env
  try {
    const transport = await smtpTransport()
    if (!transport) return false

    const firstRaw = lead.name.split(/\s+/)[0] || lead.name
    const first = escapeHtml(firstRaw) // name is user input → escape before HTML
    const track = primaryTrack(lead.tracks)
    const t = trackById(track)
    const teaser = `${SITE}/teasers/${track}`
    const subscribe = `${SITE}/subscribe`

    const text = [
      `You're in, ${firstRaw}.`,
      "",
      "You just joined the Toolkit Vault — a weekly drop of under-the-radar open-source tools, each with a paste-ready prompt you drop straight into Claude, ChatGPT, or Codex. Real tools you actually run, not another feed to scroll.",
      "",
      `Here's a free issue to start — a taste of the ${t.en} vault:`,
      teaser,
      "",
      `Want the full thing? See every vault: ${subscribe}`,
      "",
      `أهلاً ${firstRaw}! انضميت لخزينة الأدوات. هذي عيّنة مجانية من خزينة ${t.ar}:`,
      teaser,
      "",
      "— Hamzah · goodnbad.info",
      "Reply to this email any time you get stuck.",
    ].join("\n")

    const html = `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#0b0f14;">
  <div style="max-width:560px;margin:0 auto;padding:34px 24px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#e6edf3;background:#0b0f14;">
    <p style="font:600 11px/1 ui-monospace,Consolas,monospace;letter-spacing:3px;text-transform:uppercase;color:#34d399;margin:0 0 18px;">goodnbad &middot; the toolkit vault</p>
    <h1 style="font-size:24px;line-height:1.25;margin:0 0 14px;color:#fff;">You're in, ${first}.</h1>
    <p style="font-size:15px;line-height:1.6;color:#b9c4d0;margin:0 0 16px;">You just joined the Toolkit Vault — a weekly drop of under-the-radar open-source tools, each with a paste-ready prompt you drop straight into Claude, ChatGPT, or Codex. Real tools you actually run, not another feed to scroll.</p>
    <p style="font-size:15px;line-height:1.6;color:#b9c4d0;margin:0 0 22px;">Here's a free issue to start — a taste of the <b style="color:#e6edf3;">${t.en}</b> vault:</p>
    <a href="${teaser}" style="display:inline-block;background:#10b981;color:#04130d;font:700 14px/1 ui-monospace,Consolas,monospace;text-decoration:none;padding:14px 22px;border-radius:8px;letter-spacing:.4px;">&#8595; Download your free teaser</a>
    <p style="font-size:14px;line-height:1.6;color:#8b97a4;margin:24px 0 4px;">Want the full thing? Each vault is the complete issue — 5 tools, OS-tuned, bilingual.</p>
    <p style="margin:0 0 26px;"><a href="${subscribe}" style="color:#34d399;font-size:14px;text-decoration:none;">See all the vaults →</a></p>
    <hr style="border:none;border-top:1px solid #1b2530;margin:0 0 22px;">
    <div dir="rtl" style="text-align:right;">
      <p style="font-size:15px;line-height:1.8;color:#b9c4d0;margin:0 0 16px;">أهلاً ${first}! انضميت لخزينة الأدوات — كل أسبوع ننزّل أدوات مفتوحة المصدر نادرة، كل وحدة معها برومبت جاهز تنسخه مباشرة في Claude أو ChatGPT أو Codex. وهذي عيّنة مجانية من خزينة <b style="color:#e6edf3;">${t.ar}</b>:</p>
      <a href="${teaser}" style="display:inline-block;background:#10b981;color:#04130d;font:700 14px/1 Tahoma,Arial,sans-serif;text-decoration:none;padding:14px 22px;border-radius:8px;">&#8595; حمّل العيّنة المجانية</a>
    </div>
    <p style="font:11px/1.6 ui-monospace,Consolas,monospace;color:#5b6776;margin:30px 0 0;">— Hamzah &middot; goodnbad.info<br>Reply to this email any time you get stuck.</p>
  </div>
</body></html>`

    await transport.sendMail({
      from: `The Toolkit Vault <${SMTP_USER}>`,
      to: lead.email,
      replyTo: LEAD_TO || SMTP_USER, // replies land in Hamzah's inbox
      subject: `You're in, ${firstRaw} — your free Toolkit Vault issue is inside`,
      text,
      html,
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
  const [tg, mail, welcome] = await Promise.all([
    notifyTelegram(text), // → Hamzah (Telegram)
    notifyEmail(text), // → Hamzah (SMTP alert)
    sendWelcomeEmail(parsed.data), // → subscriber (welcome + free teaser)
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

  // Track lead capture server-side. Use email as distinctId so server and client
  // events correlate; never put email in capture() properties.
  try {
    const ph = getPostHogClient()
    const d = parsed.data
    ph.capture({
      distinctId: d.email,
      event: "lead_captured",
      properties: {
        source: d.source,
        bundle: d.bundle ?? null,
        tracks: d.tracks ?? [],
        tool: d.tool ?? null,
        os: d.os ?? null,
        read_factor: d.readFactor ?? null,
        has_promo: !!d.promo,
        stored_in_db: stored,
        delivered_telegram: tg,
        delivered_email: mail,
      },
    })
    await ph.flush()
  } catch (e) {
    console.error("[subscribe lead] posthog capture failed:", e)
  }

  return NextResponse.json({ ok: true, delivered: { telegram: tg, email: mail, welcome, supabase: stored } })
}
