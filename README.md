# LandX / arsam.net Frontend

AI-first arsa marketplace — demo prototype.

> Project brief: [`PROMPT.md`](./PROMPT.md) · Operational rules: [`CLAUDE.md`](./CLAUDE.md) · Demo akış: [`docs/demo-script.md`](./docs/demo-script.md)

---

## Quick start (< 5 min)

```bash
# Prerequisites: Node 22 LTS, pnpm 9
nvm use                          # honors .nvmrc
pnpm install
pnpm exec msw init public/ --save
pnpm dev                         # → http://localhost:5173
```

Tarayıcıyı **http://localhost:5173/** aç — Persona Switcher (`Ctrl+Shift+P`) ile 5 yüzey arasında gez.

---

## 🌐 Tarayıcı Walkthrough — Tüm Route'lar

Toplam **53 route** 7 yüzeyde. Hepsi gerçek mock data + tıklanabilir aksiyon ile çalışır.

### 1) Public Marketplace (`/`) — 12 route

| URL | Ne gösterir | Test edilecek |
|---|---|---|
| http://localhost:5173/ | **Landing** — Hero NL search, featured ilanlar, "AI Bugün", stats | NL search bar'a "Çeşme imarlı" yaz → /search'e gider, filtre uygulanır |
| http://localhost:5173/search | **Arama** — Split list+map, filter chip, AI özet, save | Chip'e tıkla → filtre kaldırılır; "AI ile Daralt" → sheet açılır |
| http://localhost:5173/listing/lst_00001 | **İlan detay** — Galeri, AI değerleme stream, AI Q&A modal | "Yeniden oynat" → token-by-token AI replay; "AI'a Sor" → modal |
| http://localhost:5173/listing/lst_00042 | Aynı (farklı ilan) | Favoriye ekle (kalp) → toast → /dashboard/favorites'a git |
| http://localhost:5173/map | **Tam ekran harita** — MapLibre + cluster + Katman sheet | Marker'a tıkla → detaya git; Katman butonu sheet açar |
| http://localhost:5173/compare | **Karşılaştırma** — 2-4 ilan yan yana, fark highlight | Select'ten ilan ekle → satır bazlı diff cyan |
| http://localhost:5173/regions | **Bölge rehberi** — Marmara/Ege/Akdeniz/... 22 şehir × ilçe | Bir şehre tıkla → /search?city=X'e git |
| http://localhost:5173/post-listing | **İlan ver wizard** — 6 adım (OCR, AI desc, AI value, ...) | Step 2: "Yükle & OCR" → AI alanları doldurur; Step 4: AI açıklama gen |
| http://localhost:5173/tools/valuation | **Standalone AI Değerleme** — Form + AI thinking + factor breakdown | "AI ile değerle" → 1.4s thinking → streamed sonuç + PDF butonu |
| http://localhost:5173/tools/investment-sim | **Yatırım Simülatörü** — IRR, ROI, breakeven, Monte Carlo | "Simüle et" → 5 metrik hesabı + dağılım yorumu |
| http://localhost:5173/about | Hakkımızda — 4 mission card |  |
| http://localhost:5173/pricing | **Fiyatlandırma** — 4 tier karşılaştırma, plan seçimi mock | "Plana geç" butonları → toast |
| http://localhost:5173/contact | **İletişim formu** — RHF + zod | Boş gönder → inline error; doğru doldur → success toast |
| http://localhost:5173/blog | **Blog liste** — 3 örnek post |  |
| http://localhost:5173/blog/cesme-yatirim-rehberi | **Blog detay** | "Blog'a dön" çalışır |
| http://localhost:5173/legal/kvkk | **KVKK aydınlatma** | "Verilerime erişim talep et" → toast |
| http://localhost:5173/legal/cookies | Çerez politikası |  |
| http://localhost:5173/legal/terms | Kullanım şartları |  |

### 2) Auth (6 route)

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/login | Login — password + Google/Apple/Magic/Passkey butonları |
| http://localhost:5173/register | Kayıt — 4 alanlı RHF form + KVKK consent |
| http://localhost:5173/forgot | Şifre sıfırlama email formu |
| http://localhost:5173/reset | Yeni şifre + tekrar (zod refine ile eşleştirme) |
| http://localhost:5173/verify | E-posta doğrulama bekleme ekranı |
| http://localhost:5173/passkey-setup | Passkey kayıt — Fingerprint → progress → done |

