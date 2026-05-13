import type { Listing, ListingSearchFilters, ListingSearchResult } from '@/types/listing';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export const listingsKeys = {
  all: ['listings'] as const,
  search: (filters: ListingSearchFilters) => [...listingsKeys.all, 'search', filters] as const,
  featured: () => [...listingsKeys.all, 'featured'] as const,
  detail: (id: string) => [...listingsKeys.all, 'detail', id] as const,
  similar: (id: string) => [...listingsKeys.all, 'similar', id] as const,
  globalStats: () => [...listingsKeys.all, 'stats', 'global'] as const,
};

function toQueryString(filters: ListingSearchFilters): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '' || value === null) continue;
    search.set(key, String(value));
  }
  return search.toString();
}

export function useListings(filters: ListingSearchFilters) {
  const qs = toQueryString(filters);
  return useQuery({
    queryKey: listingsKeys.search(filters),
    queryFn: () => apiFetch<ListingSearchResult>(`/listings${qs ? `?${qs}` : ''}`),
    staleTime: 30_000,
  });
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: listingsKeys.featured(),
    queryFn: () => apiFetch<{ items: Listing[] }>('/listings/featured'),
    staleTime: 60_000,
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: listingsKeys.detail(id ?? ''),
    queryFn: () => apiFetch<Listing>(`/listings/${id}`),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useSimilarListings(id: string | undefined) {
  return useQuery({
    queryKey: listingsKeys.similar(id ?? ''),
    queryFn: () => apiFetch<{ items: Listing[] }>(`/listings/${id}/similar`),
    enabled: Boolean(id),
  });
}

export type GlobalListingStats = {
  total: number;
  activeCount: number;
  verifiedDeedCount: number;
  avgPricePerSqm: number;
  cityCount: number;
};

export function useGlobalListingStats() {
  return useQuery({
    queryKey: listingsKeys.globalStats(),
    queryFn: () => apiFetch<GlobalListingStats>('/listings/stats/global'),
    staleTime: 120_000,
  });
}
