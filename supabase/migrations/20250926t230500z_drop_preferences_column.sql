-- Migration: Drop unused preferences column from visitors
-- Rollback of adaptive preference system
-- Executed at 2025-09-26

ALTER TABLE public.visitors
    DROP COLUMN IF EXISTS preferences;

-- Verification queries (optional to run manually):
-- \d+ public.visitors
-- SELECT * FROM public.visitors LIMIT 5;
