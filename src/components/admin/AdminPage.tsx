import { Badge, Card, CardBody, CardHeader } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import type { ReactNode } from 'react';

type Kpi = {
  label: string;
  value: string;
  tone?: 'cyan' | 'lime' | 'amber' | 'violet' | 'magenta';
};

export function AdminPage({
  title,
  surfaceKey,
  module,
  description,
  actions,
  kpis,
  children,
}: {
  title: string;
  surfaceKey: string;
  module?: string;
  description?: string;
  actions?: ReactNode;
  kpis?: ReadonlyArray<Kpi>;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              {surfaceKey}
            </span>
            {module && (
              <Badge tone="violet" size="sm">
                {module}
              </Badge>
            )}
          </div>
          <h1 className={headingRecipe({ level: 'h3' })}>{title}</h1>
          {description && <p className="text-[var(--text-secondary)]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>

      {kpis && kpis.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} tone="solid">
              <CardBody className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {kpi.label}
                </span>
                <span
                  className="text-2xl font-semibold tabular-nums"
                  style={kpi.tone ? { color: `var(--accent-${kpi.tone})` } : undefined}
                >
                  {kpi.value}
                </span>
              </CardBody>
            </Card>
          ))}
        </section>
      )}

      {children}
    </main>
  );
}

export function AdminTable({
  title,
  columns,
  rows,
}: {
  title?: string;
  columns: ReadonlyArray<{ key: string; label: string; align?: 'left' | 'right' }>;
  rows: ReadonlyArray<Record<string, ReactNode>>;
}) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <span className="font-medium">{title}</span>
          <Badge tone="info" size="sm">
            {rows.length}
          </Badge>
        </CardHeader>
      )}
      <CardBody className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
            <tr className="border-b border-[var(--stroke-subtle)]">
              {columns.map((c) => (
                <th key={c.key} className={`py-2 pr-3 ${c.align === 'right' ? 'text-right' : ''}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--stroke-subtle)]/40">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-2 pr-3 ${c.align === 'right' ? 'text-right' : ''}`}
                  >
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
