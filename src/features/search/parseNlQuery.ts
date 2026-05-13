import { CITIES } from '@/mocks/seed/regions';
import type { ListingSearchFilters, ZoningType } from '@/types/listing';

type ParseResult = {
  filters: ListingSearchFilters;
  chips: ReadonlyArray<{ label: string; key: keyof ListingSearchFilters; value: string }>;
  confidence: number;
};

const ZONING_KEYWORDS: ReadonlyArray<{ patterns: RegExp[]; value: ZoningType; label: string }> = [
  { patterns: [/konut/i], value: 'konut', label: 'Konut' },
  { patterns: [/ticari/i, /ticaret/i], value: 'ticari', label: 'Ticari' },
  { patterns: [/tarla/i, /tarım/i, /tarim/i], value: 'tarla', label: 'Tarla' },
  { patterns: [/sanayi/i, /endüstri/i], value: 'sanayi', label: 'Sanayi' },
  { patterns: [/turizm/i, /tatil/i, /otel/i], value: 'turizm', label: 'Turizm' },
];

/**
 * Lightweight mock NL parser — converts free-form Turkish into filter chips.
 * Real implementation would call S06/A02 tools.
 */
export function parseNlQuery(input: string): ParseResult {
  const filters: ListingSearchFilters = {};
  const chips: Array<{ label: string; key: keyof ListingSearchFilters; value: string }> = [];
  let hits = 0;
  const text = input.toLowerCase();

  for (const city of CITIES) {
    const cityRegex = new RegExp(`\\b${city.name.toLowerCase()}\\b`, 'i');
    if (cityRegex.test(text)) {
      filters.city = city.name;
      chips.push({ label: `Şehir: ${city.name}`, key: 'city', value: city.name });
      hits += 1;
      break;
    }
    for (const district of city.districts) {
      const dRegex = new RegExp(`\\b${district.toLowerCase()}\\b`, 'i');
      if (dRegex.test(text)) {
        filters.city = city.name;
        filters.district = district;
        chips.push({ label: `Şehir: ${city.name}`, key: 'city', value: city.name });
        chips.push({ label: `İlçe: ${district}`, key: 'district', value: district });
        hits += 2;
        break;
      }
    }
    if (filters.city) break;
  }

  for (const z of ZONING_KEYWORDS) {
    if (z.patterns.some((p) => p.test(text))) {
      filters.zoning = z.value;
      chips.push({ label: `Tür: ${z.label}`, key: 'zoning', value: z.value });
      hits += 1;
      break;
    }
  }

  if (/imar/i.test(text) || /imarlı/i.test(text)) {
    filters.imarli = true;
    chips.push({ label: 'İmar onaylı', key: 'imarli', value: 'true' });
    hits += 1;
  }

  const donumMatch = text.match(/(\d+)\s*(dönüm|donum)/);
  if (donumMatch?.[1]) {
    const donum = Number(donumMatch[1]);
    if (!Number.isNaN(donum)) {
      filters.areaMin = donum * 1000;
      chips.push({ label: `Min ${donum} dönüm`, key: 'areaMin', value: String(donum * 1000) });
      hits += 1;
    }
  }

  const priceMatch = text.match(/(\d+)\s*(milyon|m)\s*(₺|tl)?/);
  if (priceMatch?.[1]) {
    const milyon = Number(priceMatch[1]);
    if (!Number.isNaN(milyon)) {
      filters.priceMax = milyon * 1_000_000;
      chips.push({ label: `Max ${milyon}M ₺`, key: 'priceMax', value: String(milyon * 1_000_000) });
      hits += 1;
    }
  }

  const tokens = text.split(/\s+/).filter(Boolean).length;
  const confidence = Math.min(1, hits / Math.max(2, tokens / 3));

  if (chips.length === 0 && text.trim().length > 0) {
    filters.q = input.trim();
    chips.push({ label: `Arama: "${input.trim()}"`, key: 'q', value: input.trim() });
  }

  return { filters, chips, confidence };
}
