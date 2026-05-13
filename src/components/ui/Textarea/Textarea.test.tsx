import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Açıklama" />);
    expect(screen.getByLabelText('Açıklama')).toBeInTheDocument();
  });

  it('exposes aria-invalid on error', () => {
    render(<Textarea label="X" error errorText="Hatalı" />);
    expect(screen.getByLabelText('X')).toHaveAttribute('aria-invalid', 'true');
  });
});
