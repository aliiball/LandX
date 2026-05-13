import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('does not render content when closed', () => {
    render(
      <Sheet open={false} onOpenChange={() => {}} title="X">
        içerik
      </Sheet>,
    );
    expect(screen.queryByText('içerik')).toBeNull();
  });

  it('renders title when open', () => {
    render(
      <Sheet open onOpenChange={() => {}} title="Filtreler">
        içerik
      </Sheet>,
    );
    expect(screen.getByText('Filtreler')).toBeInTheDocument();
  });
});
