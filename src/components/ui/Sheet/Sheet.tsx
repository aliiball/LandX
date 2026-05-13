import { cn } from '@/design/recipes';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Drawer } from 'vaul';

export type SheetSide = 'bottom' | 'right';

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  side?: SheetSide;
  dismissible?: boolean;
};

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'bottom',
  dismissible = true,
}: SheetProps) {
  const direction = side === 'bottom' ? 'bottom' : 'right';

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      direction={direction}
      dismissible={dismissible}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-[oklch(0_0_0_/_0.6)] backdrop-blur-md"
          style={{ zIndex: 'var(--z-sheet)' as unknown as number }}
        />
        <Drawer.Content
          aria-describedby={description ? 'sheet-desc' : undefined}
          className={cn(
            'fixed flex flex-col overflow-hidden border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
            side === 'bottom' &&
              'bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-[var(--radius-xl)] border-t',
            side === 'right' &&
              'bottom-0 right-0 top-0 w-[min(420px,88vw)] rounded-l-[var(--radius-xl)] border-l',
          )}
          style={{ zIndex: 'var(--z-sheet)' as unknown as number }}
        >
          {side === 'bottom' && (
            <div
              aria-hidden
              className="mx-auto my-3 h-1.5 w-12 rounded-full bg-[var(--stroke-default)]"
            />
          )}
          <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-2">
            <div className="flex flex-col gap-1">
              {title && (
                <Drawer.Title className="text-lg font-medium text-[var(--text-primary)]">
                  {title}
                </Drawer.Title>
              )}
              {description && (
                <Drawer.Description
                  id="sheet-desc"
                  className="text-sm text-[var(--text-secondary)]"
                >
                  {description}
                </Drawer.Description>
              )}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Kapat"
                className="rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:bg-[var(--surface-slate)] hover:text-[var(--text-primary)] focus-visible:shadow-[var(--glow-cyan)] focus-visible:outline-none"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
