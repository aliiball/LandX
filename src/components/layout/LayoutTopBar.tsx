import { cn } from '@/design/recipes';
import { Link } from 'react-router';
import { DemoModeBadge } from './DemoModeBadge';
import { NotificationsDrawer } from './NotificationsDrawer';
import { PersonaSwitcher } from './PersonaSwitcher';

type LayoutTopBarProps = {
  surfaceLabel: string;
  envBadge?: 'dev' | 'staging' | 'prod';
  rightSlot?: React.ReactNode;
};

const ENV_COLORS: Record<NonNullable<LayoutTopBarProps['envBadge']>, string> = {
  dev: 'var(--accent-cyan)',
  staging: 'var(--accent-amber)',
  prod: 'var(--danger)',
};

export function LayoutTopBar({ surfaceLabel, envBadge = 'dev', rightSlot }: LayoutTopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between gap-4',
        'border-b border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/80 px-4 py-3 backdrop-blur-xl md:px-6',
      )}
    >
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="font-mono text-sm font-semibold tracking-tight text-[var(--text-primary)]"
        >
          arsam<span className="text-[var(--accent-cyan)]">.</span>net
        </Link>
        <span
          aria-label={`Surface: ${surfaceLabel}`}
          className="hidden text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)] md:inline"
        >
          {surfaceLabel}
        </span>
        <span
          aria-label={`Environment: ${envBadge}`}
          className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
          style={{ borderColor: ENV_COLORS[envBadge], color: ENV_COLORS[envBadge] }}
        >
          {envBadge}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {rightSlot}
        <NotificationsDrawer />
        <DemoModeBadge />
        <PersonaSwitcher />
      </div>
    </header>
  );
}
