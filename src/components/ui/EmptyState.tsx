import { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-20 px-6 bg-surface border border-border rounded-lg font-ui">
      {icon && <div className="text-text-muted">{icon}</div>}
      <div className="space-y-1.5">
        <p className="text-[13px] font-medium text-text-primary">{title}</p>
        {description && (
          <p className="text-[13px] text-text-secondary max-w-sm mx-auto leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
