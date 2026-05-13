import { Badge } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import type { ReactNode } from 'react';

export function AgentPage({
  title,
  surfaceKey,
  module,
  description,
  actions,
  children,
}: {
  title: string;
  surfaceKey: string;
  module?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              {surfaceKey}
            </span>
            {module && (
              <Badge tone="agent" size="sm">
                {module}
              </Badge>
            )}
          </div>
          <h1 className={headingRecipe({ level: 'h3' })}>{title}</h1>
          {description && <p className="text-[var(--text-secondary)]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </main>
  );
}
