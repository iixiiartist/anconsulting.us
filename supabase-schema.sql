-- Supabase schema for chatbot adaptive context
-- Run these in your Supabase SQL editor

-- 1. Visitors (optional if using anonymous hashed id only)
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_id text unique not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

-- 2. Conversations (session-level grouping)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visitor_id text not null,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  email text,
  role_detected text,
  constraint conversations_unique_session unique(session_id)
);
create index if not exists conversations_visitor_idx on public.conversations(visitor_id);

-- 3. Messages
create table if not exists public.messages (
  id bigserial primary key,
  conversation_id uuid references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id);

-- 4. Roles Ledger (distinct roles encountered across visitors)
create table if not exists public.roles_ledger (
  id bigserial primary key,
  normalized_role text not null,
  raw_phrase text not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  occurrences int not null default 1
);
create unique index if not exists roles_ledger_unique_raw on public.roles_ledger(raw_phrase);

-- 5. Materialized Stats View (optional)
-- create materialized view public.role_stats as
-- select normalized_role, count(*) as variants from public.roles_ledger group by 1;

-- Row Level Security (enable and create policies as needed)
-- alter table public.conversations enable row level security;
-- alter table public.messages enable row level security;

-- Example policy (if you later use user auth):
-- create policy "Allow all" on public.conversations for all using (true);

-- 6. Helper function: increment role occurrence (idempotent call pattern)
-- Creates function only if not exists (Postgres 14+: use create or replace safe approach)
create or replace function public.increment_role_occurrence(p_raw_phrase text)
returns void as $$
begin
  update public.roles_ledger
    set occurrences = occurrences + 1,
        last_seen = now()
  where raw_phrase = p_raw_phrase;
end;
$$ language plpgsql security definer;

-- (Optional) You can later add RLS + policy for roles_ledger similar to others.
