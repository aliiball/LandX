# LandX / arsam.net — Enterprise Frontend Build Prompt

> **For:** Claude Code (terminal agent, plan-mode capable)
> **Goal:** Müşteri demo'suna hazır, eksiksiz, production-grade frontend
> **Surface:** Public Marketplace + User Dashboard (Buyer/Seller) + **Broker Dashboard** + Admin Panel + Agent/MCP Debugger UI
> **Mantra:** AI-first · Mobile-first · Dark-glass-neon · Enterprise-grade
> **Version:** 1.1 (bkz. Revision Log)

### Revision Log
| Ver | Tarih | Değişiklik | Sebep |
|---|---|---|---|
| 1.0 | İlk versiyon | 4 yüzey (Public + Dashboard + Admin + Agent), kararlar | Initial PROMPT.md |
| 1.1 | Bu revizyon | **R-01** §4.4 Persona Switcher (demo mode) · **R-04** §7.B' Broker Dashboard (10 yeni sayfa) + §5.3 principal_subtype · **R-05** §4.5 Routing Mode (browser vs hash) · **R-08** §5.4 Rendering Strategy (SSG/SSR/CSR matrisi) · §11/§12/§14 yan etkileri | Prototip gap analizi (karacaismail/landxpanelpages) — yazılım/modüler bulgular |

---

## 0) Mission Brief

