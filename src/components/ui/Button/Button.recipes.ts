import { type VariantProps, cva } from 'class-variance-authority';

export const buttonRecipe = cva(
  [
    'inline-flex items-center justify-center gap-2 select-none',
    'font-medium rounded-[var(--radius-md)] border',
    'transition-[transform,box-shadow,background,border-color,opacity]',
    'duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
    'focus-visible:outline-none focus-visible:shadow-[var(--glow-cyan)]',
    'disabled:opacity-50 disabled:pointer-events-none',
    'active:translate-y-px',
  ].join(' '),
  {
    variants: {
      tone: {
        primary:
          'bg-[var(--accent-cyan)] text-[var(--surface-void)] border-transparent hover:shadow-[var(--glow-cyan)]',
        neutral:
          'bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--stroke-default)] hover:border-[var(--stroke-strong)]',
        ghost:
          'bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--surface-slate)] hover:text-[var(--text-primary)]',
        outline:
          'bg-transparent text-[var(--text-primary)] border-[var(--stroke-default)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]',
        danger:
          'bg-[var(--danger)] text-white border-transparent hover:shadow-[0_0_24px_-4px_var(--danger)]',
        agent:
          'bg-[var(--accent-violet)] text-[var(--surface-void)] border-transparent hover:shadow-[var(--glow-violet)]',
      },
      size: {
        sm: 'h-9 min-w-9 px-3 text-[var(--text-small)]',
        md: 'h-11 min-w-11 px-5 text-[var(--text-body)]',
        lg: 'h-12 min-w-12 px-6 text-[var(--text-lead)]',
        icon: 'h-11 w-11 p-0',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonRecipe>;
