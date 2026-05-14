// TKGM (Tapu ve Kadastro Genel Müdürlüğü) mock API contract.
// Status codes:
//   OK   — başarılı sorgu
//   E001 — geçersiz ada/parsel
//   E002 — TKGM API geçici hata (504 / timeout)
//   E003 — yetkisiz sorgu (rate-limit / IP blok)
//   E099 — bilinmeyen hata

export type TkgmStatusCode = 'OK' | 'E001' | 'E002' | 'E003' | 'E099';

export type TkgmQuery = {
  id: string;
  ts: string;
  principal: string;
  il: string;
  ilce: string;
  ada: string;
  parsel: string;
  pafta?: string;
  status: TkgmStatusCode;
  latencyMs: number;
  result?: {
    yuzolcumu: number;
    nitelik: string;
    malSahipleri: Array<{ adSoyad: string; hisseOran: number }>;
    serh?: string[];
    tedbir?: string[];
    ipotek?: Array<{ alacakli: string; tutar: number; tarih: string }>;
  };
  errorMessage?: string;
};

export type TkgmBulkResult = {
  total: number;
  ok: number;
  failed: number;
  byCode: Record<TkgmStatusCode, number>;
  items: TkgmQuery[];
};
