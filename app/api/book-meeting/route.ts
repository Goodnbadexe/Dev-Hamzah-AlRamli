import { NextResponse } from 'next/server'
import { createMeetingEvent } from '@/lib/google/calendar'
import { sendClientConfirmation, sendOwnerNotification } from '@/lib/google/gmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, company, service, message, startISO, durationMins = 45 } = body

    if (!name || !email || !service || !startISO) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const event = await createMeetingEvent({
      clientName: name,
      clientEmail: email,
      company: company ?? '',
      service,
      message: message ?? '',
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
        company: company ?? '',
        service,
        message: message ?? '',
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
