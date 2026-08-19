import { ChevronDown } from 'lucide-react';
import { PRIORITY_LABELS, PRIORITY_ORDER, type IssuePriority } from '../types';

const PRIORITY_CLASS: Record<IssuePriority, string> = {
  none: 'text-text-muted',
  low: 'text-signal-blue',
  medium: 'text-signal-amber',
  high: 'text-danger'
};

const PRIORITY_DOT: Record<IssuePriority, string> = {
  none: 'bg-text-muted/40',
  low: 'bg-signal-blue',
  medium: 'bg-signal-amber',
  high: 'bg-danger'
};

export function PrioritySelect({
  value,
  onChange
}: {
  value: IssuePriority;
  onChange: (priority: IssuePriority) => void;
}) {
  return (
    <div className="relative flex items-center flex-shrink-0">
      <span className={`absolute left-1.5 w-1.5 h-1.5 rounded-full pointer-events-none ${PRIORITY_DOT[value]}`} />
      <select
        aria-label="Priority"
        value={value}
        onChange={(e) => onChange(e.target.value as IssuePriority)}
        className={`appearance-none bg-transparent pl-5 pr-4 py-0.5 text-[11px] rounded-md hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer ${PRIORITY_CLASS[value]}`}
      >
        {PRIORITY_ORDER.map((priority) => (
          <option key={priority} value={priority} className="bg-surface text-text-primary">
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </select>
      <ChevronDown size={10} className="absolute right-0.5 pointer-events-none text-text-muted" />
    </div>
  );
}
