# Supabase setup (Phase 1)

Archetypia uses Supabase for authentication and Project persistence.

## 1. Create a project

Create a project at [supabase.com](https://supabase.com), then grab its **Project URL** and **anon/public API key** from Project Settings → API.

## 2. Configure the app

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

## 3. Apply the schema

Run the migrations in `migrations/` against your project, in order — either paste them into the Supabase SQL Editor, or, if you have the Supabase CLI linked to this project, run:

```bash
supabase db push
```

- `0001_create_projects.sql` creates the `projects` table, enables Row Level Security, and adds policies so a user can only read/write their own projects (`owner_id = auth.uid()`).
- `0002_add_brief_and_issues.sql` adds a `brief` column to `projects` (a project's living context — objective, audience, tone, etc.) and creates the `issues` table for tracked creative work, with the same per-owner RLS pattern.

## 4. Email auth

Email/password sign-up is enabled by default on new Supabase projects. If you want to skip email confirmation during local testing, disable "Confirm email" under Authentication → Providers → Email in the Supabase dashboard.
