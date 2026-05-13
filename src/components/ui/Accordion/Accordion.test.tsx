import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'Soru 1', content: <p>Cevap 1</p> },
  { id: 'b', title: 'Soru 2', content: <p>Cevap 2</p> },
];

describe('Accordion', () => {
  it('renders headers; content hidden by default', () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole('button', { name: 'Soru 1' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByText('Cevap 1')).toBeNull();
  });

  it('click toggles open state', () => {
    render(<Accordion items={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'Soru 1' }));
    expect(screen.getByText('Cevap 1')).toBeInTheDocument();
  });

  it('single mode closes others on open', () => {
    render(<Accordion items={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'Soru 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Soru 2' }));
    expect(screen.queryByText('Cevap 1')).toBeNull();
    expect(screen.getByText('Cevap 2')).toBeInTheDocument();
  });
});
