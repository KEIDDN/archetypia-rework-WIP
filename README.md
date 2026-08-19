# Archetypia

A creative workspace for brand identity projects. Authenticate, create a Project, and build creative direction inside it.

The original brief → references → Gemini synthesis flow still lives at `/legacy` while it's migrated into the Project model in a later phase.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set:
   - `GEMINI_API_KEY` — used by the `/legacy` flow
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — used for authentication and Projects. See [supabase/README.md](supabase/README.md) to provision a project and apply the schema.
3. Run the app:
   `npm run dev`
