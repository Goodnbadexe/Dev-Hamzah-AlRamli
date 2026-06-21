// === METADATA ===
// Purpose: Pin the tiered-bundle pricing — every tier×duration cell, the
//          track-count → tier boundaries, honest discount math, and that the
//          legacy `single` tier still equals the locked 9/29/69.
// Tests:   npm test -- -t pricing
// === END METADATA ===
import { describe, it, expect } from "vitest"
import { priceFor, tierForTracks, BUNDLE_MATRIX, PLANS, gumroadPrice, PRICING } from "@/lib/subscribe/config"
import type { TrackId } from "@/lib/subscribe/tracks"

const S = ["security"] as TrackId[]
const SD = ["security", "developers"] as TrackId[]
const SDA = ["security", "developers", "agents"] as TrackId[]
const ALL = ["security", "developers", "agents", "automation"] as TrackId[]

describe("pricing · tier boundaries", () => {
  it("1 track → single, 2 → duo, 3–4 → all", () => {
    expect(tierForTracks(S)).toBe("single")
    expect(tierForTracks(SD)).toBe("duo")
    expect(tierForTracks(SDA)).toBe("all")
    expect(tierForTracks(ALL)).toBe("all")
  })
})

describe("pricing · cells", () => {
  it("single tier equals the locked 9 / 29 / 69 SAR", () => {
    expect(priceFor(S, "trial").price).toBe(9)
    expect(priceFor(S, "month").price).toBe(29)
    expect(priceFor(S, "quarter").price).toBe(69)
  })

  it("duo + all tiers price up with track count", () => {
    expect(priceFor(SD, "month").price).toBe(49)
    expect(priceFor(ALL, "month").price).toBe(79)
    expect(priceFor(ALL, "quarter").price).toBe(179)
  })

  it("legacy PLANS derive from BUNDLE_MATRIX.single (no drift)", () => {
    const byId = Object.fromEntries(PLANS.map((p) => [p.id, p]))
    expect(byId.trial.price).toBe(BUNDLE_MATRIX.single.trial.price)
    expect(byId.month.price).toBe(BUNDLE_MATRIX.single.month.price)
    expect(byId.quarter.price).toBe(BUNDLE_MATRIX.single.quarter.price)
  })
})

describe("pricing · honest derived math", () => {
  it("savedPct matches real original→price discount", () => {
    // month/all: 79 from 199 → 60% off
    expect(priceFor(ALL, "month").savedPct).toBe(60)
  })

  it("perDay + usd are derived from the real price", () => {
    const q = priceFor(S, "month") // 29 SAR over 28 days
    expect(q.perDay).toBe("1.04 SAR/day")
    expect(q.weeks).toBe(4)
    expect(q.usd.startsWith("≈ $")).toBe(true)
  })

  it("every cell has a real strike-through (original > price)", () => {
    for (const tier of ["single", "duo", "all"] as const) {
      for (const dur of ["trial", "month", "quarter"] as const) {
        const cell = BUNDLE_MATRIX[tier][dur]
        expect(cell.original).toBeGreaterThan(cell.price)
      }
    }
  })
})

describe("pricing · gumroad base + per-tool", () => {
  it("one issue = $2 base + $1.20 × 5 tools = $8", () => {
    expect(gumroadPrice(["security"] as TrackId[]).price).toBe(8)
    expect(gumroadPrice(["security"] as TrackId[]).original).toBe(8)
  })

  it("two vaults add per-tool, with an honest strike-through", () => {
    const q = gumroadPrice(["security", "developers"] as TrackId[])
    expect(q.price).toBe(14) // 2 + 1.2*10
    expect(q.original).toBe(16) // 2 × $8
  })

  it("3+ vaults = flat all-access price, undercutting buying separately", () => {
    const q = gumroadPrice(SDA)
    expect(q.price).toBe(PRICING.allAccess) // 25
    expect(q.original).toBeGreaterThan(q.price)
  })

  it("exposes a breakdown string for the paywall", () => {
    expect(gumroadPrice(["security"] as TrackId[]).breakdown).toContain("base")
  })
})
