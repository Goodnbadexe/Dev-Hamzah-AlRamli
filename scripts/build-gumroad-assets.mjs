// === METADATA ===
// Purpose: Build the Gumroad-ready upload kit. For every issue × OS it produces a
//          product folder containing: the OS-tuned PDF, a cover image (1280×720),
//          a themed square thumbnail (1024×1024), and a paste-ready listing.md.
// Out:     content/vault/_bundles/<os>/<track>/{<pdf>, cover.png, thumbnail.png, listing.md}
//          plus _bundles/<os>/all-access/ with the per-OS zip's assets.
// Run:     npm run build:gumroad   (after npm run build:vault)
// === END METADATA ===
import { readFileSync, readdirSync, mkdirSync, copyFileSync, writeFileSync, existsSync, rmSync } from "node:fs"
import { join, resolve } from "node:path"
import { chromium } from "playwright"

const ROOT = resolve(process.cwd(), "content", "vault")
const ISSUES = join(ROOT, "issues")
const BUNDLES = join(ROOT, "_bundles")
const OSES = [
  { id: "windows", label: "Windows", shell: "PowerShell" },
  { id: "linux", label: "Linux", shell: "bash" },
  { id: "macos", label: "macOS", shell: "zsh" },
]

// Per-track accent so products are distinguishable in the Gumroad grid, on-brand.
const ACCENT = {
  security: "#00ffa3",
  developers: "#4da6ff",
  agents: "#c084fc",
  automation: "#ffb454",
  quant: "#ff6b9d",
  creative: "#5eead4",
}
const ALL_ACCENT = "#00ffa3"
const pad2 = (n) => String(n).padStart(2, "0")

// Display name per track (the Gumroad product Name).
const NAMES = {
  security: "Security",
  developers: "Developers",
  agents: "Agents",
  automation: "Automation",
  quant: "Quant & Trading",
  creative: "Build in the Browser",
}

function setupBlock({ name, slug, price, cover, thumb, file, redirect }) {
  return `<!-- ============ GUMROAD SETUP — copy these into the product screen ============ -->
> **Name:** ${name}
> **Suggested URL slug:** ${slug}
> **Price:** ${price}
> **Product file to upload:** ${file}
> **Cover image (1280×720):** cover.png
> **Thumbnail (square icon):** thumbnail.png
> **Content → Redirect after purchase:** ${redirect}
> **Permalink (fill in after you Save):** hamzahramli.gumroad.com/l/______
>
> Paste everything BELOW this line into the product **Description**.
<!-- ========================================================================= -->

`
}

const baseCss = (accent) => `
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#0e1726 1px,transparent 1px),
    linear-gradient(90deg,#0e1726 1px,transparent 1px);background-size:48px 48px;opacity:.5}
  .glow{position:absolute;border-radius:50%;background:radial-gradient(circle, ${accent}26, transparent 60%)}
  .mono{font-family:Consolas,'Courier New',monospace}
`

