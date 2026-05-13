import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toaster } from './Toaster';

describe('Toaster', () => {
  it('mounts without throwing', () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });
});
