import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label associated to input', () => {
    render(<Input label="E-posta" />);
    const input = screen.getByLabelText('E-posta');
    expect(input).toBeInTheDocument();
  });

  it('exposes aria-invalid + error text with role=alert', () => {
    render(<Input label="X" error errorText="Hatalı" />);
    expect(screen.getByLabelText('X')).toHaveAttribute('aria-invalid', 'true');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Hatalı');
  });

  it('aria-describedby wires to help text', () => {
    render(<Input label="X" helpText="Yardım" />);
    const input = screen.getByLabelText('X');
    const desc = input.getAttribute('aria-describedby');
    expect(desc).toBeTruthy();
    expect(screen.getByText('Yardım').id).toBe(desc);
  });
});
