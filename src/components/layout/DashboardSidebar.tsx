import { cn } from '@/design/recipes';
import { NavLink } from 'react-router';

type NavEntry = { to: string; label: string; iconColor?: string };

type SidebarProps = {
  surfaceLabel: string;
  entries: ReadonlyArray<NavEntry>;
};

export function DashboardSidebar({ surfaceLabel, entries }: SidebarProps) {
  return (
    <aside className="hidden border-r border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)] md:flex md:w-60 md:flex-col">
      <div className="px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
        {surfaceLabel}
      </div>
      <nav className="flex flex-col gap-0.5 px-2 py-2">
        {entries.map((entry) => (
          <NavLink
            key={entry.to}
            to={entry.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--surface-slate)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-slate)]/60 hover:text-[var(--text-primary)]',
              )
            }
          >
            {entry.iconColor && (
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ background: entry.iconColor }}
              />
            )}
            <span>{entry.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
