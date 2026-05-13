import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders internal router link', () => {
    render(
      <MemoryRouter>
        <Link to="/search">Ara</Link>
      </MemoryRouter>,
    );
    const a = screen.getByRole('link', { name: 'Ara' });
    expect(a).toHaveAttribute('href', '/search');
  });

  it('renders external link with rel + target', () => {
    render(
      <Link external href="https://example.com">
        Dış bağlantı
      </Link>,
    );
    const a = screen.getByRole('link', { name: 'Dış bağlantı' });
    expect(a).toHaveAttribute('href', 'https://example.com');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    expect(a).toHaveAttribute('target', '_blank');
  });
});
