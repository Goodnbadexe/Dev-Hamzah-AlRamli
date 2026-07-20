# goodnbad.info

Cybersecurity + AI portfolio and revenue funnel for Hamzah Al-Ramli (**@Goodnbad.exe**).
Live at **[https://www.goodnbad.info](https://www.goodnbad.info)**.

A hacker/terminal-aesthetic Next.js site that doubles as a portfolio and a monetization
engine: a Toolkit Vault (Gumroad), a personalized `/subscribe` quiz funnel with a weekly
email drip, an SME "Cyber Sprint" offer, an AI SDR chat, and live threat-intel surfaces
(globe, IOC feeds).

## Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript (strict)
- **UI:** Tailwind CSS · Radix UI · three.js / react-globe.gl
- **Data / funnel:** Supabase · Gumroad · Resend (email) · OpenRouter (AI SDR) · PostHog (analytics + A/B)
- **Hosting:** Vercel (auto-deploys on push to `main`)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the keys you need; see .env.example for the server-only vs NEXT_PUBLIC_ split
npm run dev                  # http://localhost:3000
```

Quality gates:

```bash
npm run lint
npm test            # Vitest unit suite
npx playwright test # e2e (see playwright.config.ts)
npx tsc --noEmit    # type-check
```

## Structure

```
app/                 # App Router routes (portfolio pages + app/api route handlers)
  api/               # Gumroad ping, /subscribe/lead, /api/sdr, cron, threat proxies
components/          # UI — os/ (dashboard shell), terminal/, signal/, horus/ …
lib/                 # domain logic: subscribe/ vault/ sdr/ supabase/ email/ content/
tests/               # Vitest units + tests/e2e Playwright specs
```

Revenue-critical seams live in `lib/` (funnel logic isolated from presentation): the vault
download is HMAC-token + entitlement-checked, the Gumroad webhook is idempotent, and the SDR
route degrades gracefully when its API key is absent.

## Deployment

Pushing to `main` auto-deploys to Vercel. **Always `git pull` before changing anything** —
the repo can also receive automated syncs. Env vars are managed in the Vercel dashboard;
never commit secrets (`.env.local` is gitignored).
