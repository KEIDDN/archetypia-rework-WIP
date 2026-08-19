import { useState, type FormEvent } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, FieldLabel } from '../../components/ui/Input';
import { createProject } from './projectService';
import type { Project } from './types';

export function CreateProjectModal({
  open,
  onClose,
  onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setDescription('');
    setError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const project = await createProject({ name: name.trim(), description: description.trim() || undefined });
      reset();
      onCreated(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project.');
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel>Project name</FieldLabel>
          <Input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nike Brand Refresh"
          />
        </div>

        <div>
          <FieldLabel>Description (optional)</FieldLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What is this project about?"
          />
        </div>

        {error && <p className="text-[13px] text-danger">{error}</p>}

        <Button type="submit" disabled={!name.trim() || submitting} className="w-full">
          {submitting ? 'Creating…' : 'Create'}
        </Button>
      </form>
    </Modal>
  );
}
