// CVA recipe stubs — Phase 1 will fully populate these.
// For Phase 0 we keep minimal recipes used by layout skeletons.

import { type VariantProps, cva } from 'class-variance-authority';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const glassRecipe = cva(
  'rounded-[var(--radius-lg)] border transition-colors duration-[var(--duration-medium)]',
  {
    variants: {
      tone: {
        default: 'border-[var(--stroke-subtle)] bg-[var(--surface-glass)] backdrop-blur-xl',
        strong: 'border-[var(--stroke-default)] bg-[var(--surface-glass-strong)] backdrop-blur-2xl',
        solid: 'border-[var(--stroke-default)] bg-[var(--surface-elevated)]',
      },
      glow: {
        none: '',
        soft: 'shadow-[var(--glow-soft)]',
        cyan: 'shadow-[var(--glow-cyan)]',
        violet: 'shadow-[var(--glow-violet)]',
      },
    },
    defaultVariants: {
      tone: 'default',
      glow: 'none',
    },
  },
);

export type GlassVariants = VariantProps<typeof glassRecipe>;

export const headingRecipe = cva(
  'font-[var(--font-display)] tracking-tight text-[var(--text-primary)]',
  {
    variants: {
      level: {
        display: 'text-[var(--text-display)] leading-none',
        h1: 'text-[var(--text-h1)] leading-tight',
        h2: 'text-[var(--text-h2)] leading-tight',
        h3: 'text-[var(--text-h3)] leading-tight',
        h4: 'text-[var(--text-h4)]',
        h5: 'text-[var(--text-h5)]',
        h6: 'text-[var(--text-h6)]',
      },
    },
    defaultVariants: { level: 'h3' },
  },
);

export type HeadingVariants = VariantProps<typeof headingRecipe>;
