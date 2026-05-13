# LandX / arsam.net Frontend

AI-first arsa marketplace — demo prototype.

> Project brief: [`PROMPT.md`](./PROMPT.md) · Operational rules: [`CLAUDE.md`](./CLAUDE.md)

## Quick start (< 5 min)

```bash
# Prerequisites: Node 22 LTS, pnpm 9
nvm use            # honors .nvmrc
pnpm install
pnpm exec msw init public/ --save
pnpm dev           # → http://localhost:5173
```

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | React Router dev server (browser mode, MSW on) |
| `pnpm build` | Browser-mode production build → `build/client/` |
| `pnpm build:demo` | Hash-mode demo build + 404.html fallback (GH Pages ready) |
| `pnpm preview` | Serve the built output |
| `pnpm typecheck` | `tsc --noEmit` + `react-router typegen` |
| `pnpm test` | Vitest unit tests |
| `pnpm e2e` | Playwright end-to-end tests |
| `pnpm biome:check` / `pnpm biome:fix` | Lint / format |
| `pnpm i18n:lint` | Verify TR/EN parity |

## Environment variables

Copy `.env.example` → `.env.local` and tweak. All vars are build-time switches.

| Var | Default | Purpose |
|---|---|---|
| `VITE_DEMO_MODE` | `true` (local) / `false` (prod) | Toggles PersonaSwitcher visibility (R-01). Tree-shaken when `false`. |
| `VITE_ROUTER_MODE` | `browser` (prod) / `hash` (demo) | Dual-mode routing (R-05). |
| `VITE_API_BASE_URL` | empty | When empty, MSW mock layer is used. |
| `VITE_ENABLE_POSTHOG` | `false` | Posthog scaffolding present but disabled for prototype. |
| `GITHUB_PAT` | — | Required by the `github` MCP server in `.mcp.json`. |

## Project structure

```
src/
├─ app/                       React Router v7 framework routes
│  ├─ root.tsx
│  ├─ routes.ts
│  ├─ routes/manifest.ts      Single source of truth (R-05)
│  ├─ (public)/               Public marketplace under PublicLayout
│  ├─ (auth)/                 Auth pages under AuthLayout
│  ├─ dashboard/              User dashboard
│  ├─ broker/                 Broker dashboard (R-04)
│  ├─ b.$slug/                Broker public showcase (SSG)
│  ├─ admin/                  Admin panel
│  └─ agent/                  Agent / MCP debugger
├─ components/
│  ├─ ui/                     Flowbite wrappers + primitives (Phase 1+)
│  ├─ ai/                     AI surface components (Phase 3+)
│  ├─ layout/                 AppShell, Sidebar, TopBar, PersonaSwitcher
│  ├─ data/                   Tables, charts (Phase 1+)
│  └─ forms/                  RHF + zod factories (Phase 1+)
├─ design/                    tokens.css, motion.ts, recipes.ts
├─ features/                  Domain slices (Phase 2+)
├─ i18n/                      tr/, en/, lint script
├─ lib/
│  ├─ api/                    Fetch client
│  ├─ auth/                   useDemoIdentity, personas
│  ├─ routing/                useRouteHref
│  └─ mcp/                    MCP client (Phase 6+)
├─ mocks/                     MSW handlers + seed
├─ styles/                    globals.css, fonts.css
└─ types/                     env.d.ts
```

## Phase status

| Phase | Status | Owner doc |
|---|---|---|
| 0 — Foundations | ✅ This commit | `docs/phases/phase-0.md` |
| 1 — Design System & Components | Pending | — |
| 2 — Public Marketplace | Pending | — |
| 3 — Auth + User Dashboard | Pending | — |
| 3.5 — Broker Dashboard | Pending | — |
| 4 — Listing wizard + AI tools | Pending | — |
| 5 — Admin Panel | Pending | — |
| 6 — Agent / MCP Debugger | Pending | — |
| 7 — Polish + PWA + Demo Deploy | Pending | — |
| 8 — Deliverables | Pending | — |

## Claude Code workflow

This project is designed to be built with Claude Code (Opus 4.7). The `.claude/` directory contains:

- `agents/` — six specialized subagents (frontend-architect, design-system-engineer, page-builder, ai-feature-engineer, a11y-auditor, qa-reviewer)
- `commands/` — slash commands: `/phase-start <N>`, `/build-page <id>`, `/audit-page <route>`, `/demo-prep`
- `settings.example.json` — sample permissions/hooks (rename to `settings.json` to activate)

The `.mcp.json` declares four MCP servers: Playwright, Chrome DevTools, shadcn, GitHub.

## License

Proprietary — arsam.net / LandX (internal).
