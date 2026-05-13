import { cn } from '@/design/recipes';
import { type HTMLAttributes, useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarRing = 'none' | 'cyan' | 'violet' | 'agent' | 'amber';

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string;
  name: string;
  size?: AvatarSize;
  ring?: AvatarRing;
};

const SIZE: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

const RING: Record<AvatarRing, string> = {
  none: '',
  cyan: 'ring-2 ring-[var(--accent-cyan)] ring-offset-2 ring-offset-[var(--surface-void)]',
  violet: 'ring-2 ring-[var(--accent-violet)] ring-offset-2 ring-offset-[var(--surface-void)]',
  agent: 'ring-2 ring-[var(--accent-magenta)] ring-offset-2 ring-offset-[var(--surface-void)]',
  amber: 'ring-2 ring-[var(--accent-amber)] ring-offset-2 ring-offset-[var(--surface-void)]',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ src, name, size = 'md', ring = 'none', className, ...rest }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium',
        'border border-[var(--stroke-default)] bg-[var(--surface-slate)] text-[var(--text-primary)]',
        SIZE[size],
        RING[ring],
        className,
      )}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          onError={() => setErrored(true)}
          className="size-full rounded-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  );
}
