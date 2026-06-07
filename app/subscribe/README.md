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

### 1) Payment — in-page Moyasar card form (default)
GET MY PLAN now opens a **Moyasar card form right on the page** (no redirect before
paying). It ships in **test mode** by default so you can verify the flow with the
test card `4111 1111 1111 1111` (any future date · CVC 123 · OTP 123456).

To go **live with Moyasar**, set the live publishable key and **redeploy**:
```
NEXT_PUBLIC_MOYASAR_PK=pk_live_...
```
> ⚠️ Moyasar (and Tap) require a **Commercial Registration (CR)** to activate live
> payments. No CR yet? See the no-CR path below.

### No-CR path to take real money ASAP (recommended to start)
Use a **Merchant-of-Record** — they let an individual sell worldwide, handle
VAT/compliance, and need **no CR**:
- **Gumroad** — fastest (~5 min), individual creators, overlay checkout.
- **Lemon Squeezy** / **Paddle** — MoR with subscriptions + on-page overlay.

Create a product per tier, then either drop the overlay link in
`NEXT_PUBLIC_CHECKOUT_*` (an overlay mode can be wired to keep it on-page) or ping me
to wire the overlay. Switch to **Moyasar live** later (lower fees, Mada + Apple Pay)
once the CR is sorted.

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
