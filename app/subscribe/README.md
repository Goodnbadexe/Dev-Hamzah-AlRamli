# `/subscribe` — Toolkit Vault funnel

Conversion funnel for the Instagram bio link (`goodnbad.info/subscribe`):
**intro → 21-question quiz → "building your plan" load → personalized paywall**.
Arabic-first, bilingual. A persistent, real 10-minute discount countdown and a
personalized promo code (visitor's name + date, e.g. `sara_jun07`).

## Files
- `lib/subscribe/quiz.ts` — the 21 bilingual questions (sequenced: opener → pain → desire → qualify → micro-commit → name/email).
- `lib/subscribe/config.ts` — plans, pricing, copy, promo builder, `checkoutUrl()`.
- `app/subscribe/page.tsx` — the funnel state machine (client).
- `app/api/subscribe/lead/route.ts` — lead capture (Telegram / email).

## Make it live — 2 things to set (Vercel → Settings → Environment Variables)

### 1) Payment links (one per plan)
Create a checkout for each tier in **Moyasar** or **Tap** (both do Mada + Apple Pay,
best for Saudi) or a **Stripe Payment Link**, then set:

```
NEXT_PUBLIC_CHECKOUT_TRIAL=https://...     # 1-week, 9 SAR
NEXT_PUBLIC_CHECKOUT_MONTH=https://...      # 4-week, 29 SAR  (most popular)
NEXT_PUBLIC_CHECKOUT_QUARTER=https://...    # 12-week, 69 SAR (best value)
```
These are inlined at **build time** → after setting them, **redeploy**.
If a link is empty, that plan captures the lead and shows a "we'll email your plan"
confirmation instead of charging — never a fake checkout.

### 2) Lead delivery (so you get every quiz lead for the weekly PDF)
Set **one** (or both). Runtime vars — no redeploy needed beyond the next deploy.

**Telegram (easiest):** make a bot with `@BotFather`, message it once, get your
chat id from `@userinfobot`:
```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```
**or SMTP email:**
```
SMTP_HOST=...  SMTP_PORT=587  SMTP_USER=...  SMTP_PASS=...  LEAD_TO=you@email.com
```

## Edit pricing / copy
All in `lib/subscribe/config.ts` (`PLANS`, `PRODUCT`). Strike-through `original`
prices are set so the discount math is real (9/29/69 SAR → 53% / 61% / 65% off).

## Notes for next pass
- Prices follow the locked decision (9 / 29 / 69 SAR). Adjust freely in `config.ts`.
- Social proof is honest/aspirational (no fabricated research citation).
- Arabic is primary; English is the secondary line. Tighten the Arabic copy anytime in `quiz.ts` / `config.ts`.
