-- Migration: add visitor conversational preference profiling
-- Timestamp: 2025-09-26T21:05:00Z

alter table public.visitors
  add column if not exists preferences jsonb default '{}'::jsonb;

-- Optional future index if querying by keys frequently (commented for now)
-- create index if not exists visitors_prefs_gin on public.visitors using gin (preferences jsonb_path_ops);
