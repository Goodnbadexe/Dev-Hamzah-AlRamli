# Instagram auto-posting — one-time setup (≈20 min, owner-only)

Goal: after this, a daily job posts one Toolkit Vault carousel to your Instagram on
its own. You never open the app to post. These are the **only** steps that must be
you (account owner) — everything else is already built (`scripts/post-to-instagram.mjs`).

You already have a Meta app powering the site's Facebook feed (`facebookSDK` flag),
so you can **reuse that same app** and just add Instagram publishing to it.

---

## 1. Business account  ✅ DONE — just confirm the Page link  (1 min, in the IG app)
Publishing via API only works for Business/Creator accounts. **You already have Business**,
so the only thing to verify is the Facebook **Page link** — that link (Page → IG), not the
IG account itself, is what the API publishes through.

- IG app → **Settings → … → Accounts Center / Linked accounts** → confirm a **Facebook Page**
  is connected. If not, link one (a free Page is fine).
- *(`--discover` in step 4 will tell you instantly whether the link is in place.)*

## 2. Meta app + Instagram product  (5 min, developers.facebook.com)
- Go to **developers.facebook.com → My Apps**. Open your existing app (the one behind
  the site's FB feed) or **Create App → type: Business**.
- In the app, **Add product → Instagram → set up** (Instagram Graph API).
- Under **App roles → Roles**, make sure your own account is an Admin/Tester. For
  posting to *your own* account you can stay in **Development mode** — no public App
  Review needed.

## 3. Permissions + a long-lived token  (5 min, Graph API Explorer)
- Open **Graph API Explorer** (developers.facebook.com/tools/explorer), pick your app.
- **Generate Access Token** and approve these scopes:
  `instagram_basic`, `instagram_content_publish`, `pages_show_list`,
  `pages_read_engagement`, `business_management`
- That token is short-lived (~1h). Exchange it for a **60-day** token (paste your app
  id/secret + the short token):
  ```
  https://graph.facebook.com/v26.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN
  ```
  Copy the returned `access_token` — that's your **IG_ACCESS_TOKEN**.

## 4. Find your Instagram user id  ✅ AUTOMATED — I do this for you
Skip the manual Graph Explorer lookups. Once your token is in `.env.local` (step 6),
I run:
```
npm run post:ig -- --discover
```
It walks your Pages, prints the linked IG handle, and **writes `IG_USER_ID` into
`.env.local` automatically** (it's not a secret). If it prints "no linked IG business
account", that's the step-1 Page link missing — fix that, then re-run.

## 5. Create a public image bucket  (2 min, Supabase)
Instagram fetches images by URL, so the slides must be publicly reachable. We host
them on Supabase (you already use it for leads):
- Supabase dashboard → **Storage → New bucket** → name `social` → **Public** ✅
- *(Alternative: skip this and host the PNGs on the site instead — then set
  `PUBLIC_IMAGE_BASE=https://www.goodnbad.info/social`. Supabase is simpler.)*

## 6. Put the **one** secret in `.env.local`  (1 min)
Add just your token (the poster reads it automatically; never commit it). Don't paste it
into chat — put it straight in the file yourself:
```
IG_ACCESS_TOKEN=...
```
`IG_USER_ID` gets written for you by `--discover` (step 4). `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are already there from the funnel.

---

## Then I take over — verify + go live
```
npm run post:ig -- --discover         # finds + writes your IG_USER_ID from the token
npm run post:ig -- --check            # confirms the token + shows @your_handle
npm run post:ig -- --next             # dry-run: shows the next post, posts nothing
npm run post:ig -- --next --publish   # posts day-01 for real
npm run post:ig -- --list             # see posted vs pending
```

## Daily auto-post (set once)
Windows Task Scheduler, daily at e.g. 7pm — one carousel per run walks day-01 → 30:
```
schtasks /Create /SC DAILY /ST 19:00 /TN "VaultIG" /TR ^
 "cmd /c cd /d G:\Dev-Hamzah-AlRamli\Dev-Hamzah-AlRamli && npm run post:ig -- --next --publish"
```
*(Or I can wire it into Synapse's scheduler instead — your call.)*

## Good to know
- **Rate limit:** ~25 published posts / 24h. One/day is nowhere near it.
- **Token refresh:** the 60-day token must be refreshed before it expires (re-run the
  step-3 exchange, or I add a `--refresh-token` mode). Set a reminder ~day 50.
- **Safety:** the poster is **dry-run by default**; nothing posts without `--publish`.
