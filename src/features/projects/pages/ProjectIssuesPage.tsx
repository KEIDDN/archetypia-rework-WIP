import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { CreateIssueForm } from '../../issues/components/CreateIssueForm';
import { IssueRow } from '../../issues/components/IssueRow';
import { createIssue, deleteIssue, listIssues, updateIssuePriority, updateIssueStatus } from '../../issues/issueService';
import { STATUS_LABELS, STATUS_ORDER, type Issue, type IssuePriority, type IssueStatus } from '../../issues/types';
import type { ProjectOutletContext } from '../ProjectLayout';

export function ProjectIssuesPage() {
  const { project } = useOutletContext<ProjectOutletContext>();
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setIssues(null);
    listIssues(project.id)
      .then(setIssues)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load issues.'));
  };

  useEffect(load, [project.id]);

  const handleCreate = async (title: string) => {
    const created = await createIssue({ project_id: project.id, title });
    setIssues((prev) => [created, ...(prev ?? [])]);
  };

  const handleStatusChange = (id: string, status: IssueStatus) => {
    setIssues((prev) => prev?.map((i) => (i.id === id ? { ...i, status } : i)) ?? null);
    updateIssueStatus(id, status).catch(load);
  };

  const handlePriorityChange = (id: string, priority: IssuePriority) => {
    setIssues((prev) => prev?.map((i) => (i.id === id ? { ...i, priority } : i)) ?? null);
    updateIssuePriority(id, priority).catch(load);
  };

  const handleDelete = (id: string) => {
    setIssues((prev) => prev?.filter((i) => i.id !== id) ?? null);
    deleteIssue(id).catch(load);
  };

  if (error) {
    return (
      <EmptyState
        title="Couldn't load issues"
        description={error}
        action={
          <Button variant="secondary" onClick={load}>
            <RefreshCcw size={12} />
            Retry
          </Button>
        }
      />
    );
  }

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
          {STATUS_ORDER.map((status) => {
            const group = issues.filter((i) => i.status === status);
            if (group.length === 0) return null;
            return (
              <div key={status} className="space-y-1">
                <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                  {STATUS_LABELS[status]} · {group.length}
                </p>
                {group.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    onStatusChange={(s) => handleStatusChange(issue.id, s)}
                    onPriorityChange={(p) => handlePriorityChange(issue.id, p)}
                    onDelete={() => handleDelete(issue.id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
