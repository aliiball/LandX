import { cn } from '@/design/recipes';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';

export type AccordionItemData = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items: ReadonlyArray<AccordionItemData>;
  defaultOpenIds?: ReadonlyArray<string>;
  allowMultiple?: boolean;
  className?: string;
};

export function Accordion({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
  className,
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `accordion-${baseId}-${item.id}-trigger`;
        const panelId = `accordion-${baseId}-${item.id}-panel`;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-elevated)]"
          >
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-3 text-left',
                  'text-[var(--text-primary)] transition-colors',
                  'hover:bg-[var(--surface-slate)] focus-visible:shadow-[var(--glow-cyan)] focus-visible:outline-none',
                  'disabled:opacity-40 disabled:pointer-events-none',
                )}
              >
                <span className="font-medium">{item.title}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-4 shrink-0 text-[var(--text-tertiary)] transition-transform',
                    'duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="border-t border-[var(--stroke-subtle)] px-4 py-3 text-[var(--text-secondary)]"
            >
              {isOpen && item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
