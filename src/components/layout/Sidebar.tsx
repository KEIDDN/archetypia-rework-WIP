import { FolderKanban } from 'lucide-react';
import { NavigationItem } from './NavigationItem';

export function Sidebar() {
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
