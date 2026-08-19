import { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { getProject } from './projectService';
import { ProjectSubNav } from './ProjectSubNav';
import type { Project } from './types';
import type { CreativeReference } from './references/types';

type Status = 'loading' | 'not-found' | 'error' | 'ready';

export interface ProjectOutletContext {
  project: Project;
  setProject: (project: Project) => void;
  references: CreativeReference[];
  setReferences: React.Dispatch<React.SetStateAction<CreativeReference[]>>;
}

export function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [references, setReferences] = useState<CreativeReference[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!projectId) return;
    setStatus('loading');
    setError(null);
    getProject(projectId)
      .then((result) => {
        if (!result) {
          setStatus('not-found');
        } else {
          setProject(result);
          setStatus('ready');
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load project.');
        setStatus('error');
      });
  };

  useEffect(load, [projectId]);

  if (status === 'loading') {
    return (
      <PageContainer>
        <div className="py-20 flex justify-center">
          <RefreshCcw size={16} className="animate-spin text-text-muted" />
        </div>
      </PageContainer>
    );
  }

  if (status === 'not-found') {
    return (
      <PageContainer>
        <EmptyState title="Project not found" description="This project doesn't exist or you don't have access to it." />
      </PageContainer>
    );
  }

  if (status === 'error') {
    return (
      <PageContainer>
        <EmptyState
          title="Couldn't load this project"
          description={error ?? undefined}
          action={
            <Button variant="secondary" onClick={load}>
              <RefreshCcw size={12} />
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  if (!project) return null;

  return (
    <PageContainer wide>
      <div className="space-y-4 mb-2">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft size={12} />
          Projects
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-[13px] text-text-secondary leading-relaxed max-w-2xl">{project.description}</p>
          )}
        </div>
        <ProjectSubNav />
      </div>
      <div className="border-t border-border pt-6">
        <Outlet context={{ project, setProject, references, setReferences } satisfies ProjectOutletContext} />
      </div>
    </PageContainer>
  );
}
