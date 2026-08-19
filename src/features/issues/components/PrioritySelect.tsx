import { ChevronDown } from 'lucide-react';
import { PRIORITY_LABELS, PRIORITY_ORDER, type IssuePriority } from '../types';

const PRIORITY_CLASS: Record<IssuePriority, string> = {
  none: 'text-text-muted',
  low: 'text-text-muted',
  medium: 'text-text-secondary',
  high: 'text-text-primary'
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
      <select
        aria-label="Priority"
        value={value}
        onChange={(e) => onChange(e.target.value as IssuePriority)}
        className={`appearance-none bg-transparent pl-2 pr-4 py-0.5 text-[11px] rounded-md hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer ${PRIORITY_CLASS[value]}`}
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
