import { ROUTES, type RouteEntry, type RouteKey } from '@/app/routes/manifest';
import { describe, expect, it } from 'vitest';

const ROUTE_TABLE = ROUTES as Record<RouteKey, RouteEntry>;

describe('route manifest (R-05)', () => {
  it('every entry has both browser and hash forms', () => {
    for (const key of Object.keys(ROUTE_TABLE) as RouteKey[]) {
      const entry = ROUTE_TABLE[key];
      expect(entry.path).toBeTypeOf('string');
      expect(entry.hash).toBeTypeOf('string');
      expect(entry.hash.startsWith('#/')).toBe(true);
      expect(entry.path.startsWith('/')).toBe(true);
    }
  });

  it('every entry has a valid mode', () => {
    const validModes = new Set(['csr', 'ssr', 'ssg', 'isr']);
    for (const key of Object.keys(ROUTE_TABLE) as RouteKey[]) {
      expect(validModes.has(ROUTE_TABLE[key].mode)).toBe(true);
    }
  });

  it('prerender flag only set on ssg or ssr routes', () => {
    for (const key of Object.keys(ROUTE_TABLE) as RouteKey[]) {
      const entry = ROUTE_TABLE[key];
      if (entry.prerender === true) {
        expect(entry.mode === 'ssg' || entry.mode === 'ssr').toBe(true);
      }
    }
  });

  it('broker public showcase is prerendered SSG (R-08)', () => {
    const entry = ROUTE_TABLE.brokerPublic;
    expect(entry.mode).toBe('ssg');
    expect(entry.prerender).toBe(true);
  });
});
