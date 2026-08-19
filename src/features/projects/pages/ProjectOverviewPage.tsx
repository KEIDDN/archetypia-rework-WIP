import { Link } from 'react-router-dom';
import { Circle, CircleDot, RefreshCcw } from 'lucide-react';
import { useCurrentProject } from '../CurrentProjectContext';
import { summarizeIssues } from '../../issues/pulse';
import { isBriefEmpty } from '../brief/types';
import { timeAgo } from '../../../lib/timeAgo';

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
  const { project, issues, references } = useCurrentProject();
  if (!project) return null;

  const briefFilled = !isBriefEmpty(project.brief);
  const summary = issues ? summarizeIssues(issues) : null;
  const activeIssues = (issues ?? []).filter((i) => i.status !== 'done').slice(0, 6);

  return (
    <div className="space-y-12">
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
            ) : summary && summary.total === 0 ? (
              <EmptyLink to="issues">No work tracked yet — add the first issue.</EmptyLink>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-text-secondary">
                  {summary?.todo} todo · {summary?.inProgress} in progress · {summary?.done} done
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

      <p className="text-[11px] text-text-muted">
        Created {timeAgo(project.created_at)} · Updated {timeAgo(project.updated_at)}
      </p>
    </div>
  );
}
