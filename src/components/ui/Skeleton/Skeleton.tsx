import { cn } from '@/design/recipes';
import { type HTMLAttributes, forwardRef } from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  lines?: number;
  width?: string | number;
  height?: string | number;
};

const BASE = 'skeleton-shimmer';

const VARIANT_CLASS: Record<SkeletonVariant, string> = {
  text: 'rounded-[var(--radius-sm)] h-4',
  circle: 'rounded-full',
  rect: 'rounded-[var(--radius-md)]',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'rect', lines = 1, width, height, className, style, ...rest },
  ref,
) {
  if (variant === 'text' && lines > 1) {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy
        aria-live="polite"
        aria-label="İçerik yükleniyor"
        className={cn('flex flex-col gap-2', className)}
        {...rest}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={cn(BASE, VARIANT_CLASS.text)}
            style={{
              width: i === lines - 1 ? '60%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-busy
      aria-live="polite"
      aria-label="İçerik yükleniyor"
      className={cn(BASE, VARIANT_CLASS[variant], className)}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
});
