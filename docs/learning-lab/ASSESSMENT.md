# Learning Lab — Preliminary Assessment Engine (Phase 1)

> Status: DRAFT for owner review · 2026-07-24 · Implementation target: `lib/learn/assessment.ts`
> This is the rules-based engine behind the ONLY substantive free artifact (INTAKE-SCHEMA §5).
> Hard rule: the rendered assessment must echo ≥2 learner-specific values (topic, desired
> outcome, target date) inside the analysis text so it reads diagnosed, not templated.
> AR strings below are working drafts — owner (native-speaker) sign-off required before launch.

## 1. Self-check questions (3 per track, shown for `guided_path` and when track relevant)

Scoring: each answer carries 0 (novice), 1 (working), or 2 (fluent) points. Track score = sum (0–6).

### fundamentals
| # | Question (EN / AR) | Options → points |
|---|---|---|
| F1 | What happens when you save a file? / ماذا يحدث عند حفظ ملف؟ | "It just… saves?" →0 · "It's written to storage on disk" →1 · "OS buffers it, writes blocks to storage, updates file-system metadata" →2 |
| F2 | What is the difference between RAM and storage? / ما الفرق بين الذاكرة RAM والتخزين؟ | Not sure →0 · RAM is temporary, storage is permanent →1 · Can also explain why programs load INTO RAM and what happens when it runs out →2 |
| F3 | What is a folder, really? / ما هو المجلد فعليًا؟ | A place files live →0 · A container the OS uses to organize files →1 · A directory entry mapping names to file references in the file system →2 |

### programming
| # | Question | Options → points |
|---|---|---|
| P1 | Have you written a loop that processes a list? | Never →0 · With help/tutorials →1 · Regularly, comfortable with nested logic →2 |
| P2 | A program crashes with an error message. What do you do first? | Panic / retry →0 · Read the message and search it →1 · Read the stack trace, locate the line, reason about state →2 |
| P3 | Fibonacci: could you write a function that returns the Nth number? | Don't know where to start →0 · With a reference →1 · Yes, iteratively or recursively, and explain the difference →2 |

### cybersecurity
| # | Question | Options → points |
|---|---|---|
| C1 | What is the CIA triad? | Haven't heard of it →0 · Confidentiality, Integrity, Availability →1 · Can map real attacks to each pillar →2 |
| C2 | What happens when you type a URL and press Enter? | Magic / not sure →0 · DNS → server → response →1 · DNS resolution, TCP/TLS handshake, HTTP request, response rendering — and where attacks fit →2 |
| C3 | Have you used a security lab environment? | Never →0 · Guided platforms (THM/HTB academy tiers) →1 · Own VMs / CTFs / structured lab work →2 |

### data_science
| # | Question | Options → points |
|---|---|---|
| D1 | Given a messy spreadsheet, what's your first move? | Not sure →0 · Look for blanks/duplicates and clean →1 · Profile distributions, define a cleaning strategy, document assumptions →2 |
| D2 | Mean vs median — when does the difference matter? | Don't remember →0 · Outliers skew the mean →1 · Can choose the right one per distribution and justify it →2 |
| D3 | Have you loaded data with code (Python/R)? | Never →0 · Following tutorials →1 · Regularly (pandas/dplyr), incl. joins and groupby →2 |

### ai_automation
| # | Question | Options → points |
|---|---|---|
| A1 | What is an LLM agent, versus a plain chat prompt? | Not sure →0 · An AI that can take actions/use tools →1 · A model in a loop with tools, memory, and stop conditions — and where it fails →2 |
| A2 | Have you built any automation (scripts, Zapier/n8n, bots)? | Never →0 · Simple no-code flows →1 · Multi-step flows with error handling or code →2 |
| A3 | What is a prompt injection? | Never heard of it →0 · Tricking an AI into ignoring instructions →1 · Untrusted input crossing a trust boundary into the instruction context; can name mitigations →2 |

### university
Questions come from the brief instead of self-checks (the diagnostic IS the brief analysis):
U1 rubric provided? (no→0 · yes→1 · yes+understands weighting→2) ·
U2 "Which part of the brief can you already do?" (none→0 · some→1 · most, needs review→2) ·
U3 time to deadline vs scope (owner-judged at screening; scored 0–2 by runway rule).

### custom
No fixed questions — score = self-stated level (beginner 0 · intermediate 3 · advanced 5) and
readiness is already `manual_review` per INTAKE §2.

## 2. Level estimation

| Track score | Estimated level |
|---|---|
| 0–1 | beginner |
| 2–4 | intermediate |
| 5–6 | advanced |

**Consistency rule (INTAKE §4.8):** if self-stated level and estimated level differ by ≥2
bands (beginner↔advanced), readiness → `manual_review` with both values in the event meta.
One-band differences are normal; the assessment text uses the ESTIMATED level and says so
gently ("your answers suggest starting at…").

