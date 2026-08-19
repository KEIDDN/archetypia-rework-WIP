import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { localIssues, LOCAL_DEV_USER_ID } from '../../lib/localDevStore';
import type { CreateIssueInput, Issue, IssuePriority, IssueStatus } from './types';

export async function listIssues(projectId: string): Promise<Issue[]> {
  if (!isSupabaseConfigured) return localIssues.filter((i) => i.project_id === projectId);
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Issue[];
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  if (!isSupabaseConfigured) {
    const issue: Issue = {
      id: crypto.randomUUID(),
      project_id: input.project_id,
      owner_id: LOCAL_DEV_USER_ID,
      title: input.title,
      description: null,
      status: 'todo',
      priority: 'none',
      due_date: null,
      label_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localIssues.unshift(issue);
    return issue;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const ownerId = userData.user?.id;
  if (!ownerId) throw new Error('You must be signed in to create an issue.');

  const { data, error } = await supabase
    .from('issues')
    .insert({ project_id: input.project_id, title: input.title, owner_id: ownerId })
    .select('*')
    .single();

  if (error) throw error;
  return data as Issue;
}

export async function updateIssueStatus(id: string, status: IssueStatus): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.status = status;
    return;
  }
  const { error } = await supabase.from('issues').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateIssuePriority(id: string, priority: IssuePriority): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.priority = priority;
    return;
  }
  const { error } = await supabase.from('issues').update({ priority }).eq('id', id);
  if (error) throw error;
}

export async function updateIssueTitle(id: string, title: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.title = title;
    return;
  }
  const { error } = await supabase.from('issues').update({ title }).eq('id', id);
  if (error) throw error;
}

export async function updateIssueDescription(id: string, description: string | null): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.description = description;
    return;
  }
  const { error } = await supabase.from('issues').update({ description }).eq('id', id);
  if (error) throw error;
}

export async function updateIssueDueDate(id: string, dueDate: string | null): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.due_date = dueDate;
    return;
  }
  const { error } = await supabase.from('issues').update({ due_date: dueDate }).eq('id', id);
  if (error) throw error;
}

export async function updateIssueLabel(id: string, labelId: string | null): Promise<void> {
  if (!isSupabaseConfigured) {
    const issue = localIssues.find((i) => i.id === id);
    if (issue) issue.label_id = labelId;
    return;
  }
  const { error } = await supabase.from('issues').update({ label_id: labelId }).eq('id', id);
  if (error) throw error;
}

export async function deleteIssue(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = localIssues.findIndex((i) => i.id === id);
    if (idx !== -1) localIssues.splice(idx, 1);
    return;
  }
  const { error } = await supabase.from('issues').delete().eq('id', id);
  if (error) throw error;
}
