# 📅 The Toolkit Vault — Days 61–90 Draft

Third batch. Same 6-pillar rotation (SECURITY → DEVELOPERS → AGENTS → AUTOMATION → QUANT → CREATIVE), same voice, 30 fresh tools — **none reused** from Days 1–60. Continues from Day 60 (2026-09-01 Tue, per live `start_date` 2026-07-04), so Day 61 lands **2026-09-02 Wed**.

**Hooks are English slide-1 lines only** — Arabic still needs writing (marked `[AR needed]` for every row). **R** = shines as a reel/video demo · **C** = better as a static carousel. All 30 `owner/repo` links were verified live via `gh repo view` on 2026-07-09 (stars + license checked). Two tools recently moved orgs — the canonical paths below are current: `Comfy-Org/ComfyUI` (ex-comfyanonymous) and `OpenHands/OpenHands` (ex-All-Hands-AI).

| Day | Track | Tool | GitHub (owner/repo) | Hook (slide 1) | R/C |
|-----|-------|------|---------------------|----------------|-----|
| 61 | SECURITY | promptfoo | `promptfoo/promptfoo` | You test your code before every release — but not your prompts. promptfoo red-teams your LLM app with thousands of attack probes before your users do. `[AR needed]` | C |
| 62 | DEVELOPERS | just | `casey/just` | Makefiles were never meant to be your project's command menu — just is a command runner with none of the make baggage, and recipes anyone can read. `[AR needed]` | C |
| 63 | AGENTS | browser-use | `browser-use/browser-use` | Your AI can write code but can't click a button — browser-use gives any LLM real hands on a real browser: forms, logins, checkout flows. `[AR needed]` | R |
| 64 | AUTOMATION | Huginn | `huginn/huginn` | IFTTT watches the three things it lets you — Huginn is a self-hosted army of agents that watch anything on the web and act on your rules, on your server. `[AR needed]` | C |
| 65 | QUANT | CCXT | `ccxt/ccxt` | Every crypto exchange has a different API — CCXT wraps 100+ of them behind one interface, so your trading code works everywhere. `[AR needed]` | C |
| 66 | CREATIVE | ComfyUI | `Comfy-Org/ComfyUI` | Stop prompting image AI like a slot machine — ComfyUI turns Stable Diffusion into a node graph where you control every step of the pipeline. `[AR needed]` | R |
| 67 | SECURITY | CrowdSec | `crowdsecurity/crowdsec` | fail2ban blocks IPs that attacked YOU — CrowdSec blocks IPs that attacked anyone in the network. Crowd-sourced immunity for your server. `[AR needed]` | C |
| 68 | DEVELOPERS | yazi | `sxyazi/yazi` | You're still ls-and-cd-ing through directories — yazi is a terminal file manager with image previews, so fast it feels unfair. `[AR needed]` | R |
| 69 | AGENTS | CrewAI | `crewAIInc/crewAI` | One agent hits a wall; a crew ships. CrewAI lets you hire a team of role-playing AI agents that plan, delegate, and execute together. `[AR needed]` | C |
| 70 | AUTOMATION | Automatisch | `automatisch/automatisch` | Zapier meters your automations by the task — Automatisch runs the same drag-and-drop workflows on your own server, unmetered, data never leaving. `[AR needed]` | R |
| 71 | QUANT | Hummingbot | `hummingbot/hummingbot` | Market makers earn the spread while you pay it — Hummingbot is the open bot framework that lets you run their playbook on 140+ exchanges. `[AR needed]` | C |
| 72 | CREATIVE | Manim | `ManimCommunity/manim` | The math animations with millions of views on YouTube? That engine is open source — Manim renders precise, beautiful explainers from plain Python. `[AR needed]` | R |
| 73 | SECURITY | gitleaks | `gitleaks/gitleaks` | Every commit is a chance to leak a secret — gitleaks scans your repo and its whole history in seconds and blocks the leak at pre-commit. `[AR needed]` | C |
| 74 | DEVELOPERS | Zellij | `zellij-org/zellij` | tmux with a learning curve of zero — Zellij shows every keybinding on screen and gives your terminal layouts, panes, and sessions that survive. `[AR needed]` | R |
| 75 | AGENTS | OpenHands | `OpenHands/OpenHands` | Describe the issue; get the PR. OpenHands is an open AI engineer that writes code, runs it, browses docs, and fixes its own mistakes. `[AR needed]` | R |
| 76 | AUTOMATION | Temporal | `temporalio/temporal` | Your multi-step job died at step 7 of 9 — Temporal makes workflows durable: crash anywhere, resume exactly there, no lost state. `[AR needed]` | C |
| 77 | QUANT | QuantStats | `ranaroussi/quantstats` | Your backtest says +40% — QuantStats tells you the truth: drawdowns, tail risk, and a full tear sheet from one line of Python. `[AR needed]` | R |
| 78 | CREATIVE | Upscayl | `upscayl/upscayl` | That 640px image you need in print quality — Upscayl upscales it with local AI, free, on your own machine, no upload, no watermark. `[AR needed]` | R |
| 79 | SECURITY | SpiderFoot | `smicallef/spiderfoot` | Want to know what the internet knows about a target? SpiderFoot runs 200+ OSINT modules and draws you the map — emails, hosts, leaks, links. `[AR needed]` | R |
| 80 | DEVELOPERS | gum | `charmbracelet/gum` | Your shell scripts can have dropdowns, spinners, and styled prompts — gum makes bash interactive and beautiful, one line per widget. `[AR needed]` | R |
| 81 | AGENTS | LangGraph | `langchain-ai/langgraph` | Chains break the first time an agent needs to loop back — LangGraph models your agents as a graph: branches, retries, human sign-off, state. `[AR needed]` | C |
| 82 | AUTOMATION | Hatchet | `hatchet-dev/hatchet` | Your background jobs deserve better than a Redis queue and a prayer — Hatchet runs them on Postgres with retries, rate limits, and a real dashboard. `[AR needed]` | C |
| 83 | QUANT | bt | `pmorissette/bt` | Test the strategy, not the plumbing — bt lets you compose portfolio logic from reusable blocks and swap pieces without rewriting the backtest. `[AR needed]` | C |
| 84 | CREATIVE | PixiJS | `pixijs/pixijs` | The fastest way to put 10,000 moving sprites in a browser — PixiJS is the WebGL 2D engine behind games and visuals that never drop a frame. `[AR needed]` | R |
| 85 | SECURITY | Amass | `owasp-amass/amass` | Attackers map your subdomains before you do — OWASP Amass shows you your entire external attack surface first. `[AR needed]` | C |
| 86 | DEVELOPERS | Tabby | `TabbyML/tabby` | Copilot, minus the subscription and the data leaving your machine — Tabby is a self-hosted AI code assistant your whole team can run on one GPU. `[AR needed]` | R |
| 87 | AGENTS | Mem0 | `mem0ai/mem0` | Your agent forgets everything between sessions — Mem0 gives it long-term memory that learns your preferences and gets smarter every chat. `[AR needed]` | C |
| 88 | AUTOMATION | StackStorm | `StackStorm/st2` | When the alert fires at 3am, StackStorm has already run the fix — event-driven auto-remediation your on-call rotation will thank you for. `[AR needed]` | C |
| 89 | QUANT | GS Quant | `goldmansachs/gs-quant` | Goldman Sachs open-sourced the toolkit its own desks use — gs-quant brings institution-grade pricing and risk models to your Python. `[AR needed]` | C |
| 90 | CREATIVE | Phaser | `phaserjs/phaser` | Ship a real game in a weekend that runs in every browser — Phaser has powered thousands of web games for a decade, and it's still free. `[AR needed]` | R |

