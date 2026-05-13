import { cn } from '@/design/recipes';
import type { ReactNode } from 'react';

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('app-shell-bg', className)}>{children}</div>;
}
