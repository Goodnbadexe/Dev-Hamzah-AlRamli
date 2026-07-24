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

## Remaining Phase 1 items (docs, before Phase 2/3)
- [ ] **ASSESSMENT.md** — per-track self-check questions + scoring, level-estimation table,
      gap templates EN+AR, duration formula, rendered examples (PRD §12.2)
- [ ] Teaching-style sample mini-module (EN+AR, owner-authored/signed) — PRD §7
- [ ] AR policy + consent copy, owner-signed — POLICIES preamble
- [ ] Owner review of the v2 spec set (esp. SLAs, lapse clause, pricing-band commitment)

## Then Phase 2 (UX prototype) → Phase 3 (build per PRD §12) → Phase 4 (verify)

## Hard rules for anyone working in this repo
- NEVER `git add .` or blanket `git add docs/` — stage by explicit path (the subscribe/vault
  work stream is still uncommitted in this tree).
- `git fetch origin` + reconcile main BEFORE migration work (0002_sales.sql lives on main;
  also take main's hardened `lib/vault/entitlement.ts`, not this branch's).
- Work only in `G:\Dev-Hamzah-AlRamli\Dev-Hamzah-AlRamli` (not the G:\claude clone).
