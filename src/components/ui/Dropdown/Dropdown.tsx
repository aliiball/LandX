import { cn } from '@/design/recipes';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';

export type DropdownItem = {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export type DropdownProps = {
  trigger: ReactNode;
  items: ReadonlyArray<DropdownItem | 'separator'>;
  align?: 'start' | 'end';
  className?: string;
};

export function Dropdown({ trigger, items, align = 'end', className }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const actionableItems = items.filter(
    (it): it is DropdownItem => it !== 'separator' && !it.disabled,
  );

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current || !buttonRef.current) return;
      const target = e.target as Node;
      if (!menuRef.current.contains(target) && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((i) => (i + 1) % actionableItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((i) => (i - 1 + actionableItems.length) % actionableItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = actionableItems[focusIdx];
      item?.onSelect?.();
      close();
    }
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`dropdown-${id}`}
        onClick={() => setOpen((o) => !o)}
        className="contents"
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={menuRef}
          id={`dropdown-${id}`}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleKey}
          className={cn(
            'absolute top-full mt-2 min-w-48 overflow-hidden rounded-[var(--radius-md)]',
            'border border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
            'shadow-[var(--glow-soft)] backdrop-blur-xl',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          style={{ zIndex: 'var(--z-dropdown)' as unknown as number }}
        >
          {items.map((item, idx) => {
            if (item === 'separator') {
              return <hr key={`sep-${idx}`} className="my-1 border-[var(--stroke-subtle)]" />;
            }
            const actionIdx = actionableItems.indexOf(item);
            const focused = actionIdx === focusIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onMouseEnter={() => actionIdx >= 0 && setFocusIdx(actionIdx)}
                onClick={() => {
                  item.onSelect?.();
                  close();
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-left',
                  'transition-colors disabled:opacity-40 disabled:pointer-events-none',
                  focused
                    ? 'bg-[var(--surface-slate)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)]',
                  item.destructive && 'text-[var(--danger)]',
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
