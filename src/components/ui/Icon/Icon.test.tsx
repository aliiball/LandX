import { render } from '@testing-library/react';
import { Check } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders aria-hidden by default', () => {
    const { container } = render(<Icon icon={Check} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('exposes aria-label when label prop set', () => {
    const { container } = render(<Icon icon={Check} label="Onayla" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('Onayla');
    expect(svg?.getAttribute('role')).toBe('img');
  });

  it('applies tone class', () => {
    const { container } = render(<Icon icon={Check} tone="cyan" />);
    const svg = container.querySelector('svg');
    expect(svg?.className.baseVal ?? svg?.getAttribute('class')).toContain('accent-cyan');
  });
});
