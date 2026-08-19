-- Phase 3B: manual ordering for issues within a status group, so work can be
-- dragged and reordered directly instead of only through status/priority menus.

alter table public.issues
  add column if not exists position double precision not null default 0;

create index if not exists issues_position_idx on public.issues (project_id, status, position);
