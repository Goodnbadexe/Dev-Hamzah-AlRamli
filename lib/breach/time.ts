// === METADATA ===
// Purpose: Pure time utilities for Breach Mode (5:05–5:09 AM/PM local-time window)
// Author: @Goodnbad.exe
// Inputs: Date instances + optional IANA timezone (never geolocation)
// Outputs: local time parts, breach-window boolean, countdown seconds, UTC offset label
// Tests: tests/breach.test.ts
// Security: client-side cosmetic only; no permissions, no external calls
// Complexity: O(1)
// === END METADATA ===

export interface LocalTimeParts {
  hour: number
  minute: number
  second: number
  timeZone: string
}

/** Breach window: minutes 05–09 inclusive at hours 05 and 17 (visitor-local). */
const BREACH_HOURS = [5, 17] as const
const BREACH_MINUTE_START = 5
const BREACH_MINUTE_END = 9

/** Detected IANA timezone with a hard UTC fallback. Never prompts, never geolocates. */
export function getDetectedTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

/** Local wall-clock parts for `date` in `timeZone` (defaults to detected zone). */
export function getLocalTimeParts(date: Date, timeZone: string = getDetectedTimeZone()): LocalTimeParts {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date)
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
    return { hour: get("hour"), minute: get("minute"), second: get("second"), timeZone }
  } catch {
    // Invalid/unsupported zone → UTC fallback
    return {
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
      timeZone: "UTC",
    }
  }
}

/** True during 05:05–05:09 and 17:05–17:09 in the visitor's local timezone. */
export function isBreachWindow(date: Date, timeZone?: string): boolean {
  const { hour, minute } = getLocalTimeParts(date, timeZone)
  return (
    (BREACH_HOURS as readonly number[]).includes(hour) &&
    minute >= BREACH_MINUTE_START &&
    minute <= BREACH_MINUTE_END
  )
}

/** Seconds until recovery (xx:10:00 local). Returns 0 when not in the window. */
export function breachSecondsRemaining(date: Date, timeZone?: string): number {
  if (!isBreachWindow(date, timeZone)) return 0
  const { minute, second } = getLocalTimeParts(date, timeZone)
  return (BREACH_MINUTE_END + 1 - minute) * 60 - second
}

/** UTC offset label for a timezone at `date`, e.g. "UTC+03:00". */
export function getUtcOffsetLabel(date: Date, timeZone: string = getDetectedTimeZone()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    }).formatToParts(date)
    const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT"
    // "GMT+3" / "GMT+03:00" / "GMT" → normalized "UTC±HH:MM"
    const m = raw.match(/([+-])(\d{1,2})(?::(\d{2}))?/)
    if (!m) return "UTC+00:00"
    const [, sign, h, mm] = m
    return `UTC${sign}${h.padStart(2, "0")}:${mm ?? "00"}`
  } catch {
    return "UTC+00:00"
  }
}
