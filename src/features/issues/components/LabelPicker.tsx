import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Popover } from '../../../components/ui/Popover';
import { createLabel } from '../labels/labelService';
import type { Label } from '../labels/types';

export function LabelPicker({
  projectId,
  labels,
  value,
  onCreate,
  onChange
}: {
  projectId: string;
  labels: Label[];
  value: string | null;
  onCreate: (label: Label) => void;
  onChange: (labelId: string | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);

  const current = labels.find((l) => l.id === value) ?? null;
  const filtered = labels.filter((l) => l.name.toLowerCase().includes(query.trim().toLowerCase()));
  const exactMatch = labels.some((l) => l.name.toLowerCase() === query.trim().toLowerCase());

  const handleCreate = async (close: () => void) => {
    const name = query.trim();
    if (!name || busy) return;
    setBusy(true);
    try {
      const label = await createLabel(projectId, name);
      onCreate(label);
      onChange(label.id);
      setQuery('');
      close();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Popover
      trigger={({ toggle }) =>
        current ? (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-none text-text-secondary bg-surface-elevated border border-border hover:border-text-muted transition-colors cursor-pointer"
          >
            {current.name}
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-none text-text-muted border border-dashed border-border hover:border-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            <Tag size={10} />
            Label
          </button>
        )
      }
    >
      {({ close }) => (
        <div className="w-56">
          <div className="px-2 pb-1.5 border-b border-border">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !exactMatch && query.trim()) handleCreate(close);
              }}
              placeholder="Filter or create…"
              className="w-full bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none py-1"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {current && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  close();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-text-muted hover:bg-surface hover:text-text-secondary transition-colors cursor-pointer"
              >
                <X size={11} />
                Remove label
              </button>
            )}
            {filtered.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => {
                  onChange(label.id);
                  close();
                }}
                className={`w-full text-left px-2.5 py-1.5 text-[12px] hover:bg-surface transition-colors cursor-pointer ${
                  label.id === value ? 'text-text-primary font-medium' : 'text-text-secondary'
                }`}
              >
                {label.name}
              </button>
            ))}
            {filtered.length === 0 && !query && (
              <p className="px-2.5 py-1.5 text-[12px] text-text-muted">No labels yet.</p>
            )}
            {query.trim() && !exactMatch && (
              <button
                type="button"
                onClick={() => handleCreate(close)}
                disabled={busy}
                className="w-full text-left px-2.5 py-1.5 text-[12px] text-accent hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
              >
                Create "{query.trim()}"
              </button>
            )}
          </div>
        </div>
      )}
    </Popover>
  );
}
