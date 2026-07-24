# Learning Lab — TODO (current committed work only)

## Done
- [x] Phase 0 evidence sweep → [PHASE0-EVIDENCE.md](./PHASE0-EVIDENCE.md) (2026-07-24)
- [x] Product rules captured → [USAGE-RULES.md](./USAGE-RULES.md), [SPEC.md](./SPEC.md)
- [x] Three package PDF templates → [templates/](./templates/)
- [x] Owner decisions locked: `/learn` = academy.exe "Learning Lab" · Supabase Auth magic
      links · secure-slice commits landed first (44d35eb…bcecfa2)
- [x] Phase 1 spec set v2 (post-adversarial-review, 61 findings applied): [PRD.md](./PRD.md),
      [DATA-MODEL.md](./DATA-MODEL.md), [INTAKE-SCHEMA.md](./INTAKE-SCHEMA.md),
      [NOTIFICATIONS.md](./NOTIFICATIONS.md), [POLICIES.md](./POLICIES.md)
      (raw review: phase1-review-findings.txt)

## Remaining Phase 1 items
- [x] **ASSESSMENT.md** — questions, scoring, gaps EN+AR, duration formula, examples (2026-07-24)
- [x] Teaching-style sample drafted EN+AR → [TEACHING-SAMPLE.md](./TEACHING-SAMPLE.md) — **owner sign-off pending**
- [ ] AR policy + consent copy, owner-signed — POLICIES preamble (drafts exist on /learn + POLICIES)
- [ ] Owner review of the v2 spec set (esp. SLAs, lapse clause, pricing-band commitment)

## Phase 2 — UX prototype (DONE 2026-07-24)
- [x] `/learn` built in the OS shell: hero, protocol, locked-path visual, tracks, interactive
      teaching sample, package cards + helper, integrity, FAQ, terms, 6-step intake wizard
      with live assessment preview. Client-side only (no data transmitted; prototype banners).
- [x] Dark-shipped: middleware blocks `/learn` in production; `learningLab` flag added as
      kill switch. No OS_APPS/taskbar entry until launch (PRD §7).
- [x] Verified: tsc 0 errors · 87/87 tests (11 new) · production build passes · visual pass
      desktop/mobile + full Arabic RTL.

## Then Phase 3 (build per PRD §12) → Phase 4 (verify)

## Hard rules for anyone working in this repo
- NEVER `git add .` or blanket `git add docs/` — stage by explicit path (the subscribe/vault
  work stream is still uncommitted in this tree).
- `git fetch origin` + reconcile main BEFORE migration work (0002_sales.sql lives on main;
  also take main's hardened `lib/vault/entitlement.ts`, not this branch's).
- Work only in `G:\Dev-Hamzah-AlRamli\Dev-Hamzah-AlRamli` (not the G:\claude clone).
