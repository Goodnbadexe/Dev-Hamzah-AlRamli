// STANDALONE concept slide builder — NON-destructive. Renders ONLY the
// day-91-security-vulnhuntr concept folder at 1080x1440 (the 2026 carousel spec),
// reusing the brand slide chrome from build-social-posts.mjs. Does NOT rmSync,
// does NOT touch any other day folder, does NOT read the vault issues.
import { mkdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { chromium } from "playwright"

const OUT = resolve(process.cwd(), "content", "social", "day-91-security-vulnhuntr")
const W = 1080, H = 1440 // 2026 carousel spec (was 1350)
const accent = "#00ffa3"

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const baseCss = (accent) => `
  *{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#0e1726 1px,transparent 1px),
    linear-gradient(90deg,#0e1726 1px,transparent 1px);background-size:54px 54px;opacity:.5}
  .glow{position:absolute;border-radius:50%;background:radial-gradient(circle, ${accent}26, transparent 60%)}
  .mono{font-family:Consolas,'Courier New',monospace}
`

function slide({ page, total, body, footerRight = "goodnbad.info" }) {
  const dots = Array.from({ length: total }, (_, i) =>
    `<span style="width:10px;height:10px;border-radius:50%;background:${i === page ? accent : "#26344a"};display:inline-block;margin-right:8px"></span>`).join("")
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(accent)}
    .c{position:relative;width:${W}px;height:${H}px;background:#070b12;overflow:hidden;
       padding:90px 84px;display:flex;flex-direction:column;color:#eef4fb}
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
      <div class="hd"><span>// THE&nbsp;TOOLKIT&nbsp;VAULT</span><span class="a">SECURITY</span></div>
      <div class="bd">${body}</div>
      <div class="ft"><span>${dots}</span><span class="s">${footerRight}</span></div>
    </div></body></html>`
}

const wrap = (page, body, footerRight) => slide({ page, total: 5, body, footerRight })

// Storyboard: hook -> why/proof -> the tool + repo -> follows input to exploit + paste-ready command -> CTA save.
const s1 = wrap(0, `
  <div class="mono" style="color:${accent};letter-spacing:8px;font-size:23px;margin-bottom:30px">AI SECURITY · OPEN SOURCE</div>
  <h1 style="font-size:82px;line-height:1.05;font-weight:800;letter-spacing:-2px;max-width:900px">This AI just found a bug a senior dev missed.</h1>
  <div class="mono" style="margin-top:44px;color:#74879f;font-size:25px">swipe&nbsp;→</div>`)

const s2 = wrap(1, `
  <div class="mono" style="color:${accent};letter-spacing:6px;font-size:22px;margin-bottom:28px">WHY IT MATTERS</div>
  <p style="font-size:48px;line-height:1.34;font-weight:600;color:#dfe9f5;max-width:920px">It uses an LLM to read your code the way an attacker would — chasing complex, multi-step bugs that classic scanners walk right past. Credited with real AI-found 0-days in ComfyUI, Langflow and FastChat.</p>`)

const s3 = wrap(2, `
  <div class="mono" style="color:${accent};letter-spacing:6px;font-size:22px;margin-bottom:22px">THE FREE TOOL · 2.7k★ on GitHub</div>
  <h2 style="font-size:72px;line-height:1.04;font-weight:800;letter-spacing:-1px;color:${accent};text-shadow:0 0 40px ${accent}55">Vulnhuntr</h2>
  <p style="margin-top:28px;font-size:40px;line-height:1.34;color:#dfe9f5;max-width:920px">Zero-shot vulnerability discovery for Python. Free, open-source (AGPL-3.0). Runs on Claude, GPT, or a local Ollama model — your code never has to leave your machine.</p>
  <div class="mono" style="margin-top:36px;align-self:flex-start;background:#0e1726;border:1px solid ${accent}55;border-radius:8px;padding:13px 19px;font-size:26px;color:${accent}">github.com/protectai/vulnhuntr</div>`)

const s4 = wrap(3, `
  <div class="mono" style="color:${accent};letter-spacing:5px;font-size:22px;margin-bottom:20px">IT FOLLOWS UNTRUSTED INPUT → REMOTE EXPLOIT</div>
  <p style="font-size:34px;line-height:1.32;color:#dfe9f5;max-width:920px;margin-bottom:26px">It traces the full call chain from user input to server output — flagging RCE, SQLi, SSRF, XSS, LFI, IDOR & arbitrary file writes. Run it:</p>
  <div class="mono" style="background:#0a1018;border:1px solid ${accent}44;border-left:6px solid ${accent};border-radius:12px;padding:32px 30px;font-size:27px;line-height:1.55;color:#cfe0f0;max-width:920px">pipx install vulnhuntr<br>export ANTHROPIC_API_KEY=...<br>vulnhuntr -r /path/to/your/repo</div>`)

const s5 = wrap(4, `
  <div class="mono" style="color:${accent};letter-spacing:5px;font-size:23px;margin-bottom:24px">1 OF 5 · SECURITY DROP</div>
  <h2 style="font-size:66px;line-height:1.08;font-weight:800;letter-spacing:-2px;max-width:900px">5 underground tools.<br>5 paste-ready prompts.</h2>
  <p style="margin-top:30px;font-size:38px;color:#9fb2c9;max-width:900px">The command's on the last slide — save this so you can run it yourself. The free issue is on the site.</p>
  <div class="mono" style="margin-top:44px;align-self:flex-start;background:${accent};color:#070b12;font-weight:700;border-radius:12px;padding:18px 28px;font-size:31px;letter-spacing:1px">goodnbad.info →</div>
  <div class="mono" style="margin-top:36px;color:#74879f;font-size:23px">curated by Hamzah Al-Ramli</div>`, "The Toolkit Vault")

const html = [s1, s2, s3, s4, s5]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.setViewportSize({ width: W, height: H })
  for (let s = 0; s < html.length; s++) {
    await page.setContent(html[s], { waitUntil: "networkidle" })
    await page.screenshot({ path: join(OUT, `slide-${s + 1}.png`) })
    console.log(`  ok slide-${s + 1}.png`)
  }
} finally {
  await browser.close()
}
console.log(`Done — 5 slides (${W}x${H}) in ${OUT}`)
