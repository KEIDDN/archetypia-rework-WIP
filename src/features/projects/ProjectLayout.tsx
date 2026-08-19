import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { ProjectSubNav } from './ProjectSubNav';
import { useCurrentProject } from './CurrentProjectContext';
import { summarizeIssues } from '../issues/pulse';

function pulseText(issues: ReturnType<typeof summarizeIssues>): string | null {
  if (issues.total === 0) return null;
  if (issues.inProgress > 0) return `${issues.inProgress} in progress · ${issues.open} open`;
  if (issues.open > 0) return `${issues.open} open`;
  return 'All work done';
}

export function ProjectLayout() {
  const { project, status, error, reload, issues } = useCurrentProject();

  if (status === 'idle' || status === 'loading') {
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
            <Button variant="secondary" onClick={reload}>
              <RefreshCcw size={12} />
              Retry
            </Button>
          }
        />
      </PageContainer>
    );
  }

  if (!project) return null;

  const pulse = issues ? pulseText(summarizeIssues(issues)) : null;

  return (
    <PageContainer wide>
      <div className="space-y-4 mb-2">
        <Link
          to="/projects"
          className="md:hidden inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft size={12} />
          Projects
        </Link>
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-text-primary">{project.name}</h1>
            {pulse && <span className="text-[12px] text-text-muted">{pulse}</span>}
          </div>
          {project.description && (
            <p className="mt-1 text-[13px] text-text-secondary leading-relaxed max-w-2xl">{project.description}</p>
          )}
        </div>
        <div className="md:hidden">
          <ProjectSubNav />
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <Outlet />
      </div>
    </PageContainer>
  );
}
