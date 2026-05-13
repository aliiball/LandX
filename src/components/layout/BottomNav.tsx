import { cn } from '@/design/recipes';
import { NavLink } from 'react-router';

type Tab = { to: string; label: string };

export function BottomNav({ tabs }: { tabs: ReadonlyArray<Tab> }) {
  return (
    <nav
      aria-label="Alt navigasyon"
      className="sticky bottom-0 z-30 flex border-t border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
              isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-tertiary)]',
            )
          }
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