### 3) User Dashboard (B1-B10) — 10 route

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/dashboard | **Ana** — KPI grid, **AI Bugün** streamed insights, aktivite, hızlı eylem |
| http://localhost:5173/dashboard/listings | **İlanlarım** — TanStack tablo, AI öneri/düzenle/sil aksiyonları |
| http://localhost:5173/dashboard/favorites | **Favoriler** — localStorage-backed (Search'ten ekledikleri burada) |
| http://localhost:5173/dashboard/alerts | **Uyarılar** — 3 kayıtlı arama, kanal badge'leri, on/off switch |
| http://localhost:5173/dashboard/messages | **Mesajlaşma** — 3-pane (thread/messages/draft), agent bubble + tool calls |
| http://localhost:5173/dashboard/ai | **Kişisel AI Asistan** — Chat + Inspector (tool kullanımı + cost) |
| http://localhost:5173/dashboard/security | **Güvenlik** — Tabs: Sessions / Passkeys / **Agent Tokens** (I03) |
| http://localhost:5173/dashboard/profile | **Profil & Tercihler** — RHF form + **KVKK indir/sil** butonları |
| http://localhost:5173/dashboard/billing | **Faturalandırma** — Plan kartı, ödeme metodu, invoice PDF tablosu |
| http://localhost:5173/dashboard/kyc | **KYC** — Doc upload pipeline, AI OCR butonu |

### 4) Broker Dashboard (B'1-B'10, R-04) — 10 route

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/broker | **Ops Overview** — 4 KPI, AI Bugün, Lead Pipeline Funnel, Team listesi |
| http://localhost:5173/broker/portfolio | **Portföy** — Tablo + toplu fiyat ±%5, AI toplu öneri, CSV import/export |
| http://localhost:5173/broker/leads | **Lead/CRM** — 3-pane, heat scoring (hot/warm/cold), SLA timer |
| http://localhost:5173/broker/clients | **Müşteriler** — KVKK consent badge, veri indir/sil aksiyonları (D02 DSAR) |
| http://localhost:5173/broker/commissions | **Komisyonlar** — Alındı/Bekleyen/İade KPI, anlaşma tablosu, vergi PDF |
| http://localhost:5173/broker/showcase | **Vitrin yönetim** — Marka kimliği, AI bio öneri, stats |
| http://localhost:5173/broker/team | **Takım** — broker-admin only — üye davet, rol, komisyon |
| http://localhost:5173/broker/analytics | **Analitik** — 12-ay bar chart, rakip karşılaştırma (AI commentary) |
| http://localhost:5173/broker/ai-tools | **AI Araçları** — 5 tool (rewrite/price-opt/segment/follow-up/prioritizer) |
| http://localhost:5173/broker/subscription | **Abonelik** — Kullanım metrikleri (progress bar), premium feature toggles |

### 5) Broker Public Showcase (SSG, A15)

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/b/karaca-emlak | **Public broker vitrini** — Hero, stats, featured listings, contact form (RHF) |

### 6) Admin Panel (C1-C16) — 16 route

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/admin | **Operations Overview** — 8 KPI mega-grid, anomaly feed (AI), sistem haritası |
| http://localhost:5173/admin/tenants | (I01) Tenant tablosu, durum badge'leri |
| http://localhost:5173/admin/users | (I02) Polymorphic identity — human/agent/service filter |
| http://localhost:5173/admin/roles | (I04) **RBAC matrix** (action × role) + Agent Capability Scope tab |
| http://localhost:5173/admin/plugins | (K01) Yüklü pluginler + Marketplace CTA |
| http://localhost:5173/admin/doctypes | (K02) DocType liste + schema editor entry |
| http://localhost:5173/admin/migrations | (K03) Pending with **AI suggestions** + dry-run + apply |
| http://localhost:5173/admin/hooks | (K04) Canlı SSE event stream + Dead-letter queue |
| http://localhost:5173/admin/config | (K05) Feature flags (instant propagation) + Secret rotation |
| http://localhost:5173/admin/api | (S01) Endpoint list + MCP equivalent badges |
| http://localhost:5173/admin/workflows | (S04) State machine workflow cards |
| http://localhost:5173/admin/audit | (D01) **Forensic table** + Hash chain verify |
| http://localhost:5173/admin/pii | (D02) Field classification + **DSAR queue** |
| http://localhost:5173/admin/compliance | (D03) KVKK/GDPR/SOC2 score cards + tickets |
| http://localhost:5173/admin/slo | (O01) SLO posture + Error budget bars |
| http://localhost:5173/admin/security/reviews | (O03) Plugin reviews approve/reject |

