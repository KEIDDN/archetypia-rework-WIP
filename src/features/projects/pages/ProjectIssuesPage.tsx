import { useState } from 'react';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { CreateIssueForm } from '../../issues/components/CreateIssueForm';
import { IssueRow } from '../../issues/components/IssueRow';
import { createIssue, deleteIssue, updateIssuePriority, updateIssueStatus } from '../../issues/issueService';
import { summarizeIssues } from '../../issues/pulse';
import type { IssuePriority, IssueStatus } from '../../issues/types';
import { useCurrentProject } from '../CurrentProjectContext';

export function ProjectIssuesPage() {
  const { project, issues, setIssues, reload } = useCurrentProject();
  const [doneExpanded, setDoneExpanded] = useState(false);
  if (!project) return null;

  const handleCreate = async (title: string) => {
    const created = await createIssue({ project_id: project.id, title });
    setIssues((prev) => [created, ...(prev ?? [])]);
  };

  const handleStatusChange = (id: string, status: IssueStatus) => {
    setIssues((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? null);
    updateIssueStatus(id, status).catch(reload);
  };

  const handlePriorityChange = (id: string, priority: IssuePriority) => {
    setIssues((prev) => prev?.map((i) => (i.id === id ? { ...i, priority } : i)) ?? null);
    updateIssuePriority(id, priority).catch(reload);
  };

  const handleDelete = (id: string) => {
    setIssues((prev) => prev?.filter((i) => i.id !== id) ?? null);
    deleteIssue(id).catch(reload);
  };

  const todo = issues?.filter((i) => i.status === 'todo') ?? [];
  const inProgress = issues?.filter((i) => i.status === 'in_progress') ?? [];
  const done = issues?.filter((i) => i.status === 'done') ?? [];
  const summary = issues ? summarizeIssues(issues) : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <CreateIssueForm onCreate={handleCreate} />

      {issues === null ? (
        <div className="py-16 flex justify-center">
          <RefreshCcw size={16} className="animate-spin text-text-muted" />
        </div>
      ) : issues.length === 0 ? (
        <EmptyState title="No work tracked yet" description="Add the first issue to start tracking what needs doing." />
      ) : (
        <div className="space-y-6">
          {summary && (
            <p className="px-3 text-[12px] text-text-secondary">
              {summary.todo} todo · {summary.inProgress} in progress · {summary.done} done
            </p>
          )}

          {todo.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">Todo · {todo.length}</p>
              {todo.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  onStatusChange={(s) => handleStatusChange(issue.id, s)}
                  onPriorityChange={(p) => handlePriorityChange(issue.id, p)}
                  onDelete={() => handleDelete(issue.id)}
                />
              ))}
            </div>
          )}

          {inProgress.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                In Progress · {inProgress.length}
              </p>
              {inProgress.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  onStatusChange={(s) => handleStatusChange(issue.id, s)}
                  onPriorityChange={(p) => handlePriorityChange(issue.id, p)}
                  onDelete={() => handleDelete(issue.id)}
                />
              ))}
            </div>
          )}

          {done.length > 0 && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setDoneExpanded((v) => !v)}
                className="flex items-center gap-1 px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              >
                <ChevronRight size={11} className={`transition-transform ${doneExpanded ? 'rotate-90' : ''}`} />
                Done · {done.length}
              </button>
              {doneExpanded &&
                done.map((issue) => (
                  <div key={issue.id} className="opacity-60">
                    <IssueRow
                      issue={issue}
                      onStatusChange={(s) => handleStatusChange(issue.id, s)}
                      onPriorityChange={(p) => handlePriorityChange(issue.id, p)}
                      onDelete={() => handleDelete(issue.id)}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
