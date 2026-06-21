// === METADATA ===
// Purpose: Issue a short-lived signed download URL for a paid deliverable, after
//          verifying the requester is entitled. POST { deliverableId, email }.
// Security: entitlement is checked here AND re-checked on the actual download.
//           Returns 403 (not 404) when not entitled to avoid leaking catalog info.
// === END METADATA ===
import { NextResponse } from "next/server"
import { z } from "zod"
import { hasEntitlement } from "@/lib/vault/entitlement"
import { signClaim, TOKEN_TTL_SECONDS } from "@/lib/vault/sign"
import { deliverableById } from "@/lib/vault/manifest"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const Body = z.object({
  deliverableId: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
})

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid request" }, { status: 422 })

  const { deliverableId, email } = parsed.data
  if (!deliverableById(deliverableId)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 })
  }
  if (!(await hasEntitlement(email, deliverableId))) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 })
  }

  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  const token = signClaim({ id: deliverableId, email, exp })
  const url = `/api/vault/${encodeURIComponent(deliverableId)}?t=${encodeURIComponent(token)}`
  return NextResponse.json({ ok: true, url, expiresAt: exp * 1000 })
}
