-- === METADATA ===
-- Purpose: `leads` table for the /subscribe funnel + promotion form. Every email
--          signup is written here (in addition to Telegram/SMTP delivery).
-- Security: RLS ON with NO anon/public policies. Inserts happen only from the
--           server route using the service-role key, which bypasses RLS — so the
--           table is writable by the API but closed to the browser/anon key.
-- Apply:   supabase db push  (or paste into the Supabase SQL editor).
-- === END METADATA ===

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  plan         text,                                   -- duration id: trial | month | quarter
  bundle       text,                                   -- tier: single | duo | all
  promo        text,
  tracks       text[] not null default '{}',           -- selected vault tracks
  tool         text,                                   -- claude | codex | gemini | chatgpt | other
  os           text,                                   -- windows | linux | macos
  read_factor  smallint check (read_factor between 0 and 100),
  answers      jsonb not null default '{}'::jsonb,     -- full raw quiz answers
  source       text not null default 'funnel'          -- funnel | promo
);

create index if not exists leads_email_idx      on public.leads (email);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);

alter table public.leads enable row level security;
-- (intentionally no policies: only the service-role server route writes here)
