-- Phase 3: Issues become a real creative-work primitive — due dates and
-- project-scoped labels.

create table if not exists public.labels (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists labels_project_id_idx on public.labels (project_id);

alter table public.labels enable row level security;

create policy "Users can view labels on their own projects"
  on public.labels for select
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "Users can insert labels on their own projects"
  on public.labels for insert
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "Users can update labels on their own projects"
  on public.labels for update
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

create policy "Users can delete labels on their own projects"
  on public.labels for delete
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

alter table public.issues
  add column if not exists due_date date,
  add column if not exists label_id uuid references public.labels(id) on delete set null;

create index if not exists issues_label_id_idx on public.issues (label_id);
