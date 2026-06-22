// === METADATA ===
// Purpose: Pin the personalization engine — deterministic readFactor, variant
//          resolution, track ordering, and bundle recommendation.
// Tests:   npm test -- -t personalize
// === END METADATA ===
import { describe, it, expect } from "vitest"
import {
  personalize,
  computeReadFactor,
  tierForCount,
  readLabelFor,
  type Answers,
} from "@/lib/subscribe/personalize"

describe("personalize · variant selection", () => {
  it("reads primary tool + os from single answers", () => {
    const a: Answers = { ai_tool: ["claude"], os: ["linux"], tracks: ["security"] }
    const p = personalize(a)
    expect(p.toolVariant).toBe("claude")
    expect(p.osVariant).toBe("linux")
  })

  it("falls back to defaults for missing/invalid tool + os", () => {
    expect(personalize({ tracks: ["security"] }).toolVariant).toBe("other")
    expect(personalize({ tracks: ["security"] }).osVariant).toBe("windows")
    expect(personalize({ ai_tool: ["bogus"], os: ["bsd"], tracks: ["security"] }).toolVariant).toBe("other")
  })
})

describe("personalize · tracks + bundle", () => {
  it("orders selected tracks by week and dedupes", () => {
    const p = personalize({ tracks: ["automation", "security", "security", "agents"] })
    expect(p.selectedTracks).toEqual(["security", "agents", "automation"])
  })

  it("ignores unknown track ids", () => {
    const p = personalize({ tracks: ["security", "nope"] })
    expect(p.selectedTracks).toEqual(["security"])
  })

  it("maps track count to bundle tier", () => {
    expect(tierForCount(0)).toBe("single")
    expect(tierForCount(1)).toBe("single")
    expect(tierForCount(2)).toBe("duo")
    expect(tierForCount(3)).toBe("all")
    expect(tierForCount(4)).toBe("all")
    expect(personalize({ tracks: ["security", "developers"] }).recommendedBundle).toBe("duo")
  })
})

describe("personalize · readFactor (deterministic)", () => {
  it("returns the base 40 for an empty answer set", () => {
    expect(computeReadFactor({}, [])).toBe(40)
  })

  it("awards full marks for a maximally-aligned, high-intent profile", () => {
    const a: Answers = {
      tracks: ["security", "developers", "automation", "creative"], // engage 4×4 → capped 16
      niche: ["security", "dev", "automation", "content"], // 4 matches → capped 20
      role: ["student", "dev", "founder", "creator"], // density…
      goals: ["income", "ship", "master", "automate"], // role+goals+niche = 12 ticks → capped 24
    }
    // 40 + 20 + 24 + 16 = 100
    expect(computeReadFactor(a, personalize(a).selectedTracks)).toBe(100)
  })

  it("is stable across repeated calls (no randomness)", () => {
    const a: Answers = { tracks: ["security"], niche: ["security"], role: ["dev"], goals: ["ship"] }
    const tracks = personalize(a).selectedTracks
    expect(computeReadFactor(a, tracks)).toBe(computeReadFactor(a, tracks))
  })

  it("bands into starter / tuned / elite", () => {
    expect(readLabelFor(40)).toBe("starter")
    expect(readLabelFor(60)).toBe("tuned")
    expect(readLabelFor(80)).toBe("elite")
  })
})
