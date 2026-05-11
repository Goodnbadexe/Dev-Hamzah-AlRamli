import { google } from 'googleapis'
import { getOAuth2Client } from './auth'

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? 'primary'

export interface BookingDetails {
  clientName: string
  clientEmail: string
  company: string
  service: string
  message: string
  startISO: string   // ISO 8601 datetime chosen by client
  durationMins: number
}

export interface CalendarEvent {
  id: string
  meetLink: string
  htmlLink: string
}

export async function createMeetingEvent(booking: BookingDetails): Promise<CalendarEvent> {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: 'v3', auth })

  const start = new Date(booking.startISO)
  const end = new Date(start.getTime() + booking.durationMins * 60_000)

  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary: `[Goodnbad.exe] ${booking.service} — ${booking.clientName}`,
      description: [
        `Client: ${booking.clientName}`,
        `Company: ${booking.company || 'N/A'}`,
        `Email: ${booking.clientEmail}`,
        `Service: ${booking.service}`,
        '',
        'Inquiry:',
        booking.message || '(no message provided)',
        '',
        '---',
        `Booked via goodnbad.info/services`,
      ].join('\n'),
      start: { dateTime: start.toISOString(), timeZone: 'Asia/Riyadh' },
      end: { dateTime: end.toISOString(), timeZone: 'Asia/Riyadh' },
      attendees: [
        { email: 'alramli.hamzah@gmail.com', displayName: 'Hamzah Al-Ramli', organizer: true },
        { email: booking.clientEmail, displayName: booking.clientName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `goodnbad-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      // Store booking metadata in extended properties so cron can read them
      extendedProperties: {
        private: {
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          service: booking.service,
          briefingSent: 'false',
          reminderSent: 'false',
          bookedAt: new Date().toISOString(),
        },
      },
    },
  })

  const event = response.data
  const meetLink =
    event.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ?? ''

  return {
    id: event.id!,
    meetLink,
    htmlLink: event.htmlLink!,
  }
}

export async function getUpcomingEvents(withinHours = 25) {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: 'v3', auth })

  const now = new Date()
  const until = new Date(now.getTime() + withinHours * 60 * 60_000)

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: until.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  })

  return res.data.items ?? []
}

export async function markEventProperty(eventId: string, key: string, value: string) {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: 'v3', auth })

  await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    requestBody: {
      extendedProperties: { private: { [key]: value } },
    },
  })
}

export async function getAttendeeStatus(eventId: string): Promise<'accepted' | 'declined' | 'needsAction' | 'tentative'> {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: 'v3', auth })

  const res = await calendar.events.get({ calendarId: CALENDAR_ID, eventId })
  const attendees = res.data.attendees ?? []
  const client = attendees.find((a) => a.email !== 'alramli.hamzah@gmail.com')
  return (client?.responseStatus as any) ?? 'needsAction'
}
