import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FolderKanban, Compass, ListTodo, FileText, Image as ImageIcon } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { useCurrentProject } from '../../features/projects/CurrentProjectContext';
import { usePersistentState } from '../../hooks/usePersistentState';

function CollapseToggle({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className={`flex items-center gap-2.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface transition-colors cursor-pointer ${
        collapsed ? 'w-9 h-9 mx-auto justify-center' : 'px-2.5 py-1.5 w-full'
      }`}
    >
      {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
      {!collapsed && <span className="text-[13px]">Collapse</span>}
    </button>
  );
}

function WorkspaceSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={`flex-shrink-0 border-r border-border py-5 hidden md:flex md:flex-col gap-5 font-ui transition-[width] duration-150 ${
        collapsed ? 'w-14 px-2' : 'w-56 px-3'
      }`}
    >
      {!collapsed && (
        <div className="px-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Workspace</span>
        </div>
      )}
      <nav className="space-y-0.5 flex-1">
        <NavigationItem to="/projects" icon={<FolderKanban size={15} />} collapsed={collapsed} label="Projects">
          Projects
        </NavigationItem>
      </nav>
      <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}

function ProjectSidebar({
  projectId,
  projectName,
  collapsed,
  onToggle
}: {
  projectId: string;
  projectName: string | null;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`flex-shrink-0 border-r border-border py-5 hidden md:flex md:flex-col gap-5 font-ui transition-[width] duration-150 ${
        collapsed ? 'w-14 px-2' : 'w-56 px-3'
      }`}
    >
      {collapsed ? (
        <Link
          to="/projects"
          aria-label="Back to projects"
          className="group relative flex items-center justify-center w-9 h-9 mx-auto rounded-md text-text-muted hover:text-text-secondary hover:bg-surface transition-colors"
        >
          <ArrowLeft size={15} />
          <span className="pointer-events-none absolute left-full ml-2 z-30 whitespace-nowrap px-2 py-1 rounded-md bg-surface-elevated border border-border text-[12px] text-text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Projects
          </span>
        </Link>
      ) : (
        <Link
          to="/projects"
          className="flex items-center gap-1.5 px-2.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors"
        >
          <ArrowLeft size={12} />
          Projects
        </Link>
      )}

      {projectName &&
        (collapsed ? (
          <div className="group relative flex items-center justify-center w-9 h-9 mx-auto rounded-md bg-surface-elevated text-[12px] font-semibold text-text-primary">
            {projectName[0]?.toUpperCase()}
            <span className="pointer-events-none absolute left-full ml-2 z-30 whitespace-nowrap px-2 py-1 rounded-md bg-surface-elevated border border-border text-[12px] text-text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              {projectName}
            </span>
          </div>
        ) : (
          <div className="px-2.5 space-y-1 min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Project</span>
            <p className="text-[13px] font-medium text-text-primary truncate" title={projectName}>
              {projectName}
            </p>
          </div>
        ))}

      <nav className="space-y-0.5 flex-1">
        <NavigationItem to={`/projects/${projectId}`} end icon={<Compass size={15} />} collapsed={collapsed} label="Overview">
          Overview
        </NavigationItem>
        <NavigationItem to={`/projects/${projectId}/issues`} icon={<ListTodo size={15} />} collapsed={collapsed} label="Work">
          Work
        </NavigationItem>
        <NavigationItem to={`/projects/${projectId}/brief`} icon={<FileText size={15} />} collapsed={collapsed} label="Brief">
          Brief
        </NavigationItem>
        <NavigationItem
          to={`/projects/${projectId}/references`}
          icon={<ImageIcon size={15} />}
          collapsed={collapsed}
          label="References"
        >
          References
        </NavigationItem>
      </nav>
      <CollapseToggle collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}

export function Sidebar() {
  const { projectId, project } = useCurrentProject();
  const [collapsed, setCollapsed] = usePersistentState('archetypia:sidebar-collapsed', false);
  const toggle = () => setCollapsed((v) => !v);

  if (projectId) {
    return <ProjectSidebar projectId={projectId} projectName={project?.name ?? null} collapsed={collapsed} onToggle={toggle} />;
  }

  return <WorkspaceSidebar collapsed={collapsed} onToggle={toggle} />;
}
