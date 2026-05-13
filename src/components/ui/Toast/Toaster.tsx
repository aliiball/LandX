import { Toaster as SonnerToaster } from 'sonner';

/**
 * Global toast renderer — mounted once in `src/app/root.tsx`.
 * Positions: desktop bottom-right, mobile top-center (responsive via CSS).
 */
export function Toaster() {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="bottom-right"
      gap={8}
      offset={16}
      mobileOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
      toastOptions={{
        duration: 4000,
        className: 'landx-toast',
        classNames: {
          toast:
            'rounded-[var(--radius-md)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-[var(--glow-soft)]',
          title: 'font-medium',
          description: 'text-[var(--text-secondary)]',
          actionButton:
            'rounded-[var(--radius-sm)] bg-[var(--accent-cyan)] text-[var(--surface-void)]',
          cancelButton: 'rounded-[var(--radius-sm)] bg-transparent text-[var(--text-secondary)]',
          closeButton:
            'rounded-full border border-[var(--stroke-default)] bg-[var(--surface-slate)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        },
      }}
    />
  );
}
