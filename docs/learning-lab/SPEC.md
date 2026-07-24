# Goodnbad Learning Lab — Product Specification

> Full product brief from the owner (Hamzah Al-Ramli), captured 2026-07-23.
> Behavioral/commercial rules live in [USAGE-RULES.md](./USAGE-RULES.md) — that file wins on conflict.
> Working names: Platform **Goodnbad Learning Lab** · P1 **Guided Path** · P2 **Academic Sprint** · P3 **Private Mentorship**.

## Positioning

A personalized technical learning platform built around the owner's real experience in
cybersecurity, programming, systems, design, AI, automation, data, and practical
problem-solving. A subpage of the goodnbad.info ecosystem.

The one promise:

> "I will not just give you the answer. I will help you understand the system well enough
> to build the answer yourself."

Tagline candidate: **"Learn the system, not only the answer."**

This is NOT a library of prerecorded courses. Each learner submits their goal, background,
current knowledge, preferred language (Arabic / English / bilingual), learning style,
weekly time, target date, desired outcome, and any relevant files — and the system turns
that into a personalized learning journey.

## Learning areas (non-exhaustive)

Computer fundamentals · files/folders/OS · binary and number systems · CPU/RAM/storage/
architecture · algorithms and computational thinking · Fibonacci and programming logic ·
programming fundamentals · Python, JavaScript, web, APIs · cybersecurity fundamentals ·
networking, SOC, DFIR, SIEM, incident response · data, databases, analytics, data science ·
AI, LLMs, agents, tools, plugins, memory, automation · Git/GitHub and dev workflows ·
design thinking and creative technology · career and university technical preparation ·
any custom technical subject the owner approves.

The learner must never receive the same fixed curriculum as everyone else.

## The three packages

### 1. Guided Path (asynchronous personalized learning)

Learner receives: diagnostic assessment · personalized learning plan · curated notes,
explanations, exercises, resources · defined delivery date · defined deadline for
submitting answers/work · written feedback within a stated response window · one
revision/clarification cycle · progress tracking.

### 2. Academic Sprint (university project/assignment support)

Learner submits the brief and supporting materials. Service includes: requirements
analysis · breakdown of the work · explanation of relevant concepts · recommended
execution plan · milestones (~one week, configurable by scope) · technical guidance and
examples · review of the learner's OWN work · feedback before submission · final quality
and requirements check.

**Academic-integrity boundary:** teach, guide, review, debug, explain. Never impersonate
the learner, fabricate research, secretly complete examinations, or submit assessed work
on the learner's behalf. Stated professionally on the site, not hostile.

### 3. Private Mentorship (live 1:1 session)

Supports: learner-selected topic · short pre-session diagnostic form · calendar and
timezone-aware booking · file upload before the session · clear agenda · live one-to-one
teaching session · session notes · recommended next steps · optional follow-up exercises ·
optional recording only with explicit consent. Consider single-session AND discounted
multi-session bundle.

## Core learner journey

1. Learner enters the learning page.
2. Understands the value and the three packages.
3. Chooses a package.
4. Completes an intelligent intake form.
5. Conditional questions appear based on subject and package.
6. Selects deadlines, timezone, language, communication method.
7. Uploads relevant files.
8. System validates the submission.
9. Learner reviews price and scope.
10. Accepts academic-integrity, privacy, cancellation, communication terms.
11. Pays or submits a request for approval.
12. Owner receives an immediate notification.
13. A learner workspace / request record is created.
14. Owner reviews, approves, clarifies, or rejects the scope.
15. Learner receives status updates and delivery instructions.
16. Materials, submissions, feedback, revisions stay organized in one place.

## Intelligent intake form

Foundation questions (always): full name · email · country and timezone · preferred
language · age range (where legally appropriate) · current role or education level ·
selected package · topic/subject · current experience level · desired outcome · available
time per week · desired completion date · preferred explanation style · accessibility
requirements · supporting file uploads · consent and policy acceptance.

Conditional questions by track:

- **Cybersecurity:** defensive/offensive/governance/DFIR/SOC/networking/general? lab
  experience? OS familiarity? certifications pursued? authorization + legal-lab
  confirmation for security exercises?
- **Data science:** mathematics level? Python or R? dataset available? desired output —
  analysis, dashboard, model, or conceptual understanding?
- **Programming:** preferred language? existing code? target project? dev environment?
  main blockers?
- **University support:** institution level · module/subject · exact brief · rubric ·
  deadline · citation style · permitted AI use · work already completed · areas needing
  explanation or review.
- **Live sessions:** preferred dates · time windows · session goal · questions to answer ·
  files to review · recording consent.

## Personalization engine

Rules-based first version — no autonomous AI system yet. It generates a DRAFT learner
profile: starting level · target level · knowledge gaps · recommended modules · learning
sequence · exercises · milestones · evidence of completion · estimated study hours · risk
factors · required clarification · recommended package or upgrade.

