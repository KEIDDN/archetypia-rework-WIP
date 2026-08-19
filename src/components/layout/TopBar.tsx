import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { ArchetypiaLogo } from '../ArchetypiaLogo';
import { useAuth } from '../../contexts/AuthContext';

export function TopBar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-border">
      <ArchetypiaLogo variant="full" size="xs" symbolClassName="text-text-primary" textClassName="text-text-primary font-ui" dotClassName="fill-text-primary" />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-[10px] font-ui font-semibold text-text-primary">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-[13px] font-ui text-text-secondary hidden sm:block max-w-[160px] truncate">
            {user?.email}
          </span>
          <ChevronDown size={12} className="text-text-muted" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-border rounded-md shadow-lg py-1 z-20">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-ui text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
