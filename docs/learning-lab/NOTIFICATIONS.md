# Learning Lab — Notification Matrix (Phase 1, v2)

> Status: v2 after adversarial review · 2026-07-24
> MVP channels: **email** (shared SMTP transport extracted to `lib/email/smtp.ts`) +
> **owner-side Telegram** (existing bot — in-scope per SPEC amendment 2026-07-24; learner-facing
> chat channels remain future) + an event record in `learning_events`.
> **MVP is synchronous-only: every notification fires from a state transition. There is NO
> cron, no digests, no nudges, no suppression machinery** — those moved to ROADMAP along with
> deadline sweeps and T-1h session reminders (undeliverable on the single daily Vercel cron).
>
> **Actor rule (authoritative wording):** never send the actor an action-REQUEST notification;
> receipts/confirmations to the actor are permitted. (Rows marked ® are receipts.)

## 1. Event matrix (11 events, all transition-triggered)

| # | Event | Trigger (actor) | → Learner email | → Owner email | → Owner TG | Deadline shown (source column) |
|---|---|---|---|---|---|---|
| 1 | Request received | learner submits | ✓® **verify/sign-in link ONLY** — no assessment content, no PII echo, no reference (unverified address); assessment appears on-screen + in portal | ✓ full summary + readiness | ✓ short | quote SLA (POLICIES §4) |
| 2 | Clarification requested | owner | ✓ questions + portal link | — | — | reply-by (owner-set, in message) |
| 3 | Learner action ping (generic) | learner: clarification reply / quote decline+reason / submission | — | ✓ | ✓ | — (capped 5/request/day then batch) |
| 4 | Quote issued | owner | ✓ scope + price/assessment + portal accept/decline + payment instructions | — | — | `quote_expires_at` |
| 5 | Payment evidence received | learner | ✓® "being verified — no status change until verified" | ✓ verify prompt — evidence rendered as **untrusted quoted learner claim** | ✓ same | verification SLA |
| 6 | Payment verified / accepted | owner | ✓ welcome + portal onboarding | — | — | `delivery_due_at` |
| 7 | Payment evidence insufficient | owner | ✓ what's missing | — | — | — |
| 8 | Scope rejected / unsupported | owner | ✓ respectful decline + legitimate alternative | — | — | — |
| 9 | Step released | owner | ✓ step title + portal link (never content in email) | — | — | `learning_modules.due_at` |
| 10 | Feedback delivered | owner | ✓ portal link | — | — | next due (`due_at`/`feedback_due_at`) |
| 11 | Completed | owner | ✓ summary + retained-record note + feedback ask | — | ✓® | — |

Refund recorded and cancellation notices reuse the generic templates of rows 7/8 style with
their own event rows (`refund_recorded`, `status_change→cancelled`) — counterpart notified,
actor gets a receipt.

## 2. Message anatomy

Event type · recipient · public reference `GNB-LL-xxxx` (**display only — never an auth
factor**; omitted entirely from row 1's unverified email) · learner name (except row 1) ·
required action (one sentence) · deadline in **recipient's timezone** from the named source
column · ONE link (portal) · bilingual per learner `language` (owner messages EN) ·
plain-text first, minimal HTML with `escapeHtml` on every learner-supplied string.

**Telegram rendering:** `parse_mode` disabled (or fully escaped); learner-supplied strings
visually marked as quoted untrusted input; owner templates state that payment evidence is a
learner claim, never a verification. Owner-side Telegram processing is disclosed in the
privacy copy (POLICIES §2).

Never include: module content, quote internals before `quoted`, secrets, other learners'
data, internal readiness notes, assessment content in any pre-verification email.

## 3. Delivery, retry, dedup (append-only protocol)

- **Dedup:** `dedup_key = {event}:{request_id}:{cycle}`; claim = INSERT the
  `notification_sent` intent row — the partial unique index on `learning_events.dedup_key`
  blocks double-fire. Then send.
- **Failure:** APPEND a `notification_failed` row (dedup_key in meta). No UPDATE/DELETE ever
  touches `learning_events`. One immediate retry; after that the owner re-sends manually from
  the event log (volume is single-digit; a retry sweeper is ROADMAP).
- **Fail-soft:** a send failure never blocks the state transition.
- **Bounces:** SMTP has no bounce webhook — no automated suppression in MVP; the owner reacts
  to bounce mail manually.

## 4. Testing requirements (Phase 4)

Unit: dedup insert-claim idempotency (double-fire sends once) · actor rule as worded above
(receipts allowed, action-requests to actor forbidden) · timezone rendering · bilingual
template selection · fail-soft on SMTP error (transition still commits) · Telegram escaping
of hostile learner strings. Integration: every transition in DATA-MODEL §3 fires exactly its
matrix row and nothing else — the matrix above is complete and matches the transition matrix
1:1.
