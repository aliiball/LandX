import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TokenStream, tokenize } from './TokenStream';

describe('tokenize', () => {
  it('splits text into tokens preserving spaces', () => {
    expect(tokenize('Merhaba dünya').join('')).toBe('Merhaba dünya');
    expect(tokenize('AI tabanlı').length).toBeGreaterThanOrEqual(2);
  });
});

describe('TokenStream', () => {
  it('renders status with aria-live', () => {
    render(<TokenStream tokens={['Hi']} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('emits tokens over time (real timers)', async () => {
    render(<TokenStream tokens={['Merhaba ', 'dünya']} intervalMs={5} />);
    await waitFor(
      () => {
        expect(screen.getByRole('status').textContent).toContain('Merhaba');
      },
      { timeout: 500 },
    );
  });
});
