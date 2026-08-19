import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { localLabels } from '../../../lib/localDevStore';
import type { Label } from './types';

export async function listLabels(projectId: string): Promise<Label[]> {
  if (!isSupabaseConfigured) return localLabels.filter((l) => l.project_id === projectId);
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Label[];
}

export async function createLabel(projectId: string, name: string): Promise<Label> {
  if (!isSupabaseConfigured) {
    const label: Label = {
      id: crypto.randomUUID(),
      project_id: projectId,
      name,
      created_at: new Date().toISOString()
    };
    localLabels.push(label);
    return label;
  }

  const { data, error } = await supabase
    .from('labels')
    .insert({ project_id: projectId, name })
    .select('*')
    .single();

  if (error) throw error;
  return data as Label;
}
