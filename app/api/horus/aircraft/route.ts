/**
 * GET /api/horus/aircraft
 *
 * Fetches live aircraft states from OpenSky Network (free, no API key).
 * Anonymous rate limit: ~10 req / 10 s — we cache aggressively to stay safe.
 *
 * Returns up to 3 000 airborne aircraft sorted by most recently updated.
 * Revalidates every 30 seconds.
 *
 * OpenSky state vector fields (by index):
 *  0  icao24          — transponder address
 *  1  callsign        — airline + flight number
 *  2  origin_country  — from transponder DB
 *  3  time_position   — last position update (UNIX)
 *  4  last_contact    — last any-data update (UNIX)
 *  5  longitude       — WGS-84 decimal
 *  6  latitude        — WGS-84 decimal
 *  7  baro_altitude   — metres (may be null)
 *  8  on_ground       — bool
 *  9  velocity        — m/s
 * 10  true_track      — degrees clockwise from north
 * 11  vertical_rate   — m/s
 * 12  sensors         — receiver IDs (may be null)
 * 13  geo_altitude    — metres (may be null)
 * 14  squawk          — Mode-C squawk
 * 15  spi             — special purpose indicator
 * 16  position_source — 0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM
 */

import { NextResponse } from "next/server"
import type { AircraftState, AircraftResponse } from "@/components/horus/types"

export const runtime = "nodejs"

const OPENSKY_URL = "https://opensky-network.org/api/states/all"
const MAX_AIRCRAFT = 3000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(s: any[]): AircraftState | null {
  const lng = Number(s[5])
  const lat = Number(s[6])
  // Drop entries with no position or clearly invalid coords
  if (!isFinite(lng) || !isFinite(lat)) return null
  if (lng === 0 && lat === 0)           return null
  if (Boolean(s[8]))                    return null // on ground

  return {
    icao24:       String(s[0]  ?? ""),
    callsign:     String(s[1]  ?? "").trim(),
    country:      String(s[2]  ?? "Unknown"),
    longitude:    lng,
    latitude:     lat,
    altitude:     Number(s[7]  ?? s[13] ?? 0),
    onGround:     false,
    velocity:     Number(s[9]  ?? 0),
    heading:      Number(s[10] ?? 0),
    verticalRate: Number(s[11] ?? 0),
    squawk:       s[14] ? String(s[14]) : undefined,
  }
}

export async function GET() {
  try {
    const res = await fetch(OPENSKY_URL, {
      next:    { revalidate: 30 },
      headers: { "Accept": "application/json" },
    })

    if (!res.ok) {
      // OpenSky can 429 during peak load — return empty rather than error
      console.warn(`[api/horus/aircraft] OpenSky returned ${res.status}`)
      const body: AircraftResponse = {
        aircraft:  [],
        fetchedAt: new Date().toISOString(),
        total:     0,
        error:     `OpenSky ${res.status}`,
      }
      return NextResponse.json(body, {
        headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=15" },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { time: number; states: any[][] | null } = await res.json()
    const raw = data.states ?? []

    const aircraft: AircraftState[] = raw
      // Sort by last_contact DESC so we keep the freshest data when capping
      .sort((a, b) => (Number(b[4]) || 0) - (Number(a[4]) || 0))
      .slice(0, MAX_AIRCRAFT * 3) // over-fetch then filter
      .map(normalise)
      .filter((a): a is AircraftState => a !== null)
      .slice(0, MAX_AIRCRAFT)

    const body: AircraftResponse = {
      aircraft,
      fetchedAt: new Date().toISOString(),
      total:     raw.length,
    }

    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=10" },
    })
  } catch (err) {
    console.error("[api/horus/aircraft]", err)
    const body: AircraftResponse = {
      aircraft:  [],
      fetchedAt: new Date().toISOString(),
      total:     0,
      error:     String(err),
    }
    return NextResponse.json(body, { status: 500 })
  }
}
