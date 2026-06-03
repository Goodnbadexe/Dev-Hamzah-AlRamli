# CODEX HANDOFF — GOODNBAD OS

## Project
- Brand: Goodnbad.exe
- Domain: www.goodnbad.info
- Stack: Next.js + Tailwind + Vercel
- GitHub owner: Goodnbadexe
- Git email: r_hamooz@hotmail.com

## Current State
The repo has already completed:
1. security hardening
2. new route skeleton
3. OS primitives
4. homepage rewrite into GOODNBAD OS desktop shell

Recent work includes:
- middleware protection
- webhook secret checks
- redirects from legacy routes
- removal of dead duplicate files
- creation of:
  - /personnel
  - /deployments
  - /deployments/[slug]
  - /signal
  - /contact
  - /terminal
  - /lab
- OS primitives in components/os/
- homepage rebuilt as GOODNBAD OS desktop

## Mission
Continue the rebuild in controlled phases without destroying useful inner logic or content.

## Non-Negotiables
- No full rewrite
- No chaotic refactors
- Preserve useful data/content/libs
- Keep the site deployable after each phase
- Do not expose secrets or internal tools
- Keep the public site premium, clear, and safe
- The site should feel like a system, but behave like a website

## UX Rules
- Non-technical visitors must understand the site quickly
- Visible labels must be plain English first, thematic second
- No mandatory long intro
- No fake loading delays
- Terminal must remain optional
- Mobile must be simplified and clear

## Theme Rules
- GOODNBAD OS remains the design language
- OS feel should be visual and structural, not a complicated fake desktop simulation
- Avoid cliché hacker aesthetics
- Avoid over-glitching
- Avoid confusing naming in visible UI

## Remaining Execution Order
5. Build /personnel as the primary recruiter-friendly dossier page
6. Build /deployments + [slug] as project mission files
7. Build /signal, /contact, /terminal
8. Gate /lab via env var
9. Final hardening, mobile pass, sitemap/robots cleanup, Vercel-ready polish

## Output Style
For every task:
1. say what files you will touch
2. make the changes
3. summarize what changed
4. note risks or follow-up
5. suggest a commit message

## Stop Rule
Do only the requested phase.
Do not continue beyond scope unless explicitly told.