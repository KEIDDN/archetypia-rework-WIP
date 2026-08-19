import { useRef, useState, type FormEvent } from 'react';
import { Plus, X, ImageIcon, Link2 } from 'lucide-react';
import { timeAgo } from '../../../lib/timeAgo';
import type { CreativeReference } from './types';

function AddByUrlForm({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setUrl('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-md focus-within:border-text-muted transition-colors"
    >
      <Link2 size={13} className="text-text-muted flex-shrink-0" />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste an image URL…"
        className="flex-1 min-w-0 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
      />
    </form>
  );
}

export function ReferencesGrid({
  references,
  onAdd,
  onAddUrl,
  onRemove
}: {
  references: CreativeReference[];
  onAdd: (files: File[]) => void;
  onAddUrl: (url: string) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {references.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-3 py-12 border border-dashed border-border rounded-lg text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors cursor-pointer"
        >
          <ImageIcon size={20} />
          <span className="text-[13px]">Add visual references</span>
          <span className="text-[11px] text-text-muted">Mood, competitors, textures — anything worth keeping close</span>
        </button>
      ) : (
        <>
          <p className="text-[12px] text-text-secondary">
            {references.length} reference{references.length === 1 ? '' : 's'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-4">
            {references.map((ref) => (
              <div key={ref.id} className="space-y-1">
                <div className="group relative aspect-square bg-surface border border-border rounded-md overflow-hidden">
                  <img src={ref.url} alt={ref.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemove(ref.id)}
                    aria-label={`Remove ${ref.name}`}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-background/80 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-text-primary transition-opacity cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-text-muted">{timeAgo(ref.addedAt)}</p>
              </div>
            ))}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Add reference"
                className="w-full aspect-square flex items-center justify-center border border-dashed border-border rounded-md text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
              <p className="text-[10px] text-transparent select-none" aria-hidden="true">
                &nbsp;
              </p>
            </div>
          </div>
        </>
      )}

      <AddByUrlForm onAdd={onAddUrl} />

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}