function coverHtml(issue, os) {
  const accent = ACCENT[issue.track] || ALL_ACCENT
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(accent)}
    .c{position:relative;width:1280px;height:720px;background:#070b12;overflow:hidden;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
    .g1{width:760px;height:760px;top:-260px;right:-200px}
    .rh{position:relative;z-index:2;display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:16px;letter-spacing:3px;color:#74879f}
    .rh .a{color:${accent}}
    .mid{position:relative;z-index:2}
    .kick{font-family:Consolas,monospace;color:#ff4d6a;letter-spacing:10px;font-size:20px;margin-bottom:16px}
    h1{font-size:120px;line-height:.88;font-weight:800;letter-spacing:-4px;color:#eef4fb}
    h1 .v{color:${accent};text-shadow:0 0 40px ${accent}66}
    .sub{margin-top:26px;font-size:26px;color:#9fb2c9;max-width:820px;line-height:1.3}
    .badge{display:inline-block;margin-top:26px;font-family:Consolas,monospace;font-size:15px;letter-spacing:2px;color:#070b12;background:${accent};border-radius:6px;padding:8px 16px;font-weight:700}
    .foot{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-end;font-family:Consolas,monospace;font-size:17px;color:#74879f}
    .foot .s{color:#eef4fb}
  </style></head><body>
  <div class="c"><div class="grid"></div><div class="glow g1"></div>
    <div class="rh"><span>// THE&nbsp;TOOLKIT&nbsp;VAULT</span><span class="a">ISSUE ${pad2(issue.week)}</span></div>
    <div class="mid">
      <div class="kick">${issue.kicker}</div>
      <h1>WEEK ${pad2(issue.week)} <span class="v">VAULT</span></h1>
      <div class="sub">${issue.subtitle}</div>
      <div class="badge">TUNED FOR ${os.label.toUpperCase()} · ${os.shell}</div>
    </div>
    <div class="foot"><span>5 picks · paste-ready prompts · EN / AR</span><span>curated by Hamzah Al-Ramli · <span class="s">goodnbad.info</span></span></div>
  </div></body></html>`
}

function thumbHtml(title, week, accent) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(accent)}
    .t{position:relative;width:1024px;height:1024px;background:#070b12;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px}
    .g1{width:900px;height:900px;top:-180px;left:-180px}
    .z{position:relative;z-index:2}
    .mark{font-size:64px;color:${accent};margin-bottom:18px}
    .wk{font-family:Consolas,monospace;font-size:30px;letter-spacing:8px;color:#74879f;margin-bottom:6px}
    .big{font-size:300px;line-height:.85;font-weight:800;color:${accent};text-shadow:0 0 70px ${accent}59;letter-spacing:-8px}
    .name{margin-top:18px;font-size:54px;font-weight:800;color:#eef4fb;letter-spacing:-1px;line-height:1.05}
    .kk{margin-top:22px;font-family:Consolas,monospace;font-size:20px;letter-spacing:5px;color:#74879f}
  </style></head><body>
  <div class="t"><div class="grid"></div><div class="glow g1"></div>
    <div class="z">
      <div class="mark">&#9635;</div>
      <div class="wk">WEEK</div>
      <div class="big">${pad2(week)}</div>
      <div class="name">${title}</div>
      <div class="kk">THE TOOLKIT VAULT</div>
    </div>
  </div></body></html>`
}

function listingMd(issue, os) {
  const picks = issue.picks
    .map((p) => {
      const hook = String(p.hook).split(/(?<=[.!?])\s/)[0] // first sentence only
      return `- **${p.tag}** — ${hook}`
    })
    .join("\n")
  const titleTheme = issue.kicker.replace(/\s+/g, " ").trim()
  const setup = setupBlock({
    name: `${NAMES[issue.track] || issue.track} Vault — ${os.label}`,
    slug: `${issue.track}-vault-${os.id}`,
    price: "$8 / month (membership)",
    cover: "cover.png",
    thumb: "thumbnail.png",
    file: `${issue.track}-vault-${os.id}.pdf`,
    redirect: "https://www.goodnbad.info/welcome",
  })
  return `${setup}# ${issue.subtitle}

**Tuned for ${os.label} (${os.shell}).** A single, beautifully designed PDF — 5 hand-picked, under-surfaced open-source tools, each with a paste-ready prompt you drop straight into Claude, ChatGPT, or Codex.

### Inside this issue (${os.label} build)
${picks}

Each pick includes: what it is, why it matters for *you*, the real GitHub link, and a copy-paste AI prompt tuned for ${os.label}. Bilingual — English + Arabic. Instant download.

### وش تحصل عليه
ملف PDF مصمّم بعناية — ٥ أدوات مفتوحة المصدر مختارة بعناية، كل وحدة معها برومبت جاهز تنسخه في Claude أو ChatGPT أو Codex، ومهيّأ لنظام ${os.label}. شرح لكل أداة، وليش تهمك، ورابط GitHub الحقيقي. إنجليزي + عربي، تحميل فوري.

---
*${titleTheme} · The Toolkit Vault · curated by Hamzah Al-Ramli · goodnbad.info*
`
}

function allAccessMd(os, weeks) {
  const lines = weeks.map((w) => `- **Week ${pad2(w.week)} · ${w.kicker.replace(/\s+/g, " ").trim()}** — ${w.subtitle}`).join("\n")
  const setup = setupBlock({
    name: `All-Access Vault — ${os.label}`,
    slug: `all-access-${os.id}`,
    price: "$25 / month (membership)",
    cover: "cover.png",
    thumb: "thumbnail.png",
    file: `all-access-${os.id}.zip`,
    redirect: "https://www.goodnbad.info/welcome",
  })
  return `${setup}# All-Access — the whole Toolkit Vault (${os.label})

Every issue, one download. ${weeks.length} designed PDFs — ${weeks.length * 5} hand-picked open-source tools, each with a paste-ready AI prompt, all tuned for ${os.label} (${os.shell}).

### What's inside
${lines}

Bilingual (EN + AR). Instant download. New issues added over time.

### كل الخزينة دفعة وحدة
كل الإصدارات بتحميل واحد — ${weeks.length} ملف PDF مصمّم، ${weeks.length * 5} أداة مفتوحة المصدر مع برومبت جاهز لكل وحدة، مهيّأة لنظام ${os.label}.

---
*All-Access · The Toolkit Vault · goodnbad.info*
`
}

const files = readdirSync(ISSUES).filter((f) => f.endsWith(".json")).sort()
const issues = files.map((f) => JSON.parse(readFileSync(join(ISSUES, f), "utf8")))

// fresh structure
if (existsSync(BUNDLES)) {
  for (const os of OSES) rmSync(join(BUNDLES, os.id), { recursive: true, force: true })
}

const browser = await chromium.launch()
let made = 0
try {
  const page = await browser.newPage()
  for (const os of OSES) {
    for (const issue of issues) {
      const dir = join(BUNDLES, os.id, issue.track)
      mkdirSync(dir, { recursive: true })
      // pdf
      copyFileSync(join(ROOT, issue.track, `${issue.track}-vault-${os.id}.pdf`), join(dir, `${issue.track}-vault-${os.id}.pdf`))
      // cover 1280x720
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.setContent(coverHtml(issue, os), { waitUntil: "networkidle" })
      await page.screenshot({ path: join(dir, "cover.png") })
      // thumbnail 1024x1024
      const title = (issue.kicker.split("+")[0] || issue.track).trim()
      await page.setViewportSize({ width: 1024, height: 1024 })
      await page.setContent(thumbHtml(title, issue.week, ACCENT[issue.track] || ALL_ACCENT), { waitUntil: "networkidle" })
      await page.screenshot({ path: join(dir, "thumbnail.png") })
      // listing.md
      writeFileSync(join(dir, "listing.md"), listingMd(issue, os))
      made++
    }
    // all-access folder (zip is added by the PowerShell step)
    const aDir = join(BUNDLES, os.id, "all-access")
    mkdirSync(aDir, { recursive: true })
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.setContent(
      coverHtml({ track: "all", week: 0, kicker: "ALL  ·  ACCESS", subtitle: "Every issue of the Toolkit Vault — one download." }, os),
      { waitUntil: "networkidle" },
    )
    await page.screenshot({ path: join(aDir, "cover.png") })
    await page.setViewportSize({ width: 1024, height: 1024 })
    await page.setContent(thumbHtml("All-Access", 0, ALL_ACCENT), { waitUntil: "networkidle" })
    await page.screenshot({ path: join(aDir, "thumbnail.png") })
    writeFileSync(join(aDir, "listing.md"), allAccessMd(os, issues))
  }
} finally {
  await browser.close()
}
console.log(`Done — ${made} product folders + ${OSES.length} all-access folders (cover + thumbnail + listing.md each).`)
