import type { Issue } from './types';

export function summarizeIssues(issues: Issue[]) {
  const todo = issues.filter((i) => i.status === 'todo').length;
  const inProgress = issues.filter((i) => i.status === 'in_progress').length;
  const done = issues.filter((i) => i.status === 'done').length;
  return { todo, inProgress, done, total: issues.length, open: todo + inProgress };
}
