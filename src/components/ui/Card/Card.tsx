import { type GlassVariants, cn, glassRecipe } from '@/design/recipes';
import { type HTMLAttributes, forwardRef } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & GlassVariants;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone, glow, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(glassRecipe({ tone, glow }), className)} {...rest}>
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-3 border-b border-[var(--stroke-subtle)] px-5 py-4',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('px-5 py-4', className)} {...rest}>
        {children}
      </div>
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-2 border-t border-[var(--stroke-subtle)] px-5 py-3',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
