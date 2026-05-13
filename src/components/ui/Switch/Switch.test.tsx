import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with role=switch', () => {
    render(<Switch label="Bildirimleri aç" />);
    expect(screen.getByRole('switch', { name: 'Bildirimleri aç' })).toBeInTheDocument();
  });

  it('toggles on click', () => {
    const onChange = vi.fn();
    render(<Switch label="X" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('X'));
    expect(onChange).toHaveBeenCalled();
  });
});
