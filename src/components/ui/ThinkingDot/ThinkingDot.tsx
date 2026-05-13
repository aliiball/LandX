import { cn } from '@/design/recipes';

export type ThinkingDotTone = 'cyan' | 'violet' | 'magenta' | 'amber' | 'inherit';
export type ThinkingDotSize = 'sm' | 'md' | 'lg';

export type ThinkingDotProps = {
  tone?: ThinkingDotTone;
  size?: ThinkingDotSize;
  label?: string;
  className?: string;
};

const TONE: Record<ThinkingDotTone, string> = {
  cyan: 'bg-[var(--accent-cyan)]',
  violet: 'bg-[var(--accent-violet)]',
  magenta: 'bg-[var(--accent-magenta)]',
  amber: 'bg-[var(--accent-amber)]',
  inherit: 'bg-current',
};

const SIZE: Record<ThinkingDotSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

export function ThinkingDot({
  tone = 'cyan',
  size = 'md',
  label = 'AI düşünüyor',
  className,
}: ThinkingDotProps) {
  const dotClass = cn('thinking-dot rounded-full', TONE[tone], SIZE[size]);
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn('inline-flex items-center gap-1', className)}
    >
      <span aria-hidden className={dotClass} />
      <span aria-hidden className={dotClass} style={{ animationDelay: '120ms' }} />
      <span aria-hidden className={dotClass} style={{ animationDelay: '240ms' }} />
    </span>
  );
}