### 7) Agent / MCP Debugger (D1-D11) — 11 route

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/agent | **Ops Overview** — 4 KPI, hallucination score streamed, live trace feed, cost heatmap |
| http://localhost:5173/agent/mcp | (A01) 4 transport: stdio/sse/streaming-http/ws — Test bağlantı butonları |
| http://localhost:5173/agent/tools | (A02) Tool registry + **LLM-readability** progress bar |
| http://localhost:5173/agent/agents | (A03) Agent identity + capability scope binding |
| http://localhost:5173/agent/memory | (A04) Memory Tabs: short/long/episodic/procedural + UMAP viz |
| http://localhost:5173/agent/vectors | (A05) Index list + Hibrit arama playground (vector + BM25 yan yana) |
| http://localhost:5173/agent/prompts | (A06) Version + eval + deploy stage |
| http://localhost:5173/agent/providers | (A07) Anthropic/OpenAI/Azure/Bedrock/Ollama mix + 12hr cost chart |
| http://localhost:5173/agent/observability | (A08) Trace explorer + hallucination flags + replay |
| http://localhost:5173/agent/workflows | (A09) **Plan-Execute-Reflect** step viewer + HITL approve |
| http://localhost:5173/agent/conversations | (A11) Conversation list + JSON/MD/PDF export |

### 8) Design system catalog

| URL | Ne gösterir |
|---|---|
| http://localhost:5173/design | **Tüm primitive kataloğu** — 22 component canlı, her interactive eleman gerçek tepki (toast/modal/sheet/dropdown), form demo (RHF+zod), TokenStream replay |

---

## 👤 Persona Switcher

Demo modda (default) sağ-üst köşede görünür. **5 persona** arası geçiş yapar:

| Persona | Route prefix | Aksiyon |
|---|---|---|
| 🔵 **Alıcı (Buyer)** | `/` (Public Marketplace) | Default — public sayfaları gezer |
| 🟢 **Satıcı (Seller)** | `/dashboard` | User Dashboard (B1-B10) |
| 🟡 **Emlakçı (Broker)** | `/broker` | Broker Dashboard (R-04, B'1-B'10) |
| 🟣 **Yönetici (Admin)** | `/admin` | Admin Panel (C1-C16) |
| 🩷 **Agent Debugger** | `/agent` | Agent / MCP Debugger (D1-D11) |

### Kullanım

- **Klavye:** `Ctrl + Shift + P` → menü açılır, arrow key ile gez, Enter ile seç
- **Tıklama:** Sağ-üstte avatar yanındaki dot+isim chip'ine tıkla
- **URL ile:** `?persona=broker-admin` query param → o persona ile başlar
- Seçim `sessionStorage`'da saklanır — sayfa yenilemede korunur
- Production build'de **tree-shake edilir** (görünmez)

---

## ✅ Test Senaryoları (mantıklı akışlar)

### Senaryo A — Alıcı (Buyer) [4 dk]
1. http://localhost:5173/ → NL search'e "Çeşme imarlı" yaz, "Ara" tıkla
2. /search'te chip'ler aktif, AI özet rozeti üstte
3. Bir listing kartına tıkla → /listing/lst_XXXXX
4. AI Değerleme kartında "Yeniden oynat" — token-by-token replay
5. Sağ kolonda "AI'a Sor" → modal aç, soru sor → AI cevap
6. Kalp ikonuna tıkla → favori toast
7. **Persona Switcher → Satıcı** → /dashboard/favorites → eklenen ilan burada

### Senaryo B — Emlakçı (Broker, R-04) [4 dk]
1. **Persona Switcher → Emlakçı** → /broker
2. KPI grid + AI Bugün (3 streamed insight) + Pipeline funnel
3. /broker/portfolio → "Toplu -%5" → success toast
4. /broker/leads → lead seç (sol panel) → 3-pane detay; "Geri ara" toast
5. /broker/clients → bir satırda "Veri indir" → DSAR toast
6. /broker/commissions → "Vergi raporu (PDF)" toast
7. /broker/ai-tools → "Toplu açıklama yeniden yazma" → agent toast
8. /broker/showcase → "Vitrini görüntüle" → /b/karaca-emlak yeni sekme

