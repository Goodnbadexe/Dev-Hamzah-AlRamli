-- === METADATA ===
-- Purpose: `sales` table for Gumroad purchases, fed by the Gumroad "Ping"
--          webhook (app/api/gumroad/ping). Unifies real buyers with the website
--          waitlist/leads — one Supabase, every email + every sale.
-- Security: RLS ON, no anon policies. Only the service-role server route writes.
-- Apply:   supabase db push (or paste into the Supabase SQL editor).
-- === END METADATA ===

create extension if not exists pgcrypto;

create table if not exists public.sales (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  sale_id             text unique,            -- Gumroad sale id (idempotency key)
  order_number        text,
  email               text not null,
  product_name        text,
  product_permalink   text,
  price_cents         integer,                -- Gumroad sends price in cents
  currency            text,
  recurrence          text,                   -- monthly | yearly | …
  subscription_id     text,
  is_recurring_charge boolean default false,  -- false = first charge, true = renewal
  refunded            boolean default false,
  offer_code          text,
  raw                 jsonb not null default '{}'::jsonb
);

create index if not exists sales_email_idx       on public.sales (email);
create index if not exists sales_created_at_idx   on public.sales (created_at desc);

alter table public.sales enable row level security;
-- (no anon policies: only the service-role Ping route writes here)
