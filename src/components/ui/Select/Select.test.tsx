import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const opts = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
];

describe('Select', () => {
  it('renders options with label', () => {
    render(<Select label="Dil" options={opts} />);
    const select = screen.getByLabelText('Dil') as HTMLSelectElement;
    expect(select.options.length).toBe(2);
  });

  it('placeholder option present when prop set', () => {
    render(<Select label="Dil" placeholder="Seç…" options={opts} />);
    const select = screen.getByLabelText('Dil') as HTMLSelectElement;
    expect(select.options[0]?.textContent).toBe('Seç…');
  });

  it('onChange fires', () => {
    const onChange = vi.fn();
    render(<Select label="Dil" options={opts} onChange={onChange} defaultValue="tr" />);
    fireEvent.change(screen.getByLabelText('Dil'), { target: { value: 'en' } });
    expect(onChange).toHaveBeenCalled();
  });
});
