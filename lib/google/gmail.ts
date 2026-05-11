import { google } from 'googleapis'
import { getOAuth2Client } from './auth'

const OWNER_EMAIL = 'alramli.hamzah@gmail.com'
const OWNER_NAME = 'Hamzah Al-Ramli (Goodnbad.exe)'

function buildRawMessage(opts: {
  to: string
  toName: string
  subject: string
  html: string
  from?: string
  fromName?: string
}): string {
  const from = opts.from ?? OWNER_EMAIL
  const fromName = opts.fromName ?? OWNER_NAME
  const message = [
    `From: ${fromName} <${from}>`,
    `To: ${opts.toName} <${opts.to}>`,
    `Subject: ${opts.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    opts.html,
  ].join('\r\n')

  return Buffer.from(message).toString('base64url')
}

async function sendEmail(opts: Parameters<typeof buildRawMessage>[0]) {
  const auth = getOAuth2Client()
  const gmail = google.gmail({ version: 'v1', auth })
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawMessage(opts) },
  })
}

export async function sendClientConfirmation(opts: {
  clientName: string
  clientEmail: string
  service: string
  meetLink: string
  startISO: string
  calendarLink: string
}) {
  const dateStr = new Date(opts.startISO).toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  await sendEmail({
    to: opts.clientEmail,
    toName: opts.clientName,
    subject: `✅ Consultation Confirmed — ${opts.service} | Goodnbad.exe`,
    html: `
<div style="font-family:monospace;background:#09090b;color:#e4e4e7;padding:32px;max-width:600px;border:1px solid #27272a;border-radius:8px">
  <div style="color:#10b981;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">GOODNBAD.EXE // SECURE CHANNEL</div>
  <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px">Your consultation is confirmed.</h1>
  <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px">Hi ${opts.clientName}, your session has been booked and added to the calendar.</p>

  <div style="background:#18181b;border:1px solid #3f3f46;border-radius:6px;padding:20px;margin-bottom:24px">
    <div style="margin-bottom:12px"><span style="color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">SERVICE</span><br><span style="color:#10b981;font-size:15px;font-weight:bold">${opts.service}</span></div>
    <div style="margin-bottom:12px"><span style="color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">DATE & TIME (AST)</span><br><span style="color:#ffffff;font-size:15px">${dateStr}</span></div>
    <div><span style="color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">MEETING LINK</span><br><a href="${opts.meetLink}" style="color:#10b981;font-size:15px">${opts.meetLink}</a></div>
  </div>

  <p style="color:#a1a1aa;font-size:13px;margin:0 0 8px">Please <strong style="color:#ffffff">accept the calendar invite</strong> so I can confirm your slot.</p>
  <p style="color:#a1a1aa;font-size:13px;margin:0 0 24px">If you need to reschedule, reply to this email or call <strong style="color:#ffffff">+966 50 850 1717</strong>.</p>

  <a href="${opts.meetLink}" style="display:inline-block;background:#10b981;color:#000000;font-weight:bold;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px">Join Meeting</a>

  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #27272a;color:#52525b;font-size:11px">
    Hamzah Al-Ramli · Goodnbad.exe · Riyadh, Saudi Arabia<br>
    alramli.hamzah@gmail.com · +966 50 850 1717
  </div>
</div>`,
  })
}

export async function sendOwnerNotification(opts: {
  clientName: string
  clientEmail: string
  company: string
  service: string
  message: string
  startISO: string
  meetLink: string
  calendarLink: string
}) {
  const dateStr = new Date(opts.startISO).toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  await sendEmail({
    to: OWNER_EMAIL,
    toName: OWNER_NAME,
    subject: `🔔 New Booking: ${opts.service} — ${opts.clientName}`,
    html: `
<div style="font-family:monospace;background:#09090b;color:#e4e4e7;padding:32px;max-width:600px;border:1px solid #27272a;border-radius:8px">
  <div style="color:#f59e0b;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">NEW BOOKING ALERT</div>
  <h1 style="color:#ffffff;font-size:20px;margin:0 0 20px">Someone booked a consultation.</h1>

  <div style="background:#18181b;border:1px solid #3f3f46;border-radius:6px;padding:20px;margin-bottom:20px">
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">CLIENT</span><br><span style="color:#ffffff;font-size:15px">${opts.clientName}</span></div>
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">EMAIL</span><br><a href="mailto:${opts.clientEmail}" style="color:#10b981">${opts.clientEmail}</a></div>
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">COMPANY</span><br><span style="color:#ffffff">${opts.company || 'Not provided'}</span></div>
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">SERVICE</span><br><span style="color:#f59e0b;font-weight:bold">${opts.service}</span></div>
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">SCHEDULED (AST)</span><br><span style="color:#ffffff">${dateStr}</span></div>
    <div><span style="color:#71717a;font-size:11px;text-transform:uppercase">INQUIRY</span><br><span style="color:#a1a1aa;white-space:pre-wrap">${opts.message || '(none)'}</span></div>
  </div>

  <div style="display:flex;gap:12px">
    <a href="${opts.meetLink}" style="display:inline-block;background:#10b981;color:#000;font-weight:bold;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px">Join Meeting</a>
    <a href="${opts.calendarLink}" style="display:inline-block;background:#3f3f46;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px">View in Calendar</a>
  </div>
</div>`,
  })
}

export async function sendPreMeetingBrief(opts: {
  clientName: string
  service: string
  startISO: string
  meetLink: string
  brief: string
}) {
  const dateStr = new Date(opts.startISO).toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit', minute: '2-digit',
  })

  await sendEmail({
    to: OWNER_EMAIL,
    toName: OWNER_NAME,
    subject: `⚡ 45-MIN BRIEF: ${opts.clientName} — ${opts.service} @ ${dateStr}`,
    html: `
<div style="font-family:monospace;background:#09090b;color:#e4e4e7;padding:32px;max-width:600px;border:1px solid #27272a;border-radius:8px">
  <div style="color:#a855f7;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">⚡ PRE-MEETING BRIEF // T-45 MINUTES</div>
  <h1 style="color:#ffffff;font-size:18px;margin:0 0 4px">${opts.clientName} · ${opts.service}</h1>
  <p style="color:#71717a;font-size:13px;margin:0 0 24px">Meeting starts at ${dateStr} AST</p>

  <div style="background:#18181b;border:1px solid #7c3aed;border-radius:6px;padding:20px;margin-bottom:20px;white-space:pre-wrap;color:#d4d4d8;font-size:13px;line-height:1.7">
${opts.brief}
  </div>

  <a href="${opts.meetLink}" style="display:inline-block;background:#a855f7;color:#000;font-weight:bold;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px">→ Join Meeting Now</a>
</div>`,
  })
}

export async function sendAcceptanceReminder(opts: {
  clientName: string
  clientEmail: string
  service: string
  startISO: string
  meetLink: string
  calendarLink: string
}) {
  const dateStr = new Date(opts.startISO).toLocaleString('en-SA', {
    timeZone: 'Asia/Riyadh',
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  await sendEmail({
    to: opts.clientEmail,
    toName: opts.clientName,
    subject: `⏳ Action needed — Please confirm your consultation | Goodnbad.exe`,
    html: `
<div style="font-family:monospace;background:#09090b;color:#e4e4e7;padding:32px;max-width:600px;border:1px solid #27272a;border-radius:8px">
  <div style="color:#f59e0b;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px">ACTION REQUIRED</div>
  <h1 style="color:#ffffff;font-size:20px;margin:0 0 8px">Please confirm your consultation.</h1>
  <p style="color:#a1a1aa;font-size:14px;margin:0 0 24px">Hi ${opts.clientName}, your calendar invite is still pending. Please accept it to secure your slot.</p>

  <div style="background:#18181b;border:1px solid #f59e0b;border-radius:6px;padding:20px;margin-bottom:24px">
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">SERVICE</span><br><span style="color:#f59e0b;font-weight:bold">${opts.service}</span></div>
    <div style="margin-bottom:10px"><span style="color:#71717a;font-size:11px;text-transform:uppercase">DATE & TIME (AST)</span><br><span style="color:#ffffff">${dateStr}</span></div>
    <div><span style="color:#71717a;font-size:11px;text-transform:uppercase">MEETING LINK</span><br><a href="${opts.meetLink}" style="color:#10b981">${opts.meetLink}</a></div>
  </div>

  <p style="color:#a1a1aa;font-size:13px;margin:0 0 16px">If this time no longer works, reply to this email or call <strong style="color:#ffffff">+966 50 850 1717</strong> to reschedule.</p>

  <a href="${opts.meetLink}" style="display:inline-block;background:#f59e0b;color:#000000;font-weight:bold;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px">Confirm & Join</a>

  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #27272a;color:#52525b;font-size:11px">
    Hamzah Al-Ramli · Goodnbad.exe · alramli.hamzah@gmail.com
  </div>
</div>`,
  })
}
