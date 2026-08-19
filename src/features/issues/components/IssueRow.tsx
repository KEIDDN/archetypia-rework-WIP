import { Trash2 } from 'lucide-react';
import { timeAgo } from '../../../lib/timeAgo';
import { StatusSelect } from './StatusSelect';
import { PrioritySelect } from './PrioritySelect';
import type { Issue, IssuePriority, IssueStatus } from '../types';

export function IssueRow({
  issue,
  onStatusChange,
  onPriorityChange,
  onDelete
}: {
  issue: Issue;
  onStatusChange: (status: IssueStatus) => void;
  onPriorityChange: (priority: IssuePriority) => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface transition-colors">
      <StatusSelect value={issue.status} onChange={onStatusChange} />

      <span className="flex-1 min-w-0 text-[13px] text-text-primary truncate">{issue.title}</span>

      <PrioritySelect value={issue.priority} onChange={onPriorityChange} />

      <span className="w-8 flex-shrink-0 text-[11px] text-text-muted text-right">{timeAgo(issue.created_at)}</span>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${issue.title}`}
        className="p-1 text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity cursor-pointer flex-shrink-0"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
