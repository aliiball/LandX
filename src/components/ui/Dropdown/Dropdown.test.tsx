import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('toggles menu on trigger click', () => {
    const onSelect = vi.fn();
    render(<Dropdown trigger={<span>Aç</span>} items={[{ id: 'a', label: 'Eylem', onSelect }]} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Eylem' }));
    expect(onSelect).toHaveBeenCalled();
  });
});
