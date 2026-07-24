-- 0004_events.sql — first-party, immutable business-event audit trail.
-- The lightweight seed of the operational "brain": every significant lifecycle event
-- (webhook received, sale stored, vault unlocked, weekly issue sent, PDF downloaded,
-- refund) lands here as one queryable row. NOT an event bus — just a source of truth
-- that dashboards, the North Star metric, and future automation can all read from.
-- Append-only by convention; service-role only (RLS on, no anon policies).

create table if not exists public.events (
  id       bigint generated always as identity primary key,
  ts       timestamptz not null default now(),
  type     text        not null,            -- e.g. webhook_received, sale_stored, week_sent, pdf_downloaded, sale_refunded
  email    text,                            -- actor, when known (nullable)
  product  text,                            -- product/permalink, when relevant
  source   text,                            -- origin: gumroad_ping, vault_drip, vault_download, ...
  meta     jsonb       not null default '{}'::jsonb
);

create index if not exists events_type_ts_idx on public.events (type, ts desc);
create index if not exists events_email_idx    on public.events (email);
create index if not exists events_ts_idx       on public.events (ts desc);

alter table public.events enable row level security;
-- No policies => only the service-role key (server-side) can read/write.
-- INVARIANT: this table stores PII (email) and must remain service-role-only. NEVER add
-- an anon/authenticated SELECT policy. Belt-and-suspenders explicit revoke:
revoke all on public.events from anon, authenticated;

-- METRICS NOTE: events are append-only with no dedup, so a Gumroad ping retry can insert
-- duplicate sale_stored rows for one sale. Count sales with
--   select count(distinct meta->>'sale_id') from events where type = 'sale_stored'
-- (not count(*)) so retries never inflate the North Star.
