# Phase 0 — Foundations

Status: ✅ Bootstrapped (pending `pnpm install` + verification on user's machine)
Date: 2026-05-13

## Goal
Bootstrap a Vite + React 19 + RR v7 + Tailwind v4 + Flowbite project with empty layout skeletons for all 6 surface roots. MSW running with empty handlers. i18n initialized. CI passing. Persona Switcher wired but not populated with feature pages.

## Decisions baked in
- A1 Mock-first via MSW (`src/mocks/handlers/`)
- A2 MapLibre + OSM (deps installed; map components Phase 2)
- A3 TR primary + EN parity (`src/i18n/{tr,en}/common.json`)
- A4 All auth methods in UI (login placeholder; full Phase 3)
- A11 Three broker sub-roles (`src/lib/auth/personas.ts`)
- A12 Browser prod + Hash demo (`src/lib/routing/useRouteHref.ts`, `src/app/routes/manifest.ts`)
- A13 SSG/SSR/CSR matrix per route in manifest
- A14 PersonaSwitcher tree-shaken when `VITE_DEMO_MODE=false`
- A15 `/b/:slug` path-based broker showcase

## Files delivered

### Root configs
- `package.json`, `pnpm` lockfile (post-install)
- `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts` (Tailwind v4 + RR v7 + tsconfig-paths)
- `react-router.config.ts` (ssr: false, appDirectory: src/app)
- `biome.json` (formatter + linter, no-default-export overrides for routes)
- `playwright.config.ts` (3 viewports: iPhone SE 375, iPad 768, Desktop 1440)
- `vitest.config.ts` (jsdom)
- `.nvmrc`, `.npmrc`, `.env.example`, `.gitignore`

### `.claude/`
- `agents/` × 6 (frontend-architect, design-system-engineer, page-builder, ai-feature-engineer, a11y-auditor, qa-reviewer)
- `commands/` × 4 (phase-start, build-page, audit-page, demo-prep)
- `settings.example.json` — **rename to `settings.json` manually** (auto mode classifier blocked direct write)

### `.mcp.json`
Playwright, Chrome DevTools, shadcn (fallback components), GitHub (via $GITHUB_PAT).

### Design system
- `src/design/tokens.css` — full Obsidian Grid token set (PROMPT §2.1)
- `src/design/motion.ts` — easing + duration constants
- `src/design/recipes.ts` — CVA recipe stubs (glass, heading) + `cn()` helper
- `src/styles/globals.css` — Tailwind v4 `@theme`, base reset, AppShell background system
- `src/styles/fonts.css` — Geist + JetBrains Mono `@font-face`
- `scripts/fetch-fonts.mjs` — downloads woff2 files

### Routing
- `src/app/routes/manifest.ts` — 60+ route entries with `{ path, hash, mode, prerender }` (R-05 + R-08)
- `src/app/routes.ts` — Phase 0 minimal route config (per-surface layout + index)
- `src/lib/routing/useRouteHref.ts` — dual-mode URL resolver
- `src/types/env.d.ts` — typed `import.meta.env`

### App shell + 6 layouts
- `src/app/root.tsx` — root layout, MSW conditional bootstrap, QueryClient, i18n provider, `<noscript>` fallback ≥ 200 chars
- `src/components/layout/AppShell.tsx`
- `src/components/layout/LayoutTopBar.tsx`
- `src/components/layout/DashboardSidebar.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/PersonaSwitcher.tsx` — tree-shakeable, `Ctrl+Shift+P`, sessionStorage, `?persona=` sync
- `src/components/layout/DemoModeBadge.tsx`
- `src/components/layout/SurfacePlaceholder.tsx`
- `src/app/(public)/_layout.tsx` + `(public)/page.tsx`
- `src/app/(auth)/_layout.tsx` + `(auth)/login/page.tsx`
- `src/app/dashboard/_layout.tsx` + `dashboard/page.tsx`
- `src/app/broker/_layout.tsx` + `broker/page.tsx`
- `src/app/admin/_layout.tsx` + `admin/page.tsx`
- `src/app/agent/_layout.tsx` + `agent/page.tsx`
- `src/app/b.$slug/page.tsx` — broker showcase placeholder

### Demo identity
- `src/lib/auth/personas.ts` — 5 persona definitions
- `src/lib/auth/useDemoIdentity.ts` — hook with sessionStorage + URL sync
- `src/mocks/seed/personas.ts` — pre-seeded permission + agent-scope fixtures

### Mock layer
- `src/mocks/openapi.yaml` — placeholder
- `src/mocks/browser.ts` — MSW worker setup
- `src/mocks/handlers/index.ts` — `/api/health`, `/api/me` with persona-aware response
- `src/mocks/seed/faker-config.ts` — deterministic seed (20260513)
- `src/lib/api/client.ts` — fetch wrapper

### i18n
- `src/i18n/index.ts` — i18next init with browser detector
- `src/i18n/{tr,en}/common.json` — minimal parity set
- `src/i18n/lint.ts` — parity verification script

### Tests + CI
- `tests/setup.ts` — testing-library + jsdom shim
- `tests/unit/route-manifest.test.ts` — R-05 contract checks
- `tests/unit/use-route-href.test.ts` — dual-mode URL resolver
- `tests/e2e/smoke.spec.ts` — 6 surfaces reachable, no console errors
- `tests/e2e/persona-switcher.spec.ts` — keyboard, sessionStorage, query param
- `.github/workflows/ci.yml` — typecheck, biome, i18n, unit, e2e, build, tree-shake verification, 404.html diff
- `.github/workflows/demo.yml` — GH Pages deploy (disabled until Phase 7)

### Documentation
- `README.md` — quick start, scripts, env vars, project structure
- `docs/module-map.md` — module → route mapping
- `docs/phases/phase-0.md` — this file

## Acceptance criteria

- [ ] `pnpm install` — clean
- [ ] `pnpm exec msw init public/ --save` — generates `public/mockServiceWorker.js`
- [ ] `pnpm typecheck` — 0 errors
- [ ] `pnpm biome:check` — 0 warnings
- [ ] `pnpm test` — vitest passes (route manifest + URL resolver tests)
- [ ] `pnpm dev` — boots at `http://localhost:5173` with no console errors
- [ ] All 6 surfaces render via direct URL + via PersonaSwitcher
- [ ] `pnpm build` — succeeds; bundle within budget
- [ ] `pnpm build:demo` — produces `build/client/404.html` = `build/client/index.html`
- [ ] `VITE_DEMO_MODE=false pnpm build` — grep `landx_demo_persona` returns 0 matches in `build/client/`

## Open items (carry to Phase 1)
- **CLA — Manual step:** rename `.claude/settings.example.json` → `.claude/settings.json` (auto mode classifier prevented direct write).
- **CLB — Manual step:** set `GITHUB_PAT` env var in shell before re-launching Claude Code (for `github` MCP server).
- **CLC — Fonts:** if `scripts/fetch-fonts.mjs` is interrupted or sources change, replace placeholder `public/fonts/*.woff2` with valid files.
- **CLD — Component library:** all `components/ui/*` primitives (Button, Input, Card, …) are scoped to Phase 1.

## Out of scope (delivered later)
- Real listing data, search, map — Phase 2
- Auth flows beyond placeholder — Phase 3
- Broker portfolio / leads / commissions — Phase 3.5
- Admin CRUD pages — Phase 5
- MCP debugger, trace explorer — Phase 6
- SSG/SSR prerender wiring — Phase 7
- PWA service worker activation — Phase 7
- Lighthouse CI gates — Phase 7
- Visual regression baselines — Phase 7
