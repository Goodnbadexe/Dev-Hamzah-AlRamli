// === METADATA ===
// Purpose: Build a ready-to-post 30-day Instagram set from the Toolkit Vault.
//          For every tool (6 issues × 5 picks = 30) it renders a 5-slide IG
//          carousel (1080×1350 PNG) + a bilingual caption.txt, then writes a
//          CONTENT-CALENDAR.md (dated, checkable schedule you can reorder) and a
//          review.html visual board so you can preview all 30 and pick post days.
// Out:     content/social/day-NN-<track>-<tool>/{slide-1..5.png, caption.txt}
//          content/social/CONTENT-CALENDAR.md
//          content/social/review.html
// Run:     npm run build:social     (after npm run build:vault is not required)
// === END METADATA ===
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs"
import { join, resolve } from "node:path"
import { chromium } from "playwright"

const ISSUES = resolve(process.cwd(), "content", "vault", "issues")
const OUT = resolve(process.cwd(), "content", "social")

// First post lands on this date; Day N = START + (N-1) days. Change freely.
const START_DATE = "2026-06-27"

// On-brand per-track accents (mirror build-gumroad-assets.mjs so the set matches).
const ACCENT = {
  security: "#00ffa3", developers: "#4da6ff", agents: "#c084fc",
  automation: "#ffb454", quant: "#ff6b9d", creative: "#5eead4",
}
const TRACK_LABEL = {
  security: "SECURITY", developers: "DEVELOPERS", agents: "AGENTS",
  automation: "AUTOMATION", quant: "QUANT", creative: "CREATIVE",
}
const TRACK_AR = {
  security: "الأمن السيبراني", developers: "المطوّرين", agents: "وكلاء الذكاء",
  automation: "الأتمتة", quant: "التداول الكمّي", creative: "الإبداع في المتصفّح",
}
const TRACK_TAGS = {
  security: "#infosec #cybersecurity #appsec",
  developers: "#devtools #coding #softwareengineering",
  agents: "#AIagents #LLM #autonomousagents",
  automation: "#automation #nocode #productivity",
  quant: "#quant #algotrading #fintech",
  creative: "#creativecoding #webdev #design",
}
const BASE_TAGS = "#AItools #opensource #ClaudeAI #ChatGPT #الذكاء_الاصطناعي #أدوات_الذكاء_الاصطناعي"

// ── helpers ──────────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const firstSentences = (s, n) => String(s ?? "").split(/(?<=[.!?])\s+/).slice(0, n).join(" ").trim()
const slugify = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28)
const pad2 = (n) => String(n).padStart(2, "0")
function dateForDay(i) {
  const d = new Date(START_DATE + "T00:00:00")
  d.setDate(d.getDate() + i)
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
  return { iso: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, wd }
}

const baseCss = (accent) => `
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#0e1726 1px,transparent 1px),
    linear-gradient(90deg,#0e1726 1px,transparent 1px);background-size:54px 54px;opacity:.5}
  .glow{position:absolute;border-radius:50%;background:radial-gradient(circle, ${accent}26, transparent 60%)}
  .mono{font-family:Consolas,'Courier New',monospace}
`

