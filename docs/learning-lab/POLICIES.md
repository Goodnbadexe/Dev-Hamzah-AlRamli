# Learning Lab — Policies (Phase 1, v2)

> Status: v2 after adversarial review · 2026-07-24
> These become the public policy copy and operational rules. **Arabic versions of all
> learner-facing policy and consent copy are a named Phase 1/2 deliverable with owner
> (native-speaker) sign-off — never machine-translated consent text.** Copy lives versioned
> in `lib/learn/policy-copy.ts` (EN/AR) and renders at `/learn/terms` (same page shell);
> every consent checkbox links to its section anchor.

## 1. Academic integrity policy

**Public copy (EN draft — AR version owner-signed before launch):**

> **I teach the system — I don't do your assessment for you.**
> The Academic Sprint exists to make you genuinely capable: I analyze your brief with you,
> explain the concepts it tests, help you plan the work, review and debug what YOU build, and
> prepare you to defend it. I will not write assessed work in your name, complete exams,
> fabricate research or citations, or submit anything on your behalf. If your institution
> restricts AI or external help, tell me in the intake — we'll work within those rules.
> You leave able to explain, reproduce, and apply what you learned. That's the point.

**Operational rules:**
- `permittedAiUse = prohibited` → scope limited to concept teaching detached from the graded
  artifact; noted on the quote.
- "Do it for me" requests → readiness `integrity_concern` → owner decides; the decline
  template offers the legitimate teaching alternative.
- The versioned intake consent (§5) is THE integrity record. The Academic Sprint PDF brief
  (`docs/learning-lab/templates/academic-sprint-brief-template.pdf`) is an optional unsigned
  working document — no second-signature flow.
- Owner never ghost-writes: feedback attaches to the learner's own submissions in
  `learning_submissions`.

## 2. Privacy, data protection & minors

- **Minimal collection:** intake fields only; age as bracket, never DOB. No card data ever —
  only a transaction reference (a learner claim until owner-verified).
- **Storage:** files in the private `learner-files` bucket (bucket-level size/MIME limits,
  post-upload verification, attachment-only authenticated downloads — DATA-MODEL §2); records
  in Supabase with RLS ON; secrets in env vars only.
- **File handling (truthful copy):** "Files are handled in isolated environments; automated
  malware scanning is added as available." Operational rule: the owner opens ALL learner
  archives/notebooks/executables only in an isolated environment, regardless of any status,
  and never downloads learner files via the Supabase dashboard — only through the app's
  authenticated route.
- **AI processing:** backed by a named operational checklist (approved tools list with
  owner-verified training-opt-out settings, reviewed on every provider change) — kept in this
  repo alongside the policy copy. Learner content never goes into unlisted tools.
- **Owner-side Telegram:** operational alerts (names, request summaries, payment-evidence
  claims) pass through Telegram to the owner only — disclosed here in the privacy copy.
- **Minors (MVP — deliberately manual):** `under16` → readiness `manual_review`, screening
  held until the owner verifies guardian consent out-of-band using the collected
  `guardianEmail` (must differ from learner email); the owner records it via an admin action
  into `consents.guardian {email, accepted, at, version}`. `16_17` + live sessions requires
  guardian contact on file. Recordings of minors: never. Public copy promises exactly this:
  "we require verifiable guardian consent before proceeding."
- **Access/deletion:** verified via magic-link sign-in to the record's email; deletion
  honors lawful retention by anonymizing (DATA-MODEL §5). A minimal verified-deletion flow
  (sign-in → request → owner executes the documented script) is part of the MVP build order.
- **Breach response:** notification to affected learners within 72h **of owner confirmation
  of a breach**; a one-page incident runbook (detect → contain → assess → notify → log as a
  system event) ships with Phase 3 docs — the 72h promise stands on that defined trigger.

## 3. Retention schedule (written policy; executed manually in MVP)

| Data | Kept | Then |
|---|---|---|
| Active engagement records | life of engagement | → terminal state |
| Terminal records | 12 months | anonymize PII, delete files (owner-run documented script) |
| Payment/refund evidence refs | 5 years (accounting) | delete |
| Audit `status_change` events | life of record | anonymized with record |
| Notification-log events | 14 days detailed | may be aggregated by the same script |
| Session recordings (consented, never minors) | 90 days, learner-downloadable | delete |

