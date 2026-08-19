import { Circle, CircleDot, CheckCircle2, Trash2, ChevronDown } from 'lucide-react';
import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
  type Issue,
  type IssuePriority,
  type IssueStatus
} from '../types';

const STATUS_ICON: Record<IssueStatus, React.ReactNode> = {
  todo: <Circle size={13} className="text-text-muted" />,
  in_progress: <CircleDot size={13} className="text-accent" />,
  done: <CheckCircle2 size={13} className="text-text-secondary" />
};

const PRIORITY_CLASS: Record<IssuePriority, string> = {
  none: 'text-text-muted',
  low: 'text-text-muted',
  medium: 'text-text-secondary',
  high: 'text-text-primary'
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

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
      <div className="relative flex items-center flex-shrink-0">
        <select
          aria-label="Status"
          value={issue.status}
          onChange={(e) => onStatusChange(e.target.value as IssueStatus)}
          className="appearance-none bg-transparent pl-5 pr-1 py-0.5 text-[12px] text-text-secondary rounded-md hover:bg-surface-elevated focus:outline-none cursor-pointer"
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status} className="bg-surface text-text-primary">
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <span className="absolute left-1 pointer-events-none">{STATUS_ICON[issue.status]}</span>
      </div>

      <span className="flex-1 min-w-0 text-[13px] text-text-primary truncate">{issue.title}</span>

      <div className="relative flex items-center flex-shrink-0">
        <select
          aria-label="Priority"
          value={issue.priority}
          onChange={(e) => onPriorityChange(e.target.value as IssuePriority)}
          className={`appearance-none bg-transparent pl-2 pr-4 py-0.5 text-[11px] rounded-md hover:bg-surface-elevated focus:outline-none cursor-pointer ${PRIORITY_CLASS[issue.priority]}`}
        >
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority} className="bg-surface text-text-primary">
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
        <ChevronDown size={10} className="absolute right-0.5 pointer-events-none text-text-muted" />
      </div>

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
