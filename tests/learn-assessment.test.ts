// === METADATA ===
// Purpose: Unit tests for the Learning Lab assessment-preview engine
//          (lib/learn/assessment-preview.ts) — level bands, consistency flag,
//          duration bands, and target-date fit per docs/learning-lab/ASSESSMENT.md.
// Author: @Goodnbad.exe
// === END METADATA ===
import { describe, expect, it } from "vitest"
import { buildAssessmentPreview, estimateLevel } from "@/lib/learn/assessment-preview"

describe("estimateLevel (ASSESSMENT.md §2 bands)", () => {
  it("maps score 0-1 to beginner", () => {
    expect(estimateLevel([0, 0, 0], "advanced")).toBe("beginner")
    expect(estimateLevel([1, 0, 0], "advanced")).toBe("beginner")
  })

  it("maps score 2-4 to intermediate", () => {
    expect(estimateLevel([1, 1, 0], "beginner")).toBe("intermediate")
    expect(estimateLevel([2, 1, 1], "beginner")).toBe("intermediate")
  })

  it("maps score 5-6 to advanced", () => {
    expect(estimateLevel([2, 2, 1], "beginner")).toBe("advanced")
    expect(estimateLevel([2, 2, 2], "beginner")).toBe("advanced")
  })

  it("falls back to the self-stated level when a track has no self-checks", () => {
    expect(estimateLevel([], "intermediate")).toBe("intermediate")
  })
})

describe("buildAssessmentPreview", () => {
  const base = {
    track: "programming" as const,
    statedLevel: "beginner" as const,
    weeklyHours: 6,
    topic: "web scraper",
    desiredOutcome: "automate collecting job listings",
  }

  it("flags a 2-band stated-vs-estimated mismatch for manual review", () => {
    const r = buildAssessmentPreview({ ...base, answers: [2, 2, 2], statedLevel: "beginner" })
    expect(r.estimatedLevel).toBe("advanced")
    expect(r.inconsistent).toBe(true)
  })

  it("does not flag a 1-band difference", () => {
    const r = buildAssessmentPreview({ ...base, answers: [1, 1, 1] })
    expect(r.estimatedLevel).toBe("intermediate")
    expect(r.inconsistent).toBe(false)
  })

  it("returns bilingual gaps for the estimated level", () => {
    const r = buildAssessmentPreview({ ...base, answers: [1, 1, 1] })
    expect(r.gaps.length).toBeGreaterThan(0)
    for (const g of r.gaps) {
      expect(g.en.length).toBeGreaterThan(0)
      expect(g.ar.length).toBeGreaterThan(0)
    }
  })

  it("computes a longer duration band for fewer weekly hours", () => {
    const slow = buildAssessmentPreview({ ...base, answers: [0, 0, 0], weeklyHours: 2 })
    const fast = buildAssessmentPreview({ ...base, answers: [0, 0, 0], weeklyHours: 20 })
    expect(slow.durationBand.en).not.toBe(fast.durationBand.en)
    expect(fast.durationBand.en).toBe("2–3 weeks")
  })

  it("marks a far-future target date as fitting and an imminent one as tight", () => {
    const far = new Date(Date.now() + 200 * 86_400_000).toISOString().slice(0, 10)
    const soon = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10)
    expect(buildAssessmentPreview({ ...base, answers: [0, 0, 0], targetDate: far }).targetFits).toBe(true)
    expect(
      buildAssessmentPreview({ ...base, answers: [0, 0, 0], weeklyHours: 1, targetDate: soon }).targetFits
    ).toBe(false)
  })

  it("clamps weekly hours into the 1-40 range instead of dividing by zero", () => {
    const r = buildAssessmentPreview({ ...base, answers: [0, 0, 0], weeklyHours: 0 })
    expect(r.durationBand.en.length).toBeGreaterThan(0)
  })
})
