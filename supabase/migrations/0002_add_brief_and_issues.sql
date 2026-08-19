-- Phase 2: Brief becomes project knowledge, and Issues become a first-class
-- unit of tracked creative work.

alter table public.projects
  add column if not exists brief jsonb not null default '{}'::jsonb;

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'none' check (priority in ('none', 'low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists issues_project_id_idx on public.issues (project_id);
create index if not exists issues_owner_id_idx on public.issues (owner_id);

alter table public.issues enable row level security;

create policy "Users can view their own issues"
  on public.issues for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own issues"
  on public.issues for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own issues"
  on public.issues for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete their own issues"
  on public.issues for delete
  using (auth.uid() = owner_id);

create trigger issues_set_updated_at
  before update on public.issues
  for each row
  execute function public.set_updated_at();
