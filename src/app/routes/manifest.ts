// Single source of truth for routes — supports dual-mode routing (R-05).
// Each entry exposes both `path` (browser mode) and `hash` (hash mode) forms,
// plus its rendering mode (R-08).

export type RenderMode = 'csr' | 'ssr' | 'ssg' | 'isr';

export type RouteEntry = {
  /** Browser-mode path with React Router params syntax. */
  readonly path: string;
  /** Hash-mode equivalent (used when VITE_ROUTER_MODE=hash). */
  readonly hash: string;
  /** Rendering strategy — see PROMPT §5.4. */
  readonly mode: RenderMode;
  /** Whether this route is eligible for prerender in browser mode. */
  readonly prerender?: boolean;
};

export const ROUTES = {
  // --- Public Marketplace ---
  landing: { path: '/', hash: '#/', mode: 'ssg', prerender: true },
  search: { path: '/search', hash: '#/search', mode: 'csr' },
  listingDetail: { path: '/listing/:id', hash: '#/listing/:id', mode: 'ssr' },
  map: { path: '/map', hash: '#/map', mode: 'csr' },
  postListing: { path: '/post-listing', hash: '#/post-listing', mode: 'csr' },
  compare: { path: '/compare', hash: '#/compare', mode: 'csr' },
  valuationTool: { path: '/tools/valuation', hash: '#/tools/valuation', mode: 'csr' },
  investmentSim: { path: '/tools/investment-sim', hash: '#/tools/investment-sim', mode: 'csr' },
  regions: { path: '/regions', hash: '#/regions', mode: 'ssg', prerender: true },
  about: { path: '/about', hash: '#/about', mode: 'ssg', prerender: true },
  pricing: { path: '/pricing', hash: '#/pricing', mode: 'ssg', prerender: true },
  contact: { path: '/contact', hash: '#/contact', mode: 'ssg', prerender: true },
  blog: { path: '/blog', hash: '#/blog', mode: 'ssg', prerender: true },
  blogPost: { path: '/blog/:slug', hash: '#/blog/:slug', mode: 'ssg', prerender: true },
  legal: { path: '/legal/:doc', hash: '#/legal/:doc', mode: 'ssg', prerender: true },

  // --- Auth ---
  login: { path: '/login', hash: '#/login', mode: 'csr' },
  register: { path: '/register', hash: '#/register', mode: 'csr' },
  forgot: { path: '/forgot', hash: '#/forgot', mode: 'csr' },
  reset: { path: '/reset', hash: '#/reset', mode: 'csr' },
  verify: { path: '/verify', hash: '#/verify', mode: 'csr' },
  passkeySetup: { path: '/passkey-setup', hash: '#/passkey-setup', mode: 'csr' },

  // --- User Dashboard ---
  dashboard: { path: '/dashboard', hash: '#/dashboard', mode: 'csr' },
  dashboardListings: { path: '/dashboard/listings', hash: '#/dashboard/listings', mode: 'csr' },
  dashboardFavorites: { path: '/dashboard/favorites', hash: '#/dashboard/favorites', mode: 'csr' },
  dashboardAlerts: { path: '/dashboard/alerts', hash: '#/dashboard/alerts', mode: 'csr' },
  dashboardMessages: { path: '/dashboard/messages', hash: '#/dashboard/messages', mode: 'csr' },
  dashboardAi: { path: '/dashboard/ai', hash: '#/dashboard/ai', mode: 'csr' },
  dashboardSecurity: { path: '/dashboard/security', hash: '#/dashboard/security', mode: 'csr' },
  dashboardProfile: { path: '/dashboard/profile', hash: '#/dashboard/profile', mode: 'csr' },
  dashboardBilling: { path: '/dashboard/billing', hash: '#/dashboard/billing', mode: 'csr' },
  dashboardKyc: { path: '/dashboard/kyc', hash: '#/dashboard/kyc', mode: 'csr' },

  // --- Broker Dashboard (R-04) ---
  broker: { path: '/broker', hash: '#/broker', mode: 'csr' },
  brokerPortfolio: { path: '/broker/portfolio', hash: '#/broker/portfolio', mode: 'csr' },
  brokerLeads: { path: '/broker/leads', hash: '#/broker/leads', mode: 'csr' },
  brokerClients: { path: '/broker/clients', hash: '#/broker/clients', mode: 'csr' },
  brokerCommissions: { path: '/broker/commissions', hash: '#/broker/commissions', mode: 'csr' },
  brokerShowcase: { path: '/broker/showcase', hash: '#/broker/showcase', mode: 'csr' },
  brokerTeam: { path: '/broker/team', hash: '#/broker/team', mode: 'csr' },
  brokerAnalytics: { path: '/broker/analytics', hash: '#/broker/analytics', mode: 'csr' },
  brokerAiTools: { path: '/broker/ai-tools', hash: '#/broker/ai-tools', mode: 'csr' },
  brokerSubscription: { path: '/broker/subscription', hash: '#/broker/subscription', mode: 'csr' },

  // --- Broker public showcase (R-04 + A15) ---
  brokerPublic: { path: '/b/:slug', hash: '#/b/:slug', mode: 'ssg', prerender: true },

  // --- Admin Panel ---
  admin: { path: '/admin', hash: '#/admin', mode: 'csr' },
  adminTenants: { path: '/admin/tenants', hash: '#/admin/tenants', mode: 'csr' },
  adminUsers: { path: '/admin/users', hash: '#/admin/users', mode: 'csr' },
  adminRoles: { path: '/admin/roles', hash: '#/admin/roles', mode: 'csr' },
  adminPlugins: { path: '/admin/plugins', hash: '#/admin/plugins', mode: 'csr' },
  adminDoctypes: { path: '/admin/doctypes', hash: '#/admin/doctypes', mode: 'csr' },
  adminMigrations: { path: '/admin/migrations', hash: '#/admin/migrations', mode: 'csr' },
  adminHooks: { path: '/admin/hooks', hash: '#/admin/hooks', mode: 'csr' },
  adminConfig: { path: '/admin/config', hash: '#/admin/config', mode: 'csr' },
  adminApi: { path: '/admin/api', hash: '#/admin/api', mode: 'csr' },
  adminWorkflows: { path: '/admin/workflows', hash: '#/admin/workflows', mode: 'csr' },
  adminAudit: { path: '/admin/audit', hash: '#/admin/audit', mode: 'csr' },
  adminPii: { path: '/admin/pii', hash: '#/admin/pii', mode: 'csr' },
  adminCompliance: { path: '/admin/compliance', hash: '#/admin/compliance', mode: 'csr' },
  adminSlo: { path: '/admin/slo', hash: '#/admin/slo', mode: 'csr' },
  adminSecurity: { path: '/admin/security/reviews', hash: '#/admin/security/reviews', mode: 'csr' },

  // --- Agent / MCP Debugger ---
  agent: { path: '/agent', hash: '#/agent', mode: 'csr' },
  agentMcp: { path: '/agent/mcp', hash: '#/agent/mcp', mode: 'csr' },
  agentTools: { path: '/agent/tools', hash: '#/agent/tools', mode: 'csr' },
  agentAgents: { path: '/agent/agents', hash: '#/agent/agents', mode: 'csr' },
  agentMemory: { path: '/agent/memory', hash: '#/agent/memory', mode: 'csr' },
  agentVectors: { path: '/agent/vectors', hash: '#/agent/vectors', mode: 'csr' },
  agentPrompts: { path: '/agent/prompts', hash: '#/agent/prompts', mode: 'csr' },
  agentProviders: { path: '/agent/providers', hash: '#/agent/providers', mode: 'csr' },
  agentObservability: { path: '/agent/observability', hash: '#/agent/observability', mode: 'csr' },
  agentWorkflows: { path: '/agent/workflows', hash: '#/agent/workflows', mode: 'csr' },
  agentConversations: { path: '/agent/conversations', hash: '#/agent/conversations', mode: 'csr' },
} as const satisfies Record<string, RouteEntry>;

export type RouteKey = keyof typeof ROUTES;
