import { NextResponse } from "next/server"
import { checkAssistantGate } from "@/lib/assistant-gate"

/**
 * inference.sh proxy — TEMPORARILY STUBBED (build unblock).
 *
 * The original re-exported handlers from '@inferencesh/sdk/proxy/nextjs', but
 * that package is NOT in package.json, so the project fails to build on a clean
 * checkout (Vercel included). To restore the real proxy:
 *
 *   1. npm install @inferencesh/sdk
 *   2. set INFERENCE_API_KEY in env
 *   3. replace this file with:
 *        export { GET, POST, PUT } from '@inferencesh/sdk/proxy/nextjs'
 *
 * Until then these return 501 so the build stays green.
 *
 * NOTE: the POST handler runs the assistant logic gate FIRST
 * (belt-and-suspenders) so common identity questions get an instant pre-built
 * answer even on a direct API hit — no proxy, no tokens.
 */
function notImplemented() {
  return NextResponse.json(
    { error: "inference proxy not configured", hint: "add @inferencesh/sdk and restore the proxy export" },
    { status: 501 },
  )
}

export async function POST(req: Request) {
  // Fast logic gate before any (future) inference call.
  try {
    const body = (await req.clone().json()) as { message?: unknown }
    const message = typeof body?.message === "string" ? body.message : ""
    const gated = checkAssistantGate(message)
    if (gated) {
      return NextResponse.json({ content: gated, gated: true })
    }
  } catch {
    // Non-JSON or empty body — fall through to the stub response below.
  }

  return notImplemented()
}

export const GET = notImplemented
export const PUT = notImplemented
