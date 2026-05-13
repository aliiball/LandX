import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="X" responsive={false}>
        içerik
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog with title + close button', () => {
    render(
      <Modal open onOpenChange={() => {}} title="Başlık" responsive={false}>
        İçerik
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Başlık')).toBeInTheDocument();
    expect(screen.getByLabelText('Kapat')).toBeInTheDocument();
  });

  it('Escape closes dialog when dismissible', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="X" responsive={false}>
        içerik
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
