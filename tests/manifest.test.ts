// === METADATA ===
// Purpose: Guard the vault catalog — OS-tuned path composition + that every
//          catalogued issue's 3 OS PDFs and its teaser PDF physically exist.
// Tests:   npm test -- -t manifest
// === END METADATA ===
import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { VAULT, resolveFile, teaserFile, deliverableById, allDeliverables } from "@/lib/vault/manifest"
import { OS_IDS, TRACK_IDS, type TrackId } from "@/lib/subscribe/tracks"

describe("manifest · resolution", () => {
  it("composes content/vault/<track>/<stem>-<os>.pdf", () => {
    const d = VAULT.security[0]
    expect(resolveFile("security", d, "windows")).toBe("content/vault/security/security-vault-windows.pdf")
    expect(resolveFile("security", d, "macos")).toBe("content/vault/security/security-vault-macos.pdf")
    expect(teaserFile("security", d)).toBe("content/vault/security/security-vault-teaser.pdf")
  })

  it("finds a deliverable by id and returns its track", () => {
    expect(deliverableById("creative-vault")?.track).toBe("creative")
    expect(deliverableById("nope")).toBeNull()
  })

  it("has exactly one deliverable per track", () => {
    const all = allDeliverables()
    expect(all).toHaveLength(TRACK_IDS.length)
    expect(all.map((x) => x.track).sort()).toEqual([...TRACK_IDS].sort())
  })
})

describe("manifest · every catalogued PDF exists", () => {
  it("3 OS builds + teaser are on disk for every issue", () => {
    for (const { track, deliverable } of allDeliverables()) {
      for (const os of OS_IDS) {
        const full = resolveFile(track as TrackId, deliverable, os)
        expect(existsSync(resolve(process.cwd(), full)), `missing: ${full}`).toBe(true)
      }
      const teaser = teaserFile(track as TrackId, deliverable)
      expect(existsSync(resolve(process.cwd(), teaser)), `missing: ${teaser}`).toBe(true)
    }
  })
})
