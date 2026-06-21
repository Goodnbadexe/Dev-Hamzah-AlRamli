// === METADATA ===
// Purpose: Serve a paid vault PDF — ONLY with a valid signed token AND a live
//          entitlement, watermarked per buyer. This is the real content lock;
//          nothing under content/vault/ is statically served from public/.
// Security: HMAC token (verifyToken) proves the URL is ours + unexpired; the
//           Supabase entitlement re-check is authoritative; the file path is
//           resolved ONLY through the manifest allowlist (no traversal). nodejs
//           runtime (pdf-lib + fs + crypto).
// === END METADATA ===
import { NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"
import { verifyToken } from "@/lib/vault/sign"
import { getEntitlement } from "@/lib/vault/entitlement"
import { deliverableById, resolveFile } from "@/lib/vault/manifest"
import { stampCached } from "@/lib/vault/watermark"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params
  const token = new URL(req.url).searchParams.get("t")

  // 1) token must be valid, unexpired, and bound to THIS deliverable id
  const claim = token ? verifyToken(token) : null
  if (!claim || claim.id !== file) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  // 2) deliverable must exist in the manifest (allowlist — never trust raw `file`)
  const hit = deliverableById(file)
  if (!hit) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 })

  // 3) authoritative entitlement re-check (a leaked URL dies when entitlement lapses)
  const ent = await getEntitlement(claim.email)
  if (!ent || !ent.tracks.includes(hit.track)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 })
  }

  // 4) resolve the tuned file for the buyer's stack, strictly inside content/vault
  const rel = resolveFile(hit.track, hit.deliverable, ent.os)
  const root = path.resolve(process.cwd(), "content", "vault")
  const abs = path.resolve(process.cwd(), rel)
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    return NextResponse.json({ ok: false, error: "bad path" }, { status: 400 })
  }

  let bytes: Buffer
  try {
    bytes = await fs.readFile(abs)
  } catch {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 })
  }

  const stamped = await stampCached(`${rel}::${claim.email}`, new Uint8Array(bytes), {
    email: claim.email,
    orderId: file,
  })

  return new Response(new Uint8Array(stamped), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${file}.pdf"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  })
}
