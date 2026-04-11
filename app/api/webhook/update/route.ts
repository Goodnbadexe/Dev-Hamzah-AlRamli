// === METADATA ===
// Purpose: Webhook to record update events and optionally broadcast (dry-run by default)
// Author: @Goodnbad.exe
// Inputs: JSON { title, message, url?, source? }
// Outputs: JSON { ok, results }
// Assumptions: App Router; server runtime
// Tests: curl POST with Authorization: Bearer <WEBHOOK_SECRET>
// Security: Requires WEBHOOK_SECRET env var; rejects unauthenticated calls
// Complexity: O(P) with P = platforms
// === END METADATA ===
import { NextResponse } from 'next/server'
import { addUpdate } from '@/lib/updates'
import { broadcastAll } from '@/lib/social/broadcaster'

function isAuthorized(request: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return false
  const authHeader = request.headers.get('authorization') ?? ''
  return authHeader === `Bearer ${secret}`
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body.title !== 'string' || typeof body.message !== 'string') {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 })
  }

  const evt = {
    ts: new Date().toISOString(),
    source: String(body.source || 'webhook'),
    title: body.title.trim().slice(0, 200),
    message: body.message.trim().slice(0, 2000),
    url: typeof body.url === 'string' ? body.url : undefined,
  }

  addUpdate(evt)
  const results = await broadcastAll({ title: evt.title, message: evt.message, url: evt.url, source: evt.source })
  return NextResponse.json({ ok: true, results })
}
