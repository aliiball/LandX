import { cn } from '@/design/recipes';
import { Check, Minus } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef, useEffect, useId, useRef } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md';
};

const SIZE_BOX = {
  sm: 'size-4',
  md: 'size-5',
} as const;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    id: idProp,
    label,
    description,
    indeterminate,
    size = 'md',
    className,
    disabled,
    checked,
    defaultChecked,
    ...rest
  },
  externalRef,
) {
  const autoId = useId();
  const id = idProp ?? `cb-${autoId}`;
  const innerRef = useRef<HTMLInputElement>(null);

  // Merge refs
  useEffect(() => {
    if (typeof externalRef === 'function') externalRef(innerRef.current);
    else if (externalRef) externalRef.current = innerRef.current;
  }, [externalRef]);

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-start gap-2.5 cursor-pointer select-none',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <span className="relative inline-flex shrink-0 items-center justify-center pt-0.5">
        <input
          ref={innerRef}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            'flex items-center justify-center rounded-[var(--radius-xs)] border-2',
            'border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
            'transition-colors duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
            'peer-checked:border-[var(--accent-cyan)] peer-checked:bg-[var(--accent-cyan)]',
            'peer-indeterminate:border-[var(--accent-cyan)] peer-indeterminate:bg-[var(--accent-cyan)]',
            'peer-focus-visible:shadow-[var(--glow-cyan)]',
            SIZE_BOX[size],
          )}
        >
          {indeterminate ? (
            <Minus
              strokeWidth={3}
              className="size-3 text-[var(--surface-void)] opacity-100"
              aria-hidden
            />
          ) : (
            <Check
              strokeWidth={3}
              className="size-3 text-[var(--surface-void)] opacity-0 peer-checked:opacity-100"
              aria-hidden
            />
          )}
        </span>
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <span className="text-[var(--text-body)] text-[var(--text-primary)]">{label}</span>
          )}
          {description && (
            <span className="text-xs text-[var(--text-tertiary)]">{description}</span>
          )}
        </span>
      )}
    </label>
  );
});
