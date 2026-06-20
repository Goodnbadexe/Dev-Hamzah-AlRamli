// === METADATA ===
// Purpose: Guard the vault catalog — path composition + that every catalogued
//          issue's full PDF and teaser PDF physically exist on disk.
// Tests:   npm test -- -t manifest
// === END METADATA ===
import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { VAULT, resolveFile, teaserFile, deliverableById, allDeliverables } from "@/lib/vault/manifest"
import type { TrackId } from "@/lib/subscribe/tracks"

describe("manifest · resolution", () => {
  it("composes content/vault/<track>/<stem>.pdf", () => {
    const d = VAULT.security[0]
    expect(resolveFile("security", d)).toBe("content/vault/security/security-vault.pdf")
    expect(teaserFile("security", d)).toBe("content/vault/security/security-vault-teaser.pdf")
  })

  it("finds a deliverable by id and returns its track", () => {
    expect(deliverableById("agents-vault")?.track).toBe("agents")
    expect(deliverableById("nope")).toBeNull()
  })

  it("has one issue per track, weeks 1–5", () => {
    expect(allDeliverables().map((x) => x.deliverable.week).sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe("manifest · every catalogued PDF exists", () => {
  it("full + teaser PDFs are on disk for every track", () => {
    for (const { track, deliverable } of allDeliverables()) {
      const full = resolveFile(track as TrackId, deliverable)
      const teaser = teaserFile(track as TrackId, deliverable)
      expect(existsSync(resolve(process.cwd(), full)), `missing: ${full}`).toBe(true)
      expect(existsSync(resolve(process.cwd(), teaser)), `missing: ${teaser}`).toBe(true)
    }
  })
})
