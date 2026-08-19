import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { localProjects } from '../../lib/localDevStore';
import { normalizeBrief, type CreativeBrief } from './brief/types';
import type { CreateProjectInput, Project } from './types';

function mapProjectRow(row: Record<string, unknown>): Project {
  return { ...row, brief: normalizeBrief(row.brief) } as Project;
}

export async function listProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return localProjects;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapProjectRow);
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured) return localProjects.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();

  if (error) throw error;
  return data ? mapProjectRow(data) : null;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  if (!isSupabaseConfigured) {
    const project: Project = {
      id: crypto.randomUUID(),
      owner_id: 'local-dev-user',
      name: input.name,
      description: input.description || null,
      brief: normalizeBrief({}),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localProjects.unshift(project);
    return project;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const ownerId = userData.user?.id;
  if (!ownerId) throw new Error('You must be signed in to create a project.');

  const { data, error } = await supabase
    .from('projects')
    .insert({ name: input.name, description: input.description || null, owner_id: ownerId })
    .select('*')
    .single();

  if (error) throw error;
  return mapProjectRow(data);
}

export async function updateProjectBrief(id: string, brief: CreativeBrief): Promise<void> {
  if (!isSupabaseConfigured) {
    const project = localProjects.find((p) => p.id === id);
    if (project) project.brief = brief;
    return;
  }
  const { error } = await supabase.from('projects').update({ brief }).eq('id', id);
  if (error) throw error;
}
