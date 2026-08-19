export type IssueStatus = 'todo' | 'in_progress' | 'done';
export type IssuePriority = 'none' | 'low' | 'medium' | 'high';

export interface Issue {
  id: string;
  project_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  due_date: string | null;
  label_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueInput {
  project_id: string;
  title: string;
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done'
};

export const STATUS_ORDER: IssueStatus[] = ['todo', 'in_progress', 'done'];

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  none: 'No priority',
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const PRIORITY_ORDER: IssuePriority[] = ['none', 'low', 'medium', 'high'];
