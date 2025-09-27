-- Baseline schema migration generated manually from supabase-schema.sql
-- Timestamp: 2025-09-26T15:35:00Z
-- This establishes initial tables & function so future diffs are clean.

-- 1. Visitors
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_id text unique not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

-- 2. Conversations
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

-- 4. Roles Ledger
create table if not exists public.roles_ledger (
  id bigserial primary key,
  normalized_role text not null,
  raw_phrase text not null,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  occurrences int not null default 1
);
create unique index if not exists roles_ledger_unique_raw on public.roles_ledger(raw_phrase);

-- 5. Helper function
create or replace function public.increment_role_occurrence(p_raw_phrase text)
returns void as $$
begin
  update public.roles_ledger
    set occurrences = occurrences + 1,
        last_seen = now()
  where raw_phrase = p_raw_phrase;
end;
$$ language plpgsql security definer;

-- End baseline