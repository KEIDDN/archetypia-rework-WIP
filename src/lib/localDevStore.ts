/**
 * In-memory data used when Supabase isn't configured yet (no .env.local).
 * Lets the app be browsed and clicked through locally before a real backend
 * is wired up. Every read/write path that touches this is gated behind
 * `isSupabaseConfigured` in lib/supabase.ts, so none of it runs once real
 * credentials are set.
 */
import { normalizeBrief } from '../features/projects/brief/types';
import type { Project } from '../features/projects/types';
import type { Issue } from '../features/issues/types';
import type { Label } from '../features/issues/labels/types';

export const LOCAL_DEV_USER_ID = 'local-dev-user';

export const localProjects: Project[] = [
  {
    id: 'local-project-1',
    owner_id: LOCAL_DEV_USER_ID,
    name: 'Lumen Coffee Roastery',
    description: 'Independent coffee roastery launching its first retail space in Lisbon.',
    brief: normalizeBrief({}),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const localIssues: Issue[] = [];

export const localLabels: Label[] = [];
