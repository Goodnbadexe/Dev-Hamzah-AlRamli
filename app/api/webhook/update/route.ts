// === METADATA ===
// Purpose: Authenticated webhook endpoint — receives update events and broadcasts
// Author: @Goodnbad.exe
// Inputs: JSON { title, message, url?, source? } + x-webhook-secret header
// Outputs: JSON { ok, results }
// Security: Shared-secret header validation. Secret stored in WEBHOOK_SECRET env var.
//           Rejects all requests that do not present the correct header value.
// Complexity: O(P) with P = platforms
// === END METADATA ===
import { NextResponse } from 'next/server'
import { addUpdate } from '@/lib/updates'
import { broadcastAll } from '@/lib/social/broadcaster'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

export async function POST(request: Request) {
  // ── Auth: shared-secret header validation ────────────────────────────────
  // If WEBHOOK_SECRET is configured, require it in every request.
  // If not configured (local dev without the var), the endpoint is open only
  // when NODE_ENV !== 'production' — prevents accidental open exposure in prod.
  if (WEBHOOK_SECRET) {
    const provided = request.headers.get('x-webhook-secret')
    if (provided !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    // No secret configured + production = always reject
    // This prevents open webhooks slipping through on first deploy
    return NextResponse.json(
      { ok: false, error: 'webhook secret not configured' },
      { status: 503 }
    )
  }

  // ── Payload validation ────────────────────────────────────────────────────
  const body = await request.json().catch(() => null)
  if (!body || typeof body.title !== 'string' || typeof body.message !== 'string') {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 })
  }

  const evt = {
    ts:      new Date().toISOString(),
    source:  String(body.source || 'webhook'),
    title:   body.title.trim().slice(0, 200),
    message: body.message.trim().slice(0, 2000),
    url:     typeof body.url === 'string' ? body.url : undefined,
  }

  addUpdate(evt)
  const results = await broadcastAll({
    title:   evt.title,
    message: evt.message,
    url:     evt.url,
    source:  evt.source,
  })

  return NextResponse.json({ ok: true, results })
}
