import { cn } from '@/design/recipes';
import { type TextareaHTMLAttributes, forwardRef, useId } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: boolean;
  helpText?: string;
  errorText?: string;
  autoGrow?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id: idProp, label, error, helpText, errorText, autoGrow = true, rows = 3, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `textarea-${autoId}`;
  const describedById = errorText ? `${id}-error` : helpText ? `${id}-help` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-[var(--text-small)] text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error || undefined}
        aria-describedby={describedById}
        className={cn(
          'rounded-[var(--radius-md)] border bg-[var(--surface-elevated)] px-3 py-2',
          'text-[var(--text-body)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
          'transition-[border-color,box-shadow] duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
          'focus:outline-none focus:shadow-[var(--glow-cyan)]',
          error
            ? 'border-[var(--danger)] focus:border-[var(--danger)]'
            : 'border-[var(--stroke-default)] focus:border-[var(--accent-cyan)]',
          autoGrow && 'resize-none',
          'disabled:opacity-50',
        )}
        style={autoGrow ? ({ fieldSizing: 'content' } as React.CSSProperties) : undefined}
        {...rest}
      />
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