## 3. Gap-area template library (2–3 per track × level; EN shown, AR drafts in policy-copy pack)

| Track | beginner gaps | intermediate gaps | advanced gaps |
|---|---|---|---|
| fundamentals | mental model of hardware vs software; file-system basics | how the OS manages processes/memory; number systems (binary/hex) | internals depth: caching, scheduling, storage stack |
| programming | computational thinking; syntax fluency in one language | debugging discipline; data structures beyond arrays | architecture/patterns; testing habits |
| cybersecurity | networking fundamentals; the security mindset (threat framing) | protocol depth (TCP/TLS/DNS); structured lab methodology | specialization depth (DFIR/SOC/offensive path); tooling mastery |
| data_science | spreadsheet→code transition; statistics vocabulary | pandas/R fluency; data cleaning strategy | modeling judgment; communicating results |
| ai_automation | what LLMs actually do (tokens, context); prompt structure | tool-use/agent patterns; failure modes and guardrails | eval/testing of agents; security of AI systems |
| university | reading a brief like a rubric; planning backwards from the deadline | connecting course theory to the practical task | defense/presentation readiness; polish under constraints |

## 4. Duration band formula

```
levelGap   = max(1, targetLevelIndex - estimatedLevelIndex)     // outcome parsed to a target band, default +1
baseHours  = { fundamentals: 10, programming: 16, cybersecurity: 18,
               data_science: 16, ai_automation: 14, university: scope-from-brief, custom: manual }
estHours   = baseHours[track] × levelGap × packageFactor        // guided 1.0 · sprint 0.6 (scoped) · mentorship n/a (per session)
weeks      = ceil(estHours / weeklyHours)
band       = weeks ≤ 3 → "2–3 weeks" · ≤ 6 → "4–6 weeks" · ≤ 10 → "6–10 weeks" · else "10+ weeks (phased)"
```
Mentorship shows session count guidance instead (goal-scoped: 1 session for one focused topic,
3-pack for a track kick-start). If `targetDate` is provided, the text compares the band to it
("your target of {targetDate} is realistic / tight — we'd confirm scope at quote").

## 5. Output template (rendered per language; learner-specific echoes in **bold**)

**EN example (programming, self=beginner, score 3 → intermediate, 6h/wk, topic "build a web
scraper", outcome "automate collecting job listings", target 2026-09-15):**

> **Preliminary assessment — GNB-LL reference issued after email verification**
> Your goal: **automate collecting job listings** by building **a web scraper**.
> Your answers suggest starting at **intermediate** — you've written loops and can read error
> messages, which is exactly the foundation scraping needs.
> The two gaps most likely to slow you down: **debugging discipline** (scrapers fail
> constantly and quietly) and **data structures beyond arrays** (you'll live in dicts/lists).
> Recommended direction: a Guided Path that builds from HTTP fundamentals → parsing → a real
> scraper for your listings project, one verified step at a time.
> At **6 h/week** this typically lands in the **4–6 week** band — your target of
> **2026-09-15** is realistic.
> Suitability: this request fits the service well. The full step-by-step plan is prepared
> after scope approval and verified payment.

**AR example (same case — draft, owner sign-off required):**

> **التقييم الأولي**
> هدفك: **أتمتة جمع إعلانات الوظائف** عبر بناء **أداة استخراج بيانات من الويب**.
> تشير إجاباتك إلى أن نقطة البداية المناسبة هي المستوى **المتوسط** — فأنت تكتب الحلقات وتقرأ
> رسائل الأخطاء، وهذا هو الأساس الذي يحتاجه هذا المشروع.
> الفجوتان الأكثر تأثيرًا: **منهجية تصحيح الأخطاء** و**هياكل البيانات** التي ستعتمد عليها يوميًا.
> الاتجاه الموصى به: مسار موجّه يبدأ من أساسيات HTTP ثم التحليل ثم بناء أداتك الفعلية، خطوة
> مؤكدة تلو الأخرى.
> بمعدل **٦ ساعات أسبوعيًا** تقع المدة عادة ضمن نطاق **٤–٦ أسابيع** — وهدفك الزمني
> (**2026-09-15**) واقعي.
> الملاءمة: طلبك مناسب تمامًا لهذه الخدمة. تُجهَّز الخطة الكاملة بعد اعتماد النطاق وتأكيد الدفع.

## 6. Exclusions (USAGE-RULES pre-payment boundary)

The assessment never contains: module lists or sequence, resources/links, exercises,
solution content, or the plan itself. Suitability language is honest — `unsupported` and
`integrity_concern` cases render a respectful "this needs a conversation first" variant
instead of a fake green light.
