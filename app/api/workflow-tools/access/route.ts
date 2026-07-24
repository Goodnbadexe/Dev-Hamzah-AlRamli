// === METADATA ===
// Purpose: Check whether an email owns the Workflow Tools pack. POST { email }.
// Security: read-only; reuses the service-role-gated `sales` entitlement
//           (hasWorkflowToolsAccess) and returns ONLY a boolean — never leaks
//           sale data, prices, or catalog info. Fails closed via the lib helper.
// === END METADATA ===
import { NextResponse } from "next/server"
import { z } from "zod"
import { hasWorkflowToolsAccess } from "@/lib/vault/entitlement"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const Body = z.object({ email: z.string().trim().email().max(160) })

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 422 })
  }

  const access = await hasWorkflowToolsAccess(parsed.data.email)
  return NextResponse.json({ ok: true, access })
}
