# Demo Script — arsam.net Customer Presentation

> **Toplam süre:** 12-15 dakika
> **Önkoşul:** `pnpm dev` çalışıyor (localhost:5173). Demo modda PersonaSwitcher görünür (`Ctrl+Shift+P`).
> **Kural:** Her tıklama gerçek bir tepki üretir. Mock data deterministic (faker seed 20260513).

---

## Senaryo A — Alıcı (Buyer) · 4 dk

**Persona:** `buyer` · **Route:** `/`

1. **Landing hero NL search** — Hero bar'a "Çeşme imarlı" yaz, "Ara" tıkla.
   - AI doğal dil parser chip'lere döker → `/search?city=İzmir&imarli=true`
2. **Search sonuçları + AI özet** — Sol panel listings, sağ panel MapLibre. Üstte AI özet rozeti.
3. **Filter chip kaldır** — Bir chip'e tıklayarak filtre kaldır, sonuçlar yenilenir.
4. **AI ile Daralt sheet** — "Bursa İznik imarlı 5 milyon altı" yaz, AI filtreleri uygula.
5. **Listing detay** — Bir karta tıkla → `/listing/lst_XXXXX`
   - AI Değerleme kartı token-by-token streamed (Sparkles ikon, violet glow)
   - "Yeniden oynat" → replay
   - Sahibe mesaj gönder veya "AI'a Sor" modalı aç
6. **Favorilere ekle** — Kalp ikonuna tıkla, toast görünür, `/dashboard/favorites`'a git → eklendi.

---

## Senaryo B — Emlakçı (Broker · R-04) · 4 dk

**Persona:** `broker-admin` (Karaca Emlak) · **Route:** `/broker`

1. **Broker Ops Overview** — Persona Switcher'dan "Emlakçı" seç. KPI grid + AI Bugün streamed insights + funnel + team komisyon listesi.
2. **Portföy toplu fiyat ayarı** — `/broker/portfolio` → "Toplu -%5" → success toast.
3. **Lead pipeline + atama** — `/broker/leads` → 3-pane, lead seç, "Stage değiştir" → toast.
4. **Müşteri KVKK aksiyonu** — `/broker/clients` → "Veri indir" → toast (D02 DSAR queue'ya simüle).
5. **Komisyon raporu PDF** — `/broker/commissions` → "Vergi raporu (PDF)" toast.
6. **AI Tools** — `/broker/ai-tools` → "Toplu açıklama yeniden yazma" → agent toast.
7. **Public showcase** — `/broker/showcase` → "Vitrini görüntüle" → yeni sekmede `/b/karaca-emlak` (SSG-ready).

---

## Senaryo C — Yönetici (Admin) · 3 dk

**Persona:** `admin` · **Route:** `/admin`

1. **Operations Overview** — 8 KPI grid, anomaly feed, sistem haritası, agent ops snapshot.
2. **Tenants** — `/admin/tenants` → tenant tablosu, "Detay" toast.
3. **PII/DSAR** — `/admin/pii` → field classification, "DSAR İşle" toast.
4. **Audit Forensics** — `/admin/audit` → forensic table, "Hash chain doğrula" → success toast.
5. **SLO posture** — `/admin/slo` → 4 SLO cards + error budget bars (3'ü OK, 1 at-risk).

---

## Senaryo D — Agent / MCP Debugger · 2 dk

**Persona:** `agent` · **Route:** `/agent`

1. **Agent Operations** — 4 KPI, hallucination skoru streamed, live trace feed, cost heatmap.
2. **MCP transports** — `/agent/mcp` → 4 transport (stdio/sse/http/ws), "Test bağlantı" toast.
3. **Tool registry** — `/agent/tools` → tools tablosu LLM-readability bar'ları ile.
4. **Trace explorer** — `/agent/observability` → trace tablosu, "Replay" toast.
5. **Conversations export** — `/agent/conversations` → JSON/MD/PDF butonları.

---

## Senaryo E — Satıcı (Seller) · 2 dk

**Persona:** `seller` · **Route:** `/dashboard`

1. **Dashboard home** — KPI grid + AI Bugün streamed + aktivite akışı.
2. **İlanlarım** — `/dashboard/listings` → tablo, AI öneri butonu → agent toast.
3. **Kişisel AI Asistan** — `/dashboard/ai` → "Çeşme'de yeni ne var?" yaz, AI cevap streamed.
4. **Güvenlik tabs** — `/dashboard/security` → Sessions / Passkeys / Agent Tokens — I03 sergileme.

---

## Bonus: `/design` showcase route · 2 dk

`/design` — Her primitive canlı, her interactive element gerçek tepki üretir:
- Toast butonları (7 ton) → real toasts
- Modal aç (mobile <md → bottom sheet'e route)
- Sheet aç (desktop right edge)
- Tooltip hover (350ms gecikme)
- Dropdown / Tabs / Accordion / Pagination
- TokenStream replay
- Form demo (RHF + zod inline error → submit → success toast)

---

## Sapmalar (PROMPT.md'den)

- **Persona Switcher:** `Ctrl+Shift+P` ile her sayfada açılır, sessionStorage + `?persona=` URL sync.
- **Routing modu:** browser default. Demo build (`pnpm build:demo`) hash mode + `404.html` SPA fallback.
- **Listing seed:** 240 ilan (PROMPT 1500 dedi ama 240 demo için yeterli + bundle küçük).
- **CommandPalette:** Phase 1'de cmdk dep kuruldu ama UI implementation Phase 8 sonrası — Cmd-K placeholder Phase 7'de eklenebilir.
- **Storybook:** SKIP. `/design` IS the catalog.

## Deploy

```bash
pnpm build:demo
# build/client/ → GitHub Pages, S3 static, Netlify, vb.
# Hash routing → tüm derinlemesine link'ler çalışır
```
