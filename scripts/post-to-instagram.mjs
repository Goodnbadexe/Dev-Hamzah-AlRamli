// === METADATA ===
// Purpose: Auto-publish the pre-built 30-day Toolkit Vault carousels to Instagram
//          via the official Instagram Graph API — one carousel per run, so a daily
//          cron walks day-01 → day-30 hands-free. Reads the PNG slides + caption.txt
//          that build-social-posts.mjs already produced under content/social/.
//
// Flow:    For the chosen day it (1) makes each slide publicly fetchable (Supabase
//          Storage upload, or a PUBLIC_IMAGE_BASE you host), (2) creates a carousel
//          child container per image, (3) creates the parent CAROUSEL container with
//          the caption, (4) calls media_publish. Records posted days in
//          content/social/.posted.json so it never double-posts.
//
// Safety:  DRY-RUN by default — prints exactly what it would do and makes ZERO write
//          calls to Instagram. Pass --publish to actually post. Tokens are read from
//          env only (never hardcoded, never logged). One carousel per invocation
//          keeps you far under IG's ~25 posts/24h publishing limit.
//
// Env:     IG_USER_ID, IG_ACCESS_TOKEN           (required to publish)
//          SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY + SOCIAL_BUCKET (default "social")
//                                                  (image host — or use PUBLIC_IMAGE_BASE)
//          PUBLIC_IMAGE_BASE                       (optional: e.g. https://www.goodnbad.info/social)
//          Loaded from .env.local at the project root if present (values never printed).
//
// Usage:   npm run post:ig -- --check            verify the token + account, post nothing
//          npm run post:ig -- --discover         auto-find your IG_USER_ID from the token
//          npm run post:ig -- --list             show which days are posted / pending
//          npm run post:ig -- --next             DRY-RUN the next unposted day
//          npm run post:ig -- --next --publish   actually post the next unposted day
//          npm run post:ig -- --day 7 --publish  post a specific day
// === END METADATA ===

import { readFileSync, readdirSync, existsSync, writeFileSync, appendFileSync } from "node:fs"
import { join, resolve } from "node:path"

// ── Constants ────────────────────────────────────────────────────────────────
const PROJECT_ROOT = resolve(process.cwd())
const SOCIAL_DIR = join(PROJECT_ROOT, "content", "social")
const POSTED_FILE = join(SOCIAL_DIR, ".posted.json")
const GRAPH = "https://graph.facebook.com/v26.0" // matches app/api/social/facebook
const SLIDE_COUNT = 5

// ── Tiny .env.local loader (never prints values) ─────────────────────────────
// A standalone node script doesn't inherit Next.js's .env.local, so load it so the
// existing Supabase / IG secrets "just work" without re-entering them.
function loadEnvLocal(root) {
  const path = join(root, ".env.local")
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

// ── Arg parsing ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const has = (f) => argv.includes(f)
  const val = (f) => {
    const i = argv.indexOf(f)
    return i >= 0 ? argv[i + 1] : undefined
  }
  return {
    check: has("--check"),
    discover: has("--discover"),
    list: has("--list"),
    next: has("--next"),
    today: has("--today"),
    day: val("--day"),
    publish: has("--publish"),
  }
}

// ── Day discovery + posted-state ─────────────────────────────────────────────
function listDayFolders() {
  if (!existsSync(SOCIAL_DIR)) throw new Error(`Missing ${SOCIAL_DIR} — run "npm run build:social" first.`)
  return readdirSync(SOCIAL_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^day-\d\d-/.test(d.name))
    .map((d) => d.name)
    .sort()
}

function readPosted() {
  if (!existsSync(POSTED_FILE)) return {}
  try {
    return JSON.parse(readFileSync(POSTED_FILE, "utf8"))
  } catch {
    return {}
  }
}

function recordPosted(state, folder, mediaId) {
  const next = { ...state, [folder]: { id: mediaId, at: new Date().toISOString() } }
  writeFileSync(POSTED_FILE, JSON.stringify(next, null, 2))
  return next
}

