# Goodnbad.info — Claude Working Context

## Project
Cybersecurity portfolio for Hamzah Al-Ramli (@Goodnbad.exe).
- **Stack**: Next.js 16, React 19, Tailwind CSS, Radix UI, Vercel
- **Live**: https://www.goodnbad.info
- **Vercel project**: goodnbadexes-projects/v0-cybersecurity-portfolio

## Resource Library
All tasks must draw from the resource library at `/Users/itcalma/Claude full control/`.
Before implementing anything — UI, agents, skills, plugins, automation — scan the relevant repos there first.

### Key repos by category

**UI / Design Systems**
- `ui-ux-pro-max-skill` — advanced UI/UX skill patterns
- `impeccable` — production design system (Astro, Bun)
- `open-design` — full open design system with craft, specs, templates
- `bencium-marketplace` — design patterns: impact-designer, ux-designer, typography, design-audit
- `ui-skills` — Cloudflare-hosted skills for UI components
- `npxskillui` — skill UI rendering library
- `nellavio` — Next.js app with i18n, Tailwind, Vercel

**Claude Code Skills / Agents**
- `caveman` — comprehensive Claude Code skill system (agents, hooks, commands, skills)
- `everything-claude-code` — full Claude Code resource pack (commands, agents, hooks, rules)
- `claude-skills` — modular skills: engineering, marketing, finance, product
- `awesome-claude-code-subagents` — curated subagent library
- `claude-council` — multi-agent council system
- `agent-skills` — Vercel Labs agent skills
- `agents` — wshobson agent collection (tools, plugins)
- `claude-marketplace` — AccessLint plugin marketplace
- `claude-plugins-official` — official Anthropic plugins
- `codex-plugin-cc` — OpenAI Codex plugin for Claude Code

**Anthropic / SDK**
- `anthropic-sdk-go` — official Go SDK
- `claude-agent-sdk-typescript` — official TypeScript agent SDK
- `claude-code-base-action` — GitHub Action for Claude Code
- `anthropic-cli` — official Anthropic CLI (Go)
- `claude-cookbooks` — official usage patterns & recipes
- `claude-code` — official Claude Code repo
- `prompt-eng-interactive-tutorial` — prompt engineering guides

**Security / OSINT / Threat Intelligence**
- `spiderfoot` — OSINT automation framework (Python)
- `GhostTrack` — tracking/reconnaissance tool
- `atlas-gic` — global intelligence architecture
- `globalthreatmap` — live global threat visualization (Next.js, Convex)
- `locally-uncensored` — local uncensored AI runner (Tauri)

**Browser Automation / AI Agents**
- `auto-browser` — AI-powered browser automation
- `UI-TARS-desktop` — ByteDance desktop UI agent (Electron/Tauri)
- `opcode` — Tauri-based agent UI
- `Understand-Anything` — multimodal understanding plugin
- `accessibility-agents` — accessibility audit agents

**Data / ML / Research**
- `the_well` — PolymathicAI scientific ML datasets
- `Memori` — memory system for AI agents (Python + TypeScript)
- `awesome-mcp-servers` — curated MCP server list
- `awesome-codex-skills` — Composio skill library
- `awesome-opensource-apps` — open-source app references

**Other Tools**
- `openclaw` — full-featured Claude Code fork (monorepo, plugins, extensions)
- `screenpipe` — screen capture + AI pipeline (Rust, LFS)
- `worldmonitor` — real-time world monitoring dashboard
- `raincast` — Tauri weather/data app
- `terraink` — Tauri-based app
- `AI_CO_FOUNDER` — AI co-founder SaaS app
- `gemini_cli_skill` — Gemini CLI skill reference
- `claude-obsidian` — Obsidian integration for Claude
- `laravel-hackathon-starter` — Laravel starter kit

## Development rules
- No section is locked. Rebuild weak sections completely.
- Preserve brand direction (cybersecurity, hacker aesthetic, dark theme), not implementation.
- All components must stay modular, editable, reusable, composable.
- Priority: UX quality → visual hierarchy → interaction quality → responsiveness → design consistency.
- Avoid: hardcoded dimensions, frozen structures, generic SaaS layouts, glow blobs, random gradients, fake dashboards.
- Check the resource library before adding any new dependency — it may already exist in a cloned repo.

## Git sync
The repo auto-syncs with Vercel on push. Always `git pull` before making changes to avoid conflicts.
