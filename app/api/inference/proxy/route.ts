import { NextResponse } from "next/server"

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
 */
function notImplemented() {
  return NextResponse.json(
    { error: "inference proxy not configured", hint: "add @inferencesh/sdk and restore the proxy export" },
    { status: 501 },
  )
}

export const GET = notImplemented
export const POST = notImplemented
export const PUT = notImplemented
