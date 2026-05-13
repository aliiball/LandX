# Design System — Obsidian Grid

Production-ready design system for LandX / arsam.net. Single source of truth at `/design` (route).

## Aesthetic principles

- **Dark glass + neon kontur** — deep `oklch(0.12 0.012 260)` void background, glass surfaces with `backdrop-blur(20px) saturate(140%)`, sparing neon accents
- **%78 nötr / %18 single accent / %4 sıcak vurgu** — asymmetric color allocation; ASLA birden fazla neon CTA aynı viewport'ta
- **Mobile-first** — every primitive sized for 44×44 hit targets, responsive variants with `md:` prefix
- **`prefers-reduced-motion: reduce`** zorunlu — transform/opacity only, fade fallbacks

## Token system

All tokens live in `src/design/tokens.css` (CSS variables) and are bridged into Tailwind v4 utilities via `src/styles/globals.css` `@theme` block.

### Surfaces
`--surface-void` → `--surface-obsidian` → `--surface-slate` → `--surface-elevated` → `--surface-glass`

### Accents (use sparingly)
- `--accent-cyan` (oklch 0.82 0.16 195) — primary CTA, AI ışığı
- `--accent-violet` (oklch 0.70 0.22 290) — AI/ML, agent kimliği
- `--accent-magenta` (oklch 0.72 0.25 340) — uyarı, agent eylemi
- `--accent-amber` (oklch 0.82 0.16 75) — dikkat, premium
- `--accent-lime` (oklch 0.88 0.20 135) — başarı, onay
- `--danger` (oklch 0.68 0.22 25)

### Typography
- Display/Body: **Geist Variable** (self-host, no Google Fonts)
- Mono: **JetBrains Mono Variable** (agent debugger, admin)
- Scale: modular 1.250 — caption 11 / small 13 / body 15 / lead 17 / h6 18 / h5 21 / h4 26 / h3 33 / h2 42 / h1 54 / display 72

### Motion
- `--ease-out-expo: cubic-bezier(0.2, 0.8, 0.2, 1)` — global default
- Durations: micro 120ms · small 200ms · medium 320ms · layout 480ms · scene 720ms
- **No spinner** for AI thinking — `<ThinkingDot />` breathing 3-dot, `<TokenStream />` token-by-token

## Component inventory (22 primitives + 8 form wrappers)

### Foundation
Button · Icon · Link · Card · Badge · Skeleton

### Form inputs
Input · Textarea · Select (native) · Checkbox · Switch

### Overlays
Modal (Vaul responsive→Sheet on mobile) · Sheet (Vaul) · Tooltip (Radix) · Toaster (Sonner)

### Navigation
Dropdown · Tabs · Accordion · Avatar · Pagination

### AI
ThinkingDot · TokenStream · CommandPalette (cmdk; scaffolded for Phase 2+ consumption)

### Form factory (`src/components/forms/`)
FormField (Controller wrapper) · FormInput · FormTextarea · FormSelect · FormCheckbox · FormSwitch · FormSubmit · useZodForm

## Recipe pattern

Every primitive ships with a co-located CVA recipe:

```ts
// Button.recipes.ts
export const buttonRecipe = cva(BASE_CLASSES, {
  variants: { tone, size, block },
  defaultVariants: { tone: 'primary', size: 'md', block: false },
});
```

Component file is dumb: forward props → recipe → render. No inline `style` except for CSS custom properties (e.g. `style={{ '--accent': 'var(--accent-violet)' }}`).

## A11y guarantees

- Every interactive primitive: keyboard support (Tab/Enter/Space/Escape/Arrow)
- Focus ring: `var(--glow-cyan)` shadow
- Modal: focus trap + ESC close + `aria-modal="true"` + `role="dialog"`
- Toaster: `aria-live="polite"` queue (Sonner-managed)
- Form fields: `aria-invalid` + `aria-describedby` wired by FormField
- `<button type="...">` enforced by Biome rule

## Live catalog

`/design` route renders every primitive with every variant. Every interactive button produces a real reaction (toast/modal/sheet). 11 sections with sticky in-page nav.