// Shared 1080×1350 chrome (header / body / footer + carousel page dots).
function slide({ accent, track, page, total, body, footerRight = "goodnbad.info" }) {
  const dots = Array.from({ length: total }, (_, i) =>
    `<span style="width:10px;height:10px;border-radius:50%;background:${i === page ? accent : "#26344a"};display:inline-block;margin-right:8px"></span>`).join("")
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(accent)}
    .c{position:relative;width:1080px;height:1350px;background:#070b12;overflow:hidden;
       padding:84px 84px;display:flex;flex-direction:column;color:#eef4fb}
    .g1{width:840px;height:840px;top:-240px;right:-240px}
    .hd{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;
        font-family:Consolas,monospace;font-size:20px;letter-spacing:3px;color:#74879f}
    .hd .a{color:${accent}}
    .bd{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;
        overflow:hidden;padding:30px 0}
    .ft{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;
        font-family:Consolas,monospace;font-size:20px;color:#74879f}
    .ft .s{color:#eef4fb}
  </style></head><body>
    <div class="c"><div class="grid"></div><div class="glow g1"></div>
      <div class="hd"><span>// THE&nbsp;TOOLKIT&nbsp;VAULT</span><span class="a">${TRACK_LABEL[track] || "VAULT"}</span></div>
      <div class="bd">${body}</div>
      <div class="ft"><span>${dots}</span><span class="s">${footerRight}</span></div>
    </div></body></html>`
}

// The proven 5-slide story: hook → why → tool → prompt → CTA.
function slidesFor(pick, issue) {
  const accent = ACCENT[issue.track] || "#00ffa3"
  const track = issue.track
  const wrap = (page, body, footerRight) => slide({ accent, track, page, total: 5, body, footerRight })

  const s1 = wrap(0, `
    <div class="mono" style="color:${accent};letter-spacing:8px;font-size:23px;margin-bottom:30px">${esc(pick.tag)}</div>
    <h1 style="font-size:78px;line-height:1.05;font-weight:800;letter-spacing:-2px;max-width:900px">${esc(firstSentences(pick.hook, 1) || pick.hook)}</h1>
    <div class="mono" style="margin-top:44px;color:#74879f;font-size:25px">swipe&nbsp;→</div>`)

  const s2 = wrap(1, `
    <div class="mono" style="color:${accent};letter-spacing:6px;font-size:22px;margin-bottom:28px">WHY IT MATTERS</div>
    <p style="font-size:46px;line-height:1.34;font-weight:600;color:#dfe9f5;max-width:900px">${esc(firstSentences(pick.whyItMatters, 2))}</p>`)

  const starLine = pick.stars ? ` · ${esc(String(pick.stars))}★ on GitHub` : ""
  const s3 = wrap(2, `
    <div class="mono" style="color:${accent};letter-spacing:6px;font-size:22px;margin-bottom:22px">THE FREE TOOL${starLine}</div>
    <h2 style="font-size:66px;line-height:1.04;font-weight:800;letter-spacing:-1px;color:${accent};text-shadow:0 0 40px ${accent}55">${esc(pick.name)}</h2>
    <p style="margin-top:28px;font-size:38px;line-height:1.34;color:#dfe9f5;max-width:900px">${esc(firstSentences(pick.whatItIs, 2))}</p>
    <div class="mono" style="margin-top:36px;align-self:flex-start;background:#0e1726;border:1px solid ${accent}55;border-radius:8px;padding:13px 19px;font-size:25px;color:${accent}">${esc(pick.repo)}</div>`)

  const s4 = wrap(3, `
    <div class="mono" style="color:${accent};letter-spacing:5px;font-size:22px;margin-bottom:26px">PASTE THIS INTO CLAUDE / CHATGPT 👇</div>
    <div class="mono" style="background:#0a1018;border:1px solid ${accent}44;border-left:6px solid ${accent};border-radius:12px;padding:36px 34px;font-size:29px;line-height:1.5;color:#cfe0f0;max-width:920px">${esc(pick.prompt)}</div>`)

  const s5 = wrap(4, `
    <div class="mono" style="color:${accent};letter-spacing:5px;font-size:23px;margin-bottom:24px">1 OF 5 · ${TRACK_LABEL[track]} DROP</div>
    <h2 style="font-size:64px;line-height:1.08;font-weight:800;letter-spacing:-2px;max-width:900px">5 underground tools.<br>5 paste-ready prompts.</h2>
    <p style="margin-top:30px;font-size:37px;color:#9fb2c9;max-width:880px">The free issue is on the site. A new drop every week.</p>
    <div class="mono" style="margin-top:44px;align-self:flex-start;background:${accent};color:#070b12;font-weight:700;border-radius:12px;padding:18px 28px;font-size:31px;letter-spacing:1px">goodnbad.info →</div>
    <div class="mono" style="margin-top:36px;color:#74879f;font-size:23px">curated by Hamzah Al-Ramli</div>`, "The Toolkit Vault")

  return [s1, s2, s3, s4, s5]
}

function captionFor(pick, issue) {
  const t = issue.track
  return [
    pick.hookAr || "",
    "",
    firstSentences(pick.hook, 2),
    "",
    "اسحب للأمر + برومبت جاهز تنسخه مباشرة في Claude أو ChatGPT 👇",
    "Swipe for the command + a paste-ready prompt.",
    "",
    `🧰 وحدة من ٥ أدوات في إصدار «${TRACK_AR[t] || ""}» من The Toolkit Vault.`,
    `🧰 One of 5 in this week's ${TRACK_LABEL[t] || "VAULT"} drop — the free issue is on the site.`,
    "🔗 goodnbad.info (link in bio)",
    "",
    `${BASE_TAGS} ${TRACK_TAGS[t] || ""}`,
  ].join("\n")
}

// ── load issues + interleave for daily topic variety ─────────────────────────
const files = readdirSync(ISSUES).filter((f) => f.endsWith(".json")).sort()
const issues = files.map((f) => JSON.parse(readFileSync(join(ISSUES, f), "utf8")))
const order = []
const maxPicks = Math.max(...issues.map((is) => is.picks.length))
for (let p = 0; p < maxPicks; p++) for (const is of issues) if (is.picks[p]) order.push({ issue: is, pick: is.picks[p] })

// ── render ───────────────────────────────────────────────────────────────────
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const rows = []
try {
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1080, height: 1350 })
  for (let i = 0; i < order.length; i++) {
    const { issue, pick } = order[i]
    const dayNum = i + 1
    const { iso, wd } = dateForDay(i)
    const folder = `day-${pad2(dayNum)}-${issue.track}-${slugify(pick.name)}`
    const dir = join(OUT, folder)
    mkdirSync(dir, { recursive: true })
    const html = slidesFor(pick, issue)
    for (let s = 0; s < html.length; s++) {
      await page.setContent(html[s], { waitUntil: "networkidle" })
      await page.screenshot({ path: join(dir, `slide-${s + 1}.png`) })
    }
    writeFileSync(join(dir, "caption.txt"), captionFor(pick, issue))
    rows.push({ dayNum, iso, wd, track: issue.track, name: pick.name, hook: firstSentences(pick.hook, 1), folder })
    console.log(`  ✓ Day ${pad2(dayNum)} — ${issue.track} · ${pick.name}`)
  }
} finally {
  await browser.close()
}

