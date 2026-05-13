import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

// React Testing Library cleanup between tests
afterEach(() => {
  cleanup();
});

// Make import.meta.env.VITE_DEMO_MODE available in tests
beforeAll(() => {
  // jsdom doesn't implement matchMedia; provide a noop shim for components that read it.
  if (typeof window !== 'undefined' && !window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});