Any AI-generated plan remains a draft until the owner approves it.

Reusable curriculum building blocks (not lessons generated from nothing). Each module
supports: title · learning objective · prerequisites · estimated time · explanation ·
example · exercise · practical task · knowledge check · completion criteria · resources ·
Arabic and English versions where available.

## Admin area

Owner can: view new requests · filter by package/topic/status/deadline/learner · open
learner profile · review uploaded files · see auto-extracted requirements · approve or
edit the proposed plan · request clarification · set delivery and response deadlines ·
upload materials · write feedback · track submissions and revisions · schedule sessions ·
record payment state · mark milestones complete · view overdue requests · export learner
records where legally appropriate · archive/delete per retention policy.

Request statuses: Draft · Submitted · Awaiting payment · Under review · Clarification
required · Accepted · Plan preparation · In progress · Awaiting learner submission ·
Feedback preparation · Revision available · Completed · Cancelled · Rejected · Archived.
(The 13-state entitlement lifecycle in USAGE-RULES.md governs payment-controlled release.)

> **Amendment 2026-07-24:** these are display labels only — the canonical status enum and the
> label→enum mapping live in DATA-MODEL.md §3 ("Revision available" is realized as a revision
> submission inside the feedback loop, not a status).

## Notifications

Event-driven: new learner request · payment received · missing information · scope
accepted/rejected · clarification requested · delivery approaching · material delivered ·
learner submission received · feedback completed · revision deadline approaching · live
session reminder · overdue learner response · overdue instructor action · package
completion.

Never notify the person who performed the action. Start with email + in-app/admin
notification record; WhatsApp/Telegram/Discord/SMS are future integrations.

> **Amendment 2026-07-24:** owner-side Telegram alerts via the existing bot are in-scope from
> day one (learner-facing chat channels remain future). The actor rule's authoritative wording
> is NOTIFICATIONS.md: no action-REQUEST notifications to the actor; receipts are permitted.

Every notification carries: event type · recipient · request identifier · learner name ·
required action · relevant deadline · direct link · delivery state · retry handling ·
deduplication protection.

## Security and privacy

Learner files and educational records are confidential. Required: authentication and
authorization · learner/admin separation · object-level access control · secure upload
validation · file size/type restrictions · malware scanning strategy · private storage
with expiring download links · rate limiting · audit history · input validation ·
CSRF/XSS protection · encryption in transit and at rest · secret management · minimal
data collection · consent records · retention and deletion policy · backup and recovery ·
no learner document exposure through public URLs · no AI-provider training on learner
content where controls permit opting out · special restrictions for minors · clear
cybersecurity-lab authorization requirements.

## Commercial model

Do not invent final prices yet. Price on: preparation time · teaching time · complexity ·
urgency · number of deliverables · review cycles · live-session duration · file volume ·
bilingual delivery · custom research. Site may show fixed starting prices OR "Request
assessment" until final prices are approved.

To be recommended: package names · short descriptions · package boundaries · add-ons ·
cancellation terms · rescheduling policy · revision limits · rush surcharge · multi-session
bundle logic · free discovery/diagnostic option if commercially sensible.

## Page structure

Premium, concise — a technical mentor and learning laboratory, not a school:

1. Hero and value proposition
2. What learners can study
3. How personalized learning works
4. Three packages
5. Example learning journey
6. Credibility and experience
7. Academic-integrity commitment
8. FAQ
9. Intake form / clear call to action
10. Privacy and service terms
11. Arabic/English support

Copy: intelligent, direct, practical, human. No empty AI marketing language.

## Execution phases

- **Phase 0 — Evidence gathering** (repo inventory, stack, integration decision, risks). No product-code changes.
- **Phase 1 — Product specification** (PRD, journeys, IA, intake schema, lifecycle, notification matrix, data model, permissions, policies, MVP boundary).
- **Phase 2 — UX prototype** (responsive layout, package cards, multi-step form, conditional behavior, states, learner + admin views, RTL/LTR, a11y).
- **Phase 3 — MVP implementation** (public page, packages, form, upload, DB-backed records, admin review, statuses, email notifications, deadline/timezone handling, secure learner access, audit history, plan draft, bilingual foundation).
- **Phase 4 — Verification** (lint, types, unit/integration, access-control, upload-security, form-validation, notification-dedup, timezone tests, RTL/LTR visual, mobile/desktop, production build). "Done" requires evidence.

## Documentation discipline

- `TODO.md` — current committed work only
- `ROADMAP.md` — later possibilities
- `CHANGELOG.md` — completed work
- ADR files — important architecture decisions
- `PROJECT-STATE.md` — verified current state
- `README.md` — setup and operating instructions