`archived` is an owner-triggered transition; retention automation is ROADMAP.

## 4. Commercial terms (skeleton — owner finalizes amounts)

- **Service SLAs (shown in the relevant emails):** quote within **2 business days** of
  screening start; payment verified within **24h** of evidence; plan delivered within the
  window stated in the acceptance email (`delivery_due_at`). These SLA timestamps are what
  "promised date" means anywhere it appears.
- **Quotes** valid 7 days (`quote_expires_at`). Learner returning within 14 days re-opens the
  SAME quote unless scope changed; later returns re-enter screening.
- **Decline/renegotiate:** the learner can decline a quote in the portal with a structured
  reason (`price · scope · timing · other`) — this routes back to screening for a possible
  re-quote and the reason is recorded (`decline_reason`) so pricing learns from losses.
- **Cancellation:** free before `accepted`. After: unstarted milestones refundable minus
  itemized preparation time; delivered steps non-refundable.
- **Refunds (mechanism, not just math):** learner requests via portal (post-payment) or email;
  owner decides within **5 business days**; execution recorded with
  `refund_amount_cents / refund_evidence / refunded_at / refunded_by` + a `refund_recorded`
  event + confirmations to both sides. Disputes resolve against the audit trail.
- **Dormancy lapse:** if a paid engagement sits in `awaiting_learner` for **4 weeks** with no
  response after reminders, the owner may close it (`cancelled`) with unstarted milestones
  settled under the cancellation math, after a final 14-day written notice. (A dedicated
  `paused` state is ROADMAP.)
- **Rescheduling (mentorship):** free ≥24h before; <24h = one free exception, then the session
  counts as delivered. Owner-initiated reschedules always free + priority slot.
- **No-shows:** learner absent 15 minutes in = session delivered (one first-time exception,
  mirroring the <24h grace); owner absent = full session credit + priority rebooking. Either
  case logs a `session_no_show` event with the actor.
- **Revisions:** Guided Path includes one revision cycle per module; Academic Sprint as
  quoted; extras are quoted add-ons.
- **Rush:** below-runway target dates are owner-quoted with a rush factor or declined as
  `deadline_unfeasible` — never auto-rejected.
- **Bundles / add-ons:** mentorship 3-pack / 5-pack; add-ons = extra revision cycle, rush
  delivery, extra session (`lib/learn/pricing.ts` configuration).

### Package boundaries (card copy — resolves the Guided Path / Academic Sprint blur)

> **Academic Sprint** — you have a graded brief and a fixed institutional deadline.
> **Guided Path** — your own skill goal on your own timeline.
> **Private Mentorship** — you want it live, 1:1.

A 2-question "Not sure which?" helper sits above the cards (has brief? wants live?).

## 5. Consent records

`consents` jsonb, each key `{accepted, at, version}` (guardian adds `{email}`):

| Key | Required | Covers | Set by |
|---|---|---|---|
| `integrity` | all packages | §1 | learner at intake |
| `privacy` | all | §2–3 | learner at intake |
| `communication` | all | transactional email lifecycle | learner at intake |
| `recording` | mentorship | granted/declined; declined honored silently | learner at intake |
| `lab_authorization` | cybersecurity hands-on | §6 | learner at intake |
| `guardian` | minors | §2 minors flow | **owner action** after manual verification |

Copy versioned by string constants in `lib/learn/policy-copy.ts`; version bumps keep old
consents historically accurate.

## 6. Cybersecurity teaching boundary

Hands-on security exercises stay inside learner-owned or explicitly authorized lab
environments (local VMs, TryHackMe/HTB-style platforms, owner-provided labs). No exercises
against third-party systems, no real-target recon in coursework, no malware development
beyond defanged educational samples in isolated labs. Requests outside this →
`integrity_concern` → owner review with a teach-the-defensive-equivalent counter-offer.
An unauthorized hands-on request still submits (never silently blocked) — the form offers
theory-only scope as the alternative.
