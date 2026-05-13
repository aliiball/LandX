import { Sheet } from '@/components/ui/Sheet';
import { duration, easing } from '@/design/motion';
import { cn } from '@/design/recipes';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './useFocusTrap';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  /** If true and viewport is below `md`, route to bottom Sheet. Default true. */
  responsive?: boolean;
  /** Disable closing on backdrop click. */
  dismissible?: boolean;
};

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < breakpoint,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  responsive = true,
  dismissible = true,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const focusTrapRef = useFocusTrap<HTMLDivElement>(open);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, dismissible, onOpenChange]);

  if (responsive && isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} side="bottom" title={title}>
        <div className="flex flex-col gap-3">
          {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
          {children}
          {footer && <div className="flex justify-end gap-2 pt-2">{footer}</div>}
        </div>
      </Sheet>
    );
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ zIndex: 'var(--z-modal)' as unknown as number }}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.medium, ease: easing.outExpo }}
            className="absolute inset-0 bg-[oklch(0_0_0_/_0.6)] backdrop-blur-md"
            onClick={() => dismissible && onOpenChange(false)}
            aria-hidden
          />
          <motion.div
            ref={focusTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: duration.medium, ease: easing.outExpo }}
            className={cn(
              'relative flex max-h-[88dvh] w-full flex-col overflow-hidden',
              'rounded-[var(--radius-lg)] border border-[var(--stroke-default)]',
              'bg-[var(--surface-elevated)] shadow-[var(--glow-soft)]',
              SIZE_CLASS[size],
            )}
          >
            {(title || dismissible) && (
              <header className="flex items-start justify-between gap-3 border-b border-[var(--stroke-subtle)] px-5 py-4">
                <div className="flex flex-col gap-1">
                  {title && (
                    <h2 id={titleId} className="text-lg font-medium text-[var(--text-primary)]">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="text-sm text-[var(--text-secondary)]">
                      {description}
                    </p>
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
              </header>
            )}
            <div className="overflow-y-auto px-5 py-4">{children}</div>
            {footer && (
              <footer className="flex items-center justify-end gap-2 border-t border-[var(--stroke-subtle)] px-5 py-3">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
