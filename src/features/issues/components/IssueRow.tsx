import { useNavigate } from 'react-router-dom';
import { CalendarDays, GripVertical, Trash2 } from 'lucide-react';
import { formatDueDate, isOverdue } from '../../../lib/dueDate';
import { StatusSelect } from './StatusSelect';
import { PrioritySelect } from './PrioritySelect';
import { LabelBadge } from './LabelBadge';
import type { Issue, IssuePriority, IssueStatus } from '../types';
import type { Label } from '../labels/types';

export function IssueRow({
  issue,
  label,
  draggable,
  dragOver,
  onStatusChange,
  onPriorityChange,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverRow,
  onDropRow
}: {
  issue: Issue;
  label: Label | null;
  draggable: boolean;
  dragOver: boolean;
  onStatusChange: (status: IssueStatus) => void;
  onPriorityChange: (priority: IssuePriority) => void;
  onDelete: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOverRow?: (e: React.DragEvent) => void;
  onDropRow?: (e: React.DragEvent) => void;
}) {
  const navigate = useNavigate();
  const overdue = issue.due_date ? isOverdue(issue.due_date, issue.status) : false;

  const open = () => navigate(`${issue.id}`);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open();
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (!draggable) return;
        e.preventDefault();
        onDragOverRow?.(e);
      }}
      onDrop={(e) => {
        if (!draggable) return;
        e.preventDefault();
        e.stopPropagation();
        onDropRow?.(e);
      }}
      className={`group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/30 border-t-2 ${
        dragOver ? 'border-accent' : 'border-transparent'
      }`}
    >
      {draggable ? (
        <GripVertical
          size={12}
          className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0 -ml-1"
        />
      ) : null}

      <span onClick={(e) => e.stopPropagation()}>
        <StatusSelect value={issue.status} onChange={onStatusChange} />
      </span>

      <span className="flex-1 min-w-0 text-[13px] text-text-primary truncate">{issue.title}</span>

      {label && <LabelBadge name={label.name} />}

      {issue.due_date && (
        <span
          className={`flex-shrink-0 flex items-center gap-1 text-[11px] ${overdue ? 'text-danger' : 'text-text-muted'}`}
        >
          <CalendarDays size={10} />
          {formatDueDate(issue.due_date)}
        </span>
      )}

      <span onClick={(e) => e.stopPropagation()}>
        <PrioritySelect value={issue.priority} onChange={onPriorityChange} />
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete ${issue.title}`}
        className="p-1 text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity cursor-pointer flex-shrink-0"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
