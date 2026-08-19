import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';

export function CreateIssueForm({
  onCreate
}: {
  onCreate: (title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onCreate(trimmed);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-md focus-within:border-text-muted transition-colors"
    >
      <Plus size={14} className="text-text-muted flex-shrink-0" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add an issue…"
        disabled={submitting}
        className="flex-1 min-w-0 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
      />
    </form>
  );
}
