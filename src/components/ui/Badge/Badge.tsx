import { cn } from '@/design/recipes';
import { type HTMLAttributes, forwardRef } from 'react';
import { type BadgeVariants, badgeRecipe } from './Badge.recipes';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  BadgeVariants & {
    dot?: boolean;
  };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, size, dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeRecipe({ tone, size }), className)} {...rest}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
});
