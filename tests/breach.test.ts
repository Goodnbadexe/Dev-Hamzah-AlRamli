// === METADATA ===
// Purpose: Unit tests for Breach Mode time logic (lib/breach/time)
// Author: @Goodnbad.exe
// Inputs: fixed UTC dates + explicit IANA timezones (no system-clock dependence)
// Outputs: pass/fail assertions for window boundaries and offset labels
// Tests: npm test
// Complexity: O(1)
// === END METADATA ===
import { describe, expect, it } from "vitest"
import {
  breachSecondsRemaining,
  getDetectedTimeZone,
  getLocalTimeParts,
  getUtcOffsetLabel,
  isBreachWindow,
} from "@/lib/breach/time"

/** Build a Date whose UTC wall clock matches the given h:m:s. */
const utc = (h: number, m: number, s = 0) => new Date(Date.UTC(2026, 6, 22, h, m, s))

describe("isBreachWindow (UTC boundaries)", () => {
  it("is OFF at 05:04", () => {
    expect(isBreachWindow(utc(5, 4, 59), "UTC")).toBe(false)
  })
  it("is ON at 05:05", () => {
    expect(isBreachWindow(utc(5, 5, 0), "UTC")).toBe(true)
  })
  it("is ON at 05:09", () => {
    expect(isBreachWindow(utc(5, 9, 59), "UTC")).toBe(true)
  })
  it("is OFF at 05:10", () => {
    expect(isBreachWindow(utc(5, 10, 0), "UTC")).toBe(false)
  })
  it("is ON at 17:05", () => {
    expect(isBreachWindow(utc(17, 5, 0), "UTC")).toBe(true)
  })
  it("is OFF at noon", () => {
    expect(isBreachWindow(utc(12, 5, 0), "UTC")).toBe(false)
  })
})

describe("non-UTC timezone (Asia/Riyadh, UTC+3)", () => {
  it("02:05 UTC is 05:05 in Riyadh → ON", () => {
    expect(isBreachWindow(utc(2, 5, 0), "Asia/Riyadh")).toBe(true)
  })
  it("05:05 UTC is 08:05 in Riyadh → OFF", () => {
    expect(isBreachWindow(utc(5, 5, 0), "Asia/Riyadh")).toBe(false)
  })
  it("14:07 UTC is 17:07 in Riyadh → ON", () => {
    expect(isBreachWindow(utc(14, 7, 0), "Asia/Riyadh")).toBe(true)
  })
  it("resolves local time parts correctly", () => {
    const parts = getLocalTimeParts(utc(2, 5, 30), "Asia/Riyadh")
    expect(parts).toMatchObject({ hour: 5, minute: 5, second: 30 })
  })
})

describe("fallbacks and helpers", () => {
  it("falls back to UTC for an invalid timezone", () => {
    const parts = getLocalTimeParts(utc(5, 6), "Not/AZone")
    expect(parts.timeZone).toBe("UTC")
    expect(parts.hour).toBe(5)
  })
  it("getDetectedTimeZone returns a non-empty string", () => {
    expect(getDetectedTimeZone().length).toBeGreaterThan(0)
  })
  it("countdown: 05:07:30 → 150 seconds to 05:10", () => {
    expect(breachSecondsRemaining(utc(5, 7, 30), "UTC")).toBe(150)
  })
  it("countdown is 0 outside the window", () => {
    expect(breachSecondsRemaining(utc(5, 10, 0), "UTC")).toBe(0)
  })
  it("UTC offset label for Riyadh is UTC+03:00", () => {
    expect(getUtcOffsetLabel(utc(12, 0), "Asia/Riyadh")).toBe("UTC+03:00")
  })
  it("UTC offset label for UTC is UTC+00:00", () => {
    expect(getUtcOffsetLabel(utc(12, 0), "UTC")).toBe("UTC+00:00")
  })
})
