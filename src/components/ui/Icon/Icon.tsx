import { cn } from '@/design/recipes';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

export type IconSize = 12 | 16 | 20 | 24 | 32;

export type IconTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'cyan'
  | 'violet'
  | 'lime'
  | 'amber'
  | 'magenta'
  | 'danger';

export type IconProps = Omit<LucideProps, 'size' | 'color' | 'ref'> & {
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
  label?: string;
};

const TONE_CLASS: Record<IconTone, string> = {
  primary: 'text-[var(--text-primary)]',
  secondary: 'text-[var(--text-secondary)]',
  tertiary: 'text-[var(--text-tertiary)]',
  cyan: 'text-[var(--accent-cyan)]',
  violet: 'text-[var(--accent-violet)]',
  lime: 'text-[var(--accent-lime)]',
  amber: 'text-[var(--accent-amber)]',
  magenta: 'text-[var(--accent-magenta)]',
  danger: 'text-[var(--danger)]',
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { icon: IconComponent, size = 16, tone = 'primary', className, label, ...rest },
  ref,
) {
  const ariaProps = label ? { 'aria-label': label, role: 'img' as const } : { 'aria-hidden': true };
  return (
    <IconComponent
      ref={ref}
      width={size}
      height={size}
      strokeWidth={1.75}
      className={cn('inline-block shrink-0', TONE_CLASS[tone], className)}
      {...ariaProps}
      {...rest}
    />
  );
});
