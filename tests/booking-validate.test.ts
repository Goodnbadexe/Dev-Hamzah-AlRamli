// === METADATA ===
// Purpose: Verify booking input validation rejects abuse vectors and accepts good input.
// Author: @Goodnbad.exe
// Inputs: validateBookingInput + rateLimit
// Outputs: Vitest assertions
// Assumptions: Vitest configured; pure functions, no Google deps.
// Tests: `npm test`
// Security: Covers honeypot, email format, date window, length caps, rate limiting.
// === END METADATA ===
import { describe, it, expect, beforeEach } from 'vitest'
import { validateBookingInput } from '@/lib/booking/validate'
import { rateLimit, __resetRateLimit } from '@/lib/rate-limit'

const NOW = Date.parse('2026-06-07T00:00:00Z')
const future = (ms: number) => new Date(NOW + ms).toISOString()

function valid(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Jane Client',
    email: 'jane@example.com',
    company: 'Acme Corp',
    service: 'Penetration Test',
    message: 'Need a scoped engagement.',
    startISO: future(24 * 60 * 60 * 1000), // tomorrow
    durationMins: 45,
    ...overrides,
  }
}

describe('validateBookingInput', () => {
  it('accepts and normalizes a well-formed booking', () => {
    const res = validateBookingInput(valid(), NOW)
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.data.email).toBe('jane@example.com')
      expect(res.data.durationMins).toBe(45)
    }
  })

  it('trims whitespace on string fields', () => {
    const res = validateBookingInput(valid({ name: '  Jane  ' }), NOW)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.name).toBe('Jane')
  })

  it('silently drops honeypot submissions', () => {
    const res = validateBookingInput(valid({ website: 'http://spam.test' }), NOW)
    expect(res.ok).toBe(false)
    if (!res.ok) {
      expect(res.silent).toBe(true)
      expect(res.status).toBe(200)
    }
  })

  it('rejects missing required fields', () => {
    expect(validateBookingInput(valid({ name: '' }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ email: '' }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ service: '' }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ startISO: '' }), NOW).ok).toBe(false)
  })

  it('rejects malformed emails', () => {
    for (const email of ['nope', 'a@b', 'a b@c.com', 'two@@at.com', 'no@dot']) {
      expect(validateBookingInput(valid({ email }), NOW).ok).toBe(false)
    }
  })

  it('rejects past and far-future dates', () => {
    expect(validateBookingInput(valid({ startISO: future(-60 * 60 * 1000) }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ startISO: future(400 * 24 * 60 * 60 * 1000) }), NOW).ok).toBe(false)
  })

  it('rejects an unparseable date', () => {
    expect(validateBookingInput(valid({ startISO: 'not-a-date' }), NOW).ok).toBe(false)
  })

  it('rejects out-of-range or non-integer durations', () => {
    expect(validateBookingInput(valid({ durationMins: 5 }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ durationMins: 999 }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ durationMins: 30.5 }), NOW).ok).toBe(false)
  })

  it('defaults duration when omitted', () => {
    const res = validateBookingInput(valid({ durationMins: undefined }), NOW)
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.data.durationMins).toBe(45)
  })

  it('rejects over-length fields', () => {
    expect(validateBookingInput(valid({ name: 'x'.repeat(121) }), NOW).ok).toBe(false)
    expect(validateBookingInput(valid({ message: 'x'.repeat(4001) }), NOW).ok).toBe(false)
  })

  it('rejects non-object bodies', () => {
    expect(validateBookingInput(null, NOW).ok).toBe(false)
    expect(validateBookingInput('string', NOW).ok).toBe(false)
  })
})

describe('rateLimit', () => {
  beforeEach(() => __resetRateLimit())

  it('allows up to the limit then blocks', () => {
    const opts = { limit: 3, windowMs: 60_000 }
    expect(rateLimit('k', opts).ok).toBe(true)
    expect(rateLimit('k', opts).ok).toBe(true)
    expect(rateLimit('k', opts).ok).toBe(true)
    expect(rateLimit('k', opts).ok).toBe(false)
  })

  it('isolates keys', () => {
    const opts = { limit: 1, windowMs: 60_000 }
    expect(rateLimit('a', opts).ok).toBe(true)
    expect(rateLimit('a', opts).ok).toBe(false)
    expect(rateLimit('b', opts).ok).toBe(true)
  })
})
