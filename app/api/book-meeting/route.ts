// === METADATA ===
// Purpose: Public booking endpoint — creates a Google Calendar event + emails.
// Author: @Goodnbad.exe
// Inputs: JSON { name, email, company?, service, message?, startISO, durationMins?, website? }
// Outputs: JSON { ok, meetLink?, calendarLink?, error? }
// Security: Unauthenticated by design (public booking), so abuse is contained via
//   (1) per-IP rate limiting, (2) strict input validation, (3) a honeypot field.
//   Together these blunt email-bombing / calendar-spam without a login wall.
// Complexity: O(1) before the external Google calls.
// === END METADATA ===
import { NextResponse } from 'next/server'
import { createMeetingEvent } from '@/lib/google/calendar'
import { sendClientConfirmation, sendOwnerNotification } from '@/lib/google/gmail'
import { rateLimit } from '@/lib/rate-limit'
import { validateBookingInput } from '@/lib/booking/validate'

// Max 5 booking attempts per IP per 10 minutes. A real prospect books once;
// anything beyond this is almost certainly abuse.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export async function POST(req: Request) {
  try {
    // ── Rate limit (per IP) ───────────────────────────────────────────────────
    const ip = clientIp(req)
    const limit = rateLimit(`book-meeting:${ip}`, RATE_LIMIT)
    if (!limit.ok) {
      const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }

    // ── Validate + normalize untrusted input ──────────────────────────────────
    const body = await req.json().catch(() => null)
    const result = validateBookingInput(body)
    if (!result.ok) {
      // Honeypot trip: pretend everything is fine, do nothing.
      if (result.silent) {
        return NextResponse.json({ ok: true, meetLink: '', calendarLink: '' })
      }
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
    }

    const { name, email, company, service, message, startISO, durationMins } = result.data

    const event = await createMeetingEvent({
      clientName: name,
      clientEmail: email,
      company,
      service,
      message,
      startISO,
      durationMins,
    })

    await Promise.all([
      sendClientConfirmation({
        clientName: name,
        clientEmail: email,
        service,
        meetLink: event.meetLink,
        startISO,
        calendarLink: event.htmlLink,
      }),
      sendOwnerNotification({
        clientName: name,
        clientEmail: email,
        company,
        service,
        message,
        startISO,
        meetLink: event.meetLink,
        calendarLink: event.htmlLink,
      }),
    ])

    return NextResponse.json({ ok: true, meetLink: event.meetLink, calendarLink: event.htmlLink })
  } catch (err: any) {
    console.error('[book-meeting]', err?.message ?? err)
    return NextResponse.json({ ok: false, error: 'Booking failed. Please try again.' }, { status: 500 })
  }
}
