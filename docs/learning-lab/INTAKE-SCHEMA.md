# Learning Lab — Intake Form Schema & Self-Checks (Phase 1, v2)

> Status: v2 after adversarial review · 2026-07-24 · Target: zod schemas in `lib/learn/intake.ts`,
> consumed by the multi-step form on `/learn` and `POST /api/learn/request`.
> Pattern: `app/api/subscribe/lead/route.ts` (zod safeParse, 400/422, bounded fields,
> escapeHtml, fail-soft channels) + durable rate limiting (DATA-MODEL §2 counters table).
> **MVP intake is TEXT-ONLY — no file uploads before authentication** (kills the anonymous
> signed-URL abuse surface and the upload-before-request_id design hole). Files come later,
> inside the authenticated portal.

## 1. Form flow (multi-step, adaptive)

```
Step 0  Package select (3 cards; pre-selectable via ?pkg=)  + "Not sure which?" 2-question helper
Step 1  Foundation — who you are
Step 2  Goal — what and why
Step 3  Conditionals — per track and package (§3)
Step 4  Terms & consents (POLICIES §5; checkboxes link to policy section anchors)
Step 5  Review → submit
```

One screen per step on mobile; progress indicator; per-step validation; state client-side
(no server draft persistence — the client-side form IS lifecycle state `draft`); full server
re-validation on submit. AR/EN labels via `t(ar, en)`, `dir` per language, bilingual errors.

## 2. Foundation schema

| Field | Type / bound | Required | Notes |
|---|---|---|---|
| `fullName` | string 2–120, trimmed | ✓ | |
| `email` | email ≤254, lowercased | ✓ | verified by first magic-link sign-in (double-opt-in): **screening starts only after verification** |
| `timezone` | string | ✓ | validated via `new Intl.DateTimeFormat('en',{timeZone:v})` try/catch → normalized canonical; `supportedValuesOf` used only for the client picker |
| `country` | ISO-3166 alpha-2 | ○ | optional — nothing consumes it; timezone covers scheduling |
| `language` | enum `en · ar · bilingual` | ✓ | |
| `ageRange` | enum `under16 · 16_17 · 18_24 · 25_34 · 35_44 · 45_plus` | ✓ | never DOB |
| `guardianEmail` | email, ≠ `email` | when `under16`; when `16_17` + mentorship | owner verifies manually (POLICIES §2) |
| `roleLevel` | enum + free text ≤120 | ✓ | |
| `package` | enum (3) | ✓ | |
| `track` | enum `fundamentals · programming · cybersecurity · data_science · ai_automation · university · custom` | ✓ | `custom` → free text ≤200 + `manual_review` |
| `topic` | string 3–300 | ✓ | |
| `experienceLevel` | enum `beginner · intermediate · advanced` | ✓ | |
| `desiredOutcome` | string 10–1000 | ✓ | |
| `weeklyHours` | int 1–40 | ✓ | |
| `targetDate` | ISO date **≥ today+1d**, ≤ today+1y | ○ | schema rejects only impossible dates; sub-runway dates route to the owner as `deadline_unfeasible` — never auto-rejected (USAGE-RULES) |
| `explanationStyle` | enum, default `mixed` | ○ | |
| `accessibility` | string ≤500 | ○ | |
| `hp_website` | honeypot, empty | — | silent 200 discard |

Removed vs v1: `contactPreference` (hardcoded `email` server-side — a required enum with one
legal value is pure friction), file step, disposable-domain denylist (magic-link verification
+ manual payment verification already guarantee a real identity).

## 3. Conditional blocks

### track = cybersecurity
`focusArea` enum (defensive · offensive · governance · dfir · soc · networking · general) ·
`labExperience` (none · guided · own_lab) · `osFamiliarity` multi · `certTarget` ≤120 ○ ·
`labAuthorization` boolean — **false does NOT block submission**: the form offers theory-only
scope; a hands-on request without authorization still submits and routes to the owner as
readiness `integrity_concern` with a theory-only counter-offer (POLICIES §6).

### track = data_science
`mathLevel` (basic · school · university · advanced) · `pythonOrR` (none · python · r · both) ·
`datasetAvailable` boolean · `desiredOutput` (analysis · dashboard · model · concepts).

