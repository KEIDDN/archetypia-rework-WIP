import { useMemo, useState } from 'react';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CreateIssueForm } from '../../issues/components/CreateIssueForm';
import { IssueRow } from '../../issues/components/IssueRow';
import { IssueFilterBar, type IssueFilters } from '../../issues/components/IssueFilterBar';
import { createIssue, deleteIssue, moveIssue, updateIssuePriority, updateIssueStatus } from '../../issues/issueService';
import { summarizeIssues } from '../../issues/pulse';
import { PRIORITY_ORDER } from '../../issues/types';
import type { Issue, IssuePriority, IssueStatus } from '../../issues/types';
import { useCurrentProject } from '../CurrentProjectContext';

const DEFAULT_FILTERS: IssueFilters = { status: 'all', priority: 'all', labelId: 'all', sort: 'manual' };

function sortIssues(issues: Issue[], sort: IssueFilters['sort']): Issue[] {
  const sorted = [...issues];
  switch (sort) {
    case 'priority':
      return sorted.sort((a, b) => PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority));
    case 'due_date':
      return sorted.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      });
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'created':
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case 'manual':
    default:
      return sorted.sort((a, b) => a.position - b.position);
  }
}

export function ProjectIssuesPage() {
  const { project, issues, setIssues, labels, reload } = useCurrentProject();
  const [doneExpanded, setDoneExpanded] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>(DEFAULT_FILTERS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const manualSort = filters.sort === 'manual';

  const filteredSorted = useMemo(() => {
    if (!issues) return [];
    const filtered = issues.filter((i) => {
      if (filters.status !== 'all' && i.status !== filters.status) return false;
      if (filters.priority !== 'all' && i.priority !== filters.priority) return false;
      if (filters.labelId !== 'all' && i.label_id !== filters.labelId) return false;
      return true;
    });
    return sortIssues(filtered, filters.sort);
  }, [issues, filters]);

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

  const applyMove = (id: string, status: IssueStatus, position: number) => {
    setIssues((prev) => prev?.map((i) => (i.id === id ? { ...i, status, position } : i)) ?? null);
    moveIssue(id, { status, position }).catch(reload);
    setDraggedId(null);
    setDragOverId(null);
  };

  const dropOnRow = (groupItems: Issue[], targetIndex: number, status: IssueStatus) => {
    if (!draggedId) return;
    const target = groupItems[targetIndex];
    if (!target || target.id === draggedId) return;
    const prev = groupItems[targetIndex - 1];
    const position = prev ? (prev.position + target.position) / 2 : target.position - 1;
    applyMove(draggedId, status, position);
  };

  const dropOnGroupEnd = (groupItems: Issue[], status: IssueStatus) => {
    if (!draggedId) return;
    const last = groupItems[groupItems.length - 1];
    if (last && last.id === draggedId) return;
    const position = last ? last.position + 1 : 0;
    applyMove(draggedId, status, position);
  };

  const labelFor = (labelId: string | null) => (labelId ? labels.find((l) => l.id === labelId) ?? null : null);

  const todo = filteredSorted.filter((i) => i.status === 'todo');
  const inProgress = filteredSorted.filter((i) => i.status === 'in_progress');
  const done = filteredSorted.filter((i) => i.status === 'done');
  const summary = issues ? summarizeIssues(issues) : null;

  const renderRow = (groupItems: Issue[], status: IssueStatus) => (issue: Issue, index: number) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      label={labelFor(issue.label_id)}
      draggable={manualSort}
      dragOver={dragOverId === issue.id}
      onStatusChange={(s) => handleStatusChange(issue.id, s)}
      onPriorityChange={(p) => handlePriorityChange(issue.id, p)}
      onDelete={() => handleDelete(issue.id)}
      onDragStart={() => setDraggedId(issue.id)}
      onDragEnd={() => {
        setDraggedId(null);
        setDragOverId(null);
      }}
      onDragOverRow={() => setDragOverId(issue.id)}
      onDropRow={() => dropOnRow(groupItems, index, status)}
    />
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <CreateIssueForm onCreate={handleCreate} />

      {issues === null ? (
        <div className="py-16 flex justify-center">
          <RefreshCcw size={16} className="animate-spin text-text-muted" />
        </div>
      ) : issues.length === 0 ? (
        <EmptyState
          title="Nothing on the board yet"
          description="Add the next piece of work for this project."
        />
      ) : (
        <div className="space-y-6">
          <IssueFilterBar filters={filters} labels={labels} onChange={setFilters} />

          {summary && (
            <p className="px-3 text-[12px] text-text-secondary">
              {summary.todo} todo · {summary.inProgress} in progress · {summary.done} done
            </p>
          )}

          {filteredSorted.length === 0 ? (
            <EmptyState title="No matching work" description="Try clearing a filter to see more." />
          ) : (
            <>
              {(todo.length > 0 || (manualSort && draggedId)) && (
                <div
                  className="space-y-1 min-h-[2px]"
                  onDragOver={(e) => manualSort && e.preventDefault()}
                  onDrop={(e) => {
                    if (!manualSort) return;
                    e.preventDefault();
                    dropOnGroupEnd(todo, 'todo');
                  }}
                >
                  <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                    Todo · {todo.length}
                  </p>
                  {todo.map(renderRow(todo, 'todo'))}
                </div>
              )}

              {(inProgress.length > 0 || (manualSort && draggedId)) && (
                <div
                  className="space-y-1 min-h-[2px]"
                  onDragOver={(e) => manualSort && e.preventDefault()}
                  onDrop={(e) => {
                    if (!manualSort) return;
                    e.preventDefault();
                    dropOnGroupEnd(inProgress, 'in_progress');
                  }}
                >
                  <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                    In Progress · {inProgress.length}
                  </p>
                  {inProgress.map(renderRow(inProgress, 'in_progress'))}
                </div>
              )}

              {(done.length > 0 || (manualSort && draggedId)) && (
                <div
                  className="space-y-1"
                  onDragOver={(e) => manualSort && e.preventDefault()}
                  onDrop={(e) => {
                    if (!manualSort) return;
                    e.preventDefault();
                    dropOnGroupEnd(done, 'done');
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDoneExpanded((v) => !v)}
                    className="flex items-center gap-1 px-3 text-[11px] font-medium uppercase tracking-wide text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <ChevronRight size={11} className={`transition-transform ${doneExpanded ? 'rotate-90' : ''}`} />
                    Done · {done.length}
                  </button>
                  {doneExpanded && (
                    <div className="opacity-60 space-y-1">{done.map(renderRow(done, 'done'))}</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
