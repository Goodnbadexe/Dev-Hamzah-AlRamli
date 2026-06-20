// === METADATA ===
// Purpose: Generate the gated vault PDFs — one tuned build per deliverable ×
//          AI-tool × OS. Composes the track's original playbook (markdown) with
//          the matching tool + OS overlay from _variants.json, renders branded
//          HTML to PDF via Playwright/Chromium, and writes to
//          content/vault/<track>/<fileStem>__<tool>__<os>.pdf (NOT public/).
// Run:     node scripts/build-vault-pdfs.mjs   (regenerate whenever content changes)
// Note:    output PDFs are the paid product — served only through the gated,
//          signed, watermarked route (app/api/vault/[file]).
// === END METADATA ===
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { marked } from "marked"
import { chromium } from "playwright"

const ROOT = resolve(process.cwd(), "content", "vault")
const TOOLS = ["claude", "codex", "gemini", "chatgpt", "other"]
const OS = ["windows", "linux", "macos"]

const variants = JSON.parse(readFileSync(join(ROOT, "_variants.json"), "utf8"))

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function page(deliverable, track, tool, os, bodyHtml) {
  const t = variants.tools[tool]
  const o = variants.os[os]
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<style>
  :root{ --ink:#0d1117; --muted:#57606a; --accent:#0c7a52; --line:#e6e8eb; --chip:#eafff5; }
  *{ box-sizing:border-box; }
  body{ font-family:'Segoe UI',system-ui,-apple-system,sans-serif; color:var(--ink); margin:0; line-height:1.55; font-size:11.5px; }
  .wrap{ padding:44px 52px; }
  .brand{ display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--accent); padding-bottom:10px; margin-bottom:18px; }
  .brand .name{ font-weight:700; letter-spacing:.14em; text-transform:uppercase; font-size:10px; color:var(--accent); }
  .brand .meta{ font-size:9px; color:var(--muted); text-align:right; }
  .week{ display:inline-block; background:var(--chip); color:var(--accent); border:1px solid #bdebd6; border-radius:4px; padding:2px 8px; font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:.1em; }
  h1{ font-size:21px; line-height:1.2; margin:12px 0 4px; }
  .ar{ direction:rtl; text-align:right; font-family:'Noto Kufi Arabic','Segoe UI',sans-serif; }
  .lead-ar{ color:#1f2933; background:#f6f8fa; border-right:3px solid var(--accent); padding:9px 12px; border-radius:6px; margin:10px 0 16px; font-size:11px; }
  .tuned{ display:flex; gap:10px; flex-wrap:wrap; margin:0 0 18px; }
  .tuned .pill{ flex:1 1 240px; border:1px solid var(--line); border-radius:8px; padding:10px 12px; }
  .tuned .pill .k{ font-size:8.5px; text-transform:uppercase; letter-spacing:.12em; color:var(--accent); font-weight:700; margin-bottom:3px; }
  .tuned .pill .v{ font-weight:600; margin-bottom:3px; }
  .tuned .pill .n{ font-size:10px; color:var(--muted); }
  .tuned .pill .n.ar{ margin-top:2px; }
  h2{ font-size:14px; margin:20px 0 6px; padding-bottom:3px; border-bottom:1px solid var(--line); }
  h3{ font-size:12px; margin:14px 0 4px; }
  p{ margin:6px 0; }
  ul,ol{ margin:6px 0; padding-left:20px; }
  li{ margin:3px 0; }
  blockquote{ margin:10px 0; padding:8px 12px; background:#fff8e6; border-left:3px solid #e0a800; border-radius:4px; font-size:10.5px; color:#5c4a00; }
  code{ background:#f3f4f6; padding:1px 4px; border-radius:3px; font-family:'JetBrains Mono',Consolas,monospace; font-size:10px; }
  pre{ background:#0d1117; color:#e6edf3; padding:12px 14px; border-radius:8px; overflow:hidden; font-size:9.5px; line-height:1.5; white-space:pre-wrap; word-break:break-word; }
  pre code{ background:none; color:inherit; padding:0; }
  .foot{ margin-top:24px; border-top:1px solid var(--line); padding-top:8px; font-size:8.5px; color:var(--muted); display:flex; justify-content:space-between; }
</style></head><body><div class="wrap">
  <div class="brand">
    <span class="name">goodnbad · the toolkit vault</span>
    <span class="meta">Week ${deliverable.week} · ${esc(track)}<br/>tuned for ${esc(t.label)} · ${esc(o.label)}</span>
  </div>
  <span class="week">Week ${deliverable.week} — ${esc(track)}</span>
  <h1>${esc(deliverable.outcomeEn)}</h1>
  <div class="lead-ar ar">${esc(deliverable.outcomeAr)}</div>
  <div class="tuned">
    <div class="pill"><div class="k">Your AI tool</div><div class="v">${esc(t.label)}</div><div class="n">${esc(t.noteEn)}</div><div class="n ar">${esc(t.noteAr)}</div></div>
    <div class="pill"><div class="k">Your system · ${esc(o.shell)}</div><div class="v">${esc(o.label)}</div><div class="n">${esc(o.noteEn)}</div><div class="n ar">${esc(o.noteAr)}</div></div>
  </div>
  ${bodyHtml}
  <div class="foot"><span>goodnbad.info · the toolkit vault</span><span>${esc(t.tip)}</span></div>
</div></body></html>`
}

async function main() {
  const tracks = readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)

  const browser = await chromium.launch()
  let count = 0
  try {
    const pg = await browser.newPage()
    for (const track of tracks) {
      const trackJson = join(ROOT, track, "track.json")
      if (!existsSync(trackJson)) continue
      const { deliverables } = JSON.parse(readFileSync(trackJson, "utf8"))
      for (const d of deliverables) {
        const md = readFileSync(join(ROOT, track, d.mdFile), "utf8")
        const bodyHtml = marked.parse(md)
        for (const tool of TOOLS) {
          for (const os of OS) {
            const html = page(d, track, tool, os, bodyHtml)
            await pg.setContent(html, { waitUntil: "networkidle" })
            const out = join(ROOT, track, `${d.fileStem}__${tool}__${os}.pdf`)
            await pg.pdf({ path: out, format: "A4", printBackground: true, margin: { top: "0", bottom: "0", left: "0", right: "0" } })
            count++
          }
        }
        console.log(`  ✓ ${track}/${d.fileStem} → ${TOOLS.length * OS.length} variants`)
      }
    }
  } finally {
    await browser.close()
  }
  console.log(`Done — ${count} vault PDFs generated.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