_30 fresh tools · same 6-pillar rotation · slides English, captions bilingual (Arabic still to write) · draft for review — curated by Hamzah Al-Ramli · goodnbad.info_

## Format spread
- **C (carousel): 16** — days 61, 62, 64, 65, 67, 69, 71, 73, 76, 81, 82, 83, 85, 87, 88, 89
- **R (reel/demo): 14** — days 63, 66, 68, 70, 72, 74, 75, 77, 78, 79, 80, 84, 86, 90

## Pillar check (5 each, order preserved)
- **SECURITY:** promptfoo, CrowdSec, gitleaks, SpiderFoot, Amass
- **DEVELOPERS:** just, yazi, Zellij, gum, Tabby
- **AGENTS:** browser-use, CrewAI, OpenHands, LangGraph, Mem0
- **AUTOMATION:** Huginn, Automatisch, Temporal, Hatchet, StackStorm
- **QUANT:** CCXT, Hummingbot, QuantStats, bt, GS Quant
- **CREATIVE:** ComfyUI, Manim, Upscayl, PixiJS, Phaser

## Verification + licensing notes (checked 2026-07-09 via `gh repo view`)
- All 30 repos exist and are active. Stars at check time ranged ~2.9k (bt) to ~120k (ComfyUI).
- **Org moves:** ComfyUI → `Comfy-Org/ComfyUI`; OpenHands → `OpenHands/OpenHands`. Use these paths on slides.
- **Open-core caveats (still fine to feature, core is FOSS):** Tabby (Apache core + ee dir), Automatisch (AGPL core + enterprise dir), OpenHands (MIT core, license shows "other" due to enterprise folder), Amass (OSS, license field "other").
- **Swapped during drafting:** Inngest was dropped for StackStorm (`StackStorm/st2`, Apache-2.0) because Inngest's repo license is non-standard and could undercut the "free/open-source" claim.
