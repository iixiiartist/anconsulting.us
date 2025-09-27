# Supabase CLI Workflow (Zero-Code Friendly)

This guide lets you manage your database **without writing custom backend code manually**—just run copy/paste commands and commit auto-generated migration files.

---
## 1. What This Gives You
- Version-controlled schema (no drift between local & production)
- Safe way to evolve tables & functions
- Ability to reset & seed local data quickly
- Future automation (CI/CD) ready

---
## 2. One-Time Local Setup (If You Want Local DB)
1. Install Docker Desktop (required for local Postgres + Supabase services).
2. In a terminal at project root run:
   ```powershell
   npx supabase init
   npx supabase start
   ```
3. Note the printed local keys (you **do NOT** commit them).
4. Open local Studio: http://localhost:54323

If you don't want local dev yet, you can skip this and only use migrations + production.

---
## 3. Baseline Migration (Already Added)
File: `supabase/migrations/20250926T153500Z_baseline_schema.sql` defines:
- visitors, conversations, messages, roles_ledger
- increment_role_occurrence function

That file is your starting point. Do **not** edit it retroactively—create new migrations for changes.

---
## 4. Making a Schema Change (Example)
You want a new column `summary` on `conversations`.

1. Start local stack (optional):
   ```powershell
   npx supabase start
   ```
2. Apply change locally:
   In Studio (local) run:
   ```sql
   alter table public.conversations add column summary text;
   ```
3. Generate a migration from the diff:
   ```powershell
   npx supabase db diff -f add_conversation_summary
   ```
   This creates something like: `supabase/migrations/20250927T101200Z_add_conversation_summary.sql`
4. Review it (ensure it only has what you expect).
5. Commit and push.
6. (Deploy to production) Either:
   - Run the file manually in Supabase SQL editor, OR
   - Link & push (advanced) using CLI:
     ```powershell
     npx supabase link --project-ref <YOUR_PROJECT_REF>
     npx supabase db push
     ```

---
## 5. Seeding Data (Optional)
Put sample rows into `supabase/seed.sql`:
```sql
insert into roles_ledger(normalized_role, raw_phrase) values ('AE','account executive') on conflict do nothing;
```
To rebuild local DB with seed:
```powershell
npx supabase db reset
```

---
## 6. Environment Variables (Production)
Set these in Netlify (already described elsewhere):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_ANON_KEY (optional)
- GEMINI_API_KEY

Redeploy to apply.

---
## 7. Verifying Persistence
1. Open Netlify function logs while chatting.
2. Send a message like: "I'm an AE exploring AI for proposal acceleration".
3. Check Supabase tables → messages, conversations, roles_ledger.
4. Look for log line `[Supabase Persistence] wrote conversation/messages`.

---
## 8. Role Ledger Occurrence Increment
Send another message repeating your role phrase (e.g. "AE") to increment occurrences.
View with:
```sql
select normalized_role, raw_phrase, occurrences from roles_ledger order by last_seen desc;
```

---
## 9. RLS (Row Level Security) – Later
Currently not enabled. When you introduce authenticated users, enable and add policies via a new migration. Until then, service role runs trusted writes.

---
## 10. Common Commands Cheat Sheet
```powershell
npx supabase start          # Start local stack
npx supabase stop           # Stop local stack
npx supabase db diff -f name  # Create migration from local vs baseline
npx supabase db reset       # Rebuild local DB (migrations + seed)
npx supabase link --project-ref <REF>  # Link to prod project
npx supabase db push        # Apply pending migrations to linked project
```

---
## 11. Zero-Code Decision Flow
Need new table? → Add it in local Studio → diff → commit.
Need column change? → Alter locally → diff → commit.
Need function? → Create in local SQL → diff → commit.
Need to test from scratch? → `npx supabase db reset`.

---
## 12. If Something Goes Wrong
- Migration file wrong? Create a NEW corrective migration; don't rewrite history.
- Local diff empty? You forgot to apply schema change first.
- Prod missing a change? Run migration SQL manually or use `db push` after linking.

---
## 13. Next Enhancements (Optional)
A. Conversation summarization column + function
B. Analytics events table (booking/email events)
C. RLS activation & minimal policies
D. PII scrubbing function before insert

Ask for A/B/C/D anytime.

---
**You now have a repeatable system.** Just follow the pattern: change locally → diff → commit → apply to prod.
