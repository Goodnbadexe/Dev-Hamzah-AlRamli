// === METADATA ===
// Purpose: Render every Toolkit Vault issue (content/vault/issues/*.json) into a
//          designed magazine PDF — both a FULL version (payers) and a blurred
//          TEASER version (free lead magnet) — using the shared template.
// Out:     content/vault/<track>/<track>-vault.pdf  +  <track>-vault-teaser.pdf
// Run:     npm run build:vault
// === END METADATA ===
import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { chromium } from "playwright"
import { issueHtml } from "./vault-template.mjs"

const ROOT = resolve(process.cwd(), "content", "vault")
const ISSUES = join(ROOT, "issues")

const files = readdirSync(ISSUES).filter((f) => f.endsWith(".json")).sort()
if (!files.length) {
  console.error("No issue JSON found in content/vault/issues/")
  process.exit(1)
}

const browser = await chromium.launch()
let n = 0
try {
  const page = await browser.newPage()
  for (const f of files) {
    const issue = JSON.parse(readFileSync(join(ISSUES, f), "utf8"))
    const dir = join(ROOT, issue.track)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

    for (const teaser of [false, true]) {
      await page.setContent(issueHtml(issue, { teaser }), { waitUntil: "networkidle" })
      const out = join(dir, `${issue.track}-vault${teaser ? "-teaser" : ""}.pdf`)
      await page.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } })
      n++
    }
    console.log(`  ✓ week ${issue.week} · ${issue.track} → ${issue.track}-vault.pdf (+ teaser)`)
  }
} finally {
  await browser.close()
}
console.log(`Done — ${n} PDFs (${files.length} full + ${files.length} teaser).`)
