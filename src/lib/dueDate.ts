import type { IssueStatus } from '../features/issues/types';

export function formatDueDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function isOverdue(date: string, status: IssueStatus): boolean {
  if (status === 'done') return false;
  const [year, month, day] = date.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}
