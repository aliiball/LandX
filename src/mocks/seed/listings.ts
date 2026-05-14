import type {
  Listing,
  ListingMedia,
  ListingStatus,
  RoadFrontage,
  TitleDeedType,
  ZoningType,
} from '@/types/listing';
import { fakerTR, initFakerSeed } from './faker-config';
import { CITIES } from './regions';

// Picsum-style stable placeholder image URLs for deterministic gallery.
const PHOTO_POOL = Array.from(
  { length: 60 },
  (_, i) => `https://picsum.photos/seed/arsam-${i + 1}/1200/800`,
);

const ZONING: ReadonlyArray<ZoningType> = [
  'konut',
  'ticari',
  'tarla',
  'sanayi',
  'turizm',
  'karma',
  'zeytinlik',
  'imarsiz',
];
const TITLE_DEED: ReadonlyArray<TitleDeedType> = [
  'mustakil',
  'mustakil',
  'mustakil',
  'hisseli',
  'kat-irtifaki',
  'tapu-tahsis',
];
const ROAD: ReadonlyArray<RoadFrontage> = ['asfalt', 'asfalt', 'stabilize', 'toprak', 'yok'];

const FEATURE_POOL = [
  'Yola Cephe',
  'Manzaralı',
  'İmar Onaylı',
  'Köşe Parsel',
  'Su Kuyusu',
  'Elektrik Yakın',
  'Yatırım Bölgesinde',
  'Tarıma Uygun',
  'Konut Bölgesi',
  'Deniz Yakın',
  'Asfalt Yol',
  'Düşük Eğim',
];

const STATUS_DISTRIBUTION: ReadonlyArray<ListingStatus> = [
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'active',
  'pending',
  'sold',
];

function weightedCity() {
  const total = CITIES.reduce((s, c) => s + c.weight, 0);
  let r = fakerTR.number.int({ min: 0, max: total - 1 });
  for (const c of CITIES) {
    r -= c.weight;
    if (r < 0) return c;
  }
  const fallback = CITIES[0];
  if (!fallback) throw new Error('CITIES empty');
  return fallback;
}

function jitter(value: number, range: number) {
  return value + fakerTR.number.float({ min: -range, max: range, fractionDigits: 4 });
}

function pickN<T>(arr: ReadonlyArray<T>, n: number): T[] {
  const out: T[] = [];
  const seen = new Set<number>();
  while (out.length < n && seen.size < arr.length) {
    const idx = fakerTR.number.int({ min: 0, max: arr.length - 1 });
    if (seen.has(idx)) continue;
    seen.add(idx);
    const item = arr[idx];
    if (item !== undefined) out.push(item);
  }
  return out;
}

function priceForArea(areaSqm: number, zoning: ZoningType, city: string): number {
  const base: Record<ZoningType, number> = {
    konut: 1500,
    ticari: 2400,
    tarla: 350,
    sanayi: 1800,
    turizm: 3200,
    karma: 1100,
    zeytinlik: 420,
    imarsiz: 180,
  };
  const cityMultiplier = ['İstanbul', 'İzmir', 'Antalya', 'Muğla', 'Ankara'].includes(city)
    ? 1.6
    : ['Bursa', 'Aydın', 'Mersin', 'Tekirdağ'].includes(city)
      ? 1.2
      : 0.85;
  const noise = fakerTR.number.float({ min: 0.7, max: 1.4, fractionDigits: 2 });
  return Math.round(areaSqm * base[zoning] * cityMultiplier * noise);
}

let cachedListings: Listing[] | null = null;

