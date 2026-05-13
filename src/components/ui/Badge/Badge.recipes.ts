import { type VariantProps, cva } from 'class-variance-authority';

export const badgeRecipe = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-pill)] border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral:
          'border-[var(--stroke-default)] bg-[var(--surface-slate)] text-[var(--text-secondary)]',
        success: 'border-[var(--success)] bg-[oklch(0.88_0.20_135_/_0.10)] text-[var(--success)]',
        warning: 'border-[var(--warning)] bg-[oklch(0.82_0.16_75_/_0.10)] text-[var(--warning)]',
        danger: 'border-[var(--danger)] bg-[oklch(0.68_0.22_25_/_0.10)] text-[var(--danger)]',
        info: 'border-[var(--info)] bg-[oklch(0.82_0.16_195_/_0.10)] text-[var(--info)]',
        agent:
          'border-[var(--accent-magenta)] bg-[oklch(0.72_0.25_340_/_0.10)] text-[var(--accent-magenta)]',
        premium:
          'border-[var(--accent-amber)] bg-[oklch(0.82_0.16_75_/_0.14)] text-[var(--accent-amber)]',
        violet:
          'border-[var(--accent-violet)] bg-[oklch(0.70_0.22_290_/_0.10)] text-[var(--accent-violet)]',
      },
      size: {
        sm: 'h-5 px-2 text-[10px] uppercase tracking-wider',
        md: 'h-6 px-2.5 text-xs',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeRecipe>;
