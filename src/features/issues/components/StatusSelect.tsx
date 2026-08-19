import { Circle, CircleDot, CheckCircle2 } from 'lucide-react';
import { STATUS_LABELS, STATUS_ORDER, type IssueStatus } from '../types';

const STATUS_ICON: Record<IssueStatus, React.ReactNode> = {
  todo: <Circle size={13} className="text-text-muted" />,
  in_progress: <CircleDot size={13} className="text-signal-blue" />,
  done: <CheckCircle2 size={13} className="text-signal-green" />
};

export function StatusSelect({ value, onChange }: { value: IssueStatus; onChange: (status: IssueStatus) => void }) {
  return (
    <div className="relative flex items-center flex-shrink-0">
      <select
        aria-label="Status"
        value={value}
        onChange={(e) => onChange(e.target.value as IssueStatus)}
        className="appearance-none bg-transparent pl-5 pr-1 py-0.5 text-[12px] text-text-secondary rounded-md hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer"
      >
        {STATUS_ORDER.map((status) => (
          <option key={status} value={status} className="bg-surface text-text-primary">
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <span className="absolute left-1 pointer-events-none">{STATUS_ICON[value]}</span>
    </div>
  );
}
