import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useCommandPalette } from './CommandPaletteContext';
import { useCommands } from './useCommands';
import type { Command } from './types';

const CATEGORY_ORDER = ['Navigation', 'Projects', 'Work'];

function filterCommands(commands: Command[], query: string): Command[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return commands;
  return commands.filter((c) => `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(trimmed));
}

function groupCommands(commands: Command[]): { category: string; items: Command[] }[] {
  const groups = new Map<string, Command[]>();
  for (const command of commands) {
    if (!groups.has(command.category)) groups.set(command.category, []);
    groups.get(command.category)!.push(command);
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((category) => ({ category, items: groups.get(category)! }));
}

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const commands = useCommands(open);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCommands(commands, query), [commands, query]);
  const grouped = useMemo(() => groupCommands(filtered), [filtered]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runCommand = (command: Command) => {
    setOpen(false);
    command.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = filtered[activeIndex];
      if (command) runCommand(command);
    }
  };

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface-elevated border border-border rounded-lg shadow-2xl overflow-hidden font-ui"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
          <Search size={14} className="text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or jump to…"
            className="flex-1 min-w-0 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5">esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1.5">
          {grouped.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-text-muted">No results.</p>
          )}
          {grouped.map((group) => (
            <div key={group.category} className="py-1">
              <p className="px-4 py-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                {group.category}
              </p>
              {group.items.map((command) => {
                flatIndex += 1;
                const isActive = flatIndex === activeIndex;
                return (
                  <button
                    key={command.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    onClick={() => runCommand(command)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-left transition-colors cursor-pointer ${
                      isActive ? 'bg-surface text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <span className="text-text-muted flex-shrink-0">{command.icon}</span>
                    <span className="truncate">{command.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