**arsam.net**, LandX agent-native meta-framework üzerine kurulan **birinci uygulama**dır. Sahibinden/Hepsiemlak benzeri klasik bir ilan sitesi **değildir** — sadece **arsa** dikeyine odaklanan, **AI-native** (her ekranda LLM co-pilot, MCP tool surface'i, semantik arama, AI değerleme), **multi-tenant SaaS** mimarisinde, **mobile-first** çalışan bir **enterprise marketplace**'tir.

Bu prompt dosyası, frontend'in tek bir Claude Code oturumunda **fazlar halinde**, **insan onayıyla**, **kaliteden ödün vermeden** inşa edilmesi için tasarlanmıştır. Her faz sonunda çalışan, demo edilebilir bir çıktı olmalıdır.

### Quality Bar (pazarlık edilmez)
- **Lighthouse mobile:** Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90 (public sayfalar)
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1
- **a11y:** WCAG 2.2 AA — keyboard navigation, focus rings, ARIA, prefers-reduced-motion, prefers-contrast
- **Type safety:** TypeScript strict, no `any` (gerekirse `unknown` + guard)
- **Test:** Vitest unit + Playwright e2e — kritik akışlar için
- **Bundle:** İlk paint ≤ 180KB gz; route-based code splitting zorunlu
- **i18n-ready:** TR default, EN tam paritede

---

## 1) Tech Stack (kesin)

| Katman | Seçim | Sebep |
|---|---|---|
| Build | **Vite 5** + **React 19** | DX hızı, ESM-native, HMR |
| Router | **React Router v7** (framework mode) | Excel'de zorunlu, SSR-ready, nested routes |
| UI lib | **Flowbite React** | Excel'de zorunlu, Tailwind-native, geniş component set |
| Styling | **Tailwind CSS v4** + **CVA** (class-variance-authority) | Flowbite altyapısı, design token CSS variables |
| Forms | **react-hook-form** + **zod** | RHF performans, zod backend-shared schema |
| State (server) | **TanStack Query v5** | Cache, optimistic, suspense-native |
| State (client) | **Zustand** (slim) + URL state (router) | Minimum global state, URL = source of truth |
| Charts | **Recharts** + **visx** (özel viz için) | Flowbite uyumlu + agent trace graph için visx |
| Map | **MapLibre GL JS** + **deck.gl** (heatmap/clustering) | Açık kaynak, MVT tile, vendor-lock yok |
| Mock API | **MSW v2** + **@faker-js/faker** + **TR locale** | OpenAPI-driven mock; backend hazır olunca tek satır switch |
| Streaming | **EventSource** (native) + **@microsoft/fetch-event-source** (POST-SSE) | A10 modülü gereği token-stream + agent step stream |
| Animations | **Motion** (Framer Motion v11+) + **CSS view-transitions** | Glassmorphism geçişleri, mikro-etkileşim |
| Icons | **Lucide React** | Flowbite native, 1400+ ikon |
| i18n | **react-i18next** + ICU MessageFormat | TR/EN, çoğul, tarih/sayı locale |
| Date | **date-fns** + **date-fns-tz** | Tree-shake, TZ aware |
| Tables | **TanStack Table v8** | Headless, virtualized; Admin Auto-UI için kritik |
| Code editor (Agent UI) | **CodeMirror 6** | Prompt/JSON/SQL editor, syntax highlight |
| PDF (raporlar) | **pdf-lib** + **react-pdf** | Yatırım raporu, ilan PDF'i export |
| Test | **Vitest** + **@testing-library/react** + **Playwright** | Unit + e2e + visual regression (Playwright trace) |
| Lint/Format | **Biome** | ESLint+Prettier birleşik, hızlı |
| Pkg mgr | **pnpm** | Disk-efficient, workspaces ileride |
| Node | **22 LTS** | Modern API'ler |

> **Assumption A1 — Mock-first:** Backend (FastAPI, S01 Auto REST API Engine) henüz hazır olmadığından MSW + faker ile **OpenAPI-driven mock layer** kuruyoruz. `src/mocks/openapi.yaml` taslak şeması olacak; gerçek backend hazır olduğunda MSW kapatılır, baseURL switch'lenir. **Değiştirilebilir.**

> **Assumption A2 — Map:** MapLibre + OSM tile (ücretsiz, vendor-lock yok). Google Maps/Mapbox isteniyorsa env var ile switch'lenebilir adapter yazılır.

> **Assumption A3 — i18n:** TR primary, EN full parity. Arapça gelecek faz (RTL infra şimdiden hazırlanır: `dir="rtl"` test edilmiş).

---

## 2) Design System — "Obsidian Grid"

Aesthetic codename: **Obsidian Grid** — koyu cam yüzeyler, ince neon konturlar, geometrik grid arka plan, kontrollü hareket, bilgi yoğun ama nefes alabilir. Linear + Vercel + Frame.io ışığında ama emlak için ısıtılmış.

### 2.1 Color Tokens (CSS variables)

```css
:root {
  /* Surface — koyu cam katmanları */
  --surface-void:        oklch(0.12 0.012 260);  /* arka plan, en alt */
  --surface-obsidian:    oklch(0.16 0.015 260);  /* default app bg */
  --surface-slate:       oklch(0.20 0.018 260);  /* card */
  --surface-elevated:    oklch(0.24 0.020 260);  /* modal, popover */
  --surface-glass:       oklch(0.20 0.018 260 / 0.55); /* glass card */
  --surface-glass-strong:oklch(0.24 0.020 260 / 0.72);

  /* Stroke — ince konturlar */
  --stroke-subtle:       oklch(0.30 0.020 260 / 0.40);
  --stroke-default:      oklch(0.38 0.025 260 / 0.55);
  --stroke-strong:       oklch(0.50 0.030 260 / 0.70);
  --stroke-neon:         oklch(0.78 0.18  175);  /* cyan-mint hover/focus */

  /* Text */
  --text-primary:        oklch(0.97 0.005 260);
  --text-secondary:      oklch(0.78 0.010 260);
  --text-tertiary:       oklch(0.58 0.015 260);
  --text-disabled:       oklch(0.42 0.015 260);

  /* Accents — neon vurgular, ÖLÇÜLÜ kullan */
  --accent-cyan:         oklch(0.82 0.16  195);  /* primary CTA, AI ışığı */
  --accent-lime:         oklch(0.88 0.20  135);  /* başarı, onay, "uygun" */
  --accent-magenta:      oklch(0.72 0.25  340);  /* uyarı, agent eylemi */
  --accent-amber:        oklch(0.82 0.16   75);  /* dikkat, premium */
  --accent-violet:       oklch(0.70 0.22  290);  /* AI/ML, agent kimliği */

  /* Semantic */
  --success:             var(--accent-lime);
  --warning:             var(--accent-amber);
  --danger:              oklch(0.68 0.22   25);
  --info:                var(--accent-cyan);

  /* Glow — kullanım: focus rings, hover halo, AI processing */
  --glow-cyan:           0 0 0 1px oklch(0.82 0.16 195 / 0.50), 0 0 24px -4px oklch(0.82 0.16 195 / 0.45);
  --glow-violet:         0 0 0 1px oklch(0.70 0.22 290 / 0.50), 0 0 28px -4px oklch(0.70 0.22 290 / 0.45);
  --glow-soft:           0 0 32px -8px oklch(0.82 0.16 195 / 0.25);

  /* Radii */
  --radius-xs: 6px;  --radius-sm: 10px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px; --radius-pill: 999px;

  /* Spacing scale */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px;--space-20: 80px;--space-24: 96px;
}

/* Light mode opsiyonel — admin için "okuma modu" olarak ileri faz */
[data-theme="light"] { /* ... ileride */ }
```

**Kural:** Renk kullanımı asimetrik — %78 nötr (surface+text), %18 single accent (sayfa bağlamına göre cyan/violet), %4 sıcak vurgu (amber/lime). **ASLA** birden fazla neon aynı viewport'ta CTA olarak kullanılmaz.

### 2.2 Typography

- **Display / Headings:** `Geist` (variable) — düşük weight (300-500) tercih, sıkı `letter-spacing: -0.02em` H1-H2'de
- **Body:** `Geist` — 400/500
- **Mono (kod, ID, tool name):** `JetBrains Mono` — agent debugger ve admin'de
- **Numeric (fiyat, metrekare):** `Geist` tabular nums (`font-variant-numeric: tabular-nums`)

> **NOT:** Inter / Roboto / system-ui **yasak**. Geist tercih sebebi: variable, modern, distinctive ama corporate-uygun. Self-host (Google Fonts değil) — performance + KVKK.

**Type scale (modular 1.250):**
```
caption  11px / 16  (uppercase, tracking +0.04em)
small    13px / 20
body     15px / 24    ← default
lead     17px / 28
h6       18px / 26
h5       21px / 30
h4       26px / 34
h3       33px / 42
h2       42px / 52
h1       54px / 62
display  72px / 80    (sadece landing hero)
```

### 2.3 Glassmorphism Recipe (tekrar tekrar kullanılacak)

```css
.glass {
  background: var(--surface-glass);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--stroke-subtle);
  border-radius: var(--radius-lg);
  box-shadow:
    inset 0 1px 0 oklch(1 0 0 / 0.06),     /* üst içsel ışık */
    0 1px 2px oklch(0 0 0 / 0.4),           /* dış gölge */
    0 8px 32px -8px oklch(0 0 0 / 0.5);
}
.glass:hover { border-color: var(--stroke-default); }
.glass--neon { box-shadow: var(--glow-soft), /* ... yukarıdaki */; }
```

Fallback (no-backdrop-filter): `--surface-elevated` solid + üst 1px highlight. `@supports not (backdrop-filter: blur(1px))` ile handle.

### 2.4 Motion Principles

- **Easing:** custom cubic-bezier(0.2, 0.8, 0.2, 1) — "out-expo-soft" — bunu CSS var olarak ekle (`--ease-out-expo`)
- **Süreler:** mikro 120ms, küçük 200ms, orta 320ms, layout 480ms, sahne 720ms
- **Stagger:** liste girişleri 40-60ms stagger
- **Reduce-motion:** `prefers-reduced-motion: reduce` mutlaka — tüm animasyonlar `transform`/`opacity` ile sınırlı, fade-only fallback
- **AI processing göstergeleri:** "thinking" durumu — şu üçünden biri: (a) shimmer-gradient, (b) breathing dot, (c) tokenize edilen yazı stream. Spinner **yasak** (jenerik).

### 2.5 Background System

Sayfa arka planı yalnızca düz renk değil:
1. **Base:** `--surface-void`
2. **Grid:** `background-image: linear-gradient(...)` ince 1px grid (32px), opacity 0.04
3. **Radial accent:** sayfa bağlamına göre tek bir radial gradient blob (cyan veya violet), 0.06 opacity, blur(120px)
4. **Noise overlay:** SVG fractalNoise, opacity 0.025, `mix-blend-mode: overlay`

Bunu `<AppShell>`'in `::before` pseudo'sunda merkezi olarak ver. Tek dosyada `globals.css`.

### 2.6 Component Tonu (kritik kararlar)

- **Buttons:** Köşeler `--radius-md`, padding `12px 20px`, primary'de ince neon border + hover'da glow + içeride micro-shimmer (700ms loop yok, sadece hover'da bir kez geç)
- **Inputs:** Floating label, sol slot icon, sağ slot action; focus'ta cyan glow ring (`--glow-cyan`)
- **Cards:** Daima `.glass`, üst içsel highlight, hover'da 1px stroke yükselmesi (transform yok — layout şift olmasın)
- **Tables (Admin):** Yoğunluk üç seviye (compact / cozy / comfortable) — toggle. Sticky header, virtualized row > 50.
- **Modals:** Sahne kararması `oklch(0 0 0 / 0.6)` + `backdrop-filter: blur(8px)`. Mobil'de bottom-sheet'e dönüş (Vaul kütüphanesi entegre).
- **Tooltips:** Mono font, koyu, üst 1px highlight, gecikme 350ms.
- **Toasts:** Sağ-alt (desktop), üst (mobile), 4s default, agent eylemleri için `magenta`, sistem için `cyan`.

---

## 3) Project Structure

```
landx-frontend/
├─ src/
│  ├─ app/                       # React Router v7 framework routes
│  │  ├─ root.tsx                # App shell, error boundary, theme
│  │  ├─ routes.ts               # route config
│  │  ├─ (public)/               # marketing + marketplace
│  │  ├─ (auth)/                 # giriş/kayıt/şifre
│  │  ├─ dashboard/              # bireysel user dashboard (Buyer/Seller)
│  │  ├─ broker/                 # broker dashboard (R-04, §7.B')
│  │  ├─ b/                      # broker kamu vitrini /b/:slug (SSG, R-08)
│  │  ├─ admin/                  # Auto Admin UI (S02 surface)
│  │  └─ agent/                  # MCP debugger / agent ops
│  ├─ components/
│  │  ├─ ui/                     # Flowbite wrappers + custom primitives
│  │  ├─ forms/                  # composable form fields (RHF + zod)
│  │  ├─ data/                   # tables, charts, kpi cards
│  │  ├─ map/                    # MapLibre wrappers, layers
│  │  ├─ ai/                     # AICopilot, ChatPanel, TokenStream, ThinkingDot, PromptEditor
│  │  └─ layout/                 # AppShell, Sidebar, TopBar, BottomNav, PersonaSwitcher (R-01)
│  ├─ features/                  # domain features (vertical slices)
│  │  ├─ listings/               # arsa ilanları
│  │  ├─ search/                 # NL + faceted search
│  │  ├─ valuation/              # AI değerleme
│  │  ├─ messaging/              # mesajlaşma (insan + agent)
│  │  ├─ favorites/
│  │  ├─ alerts/                 # kayıtlı arama + bildirim
│  │  ├─ post-listing/           # ilan ver wizard
│  │  ├─ kyc/                    # tapu/kimlik doğrulama
│  │  ├─ investment-sim/
│  │  └─ broker/                 # R-04 broker domain (portfolio, leads, clients, commissions, team, showcase, analytics, ai-tools, subscription)
│  ├─ lib/
│  │  ├─ api/                    # generated client (openapi-typescript)
│  │  ├─ mcp/                    # MCP client adapter (A01 surface)
│  │  ├─ sse/                    # SSE/event-source helpers (A10)
│  │  ├─ auth/                   # session, RBAC hooks, useDemoIdentity (R-01)
│  │  ├─ tenant/                 # tenant context (I05)
│  │  ├─ permissions/            # capability scope checks (I04, A03), principal_subtype guards (R-04)
│  │  ├─ routing/                # routes manifest, useRouteHref (R-05)
│  │  ├─ telemetry/              # client-side observability
│  │  └─ utils/
│  ├─ design/                    # tokens, mixins, motion presets
│  │  ├─ tokens.css
│  │  ├─ motion.ts
│  │  └─ recipes.ts              # CVA recipes
│  ├─ mocks/
│  │  ├─ handlers/               # MSW handlers per resource (broker, leads, commissions dahil)
│  │  ├─ seeders/                # faker-based seed data
│  │  ├─ seed/personas.ts        # demo persona fixtures (R-01)
│  │  └─ openapi.yaml
│  ├─ i18n/
│  │  ├─ tr/                     # primary
│  │  └─ en/
│  ├─ assets/
│  └─ types/
├─ public/
├─ tests/
│  ├─ e2e/                       # Playwright
│  └─ visual/                    # Playwright screenshot baselines
├─ docs/
│  ├─ design-system.md
│  ├─ module-map.md              # bu prompt'taki §6'nın repo karşılığı
│  └─ phases/
├─ index.html
├─ vite.config.ts
├─ react-router.config.ts
├─ tailwind.config.ts
├─ biome.json
├─ playwright.config.ts
└─ package.json
```

---

## 4) Routing & Layout Architecture

### 4.1 Üst Düzey Layout'lar
- **PublicLayout** — TopNav (arsa kategorileri + AI search bar), MegaFooter
- **AuthLayout** — yalnız brand + split-screen, sağda animated grid arka plan
- **DashboardLayout** — bireysel kullanıcı (Buyer/Seller): sol Sidebar (collapsible), Top: tenant/profil, mobil: BottomNav
- **BrokerLayout** — emlakçı (R-04): sol BrokerSidebar (Portfolio/Leads/Clients/Commissions/Showcase/Team/Analytics/AI Tools/Subscription), Top: ofis adı + persona switcher, mobil: 5-tab bottom nav
- **AdminLayout** — operatör: sol Sidebar (modül ağacı), Top: tenant switcher + env badge + cmd-k
- **AgentLayout** — debugger: 3-panel (Conversations | Detail | Inspector), terminal hissi ama glass

### 4.2 Mobile Strategy
- **Breakpoints:** `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` — Tailwind default
- **Mobile-first:** Tüm component'lerde önce mobile, sonra responsive `md:` prefix'ler
- **Bottom Navigation:** Dashboard ve Public'te mobile için 5-tab bottom nav (Ana, Ara, Harita, AI, Profil)
- **Touch targets:** min 44×44px
- **Sheet patterns:** Detay paneller `<Sheet side="bottom">` ile mobilde, desktop'ta `<Sheet side="right">` veya inline panel
- **Map:** Mobilde tam ekran + bottom sheet ile filter; desktop'ta split (40% list / 60% map)
- **PWA:** manifest + service worker (Workbox), offline fallback page, "Add to Home Screen" prompt
- **Gesture:** Swipe to dismiss sheets, pull-to-refresh listelerde

### 4.3 Cmd-K & Global Surfaces
- **Cmd-K palette** (kbar/cmdk) — her layout'ta. Aksiyonlar tenant + role + agent capability filtreli.
- **AI Copilot Drawer** — sağ kenardan açılan, sayfa bağlamını otomatik alan, MCP tool'larına erişen agent (A01-A09 surface)
- **Notification Center** (S05) — top-right popover, kanal filtreli, infinite scroll

### 4.4 Persona Switcher (Demo / Staging Mode)

> **R-01** — Müşteri sunumlarında ve QA ortamında tek SPA içinde 5 yüzey arasında hızlı geçiş için kalıcı bir header bileşeni. Üretimde gizlenir.

- **Konum:** TopBar sağ kenar, avatar'ın solunda (`<PersonaSwitcher />`)
- **Seçenekler:** Alıcı (Buyer) | Satıcı (Seller) | **Emlakçı (Broker)** | Yönetici (Admin) | Agent Debugger
- **Davranış:**
  - Seçim değiştiğinde route prefix değişir: `/` (Buyer) · `/dashboard` (Seller) · `/broker` (Broker) · `/admin` (Admin) · `/agent` (Agent)
  - Mock kullanıcı kimliği swap edilir (`useDemoIdentity()` hook)
  - URL'de `?persona=broker` query param ile derinlemesine link verilebilir
  - Seçim `sessionStorage.landx_demo_persona` içinde tutulur; sayfa yenilemede korunur
- **Render koşulu:**
  ```ts
  // src/components/layout/PersonaSwitcher.tsx
  if (!import.meta.env.VITE_DEMO_MODE) return null;
  ```
  Production build'de tree-shake edilir (`define: { 'import.meta.env.VITE_DEMO_MODE': false }` ile).
- **Mock identity fixture:** `src/mocks/seed/personas.ts` — her persona için pre-seeded user + tenant + permissions + agent scopes
- **A11y:** Klavye `Ctrl+Shift+P` ile açılır; ARIA `role="menu"` + arrow key navigation
- **Visual:** Sadece demo → küçük amber rozet "DEMO MODE" header'da kalıcı görünür

### 4.5 Routing Mode (Production vs Demo)

> **R-05** — İki routing modu desteklenir, build-time env ile switch'lenir.

| Mod | Env değeri | URL örneği | Hedef |
|---|---|---|---|
| **Browser (default)** | `VITE_ROUTER_MODE=browser` | `arsam.net/listing/123` | Production, SSR/SSG uyumlu |
| **Hash** | `VITE_ROUTER_MODE=hash` | `arsam.net/#/listing/123` | Demo (GitHub Pages, S3 static), sunucu-routing gerekmez |

**Tek kaynak route manifesti:** `src/app/routes/manifest.ts`
```ts
export const ROUTES = {
  search: { path: '/search', hash: '#/search', mode: 'csr' },
  listingDetail: { path: '/listing/:id', hash: '#/listing/:id', mode: 'ssr' },
  // ...her route için tek tanım
} as const;
```

**Yardımcı hook:** `useRouteHref(routeKey, params)` — aktif moda göre doğru URL döner.

**Demo deployment:**
- `pnpm build:demo` script'i: `VITE_ROUTER_MODE=hash VITE_DEMO_MODE=true vite build`
- Build sonrası `dist/404.html` ← `dist/index.html` kopyası (GH Pages SPA fallback)
- GitHub Pages workflow: `.github/workflows/demo.yml` her `main` push'unda otomatik publish

---

## 5) Data Layer

### 5.1 API Client
- **OpenAPI-first:** `src/mocks/openapi.yaml` → `openapi-typescript` ile tip üretimi → `src/lib/api/types.ts`
- **Fetch wrapper:** `src/lib/api/client.ts` — tenant header, auth bearer, locale header, traceparent, otomatik retry (idempotent), exponential backoff
- **TanStack Query:** her resource için `queryKeys.ts` + `hooks.ts` (useListings, useListing, useCreateListing, …)
- **Optimistic updates:** favoriye ekleme, mesaj gönderme, ilan kaydetme
- **Suspense mode:** route-level data fetching (RR v7 loaders) + component-level useSuspenseQuery karması

### 5.2 MCP & SSE
- **MCP client:** `src/lib/mcp/client.ts` — tool listesi, tool çağrısı, streaming response. Agent Debugger UI buradan beslenir.
- **SSE helpers:** `src/lib/sse/useStream.ts` — token stream, agent step stream, tool execution progress. Reconnect (exponential), multiplex (tek connection N stream)

### 5.3 Auth & Tenancy
- **Auth:** OIDC/OAuth + magic link + passkey + password — UI tüm yöntemleri destekler ama feature flag ile aç/kapa
- **Session:** httpOnly cookie + refresh; agent tokens UI'da ayrı görünür (I03 modülü gereği)
- **Tenant Context:** `TenantProvider` — URL subdomain veya path prefix'den çözer (`arsam.net` = default tenant). Admin'de switcher.
- **Principal model:** I02 modülünden gelen `principal_type` (human/agent/system/service) ⊕ frontend'in eklediği `principal_subtype`:
  - `individual` — bireysel alıcı/satıcı (varsayılan, `/dashboard` route'una düşer)
  - `broker` — bağımsız emlakçı (tek kullanıcı, `/broker` route'una düşer)
  - `broker-admin` — emlakçı ofisinin yöneticisi (takım + komisyon + abonelik yönetimi)
  - `broker-agent` — emlakçı ofisinde çalışan üye (sınırlı, kendi portföyü + atanmış lead'ler)
  - `system-operator` — admin paneli kullanıcısı (`/admin` route'una düşer)
- **RBAC + ABAC + capability scope:** `<Can action="listing:update" resource={listing}>` component'i; agent için `<AgentCan tool="search.execute" scope={agentScope}>`. Broker-team için `<Can action="broker:assign_lead" team={brokerTeamId}>` örneği.

### 5.4 Rendering Strategy

> **R-08** — Sayfa başına render modu seçimi. SEO-kritik kamu sayfaları SSG/SSR, kişiselleştirilmiş ve authenticated sayfalar CSR.

| Sayfa grubu | Mod | Sebep |
|---|---|---|
| Landing (`/`), Regions, Blog, About, Pricing, Legal | **SSG / Prerender** | SEO, paylaşım önizleme, ilk yükleme < 1s |
| Listing detail (`/listing/:id`) | **SSR + ISR** | SEO + sık güncellenen veri (status, view count) |
| Search results (`/search`) | **CSR** | URL-state-driven, kişiselleştirme, harita interaktif |
| Broker showcase (`/b/:slug`) | **SSG + revalidate** | Emlakçı kamu profili, SEO |
| Auth (`/login`, `/register`) | **CSR** | Public ama SEO-sensitive değil |
| Dashboard / Broker / Admin / Agent | **CSR (SPA)** | Authenticated, no SEO need |

**Implementation:**
- React Router v7 framework mode'da `loader` + route-level `prerender: true` directive
- `<noscript>` fallback **zorunlu** (SSG sayfalarda en az 200 karakter başlık + özet + canonical link)
- Hash-routing demo mode'da prerender devre dışı (`VITE_ROUTER_MODE=hash` ise tüm sayfalar CSR)
- Bot-only prerender: meta `robots="all"` + canonical kontrolü

**OG/Social cards:**
- Public sayfaların hepsinde `og:image` 1200×630 ve `twitter:card="summary_large_image"` zorunlu
- Listing detail için dinamik OG image (lokasyon + fiyat + ana fotoğraf) `og-image-generator` edge function

---

## 6) Modül → UI Surface Haritası

Excel'deki 33 backend modülünün her birinin frontend karşılığı:

| Modül | UI Surface | Sayfa(lar) |
|---|---|---|
| K01 Plugin Lifecycle | Admin → Plugins | `/admin/plugins`, `/admin/plugins/:id`, install wizard |
| K02 DocType Engine | Admin → DocTypes | `/admin/doctypes`, `/admin/doctypes/:slug`, schema editor |
| K03 Migration & Versioning | Admin → Migrations | `/admin/migrations`, diff viewer |
| K04 Hook & Event Bus | Admin → Hooks | `/admin/hooks`, event explorer |
| K05 Service Container & Config | Admin → Config | `/admin/config` (hierarchical, feature flags, secrets) |
| I01 Tenant Lifecycle | Admin → Tenants | `/admin/tenants`, `/admin/tenants/:id` |
| I02 User & Identity | Admin → Users + Public Profile | `/admin/users`, `/dashboard/profile` |
| I03 Auth & Sessions | Public Auth + Dashboard Sessions | `/login`, `/register`, `/dashboard/security` |
| I04 Permission Framework | Admin → Permissions | `/admin/roles`, permission matrix UI |
| I05 Multi-Tenant Isolation | Admin → Isolation Monitor | `/admin/tenants/:id/isolation` |
| A01 MCP Server Framework | Agent → MCP Endpoints | `/agent/mcp`, transport health |
| A02 Tool Registry | Agent → Tools | `/agent/tools`, `/agent/tools/:id` (schema, examples) |
| A03 Agent Identity & Capabilities | Agent → Agents | `/agent/agents`, scope binding editor |
| A04 Agent Memory | Agent → Memory | `/agent/memory`, layer viewer |
| A05 Vector Store | Agent → Vectors | `/agent/vectors`, embedding pipeline status |
| A06 Prompt Library | Agent → Prompts | `/agent/prompts`, version diff, eval suite UI |
| A07 LLM Provider | Agent → Providers | `/agent/providers`, routing rules, cost graph |
| A08 LLM Observability | Agent → Observability | `/agent/observability`, trace explorer, cost attribution |
| A09 Agent Orchestration | Agent → Workflows | `/agent/workflows`, plan-execute-reflect viewer |
| A10 Streaming/SSE | (foundation) | her surface'te kullanılır |
| A11 Conversation & Session | Agent → Conversations + Dashboard AI | `/agent/conversations`, `/dashboard/ai` |
| S01 Auto REST API | Admin → API Explorer | `/admin/api`, OpenAPI viewer |
| S02 Auto Admin UI | (foundation) | DocType'tan otomatik üretilen list/detail/form |
| S03 Form & Validation | (foundation) | RHF+zod form factory |
| S04 Workflow & State Machine | Admin → Workflows | `/admin/workflows`, state graph |
| S05 Notification Center | Top-right popover + Dashboard | `/dashboard/notifications`, settings |
| S06 Search & Discovery | Public Search + AI Search | `/search`, `/search/ai` |
| D01 Audit Log | Admin → Audit | `/admin/audit`, forensic search |
| D02 PII Governance | Admin → PII | `/admin/pii`, classification overview, DSAR queue |
| D03 Compliance Framework | Admin → Compliance | `/admin/compliance`, control matrix, evidence |
| O01 Observability & SLO | Admin → SLO | `/admin/slo`, error budgets, alerts |
| O02 Plugin Marketplace | Admin → Marketplace + Public Marketplace | `/admin/marketplace`, `/marketplace` |
| O03 Plugin Security Review | Admin → Security | `/admin/security/reviews` |

---

## 7) Sayfa Envanteri

> Her sayfa için: **rota**, **amaç**, **ana bölümler**, **AI hooks**, **mobile davranış**, **kabul kriteri**.
> Claude Code, **her sayfayı tek bir PR-equivalent commit'te** üretmeli (component, route, mock handler, test, i18n key'leri birlikte).

### 7.A — Public Marketplace (arsam.net visiotrü için)

#### A1. `/` — Landing / Hero
- **Amaç:** İlk izlenim; AI-first değer önerisini 5 saniyede iletmek.
- **Bölümler:**
  - Hero: full-bleed canvas (animated grid + parallax neon blob), Display-72 başlık ("Arsa aramayı yeniden tanımladık."), altında **NL Search Bar** (placeholder cycling: "İznik'te 2 dönüm imarlı...", "Çeşme'de yatırımlık tarla...", "Bursa'da imar barışlı arsa...")
  - Live stats strip (animated count-up: aktif ilan, doğrulanmış tapu, AI değerleme)
  - "Nasıl çalışır" — 3 step ikonlu (Ara → AI Değerle → Sahiple Konuş)
  - Öne çıkan ilanlar carousel
  - Bölgesel ısı haritası (mini MapLibre, click → /search bölge filtreli)
  - "Yatırım Trend" mini-dashboard (Recharts area chart, son 12 ay)
  - Testimonial / partner band
  - CTA: "Hemen Ara" + "İlan Ver"
- **AI hooks:** NL search submit → `/search?q=...`; placeholder NL örnekleri rotate
- **Mobile:** Hero dikey, mini-map gizli, carousel swipe
- **Kabul:** LCP < 2s; hero görüntüsü `<picture>` AVIF + WebP fallback; reduce-motion'da statik

#### A2. `/search` — Arama Sonuçları (split list + map)
- **Bölümler:**
  - Üst: tek-satır filter chip toolbar (Bölge, Fiyat, m², İmar Durumu, Tapu Tipi, Eğim, Yola Cephe, +N) + "AI ile Daralt" butonu
  - Sol panel (desktop): liste, virtualized, infinite scroll, sort dropdown, "kaydet" buton (Saved Search → S05 entegre)
  - Sağ panel: MapLibre full-height, cluster + heatmap toggle, marker hover → list highlight
  - Saved searches drawer
  - Sticky toplam sonuç + "Sonuçları paylaş" + "Alert oluştur"
- **AI hooks:**
  - "AI ile Daralt" → drawer açar, NL sohbet ("uçak gürültüsü olmayan, denize 10km yakın")
  - "AI Özet" — listenin üstünde, sonuçları 2 cümlede özetler ("47 sonuç bulundu, ortalama 850₺/m², en iyi yatırım skoru Karacabey'de")
- **Mobile:** "Liste / Harita" toggle (sticky bottom); filter chip yatay scroll
- **Kabul:** sonuç render p95 < 250ms (mock); marker→detay tıklamada CLS 0; filter URL state ile share edilebilir

#### A3. `/listing/:id` — İlan Detay
- **Bölümler:**
  - Galeri: yatay scroll-snap + lightbox; sol-alt 360° panoramik (varsa) ve drone-view rozet
  - Başlık + lokasyon + paylaş/favori/kıyasla
  - **AI Değerleme Kartı (vurgu):** tahmin aralığı, güven %, karşılaştırılabilir N ilan, "Detaylı raporu indir (PDF)" (pdf-lib ile generate)
  - Özellikler grid (m², imar, ada/parsel, eğim, yola cephe, ...)
  - Konum: Mini map + uydu/sokak/imar overlay toggle
  - **Tapu/Belge doğrulama** rozeti (D02 surface: hash + zaman damgası)
  - Açıklama + AI generated özet (toggle "Sahibinin yazdığı")
  - Çevre: bölgesel veriler (deprem riski, imar planı linki, ulaşım puanı)
  - Yatırım simülatörü mini (giriş: süre + ek maliyet, çıkış: tahmini IRR; tam versiyon /tools/sim)
  - Soru-Cevap (AI agent ile veya satıcı ile — toggle)
  - Sahip kartı: anonim ID, doğrulama rozetleri, "Mesaj gönder" CTA + "AI ile sor" CTA (agent satıcı adına ön-cevap verir, sahip onaylar)
  - Benzer ilanlar carousel
- **AI hooks:** Değerleme widget'ı, AI Q&A, AI özet, satıcı ön-yanıt agent'ı
- **Mobile:** Bottom sticky CTA bar (Mesaj | AI'a Sor | Favori); galeri full-bleed
- **Kabul:** Hero görsel < 1.2s; favoriye ekleme optimistic; AI değerleme kartı skeleton → streamed güncelleme

#### A4. `/map` — Tam Ekran Harita Modu
- MapLibre + deck.gl heatmap + cluster + draw tool (poligon çiz → o alanda ara)
- Sağ alt: AI butonu — "Bu poligondaki arsa karakteristiği nedir?" özet üretir
- Layer toggles: ilanlar / fiyat ısı / imar / deprem riski / arsa yoğunluğu
- Mobile: tam ekran, alt sheet ile filter, çizim için iki-parmak kilidi

#### A5. `/post-listing` — İlan Ver Wizard (AI-first)
- 6 adım: (1) Konum [haritadan pin veya tapu yükleme OCR ile otomatik doldurma], (2) Tapu & belgeler [PDF upload → AI extract: ada/parsel/yüzölçümü/cins], (3) Özellikler [AI önerisi pre-fill], (4) **AI Açıklama Yaz** [tek tık, edit edilebilir, S03 form draft autosave], (5) Fiyat [AI değerleme öneri + manuel override + "neden bu fiyat?" açıklama], (6) Yayın & onay
- Progress: stepper üstte, mobile'da bottom
- AI hooks: OCR (D02), açıklama generation (A06 prompt), fiyat öneri (valuation), title öneri
- Wizard exit: draft kaydedilir, devam et butonu /dashboard'da görünür
- **Kabul:** Adım geçişlerinde URL değişir, F5 → adım korunur; OCR mock → "tapu_ornek.pdf" sample ile çalışır

#### A6. `/compare` — Arsa Karşılaştırma
- 2-4 ilan yan yana, satır bazlı diff (farklar highlight cyan), AI commentary (her satır için "neden önemli")
- Mobile: tek ilan + swipe geçiş

#### A7. `/tools/valuation` — Standalone AI Değerleme
- Form: koordinat veya adres + manuel özellikler → değerleme raporu (full)
- "Rapor PDF" + "Hesaba kaydet" (logged-in)

#### A8. `/tools/investment-sim` — Yatırım Simülatörü
- Senaryo girdileri: alış, vergi, tutma süresi, beklenen değerlenme, satış maliyeti
- Çıktı: net IRR, ROI, breakeven, Monte Carlo dağılımı (visx)
- Karşılaştırılabilir bölge ortalaması overlay

#### A9. `/regions` — Bölge Rehberi (SEO + AI)
- Türkiye haritası → il → ilçe → mahalle hiyerarşik drilldown
- Her seviyede: AI generated özet (cache'li), ilan sayısı, fiyat trendleri, demografik kart
- Statik render (RR v7 prerender) — SEO için

#### A10. `/about`, `/pricing`, `/legal/*`, `/contact`, `/blog`, `/blog/:slug`
- Pricing: tier'lar (Bireysel / Profesyonel / Kurumsal / Enterprise)
- Legal: KVKK aydınlatma, çerez, KVKK başvuru formu (D02 → DSAR queue'ya düşer)
- Blog: MDX-ready, SEO-optimal, AI özet snippet'i

#### A11. `/login`, `/register`, `/forgot`, `/reset`, `/verify`, `/passkey-setup`
- AuthLayout — split screen, sağda animated grid
- Tüm I03 metodları: password, OAuth (Google, Apple), magic link, passkey
- Register: 2 adım (e-posta → KVKK onayı + profil)

---

### 7.B — User Dashboard

> Layout: Sol sidebar (collapsible), top tenant/profil, mobile bottom nav (Ana, İlanlar, AI, Mesajlar, Profil)

#### B1. `/dashboard` — Ana
- KPI kartları: aktif ilanlarım, favoriler, kayıtlı arama uyarıları, görüntülenme
- "AI Bugün" — kişiselleştirilmiş 3 öneri (bağlamlı, A04 memory'den beslenir)
- Aktivite akışı, son mesajlar, son ziyaret edilen ilanlar

#### B2. `/dashboard/listings` — İlanlarım
- Tablo (TanStack Table), durum, görüntülenme, mesaj sayısı; toplu aksiyonlar
- Her satır → detay drawer, "AI ile öneri" (içerik iyileştirme, fiyat ayarı)

#### B3. `/dashboard/favorites` — Favorilerim
- Grid + toplu karşılaştır, etiketleme

#### B4. `/dashboard/alerts` — Kayıtlı Aramalar & Uyarılar
- Liste + bildirim kanalı seçimi (email/in-app/push)
- "Bu aramayı AI ile genişlet"

#### B5. `/dashboard/messages` — Mesajlaşma (insan + agent karışık)
- 3-pane (desktop): thread list | mesaj alanı | bağlam paneli
- Mesaj alanı: insan-insan + insan-agent thread'leri ayrı renk gösterir (agent magenta vurgu)
- Agent message bubble: tool calls expandable, "Bu cevap AI tarafından oluşturuldu, sahip onayladı" rozeti
- Mobile: sadece thread → tıkla mesaj alanı tam ekran

#### B6. `/dashboard/ai` — Kişisel AI Asistan (Conversation, A11)
- ChatGPT-vari ama emlak bağlamı; sol thread list; orta mesaj akışı; sağ Inspector (kullanılan tool'lar, hangi ilanlara baktı)
- Tool execution kartları (örn: `search_listings(filter=...)` → 12 sonuç önizleme)
- Stream token-by-token (A10 SSE)
- "Bu konuşmayı kayıt al" → /agent/conversations'a (kullanıcı izniyle)

#### B7. `/dashboard/security` — Hesap Güvenliği
- Aktif oturumlar, passkey'ler, 2FA, API tokens, **agent token'larım** (ayrı sekme — I03 gereği)

#### B8. `/dashboard/profile` — Profil & Tercihler
- Bildirim tercihleri (kanal × tür matrisi), dil, tema, KVKK haklarım (verilerimi indir, sil)

#### B9. `/dashboard/billing` — Faturalandırma (paid tier)
- Plan, kullanım, fatura geçmişi, ödeme metodu

#### B10. `/dashboard/kyc` — Kimlik & Tapu Doğrulama
- Kimlik upload, tapu doğrulama (hash + onay süreci), durum

---

### 7.B' — Broker (Emlakçı) Dashboard

> **R-04** — Emlakçı, bireysel kullanıcıdan tamamen farklı modüllere ihtiyaç duyar: çoklu ilan portföy yönetimi, müşteri CRM, komisyon takibi, takım, vitrin sayfası. PROMPT.md §5.3'te tanımlanan `principal_subtype: broker | broker-admin | broker-agent` ile yetki ayrılır.
>
> Layout: Sol Sidebar (BrokerSidebar — Portfolio, Leads, Clients, Commissions, Showcase, Team, Analytics, AI Tools, Subscription), Top: ofis adı + persona switcher (demo) + cmd-k. Mobile: 5-tab bottom nav (Portfolio, Leads, Clients, AI, Profil).
>
> Paylaşımlı sayfalar (Bireysel Dashboard ile ortak): B7 Security, B8 Profile, B10 KYC — broker için ek alanlar (yetki belgesi, vergi numarası, ofis adresi).

#### B'1. `/broker` — Broker Ops Overview
- **KPI mega-grid:** Aktif portföy (ilan sayısı), ay-içi komisyon (₺), lead pipeline (toplam + kazanılan), ortalama dönüşüm oranı, ilanları ortalama görüntülenme
- **Lead pipeline funnel** (visx): Yeni → İlgili → Müzakere → Anlaşma → Kapanış (drag-to-stage)
- **AI Bugün:** kişiselleştirilmiş 3 öneri ("Pazarlık aşamasında 4 lead 3 günden uzun beklemede", "Karacabey portföyünde 2 ilan fiyat ayarı önerisi")
- **Aktivite akışı:** son atanan lead'ler, son anlaşmalar, takım üyelerinin son aksiyonları
- **Mobile:** KPI'lar dikey, funnel yatay scroll
- **Kabul:** broker-admin için takım-toplam, broker-agent için kendi-toplam görünür

#### B'2. `/broker/portfolio` — Portföy Yönetimi
- **Tablo (TanStack):** ilanlar (durum/fiyat/m²/lokasyon/atanmış agent/görüntülenme/lead sayısı), toplu seçim
- **Toplu aksiyonlar:** fiyat ayarı (yüzde veya sabit), durum değişimi, agent atama, vitrine ekle, AI ile açıklama yeniden yaz, toplu yenile
- **Filter chip toolbar:** durum, bölge, agent, fiyat aralığı, fiyat değişiklik tarihi
- **AI Toplu İyileştirme:** seçili ilanlar için AI önerisi (fiyat, açıklama, görsel sıralaması) — preview modal'da diff
- **CSV import/export:** kitle ilan yükleme
- **Mobile:** kart görünümü, swipe-to-actions (atama, yenile, sil)

#### B'3. `/broker/leads` — Lead / CRM
- **3-pane (desktop):** Lead listesi (durum filtreli) | Lead detay | Konuşma & not paneli
- **Lead detayı:** kaynak ilan, müşteri bilgisi, AI skorlama (ısı: hot/warm/cold), tahmini değer, sonraki aksiyon
- **AI Lead Scorer:** her lead'e otomatik skor (mesaj davranışı, sayfa gezinti, finansal sinyaller mock)
- **Follow-up takvimi:** otomatik hatırlatma kuyruğu, snooze
- **Atama:** broker-admin lead'i broker-agent'a atar; SLA timer
- **Mobile:** liste → tap → detay tam ekran
- **Kabul:** lead durum geçişleri audit'lenir (D01 surface'e push)

#### B'4. `/broker/clients` — Müşteri Kartları
- **Tablo:** ad, tip (alıcı/satıcı), aktif lead sayısı, son temas, toplam komisyon
- **Müşteri detayı:** görüşme geçmişi, KVKK aydınlatma onay kaydı (tarih + IP + signature), ilgilenilen ilan listesi, notlar (rich-text)
- **Veri sahibi hakları:** "Müşteri verilerini indir (PDF)" + "Müşteri verilerini sil" (KVKK madde 7 + 11 → D02 DSAR queue'ya düşer)
- **AI özet:** "Bu müşteri son 3 ayda 12 ilan görüntüledi, 2 lead açtı, Çeşme bölgesinde yoğunlaştı" — tek tık

#### B'5. `/broker/commissions` — Komisyon Yönetimi
- **Tablo:** anlaşmalar (tarih, ilan, müşteri, satış bedeli, komisyon %, net ₺, durum: bekleyen/alındı/iade)
- **Detay:** anlaşma timeline, ödeme parçaları, makbuz oluştur (pdf-lib ile PDF), fatura linki
- **Alacak/Borç dashboard:** ay-bazlı net, vergi otomatik hesap, ofis-içi paylaşım kuralı (broker-agent komisyon yüzdesi)
- **Vergi raporu PDF:** yıllık özet, KDV/Stopaj/Net döküm
- **Mobile:** kart görünümü, makbuz mobile-friendly

#### B'6. `/broker/showcase` — Kamu Vitrini (Public Profile)
- Bu sayfa **iki yüzey**: yönetim ekranı `/broker/showcase` + kamu sayfası `/b/[slug]`
- **Yönetim ekranı:** vitrin tasarımı (kapak görseli, marka rengi, logo, slogan), bio (rich-text), uzmanlık bölgeleri, sertifikalar, sosyal linkler
- **Öne çıkarılan ilanlar:** drag-sort, max 12
- **İstatistik:** vitrin ziyareti, lead conversion, kıyasla (bölge ortalaması)
- **Kamu sayfası `/b/:slug`:** SSG-prerendered, SEO-optimal (R-08), contact form (lead → /broker/leads)
- **OG image:** broker logo + slogan auto-compose

#### B'7. `/broker/team` — Takım Yönetimi (broker-admin only)
- **Tablo:** ekip üyeleri (broker-agent), rol, atanmış lead sayısı, ay-içi komisyon
- **Davet:** email/SMS ile yeni broker-agent davet (mock)
- **Rol & yetki:** broker-agent için izin matrisi (kendi lead'lerini görsün mü? Tüm portföyü görsün mü? Komisyon raporuna erişsin mi?)
- **İlan paylaşım kuralları:** "Herkese açık" / "Sadece atanan agent" / "Sadece broker-admin"
- **Kabul:** `<Can action="broker:invite_member">` ile sadece broker-admin görür

#### B'8. `/broker/analytics` — Analitik & Insights
- **Dashboard kartları:** ilan görüntülenme, lead/ilan oranı, ortalama satış süresi, agent performansı leaderboard
- **Bölge ısı haritası:** broker'ın aktif olduğu bölgeler — ilan yoğunluğu, rakip emlakçı sayısı (mock)
- **Rakip karşılaştırma (AI):** "Bu hafta Karacabey'de 3 rakip ofis daha aktif, ortalama fiyat aralığı 12% farklı"
- **Trend grafiği:** ay-bazlı portföy büyüklüğü, komisyon, ortalama görüntülenme
- **Export:** PDF haftalık / aylık rapor

#### B'9. `/broker/ai-tools` — Broker AI Araçları
- **Toplu açıklama yeniden yazma:** seçili ilanlar için AI generation (S03 + A06)
- **Toplu fiyat optimizasyonu:** AI değerleme ile fiyat sapması raporu (over/under-priced)
- **Müşteri segmentasyonu:** clients tablosundan AI ile segment çıkarma ("yatırımcı", "yerleşim arayan", "tarımsal", "ticari")
- **Otomatik takip mesajı:** segment-aware AI generated mesaj şablonu — onay sonrası B5 messaging'e gönderim
- **AI Lead Prioritizer:** her sabah günün en sıcak 5 lead'ini sıralar

#### B'10. `/broker/subscription` — Abonelik & Limitler
- **Mevcut plan:** Bireysel / Profesyonel / Kurumsal / Enterprise — özellik karşılaştırma tablosu
- **Kullanım metrikleri:** aktif ilan kotası, ay-içi AI çağrısı, takım üyesi sayısı, depolama
- **Premium feature toggles:** AI lead scorer, advanced analytics, white-label vitrin, custom domain
- **Fatura geçmişi:** son 12 ay PDF, ödeme metodu yönetimi
- **Upgrade flow:** plan değiştirme wizard (3-step), prorate hesaplama

---

### 7.C — Admin Panel (Auto Admin UI surface — S02)

> Layout: Sol sidebar modül ağacı (K → I → A → S → D → O), top tenant switcher + env badge ("prod" kırmızı / "staging" amber / "dev" cyan) + cmd-k

#### C1. `/admin` — Operations Overview
- Mega KPI grid: tenant sayısı, aktif kullanıcı, agent çağrı/dk, LLM cost/saat, p95 latency, error rate, SLO posture
- Anomaly feed (AI tespitleri, O01)
- Sistem haritası (mini): plugin sağlık, servis sağlık, MCP transport sağlık

#### C2. `/admin/tenants` (I01)
- Tablo + provisioning wizard ("Yeni Tenant"), suspend/archive aksiyonları
- Detay: kota kullanımı, izolasyon ihlal raporu, schema durumu

#### C3. `/admin/users` (I02)
- Polymorphic identity: filter `principal_type` (human/agent/system/service)
- Detay: rol+capability, oturumlar, audit zaman çizelgesi

#### C4. `/admin/roles` (I04)
- RBAC matrix UI (action × resource)
- Agent capability scope editor (ayrı sekme)

#### C5. `/admin/plugins` (K01) + `/admin/marketplace` (O02)
- Yüklü pluginler (tablo): durum, sürüm, sağlık, "upgrade", "uninstall"
- Marketplace: kategori, arama, kurulum wizard, license/billing entegre
- Install wizard: dependency graph görseli, conflict listesi, dry-run sonucu

#### C6. `/admin/doctypes` (K02)
- DocType liste + "Yeni DocType" wizard (alan editör, validation rules, MCP tool toggle)
- Detay: alan listesi (drag-sort), generated API preview, generated Admin UI preview tabs

#### C7. `/admin/migrations` (K03)
- Migration kuyruğu, AI-suggested plan'lar (accept/reject), rollback
- Diff viewer (CodeMirror)

#### C8. `/admin/hooks` (K04)
- Hook + event explorer; canlı event stream (SSE); dead-letter queue paneli

#### C9. `/admin/config` (K05)
- Hiyerarşik tree (global / tenant / user), feature flags toggle (instant propagation), secret rotation

#### C10. `/admin/api` (S01)
- OpenAPI explorer (Stoplight Elements wrapper)
- Endpoint list, try-it-out, MCP equivalent görüntüle

#### C11. `/admin/workflows` (S04)
- State machine graph viewer (visx), transition log, "yeni workflow" editor

#### C12. `/admin/audit` (D01)
- Forensic search (tarih, aktör, action, resource), append-only verification (hash chain), export

#### C13. `/admin/pii` (D02)
- Sınıflandırma overview (public/internal/confidential/restricted heatmap)
- DSAR kuyruğu (KVKK madde 11 erişim, madde 7 silme)
- Field-level encryption status

#### C14. `/admin/compliance` (D03)
- Control matrix (KVKK + GDPR + SOC2), kanıt freshness, ticket'lar
- Audit hazırlık raporu PDF export

#### C15. `/admin/slo` (O01)
- SLO list, error budget burndown chart, alert routing config, on-call schedule

#### C16. `/admin/security/reviews` (O03)
- Bekleyen plugin reviewları, sandbox test results, supply-chain verification UI

#### C17. `/admin/tenants/:id/isolation` (I05)
- Cross-tenant breach denemeleri timeline, query interception log, schema switch p99

---

### 7.D — Agent / MCP Debugger UI

> Layout: 3-panel (sol: navigatable list — conversations/tools/prompts/agents | orta: detail | sağ: inspector / live stream)
> Tonu: dev tools — yoğun bilgi, mono font ağırlıklı, ama yine glass + neon

#### D1. `/agent` — Agent Ops Overview
- Live metric strip: agent çağrı/dk, ortalama latency, başarı oranı, cost/saat, top model
- Live trace feed (son N agent çağrısı, tıkla → trace detail)
- Cost heatmap (tenant × feature)

#### D2. `/agent/mcp` (A01)
- MCP transport listesi (stdio/sse/streaming-http), her biri için uptime, son handshake, "test connection"

#### D3. `/agent/tools` (A02)
- Tool registry tablo: name, plugin owner, side-effect, idempotency, blast radius, cost class, **LLM-readability score**
- Detail: full schema, examples, "AI ile description iyileştir" suggest

#### D4. `/agent/agents` (A03)
- Agent listesi: kimlik, capability scope, session limit, son aktivite, ihlal sayısı
- Scope editor: action × resource matrix + custom predicate

#### D5. `/agent/memory` (A04)
- Memory layer viewer: short-term / long-term / episodic / procedural tabs
- Tıkla → memory entry detail, embedding viz (UMAP 2D projection)

#### D6. `/agent/vectors` (A05)
- Index listesi, embedding model version, pipeline job status (queue depth, throughput), reindex aksiyonu
- "Hibrit arama playground": query → vector + BM25 + filter; sonuçları yan yana

#### D7. `/agent/prompts` (A06)
- Prompt liste + version history (CodeMirror diff)
- Eval suite: case'ler, son run sonuçları, A/B test winner indicator
- "Deploy" akışı (dev → staging → prod) + rollback

#### D8. `/agent/providers` (A07)
- Provider listesi (Anthropic, OpenAI, Azure, Bedrock, Ollama), routing rules editor, fallback chain
- Cost graph (zaman × provider × model)

#### D9. `/agent/observability` (A08)
- Trace explorer (Langfuse-vari): zaman serisi + filter (tenant, agent, model, cost > X)
- Trace detail: prompt + completion + token count + cost + latency + hallucination skor
- "Replay" — aynı prompt'u farklı model/version ile yeniden çalıştır

#### D10. `/agent/workflows` (A09)
- Plan-execute-reflect workflow viewer: step tree, checkpoint markers, human-in-the-loop bekleyen kuyruğu
- Replay & branch

#### D11. `/agent/conversations` (A11)
- Conversation list + filter; detail: tam mesaj akışı + tool call timeline + token/cost
- Branching viewer (alternatif replies tree)
- Export (JSON / Markdown / PDF transcript)

---

## 8) AI-First Feature Specifications

### 8.1 NL Search (S06 + A02)
- Submit → `parseQuery` tool çağrısı → structured filter object + confidence → UI'da chip'lere dökülür ("İznik" → bölge:İznik chip'i, "imarlı" → imar:var chip'i)
- Düşük güven → kullanıcıya soru ("Hangi imar?")
- Fallback: yapısal search

### 8.2 AI Valuation Card
- Inputs: lokasyon + özellikler → tool çağrısı → tahmin aralığı + N karşılaştırılabilir + güven + factor importance
- UI: skeleton → streamed update (her field ayrı yere yerleşir)
- "Neden bu fiyat?" expandable → factor breakdown

### 8.3 AI Listing Description Generator
- Inputs: özellikler + lokasyon + tonu seç (profesyonel / sıcak / yatırımcı)
- Streamed token-by-token (A10) ile yazıma akar
- "Yeniden üret" + "tonu değiştir" + manuel edit

### 8.4 Tapu OCR + Risk Score (D02 + A05 surface)
- PDF/foto upload → "Belge okunuyor..." (gerçek tokenizer hissi)
- Çıktı: ada/parsel/yüzölçümü/cins otomatik dolar
- Risk skoru: ipotek, haciz, şerh tespiti — uyarı kartı

### 8.5 AI Q&A on Listing
- Detay sayfa: "Bu arsa hakkında soru sor"
- Agent context: listing JSON + ilgili bölge raporu + imar verisi (mock)
- Tool kullanımı şeffaf: cevap altında "Kullanılan kaynaklar: imar planı PDF, …"
- Satıcı moderasyonu: agent ön-cevap → satıcı onay → kullanıcıya gönderim

### 8.6 Personal AI (Dashboard)
- Memory: kullanıcının favorileri, kayıtlı aramaları, geçmiş etkileşim (A04 mock seed)
- Aksiyonlar: "Çeşme'de yeni bir şey var mı?" → search tool + summarize → kart önerisi
- Onay gerektiren aksiyonlar (`post_listing`, `send_message`) → human-in-the-loop modal

### 8.7 Cmd-K Agent Mode
- Cmd-K → "ne yapmak istiyorsun?" → NL → uygun action önerisi VEYA agent çağrısı
- Örnek: "geçen hafta favorilediğim Çeşme arsalarını PDF rapor olarak hazırla" → tool zinciri

---

## 9) Mobile-First Rules

1. **Önce mobil tasarla.** Tüm component'lerin mobil hali default. `md:`/`lg:` ile augment.
2. **Bottom navigation** Public+Dashboard'da; sticky CTA bar ilan detayda.
3. **Sheet > Modal:** Mobilde tüm modaller bottom sheet (Vaul).
4. **Hit targets:** 44×44px min.
5. **Tipografi:** Mobile body 15px (16px değil, hint olarak Geist'in optical adjust'ı).
6. **Forms:** Tek sütun, büyük input, native keyboard hints (`inputmode`, `autocomplete`).
7. **Map:** Mobilde tam ekran + alt sheet, gesture konflikti yok.
8. **Offline:** PWA + cached last viewed listings + favorites.
9. **iOS quirks:** Safe-area inset, viewport units `dvh` kullan (`100vh` değil).
10. **Performance:** Mobil network'te < 180KB initial JS; resimler lazy + `loading="lazy"` + intrinsic size.

---

## 10) Mock Data Stratejisi (Demo'ya hazır)

- **MSW handlers** her resource için: listings, users, agents, conversations, tools, prompts, traces, audit logs, **brokers, broker_teams, leads, clients, commissions**, …
- **Seed:** TR-locale faker — Türkiye'den 1500+ ilan (gerçekçi bölge dağılımı: Marmara %35, Ege %25, Akdeniz %15, vd.), 200 kullanıcı, 12 agent, 80 tool, 40 prompt, 5000 trace, 10000 audit event
- **Broker seed (R-04):** 6 emlakçı ofisi (her biri broker-admin + 4 broker-agent), 480 portföy ilanı (broker'lara dağıtılmış), 1200 lead (funnel evrelerine yayılmış), 800 müşteri kartı, 320 komisyon kaydı (son 12 ay), 6 vitrin sayfası
- **Persona seed (R-01):** `src/mocks/seed/personas.ts` — Buyer/Seller/Broker-admin/Broker-agent/Admin/Agent için pre-seeded identity, her birinin login bypass'ı (`useDemoIdentity('broker-admin')`)
- **Görseller:** Unsplash + Pexels arsa/manzara fotoları (rights-clear), CDN proxy ile cache
- **Yer/koord:** Türkiye sınırları içi rastgele ama il-ilçe merkezleri ağırlıklı (bias array)
- **Tutarlılık:** Aynı ilan ID'si her yeniden yüklemede aynı veri (faker seed deterministic)
- **Latency simülasyonu:** her endpoint'e 80-400ms random delay, %1 hata oranı (gerçek hissi)
- **Streaming:** AI endpoint'leri SSE ile token-by-token sahte stream (mock LLM cevapları)

---

## 11) Quality Gates (her PR/commit için)

- ✅ TypeScript: 0 hata, 0 `any`
- ✅ Biome: 0 warning
- ✅ Vitest: yeni unit testler PASS
- ✅ Playwright: kritik akışlar PASS (smoke)
- ✅ Lighthouse CI: hedef skorlar
- ✅ Bundle size budget: route base < 70KB gz
- ✅ a11y: axe-core 0 violations
- ✅ i18n: TR ve EN parite (eksik key error)
- ✅ Visual regression: Playwright screenshots match
- ✅ **SSG sayfalarda `<noscript>` fallback ≥ 200 karakter** (R-08)
- ✅ **Production build'de PersonaSwitcher tree-shake edildi** (bundle'da `landx_demo_persona` string'i 0 occurrence) (R-01)
- ✅ **Hash routing modu için `dist/404.html` = `dist/index.html` kopyası** (build:demo) (R-05)
- ✅ **Broker rotaları (`/broker/**`) `principal_subtype` guard'a sahip** (RBAC test) (R-04)

---

## 12) Phase Plan (Claude Code execution order)

> Her faz **plan-mode** ile başlar, kullanıcı onayıyla execute eder. Faz sonunda demo edilebilir çıktı.

### Phase 0 — Foundations (1 commit)
- Vite + React Router v7 + Tailwind v4 + Flowbite + Biome + Vitest + Playwright kurulum
- `design/tokens.css`, motion presets, glass recipes
- `AppShell`, `PublicLayout`, `AuthLayout`, `DashboardLayout`, `AdminLayout`, `AgentLayout` iskeletleri
- MSW kurulum + boş handlers
- i18n (TR/EN) init
- CI workflow (GitHub Actions tek dosya)
- **Demo:** boş sayfalar her layout'ta gezilebilir

### Phase 1 — Design System & Component Library
- `components/ui/*` — Button, Input, Select, Checkbox, Switch, Card, Badge, Tooltip, Toast, Modal, Sheet, Tabs, Accordion, Avatar, Dropdown, Pagination, Skeleton, ThinkingDot, TokenStream
- Storybook (opsiyonel ama önerilir) veya `/design` route'unda canlı dokümantasyon sayfası
- `components/forms/*` — RHF+zod field factory
- **Demo:** `/design` sayfasında tüm component'ler

### Phase 2 — Public Marketplace
- A1 Landing → A2 Search → A3 Listing Detail → A4 Map → A6 Compare → A9 Regions → A10 Marketing
- Mock listings seed
- Search filter URL state + Saved Search drawer
- **Demo:** anasayfadan tıklayarak tam akış

### Phase 3 — Auth + User Dashboard (Bireysel)
- A11 Auth pages
- B1–B10 Dashboard (bireysel alıcı/satıcı)
- B5 Messaging (insan + agent), B6 AI Assistant (mock stream)
- **Persona Switcher MVP** (Buyer + Seller arasında, env: `VITE_DEMO_MODE=true`) (R-01)
- **Demo:** kayıt → ilan favori → AI'a soru → mesaj

### Phase 3.5 — Broker Dashboard (R-04, yeni faz)
- B'1–B'10 Broker Dashboard tüm sayfaları
- `principal_subtype` (broker | broker-admin | broker-agent) RBAC entegrasyonu (§5.3)
- Persona Switcher'a Broker seçeneği eklenir
- Broker showcase için ilk SSG sayfası (`/b/:slug`) — Phase 7'deki SSG infra'sının prototipi
- Mock seed: 6 broker ofisi, 24 broker-agent, 480 ilan portföyü, 1200 lead, 800 müşteri kartı
- **Demo:** broker login → portfolio toplu fiyat ayarı → lead pipeline → komisyon raporu PDF

### Phase 4 — Listing Creation (post-listing wizard) + AI Tools
- A5 Post-listing 6-step wizard (OCR mock, AI description, AI valuation)
- A7 Valuation tool, A8 Investment sim
- **Demo:** ilan ver akışı baştan sona + raporlar

### Phase 5 — Admin Panel
- C1–C17 tüm admin sayfaları
- Auto Admin UI factory (DocType'tan list/detail/form üretici) — başlangıçta 2-3 DocType için statik, sonra dinamik
- **Demo:** tenant → plugin → DocType → audit → SLO akışı

### Phase 6 — Agent / MCP Debugger
- D1–D11 tüm agent sayfaları
- Trace explorer + replay
- Prompt versioning + eval UI
- **Demo:** trace → replay → prompt değiştir → yeniden run

### Phase 7 — Polish, Performance, a11y, PWA, **Demo Deploy**
- Lighthouse passes
- PWA manifest + SW
- Visual regression baseline
- Locale audit (EN parite)
- **Rendering Strategy uygulaması (R-08):** Public + Listing detail + Regions + Blog + Broker showcase için SSG/SSR prerender; `<noscript>` fallback'leri yazımı
- **Demo Deploy pipeline (R-05):** `pnpm build:demo` script + `.github/workflows/demo.yml` GitHub Pages publish + `dist/404.html` fallback
- **PersonaSwitcher tree-shake doğrulaması** (production build'de görünmemesinin Playwright testi)
- Müşteri demo senaryosu (scripted Playwright run — 5 persona için 5 akış)

### Phase 8 — Deliverables Package
- `/docs/design-system.md`
- `/docs/module-map.md`
- `/docs/demo-script.md`
- Cypress/Playwright video walkthrough
- Backend handoff: OpenAPI spec, MSW handlers → contract test seti

---

## 13) Claude Code Workflow — Önerilen Kullanım

### 13.1 Mutlaka kurman gereken araçlar
- **`/init`** ile başlat — Claude Code projeyi indeksler
- **`CLAUDE.md`** repo root'a: bu PROMPT.md'nin özet versiyonu + sürekli hatırlanması gereken kurallar (quality bar, naming, "ASLA"lar)
- **Plan mode** her faz başında: `claude --plan` veya konuşmada "let's plan first"
- **Checkpoints**: her phase sonunda commit + tag

### 13.2 Subagent / Skill önerileri
Claude Code'da bu rolleri ayrı agent olarak kurmak (Sub-agent'lar):
- **`frontend-architect`** — phase planları, modül kararları, route yapısı
- **`design-system-engineer`** — token, recipes, primitives — sadece `components/ui/*` ve `design/*` üzerinde çalışır
- **`page-builder`** — tek bir sayfa için: route + component + mock handler + i18n key + test
- **`ai-feature-engineer`** — AI hooks, SSE, MCP client, agent UI parçaları
- **`a11y-auditor`** — her PR'da axe-core ve manual check
- **`qa-reviewer`** — Playwright senaryoları, visual regression, demo akışı

### 13.3 MCP entegrasyonları (Claude Code'a takılabilir)
- **Playwright MCP** — e2e test üretimi + canlı test koşturma
- **Chrome DevTools MCP** — performance trace, Lighthouse koşturma
- **Figma MCP** (varsa Figma file) — token / spec senkronizasyonu
- **shadcn MCP** — alternatif component önerileri (Flowbite'ta yoksa fallback)
- **Git MCP** — sayfa-bazlı commit otomasyonu

### 13.4 Skill'ler (Anthropic Skills)
- **`frontend-design` skill** — UI inşası, distinctive aesthetics
- **`pdf` skill** — değerleme raporu, yatırım raporu, demo handover PDF'i üretimi
- **`docx` skill** — müşteri sunum dökümanı (executive summary)
- **`pptx` skill** — demo-day slide deck (Q3 hedef)
- **`skill-creator`** — proje özel skill (örn. "landx-page-skill" şablon zorlamak için)

### 13.5 Komut kalıbı
```bash
# faz başlat
claude "Phase 2: implement Public Marketplace. Read PROMPT.md §7.A and §12.Phase 2. Start in plan mode."

# tek sayfa
claude "Build /search page per PROMPT.md §7.A.A2. Include MSW handler, RHF+zod filter schema, vitest unit tests for filter parser, playwright smoke test."

# yeniden tasarım iterasyonu
claude "Apply design-system polish pass on /listing/:id. Audit against §2 Obsidian Grid spec. Use frontend-design skill."

# audit
claude "Run a11y, performance, and i18n parity audit. Produce a remediation plan in docs/audit-YYYYMMDD.md."
```

---

## 14) Decision Log — Açık Kararlar (kullanıcı onayı bekliyor)

| # | Karar | Mevcut Varsayım | Değiştirmek için |
|---|---|---|---|
| A1 | Backend bağlantı | MSW mock-first, OpenAPI-driven | Backend hazırsa baseURL switch |
| A2 | Harita sağlayıcı | MapLibre + OSM | Mapbox/Google için adapter |
| A3 | i18n diller | TR primary + EN | AR ekleme tarihi |
| A4 | Auth metotları | Hepsi UI'da (password, OAuth, magic, passkey, API key) | Feature flag |
| A5 | LLM sağlayıcı | Mock SSE; gerçek bağlantı Phase 7+ | Anthropic vs OpenAI default |
| A6 | Map data source | Açık veri (OSM, MTA imar tile mock) | Resmi imar API entegrasyonu? |
| A7 | Branding | "arsam.net" wordmark + LandX powered-by rozet | Logo varlığı var mı? |
| A8 | Email/SMS | Mock | SendGrid/Twilio Phase 7? |
| A9 | Ödeme | Pricing sayfası UI-only, billing iframe placeholder | iyzico/Stripe seçimi |
| A10 | Analitik | Posthog client-side hazır, kapalı | Açma kararı |
| **A11** | **Broker rol modeli (R-04)** | `broker` + `broker-admin` + `broker-agent` 3 alt-rol; B'1–B'10 sayfa seti; Phase 3.5'te inşa edilir | Tek tip broker rolü mü, daha fazla mı (örn. `broker-trainee`) |
| **A12** | **Routing modu (R-05)** | `VITE_ROUTER_MODE=browser` (prod) vs `hash` (demo); tek manifest, çift link | Hash hep mi açık olsun (deep-link kararı) |
| **A13** | **Rendering stratejisi (R-08)** | Landing/Regions/Blog/Pricing/Legal → SSG; Listing detail → SSR+ISR; Broker showcase → SSG; geri kalan → CSR | ISR cache TTL (60sn? 300sn?) |
| **A14** | **Persona Switcher (R-01)** | `VITE_DEMO_MODE=true` ile aktif, production'da tree-shake | Staging'de açık kalsın mı (QA için)? |
| **A15** | **Broker showcase domain stratejisi** | `arsam.net/b/[slug]` (path-based) — Phase 7'de SSG | Custom domain (`*.brokers.arsam.net`) Phase 8+? |

---

## 15) Definition of Done (proje seviyesi)

Bu proje **müşteri sunumuna hazır** sayılır eğer:

- [ ] Tüm **5 yüzey** (Public + Dashboard + **Broker** + Admin + Agent) canlı navigasyonla gezilebilir
- [ ] **Persona Switcher (demo mode)** 5 persona arasında sorunsuz geçiş yapıyor; production build'de bileşen yok (R-01)
- [ ] **Senaryo demo A — Alıcı:** "Müşteri Çeşme'de yatırımlık arsa arıyor → NL search → AI değerleme → favoriye ekle → sahiple AI Q&A → ilan ver akışı → admin'de yeni ilan onay → agent debugger'da AI Q&A trace inceleme" — Playwright ile uçtan uca PASS
- [ ] **Senaryo demo B — Emlakçı (R-04):** "Broker login → portföy toplu fiyat ayarı → yeni lead'i broker-agent'a atama → müşteri kartı KVKK aydınlatma → komisyon raporu PDF → vitrin sayfası SSG preview" — Playwright PASS
- [ ] Lighthouse skorları her surface için QA gate üstünde
- [ ] SSG sayfalarda `<noscript>` fallback ≥ 200 karakter (R-08)
- [ ] **Demo deploy çalışıyor:** `pnpm build:demo` → GitHub Pages publish → hash routing tüm 5 yüzey için derinlemesine link verilebilir (R-05)
- [ ] Mobile (iPhone SE 375px) + tablet (768px) + desktop (1440px) viewport'larda manuel test PASS
- [ ] TR/EN parite — tüm key'ler iki dilde (Broker sayfaları dahil)
- [ ] Reduce-motion + high-contrast + screen reader (NVDA/VoiceOver) sanity check
- [ ] Bundle budget içinde
- [ ] `docs/demo-script.md` 2 müşteri sunum akışıyla hazır (Buyer akışı + Broker akışı)
- [ ] PDF rapor export çalışıyor (değerleme + yatırım sim + **broker komisyon raporu**)
- [ ] PWA installable, offline favoriler erişilebilir
- [ ] README + ENV örnek + Quick start `< 5dk` (pnpm i + pnpm dev)

---

## 16) Hızlı Başlangıç (Claude Code'a ilk komut)

```bash
# Repo init
mkdir landx-frontend && cd landx-frontend
git init && pnpm init -y

# Claude Code'u başlat (bu dosya da repo root'una konsun)
cp PROMPT.md ./PROMPT.md
cp PROMPT.md ./CLAUDE.md   # üzerinde özetle, "always read" notu ekle

claude
```

İlk konuşma:
> "Read PROMPT.md and CLAUDE.md fully. Then enter plan mode and produce the Phase 0 plan. Do not start coding until I approve."

---

**Bitti. Bu prompt dosyasını köke koy, Claude Code'a oku ve faz faz ilerle. Her fazda demo et, demo onaylanmadan sonraki faza geçme.**
