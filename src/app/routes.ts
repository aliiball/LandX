import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

// Phase 0 scaffold: each surface has its layout + a single index placeholder page.
// Additional routes are added per phase (Phase 1+ via `/build-page <id>`).

export default [
  layout('(public)/_layout.tsx', [
    index('(public)/page.tsx'),
    route('b/:slug', 'b.$slug/page.tsx'),
  ]),

  layout('(auth)/_layout.tsx', [route('login', '(auth)/login/page.tsx')]),

  ...prefix('dashboard', [layout('dashboard/_layout.tsx', [index('dashboard/page.tsx')])]),

  ...prefix('broker', [layout('broker/_layout.tsx', [index('broker/page.tsx')])]),

  ...prefix('admin', [layout('admin/_layout.tsx', [index('admin/page.tsx')])]),

  ...prefix('agent', [layout('agent/_layout.tsx', [index('agent/page.tsx')])]),
] satisfies RouteConfig;
