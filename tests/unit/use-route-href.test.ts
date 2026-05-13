import { routeHref } from '@/lib/routing/useRouteHref';
import { describe, expect, it, vi } from 'vitest';

describe('useRouteHref / routeHref (R-05)', () => {
  it('returns browser path when VITE_ROUTER_MODE=browser', () => {
    vi.stubEnv('VITE_ROUTER_MODE', 'browser');
    expect(routeHref('listingDetail', { id: '42' })).toBe('/listing/42');
    expect(routeHref('search')).toBe('/search');
    vi.unstubAllEnvs();
  });

  it('returns hash path when VITE_ROUTER_MODE=hash', () => {
    vi.stubEnv('VITE_ROUTER_MODE', 'hash');
    expect(routeHref('listingDetail', { id: '42' })).toBe('#/listing/42');
    expect(routeHref('search')).toBe('#/search');
    vi.unstubAllEnvs();
  });

  it('encodes params', () => {
    vi.stubEnv('VITE_ROUTER_MODE', 'browser');
    expect(routeHref('brokerPublic', { slug: 'karaca emlak' })).toBe('/b/karaca%20emlak');
    vi.unstubAllEnvs();
  });
});
