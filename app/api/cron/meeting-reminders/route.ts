import { NextResponse } from 'next/server'
import { getUpcomingEvents, markEventProperty, getAttendeeStatus } from '@/lib/google/calendar'
import { sendPreMeetingBrief, sendAcceptanceReminder } from '@/lib/google/gmail'
import { generatePreMeetingBrief } from '@/lib/meetings/briefing'

// Protect cron endpoint — Vercel sends the CRON_SECRET in Authorization header
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // dev fallback
  return req.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = Date.now()
  const results: string[] = []

  try {
    const events = await getUpcomingEvents(25)

    for (const event of events) {
      const props = event.extendedProperties?.private ?? {}
      const startMs = event.start?.dateTime
        ? new Date(event.start.dateTime).getTime()
        : null

      if (!startMs || !event.id) continue

      const minsUntil = (startMs - now) / 60_000
      const bookedAt = props.bookedAt ? new Date(props.bookedAt).getTime() : null
      const hoursSinceBooked = bookedAt ? (now - bookedAt) / 3_600_000 : null

      // ── 45-min briefing ──────────────────────────────────────────────
      if (minsUntil >= 40 && minsUntil <= 50 && props.briefingSent !== 'true') {
        try {
          const brief = await generatePreMeetingBrief({
            clientName: props.clientName ?? event.summary ?? 'Client',
            company: props.company ?? '',
            service: props.service ?? 'Consultation',
            message: event.description ?? '',
            startISO: event.start!.dateTime!,
          })

          const meetLink =
            event.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ?? ''

          await sendPreMeetingBrief({
            clientName: props.clientName ?? 'Client',
            service: props.service ?? 'Consultation',
            startISO: event.start!.dateTime!,
            meetLink,
            brief,
          })

          await markEventProperty(event.id, 'briefingSent', 'true')
          results.push(`brief:${event.id}`)
        } catch (e: any) {
          results.push(`brief_err:${event.id}:${e.message}`)
        }
      }

      // ── 24-hour acceptance reminder ──────────────────────────────────
      if (
        hoursSinceBooked !== null &&
        hoursSinceBooked >= 23 &&
        hoursSinceBooked <= 26 &&
        props.reminderSent !== 'true'
      ) {
        try {
          const status = await getAttendeeStatus(event.id)
          if (status === 'needsAction') {
            const meetLink =
              event.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ?? ''

            await sendAcceptanceReminder({
              clientName: props.clientName ?? 'there',
              clientEmail: props.clientEmail ?? '',
              service: props.service ?? 'Consultation',
              startISO: event.start!.dateTime!,
              meetLink,
              calendarLink: event.htmlLink ?? '',
            })

            await markEventProperty(event.id, 'reminderSent', 'true')
            results.push(`reminder:${event.id}`)
          } else {
            results.push(`already_${status}:${event.id}`)
          }
        } catch (e: any) {
          results.push(`reminder_err:${event.id}:${e.message}`)
        }
      }
    }

    return NextResponse.json({ ok: true, processed: results, ts: new Date().toISOString() })
  } catch (err: any) {
    console.error('[cron/meeting-reminders]', err?.message ?? err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