export function getListings(): ReadonlyArray<Listing> {
  if (cachedListings) return cachedListings;
  initFakerSeed();

  const total = 240;
  const result: Listing[] = [];

  for (let i = 0; i < total; i += 1) {
    const city = weightedCity();
    const district = city.districts[fakerTR.number.int({ min: 0, max: city.districts.length - 1 })];
    if (!district) continue;

    const zoning = ZONING[i % ZONING.length] as ZoningType;
    const titleDeed = TITLE_DEED[
      fakerTR.number.int({ min: 0, max: TITLE_DEED.length - 1 })
    ] as TitleDeedType;
    const road = ROAD[fakerTR.number.int({ min: 0, max: ROAD.length - 1 })] as RoadFrontage;
    const areaSqm = fakerTR.number.int({ min: 500, max: 25000 });
    const imarli = zoning !== 'tarla' || fakerTR.number.float({ min: 0, max: 1 }) > 0.55;
    const price = priceForArea(areaSqm, zoning, city.name);
    const pricePerSqm = Math.round(price / areaSqm);
    const photoCount = fakerTR.number.int({ min: 3, max: 7 });
    const photoStart = fakerTR.number.int({ min: 0, max: PHOTO_POOL.length - photoCount });
    const media: ListingMedia[] = PHOTO_POOL.slice(photoStart, photoStart + photoCount).map(
      (url, j) => ({
        url,
        alt: `${city.name} ${district} arsa fotoğraf ${j + 1}`,
        type: 'photo',
      }),
    );
    const hasDrone = fakerTR.number.float({ min: 0, max: 1 }) > 0.7;
    if (hasDrone && media[0]) {
      media[0] = { ...media[0], type: 'drone' };
    }
    const hasPanorama = fakerTR.number.float({ min: 0, max: 1 }) > 0.82;
    const verifiedDeed = fakerTR.number.float({ min: 0, max: 1 }) > 0.25;
    const status =
      STATUS_DISTRIBUTION[fakerTR.number.int({ min: 0, max: STATUS_DISTRIBUTION.length - 1 })] ??
      'active';

    const title = `${city.name} ${district} ${areaSqm}m² ${zoningLabel(zoning)} arsa`;
    const description = [
      `${city.name} ${district} bölgesinde ${areaSqm.toLocaleString('tr-TR')} m² ${zoningLabel(
        zoning,
      )} arsa.`,
      imarli ? 'İmar planı kapsamında.' : 'İmarsız ancak imar bölgesine yakın.',
      `${roadLabel(road)} yola cephe.`,
      verifiedDeed ? 'Tapu doğrulanmış.' : 'Tapu doğrulama süreci sürmektedir.',
      `Pazarlanmaya açık. ${fakerTR.lorem.sentence({ min: 8, max: 15 })}`,
    ].join(' ');

    const estimateMin = Math.round(price * 0.86);
    const estimateMax = Math.round(price * 1.15);
    const confidence = fakerTR.number.int({ min: 68, max: 94 });

    const postedDaysAgo = fakerTR.number.int({ min: 1, max: 220 });
    const postedAt = new Date(Date.now() - postedDaysAgo * 24 * 60 * 60 * 1000).toISOString();

    const listing: Listing = {
      id: `lst_${String(i + 1).padStart(5, '0')}`,
      title,
      description,
      status,
      region: { city: city.name, district },
      coord: {
        lat: jitter(city.center.lat, 0.25),
        lng: jitter(city.center.lng, 0.32),
      },
      price,
      pricePerSqm,
      areaSqm,
      zoning,
      titleDeed,
      roadFrontage: road,
      slopePercent: fakerTR.number.int({ min: 0, max: 28 }),
      ada: `${fakerTR.number.int({ min: 100, max: 9999 })}`,
      parsel: `${fakerTR.number.int({ min: 1, max: 999 })}`,
      imarli,
      verifiedDeed,
      hasDrone,
      hasPanorama,
      media,
      features: pickN(FEATURE_POOL, fakerTR.number.int({ min: 3, max: 6 })),
      viewCount: fakerTR.number.int({ min: 12, max: 8500 }),
      favoriteCount: fakerTR.number.int({ min: 0, max: 240 }),
      inquiryCount: fakerTR.number.int({ min: 0, max: 60 }),
      postedAt,
      updatedAt: postedAt,
      sellerId: `usr_seller_${fakerTR.number.int({ min: 1, max: 80 }).toString().padStart(4, '0')}`,
      valuation: {
        estimateMin,
        estimateMax,
        confidence,
        comparableCount: fakerTR.number.int({ min: 4, max: 18 }),
        factors: [
          {
            label: 'Yola cephe',
            impact: road === 'asfalt' ? 12 : road === 'stabilize' ? 4 : -6,
            direction: road === 'asfalt' ? 'positive' : road === 'yok' ? 'negative' : 'neutral',
          },
          {
            label: imarli ? 'İmar onayı' : 'İmar yok',
            impact: imarli ? 18 : -14,
            direction: imarli ? 'positive' : 'negative',
          },
          {
            label: verifiedDeed ? 'Tapu doğrulandı' : 'Tapu beklemede',
            impact: verifiedDeed ? 8 : -10,
            direction: verifiedDeed ? 'positive' : 'negative',
          },
          {
            label: 'Bölge yatırım skoru',
            impact: fakerTR.number.int({ min: -5, max: 15 }),
            direction: 'positive',
          },
        ],
      },
    };

    result.push(listing);
  }

  cachedListings = result;
  return result;
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

function zoningLabel(z: ZoningType): string {
  const labels: Record<ZoningType, string> = {
    konut: 'konut',
    ticari: 'ticari',
    tarla: 'tarla',
    sanayi: 'sanayi',
    turizm: 'turizm',
    karma: 'karma',
    zeytinlik: 'zeytinlik',
    imarsiz: 'imarsız',
  };
  return labels[z];
}

function roadLabel(r: RoadFrontage): string {
  return {
    asfalt: 'Asfalt',
    stabilize: 'Stabilize',
    toprak: 'Toprak',
    yok: 'Cepheli olmayan',
  }[r];
}
