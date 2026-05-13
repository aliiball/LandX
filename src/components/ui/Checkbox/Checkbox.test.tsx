import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="KVKK kabul ediyorum" />);
    expect(screen.getByLabelText('KVKK kabul ediyorum')).toBeInTheDocument();
  });

  it('onChange fires when clicked', () => {
    const onChange = vi.fn();
    render(<Checkbox label="X" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('X'));
    expect(onChange).toHaveBeenCalled();
  });

  it('indeterminate state set on DOM', () => {
    render(<Checkbox label="X" indeterminate />);
    const input = screen.getByLabelText('X') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
