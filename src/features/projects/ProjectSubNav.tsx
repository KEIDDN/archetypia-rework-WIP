import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '.', label: 'Overview', end: true },
  { to: 'issues', label: 'Work', end: false },
  { to: 'brief', label: 'Brief', end: false },
  { to: 'references', label: 'References', end: false }
];

export function ProjectSubNav() {
  return (
    <nav className="flex items-center gap-1 -mb-px">
      {TABS.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `px-3 py-2 text-[13px] border-b-2 transition-colors ${
              isActive
                ? 'border-accent text-text-primary font-medium'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
