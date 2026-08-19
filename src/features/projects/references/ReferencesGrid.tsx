import { useRef } from 'react';
import { Plus, X, ImageIcon } from 'lucide-react';
import type { CreativeReference } from './types';

export function ReferencesGrid({
  references,
  onAdd,
  onRemove
}: {
  references: CreativeReference[];
  onAdd: (files: File[]) => void;
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
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="group relative aspect-square bg-surface border border-border rounded-md overflow-hidden"
            >
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
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Add reference"
            className="aspect-square flex items-center justify-center border border-dashed border-border rounded-md text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}