### track = programming
`preferredLanguage` ≤60 · `existingCode` boolean · `targetProject` ≤300 ○ ·
`devEnvironment` ≤120 ○ · `mainBlockers` ≤500.

### track = university (or package = academic_sprint)
`institutionLevel` (school · diploma · bachelor · master · phd) · `module` ≤200 ·
**`briefText` string 30–3000 required** (files can be shared after review — no upload at
intake) · `rubricProvided` boolean · `deadline` ISO date required, ≥ today+1d ·
`citationStyle` enum · `permittedAiUse` enum (unknown · prohibited · cited_allowed · allowed)
— `prohibited` → `integrity_concern` scope-limited to concept teaching; `unknown` →
clarification · `workDone` ≤2000 · `helpNeeded` multi.

### package = private_mentorship
`sessionGoal` 10–500 · `preferredDates` 1–3 ISO dates ≥ today+1d (unconfirmed input; the
confirmed time is owner-set `session_at`) · `timeWindows` multi · `questions` ≤1000 ○ ·
`recordingConsent` enum (granted · declined) · `bundleInterest` enum.

### package = guided_path
Track conditionals + the 3 per-track self-check questions defined in **ASSESSMENT.md**
(question text, options, and scoring rules are a Phase 1 deliverable there, not "form copy").

## 4. Self-checking foundation → readiness result

Server-side on submit, recorded as one `intake_checks` event (meta = results):

1. zod schema validation → 422 field errors (only impossible values fail here).
2. Email shape valid (no denylist).
3. Runway: `targetDate`/`deadline` vs package minimums (guided 7d · sprint 3d · mentorship 1d)
   → below minimum maps to readiness `deadline_unfeasible` (owner may rush-quote per POLICIES §4).
4. Timezone valid + normalized.
5. Outcome understandable (length + not-only-stopwords) → `needs_clarification`.
6. Package↔request match (academic brief + guided_path → suggest sprint) → `needs_clarification`.
7. University: brief + deadline + permittedAiUse present; `prohibited` → `integrity_concern`;
   missing rubric → auto-drafted clarification question.
8. Level consistency (self-stated vs conditional answers, rule table in ASSESSMENT.md) →
   `manual_review`.
9. Cybersecurity: `labAuthorization=false` + hands-on scope → `integrity_concern`.
10. Capacity: count of non-terminal requests ≥ `MAX_ACTIVE_REQUESTS` (constant in
    `lib/learn/config.ts`) → `manual_review` with capacity note. (One COUNT query — no
    hours-math scheduling engine.)
11. Result: `ready_for_quote` iff all pass; otherwise the first failing category maps to its
    readiness value. **Never auto-reject** — everything routes to the owner.

## 5. Preliminary assessment (the ONLY substantive free artifact)

Rules-based, rendered from **ASSESSMENT.md** assets: per-track self-check questions + scoring,
level-estimation table (self-stated × answers, incl. the §4.8 inconsistency case), gap-area
template library (EN+AR), duration-band formula, and one fully rendered example per language.
**Anti-canned requirement:** the rendered text must echo ≥2 learner-specific values (topic,
desired outcome, target date) inside the analysis so it reads diagnosed, not templated.

Shown on the submit-confirmation screen and in the portal after sign-in. **Never emailed
before verification** — the confirmation email carries only the verify/sign-in link
(NOTIFICATIONS row 1). Excludes: module list, sequence, resources, solution content.

## 6. API contract

`POST /api/learn/request` — `runtime="nodejs"`, `force-dynamic`.
Order: `learningLab` flag check (404 when off — **the flag is the kill switch for the API
surface too**; middleware dark-ship covers only pages) → durable rate limit (per-IP AND
per-email: e.g. 5/IP/hour, **2 unverified requests per email per 24h** — backed by
`learning_rate_counters`, never in-memory) → honeypot → zod safeParse (400/422) →
self-checks → `learn_submit_request()` RPC (row at `submitted` + event, one DB transaction) →
fail-soft notifications → `{ok, reference, assessment}` (reference is display-only).

Portal actions (accept/decline quote, clarification reply, evidence, submissions) are server
actions authenticated per DATA-MODEL §4, each rate-limited per-request-per-day so a hostile
learner cannot flood the owner's verify channel (cap owner pings at 5/request/day, then batch).
