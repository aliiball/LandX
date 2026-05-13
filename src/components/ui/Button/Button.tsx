import { cn } from '@/design/recipes';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { type ButtonVariants, buttonRecipe } from './Button.recipes';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> &
  ButtonVariants & {
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'button',
    tone,
    size,
    block,
    loading,
    disabled,
    leftIcon,
    rightIcon,
    className,
    children,
    'aria-busy': ariaBusy,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={ariaBusy ?? loading}
      className={cn(buttonRecipe({ tone, size, block }), className)}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1" aria-hidden>
          <span className="thinking-dot size-1.5 rounded-full bg-current" />
          <span
            className="thinking-dot size-1.5 rounded-full bg-current"
            style={{ animationDelay: '120ms' }}
          />
          <span
            className="thinking-dot size-1.5 rounded-full bg-current"
            style={{ animationDelay: '240ms' }}
          />
        </span>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
