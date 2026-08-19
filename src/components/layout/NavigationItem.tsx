import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export function NavigationItem({
  to,
  icon,
  end,
  collapsed,
  label,
  children
}: {
  to: string;
  icon?: ReactNode;
  end?: boolean;
  collapsed?: boolean;
  label: string;
  children: ReactNode;
}) {
  if (collapsed) {
    return (
      <NavLink
        to={to}
        end={end}
        aria-label={label}
        className={({ isActive }) =>
          `group relative flex items-center justify-center w-9 h-9 mx-auto rounded-md transition-colors ${
            isActive ? 'bg-surface text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`
        }
      >
        {icon}
        <span className="pointer-events-none absolute left-full ml-2 z-30 whitespace-nowrap px-2 py-1 rounded-md bg-surface-elevated border border-border text-[12px] text-text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          {label}
        </span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
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