// ── schedule (markdown, checkable + reorderable) ─────────────────────────────
const cal = [
  "# 📅 The Toolkit Vault — 30-Day Instagram Calendar",
  "",
  "**How to post each day:**",
  "1. Open that day's folder → upload `slide-1.png … slide-5.png` to Instagram **as a carousel, in order**.",
  "2. Open `caption.txt`, paste it as the caption.",
  "3. Tick the box once it's posted. Want a different order? Drag the rows around — nothing breaks.",
  "",
  "_Want to see all 30 at a glance first? Open **review.html** in your browser._",
  "",
  "| ✓ | Day | Date | Track | Tool | The hook (slide 1) | Folder |",
  "|---|-----|------|-------|------|--------------------|--------|",
  ...rows.map((r) => `| ☐ | ${r.dayNum} | ${r.iso} ${r.wd} | ${TRACK_LABEL[r.track]} | ${esc(r.name)} | ${r.hook.replace(/\|/g, "\\|")} | \`${r.folder}\` |`),
  "",
  `_${rows.length} posts · one per day · slides in English, captions bilingual · curated by Hamzah Al-Ramli · goodnbad.info_`,
  "",
].join("\n")
writeFileSync(join(OUT, "CONTENT-CALENDAR.md"), cal)

// ── review board (self-contained HTML, opens in any browser) ─────────────────
const cards = rows.map((r) => `
  <article class="card" style="--a:${ACCENT[r.track]}">
    <img src="./${r.folder}/slide-1.png" alt="Day ${r.dayNum} cover" loading="lazy">
    <div class="meta">
      <div class="top"><span class="day">DAY ${r.dayNum}</span><span class="date">${r.iso} · ${r.wd}</span></div>
      <div class="track">${TRACK_LABEL[r.track]}</div>
      <div class="name">${esc(r.name)}</div>
      <div class="folder">${r.folder}/ — slides 1–5 + caption.txt</div>
    </div>
  </article>`).join("\n")
const review = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Toolkit Vault — 30-Day Review Board</title><style>
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
  body{background:#070b12;color:#eef4fb;padding:48px 40px}
  h1{font-size:34px;letter-spacing:-1px}
  .sub{color:#74879f;margin-top:10px;font-family:Consolas,monospace;font-size:15px;line-height:1.7}
  .grid{margin-top:40px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:28px}
  .card{background:#0b1220;border:1px solid #16233a;border-top:4px solid var(--a);border-radius:14px;overflow:hidden;transition:transform .15s,border-color .15s}
  .card:hover{transform:translateY(-4px);border-color:var(--a)}
  .card img{width:100%;display:block;aspect-ratio:4/5;object-fit:cover;background:#070b12}
  .meta{padding:16px 18px 20px}
  .top{display:flex;justify-content:space-between;align-items:center;font-family:Consolas,monospace;font-size:13px}
  .day{color:var(--a);font-weight:700;letter-spacing:1px}
  .date{color:#74879f}
  .track{margin-top:12px;font-family:Consolas,monospace;font-size:12px;letter-spacing:3px;color:#74879f}
  .name{margin-top:4px;font-size:21px;font-weight:700;color:var(--a)}
  .folder{margin-top:10px;font-family:Consolas,monospace;font-size:12px;color:#5a6b82;word-break:break-all}
</style></head><body>
  <h1>📅 The Toolkit Vault — 30-Day Review Board</h1>
  <div class="sub">${rows.length} posts ready · one per day · slides in English, captions bilingual.<br>
  Each card = one day. Upload that folder's slide-1…5 as a carousel, paste its caption.txt. Open <b>CONTENT-CALENDAR.md</b> to tick days off and reorder.</div>
  <div class="grid">${cards}</div>
</body></html>`
writeFileSync(join(OUT, "review.html"), review)

console.log(`\nDone — ${rows.length} posts (${rows.length * 5} slide PNGs) + CONTENT-CALENDAR.md + review.html in content/social/`)
