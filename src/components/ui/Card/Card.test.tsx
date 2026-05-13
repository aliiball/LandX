import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders glass tone by default', () => {
    render(<Card data-testid="card">İçerik</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).toContain('rounded');
    expect(el).toHaveTextContent('İçerik');
  });

  it('composes Header + Body + Footer', () => {
    render(
      <Card>
        <CardHeader>Başlık</CardHeader>
        <CardBody>Gövde</CardBody>
        <CardFooter>Eylem</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Başlık')).toBeInTheDocument();
    expect(screen.getByText('Gövde')).toBeInTheDocument();
    expect(screen.getByText('Eylem')).toBeInTheDocument();
  });

  it('applies glow variant', () => {
    render(
      <Card glow="cyan" data-testid="card">
        X
      </Card>,
    );
    expect(screen.getByTestId('card').className).toContain('glow-cyan');
  });
});
