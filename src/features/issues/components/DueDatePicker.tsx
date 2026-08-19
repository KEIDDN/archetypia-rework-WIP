import { CalendarDays, X } from 'lucide-react';
import { Popover } from '../../../components/ui/Popover';
import { formatDueDate } from '../../../lib/dueDate';
import type { IssueStatus } from '../types';
import { isOverdue } from '../../../lib/dueDate';

export function DueDatePicker({
  value,
  status,
  onChange
}: {
  value: string | null;
  status: IssueStatus;
  onChange: (date: string | null) => void;
}) {
  const overdue = value ? isOverdue(value, status) : false;

  return (
    <Popover
      trigger={({ toggle }) =>
        value ? (
          <button
            type="button"
            onClick={toggle}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-none border transition-colors cursor-pointer ${
              overdue
                ? 'text-danger border-danger/30 hover:border-danger/60'
                : 'text-text-secondary bg-surface-elevated border-border hover:border-text-muted'
            }`}
          >
            <CalendarDays size={10} />
            {formatDueDate(value)}
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-none text-text-muted border border-dashed border-border hover:border-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            <CalendarDays size={10} />
            Due date
          </button>
        )
      }
    >
      {({ close }) => (
        <div className="p-2 space-y-1.5 w-48">
          <input
            type="date"
            autoFocus
            defaultValue={value ?? ''}
            onChange={(e) => {
              onChange(e.target.value || null);
              close();
            }}
            className="w-full bg-surface border border-border rounded-md px-2 py-1.5 text-[12px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                close();
              }}
              className="w-full flex items-center gap-1.5 px-1 py-1 text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
            >
              <X size={11} />
              Remove due date
            </button>
          )}
        </div>
      )}
    </Popover>
  );
}
