import { cn } from '@/design/recipes';
import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router';

export type LinkTone = 'default' | 'subtle' | 'neon';

const TONE_CLASS: Record<LinkTone, string> = {
  default: 'text-[var(--text-primary)] hover:text-[var(--accent-cyan)]',
  subtle: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  neon: 'text-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:underline',
};

const BASE =
  'inline-flex items-center gap-1 underline-offset-4 ' +
  'transition-colors duration-[var(--duration-small)] ease-[var(--ease-out-expo)] ' +
  'focus-visible:outline-none focus-visible:shadow-[var(--glow-cyan)] focus-visible:rounded-[var(--radius-xs)]';

type InternalLinkProps = RouterLinkProps & {
  tone?: LinkTone;
  external?: false;
};

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: LinkTone;
  external: true;
  href: string;
};

export type LinkProps = InternalLinkProps | ExternalLinkProps;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const { tone = 'default', className, children, ...rest } = props;
  const toneClass = TONE_CLASS[tone];

  if ('external' in props && props.external) {
    const { external: _external, ...anchorRest } = rest as ExternalLinkProps;
    return (
      <a
        ref={ref}
        rel="noopener noreferrer"
        target="_blank"
        className={cn(BASE, toneClass, className)}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink ref={ref} className={cn(BASE, toneClass, className)} {...(rest as RouterLinkProps)}>
      {children}
    </RouterLink>
  );
});
