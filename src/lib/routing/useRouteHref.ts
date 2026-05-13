import { ROUTES, type RouteKey } from '@/app/routes/manifest';

/**
 * Resolve a route key + params to the correct URL form based on active routing mode (R-05).
 *
 * Examples:
 *   useRouteHref('listingDetail', { id: '42' })
 *     → '/listing/42'         (browser mode)
 *     → '#/listing/42'        (hash mode)
 */
export function useRouteHref<K extends RouteKey>(
  key: K,
  params?: Record<string, string | number>,
): string {
  const entry = ROUTES[key];
  const mode = import.meta.env.VITE_ROUTER_MODE ?? 'browser';
  const template = mode === 'hash' ? entry.hash : entry.path;

  if (!params) return template;

  return Object.entries(params).reduce<string>(
    (acc, [k, v]) => acc.replace(`:${k}`, encodeURIComponent(String(v))),
    template,
  );
}

/** Non-hook variant for use outside React (e.g. in tests, loaders). */
export function routeHref<K extends RouteKey>(
  key: K,
  params?: Record<string, string | number>,
): string {
  return useRouteHref(key, params);
}
