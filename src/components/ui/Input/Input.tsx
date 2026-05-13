import { cn } from '@/design/recipes';
import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { type InputWrapperVariants, inputWrapperRecipe } from './Input.recipes';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Pick<InputWrapperVariants, 'size'> & {
    label?: string;
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
    error?: boolean;
    helpText?: string;
    errorText?: string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id: idProp,
    label,
    leftSlot,
    rightSlot,
    error,
    helpText,
    errorText,
    size = 'md',
    disabled,
    className,
    placeholder,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `input-${autoId}`;
  const describedById = errorText ? `${id}-error` : helpText ? `${id}-help` : undefined;
  const tone = error ? 'error' : 'default';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-[var(--text-small)] text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className={inputWrapperRecipe({ tone, size, disabled })}>
        {leftSlot && (
          <span aria-hidden className="flex shrink-0 items-center text-[var(--text-tertiary)]">
            {leftSlot}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          placeholder={placeholder ?? ' '}
          aria-invalid={error || undefined}
          aria-describedby={describedById}
          className="peer w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          {...rest}
        />
        {rightSlot && (
          <span className="flex shrink-0 items-center text-[var(--text-tertiary)]">
            {rightSlot}
          </span>
        )}
      </div>
      {errorText ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-[var(--danger)]">
          {errorText}
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="text-xs text-[var(--text-tertiary)]">
          {helpText}
        </p>
      ) : null}
    </div>
  );
});
