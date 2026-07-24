# Learning Lab — Roadmap (later possibilities, NOT committed)

Everything here is post-MVP. The MVP boundary in USAGE-RULES.md wins.

## Deferred by the Phase 1 adversarial review (deliberate MVP cuts)
- Cron-driven notification machinery: deadline sweeps (T-48/T+48/T-24h), learner nudges with
  caps, owner digests, retry sweeper, bounce suppression, T-1h session reminders (needs an
  hourly cron — verify Vercel plan supports it)
- Intake file uploads (pre-auth) + `learning_files` registry table + automated malware
  scanning feeding a real `scan_status`
- `paused` lifecycle state for dormant paid engagements (MVP: POLICIES §4 lapse clause)
- `depends_on` module dependency graph + system auto-unlock (MVP: seq + owner judgment)
- Retention/anonymization automation (MVP: owner-run documented script; `archived` is manual)
- Resumable server-side intake drafts (activates the reserved `draft` status) + intake
  completion-rate metric
- Full `/admin/learning` dashboard UI (MVP: five owner verbs on one thin page)

## Growth
- Multi-session mentorship bundles with discount logic (pricing config exists)
- Automated payment verification (Moyasar/Gumroad webhook → entitlement flip)
- Learner dashboard with progress visualization inside the OS shell
- Arabic-first locale segments (full RTL routes instead of client toggle)
- WhatsApp / Telegram / Discord learner notifications
- Rules-engine upgrade → AI-drafted plans (always owner-approved per USAGE-RULES)
- Curriculum library growth: reusable bilingual module blocks per track
- Programmatic PDF fill of the three templates (learner name/dates injected)
- Referral / alumni proof-of-completion artifacts (signed certificates)
- "Learning OS" ambitions — only after the MVP commercial loop is proven with real learners
