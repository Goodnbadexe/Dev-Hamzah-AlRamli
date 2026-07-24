# Learning Lab — Phase 0 Evidence & Architecture Recommendation

> Produced 2026-07-24 by a 25-agent evidence sweep (5 parallel investigators + adversarial
> verification; 11/11 verified claims CONFIRMED, none refuted). Raw findings with file:line
> evidence: [phase0-findings.txt](./phase0-findings.txt). No product code was changed.

## 1. Repository evidence table

| Location | What it is | Branch / state |
|---|---|---|
| `G:\Dev-Hamzah-AlRamli\` | Workspace root (NOT a git repo) | Holds GOODNBAD_MASTER_BRIEF / ARCHITECTURE / AUDIT planning docs + CLAUDE.md |
| `G:\Dev-Hamzah-AlRamli\Dev-Hamzah-AlRamli\` | **Primary clone** — github.com/Goodnbadexe/Dev-Hamzah-AlRamli (goodnbad.info) | `feat/goodnbad-os-secure-slice` @ 6bdc524 — **52 modified + 15 untracked files, nothing committed**; owns 6 worktrees |
| `G:\_gnb-work` | Worktree of primary | `main` @ 75eba79 (relation to remote main UNKNOWN — refs stale, run `git fetch`) |
| `G:\dev\wt-drip` / `wt-gumroad` / `wt-leaks` | Worktrees of primary | `feat/weekly-drip` / `feat/category-weeks` / `integration/phase-1-2` (unmerged) |
| `G:\Dev-Hamzah-AlRamli\vault-webhook` | Worktree of primary (NOT a separate service; node_modules symlinked) | `feat/gumroad-supabase` — its features (Gumroad ping, Resend, sales table) already live in origin/main |
| `G:\claude\Dev-Hamzah-AlRamli` | **Second, independent clone** of the same repo | `redesign/cia-dossier` == true remote main @ 3906336; dirty (untracked `app/dossier/`) |

**Deployment:** Vercel project `prj_T7wsPtiurViIcAefVNq1jGKoBCJW` (v0-hamzah-al-ramli-cybersecurity-portfolio),
production tracks `main` (inferred — no branch override in vercel.json), auto-deploys on push.

## 2. Current architecture summary (verified in code)

- **Stack:** Next.js 16.2.7 App Router · React 19.2.3 · Tailwind 3.4.19 · TS 5.9.3 (strict) · shadcn (5 primitives installed, ~25 Radix deps ready) · Vitest 4 (76 passing-claimed tests) · Playwright (e2e baseURL hardcoded to production).
- **Design system:** `components/os/*` — `OSPageShell` / `OSWindow` / `OSTaskbar` / `OSDesktop` etc.; nav is a closed `OSAppId` union + `OS_APPS` registry (7 apps) in `components/os/types.ts`. Tokens: eDEX RGB-triplet block in `app/globals.css` (`--accent: 170 207 209`), emerald shadcn HSL layer, `.os-scanlines`/`.os-grid`/`.os-redact` utilities, breach red re-theme. Fonts: Space Grotesk + JetBrains Mono + Noto Kufi Arabic (repo CLAUDE.md's "Fira Code + Saira Condensed" is stale).
- **Page convention:** server `app/<route>/page.tsx` with `osPageMetadata()` → `<OSPageShell osName="x.exe">` → client `<route>-content.tsx` using `useLanguage()` (`t(ar,en)`, `dir`). i18n is client-side only (localStorage, no locale segments); RTL works per-component.
- **Data layer:** Supabase, service-role ONLY (`lib/supabase/server.ts`: `import "server-only"`, lazy singleton, `isSupabaseConfigured()` graceful degrade). Tables: `leads` (0001), `sales` (0002, Gumroad-fed, idempotent on sale_id). RLS ON with intentionally zero policies. No client-side Supabase.
- **API convention (the pattern to copy):** `app/api/subscribe/lead/route.ts` + `app/api/vault/sign/route.ts` — `runtime="nodejs"` + `force-dynamic`, zod `safeParse` (400/422), bounded `.trim().max()` + enums, `escapeHtml()`, fail-soft side channels, 403-not-404, METADATA header comment blocks.
- **Commerce loop (closest prior art):** free blurred teaser (`/teasers/[track]`, public) vs paid vault: `POST /api/vault/sign` → 5-min HMAC token → `GET /api/vault/[file]` re-checks entitlement, manifest allowlist, path-traversal guard, per-buyer watermark, `no-store`. Gumroad delivers files today (gated route "dormant"); Moyasar card form exists; Stripe is env-var names only, zero code.
- **Curriculum prior art:** `lib/subscribe/tracks.ts` `WeekModule {n, en, ar, effort, dependsOn[]}` — 6 tracks × 4 weeks with dependency chains. Ready-made seed for Learning Lab module prerequisites.
- **Email:** nodemailer SMTP (lead alert + bilingual welcome) + Telegram; `lib/email/resend.ts` on main. One Vercel cron (meeting-reminders).
- **Dark-shipping:** middleware 404s `/admin /debug /memory /flags /lab` in production; Vercel Flags SDK wired but only ever used as a secret-holder (never a UI gate).
- **What does NOT exist (greenfield):** user auth/sessions (none — no Supabase Auth, no next-auth, no cookies-based identity), rate limiting (none anywhere), file uploads/storage (none), admin auth (`ADMIN_KEY` documented but dead), repo-wide docs discipline (no TODO/CHANGELOG/ADRs).

## 3. Recommended project location

**Build inside the primary clone (`G:\Dev-Hamzah-AlRamli\Dev-Hamzah-AlRamli`) as a new route
`app/learn/`** (collision-free — verified absent) with docs in `docs/learning-lab/` and a new
`OS_APPS` entry (dual naming per the architecture doc, e.g. `academy.exe` / "Learning Lab" —
final name is a Phase 1 decision). Do NOT use `/lab` — it exists and is production-blocked
by middleware. Do NOT build in the `G:\claude` clone.

## 4. Integration decision

Extend the existing site — do not create a separate app. Reuse deliberately:

**Reuse as-is:** OSPageShell page convention + `useLanguage()` bilingual pattern · Supabase
service-role + RLS-on/no-policy migrations (`supabase/migrations/0003_*.sql` next) · zod API
route pattern · `lib/vault/sign.ts` HMAC signer (generic, can sign any claim) · teaser-vs-full
free/paid split (matches "diagnose free, teach paid") · `WeekModule` type as module seed ·
SMTP/Resend/Telegram notification plumbing · middleware dark-ship + first real boolean flag.

**Do NOT reuse:** the working branch's lead-based vault entitlement (forgeable — origin/main
already hardened it via `hasConfirmedSale`; take main's version) · email-only identity for
stateful learner records · in-memory caches for lifecycle state · the production-pointing
Playwright config.

## 5. Risks and blockers (ranked)

1. **Dirty tree / three work streams.** 52M+15?? uncommitted on `feat/goodnbad-os-secure-slice`, with a written 4-commit plan (docs/IMPLEMENTATION-STATUS.md) not yet executed, and `docs/` entirely untracked. **Never `git add .` or `git add docs/` here** — Learning Lab files must be staged by explicit path. Strongly prefer landing the secure-slice commits first.
2. **Stale git refs.** Primary clone's `origin/main` is ~8+ commits behind true remote main; run `git fetch origin` before any merge math.
3. **No auth layer.** A 13-state payment-gated learner area requires real identity (recommend Supabase Auth magic links — `@supabase/supabase-js` is installed but **`@supabase/ssr` and ALL Auth wiring are net-new**; email plumbing exists). This is the single biggest Phase 1 design decision.
4. **Entitlement regression in flight.** Working branch would reintroduce the forgeable lead-based vault gate if merged as-is; reconcile with main's sales-gated `entitlement.ts`.
5. **No rate limiting anywhere** — and `/api/assistant` is an unauthenticated Anthropic proxy today (live cost-abuse vector). Add shared limiter infra; apply to new intake + existing routes.
6. **Weak CSP** (`unsafe-inline` + `unsafe-eval`, `img-src https:`), headers only in vercel.json. Amplifies any stored-XSS from learner uploads; harden before serving user content.
7. **Fail-open cron auth** (`CRON_SECRET` unset → authorized) and dead `ADMIN_KEY` config — fix as hygiene blockers before an admin area ships.
8. **Uploads are greenfield.** Design: private Supabase Storage bucket, server-issued signed upload URLs, size/MIME allowlists, serve back only via authed route with `Content-Disposition: attachment`.
9. **IA amendment required.** The locked sitemap (MASTER_BRIEF/ARCHITECTURE) has no learning route and forbids sprawl — adding `/learn` needs a deliberate amendment: OS name, taskbar entry, sitemap/robots.
10. **Unverifiable from repo:** Vercel prod env (CRON_SECRET, VAULT_SIGNING_SECRET, SUPABASE_*, FLAGS) and production-branch setting — confirm in dashboard before relying on them.
11. **E2E can't test local work** (baseURL = production, no webServer) — add a localhost Playwright project before Phase 3 TDD.

## 6. Proposed implementation phases

- **Phase 1 — Product spec** (docs only): PRD, intake-form schema (zod-first), 13-state lifecycle → Supabase table design (`learning_requests`, `learning_modules`, `learning_events` audit trail), notification matrix, role/permission matrix, pricing model skeleton, auth decision (magic links), IA amendment (route + OS name), MVP cut per USAGE-RULES.md.
- **Phase 2 — UX prototype:** `/learn` page composition in the OS shell (package cards, journey, integrity commitment, FAQ, CTA), multi-step conditional intake form states, learner status view, admin queue view, AR/EN + RTL passes, a11y review. Ship dark behind middleware prefix + boolean flag.
- **Phase 3 — MVP build (TDD):** migration 0003 + service-role data access, intake API (zod, rate-limited), preliminary assessment (rules-based), admin review + manual quote + payment confirmation, gated learner area (Supabase Auth), step-release, submission/feedback loop, email notifications with dedup, audit trail.
- **Phase 4 — Verification:** vitest units (follow tests/security.test.ts style), access-control + upload-security + notification-dedup + timezone tests, localhost e2e, RTL/LTR visual checks, production build, evidence in docs/evidence/.

**Success gate (MVP):** one real learner completes
diagnostic → quote → verified payment → step → feedback → completion, with every state
transition recorded in the audit trail and zero protected content released pre-payment.
