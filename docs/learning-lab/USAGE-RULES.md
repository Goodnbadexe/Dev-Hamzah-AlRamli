# Learning Lab — Usage Rules (Controlled Value Delivery)

> Source of truth for how the Goodnbad Learning Lab behaves commercially and pedagogically.
> Captured verbatim from the product owner (Hamzah Al-Ramli), 2026-07-23.
> These rules OVERRIDE any default behavior when building or operating the Learning Lab.
> Companion documents: [SPEC.md](./SPEC.md) (full product brief), TODO.md, ROADMAP.md.

## The commercial rule

> **Free: understand their problem.**
> **Paid: design their path.**
> **Delivery: teach one verified step at a time.**

Brand line:

> **Think like a human. Execute like a machine. Teach like a professor.**

The platform diagnoses first, quotes second, unlocks teaching third. It must never become
a free assignment generator or an uncontrolled content dump.

---

## Audience coverage

The platform must work for learners across different:

- Technical levels: complete beginner to advanced
- Educational backgrounds
- Ages, subject to legal restrictions
- Devices and connection speeds
- Languages: Arabic, English, and bilingual
- Learning styles
- Available study time
- Accessibility needs
- Academic and professional goals

## Core philosophy

"Think like a human. Act with machine precision. Teach like a professor."

The system should:

- Understand the learner's real goal and circumstances like a human mentor.
- Validate, organize, track, and execute reliably like a machine.
- Explain concepts progressively like an excellent professor.
- Never overwhelm a beginner with advanced terminology.
- Never oversimplify material for an experienced learner.
- Teach the reasoning, process, and system — not merely provide an answer.

## Pre-payment experience

Do not give the learner a complete personalized curriculum, finished solution, detailed
assignment breakdown, custom resources, or substantial consulting before payment is confirmed.

Before payment, provide only:

- Package overview
- Intelligent intake form
- Basic diagnostic questions
- Automatic form validation
- A short preliminary assessment
- Recommended package
- Estimated scope
- Estimated delivery window
- Starting price or request-for-assessment result
- Any clarification questions
- A small example showing the teaching style
- Secure checkout or payment instructions

The preliminary assessment may display:

- Estimated current level
- Broad knowledge gaps
- Recommended learning direction
- Approximate duration
- Whether the request is suitable for the service

It must not expose the full custom plan.

## Payment-controlled release — entitlement lifecycle

Use an explicit entitlement system with these states:

1. **Draft** — learner is still completing the form.
2. **Submitted** — request received.
3. **Screening** — basic validation and suitability check.
4. **Clarification required** — essential information is missing.
5. **Quoted** — scope, price, and delivery estimate issued.
6. **Awaiting payment** — nothing substantial is released.
7. **Payment verification** — payment is being confirmed.
8. **Accepted** — payment and scope approved.
9. **Plan preparation** — personalized materials can now be created.
10. **In progress** — teaching and milestone work begins.
11. **Awaiting learner work** — learner must respond or submit.
12. **Feedback** — review and explanation are being prepared.
13. **Completed** — agreed deliverables have been fulfilled.

No payment status may change merely because the learner claims to have paid.
Require verified payment evidence or confirmation from the payment provider/admin.

## Self-checking foundation

Before creating a learning plan, the system must automatically check:

- Required fields are complete
- Email and contact information are valid
- Dates are logically possible
- The learner's timezone is recorded
- Uploaded files meet size and type rules
- Files pass security scanning where available
- The requested outcome is understandable
- The selected package matches the request
- The learner's stated level is reasonably consistent with diagnostic answers
- University requests include the brief, rubric, deadline, and permitted-AI rules
- Cybersecurity requests confirm legal authorization and safe-lab boundaries
- The requested work does not violate academic integrity
- The instructor has enough time to meet the requested deadline
- Payment has been verified before protected content is released

Produce an internal readiness result:

- Ready for quotation
- Needs clarification
- Requires manual review
- Unsupported request
- Integrity or safety concern
- Deadline not feasible

Do not automatically reject uncertain requests. Route them to the owner for manual review.

## Progressive teaching

After payment, reveal the learning journey step by step. Each step follows:

1. Explain the concept simply.
2. Connect it to something the learner already understands.
3. Demonstrate one practical example.
4. Ask the learner to reproduce it.
5. Check their understanding.
6. Identify the mistake or knowledge gap.
7. Explain why the mistake occurred.
8. Give the next exercise.
9. Unlock the following module only when appropriate.

Do not dump the entire curriculum at once unless the owner explicitly chooses to release it.

## Quality checks for every module

Each generated or selected module must verify:

- The objective is clear
- Prerequisites are satisfied
- Terminology matches the learner's level
- The example is technically correct
- The exercise tests the stated objective
- Completion can be demonstrated
- Sources are credible where sources are required
- Arabic and English technical terms remain consistent
- Instructions are reproducible
- No answer, command, citation, or result is fabricated
- Security exercises remain inside authorized environments

## Human approval boundary

AI may classify requests, detect missing information, recommend modules, and draft plans.
It must NOT, without an explicit approved rule or owner review:

- Confirm final scope
- Promise a deadline
- Approve academic-support work
- Confirm payment
- Release protected materials
- Provide high-risk cybersecurity exercises
- Make final pricing decisions

## Academic-integrity boundary

The Academic Sprint package must teach, guide, review, debug, and explain. It must NOT
impersonate the learner, fabricate research, secretly complete examinations, or submit
assessed work on the learner's behalf. The website states this professionally without
sounding hostile.

## MVP boundary

For now, build only:

- Public learning page
- Three package cards
- Adaptive intake and diagnostic form
- Basic suitability and completeness checks
- Preliminary assessment
- Manual quotation
- Payment-pending state
- Admin payment confirmation
- Protected post-payment learner area
- Step-by-step material release
- Submission and feedback loop
- Email notifications
- Audit trail

Do not build a giant autonomous Learning OS yet. First prove one complete commercial loop:

> Visitor → diagnostic → submission → review → quotation → verified payment →
> personalized step → learner response → feedback → completion.

Use feature flags or configuration so later capabilities can be added without exposing
unfinished functionality.
