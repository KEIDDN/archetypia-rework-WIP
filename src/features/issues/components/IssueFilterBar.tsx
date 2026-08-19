import { X } from 'lucide-react';
import { PRIORITY_LABELS, PRIORITY_ORDER, STATUS_LABELS, STATUS_ORDER } from '../types';
import type { IssuePriority, IssueStatus } from '../types';
import type { Label } from '../labels/types';

export type IssueSortKey = 'manual' | 'priority' | 'due_date' | 'created' | 'title';

export interface IssueFilters {
  status: IssueStatus | 'all';
  priority: IssuePriority | 'all';
  labelId: string | 'all';
  sort: IssueSortKey;
}

const SORT_LABELS: Record<IssueSortKey, string> = {
  manual: 'Manual',
  priority: 'Priority',
  due_date: 'Due date',
  created: 'Created',
  title: 'Title'
};

const selectClass =
  'appearance-none bg-surface border border-border rounded-md pl-2 pr-6 py-1 text-[12px] text-text-secondary hover:border-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 cursor-pointer';

export function IssueFilterBar({
  filters,
  labels,
  onChange
}: {
  filters: IssueFilters;
  labels: Label[];
  onChange: (filters: IssueFilters) => void;
}) {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.labelId !== 'all';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as IssueFilters['status'] })}
        className={selectClass}
      >
        <option value="all">All statuses</option>
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as IssueFilters['priority'] })}
        className={selectClass}
      >
        <option value="all">All priorities</option>
        {PRIORITY_ORDER.map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by label"
        value={filters.labelId}
        onChange={(e) => onChange({ ...filters, labelId: e.target.value })}
        className={selectClass}
      >
        <option value="all">All labels</option>
        {labels.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ ...filters, status: 'all', priority: 'all', labelId: 'all' })}
          className="flex items-center gap-1 text-[12px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          <X size={11} />
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <span className="text-[11px] text-text-muted">Sort</span>
        <select
          aria-label="Sort by"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as IssueSortKey })}
          className={selectClass}
        >
          {(Object.keys(SORT_LABELS) as IssueSortKey[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
