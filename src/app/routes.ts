import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

// Phase 0 scaffold: each surface has its layout + a single index placeholder page.
// Additional routes are added per phase (Phase 1+ via `/build-page <id>`).

export default [
  layout('(public)/_layout.tsx', [
    index('(public)/page.tsx'),
    route('search', '(public)/search/page.tsx'),
    route('listing/:id', '(public)/listing.$id/page.tsx'),
    route('map', '(public)/map/page.tsx'),
    route('compare', '(public)/compare/page.tsx'),
    route('post-listing', '(public)/post-listing/page.tsx'),
    route('tools/valuation', '(public)/tools.valuation/page.tsx'),
    route('tools/investment-sim', '(public)/tools.investment-sim/page.tsx'),
    route('regions', '(public)/regions/page.tsx'),
    route('about', '(public)/about/page.tsx'),
    route('pricing', '(public)/pricing/page.tsx'),
    route('legal/:doc', '(public)/legal.$doc/page.tsx'),
    route('contact', '(public)/contact/page.tsx'),
    route('blog', '(public)/blog/page.tsx'),
    route('blog/:slug', '(public)/blog.$slug/page.tsx'),
    route('design', '(public)/design/page.tsx'),
    route('b/:slug', 'b.$slug/page.tsx'),
  ]),

  layout('(auth)/_layout.tsx', [
    route('login', '(auth)/login/page.tsx'),
    route('register', '(auth)/register/page.tsx'),
    route('forgot', '(auth)/forgot/page.tsx'),
    route('reset', '(auth)/reset/page.tsx'),
    route('verify', '(auth)/verify/page.tsx'),
    route('passkey-setup', '(auth)/passkey-setup/page.tsx'),
  ]),

  ...prefix('dashboard', [
    layout('dashboard/_layout.tsx', [
      index('dashboard/page.tsx'),
      route('listings', 'dashboard/listings/page.tsx'),
      route('favorites', 'dashboard/favorites/page.tsx'),
      route('alerts', 'dashboard/alerts/page.tsx'),
      route('messages', 'dashboard/messages/page.tsx'),
      route('ai', 'dashboard/ai/page.tsx'),
      route('security', 'dashboard/security/page.tsx'),
      route('profile', 'dashboard/profile/page.tsx'),
      route('billing', 'dashboard/billing/page.tsx'),
      route('kyc', 'dashboard/kyc/page.tsx'),
    ]),
  ]),

  ...prefix('broker', [
    layout('broker/_layout.tsx', [
      index('broker/page.tsx'),
      route('portfolio', 'broker/portfolio/page.tsx'),
      route('leads', 'broker/leads/page.tsx'),
      route('clients', 'broker/clients/page.tsx'),
      route('commissions', 'broker/commissions/page.tsx'),
      route('showcase', 'broker/showcase/page.tsx'),
      route('team', 'broker/team/page.tsx'),
      route('analytics', 'broker/analytics/page.tsx'),
      route('ai-tools', 'broker/ai-tools/page.tsx'),
      route('subscription', 'broker/subscription/page.tsx'),
    ]),
  ]),

  ...prefix('admin', [layout('admin/_layout.tsx', [index('admin/page.tsx')])]),

  ...prefix('agent', [layout('agent/_layout.tsx', [index('agent/page.tsx')])]),
] satisfies RouteConfig;
