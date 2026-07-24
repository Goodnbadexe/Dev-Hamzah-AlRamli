# Learning Lab — Data Model & Lifecycle (Phase 1, v2)

> Status: v2 after adversarial review (61 findings applied) · 2026-07-24
> Target: `supabase/migrations/0003_learning.sql`
> **Precondition:** `git fetch origin` + merge/rebase main (brings `0002_sales.sql`) BEFORE
> authoring 0003 — verify `supabase/migrations/` contains 0001+0002 first.
> House pattern: service-role-only access via `lib/supabase/server.ts`, RLS ON, no anon
> policies, `isSupabaseConfigured()` graceful degrade. No browser Supabase data client.

## 1. Entities (4 tables + 1 utility)

```
learning_requests 1──n learning_events       (append-only audit + notification log)
learning_requests 1──n learning_modules      (the path; created after `accepted`)
learning_modules  1──n learning_submissions  (learner work + owner feedback; file paths inline)
learning_requests n──1 auth.users            (user_id set at first magic-link sign-in)
learning_rate_counters                       (fixed-window rate-limit store, cross-instance)
```

No `learning_files` table: learner files live in the private `learner-files` bucket with the
path stored on `learning_submissions.bucket_path`; Supabase Storage object metadata is the
registry. (A registry table returns only when a real scanner integration exists — ROADMAP.)

## 2. Tables

### `learning_requests`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk default gen_random_uuid() | public reference = `GNB-LL-` + short id — **display only, NEVER an auth factor** |
| `created_at` / `updated_at` | timestamptz | `updated_at` via trigger |
| `user_id` | uuid null → auth.users | set at first magic-link sign-in where the session's **verified** email equals `email` (case-insensitive) |
| `email` | **text** not null | lowercased at write (INTAKE lowercases); index on `lower(email)`. NOT citext — extension isn't enabled in this project (0001 enables only pgcrypto); comparisons use `lower()` |
| `email_verified_at` | timestamptz null | set at first successful magic-link sign-in; **screening does not start until set** |
| `full_name` | text not null | bounded |
| `package` | `ll_package` enum | `guided_path · academic_sprint · private_mentorship` |
| `track` / `topic` | text | |
| `language` | `ll_language` enum | `en · ar · bilingual` — module content is authored in this language (§2 modules) |
| `country` | text null | optional (conversion cost > value) |
| `timezone` | text | validated server-side via `new Intl.DateTimeFormat('en',{timeZone:v})` try/catch, then normalized to canonical name (strict list-membership rejects valid aliases like Asia/Calcutta) |
| `age_range` | text | bracket only, never DOB |
| `guardian_email` | text null | required at intake when `age_range='under16'`, and for `16_17`+mentorship; must differ from `email`; owner verifies manually (POLICIES §2) |
| `role_level` | text | |
| `experience_level` | `ll_level` enum | self-stated |
| `assessed_level` | `ll_level` null | owner-set during screening |
| `desired_outcome` | text | |
| `weekly_hours` | smallint | |
| `target_date` | date null | schema floor: ≥ today+1d only (sub-runway dates route to owner as `deadline_unfeasible`, never auto-rejected) |
| `explanation_style` | text default `'mixed'` | optional at intake |
| `accessibility_notes` | text null | |
| `answers` | jsonb | conditional diagnostic answers per track |
| `status` | `ll_status` enum | §3 |
| `readiness` | `ll_readiness` enum null | `ready_for_quote · needs_clarification · manual_review · unsupported · integrity_concern · deadline_unfeasible` |
| `quote_amount_cents` / `quote_currency` / `quote_scope` | int/text/text null | |
| `quote_issued_at` / `quote_expires_at` | timestamptz null | expiry 7d; return ≤14d re-opens same quote unless scope changed (POLICIES §4) |
| `decline_reason` | text null | structured learner decline: `price · scope · timing · other` + free text |
| `payment_evidence` | text null | learner-supplied reference — **a claim, never a verification**; rendered as untrusted quoted input everywhere |
| `payment_verified_at` / `payment_verified_by` | timestamptz/text null | owner-only action path |
| `refund_amount_cents` / `refund_evidence` / `refunded_at` / `refunded_by` | int/text/timestamptz/text null | owner-only, mirrors payment_verified_* |
| `delivery_due_at` | timestamptz null | owner-set promise (SLA-derived); shown in notifications |
| `session_at` | timestamptz null | mentorship: confirmed session datetime (intake `preferredDates` are unconfirmed input in `answers`) |
| `consents` | jsonb | `{integrity, privacy, communication, recording?, lab_authorization?, guardian?}` each `{accepted, at, version}`; `guardian` additionally `{email}` and is set by an **owner action** after manual guardian verification, not at intake |
| `archived_at` | timestamptz null | |

