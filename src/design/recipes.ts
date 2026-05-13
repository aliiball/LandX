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

export const textRecipe = cva('', {
  variants: {
    tone: {
      primary: 'text-[var(--text-primary)]',
      secondary: 'text-[var(--text-secondary)]',
      tertiary: 'text-[var(--text-tertiary)]',
      disabled: 'text-[var(--text-disabled)]',
      cyan: 'text-[var(--accent-cyan)]',
      violet: 'text-[var(--accent-violet)]',
      magenta: 'text-[var(--accent-magenta)]',
      lime: 'text-[var(--accent-lime)]',
      amber: 'text-[var(--accent-amber)]',
      danger: 'text-[var(--danger)]',
    },
    size: {
      caption: 'text-[var(--text-caption)] uppercase tracking-[0.04em]',
      small: 'text-[var(--text-small)]',
      body: 'text-[var(--text-body)]',
      lead: 'text-[var(--text-lead)]',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    family: {
      body: 'font-[var(--font-body)]',
      mono: 'font-[var(--font-mono)]',
    },
  },
  defaultVariants: {
    tone: 'primary',
    size: 'body',
    weight: 'normal',
    family: 'body',
  },
});

export type TextVariants = VariantProps<typeof textRecipe>;

export const surfaceRecipe = cva('border', {
  variants: {
    tone: {
      void: 'bg-[var(--surface-void)] border-[var(--stroke-subtle)]',
      obsidian: 'bg-[var(--surface-obsidian)] border-[var(--stroke-subtle)]',
      slate: 'bg-[var(--surface-slate)] border-[var(--stroke-default)]',
      elevated: 'bg-[var(--surface-elevated)] border-[var(--stroke-default)]',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-[var(--radius-sm)]',
      md: 'rounded-[var(--radius-md)]',
      lg: 'rounded-[var(--radius-lg)]',
      xl: 'rounded-[var(--radius-xl)]',
    },
  },
  defaultVariants: {
    tone: 'elevated',
    radius: 'md',
  },
});

export type SurfaceVariants = VariantProps<typeof surfaceRecipe>;
