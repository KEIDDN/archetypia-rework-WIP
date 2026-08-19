import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { CurrentProjectProvider } from '../../features/projects/CurrentProjectContext';
import { CommandPaletteProvider } from '../../features/command/CommandPaletteContext';
import { CommandPalette } from '../../features/command/CommandPalette';

export function AppShell() {
  return (
    <CurrentProjectProvider>
      <CommandPaletteProvider>
        <div className="h-screen flex flex-col bg-background text-text-primary font-ui">
          <TopBar />
          <div className="flex flex-1 min-h-0">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <CommandPalette />
      </CommandPaletteProvider>
    </CurrentProjectProvider>
  );
}
