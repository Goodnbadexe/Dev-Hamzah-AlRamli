// === METADATA ===
// Purpose: Data-driven generator for "The Toolkit Vault" issue PDFs. Reproduces
//          the original designed magazine layout (cover → how-to → 5 picks →
//          outro) so every weekly issue looks identical and on-brand.
// Design:  ported verbatim from deliverables/toolkit-vault/toolkit-week-01.html
//          (Hamzah's own product). Dark theme, emerald accent, EN + AR per pick,
//          a paste-ready prompt per tool, and a blurred "teaser" mode for the
//          free lead-magnet version.
// Usage:   issueHtml(issue, { teaser }) -> full HTML string for Playwright.
// === END METADATA ===

const CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  @page{size:A4;margin:0}
  :root{
    --bg:#070b12;--panel:#0d1422;--line:#1b2740;--ink:#cdd8e6;--mut:#74879f;
    --grn:#00ffa3;--red:#ff4d6a;--white:#eef4fb;
  }
  html{font-family:'Segoe UI',Arial,sans-serif}
  .page{position:relative;width:794px;min-height:1123px;background:var(--bg);color:var(--ink);
    padding:64px 60px;overflow:hidden;break-after:page}
  .page:last-child{break-after:auto}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#0e1726 1px,transparent 1px),
    linear-gradient(90deg,#0e1726 1px,transparent 1px);background-size:40px 40px;opacity:.45}
  .glow{position:absolute;width:560px;height:560px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,255,163,.11),transparent 60%);top:-180px;right:-160px}
  .z{position:relative;z-index:2}
  .mono{font-family:Consolas,'Courier New',monospace}
  .rh{display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:12px;
    letter-spacing:2px;color:var(--mut);border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:30px}
  .rh .g{color:var(--grn)}
  .cov{display:flex;flex-direction:column;justify-content:space-between;min-height:995px}
  .kick{font-family:Consolas,monospace;color:var(--red);letter-spacing:8px;font-size:18px;margin-bottom:14px}
  .cov h1{font-size:92px;line-height:.9;font-weight:800;letter-spacing:-3px;color:var(--white)}
  .cov h1 .v{color:var(--grn);text-shadow:0 0 30px rgba(0,255,163,.4)}
  .cov .sub{margin-top:22px;font-size:23px;color:#9fb2c9;max-width:600px}
  .cov .meta{margin-top:30px;font-family:Consolas,monospace;font-size:15px;color:var(--mut);letter-spacing:1px}
  .cov .picks{font-family:Consolas,monospace;font-size:15px;color:#6b7f99;line-height:2}
  .cov .picks b{color:var(--grn);font-weight:400}
  .lock{font-size:30px;color:var(--grn)}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:Consolas,monospace;
    font-size:14px;color:var(--mut)}
  .foot .s{color:var(--white)}
  h2{font-size:34px;color:var(--white);font-weight:800;letter-spacing:-1px;margin-bottom:8px}
  .lead{font-size:16px;color:#a9b8cc;line-height:1.65;margin-bottom:22px}
  .how{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:22px 24px;margin-bottom:22px}
  .how h3{font-size:13px;letter-spacing:2px;color:var(--grn);font-family:Consolas,monospace;margin-bottom:14px}
  .how ol{margin-left:18px;font-size:14.5px;line-height:1.9;color:var(--ink)}
  .ar{direction:rtl;text-align:right;font-size:15px;color:#9fb2c9;line-height:1.9;
    border-right:2px solid var(--grn);padding-right:14px}
  .toc{list-style:none}
  .toc li{display:flex;align-items:baseline;gap:14px;padding:11px 0;border-bottom:1px solid var(--line);font-size:15px}
  .toc .n{font-family:Consolas,monospace;color:var(--grn);font-size:15px}
  .toc .t{color:var(--white);font-weight:600}
  .toc .c{margin-left:auto;font-family:Consolas,monospace;font-size:12px;color:var(--mut)}
  .num{font-family:Consolas,monospace;font-size:64px;color:#16233a;font-weight:700;line-height:1;float:right}
  .cat{font-family:Consolas,monospace;font-size:12px;letter-spacing:2px;color:var(--red);margin-bottom:6px}
  .tname{font-size:42px;color:var(--white);font-weight:800;letter-spacing:-1px}
  .stars{font-family:Consolas,monospace;font-size:13px;color:var(--mut);margin-top:8px}
  .stars b{color:var(--grn);font-weight:400}
  .hook{font-size:19px;color:var(--white);line-height:1.5;font-weight:600;margin:22px 0 14px}
  .arh{direction:rtl;text-align:right;font-size:15.5px;color:#9fb2c9;line-height:1.85;
    border-right:2px solid var(--grn);padding-right:14px;margin-bottom:22px}
  .blk{margin-bottom:18px}
  .blk h4{font-family:Consolas,monospace;font-size:12px;letter-spacing:2px;color:var(--grn);margin-bottom:8px}
  .blk p{font-size:14.5px;line-height:1.7;color:var(--ink)}
  .link{font-family:Consolas,monospace;font-size:14px;color:var(--grn);background:var(--panel);
    border:1px solid var(--line);border-radius:7px;padding:12px 16px;margin-bottom:16px}
  .link .a{color:var(--mut)}
  .prompt{background:#0a1018;border:1px solid var(--line);border-left:3px solid var(--grn);border-radius:7px;padding:16px 18px}
  .prompt .lbl{font-family:Consolas,monospace;font-size:11px;letter-spacing:2px;color:var(--mut);margin-bottom:10px}
  .prompt .lbl b{color:var(--grn);font-weight:400}
  .prompt .txt{font-family:Consolas,monospace;font-size:13px;line-height:1.65;color:#bceede}
  .cta{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:24px;margin:20px 0}
  .cta b{color:var(--grn)}
  body.teaser .paywall-hidden{filter:blur(7px);user-select:none;pointer-events:none}
  .unlock{display:none}
  body.teaser .unlock{display:flex;align-items:center;gap:8px;font-family:Consolas,monospace;
    font-size:12.5px;letter-spacing:.5px;color:var(--red);background:rgba(255,77,106,.07);
    border:1px solid rgba(255,77,106,.35);border-radius:7px;padding:9px 13px;margin:10px 0 4px}
  body.teaser .unlock b{color:var(--grn);font-weight:400}
  body.teaser .unlock .lk{font-size:14px}
`

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
const nb = (s) => esc(s).replace(/ /g, "&nbsp;")
const pad2 = (n) => String(n).padStart(2, "0")

function coverPage(d) {
  const picks = d.picks
    .map((p) => `<b>&gt;</b> <span class="paywall-hidden">${esc(p.name)}</span>`)
    .join(" &nbsp; ")
  return `<section class="page"><div class="grid"></div><div class="glow"></div>
    <div class="z cov">
      <div>
        <div class="rh"><span>// ${nb("THE TOOLKIT VAULT")}</span><span class="g">ISSUE ${pad2(d.week)}</span></div>
        <div class="kick">${esc(d.kicker)}</div>
        <h1>WEEK&nbsp;${pad2(d.week)}<br><span class="v">VAULT</span></h1>
        <div class="sub">${esc(d.subtitle)}</div>
        <div class="meta">${esc(d.meta)}</div>
      </div>
      <div>
        <div class="picks">${picks}</div>
        <div class="unlock"><span class="lk">&#128274;</span> Unlock the actual tools, links &amp; prompts &#8594; <b>goodnbad.info/subscribe</b></div>
      </div>
      <div class="foot"><span class="lock">&#9635;</span><span>curated by Hamzah Al-Ramli &nbsp;·&nbsp; <span class="s">goodnbad.info</span></span></div>
    </div>
  </section>`
}

function introPage(d) {
  const toc = d.picks
    .map(
      (p) =>
        `<li><span class="n">${pad2(p.num)}</span><span class="t paywall-hidden">${esc(p.name)}</span><span class="c">${esc(p.tag)}</span></li>`,
    )
    .join("")
  return `<section class="page"><div class="grid"></div>
    <div class="z">
      <div class="rh"><span>// ${nb("HOW THIS WORKS")}</span><span class="g">ISSUE ${pad2(d.week)} · 02</span></div>
      <h2>${esc(d.introTitle || "Welcome to the Vault.")}</h2>
      <p class="lead">${esc(d.introLead)}</p>
      <div class="how">
        <h3>&#9656; HOW TO USE EACH PICK</h3>
        <ol>
          <li>Read the hook — decide in 5 seconds if it's for you.</li>
          <li>Open the GitHub link.</li>
          <li>Copy the <b style="color:#00ffa3">&gt;_ DROP THIS INTO YOUR AI</b> prompt into Claude, ChatGPT, or Codex.</li>
          <li>Let it walk you through setup &amp; first use. No guesswork.</li>
        </ol>
      </div>
      <p class="ar">${esc(d.introAr)}</p>
      <h3 style="font-family:Consolas,monospace;font-size:13px;letter-spacing:2px;color:#74879f;margin:26px 0 10px">THIS WEEK</h3>
      <ul class="toc">${toc}</ul>
      <div class="unlock"><span class="lk">&#128274;</span> Tool names, GitHub links &amp; paste-ready prompts are unlocked for subscribers &#8594; <b>goodnbad.info/subscribe</b></div>
    </div>
  </section>`
}

function pickPage(p) {
  return `<section class="page"><div class="grid"></div>
    <div class="z">
      <div class="rh"><span>// ${nb("PICK " + pad2(p.num))}</span><span class="g">${esc(p.tag)}</span></div>
      <div class="num">${pad2(p.num)}</div>
      <div class="cat">${esc(p.category)}</div>
      <div class="tname paywall-hidden">${esc(p.name)}</div>
      <div class="stars">&#9733; <b>${esc(p.stars)}</b> &nbsp;·&nbsp; ${esc(p.note)} &nbsp;·&nbsp; verdict <b>${esc(p.verdict)}</b></div>
      <p class="hook">${esc(p.hook)}</p>
      <p class="arh">${esc(p.hookAr)}</p>
      <div class="blk"><h4>WHAT IT IS</h4><p>${esc(p.whatItIs)}</p></div>
      <div class="blk"><h4>WHY IT MATTERS FOR YOU</h4><p>${esc(p.whyItMatters)}</p></div>
      <div class="link"><span class="a">repo &gt; </span><span class="paywall-hidden">${esc(p.repo)}</span></div>
      <div class="prompt">
        <div class="lbl">&gt;_ <b>DROP THIS INTO YOUR AI</b></div>
        <div class="txt paywall-hidden">${esc(p.prompt)}</div>
      </div>
      <div class="unlock"><span class="lk">&#128274;</span> The tool name, GitHub link &amp; paste-ready prompt are blurred &#8594; unlock at <b>goodnbad.info/subscribe</b></div>
    </div>
  </section>`
}

function outroPage(d) {
  return `<section class="page"><div class="grid"></div><div class="glow"></div>
    <div class="z">
      <div class="rh"><span>// ${nb("THAT'S WEEK " + pad2(d.week))}</span><span class="g">ISSUE ${pad2(d.week)} · END</span></div>
      <h2>${esc(d.outroTitle || "That's the Vault for this week.")}</h2>
      <p class="lead">${esc(d.outroLead)}</p>
      <div class="cta">
        <p style="font-size:15px;line-height:1.7;color:#cdd8e6"><b>Next week:</b> ${esc(d.nextTeaser)}<br><br>
          Found one of these useful? Forward this to one person who'd get it. That's how the Vault grows.</p>
      </div>
      <p class="ar">${esc(d.outroAr)}</p>
      <div class="foot" style="margin-top:60px">
        <span class="lock">&#9635;</span>
        <span>The Toolkit Vault &nbsp;·&nbsp; curated by Hamzah Al-Ramli &nbsp;·&nbsp; <span class="s">goodnbad.info</span></span>
      </div>
    </div>
  </section>`
}

export function issueHtml(d, { teaser = false } = {}) {
  const body = [coverPage(d), introPage(d), ...d.picks.map(pickPage), outroPage(d)].join("\n")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${CSS}</style></head><body class="${teaser ? "teaser" : ""}">${body}</body></html>`
}
