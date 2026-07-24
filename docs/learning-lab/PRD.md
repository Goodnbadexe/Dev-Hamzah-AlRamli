# Learning Lab — Product Requirements Document (Phase 1, v2)

> Status: v2 after adversarial review (5 lenses, 61 findings applied) · 2026-07-24
> Governed by [USAGE-RULES.md](./USAGE-RULES.md) (wins on conflict), grounded in
> [PHASE0-EVIDENCE.md](./PHASE0-EVIDENCE.md). Companions: [DATA-MODEL.md](./DATA-MODEL.md),
> [INTAKE-SCHEMA.md](./INTAKE-SCHEMA.md), [NOTIFICATIONS.md](./NOTIFICATIONS.md),
> [POLICIES.md](./POLICIES.md), ASSESSMENT.md (to be authored — see §12).

## 1. Decisions locked (owner-approved 2026-07-24)

| Decision | Value |
|---|---|
| Route | `/learn` public · `/learn/portal` auth-gated (noindex) · `/learn/admin` owner-only (noindex, separately dark-shipped) |
| OS identity | `OS_APPS` entry (full six-field shape — `desc` is required by the `OSApp` interface): `{ id: 'academy', osName: 'academy.exe', label: 'Learning Lab', route: '/learn', desc: 'Personalized technical learning — diagnose free, learn step-by-step after verified payment.', zone: 'window', code: '08' }`; `OSAppId` union gains `'academy'` |
| Auth | Supabase Auth **magic links** (email OTP). **Net-new machinery:** `@supabase/ssr` is NOT installed — add it, create `lib/supabase/auth.ts` (cookie-session client, separate from the service-role client), enable Email OTP in the Supabase dashboard, **disable password + OAuth sign-ups** |
| Sequencing | Secure-slice commits landed first (44d35eb…bcecfa2) |
| Money moment | **Portal opens at `submitted`** — first magic-link sign-in verifies the email; quote accept/decline, clarification replies, and payment evidence all happen inside the authenticated portal (no bearer-token quote pages, no email-transcription protocol as primary path) |

## 2. One-sentence product

A personalized technical-learning service where the platform diagnoses for free, the owner
quotes and approves manually, and paid learners receive a mentor-built path revealed one
verified step at a time.

**Positioning:** "Learn the system, not only the answer."
**Brand line:** "Think like a human. Execute like a machine. Teach like a professor."

## 3. Goals / non-goals

**Goals (MVP):** convert visitors into qualified verified requests; one owner queue with an
audit trail; step-by-step delivery behind verified payment; bilingual EN/AR + RTL; the whole
loop measurable from events.

**Non-goals (MVP):** autonomous curriculum generation · online payment processing · course
library/video/community · learner-facing chat channels · cron-driven reminder machinery
(deadline sweeps, nudges, digests — ROADMAP) · intake file uploads (portal-only, post-auth) ·
retention automation · full admin dashboard UI.

## 4. Audiences

Learners (beginner→advanced, EN/AR, any device) · Owner (sole instructor/approver) ·
recruiters/peers reading `/learn` as credibility evidence.

## 5. Packages

| # | Name | Boundary (card copy) | Cadence |
|---|---|---|---|
| 1 | **Guided Path** | your own skill goal on your own timeline | plan deadlines |
| 2 | **Academic Sprint** | you have a graded brief and a fixed institutional deadline | ~1 week, scope-configurable |
| 3 | **Private Mentorship** | you want it live, 1:1 | booked, timezone-aware |

A 2-question "Not sure which?" helper sits above the cards. Add-ons (extra revision cycle,
rush, extra session) and all terms: POLICIES §4. Academic Sprint carries the integrity
boundary on its card (POLICIES §1).

## 6. Core journeys

### Learner
1. `/learn` → value prop, packages + boundary copy, **teaching-style sample** (§7), example
   journey, integrity commitment, FAQ, indicative pricing (§10).
2. Intake (INTAKE-SCHEMA v2, text-only) → submit → confirmation screen shows the preliminary
   assessment; email carries the **verify/sign-in link only**.
3. First magic-link sign-in = email verified → `screening` begins. Portal shows status +
   assessment from here on.
4. Owner screens/clarifies (learner replies **in the portal**) → quote issued
   (scope + price + SLA + expiry) → learner **accepts, declines with reason, or requests
   changes in the portal**.
5. Accept → payment instructions → learner submits evidence reference (idempotent) →
   owner verifies against provider evidence → `accepted`. SLAs per POLICIES §4 are stated in
   each email.
6. Plan prepared → steps released one at a time; submissions ↔ feedback in the portal;
   revision cycle per POLICIES §4.
7. `completed` → summary + record retention note. Refunds/cancellation/dormancy per
   POLICIES §4.

### Owner
Notification → triage in `/learn/admin` (or Supabase dashboard **read-only + content drafting
ONLY** — never status/payment edits, which would bypass the audit trail) → the **five owner
verbs** (§8) drive everything. Every transition = audited event + its NOTIFICATIONS row.

## 7. Information architecture

