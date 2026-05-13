# CLAUDE.md — LandX / arsam.net Frontend

> **Source of truth:** `PROMPT.md` at repo root. Always re-read `PROMPT.md §<section>` before working on that section. This file is a CONDENSED operational memory only.

## Stack

- **Build:** Vite 6 + React 19 (strict, TS strict)
- **Router:** React Router v7 framework mode (dual browser/hash via `VITE_ROUTER_MODE`)
- **UI:** Flowbite React + Tailwind CSS v4 (CSS-first `@theme`) + CVA recipes
- **Forms:** react-hook-form + zod
- **State:** TanStack Query v5 (server) + Zustand slim (client) + URL state
- **Map:** MapLibre GL JS + deck.gl
- **Charts:** Recharts + visx
- **Mock:** MSW v2 + @faker-js/faker (TR locale, deterministic seed)
- **i18n:** react-i18next, ICU MessageFormat — TR primary, EN full parity
- **Test:** Vitest + @testing-library/react + Playwright (e2e + visual regression)
- **Lint/Format:** Biome (single config)
- **Pkg mgr:** **pnpm 9 ONLY** (npm/yarn FORBIDDEN)
- **Node:** 22 LTS

## Commands (canonical)

```bash
pnpm install           # install deps
pnpm dev               # react-router dev (localhost:5173)
pnpm build             # browser-mode production build
pnpm build:demo        # hash-routing demo build + 404.html fallback
pnpm preview           # serve built output
pnpm typecheck         # tsc --noEmit
pnpm test              # vitest run
pnpm e2e               # playwright test
pnpm biome:check       # biome check (read-only)
pnpm biome:fix         # biome check --write
pnpm i18n:lint         # verify TR/EN parity
```

## Naming Conventions

- **Components:** `PascalCase.tsx` — `ListingCard.tsx`, `PersonaSwitcher.tsx`
- **Hooks:** `useCamelCase.ts` — `useDemoIdentity.ts`, `useRouteHref.ts`
- **Routes:** `kebab-case` — `/post-listing`, `/broker/ai-tools`
- **Files (non-component):** `kebab-case.ts` — `query-keys.ts`, `route-manifest.ts`
- **CSS variables:** `--kebab-case` — `--surface-glass`, `--ease-out-expo`
- **i18n keys:** dot.namespaced — `landing.hero.cta`, `broker.leads.title`

## Never-Do Rules (HARD BANS)

- `any` type — use `unknown` + type guard
- Inline `style={{}}` — Tailwind classes or CVA recipes only
- `export default` for components / utilities — named exports only.
  **Exception:** React Router v7 framework-mode route modules (`src/app/**/*.tsx`, `src/app/routes.ts`, `src/app/root.tsx`) REQUIRE `export default` per RR v7 convention. Biome rule disabled globally; reviewers enforce named exports outside route files manually.
- Reading `.env*` from app code at runtime — use typed `import.meta.env.VITE_*`
- `rm -rf` in scripts/commands
- `git push --force`
- `pnpm publish` (this is not a library)
- `npm install` / `yarn add` — pnpm only, lockfile authoritative
- Inter / Roboto / system-ui font — Geist + JetBrains Mono only
- Multiple neon accents in single viewport (PROMPT §2.1)
- Spinner for AI "thinking" — use shimmer / breathing dot / token-stream
- `<div onClick>` — use `<button>` for a11y

## Quality Gates (every commit must pass)

- TypeScript 0 errors, 0 `any`
- Biome 0 warnings
- Vitest unit tests PASS for changed feature
- Playwright smoke green
- a11y: axe-core 0 violations
- Bundle: route base < 70KB gz; initial paint ≤ 180KB gz
- i18n: TR/EN parity (missing key = CI error)
- SSG pages: `<noscript>` fallback ≥ 200 chars (R-08)
- Production build: `landx_demo_persona` string 0 occurrences (R-01 tree-shake)
- `dist/404.html === dist/index.html` for build:demo (R-05)

## Surface Map

| Surface | Layout | Route prefix | Source dir |
|---|---|---|---|
| Public Marketplace | PublicLayout | `/` | `src/app/(public)/` |
| Auth | AuthLayout | `/login`, `/register`, … | `src/app/(auth)/` |
| User Dashboard | DashboardLayout | `/dashboard/*` | `src/app/dashboard/` |
| Broker Dashboard | BrokerLayout | `/broker/*` | `src/app/broker/` |
| Broker Showcase (SSG) | PublicLayout | `/b/:slug` | `src/app/b/` |
| Admin Panel | AdminLayout | `/admin/*` | `src/app/admin/` |
| Agent / MCP | AgentLayout | `/agent/*` | `src/app/agent/` |

## Phase Reference

| Phase | Scope | PROMPT § |
|---|---|---|
| 0 | Foundations (bootstrap) | §12 Phase 0 |
| 1 | Design System & Component Library | §12 Phase 1 |
| 2 | Public Marketplace (A1–A11) | §7.A, §12 Phase 2 |
| 3 | Auth + User Dashboard (B1–B10) | §7.B, §12 Phase 3 |
| 3.5 | Broker Dashboard (B'1–B'10) — R-04 | §7.B', §12 Phase 3.5 |
| 4 | Listing wizard + AI tools | §7.A.A5/A7/A8, §12 Phase 4 |
| 5 | Admin Panel (C1–C17) | §7.C, §12 Phase 5 |
| 6 | Agent / MCP Debugger (D1–D11) | §7.D, §12 Phase 6 |
| 7 | Polish + PWA + SSG/SSR + Demo Deploy | §12 Phase 7 |
| 8 | Deliverables package | §12 Phase 8 |

## Confirmed Decisions (A1–A15)

See `/Users/ali/.claude/plans/read-prompt-md-fully-immutable-babbage.md` for full rationale. Summary:

A1 MSW mock-first · A2 MapLibre+OSM · A3 TR+EN parity · A4 all auth methods (flag-driven) ·
A5 Anthropic-style mock SSE · A6 OSM + mock imar GeoJSON · A7 wordmark placeholder ·
A8 mock toasts · A9 UI-only checkout · A10 Posthog disabled · **A11 3 broker sub-roles** ·
**A12 browser prod + hash demo** · **A13 SSG/SSR/CSR matrix, ISR=60s** ·
**A14 Persona Switcher in demo build only** · **A15 `/b/:slug` path-based**

## Demo Mantra

> Every clickable surface produces a realistic reaction. Mock = deterministic. No dead clicks. Streaming = real token-by-token feel. Forms = real success/error states. Optimistic updates persist in `sessionStorage` / `localStorage` where appropriate.

## When stuck

1. Re-read `PROMPT.md §<relevant section>` (source of truth)
2. Re-read this `CLAUDE.md`
3. Ask the user — don't assume
