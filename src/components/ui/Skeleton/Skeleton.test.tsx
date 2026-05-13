import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders single rect by default with aria-busy', () => {
    render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el.className).toContain('skeleton-shimmer');
  });

  it('renders multiple text lines', () => {
    render(<Skeleton variant="text" lines={3} data-testid="sk" />);
    const wrapper = screen.getByTestId('sk');
    expect(wrapper.querySelectorAll('.skeleton-shimmer')).toHaveLength(3);
  });

  it('applies width/height styles', () => {
    render(<Skeleton width={100} height={50} data-testid="sk" />);
    const el = screen.getByTestId('sk');
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('50px');
  });
});
