# Vault Weekly Drip — activation checklist

Built on branch `feat/vault-weekly-drip` (uncommitted, per EXECUTE mode — review, then
commit/push/deploy yourself). Closes the welcome-email promise "Weeks 2–4 land in your
inbox automatically." Content already exists (all 6 track PDFs); this ships the delivery.

## What it does
Daily cron (`/api/cron/vault-drip`, 09:00 UTC) emails active, non-refunded subscribers the
next issue's entitlement-gated download link — week 1 at purchase (Gumroad), then weeks
2→6 (developers, agents, automation, quant, creative). Delivery is anchored to each buyer's
purchase time (~7 days apart per buyer); the daily schedule + a 6-day spacing gate make
Week 2 arrive ~a week after purchase regardless of weekday, with no bursts.

## Files
- `app/api/cron/vault-drip/route.ts` — the cron (dry-run by default)
- `supabase/migrations/0003_drip_sends.sql` — idempotency ledger
- `vercel.json` — added the daily cron entry
- `.env.example` — documented CRON_SECRET / VAULT_DRIP_DRY_RUN / NEXT_PUBLIC_SITE_URL

## Activate (in order)
1. **Apply the migration** to prod Supabase: run `0003_drip_sends.sql` (SQL editor or CLI).
2. **Set env vars** in Vercel (Production): `CRON_SECRET` (any long random string),
   `NEXT_PUBLIC_SITE_URL=https://www.goodnbad.info`, and confirm `VAULT_SIGNING_SECRET`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM` are set.
   Leave `VAULT_DRIP_DRY_RUN=true` for now.
3. **Deploy** the branch.
4. **Dry-run test:** `curl -H "Authorization: Bearer $CRON_SECRET" https://www.goodnbad.info/api/cron/vault-drip`
   → JSON shows `dryRun:true` and masked would-send rows. (With 0 sales it reports
   `subscribers:0` — that's expected until the first buyer.)
5. **Live test on yourself:** make a real purchase (or insert a test `sales` row with your
   email), set `VAULT_DRIP_DRY_RUN=false`, hit the endpoint, confirm you receive the email
   and the download link works. Then verify a second call does NOT re-send (idempotent).
6. **Go live:** keep `VAULT_DRIP_DRY_RUN=false`. The Monday cron now runs automatically.

## Safety properties (verified by security + correctness review)
- Fails closed: no `CRON_SECRET` in prod → 401 (not an open endpoint).
- Reserve-then-send: claims the `drip_sends(email,week)` row before sending; releases it if
  the send fails. A crash or concurrent run cannot double-send.
- Weekly spacing gate: won't ship a 2nd issue within ~6 days even if the endpoint is hit
  extra times.
- Entitlement re-checked on every download → refunded buyers lose access even mid-week.
- Response is PII-masked (no raw customer emails leak to the caller).

## Known follow-ups (non-blocking)
- **Email casing:** the download token uses the buyer's original-case email so the
  case-sensitive `sales` lookup matches. For belt-and-suspenders, also lowercase
  `sales.email` at write time in `app/api/gumroad/ping/route.ts` and in `hasConfirmedSale`.
- **Anchor = row-insert time** (`sales.created_at`), not Gumroad's sale timestamp. Fine
  normally; if you ever re-import sales rows the schedule resets (the ledger still prevents
  duplicate emails). Store the real sale time if you want re-import safety.
- The "tuned for your setup" copy delivers a fixed 6-issue tour (one per track), OS-tuned.
  If you want per-track depth instead, that's a content + manifest change, not a code one.