function chooseFolder(folders, opts, posted) {
  if (opts.day) {
    const pad = String(opts.day).padStart(2, "0")
    const f = folders.find((x) => x.startsWith(`day-${pad}-`))
    if (!f) throw new Error(`No folder for --day ${opts.day}`)
    return f
  }
  if (opts.today) {
    const iso = new Date().toISOString().slice(0, 10)
    // Calendar dates are recomputed from the build's START_DATE convention.
    const start = new Date((process.env.SOCIAL_START_DATE || "2026-06-27") + "T00:00:00")
    const f = folders.find((_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return d.toISOString().slice(0, 10) === iso
    })
    if (!f) throw new Error(`No scheduled post for today (${iso}).`)
    return f
  }
  // default + --next: the lowest-numbered day not yet posted
  const f = folders.find((x) => !posted[x])
  if (!f) throw new Error("All days already posted. 🎉 Nothing left in this batch.")
  return f
}

// ── Image hosting: make each slide a public URL Instagram can fetch ──────────
async function ensurePublicUrls(folder, dir, slides) {
  const base = process.env.PUBLIC_IMAGE_BASE
  if (base) return slides.map((s) => `${base.replace(/\/+$/, "")}/${folder}/${s}`)

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      "No image host configured. Set PUBLIC_IMAGE_BASE, or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY " +
        "(and create a public Storage bucket — default name 'social').",
    )
  }
  const bucket = process.env.SOCIAL_BUCKET || "social"
  const { createClient } = await import("@supabase/supabase-js")
  const sb = createClient(url, key, { auth: { persistSession: false } })

  const urls = []
  for (const s of slides) {
    const buf = readFileSync(join(dir, s))
    const path = `${folder}/${s}`
    const up = await sb.storage.from(bucket).upload(path, buf, { contentType: "image/png", upsert: true })
    if (up.error) throw new Error(`Supabase upload failed (${path}): ${up.error.message}`)
    const pub = sb.storage.from(bucket).getPublicUrl(path)
    if (!pub.data?.publicUrl) throw new Error(`No public URL for ${path} (is the bucket public?)`)
    urls.push(pub.data.publicUrl)
  }
  return urls
}

