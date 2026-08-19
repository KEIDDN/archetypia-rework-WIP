import { ReactNode } from 'react';

export function PageContainer({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`${wide ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-8 py-8 font-ui`}>{children}</div>;
}
