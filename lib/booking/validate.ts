// === METADATA ===
// Purpose: Pure, dependency-free validation + normalization for meeting bookings.
// Author: @Goodnbad.exe
// Inputs: Untrusted JSON body from POST /api/book-meeting.
// Outputs: Discriminated result — { ok:true, data } or { ok:false, status, error }.
//   Honeypot trips return { ok:false, silent:true } so the route can fake success
//   without doing work (don't teach bots which field they tripped).
// Assumptions: Caller (route) handles auth/rate-limit separately. This function
//   trusts NOTHING about field presence, type, length, or shape.
// Complexity: O(1).
// Security: First line of defense against spam/email-bombing/calendar abuse —
//   strict email format, length caps, sane date window, honeypot.
// === END METADATA ===

export interface CleanBooking {
  name: string
  email: string
  company: string
  service: string
  message: string
  startISO: string
  durationMins: number
}

export type ValidationResult =
  | { ok: true; data: CleanBooking }
  | { ok: false; status: number; error: string; silent?: boolean }

// Bounds — named constants, no magic numbers.
const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_COMPANY = 200
const MAX_SERVICE = 120
const MAX_MESSAGE = 4000
const MIN_DURATION = 15
const MAX_DURATION = 120
const DEFAULT_DURATION = 45
const PAST_GRACE_MS = 5 * 60 * 1000 // allow 5 min clock skew
const MAX_FUTURE_MS = 365 * 24 * 60 * 60 * 1000 // no bookings >1y out

// Pragmatic email shape check. Not RFC-perfect (nothing sane is), but rejects the
// obvious garbage and anything with whitespace/multiple @.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export function validateBookingInput(body: unknown, now: number = Date.now()): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'Invalid request body.' }
  }
  const b = body as Record<string, unknown>

  // ── Honeypot ──────────────────────────────────────────────────────────────
  // Hidden field a human never fills. If present, silently accept-and-drop.
  if (asString(b.website).length > 0) {
    return { ok: false, status: 200, error: 'honeypot', silent: true }
  }

  // ── Required fields ─────────────────────────────────────────────────────────
  const name = asString(b.name)
  const email = asString(b.email)
  const service = asString(b.service)
  const startISO = asString(b.startISO)

  if (!name || !email || !service || !startISO) {
    return { ok: false, status: 400, error: 'Missing required fields.' }
  }

  // ── Lengths ─────────────────────────────────────────────────────────────────
  if (name.length > MAX_NAME) return { ok: false, status: 400, error: 'Name too long.' }
  if (email.length > MAX_EMAIL) return { ok: false, status: 400, error: 'Email too long.' }
  if (service.length > MAX_SERVICE) return { ok: false, status: 400, error: 'Service too long.' }

  const company = asString(b.company)
  const message = asString(b.message)
  if (company.length > MAX_COMPANY) return { ok: false, status: 400, error: 'Company too long.' }
  if (message.length > MAX_MESSAGE) return { ok: false, status: 400, error: 'Message too long.' }

  // ── Email format ─────────────────────────────────────────────────────────────
  if (!EMAIL_RE.test(email)) {
    return { ok: false, status: 400, error: 'Invalid email address.' }
  }

  // ── Date window ──────────────────────────────────────────────────────────────
  const start = new Date(startISO)
  const startMs = start.getTime()
  if (Number.isNaN(startMs)) {
    return { ok: false, status: 400, error: 'Invalid date.' }
  }
  if (startMs < now - PAST_GRACE_MS) {
    return { ok: false, status: 400, error: 'Meeting time must be in the future.' }
  }
  if (startMs > now + MAX_FUTURE_MS) {
    return { ok: false, status: 400, error: 'Meeting time is too far in the future.' }
  }

  // ── Duration ─────────────────────────────────────────────────────────────────
  const rawDuration = b.durationMins
  let durationMins = DEFAULT_DURATION
  if (rawDuration !== undefined && rawDuration !== null) {
    const n = Number(rawDuration)
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < MIN_DURATION || n > MAX_DURATION) {
      return { ok: false, status: 400, error: 'Invalid duration.' }
    }
    durationMins = n
  }

  return {
    ok: true,
    data: { name, email, company, service, message, startISO, durationMins },
  }
}
