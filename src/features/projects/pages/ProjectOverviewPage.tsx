import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Circle, CircleDot, RefreshCcw } from 'lucide-react';
import { listIssues } from '../../issues/issueService';
import type { Issue } from '../../issues/types';
import { isBriefEmpty } from '../brief/types';
import type { ProjectOutletContext } from '../ProjectLayout';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{children}</p>;
}

function EmptyLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[13px] text-text-muted hover:text-text-secondary transition-colors">
      {children}
    </Link>
  );
}

export function ProjectOverviewPage() {
  const { project, references } = useOutletContext<ProjectOutletContext>();
  const [issues, setIssues] = useState<Issue[] | null>(null);

  useEffect(() => {
    setIssues(null);
    listIssues(project.id)
      .then(setIssues)
      .catch(() => setIssues([]));
  }, [project.id]);

  const briefFilled = !isBriefEmpty(project.brief);
  const activeIssues = (issues ?? []).filter((i) => i.status !== 'done').slice(0, 6);
  const counts = {
    todo: (issues ?? []).filter((i) => i.status === 'todo').length,
    in_progress: (issues ?? []).filter((i) => i.status === 'in_progress').length,
    done: (issues ?? []).filter((i) => i.status === 'done').length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
      <div className="space-y-10 min-w-0">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Work</SectionLabel>
            <Link to="issues" className="text-[12px] text-text-muted hover:text-text-secondary transition-colors">
              View all
            </Link>
          </div>

          {issues === null ? (
            <div className="py-8 flex justify-center">
              <RefreshCcw size={14} className="animate-spin text-text-muted" />
            </div>
          ) : issues.length === 0 ? (
            <EmptyLink to="issues">No work tracked yet — add the first issue.</EmptyLink>
          ) : (
            <div className="space-y-3">
              <p className="text-[12px] text-text-secondary">
                {counts.todo} todo · {counts.in_progress} in progress · {counts.done} done
              </p>
              <div className="space-y-1">
                {activeIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center gap-2.5 text-[13px] text-text-primary">
                    {issue.status === 'in_progress' ? (
                      <CircleDot size={12} className="text-accent flex-shrink-0" />
                    ) : (
                      <Circle size={12} className="text-text-muted flex-shrink-0" />
                    )}
                    <span className="truncate">{issue.title}</span>
                  </div>
                ))}
                {activeIssues.length === 0 && <p className="text-[13px] text-text-muted">All caught up.</p>}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>Brief</SectionLabel>
            <Link to="brief" className="text-[12px] text-text-muted hover:text-text-secondary transition-colors">
              {briefFilled ? 'Edit' : 'Add'}
            </Link>
          </div>
          {briefFilled ? (
            <div className="space-y-2 text-[13px] text-text-secondary leading-relaxed">
              {project.brief.context && <p className="line-clamp-2">{project.brief.context}</p>}
              {project.brief.objective && <p className="line-clamp-2 text-text-muted">{project.brief.objective}</p>}
            </div>
          ) : (
            <EmptyLink to="brief">No brief yet — capture the project's context.</EmptyLink>
          )}
        </section>
      </div>

      <div className="space-y-10 min-w-0">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionLabel>References</SectionLabel>
            <Link to="references" className="text-[12px] text-text-muted hover:text-text-secondary transition-colors">
              {references.length > 0 ? 'View all' : 'Add'}
            </Link>
          </div>
          {references.length === 0 ? (
            <EmptyLink to="references">No references yet — bring in what's shaping this project.</EmptyLink>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {references.slice(0, 8).map((ref) => (
                <div key={ref.id} className="aspect-square bg-surface border border-border rounded-md overflow-hidden">
                  <img src={ref.url} alt={ref.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
