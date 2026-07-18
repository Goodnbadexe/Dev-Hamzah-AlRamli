// vault-drip/route.ts — weekly cron that keeps the welcome-email promise:
// "Weeks 2–4 land in your inbox automatically." Week 1 is delivered at purchase by
// Gumroad; this job emails the next issue's entitlement-gated download link to each
// active subscriber, one issue at a time, spaced a week apart.
//
// SAFETY (hardened after security + correctness review):
//  - DRY RUN BY DEFAULT. Sends only when VAULT_DRIP_DRY_RUN === "false".
//  - Auth: needs Authorization: Bearer $CRON_SECRET. In production a MISSING secret
//    means 401 (fail closed) — never an open endpoint.
//  - Reserve-then-send: the drip_sends(email,week) row is inserted FIRST (its unique
//    constraint is the claim/lock); the email is sent only if we won the insert, and
//    the row is deleted if the send fails. So a crash/2nd-run cannot double-send.
//  - Weekly spacing gate: a subscriber whose last issue went out < 6 days ago is
//    skipped, so a misfired/manual extra run can't ship two issues the same week.
//  - Entitlement re-checked on every download (lib/vault/entitlement), so a refunded
//    buyer's link stops working even while the token is unexpired. The token carries
//    the buyer's ORIGINAL-CASE email so the case-sensitive sales lookup matches.
//  - Response body is PII-masked (no raw customer emails leak to the caller).

import { NextResponse } from "next/server"
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/server"
import { isEmailConfigured, sendEmail } from "@/lib/email/resend"
import { signClaim } from "@/lib/vault/sign"
import { VAULT } from "@/lib/vault/manifest"
import { DEFAULT_OS, type OsId, type TrackId, isOsId } from "@/lib/subscribe/tracks"

export const dynamic = "force-dynamic"

const WEEK_TTL_SECONDS = 7 * 24 * 3600 // drip links live a week (entitlement re-checked on use)
const MIN_SPACING_MS = 6 * 24 * 3600 * 1000 // don't ship a 2nd issue within ~a week
const LAST_WEEK = 6
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goodnbad.info"

// week number -> { track, deliverable }, built from the manifest (week 1..6).
const WEEK_MAP = (() => {
  const m = new Map<number, { track: TrackId; deliverable: (typeof VAULT)[TrackId][number] }>()
  for (const track of Object.keys(VAULT) as TrackId[]) {
    for (const d of VAULT[track]) {
      if (m.has(d.week)) throw new Error(`vault-drip: duplicate manifest week ${d.week}`)
      m.set(d.week, { track, deliverable: d })
    }
  }
  return m
})()
// Which weeks are missing from the manifest (defense against a future edit stranding buyers).
const MISSING_WEEKS = Array.from({ length: LAST_WEEK }, (_, i) => i + 1).filter((w) => !WEEK_MAP.has(w))

// Mask an email for logging/response so PII never leaves the server. "alice@gmail.com" -> "a***@gmail.com"
function mask(email: string): string {
  const [local, domain] = email.split("@")
  if (!domain) return "***"
  return `${local.slice(0, 1)}***@${domain}`
}

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== "production" // fail CLOSED in prod when unset
  return req.headers.get("authorization") === `Bearer ${secret}`
}