### `learning_events` — append-only audit trail + notification log
| Column | Type | Notes |
|---|---|---|
| `id` | bigint identity pk | |
| `request_id` | uuid fk, indexed | |
| `at` | timestamptz default now() | |
| `actor` | `ll_actor` enum | `learner · owner · system` |
| `event` | text | `status_change · note · notification_sent · notification_failed · module_unlocked · feedback_delivered · file_uploaded · refund_recorded · session_no_show · email_corrected · intake_checks` |
| `from_status` / `to_status` | `ll_status` null | for `status_change` |
| `dedup_key` | text null | **partial unique index** `unique where dedup_key is not null` (a plain UNIQUE on nullable text is not equivalent) |
| `meta` | jsonb | bounded; no secrets/file contents; `on_behalf_of:'learner'` when owner transcribes an email reply |

**Append-only, and it stays append-only:** the notification protocol never updates rows.
Claim-then-send = INSERT the `notification_sent` intent row (partial unique index on
`dedup_key` blocks double-fire) → attempt send → on failure APPEND a `notification_failed`
row referencing the dedup_key in meta. Owner re-sends manually with a new suffixed key.
(Design precedent only: the unmerged `feat/weekly-drip` branch's `drip_sends` — that code is
NOT on this branch; implement fresh.)

### `learning_modules`
| Column | Type | Notes |
|---|---|---|
| `id` uuid pk · `request_id` fk indexed · `seq` smallint unique-per-request | | ordering is **seq only** — no dependency graph (unlock is an owner judgment per USAGE-RULES; `depends_on` returns with auto-unlock, ROADMAP) |
| `title` / `objective` | text | authored in the engagement's `language` (bilingual engagements: owner authors mixed; terminology-consistency is an authoring rule, not schema) |
| `est_minutes` | int | |
| `content_md` | text null | released teaching material |
| `state` | `ll_module_state` enum | `locked · unlocked · submitted · feedback · done` |
| `due_at` / `feedback_due_at` | timestamptz null | owner-set; displayed in portal + emails |
| `unlocked_at` / `completed_at` | timestamptz null | |

### `learning_submissions`
| Column | Type | Notes |
|---|---|---|
| `id` uuid pk · `request_id` fk · `module_id` fk null | | null module = general question / clarification reply |
| `at` timestamptz · `kind` enum `answer · file · question · revision` | | `revision` realizes SPEC's "Revision available" (§3 mapping) |
| `body` | text null | bounded; escaped on render |
| `bucket_path` | text null | `requests/{request_id}/{uuid}.{ext}` — server-generated names only |
| `feedback` / `feedback_at` | text/timestamptz null | owner-written |

### `learning_rate_counters` — durable rate-limit store
`key text pk` (e.g. `ip:{hash}:{window}` / `email:{lower}:{window}`) · `count int` ·
`window_start timestamptz`. Fixed-window counters via one upsert RPC. **In-memory per-instance
limiting does NOT satisfy the rate-limit requirement on serverless** — this table (no new
dependency) or Upstash Redis are the acceptable backends.

### Files & storage (no table)
Private bucket `learner-files`, created with bucket-level `file_size_limit` (10 MB) and
`allowed_mime_types` matching the allowlist — enforcement at the storage layer, not only at
URL issuance. Uploads exist **only post-auth in the portal** (no intake uploads — see
INTAKE-SCHEMA v2). After upload the server verifies the object (size, magic-bytes vs claimed
extension) before writing the submission row; mismatch → object deleted + event. Downloads
only via an owner/learner-authenticated route serving `Content-Type: application/octet-stream`
+ `Content-Disposition: attachment` + `X-Content-Type-Options: nosniff` — never the stored MIME.

## 3. Status lifecycle (`ll_status`)

USAGE-RULES' 13 lifecycle states + 3 terminal admin states = 16 enum values:

```
draft* → submitted → screening ⇄ clarification_required
        → quoted → awaiting_payment → payment_verification → accepted
        → plan_preparation → in_progress ⇄ awaiting_learner ⇄ feedback
        → completed
quoted/awaiting_payment/payment_verification → rejected   (owner, decline policy)
screening → rejected                                       (owner)
any non-terminal → cancelled                               (owner/learner, policy)
completed | cancelled | rejected → archived                (OWNER-triggered; manual retention)
```
\* `draft` is **reserved** — rows are INSERTed at `submitted` (intake state is client-side;
the client-side form IS USAGE-RULES state 1). The enum keeps the value for future resumable
forms; no code path produces it in MVP.

### SPEC display-label mapping (canonical enum is THIS table)

| SPEC §Admin label | Canonical `ll_status` |
|---|---|
| Under review | `screening` |
| Awaiting payment | `awaiting_payment` (+ `payment_verification` while evidence is checked) |
| Clarification required | `clarification_required` |
| Plan preparation | `plan_preparation` |
| Awaiting learner submission | `awaiting_learner` |
| Feedback preparation | `feedback` |
| Revision available | **retired as a status** — represented by `learning_submissions.kind='revision'` inside the `feedback ⇄ awaiting_learner` loop |
| Draft/Submitted/Accepted/In progress/Completed/Cancelled/Rejected/Archived | same-named values |

### Transition matrix (complete — Phase 4 tests assert exactly this)

