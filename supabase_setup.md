# Supabase Integration Setup

This guide walks you (non-coder friendly) through enabling and safely operating the adaptive memory features added to the chatbot.

## 1. What This Adds

- Stores chat sessions and messages so returning visitors get subtle continuity.
- Detects a visitor's role (e.g., AE, SDR, Partnerships) once and avoids repeating.
- Prepares a roles ledger for future learning (not fully active yet).

If Supabase is unavailable, the chatbot still works normally.

## 2. Environment Variables (Netlify)

In Netlify UI: Site Settings → Build & Deploy → Environment → Edit Variables.

Required:

- `SUPABASE_URL` = <https://YOUR_PROJECT_ID.supabase.co> (wrap this in backticks if you reference it elsewhere)

Optional (choose ONE of these):

- `SUPABASE_SERVICE_ROLE_KEY` (write + read)  → Full persistence (preferred)
- `SUPABASE_ANON_KEY` (read-only)             → Memory load only; no new writes

Recommendation: Use the Service Role key only in serverless functions (never expose client-side). If you start with just the anon key, add the service role later for persistence.

After adding variables, trigger a redeploy (e.g., make a trivial commit) so functions see them.

## 3. Apply the Database Schema

Open Supabase SQL Editor → copy contents of `supabase-schema.sql` → Run.

You should now have tables: `conversations`, `messages`, `roles_ledger` (and optional `visitors`).

alter table public.messages enable row level security;
\n## 4. (Optional) Row Level Security

Right now, RLS is NOT enabled. Because only serverless code (with the service role key) accesses data, this is acceptable for early internal use.

If you later expose client-side read queries directly with anon key for dashboards, enable RLS:

```sql
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
```

Then create policies (example open policy for experimentation ONLY):

```sql
create policy "Open read conversations" on public.conversations for select using (true);
create policy "Open read messages" on public.messages for select using (true);
```

Tighten later with proper auth.

## 5. Verifying It Works

1. Add `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_URL`.
2. Deploy site.
3. Open site, send a message that mentions a role: "I'm a sales engineer exploring accuracy."  
4. In Supabase SQL editor:

```sql
select * from conversations order by started_at desc limit 5;
select * from messages order by created_at desc limit 10;
```

1. Reload site (same browser) and send a new message. The backend will enrich context silently.

## 6. How To Reset / Purge Data

```sql
truncate table public.messages cascade;
truncate table public.conversations cascade;
truncate table public.roles_ledger;
```

\n## 7. Key Rotation

If a key is ever exposed:

- Go to Settings → API → Roll the key.
- Update Netlify environment variable.
- Redeploy.

## 8. Role Ledger Automation (Now Active)

When the backend detects a role for the first time in a session (AE, SDR/BDR, etc.) it now:

1. Upserts a row into `roles_ledger` with the normalized role and the raw phrase encountered.
2. Calls the helper function `increment_role_occurrence` to bump `occurrences` + refresh `last_seen`.

You can inspect roles learned so far:

```sql
select normalized_role, count(*) as variant_count,
       sum(occurrences) as total_occurrences
from roles_ledger
group by normalized_role
order by total_occurrences desc;
```

List raw variants for a specific normalized role (example SDR/BDR):

```sql
select raw_phrase, occurrences, last_seen
from roles_ledger
where normalized_role = 'SDR/BDR'
order by occurrences desc;
```

## 9. Future Enhancements (Supported by Current Schema)

- Role variant normalization (map raw phrases → canonical form beyond current tag mapping).
- Memory summarization table (store short abstract instead of raw tail messages).
- Per-visitor analytics (extend `visitors` table or add `events`).
- Role frequency analysis via a materialized view.

## 10. Privacy Considerations

Currently storing:

- Visitor ID (anonymous, generated in browser)
- Session ID
- Messages (raw text)
- Email if the user provides it voluntarily

If you need redaction, add a cleaning step before inserts (e.g., regex mask emails/keys except the captured email field).

## 11. Troubleshooting

| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| No rows in tables | Env vars missing | Add `SUPABASE_URL` + key → redeploy |
| Writes not happening | Only anon key present | Add service role key |
| Function error logs mention Supabase | Bad key or network issue | Regenerate key or retry |

## 12. Safe Local Testing (Optional)

If you ever run this locally, create a `.env` file (not committed) with:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 13. Minimal SQL Snippets

Check most recent 5 conversations:

```sql
select session_id, visitor_id, role_detected, last_message_at
from conversations
order by last_message_at desc
limit 5;
```

Last 10 assistant responses:

```sql
select content
from messages
where role='assistant'
order by created_at desc
limit 10;
```

---
Questions or want the adaptive role-learning layer added next? Just ask.
