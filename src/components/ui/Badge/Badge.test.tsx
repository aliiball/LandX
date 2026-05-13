import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Aktif</Badge>);
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('applies tone class', () => {
    render(<Badge tone="agent">Agent</Badge>);
    expect(screen.getByText('Agent').className).toContain('magenta');
  });

  it('renders dot when prop set', () => {
    const { container } = render(<Badge dot>X</Badge>);
    expect(container.querySelector('span > span[aria-hidden="true"]')).not.toBeNull();
  });
});
