# Phase 1 — Design System & Component Library

## Goal
Deliver every UI primitive + form-factory abstraction needed for Phase 2+ pages, fully styled in Obsidian Grid (PROMPT §2), wired with CVA variant resolution, accessible by default, and demonstrated live on a single `/design` route. After Phase 1, page-builder agents NEVER write raw `<button>`, `<input>`, or ad-hoc glass divs — they consume `@/components/ui/*` and `@/components/forms/*` exclusively.

## Demo definition
- `/design` renders every primitive with every variant, interactive ones produce real feedback (Toast button → toast, Modal button → modal, etc.)
- `pnpm typecheck`, `pnpm biome:check`, `pnpm test`, `pnpm e2e tests/e2e/design.spec.ts` all green
- `axe-core` 0 violations on `/design`
- Mobile (375px): Modal automatically routes to Vaul bottom-sheet

## Architectural decisions (made, not negotiable)
- **Vaul** (`vaul@^1.1`) — INSTALL. Bottom sheet with drag-to-dismiss; vendor-free version >400 LoC.
- **cmdk** (`cmdk@^1.0`) — INSTALL. Cmd-K palette pattern locked in Phase 1, consumed Phase 2+.
- **Sonner** (`sonner@^1.7`) — INSTALL. Toast queue + a11y live region; wrap with Obsidian classes.
- **@radix-ui/react-tooltip** — INSTALL. Portal correctness; Flowbite Tooltip breaks in glass-overflow containers.
- **Storybook** — SKIP. `/design` IS the catalog.
- **Native `<select>`** for Phase 1 Select. Rich combobox lands Phase 2 where listing-search needs it.
- **Folder convention:** every primitive ships as `src/components/ui/<Name>/` directory with `<Name>.tsx`, `<Name>.recipes.ts` (if variants), `<Name>.test.tsx`, `index.ts`.

## Component inventory & priority

| Component | Priority | Complexity | PROMPT § | Agent |
|---|---|---|---|---|
| Button | P0 | S | §2.6 | design-system-engineer |
| Icon | P0 | XS | §2 | design-system-engineer |
| Link | P0 | XS | §2.6 | design-system-engineer |
| Card | P0 | S | §2.6 | design-system-engineer |
| Badge | P0 | S | §2.6 | design-system-engineer |
| Input | P0 | M | §2.6 | design-system-engineer |
| Textarea | P0 | S | §2.6 | design-system-engineer |
| Select (native) | P0 | M | §2.6 | design-system-engineer |
| Checkbox | P0 | S | §2.6 | design-system-engineer |
| Switch | P0 | S | §2.6 | design-system-engineer |
| Skeleton | P0 | XS | §2.4 | design-system-engineer |
| Modal | P0 | L | §2.6, §9.3 | design-system-engineer |
| Sheet | P0 | L | §2.6, §9.3 | design-system-engineer |
| Tooltip | P0 | M | §2.6 | design-system-engineer |
| Toaster (sonner) | P0 | M | §2.6 | design-system-engineer |
| ThinkingDot | P0 | S | §2.4 | ai-feature-engineer |
| Dropdown | P1 | M | §2.6 | design-system-engineer |
| Tabs | P1 | M | §2.6 | design-system-engineer |
| Accordion | P1 | M | §2.6 | design-system-engineer |
| Avatar | P1 | S | §2.6 | design-system-engineer |
| Pagination | P1 | M | §2.6 | design-system-engineer |
| TokenStream | P2 | M | §2.4, §8.3 | ai-feature-engineer |
| CommandPalette | P2 | M | §4.3, §8.7 | ai-feature-engineer |
| FormField/Input/Textarea/Select/Checkbox/Switch/Error/Submit + useZodForm | P0 | M | §S03 | design-system-engineer |

## CVA pattern (canonical)
Every recipe follows `glassRecipe` skeleton: base has structural classes only (radius, transition, focus-visible glow); `variants.tone`, `variants.size`, `variants.state` carry semantic + visual; `defaultVariants` always set.

## Execution sections

### A. Foundation primitives (P0)
- Button, Icon, Link, Card, Badge, Skeleton — each `<Name>.tsx` + `<Name>.recipes.ts` (where variants exist) + `<Name>.test.tsx` + `index.ts`.

### B. Form-input primitives (P0)
- Input (floating label, slots), Textarea (auto-grow), Select (native), Checkbox (indeterminate), Switch (role="switch").

