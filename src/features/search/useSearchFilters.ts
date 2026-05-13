import type { ListingSearchFilters, ZoningType } from '@/types/listing';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const NUMERIC_KEYS: ReadonlyArray<keyof ListingSearchFilters> = [
  'priceMin',
  'priceMax',
  'areaMin',
  'areaMax',
  'page',
];

function parseFilters(params: URLSearchParams): ListingSearchFilters {
  const get = (k: string) => params.get(k) ?? undefined;
  const out: ListingSearchFilters = {};
  const q = get('q');
  if (q) out.q = q;
  const city = get('city');
  if (city) out.city = city;
  const district = get('district');
  if (district) out.district = district;
  const zoning = get('zoning');
  if (zoning) out.zoning = zoning as ZoningType;
  const titleDeed = get('titleDeed');
  if (titleDeed) out.titleDeed = titleDeed as ListingSearchFilters['titleDeed'];
  const imarli = get('imarli');
  if (imarli === 'true') out.imarli = true;
  else if (imarli === 'false') out.imarli = false;
  for (const k of NUMERIC_KEYS) {
    const v = get(k);
    if (v && !Number.isNaN(Number(v))) (out as Record<string, unknown>)[k] = Number(v);
  }
  const sort = get('sort');
  if (sort) out.sort = sort as ListingSearchFilters['sort'];
  return out;
}

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const update = useCallback(
    (patch: Partial<ListingSearchFilters>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === undefined || v === null || v === '') {
              next.delete(k);
            } else {
              next.set(k, String(v));
            }
          }
          // Resetting filters returns to page 1 unless page is explicitly set.
          if (!('page' in patch)) next.delete('page');
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return { filters, update, reset };
}
