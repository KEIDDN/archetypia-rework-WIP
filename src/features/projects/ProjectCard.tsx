import { Link } from 'react-router-dom';
import { timeAgo } from '../../lib/timeAgo';
import type { Project } from './types';

export function ProjectCard({ project }: { project: Project }) {
  const updated = timeAgo(project.updated_at);
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block p-4 bg-surface border border-border rounded-lg hover:border-text-muted transition-colors"
    >
      <h3 className="text-[13px] font-medium text-text-primary truncate">{project.name}</h3>
      <p className="mt-1 text-xs text-text-muted">Updated {updated}{updated === 'just now' ? '' : ' ago'}</p>
    </Link>
  );
}
