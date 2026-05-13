import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThinkingDot } from './ThinkingDot';

describe('ThinkingDot', () => {
  it('renders aria status with label', () => {
    render(<ThinkingDot label="Yükleniyor" />);
    expect(screen.getByRole('status', { name: 'Yükleniyor' })).toBeInTheDocument();
  });

  it('renders three dots', () => {
    const { container } = render(<ThinkingDot />);
    expect(container.querySelectorAll('.thinking-dot')).toHaveLength(3);
  });
});