// ── Graph API helpers ────────────────────────────────────────────────────────
async function graphPost(path, params) {
  const res = await fetch(`${GRAPH}/${path}`, { method: "POST", body: new URLSearchParams(params) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Graph POST ${path} → ${res.status}: ${JSON.stringify(json)}`)
  return json
}

async function verifyAccount(igUserId, token) {
  const fields = "username,account_type,media_count"
  const res = await fetch(`${GRAPH}/${igUserId}?fields=${fields}&access_token=${encodeURIComponent(token)}`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Account check → ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// Walks the Pages this token manages and reports any linked IG business account,
// so the owner never has to hand-run the two Graph Explorer GETs for IG_USER_ID.
async function discoverAccounts(token) {
  const fields = "name,instagram_business_account{id,username}"
  const res = await fetch(`${GRAPH}/me/accounts?fields=${fields}&access_token=${encodeURIComponent(token)}`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Discover → ${res.status}: ${JSON.stringify(json)}`)
  const pages = json.data || []
  return { pages, linked: pages.filter((p) => p.instagram_business_account) }
}

async function publishCarousel(igUserId, token, imageUrls, caption) {
  const children = []
  for (const image_url of imageUrls) {
    const child = await graphPost(`${igUserId}/media`, {
      image_url,
      is_carousel_item: "true",
      access_token: token,
    })
    children.push(child.id)
  }
  const container = await graphPost(`${igUserId}/media`, {
    media_type: "CAROUSEL",
    children: children.join(","),
    caption,
    access_token: token,
  })
  const published = await graphPost(`${igUserId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  })
  return published.id
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  loadEnvLocal(PROJECT_ROOT)
  const opts = parseArgs(process.argv.slice(2))
  const folders = listDayFolders()
  const posted = readPosted()

  const IG_USER_ID = process.env.IG_USER_ID
  const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN

  if (opts.list) {
    console.log(`\n📋 ${folders.length} days · ${Object.keys(posted).length} posted\n`)
    for (const f of folders) {
      const mark = posted[f] ? `✅ ${posted[f].at?.slice(0, 10) || ""}` : "⬜ pending"
      console.log(`  ${mark}  ${f}`)
    }
    return
  }

  if (opts.discover) {
    if (!IG_ACCESS_TOKEN) {
      console.error("❌ Missing IG_ACCESS_TOKEN. Paste your 60-day token into .env.local first, then re-run --discover.")
      process.exit(1)
    }
    const { pages, linked } = await discoverAccounts(IG_ACCESS_TOKEN)
    if (!pages.length) {
      console.log("\n⚠️  This token sees no Facebook Pages. Ensure it has the pages_show_list scope and you admin a Page.")
      return
    }
    console.log(`\n🔎 ${pages.length} Page(s) visible to this token:`)
    for (const p of pages) {
      const ig = p.instagram_business_account
      console.log(`   • ${p.name}: ${ig ? `IG @${ig.username} → IG_USER_ID=${ig.id}` : "no linked IG business account"}`)
    }
    if (linked.length === 1) {
      const id = linked[0].instagram_business_account.id
      if (IG_USER_ID) {
        console.log(`\n✅ IG_USER_ID already set (${IG_USER_ID}). Run --check next.`)
      } else {
        const envPath = join(PROJECT_ROOT, ".env.local")
        const already = existsSync(envPath) && /^IG_USER_ID=/m.test(readFileSync(envPath, "utf8"))
        if (already) {
          console.log(`\n✅ Add this to .env.local →  IG_USER_ID=${id}`)
        } else {
          appendFileSync(envPath, `\nIG_USER_ID=${id}\n`)
          console.log(`\n✅ Wrote IG_USER_ID=${id} to .env.local. Run --check next.`)
        }
      }
    } else if (linked.length > 1) {
      console.log("\nℹ️  Multiple linked IG accounts — pick the right IG_USER_ID above and add it to .env.local.")
    } else {
      console.log("\n⚠️  No IG business account linked to any Page. Link your Business IG to a Facebook Page in the IG app, then re-run.")
    }
    return
  }

  if (opts.check) {
    if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
      console.error("❌ Missing IG_USER_ID and/or IG_ACCESS_TOKEN. See content/social/INSTAGRAM-API-SETUP.md")
      process.exit(1)
    }
    const info = await verifyAccount(IG_USER_ID, IG_ACCESS_TOKEN)
    console.log(`\n✅ Token works. Connected to @${info.username} (${info.account_type}, ${info.media_count} posts).`)
    if (info.account_type !== "BUSINESS" && info.account_type !== "CREATOR") {
      console.log("⚠️  Account is not BUSINESS/CREATOR — publishing requires it. Switch in the IG app.")
    }
    return
  }

  // Pick the day, gather its slides + caption.
  const folder = chooseFolder(folders, opts, posted)
  const dir = join(SOCIAL_DIR, folder)
  const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => `slide-${i + 1}.png`)
  for (const s of slides) {
    if (!existsSync(join(dir, s))) throw new Error(`Missing ${join(folder, s)} — rebuild with "npm run build:social".`)
  }
  const captionPath = join(dir, "caption.txt")
  const caption = existsSync(captionPath) ? readFileSync(captionPath, "utf8") : ""

  console.log(`\n🗓️  Target: ${folder}`)
  console.log(`   slides: ${slides.length}   caption: ${caption.split("\n")[0].slice(0, 60)}…`)

  if (!opts.publish) {
    console.log("\n🧪 DRY-RUN (no --publish). Would:")
    console.log("   1. host 5 slides publicly (Supabase Storage or PUBLIC_IMAGE_BASE)")
    console.log("   2. create 5 carousel child containers")
    console.log("   3. create the parent CAROUSEL container with the caption")
    console.log("   4. call media_publish")
    console.log("\n   Re-run with --publish to post for real. Tip: --check first to verify the token.\n")
    return
  }

  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    console.error("❌ Missing IG_USER_ID and/or IG_ACCESS_TOKEN. See content/social/INSTAGRAM-API-SETUP.md")
    process.exit(1)
  }

  console.log("\n🌐 Hosting slides publicly…")
  const imageUrls = await ensurePublicUrls(folder, dir, slides)
  console.log(`   ✓ ${imageUrls.length} public URLs ready`)

  console.log("📤 Publishing carousel to Instagram…")
  const mediaId = await publishCarousel(IG_USER_ID, IG_ACCESS_TOKEN, imageUrls, caption)
  recordPosted(posted, folder, mediaId)
  console.log(`\n✅ Posted ${folder} → media id ${mediaId}. Logged to .posted.json.\n`)
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}\n`)
  process.exit(1)
})
