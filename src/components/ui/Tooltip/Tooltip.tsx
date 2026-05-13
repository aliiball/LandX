import { cn } from '@/design/recipes';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
};

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            'rounded-[var(--radius-sm)] border border-[var(--stroke-default)]',
            'bg-[var(--surface-elevated)] px-2.5 py-1.5 text-xs',
            'font-mono text-[var(--text-secondary)] shadow-[var(--glow-soft)]',
            'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
          )}
          style={{ zIndex: 'var(--z-tooltip)' as unknown as number }}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[var(--surface-elevated)] stroke-[var(--stroke-default)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
