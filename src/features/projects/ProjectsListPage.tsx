import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, RefreshCcw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { listProjects } from './projectService';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import type { Project } from './types';

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => {
    setError(null);
    setProjects(null);
    listProjects()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load projects.'));
  };

  useEffect(load, []);

  return (
    <PageContainer wide>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Projects</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={14} />
          New Project
        </Button>
      </div>

      {error && (
        <EmptyState
          title="Couldn't load your projects"
          description={error}
          action={
            <Button variant="secondary" onClick={load}>
              <RefreshCcw size={12} />
              Retry
            </Button>
          }
        />
      )}

      {!error && projects === null && (
        <div className="py-20 flex justify-center">
          <RefreshCcw size={16} className="animate-spin text-text-muted" />
        </div>
      )}

      {!error && projects !== null && projects.length === 0 && (
        <EmptyState
          icon={<FolderKanban size={22} />}
          title="No projects yet"
          description="Create your first project to start building a creative workspace."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={14} />
              New Project
            </Button>
          }
        />
      )}

      {!error && projects !== null && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(project) => {
          setModalOpen(false);
          navigate(`/projects/${project.id}`);
        }}
      />
    </PageContainer>
  );
}
