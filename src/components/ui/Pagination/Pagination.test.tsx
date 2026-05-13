import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('disables Prev on first page', () => {
    render(<Pagination page={1} pageCount={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /Önceki sayfa/ })).toBeDisabled();
  });

  it('clicking Next emits +1', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Sonraki sayfa/ }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not call when clicking current page', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    const current = screen.getByRole('button', { current: 'page' });
    fireEvent.click(current);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