| From → To | Actor | Guard |
|---|---|---|
| submitted → screening | system | `email_verified_at` set (first magic-link sign-in) |
| screening → clarification_required | owner | |
| clarification_required → screening | learner (portal) or owner (`on_behalf_of`) | reply received |
| screening → quoted | owner | readiness `ready_for_quote`; quote fields set |
| screening → rejected | owner | never automatic |
| quoted → awaiting_payment | **learner (portal)** | authenticated accept; `quote_expires_at > now()` |
| quoted → screening | learner (portal) | decline/change-request with `decline_reason` |
| quoted → screening | system | quote expired AND learner returns after 14d / scope changed |
| awaiting_payment → payment_verification | **learner (portal)** | evidence reference submitted; idempotent (one active evidence slot; resubmit overwrites + one event, no duplicate owner ping) |
| payment_verification → accepted | **owner only** | verified against provider/admin evidence — never on learner claim |
| payment_verification → awaiting_payment | owner | evidence insufficient |
| quoted/awaiting_payment/payment_verification → rejected | owner | decline policy |
| accepted → plan_preparation → in_progress | owner | plan approved |
| in_progress → awaiting_learner | owner | step released |
| awaiting_learner → feedback | learner (portal) | submission received |
| feedback → in_progress | owner | feedback delivered, next step unlocks |
| feedback → awaiting_learner | owner | revision requested |
| in_progress/feedback → completed | owner | deliverables fulfilled |
| any non-terminal → cancelled | owner/learner | POLICIES §4 (incl. dormancy lapse) |
| terminal → archived | **owner** | manual, per retention schedule (automation = ROADMAP) |

### Hard invariants

1. **All transitions execute DB-side.** supabase-js has no client transactions; every status
   change goes through a Postgres function `learn_transition(request_id, from, to, actor, meta)`
   called via `supabaseAdmin().rpc()`, which performs the conditional write
   (`UPDATE … SET status=to WHERE id=? AND status=from` + expiry guards) and INSERTs the
   `status_change` event **in the same DB transaction**; 0 rows affected = rejected transition
   surfaced to the actor. Intake uses `learn_submit_request(payload)` similarly (row + event).
   Raw `.insert()/.update()` on `status` is forbidden in application code.
2. Module `content_md`/`unlocked` only when status ≥ `accepted` AND `payment_verified_at` set.
3. `payment_verified_at` / `refunded_at` settable only via owner-authenticated actions.
4. Learner-actor transitions require an authenticated portal session whose verified email
   matches the request (or `user_id`). **The public reference is never an authentication factor.**
5. Learner-visible quote data appears only at `quoted` or later; assessment content is shown
   in the portal/confirmation screen, never emailed before verification.

## 4. Access control & roles

| Role | Mechanism | Can |
|---|---|---|
| Anonymous | rate-limited public routes | submit intake; read public page |
| Learner | Supabase Auth **magic link** (email OTP); cookie session via `@supabase/ssr` (**net-new dependency** — not installed; add `npm i @supabase/ssr`, new `lib/supabase/auth.ts` cookie-session client kept separate from the service-role client); server compares the session's verified email (`supabase.auth.getUser()`) to `learning_requests.email`, sets `user_id` + `email_verified_at` on first match | **from `submitted` onward:** view own status + assessment; reply to clarification; accept/decline quote; submit payment evidence. **From `accepted`:** modules, submissions, file upload, refund request |
| Owner | magic link + `requireOwner()`: server-side session validation, verified-email claim, normalized (trim+lowercase) **exact** membership in `LEARN_OWNER_EMAILS` env — **checked at the top of EVERY owner server action and route handler; page-level gating is never sufficient** (server actions are independently invokable HTTP endpoints) | all owner transitions + the 5 admin verbs (PRD §8) |
| System | service-role in server code | `submitted→screening` on verify; quote-expiry handling |

**Auth-hardening launch checklist:** Supabase project has ONLY email OTP/magic-link enabled —
password and OAuth sign-ups disabled (otherwise an attacker mints a session for an owner email
without inbox control). Remove dead `ADMIN_KEY` from `.env.example` in the same change.
**Email correction:** owner-mediated only — owner edits `email`, which nulls
`user_id`/`email_verified_at`, invalidates outstanding portal access, and logs `email_corrected`.

RLS: all tables RLS ON, zero policies (service-role pattern); every access is a server
route/action enforcing this matrix in code, unit-tested. Any future browser data client
requires per-table policies first.

## 5. Retention (manual in MVP)

POLICIES §3 is the written schedule; execution is **owner-run** (documented SQL script in
docs/, not a cron): anonymize PII 12 months after terminal state, delete storage objects,
keep anonymized rows. `archived` is an owner-triggered transition. Notification-log events
may be aggregated by the same script. Automation: ROADMAP.

## 6. Migration plan

`0003_learning.sql`: enums → tables (FKs; indexes on `(status)`, `lower(email)`,
`(request_id)`) → `updated_at` trigger → partial unique index on `learning_events.dedup_key`
→ `learn_submit_request()` + `learn_transition()` functions → append-only guard on events
(revoke UPDATE/DELETE) → comment block documenting the RLS decision, matching 0001/0002 style.
No citext. No seed data.
