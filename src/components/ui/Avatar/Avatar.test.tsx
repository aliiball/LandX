import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials when no src', () => {
    render(<Avatar name="Ayşe Demir" />);
    expect(screen.getByText('AD')).toBeInTheDocument();
  });

  it('exposes name as aria-label', () => {
    render(<Avatar name="Mehmet Yılmaz" />);
    expect(screen.getByRole('img', { name: 'Mehmet Yılmaz' })).toBeInTheDocument();
  });
});
