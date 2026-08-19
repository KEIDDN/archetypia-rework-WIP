import { Link } from 'react-router-dom';
import type { Project } from './types';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block p-4 bg-surface border border-border rounded-lg hover:border-text-muted transition-colors"
    >
      <h3 className="text-[13px] font-medium text-text-primary truncate">{project.name}</h3>
      <p className="mt-1 text-xs text-text-muted">Updated {timeAgo(project.updated_at)}</p>
    </Link>
  );
}
