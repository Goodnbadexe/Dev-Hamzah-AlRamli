// === METADATA ===
// Purpose: Render every Toolkit Vault issue (content/vault/issues/*.json) into:
//          - 3 OS-TUNED full PDFs (Windows / Linux / macOS) — the paid products
//          - 1 blurred TEASER PDF (OS-agnostic free lead magnet)
// Out:     content/vault/<track>/<track>-vault-<os>.pdf  +  <track>-vault-teaser.pdf
// Run:     npm run build:vault
// === END METADATA ===
import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { chromium } from "playwright"
import { issueHtml } from "./vault-template.mjs"

const ROOT = resolve(process.cwd(), "content", "vault")
const ISSUES = join(ROOT, "issues")
const OSES = ["windows", "linux", "macos"]

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

    // OS-tuned full builds (the paid products)
    for (const os of OSES) {
      await page.setContent(issueHtml(issue, { os }), { waitUntil: "networkidle" })
      await page.pdf({ path: join(dir, `${issue.track}-vault-${os}.pdf`), format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } })
      n++
    }
    // OS-agnostic free teaser
    await page.setContent(issueHtml(issue, { teaser: true }), { waitUntil: "networkidle" })
    await page.pdf({ path: join(dir, `${issue.track}-vault-teaser.pdf`), format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } })
    n++

    console.log(`  ✓ ${issue.track} → 3 OS builds + teaser`)
  }
} finally {
  await browser.close()
}
console.log(`Done — ${n} PDFs (${files.length} issues × 3 OS + ${files.length} teasers).`)
