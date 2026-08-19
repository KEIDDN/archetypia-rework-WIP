import { useOutletContext } from 'react-router-dom';
import { ReferencesGrid } from '../references/ReferencesGrid';
import type { CreativeReference } from '../references/types';
import type { ProjectOutletContext } from '../ProjectLayout';

function fileToReference(file: File): Promise<CreativeReference> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, url: reader.result as string });
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

export function ProjectReferencesPage() {
  const { references, setReferences } = useOutletContext<ProjectOutletContext>();

  const handleAdd = async (files: File[]) => {
    const newReferences = await Promise.all(files.map(fileToReference));
    setReferences((prev) => [...prev, ...newReferences]);
  };

  const handleRemove = (id: string) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-4">
      <p className="text-[13px] text-text-secondary leading-relaxed max-w-lg">
        Visual knowledge for this project — mood, competitors, textures, anything worth keeping close at hand.
      </p>
      <ReferencesGrid references={references} onAdd={handleAdd} onRemove={handleRemove} />
    </div>
  );
}
