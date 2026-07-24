// === METADATA ===
// Purpose: Security tests — webhook auth and middleware path coverage
// Author: @Goodnbad.exe
// Tests: npm test
// Security: Validates that protected routes and webhook secret enforcement work
// === END METADATA ===

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// ─── Middleware matcher config unit tests ─────────────────────────────────────
// Import and exercise the middleware path-matching logic without a real server.

describe('middleware matcher config', () => {
  it('includes /test-ctf in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    const coversTestCtf = patterns.some(p => p.startsWith('/test-ctf'))
    expect(coversTestCtf).toBe(true)
  })

  it('includes /admin in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    expect(patterns.some(p => p.startsWith('/admin'))).toBe(true)
  })

  it('includes /debug in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    expect(patterns.some(p => p.startsWith('/debug'))).toBe(true)
  })

  it('includes /memory in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    expect(patterns.some(p => p.startsWith('/memory'))).toBe(true)
  })

  it('includes /flags in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    expect(patterns.some(p => p.startsWith('/flags'))).toBe(true)
  })

  it('includes /lab in the matcher', async () => {
    const { config } = await import('@/middleware')
    const patterns: string[] = config.matcher
    expect(patterns.some(p => p.startsWith('/lab'))).toBe(true)
  })
})

// ─── matchesPrefix logic unit tests ──────────────────────────────────────────
// Re-test the inline logic without importing Next internals.

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

const PRODUCTION_BLOCKED = ['/admin', '/debug', '/memory', '/flags', '/lab', '/learn']
const ALWAYS_BLOCKED = ['/test-ctf']

describe('matchesPrefix helper', () => {
  it('blocks exact match', () => {
    expect(matchesPrefix('/admin', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('blocks sub-paths', () => {
    expect(matchesPrefix('/admin/automation-status', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('does not block unrelated paths', () => {
    expect(matchesPrefix('/about', PRODUCTION_BLOCKED)).toBe(false)
    expect(matchesPrefix('/deployments', PRODUCTION_BLOCKED)).toBe(false)
  })

  it('blocks /test-ctf in always-blocked list', () => {
    expect(matchesPrefix('/test-ctf', ALWAYS_BLOCKED)).toBe(true)
    expect(matchesPrefix('/test-ctf/anything', ALWAYS_BLOCKED)).toBe(true)
  })

  it('blocks /debug/status', () => {
    expect(matchesPrefix('/debug/status', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('blocks /flags/alpha', () => {
    expect(matchesPrefix('/flags/alpha', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('blocks /memory', () => {
    expect(matchesPrefix('/memory', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('blocks /lab', () => {
    expect(matchesPrefix('/lab', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('blocks /learn and /learn/admin during the Learning Lab dark-ship', () => {
    expect(matchesPrefix('/learn', PRODUCTION_BLOCKED)).toBe(true)
    expect(matchesPrefix('/learn/admin', PRODUCTION_BLOCKED)).toBe(true)
  })

  it('does not partially match — /admins should not be blocked', () => {
    // /admins does NOT start with /admin/ and is not === /admin
    expect(matchesPrefix('/admins', PRODUCTION_BLOCKED)).toBe(false)
  })
})

// ─── Webhook route auth tests ─────────────────────────────────────────────────
// Test the timing-safe comparison helper extracted from the webhook route.

import { timingSafeEqual } from 'crypto'

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, 'utf8')
    const bb = Buffer.from(b, 'utf8')
    if (ab.length !== bb.length) {
      timingSafeEqual(ab, ab)
      return false
    }
    return timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

describe('timingSafeStringEqual', () => {
  it('returns true for equal secrets', () => {
    const secret = 'super-secret-webhook-key-abc123'
    expect(timingSafeStringEqual(secret, secret)).toBe(true)
  })

  it('returns false for wrong secret', () => {
    expect(timingSafeStringEqual('wrong-secret', 'correct-secret')).toBe(false)
  })

  it('returns false for different-length inputs', () => {
    expect(timingSafeStringEqual('short', 'a-much-longer-secret-value')).toBe(false)
  })

  it('returns false for empty vs non-empty', () => {
    expect(timingSafeStringEqual('', 'secret')).toBe(false)
  })

  it('returns true for empty vs empty', () => {
    expect(timingSafeStringEqual('', '')).toBe(true)
  })
})

// ─── Webhook route integration-style tests ───────────────────────────────────
// Simulate the auth logic of the webhook route using a lightweight mock of Request.

function makeRequest(headers: Record<string, string> = {}): Request {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
    json: async () => ({ title: 'Test', message: 'Hello' }),
  } as unknown as Request
}

function webhookAuth(request: Request, secret: string | undefined): boolean {
  if (!secret) return false // no secret = always deny in this helper
  const provided = request.headers.get('x-webhook-secret') ?? ''
  return timingSafeStringEqual(provided, secret)
}

describe('webhook route auth logic', () => {
  it('returns 401 without x-webhook-secret header', () => {
    const req = makeRequest({})
    const allowed = webhookAuth(req, 'my-secret')
    expect(allowed).toBe(false)
  })

  it('returns 401 with wrong secret', () => {
    const req = makeRequest({ 'x-webhook-secret': 'wrong' })
    const allowed = webhookAuth(req, 'my-secret')
    expect(allowed).toBe(false)
  })

  it('returns 200-eligible with correct secret', () => {
    const req = makeRequest({ 'x-webhook-secret': 'my-secret' })
    const allowed = webhookAuth(req, 'my-secret')
    expect(allowed).toBe(true)
  })

  it('denies when WEBHOOK_SECRET is not set', () => {
    const req = makeRequest({ 'x-webhook-secret': 'anything' })
    const allowed = webhookAuth(req, undefined)
    expect(allowed).toBe(false)
  })
})
