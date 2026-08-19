import type { ReactNode } from 'react';

export interface Command {
  id: string;
  label: string;
  keywords?: string;
  category: string;
  icon?: ReactNode;
  shortcut?: string;
  action: () => void;
}
