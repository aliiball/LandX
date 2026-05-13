import { cn } from '@/design/recipes';
import { ChevronDown } from 'lucide-react';
import { type SelectHTMLAttributes, forwardRef, useId } from 'react';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: boolean;
  helpText?: string;
  errorText?: string;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_CLASS = {
  sm: 'h-9 px-2.5 text-[var(--text-small)]',
  md: 'h-11 px-3 text-[var(--text-body)]',
  lg: 'h-12 px-4 text-[var(--text-lead)]',
} as const;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id: idProp,
    label,
    options,
    placeholder,
    error,
    helpText,
    errorText,
    size = 'md',
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `select-${autoId}`;
  const describedById = errorText ? `${id}-error` : helpText ? `${id}-help` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-[var(--text-small)] text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div
        className={cn(
          'relative flex items-center rounded-[var(--radius-md)] border bg-[var(--surface-elevated)]',
          'transition-[border-color,box-shadow] duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
          'focus-within:shadow-[var(--glow-cyan)]',
          error
            ? 'border-[var(--danger)] focus-within:border-[var(--danger)]'
            : 'border-[var(--stroke-default)] focus-within:border-[var(--accent-cyan)]',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={describedById}
          className={cn(
            'w-full appearance-none bg-transparent text-[var(--text-primary)] pr-9',
            'focus:outline-none',
            SIZE_CLASS[size],
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 size-4 text-[var(--text-tertiary)]"
        />
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
