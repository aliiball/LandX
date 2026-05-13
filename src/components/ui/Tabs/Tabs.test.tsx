import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { id: 'a', label: 'A', content: <div>İçerik A</div> },
  { id: 'b', label: 'B', content: <div>İçerik B</div> },
];

describe('Tabs', () => {
  it('first tab is active by default', () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('İçerik A')).toBeInTheDocument();
  });

  it('clicking switches tab', () => {
    render(<Tabs items={items} />);
    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('İçerik B')).toBeInTheDocument();
  });

  it('ArrowRight moves to next', () => {
    render(<Tabs items={items} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'A' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
  });
});
