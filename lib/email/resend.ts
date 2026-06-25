// === METADATA ===
// Purpose: One tiny server-only email sender backed by Resend's HTTP API. No SDK
//          dependency — just fetch — so it adds zero install weight.
// Config:  RESEND_API_KEY + EMAIL_FROM (e.g. "Toolkit Vault <vault@goodnbad.info>").
//          When unset, sendEmail() returns { ok:false } WITHOUT throwing, so callers
//          (lead route, ping webhook) degrade gracefully and never break the funnel.
// Safety:  Every failure path logs via console.error — there is no silent swallow.
// === END METADATA ===
import "server-only"

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!key || !from) return { ok: false, error: "email not configured" }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(args.to) ? args.to : [args.to],
        subject: args.subject,
        html: args.html,
        ...(args.text ? { text: args.text } : {}),
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error(`[email] resend failed ${res.status}: ${detail.slice(0, 300)}`)
      return { ok: false, error: `resend ${res.status}` }
    }
    return { ok: true }
  } catch (e) {
    console.error("[email] resend threw:", e)
    return { ok: false, error: String(e) }
  }
}
