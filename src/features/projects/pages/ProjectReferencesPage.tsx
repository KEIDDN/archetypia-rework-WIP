import { ReferencesGrid } from '../references/ReferencesGrid';
import { useCurrentProject } from '../CurrentProjectContext';
import type { CreativeReference } from '../references/types';

function fileToReference(file: File): Promise<CreativeReference> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ id: crypto.randomUUID(), name: file.name, url: reader.result as string, addedAt: new Date().toISOString() });
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

export function ProjectReferencesPage() {
  const { references, setReferences } = useCurrentProject();

  const handleAdd = async (files: File[]) => {
    const newReferences = await Promise.all(files.map(fileToReference));
    setReferences((prev) => [...prev, ...newReferences]);
  };

  const handleAddUrl = (url: string) => {
    const name = url.split('/').pop()?.split('?')[0] || 'Reference';
    setReferences((prev) => [...prev, { id: crypto.randomUUID(), name, url, addedAt: new Date().toISOString() }]);
  };

  const handleRemove = (id: string) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-4">
      <p className="text-[13px] text-text-secondary leading-relaxed max-w-lg">
        Visual knowledge for this project — mood, competitors, textures, anything worth keeping close at hand.
      </p>
      <ReferencesGrid references={references} onAdd={handleAdd} onAddUrl={handleAddUrl} onRemove={handleRemove} />
    </div>
  );
}
