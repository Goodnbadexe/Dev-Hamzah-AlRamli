// === METADATA ===
// Purpose: Apply a SQL migration to the Supabase/Postgres DB using the connection
//          string injected by the Vercel Supabase integration. Run AFTER
//          `vercel env pull .env.local` (or with the vars exported).
// Run:     node scripts/run-migration.mjs supabase/migrations/0001_leads.sql
// Conn:    prefers a direct (non-pooling) URL for DDL.
// === END METADATA ===
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import pg from "pg"

// Load .env.local if present (vercel env pull writes here) without extra deps.
try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {
  // no .env.local — rely on already-exported env
}

const CONN =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL

if (!CONN) {
  console.error("No DB connection string found (POSTGRES_URL_NON_POOLING / POSTGRES_URL / SUPABASE_DB_URL / DATABASE_URL).")
  process.exit(1)
}

const file = process.argv[2] || "supabase/migrations/0001_leads.sql"
const sql = readFileSync(resolve(process.cwd(), file), "utf8")

const client = new pg.Client({ connectionString: CONN, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  await client.query(sql)
  console.log(`✓ Applied ${file}`)
  const { rows } = await client.query(
    "select count(*)::int as n from information_schema.tables where table_schema='public' and table_name='leads'",
  )
  console.log(rows[0].n === 1 ? "✓ public.leads exists" : "✗ leads table not found")
} catch (e) {
  console.error("Migration failed:", e.message)
  process.exitCode = 1
} finally {
  await client.end()
}
