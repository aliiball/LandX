import { getListingById, getListings } from '@/mocks/seed/listings';
import type { ListingSearchResult, ZoningType } from '@/types/listing';
import { http, HttpResponse, delay } from 'msw';

const PAGE_SIZE = 12;

export const listingHandlers = [
  http.get('/api/listings', async ({ request }) => {
    await delay(120 + Math.floor(Math.random() * 220));
    const url = new URL(request.url);
    const params = url.searchParams;
    const q = params.get('q')?.toLowerCase().trim() ?? '';
    const city = params.get('city') ?? undefined;
    const district = params.get('district') ?? undefined;
    const zoning = (params.get('zoning') as ZoningType | null) ?? undefined;
    const titleDeed = params.get('titleDeed') ?? undefined;
    const imarliParam = params.get('imarli');
    const imarli = imarliParam === 'true' ? true : imarliParam === 'false' ? false : undefined;
    const priceMin = Number(params.get('priceMin')) || undefined;
    const priceMax = Number(params.get('priceMax')) || undefined;
    const areaMin = Number(params.get('areaMin')) || undefined;
    const areaMax = Number(params.get('areaMax')) || undefined;
    const sort =
      (params.get('sort') as ListingSearchResult['items'][number] extends never
        ? never
        : 'newest' | 'priceAsc' | 'priceDesc' | 'areaAsc' | 'areaDesc' | 'valuation') ?? 'newest';
    const page = Math.max(1, Number(params.get('page')) || 1);

    let items = getListings().slice();

    if (q) {
      items = items.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.region.city.toLowerCase().includes(q) ||
          l.region.district.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    if (city) items = items.filter((l) => l.region.city === city);
    if (district) items = items.filter((l) => l.region.district === district);
    if (zoning) items = items.filter((l) => l.zoning === zoning);
    if (titleDeed) items = items.filter((l) => l.titleDeed === titleDeed);
    if (imarli !== undefined) items = items.filter((l) => l.imarli === imarli);
    if (priceMin !== undefined) items = items.filter((l) => l.price >= priceMin);
    if (priceMax !== undefined) items = items.filter((l) => l.price <= priceMax);
    if (areaMin !== undefined) items = items.filter((l) => l.areaSqm >= areaMin);
    if (areaMax !== undefined) items = items.filter((l) => l.areaSqm <= areaMax);

    items.sort((a, b) => {
      switch (sort) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'areaAsc':
          return a.areaSqm - b.areaSqm;
        case 'areaDesc':
          return b.areaSqm - a.areaSqm;
        case 'valuation':
          return b.valuation.confidence - a.valuation.confidence;
        default:
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      }
    });

    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const paged = items.slice(start, start + PAGE_SIZE);

    const cityFacet = new Map<string, number>();
    const zoningFacet = new Map<string, number>();
    for (const l of items) {
      cityFacet.set(l.region.city, (cityFacet.get(l.region.city) ?? 0) + 1);
      zoningFacet.set(l.zoning, (zoningFacet.get(l.zoning) ?? 0) + 1);
    }

    const avgPricePerSqm =
      items.length > 0
        ? Math.round(items.reduce((s, l) => s + l.pricePerSqm, 0) / items.length)
        : 0;
    const topCity = [...cityFacet.entries()].sort((a, b) => b[1] - a[1])[0];

    const aiSummary =
      total > 0
        ? `${total} sonuç bulundu. Ortalama ${avgPricePerSqm.toLocaleString('tr-TR')} ₺/m². ${topCity ? `En çok ilan ${topCity[0]} bölgesinde (${topCity[1]} ilan).` : ''}`
        : 'Filtrelerinize uyan ilan bulunamadı. Kriterleri biraz gevşetmeyi deneyin.';

    const result: ListingSearchResult = {
      items: paged,
      total,
      page,
      pageSize: PAGE_SIZE,
      pageCount,
      facets: {
        cities: [...cityFacet.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count })),
        zoning: [...zoningFacet.entries()].map(([value, count]) => ({
          value: value as ZoningType,
          count,
        })),
      },
      aiSummary,
    };

    return HttpResponse.json(result);
  }),

  http.get('/api/listings/featured', async () => {
    await delay(80);
    const items = getListings()
      .filter((l) => l.status === 'active')
      .slice(0, 8);
    return HttpResponse.json({ items });
  }),

  http.get('/api/listings/:id', async ({ params }) => {
    await delay(120);
    const id = String(params.id);
    const listing = getListingById(id);
    if (!listing) {
      return HttpResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return HttpResponse.json(listing);
  }),

  http.get('/api/listings/:id/similar', async ({ params }) => {
    await delay(150);
    const id = String(params.id);
    const ref = getListingById(id);
    if (!ref) return HttpResponse.json({ items: [] });
    const items = getListings()
      .filter((l) => l.id !== id && l.region.city === ref.region.city && l.status === 'active')
      .slice(0, 6);
    return HttpResponse.json({ items });
  }),

  http.get('/api/listings/stats/global', async () => {
    await delay(100);
    const items = getListings();
    return HttpResponse.json({
      total: items.length,
      activeCount: items.filter((l) => l.status === 'active').length,
      verifiedDeedCount: items.filter((l) => l.verifiedDeed).length,
      avgPricePerSqm:
        items.length > 0
          ? Math.round(items.reduce((s, l) => s + l.pricePerSqm, 0) / items.length)
          : 0,
      cityCount: new Set(items.map((l) => l.region.city)).size,
    });
  }),
];
