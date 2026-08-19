export function LabelBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] leading-none text-text-secondary bg-surface-elevated border border-border whitespace-nowrap">
      {name}
    </span>
  );
}
