import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Kaydet</Button>);
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeInTheDocument();
  });

  it('default type is button (not submit)', () => {
    render(<Button>X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('handles click', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>X</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables interaction when loading', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        X
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies tone class', () => {
    render(<Button tone="danger">Sil</Button>);
    expect(screen.getByRole('button').className).toContain('danger');
  });

  it('block variant fills width', () => {
    render(<Button block>X</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
  });
});
