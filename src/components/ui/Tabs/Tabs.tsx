import { cn } from '@/design/recipes';
import { type KeyboardEvent, type ReactNode, useCallback, useId, useRef, useState } from 'react';

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: ReadonlyArray<TabItem>;
  defaultActive?: string;
  active?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
};

export function Tabs({ items, defaultActive, active, onActiveChange, className }: TabsProps) {
  const baseId = useId();
  const firstId = items[0]?.id;
  const [internal, setInternal] = useState<string>(defaultActive ?? firstId ?? '');
  const current = active ?? internal;
  const listRef = useRef<HTMLDivElement>(null);

  const setActive = useCallback(
    (id: string) => {
      onActiveChange?.(id);
      if (active === undefined) setInternal(id);
    },
    [active, onActiveChange],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = items.findIndex((item) => item.id === current);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      if (next && !next.disabled) {
        setActive(next.id);
        focusTab(next.id, baseId, listRef.current);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      if (prev && !prev.disabled) {
        setActive(prev.id);
        focusTab(prev.id, baseId, listRef.current);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = items.find((i) => !i.disabled);
      if (first) {
        setActive(first.id);
        focusTab(first.id, baseId, listRef.current);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = [...items].reverse().find((i) => !i.disabled);
      if (last) {
        setActive(last.id);
        focusTab(last.id, baseId, listRef.current);
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        ref={listRef}
        role="tablist"
        className="flex gap-1 border-b border-[var(--stroke-subtle)]"
      >
        {items.map((item) => {
          const selected = item.id === current;
          return (
            <button
              key={item.id}
              type="button"
              id={`tab-${baseId}-${item.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${baseId}-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => setActive(item.id)}
              onKeyDown={onKeyDown}
              className={cn(
                'relative -mb-px px-4 py-2 text-sm transition-colors',
                'focus-visible:outline-none focus-visible:shadow-[var(--glow-cyan)]',
                'disabled:opacity-40 disabled:pointer-events-none',
                selected
                  ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)]'
                  : 'text-[var(--text-secondary)] border-b-2 border-transparent hover:text-[var(--text-primary)]',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`panel-${baseId}-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${baseId}-${item.id}`}
          hidden={item.id !== current}
          className="focus-visible:outline-none"
        >
          {item.id === current && item.content}
        </div>
      ))}
    </div>
  );
}

function focusTab(id: string, baseId: string, container: HTMLDivElement | null) {
  if (!container) return;
  const btn = container.querySelector<HTMLButtonElement>(`#tab-${baseId}-${id}`);
  btn?.focus();
}
