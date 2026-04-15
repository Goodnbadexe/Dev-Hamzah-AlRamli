/**
 * HORUS-EYE — shared types
 *
 * Phase 1: Aircraft (OpenSky Network — no key)
 *          Satellite imagery (NASA GIBS — no key)
 *
 * Phase 2 (keys pending): Maritime (AISHub), Weather (OpenWeatherMap)
 */

// ---------------------------------------------------------------------------
// Aircraft
// ---------------------------------------------------------------------------
export interface AircraftState {
  /** ICAO 24-bit transponder address */
  icao24:       string
  /** Callsign trimmed, may be empty */
  callsign:     string
  /** Origin country from the transponder database */
  country:      string
  longitude:    number
  latitude:     number
  /** Barometric altitude in metres. 0 if unknown. */
  altitude:     number
  onGround:     boolean
  /** Speed over ground in m/s */
  velocity:     number
  /** True track (heading) in degrees from north, clockwise */
  heading:      number
  /** Vertical rate in m/s — positive = climbing */
  verticalRate: number
  /** Squawk code (transponder identity) */
  squawk?:      string
}

// ---------------------------------------------------------------------------
// Globe display
// ---------------------------------------------------------------------------
export type GlobeMode =
  | "bluemarble"  // NASA Blue Marble (always available)
  | "satellite"   // NASA GIBS near-real-time (no key, 1-2 day lag)
  | "night"       // Earth at night lights

export interface HorusLayerState {
  aircraft:   boolean
  prediction: boolean
  labels:     boolean
  satellite:  boolean   // toggles globe texture
}

// ---------------------------------------------------------------------------
// API response
// ---------------------------------------------------------------------------
export interface AircraftResponse {
  aircraft:   AircraftState[]
  fetchedAt:  string
  total:      number   // total states before capping
  error?:     string
}
