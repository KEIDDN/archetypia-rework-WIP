import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FolderKanban, Compass, ListTodo, FileText, Image as ImageIcon } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { useCurrentProject } from '../../features/projects/CurrentProjectContext';

function WorkspaceSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-border px-3 py-5 hidden md:flex md:flex-col gap-5 font-ui">
      <div className="px-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Workspace</span>
      </div>
      <nav className="space-y-0.5">
        <NavigationItem to="/projects" icon={<FolderKanban size={15} />}>
          Projects
        </NavigationItem>
      </nav>
    </aside>
  );
}

function ProjectSidebar({ projectId, projectName }: { projectId: string; projectName: string | null }) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-border px-3 py-5 hidden md:flex md:flex-col gap-5 font-ui">
      <Link
        to="/projects"
        className="flex items-center gap-1.5 px-2.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors"
      >
        <ArrowLeft size={12} />
        Projects
      </Link>

      {projectName && (
        <div className="px-2.5 space-y-1 min-w-0">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Project</span>
          <p className="text-[13px] font-medium text-text-primary truncate" title={projectName}>
            {projectName}
          </p>
        </div>
      )}

      <nav className="space-y-0.5">
        <NavigationItem to={`/projects/${projectId}`} end icon={<Compass size={15} />}>
          Overview
        </NavigationItem>
        <NavigationItem to={`/projects/${projectId}/issues`} icon={<ListTodo size={15} />}>
          Work
        </NavigationItem>
        <NavigationItem to={`/projects/${projectId}/brief`} icon={<FileText size={15} />}>
          Brief
        </NavigationItem>
        <NavigationItem to={`/projects/${projectId}/references`} icon={<ImageIcon size={15} />}>
          References
        </NavigationItem>
      </nav>
    </aside>
  );
}

export function Sidebar() {
  const { projectId, project } = useCurrentProject();

  if (projectId) {
    return <ProjectSidebar projectId={projectId} projectName={project?.name ?? null} />;
  }

  return <WorkspaceSidebar />;
}
