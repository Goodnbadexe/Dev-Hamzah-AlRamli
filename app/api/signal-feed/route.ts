/**
 * GET /api/signal-feed
 *
 * Server-only aggregation of all approved cyber-threat sources.
 * Used by the SignalFeedSection refresh button and MobileSignalOverlay.
 *
 * Cache: 5 minutes (stale-while-revalidate allows serving cached content while
 * revalidating in the background — no request latency for users).
 */

import { NextResponse } from "next/server"
import { aggregateSignalFeed } from "@/lib/signal-feed/aggregate"

export const runtime = "nodejs"

export async function GET() {
  try {
    const data = await aggregateSignalFeed()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    })
  } catch (err) {
    console.error("[api/signal-feed] fatal:", err)
    return NextResponse.json(
      { items: [], fetchedAt: new Date().toISOString(), sourceErrors: ["Aggregation failed"] },
      { status: 500 }
    )
  }
}