- `OS_APPS` entry per §1 — **but the taskbar/mobile-nav rendering of it is gated by the
  `learningLab` flag** (OS_APPS is consumed directly by the production taskbar; an ungated
  entry would show a dead 404 button during the dark-ship window). Land the entry + the
  manual `sitemap.xml/route.ts` line (it's a hardcoded list, not OS_APPS-driven) in the
  launch commit.
- `/learn` page sections: hero → what you can study → how it works → **teaching-style
  sample** (a distinct, owner-authored mini-module EN+AR on a neutral topic, e.g. binary
  numbers, visibly walking USAGE-RULES progressive-teaching steps 1–8 in ≤5 min — NOT the
  same thing as the example journey) → three package cards + helper → example journey
  (process narrative) → credibility → integrity commitment → FAQ → CTA/intake → `/learn/terms`
  policy copy (anchors for every consent checkbox).
- `/learn/portal` — from `submitted` (verified) onward; state-dependent content.
- `/learn/admin` — five-verb owner page; **its own entry in `PRODUCTION_BLOCKED_PREFIXES` +
  matcher, separate from `/learn`** (the `/admin` prefix does NOT cover it — prefix matching
  anchors at path start), with its own launch decision once the owner gate is verified in prod.

## 8. Admin surface (MVP)

Five owner server actions — **each begins with `requireOwner()`** (server-side session
validation + verified-email claim + normalized exact match against `LEARN_OWNER_EMAILS` env;
page-level gating is never sufficient because server actions are independently invokable):

1. `transition(requestId, from, to, meta)` — incl. quote issue/reject/cancel/archive
2. `issueQuote(...)` — sets quote fields + transition
3. `confirmPayment(...)` / `recordRefund(...)` — the money verbs
4. `releaseStep(moduleId)` — unlock + `module_unlocked` event + NOTIFICATIONS row 9
5. `saveFeedback(submissionId, ...)` — + event + row 10

Plus owner utilities: request-email correction (invalidates portal bindings, logs
`email_corrected`), guardian-consent recording. One thin page lists the queue and exposes
these verbs. Full dashboard: post-MVP. Remove dead `ADMIN_KEY` from `.env.example` when
`requireOwner()` ships.

## 9. Feature flags & dark shipping

- Boolean flag `learningLab` in `flags/index.ts` (`decide()` reads `LEARNING_LAB_ENABLED`).
- **Checked in three layers:** page (404 when off) · **every `/api/learn/*` handler and
  server action** (middleware matcher only covers pages — without in-route checks the API
  would be live while the page 404s) · OS_APPS taskbar rendering (§7).
- While building: `/learn` AND `/learn/admin` in `PRODUCTION_BLOCKED_PREFIXES` + matcher;
  `/learn` unblocked at launch, `/learn/admin` on its own decision; the flag remains the kill
  switch afterwards.

## 10. Pricing (skeleton)

Factors: prep time · teaching time · complexity · urgency · deliverables · review cycles ·
session duration · file volume · bilingual delivery · custom research.
**Commitment: publish owner-approved indicative "from" bands per package before public
launch** (`lib/learn/pricing.ts` flip) — "Request assessment" alone is the lowest-conversion
option for a zero-reputation service and USAGE-RULES explicitly permits starting prices.
Until bands are approved, cards must show the quote-turnaround SLA + the factor list so the
quote feels predictable.

## 11. Success metrics (MVP gate)

- 1 real learner completes: diagnostic → verified sign-in → quote → verified payment →
  ≥1 released step → submission → feedback → completion.
- 0 protected-content releases before `accepted` (asserted against `learning_events`).
- 100% of state transitions present in the audit trail (transitions only happen via
  `learn_transition()` — DATA-MODEL §3).
- Leading indicators from events: submitted-request volume · request→quote turnaround ·
  quote acceptance rate + decline reasons. (Intake completion rate is NOT claimable without
  server drafts — dropped; package-page→submit conversion via existing page analytics only.)

## 12. Build order (Phase 3 preview)

1. Merge/rebase main (brings 0002) → migration `0003_learning.sql` incl. `learn_transition()`
   / `learn_submit_request()` RPCs → `lib/learn/` data access.
2. **ASSESSMENT.md assets** (Phase 1 deliverable, before code): per-track self-check
   questions + scoring, level-estimation table, gap templates EN+AR, duration formula, one
   rendered example per language; anti-canned rule (echo ≥2 learner-specific values).
3. Intake API (flag check → durable rate limit per-IP + per-email → zod → checks → RPC).
4. `lib/email/smtp.ts` extraction + **bilingual email + assessment template pack** (AR copy
   owner-signed) + Telegram sender with parse_mode disabled.
5. `@supabase/ssr` + magic-link auth + `/learn/portal` (status, assessment, clarification
   replies, quote accept/decline, evidence submission; post-accept: modules, submissions,
   uploads with post-upload verification).
6. Owner verbs + `/learn/admin` thin page + `requireOwner()`.
7. `/learn` public page (flag-gated): sections per §7 incl. teaching-style sample +
   `/learn/terms` policy copy (EN+AR owner-signed) + Academic Sprint PDF template reference.
8. Minimal verified-deletion flow + retention script (docs) + incident runbook (POLICIES §2).
9. Playwright localhost project (current e2e only hits production) → Phase 4 suite.

## 13. Launch checklist (security-critical, from review)

- Supabase dashboard: ONLY email OTP enabled; password/OAuth sign-ups disabled.
- `LEARN_OWNER_EMAILS` set + `requireOwner()` verified in prod preview.
- Bucket `learner-files` created with size/MIME limits; download route serves
  attachment/octet-stream/nosniff.
- `ADMIN_KEY` removed from `.env.example`.
- Rate limits verified durable (counters table), incl. 2-unverified-requests/email/24h.
- OS_APPS entry + sitemap line land in the launch commit only; flag verified as kill switch.
- AR policy/consent copy owner-signed.
