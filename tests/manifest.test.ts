// === METADATA ===
// Purpose: Guard the vault manifest — path composition, {tool,os} fallback, and
//          that EVERY catalogued deliverable's default build physically exists
//          (so the funnel never advertises a missing file).
// Tests:   npm test -- -t manifest
// === END METADATA ===
import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { VAULT, resolveFile, deliverableById, allDeliverables } from "@/lib/vault/manifest"
import { TOOL_IDS, OS_IDS, type TrackId } from "@/lib/subscribe/tracks"

describe("manifest · resolution", () => {
  it("composes content/vault/<track>/<stem>__<tool>__<os>.pdf", () => {
    const d = VAULT.security[0]
    expect(resolveFile("security", d, "other", "windows")).toBe(
      "content/vault/security/recon-playbook__other__windows.pdf",
    )
  })

  it("falls back to the default variant when a {tool,os} build is missing", () => {
    const d = VAULT.security[0] // only {other,windows} generated
    expect(resolveFile("security", d, "claude", "linux")).toBe(
      "content/vault/security/recon-playbook__other__windows.pdf",
    )
  })

  it("finds a deliverable by id and returns its track", () => {
    const hit = deliverableById("recon-playbook")
    expect(hit?.track).toBe("security")
    expect(deliverableById("does-not-exist")).toBeNull()
  })
})

describe("manifest · every catalogued file exists", () => {
  it("resolves to a real file for every tool×os (via fallback)", () => {
    for (const { track, deliverable } of allDeliverables()) {
      for (const tool of TOOL_IDS) {
        for (const os of OS_IDS) {
          const rel = resolveFile(track as TrackId, deliverable, tool, os)
          expect(existsSync(resolve(process.cwd(), rel)), `missing: ${rel}`).toBe(true)
        }
      }
    }
  })
})