function dripHtml(outcomeEn: string, outcomeAr: string, url: string): string {
  return `<div style="font:15px/1.6 ui-sans-serif,system-ui;color:#18181b;max-width:520px">
    <p><b>This week's Vault is ready.</b></p>
    <p>${outcomeEn}</p>
    <p style="direction:rtl">${outcomeAr}</p>
    <p><a href="${url}" style="display:inline-block;padding:10px 18px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none">Download this week's PDF →</a></p>
    <p style="color:#71717a;font-size:13px">Link is personal to you and expires in 7 days. The Toolkit Vault · goodnbad.info</p>
  </div>`
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (MISSING_WEEKS.length) {
    return NextResponse.json({ ok: false, error: `manifest missing weeks: ${MISSING_WEEKS.join(",")}` }, { status: 500 })
  }
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: false, error: "supabase not configured" }, { status: 200 })

  const dryRun = process.env.VAULT_DRIP_DRY_RUN !== "false"
  const db = supabaseAdmin()
  const results: Array<Record<string, unknown>> = []

  // Active subscribers: not-refunded sales (treat NULL refunded as active), earliest purchase per person.
  // Keyed by lowercased email for stable dedup; keep the ORIGINAL-CASE email for the token/recipient.
  const { data: sales, error: salesErr } = await db
    .from("sales")
    .select("email, created_at, refunded")
    .neq("refunded", true)
  if (salesErr) return NextResponse.json({ ok: false, error: `sales query: ${salesErr.message}` }, { status: 200 })

  type Sub = { emailOriginal: string; anchorMs: number }
  const subs = new Map<string, Sub>()
  for (const s of sales ?? []) {
    const original = String(s.email || "").trim()
    if (!original) continue
    const key = original.toLowerCase()
    const t = Date.parse(s.created_at as string)
    if (!Number.isFinite(t)) continue
    const prev = subs.get(key)
    if (!prev) subs.set(key, { emailOriginal: original, anchorMs: t })
    else if (t < prev.anchorMs) prev.anchorMs = t
  }
  if (subs.size === 0) {
    return NextResponse.json({ ok: true, dryRun, subscribers: 0, sent: 0, note: "no active subscribers yet" })
  }

  // Ledger: which (email,week) already went out + when the last issue was sent (for spacing).
  const { data: sentRows } = await db.from("drip_sends").select("email, week, sent_at")
  const sentSet = new Set<string>()
  const lastSentMs = new Map<string, number>()
  for (const r of sentRows ?? []) {
    const key = String(r.email).toLowerCase()
    sentSet.add(`${key}|${r.week}`)
    const t = Date.parse(r.sent_at as string)
    if (Number.isFinite(t)) lastSentMs.set(key, Math.max(lastSentMs.get(key) ?? 0, t))
  }

  // Batch OS lookup (one query, not N) — OS is variant-only, missing => default, never blocks.
  const osByEmail = new Map<string, OsId>()
  const { data: leadRows } = await db
    .from("leads")
    .select("email, os, created_at")
    .in("email", [...subs.values()].map((s) => s.emailOriginal))
    .order("created_at", { ascending: false })
  for (const l of leadRows ?? []) {
    const key = String(l.email).toLowerCase()
    if (!osByEmail.has(key) && l.os && isOsId(l.os)) osByEmail.set(key, l.os) // first = latest
  }

  const emailReady = isEmailConfigured()
  const now = Date.now()
  const nowSec = Math.floor(now / 1000)
  let sentCount = 0

  for (const [key, sub] of subs) {
    // Weekly spacing: skip anyone whose last issue is younger than ~a week.
    const last = lastSentMs.get(key)
    if (last && now - last < MIN_SPACING_MS) continue

    const weeksSince = Math.floor((now - sub.anchorMs) / (7 * 86_400_000))
    const dueWeek = Math.min(1 + weeksSince, LAST_WEEK) // week 1 at purchase; +1 per elapsed week

    let target = 0
    for (let w = 2; w <= dueWeek; w++) {
      if (!sentSet.has(`${key}|${w}`)) { target = w; break }
    }
    if (!target) continue

    const entry = WEEK_MAP.get(target)
    if (!entry) { results.push({ email: mask(sub.emailOriginal), week: target, action: "ERROR: week unmapped" }); continue }

    const os: OsId = osByEmail.get(key) ?? DEFAULT_OS
    const token = signClaim({ id: entry.deliverable.id, email: sub.emailOriginal, exp: nowSec + WEEK_TTL_SECONDS })
    const url = `${SITE}/api/vault/${entry.deliverable.id}?t=${encodeURIComponent(token)}`

    if (dryRun) {
      results.push({ email: mask(sub.emailOriginal), week: target, deliverable: entry.deliverable.id, os, action: "DRY_RUN (would send)" })
      continue
    }
    if (!emailReady) { results.push({ email: mask(sub.emailOriginal), week: target, action: "SKIPPED — email not configured" }); continue }

    // RESERVE first: the unique(email,week) row is our claim. If someone already claimed
    // it (concurrent run), the insert errors and we skip — no send.
    const { error: claimErr } = await db.from("drip_sends").insert({ email: key, week: target })
    if (claimErr) { results.push({ email: mask(sub.emailOriginal), week: target, action: `skipped — already claimed (${claimErr.code ?? "err"})` }); continue }

    // ACT: send. If it fails, release the claim so a later run retries (miss > spam).
    const r = await sendEmail({
      to: sub.emailOriginal,
      subject: entry.deliverable.outcomeEn,
      html: dripHtml(entry.deliverable.outcomeEn, entry.deliverable.outcomeAr, url),
    })
    if (r.ok) {
      sentCount++
      results.push({ email: mask(sub.emailOriginal), week: target, deliverable: entry.deliverable.id, os, action: "SENT" })
    } else {
      await db.from("drip_sends").delete().eq("email", key).eq("week", target)
      results.push({ email: mask(sub.emailOriginal), week: target, action: `send failed, claim released: ${r.error}` })
    }
  }

  return NextResponse.json({ ok: true, dryRun, subscribers: subs.size, sent: sentCount, results })
}