### Senaryo C — Yönetici [3 dk]
1. **Persona Switcher → Yönetici** → /admin
2. 8 KPI + anomaly feed + sistem haritası
3. /admin/audit → "Hash chain doğrula" → success toast
4. /admin/pii → DSAR kuyruğunda "İşle" → toast
5. /admin/slo → 4 SLO + error budget bar'lar (1'i at-risk)

### Senaryo D — Agent / MCP Debugger [2 dk]
1. **Persona Switcher → Agent Debugger** → /agent
2. Hallucination score streamed + live trace feed
3. /agent/mcp → 4 transport "Test bağlantı" toast
4. /agent/observability → "Replay" toast
5. /agent/conversations → JSON/MD/PDF export butonları

### Senaryo E — Satıcı [2 dk]
1. **Persona Switcher → Satıcı** → /dashboard
2. KPI + AI Bugün streamed insights
3. /dashboard/listings → "AI öner" agent toast
4. /dashboard/ai → "Çeşme'de yeni ne var?" yaz → AI cevap streamed + tool calls
5. /dashboard/security → 3 tab (Sessions/Passkeys/**Agent Tokens** — I03)

### Bonus — Design system catalog [2 dk]
- http://localhost:5173/design — her primitive canlı
- Toast butonları (7 ton) → gerçek toast'lar
- "Modal aç" → modal (mobile <md viewport'ta otomatik bottom-sheet'e döner)
- Form demo: boş submit → inline RHF error; doldur → success toast

---

## 📱 Mobile + Responsive test

Chrome DevTools (`Cmd+Opt+I`) → Device toolbar:
- **iPhone SE (375)** → bottom nav görünür, sidebar gizlenir, Modal bottom-sheet'e döner
- **iPad (768)** → tablet layout
- **Desktop (1440)** → tam genişlik

---

## 🎨 Tasarım kontrolleri

- **Obsidian Grid** — koyu cam yüzeyler + ince neon konturlar
- **Tokens:** Geist + JetBrains Mono fontları, oklch renkler
- **Glassmorphism:** kartlar `backdrop-blur(20px)` + cam efekti
- **Motion:** tüm geçişler `cubic-bezier(0.2, 0.8, 0.2, 1)` ease-out-expo
- **Reduce motion:** sistem ayarın "prefers-reduced-motion: reduce" ise animasyonlar kısalır

---

## 🚀 Deploy to GitHub Pages

`.github/workflows/demo.yml` her `main` push'ta otomatik deploy eder.

**Auto-setup:**
1. Push the repo to GitHub
2. Settings → Pages → Source: **GitHub Actions**
3. Push to `main` → workflow `VITE_BASE_PATH=/<repo-name>/` (auto-computed) ile build, `pnpm build:demo` koşturur, `build/client/` Pages'e deploy
4. Visit `https://<user>.github.io/<repo>/` — hash-routed SPA, 53 route

**Manual deploy** (any host):
```bash
pnpm build:demo                            # root deploy (custom domain / user page)
VITE_BASE_PATH=/repo-name/ pnpm build:demo # project page (user.github.io/repo/)
```

Build çıktısı:
- `build/client/index.html` + `build/client/404.html` (SPA fallback)
- `build/client/.nojekyll` (Jekyll engelleyici)
- Tüm asset path'leri Vite `base` config ile prefix'lenmiş
- Hash routing — deep linkler çalışır (`#/listing/lst_00001`, `#/broker/leads`, vb.)

---

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | React Router dev server (browser mode, MSW on) |
| `pnpm build` | Browser-mode production build → `build/client/` |
| `pnpm build:demo` | Hash-mode demo build + 404.html fallback |
| `pnpm preview` | Serve the built output |
| `pnpm typecheck` | `tsc --noEmit` + `react-router typegen` |
| `pnpm test` | Vitest unit tests (66 test) |
| `pnpm e2e` | Playwright e2e tests (5-persona scenarios) |
| `pnpm biome:check` / `pnpm biome:fix` | Lint / format |
| `pnpm i18n:lint` | Verify TR/EN parity |

## Environment variables

Copy `.env.example` → `.env.local` and tweak. All vars are build-time switches.

| Var | Default | Purpose |
|---|---|---|
| `VITE_DEMO_MODE` | `true` (demo) | PersonaSwitcher visibility (R-01). Tree-shaken when `false`. |
| `VITE_ROUTER_MODE` | `browser` (dev) / `hash` (demo build) | Dual-mode routing (R-05) |
| `VITE_BASE_PATH` | `/` | GH Pages project page için `/repo-name/` |
| `VITE_API_BASE_URL` | empty | When empty, MSW mock layer used |
| `VITE_ENABLE_POSTHOG` | `false` | Posthog scaffolding (disabled) |
| `GITHUB_PAT` | — | `github` MCP server için (opsiyonel) |

---

## Project structure

```
src/
├─ app/                       React Router v7 framework routes
│  ├─ root.tsx                Root layout (Toaster + Tooltip provider mount)
│  ├─ routes.ts               Route config
│  ├─ routes/manifest.ts      Single source of truth (R-05)
│  ├─ (public)/               12 public marketplace pages
│  ├─ (auth)/                 6 auth pages
│  ├─ dashboard/              10 user dashboard pages
│  ├─ broker/                 10 broker pages (R-04)
│  ├─ b.$slug/                Broker public showcase (SSG-ready)
│  ├─ admin/                  16 admin pages (C1-C16)
│  └─ agent/                  11 agent/MCP debugger pages (D1-D11)
├─ components/
│  ├─ ui/                     22 primitives (Button, Input, Modal, Sheet, Tabs, …)
│  ├─ forms/                  8 form factory wrappers (RHF + zod)
│  ├─ layout/                 AppShell, Sidebar, TopBar, PersonaSwitcher
│  ├─ admin/                  AdminPage + AgentPage helpers
│  ├─ listings/               ListingCard
│  └─ map/                    MapView (MapLibre wrapper)
├─ design/                    tokens.css, motion.ts, recipes.ts
├─ features/                  search/, favorites/ slices
├─ i18n/                      tr/, en/, lint script
├─ lib/
│  ├─ api/                    Fetch client + TanStack Query hooks
│  ├─ auth/                   useDemoIdentity, personas
│  ├─ routing/                useRouteHref (dual-mode)
│  └─ format.ts               TL/m²/percent/date formatters
├─ mocks/
│  ├─ handlers/               MSW handlers (listings, broker, messaging)
│  └─ seed/                   Deterministic mock data (240 listing, 28 lead, ...)
├─ styles/                    globals.css, fonts.css
└─ types/                     listing, broker, messaging, env
```

---

## Phase status (tümü tamam)

| Phase | Status | Doc |
|---|---|---|
| 0 — Foundations | ✅ | `docs/phases/phase-0.md` |
| 1 — Design System & Components (22 primitive) | ✅ | — |
| 2 — Public Marketplace (12 sayfa) | ✅ | — |
| 3 — Auth + User Dashboard (16 sayfa) | ✅ | — |
| 3.5 — Broker Dashboard (10 sayfa) | ✅ | — |
| 4 — Listing wizard + AI tools (3 sayfa) | ✅ | — |
| 5 — Admin Panel (16 sayfa) | ✅ | — |
| 6 — Agent / MCP Debugger (11 sayfa) | ✅ | — |
| 7 — Polish + PWA + Demo Deploy | ✅ | — |
| 8 — Deliverables | ✅ | `docs/phases/phase-8.md` |

**Toplam:** ~80 sayfa · 7 yüzey · 22 primitive · 240 listing mock data · 53 route

---

## Claude Code workflow (opsiyonel)

Bu proje Claude Code (Opus 4.7) ile inşa edildi. `.claude/` workspace var ama `.gitignore`'da olduğu için repo'ya gitmez. İçerik:

- `agents/` — 6 specialized subagent (frontend-architect, design-system-engineer, page-builder, ai-feature-engineer, a11y-auditor, qa-reviewer)
- `commands/` — slash commands: `/phase-start <N>`, `/build-page <id>`, `/audit-page <route>`, `/demo-prep`
- `settings.example.json` — sample permissions/hooks template

`.mcp.json` (committed) 4 MCP server tanımlar: Playwright, Chrome DevTools, shadcn, GitHub.

---

## License

Proprietary — arsam.net / LandX (internal).