### C. Overlays (P0)
- Modal (responsive → Sheet on mobile via Vaul), Sheet (Vaul wrapper), Tooltip (Radix), Toaster (Sonner). Mount global `<Toaster />` in root.

### D. Navigation (P1)
- Dropdown (Flowbite re-skin), Tabs (Flowbite re-skin), Accordion (Flowbite re-skin), Avatar, Pagination.

### E. AI-specific (P1-P2)
- ThinkingDot (breathing 3-dot, reduce-motion fades only), TokenStream (token-by-token replay with caret blink), CommandPalette (cmdk wrapper + global Cmd+K hook).

### F. Form factory (P0)
- FormField (Controller wrapper, owns id + aria-describedby + aria-invalid), FormInput/FormTextarea/FormSelect/FormCheckbox/FormSwitch (typed wrappers), FormError (role="alert"), FormSubmit (Button + isSubmitting + isValid), useZodForm (resolver helper).

### G. `/design` showcase route
- `src/app/(public)/design/_layout.tsx` — sticky in-page nav + section anchors.
- `src/app/(public)/design/page.tsx` — composes 11 section components.
- Sections: Tokens, Buttons, Inputs, Toggles, Cards, Badges, Overlays, Feedback, Navigation, AI, Form (live RHF+zod demo).
- `src/i18n/{tr,en}/design.json` — strings.
- Register `/design` route in `src/app/routes.ts`.

### H. Tests & a11y
- Per primitive: variant resolution + ARIA + keyboard.
- `tests/e2e/design.spec.ts` — click every interactive, axe-core 0 violations, 3 viewports.

### I. Cross-cutting
- `src/styles/globals.css` — add `@keyframes shimmer`, `breathing-dot`, `caret-blink`; bridge `--duration-*`, `--ease-out-expo` in `@theme`; z-index layer vars.
- `src/app/root.tsx` — mount `<Toaster />`, `<TooltipProvider>`, demo-mode `<CommandPalette />`.
- `src/design/recipes.ts` — keep glass/heading; add surfaceRecipe + textRecipe.
- Barrels: `src/components/ui/index.ts`, `src/components/forms/index.ts`.

## Acceptance criteria
1. `pnpm typecheck` 0 errors (strict + noUncheckedIndexedAccess)
2. `pnpm biome:check` 0 warnings
3. Per-primitive Vitest passes
4. `pnpm e2e tests/e2e/design.spec.ts` green on 3 viewports
5. `/design` renders every primitive
6. axe-core 0 serious/critical violations on `/design`
7. Mobile 375px → Modal becomes bottom-sheet (Vaul query selector)
8. Reduce-motion: TokenStream renders full text instantly; Modal/Sheet skip slide; ThinkingDot fades only
9. Bundle: `/design` chunk ≤ 110KB gz
10. Demo mantra: every clickable element produces visible reaction
11. Form demo: invalid submit → inline errors; valid → success toast + reset
12. No `any`, no inline `style` except CSS custom properties

## Verification (manual script)
```bash
pnpm install
pnpm typecheck && pnpm biome:check && pnpm test
pnpm dev
# Visit http://localhost:5173/design
# Tab through, click everything, ESC modals, Cmd+K palette, mobile sheet check, form submit
pnpm e2e tests/e2e/design.spec.ts
pnpm build && grep -r landx_demo_persona build/client/  # 0 matches
```

## Risks
- Vaul + React 19 peer dep — pin exact, smoke on first install
- Tailwind v4 beta arbitrary `oklch()` parsing — fat `@theme` bridge
- Sonner CSS bleed — override classNames
- Radix portal vs Flowbite z-index — global z-layer vars
- Floating-label autofill — `:autofill` + placeholder `" "` trick
- TokenStream + React 19 StrictMode double-mount — support both `tokens: string[]` (default) and `stream: ReadableStream` with ref guard

## Total file count
- UI primitives: ~78 files
- Forms factory: ~24 files
- /design route: ~15 files
- Cross-cutting modifications: 5 files
- Tests outside primitive dirs: 2 files
- **Total new: ~119, modified: 5**

## Out of scope (Phase 2+)
- Data tables (TanStack Table wrapper) — Phase 5
- Charts wrappers — Phase 2+
- MapLibre wrappers — Phase 2
- AICopilot drawer, ChatPanel, PromptEditor — Phase 3/6
- KYC step indicator — Phase 4
- Theme switcher — later
- Onboarding tooltips — Phase 7
