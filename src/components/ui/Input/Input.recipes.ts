import { type VariantProps, cva } from 'class-variance-authority';

export const inputWrapperRecipe = cva(
  [
    'group relative flex items-center gap-2 rounded-[var(--radius-md)] border bg-[var(--surface-elevated)]',
    'transition-[border-color,box-shadow] duration-[var(--duration-small)] ease-[var(--ease-out-expo)]',
    'focus-within:shadow-[var(--glow-cyan)]',
  ].join(' '),
  {
    variants: {
      tone: {
        default: 'border-[var(--stroke-default)] focus-within:border-[var(--accent-cyan)]',
        error: 'border-[var(--danger)] focus-within:border-[var(--danger)]',
      },
      size: {
        sm: 'h-9 px-2.5 text-[var(--text-small)]',
        md: 'h-11 px-3 text-[var(--text-body)]',
        lg: 'h-12 px-4 text-[var(--text-lead)]',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'default',
      size: 'md',
      disabled: false,
    },
  },
);

export type InputWrapperVariants = VariantProps<typeof inputWrapperRecipe>;
