import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export function NavigationItem({ to, icon, children }: { to: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-md text-[13px] border-l-2 transition-colors ${
          isActive
            ? 'bg-surface border-accent text-text-primary font-medium'
            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
