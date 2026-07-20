-- 0003_drip_sends.sql — idempotency ledger for the weekly vault drip.
-- One row per (email, week) that was successfully emailed, so a cron re-run (or an
-- overlapping run) never double-sends the same issue to the same buyer.
-- Service-role only: RLS on, no anon policies (same posture as sales/leads).

create table if not exists public.drip_sends (
  id       bigint generated always as identity primary key,
  email    text        not null,
  week     int         not null check (week between 1 and 6),
  sent_at  timestamptz not null default now(),
  unique (email, week)
);

create index if not exists drip_sends_email_idx on public.drip_sends (email);

alter table public.drip_sends enable row level security;
-- No policies => only the service-role key (used server-side) can read/write.
