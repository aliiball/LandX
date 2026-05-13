import { cn } from '@/design/recipes';
import { type InputHTMLAttributes, forwardRef, useId } from 'react';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
};

const TRACK = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
} as const;

const THUMB = {
  sm: 'size-3.5',
  md: 'size-4',
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    id: idProp,
    label,
    description,
    size = 'md',
    disabled,
    checked,
    defaultChecked,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? `sw-${autoId}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-start gap-3 cursor-pointer select-none',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked ?? defaultChecked ?? false}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden
          className={cn(
            'flex items-center rounded-[var(--radius-pill)] border bg-[var(--surface-slate)]',
            'border-[var(--stroke-default)] transition-colors',
            'duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
            'peer-checked:border-[var(--accent-cyan)] peer-checked:bg-[var(--accent-cyan)]',
            'peer-focus-visible:shadow-[var(--glow-cyan)]',
            TRACK[size],
          )}
        >
          <span
            className={cn(
              'block translate-x-0.5 rounded-full bg-[var(--surface-void)]',
              'transition-transform duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
              size === 'sm' ? 'peer-checked:translate-x-[18px]' : 'peer-checked:translate-x-[22px]',
              THUMB[size],
            )}
            style={
              {
                transform:
                  checked || defaultChecked
                    ? size === 'sm'
                      ? 'translateX(18px)'
                      : 'translateX(22px)'
                    : 'translateX(2px)',
              } as React.CSSProperties
            }
          />
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
