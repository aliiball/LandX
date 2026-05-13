// Türkiye region taxonomy with population bias for deterministic mock distribution.
// Marmara 35%, Ege 25%, Akdeniz 15%, İç Anadolu 12%, Karadeniz 8%, Doğu/GD 5%.

export type CityEntry = {
  name: string;
  region: string;
  districts: ReadonlyArray<string>;
  /** Rough lat/lng center for map seeding. */
  center: { lat: number; lng: number };
  /** Bias weight for random distribution. */
  weight: number;
};

export const CITIES: ReadonlyArray<CityEntry> = [
  // Marmara
  {
    name: 'İstanbul',
    region: 'Marmara',
    districts: ['Beykoz', 'Sancaktepe', 'Pendik', 'Tuzla', 'Silivri', 'Çatalca', 'Şile'],
    center: { lat: 41.0082, lng: 28.9784 },
    weight: 14,
  },
  {
    name: 'Bursa',
    region: 'Marmara',
    districts: ['Mudanya', 'Gemlik', 'İznik', 'Orhangazi', 'Karacabey', 'Kestel', 'Nilüfer'],
    center: { lat: 40.1828, lng: 29.0667 },
    weight: 9,
  },
  {
    name: 'Kocaeli',
    region: 'Marmara',
    districts: ['Gebze', 'İzmit', 'Körfez', 'Karamürsel', 'Kandıra'],
    center: { lat: 40.7654, lng: 29.9408 },
    weight: 5,
  },
  {
    name: 'Tekirdağ',
    region: 'Marmara',
    districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Marmara Ereğlisi', 'Saray'],
    center: { lat: 40.978, lng: 27.5114 },
    weight: 4,
  },
  {
    name: 'Balıkesir',
    region: 'Marmara',
    districts: ['Edremit', 'Ayvalık', 'Burhaniye', 'Erdek', 'Bandırma'],
    center: { lat: 39.6484, lng: 27.8826 },
    weight: 3,
  },

  // Ege
  {
    name: 'İzmir',
    region: 'Ege',
    districts: ['Çeşme', 'Urla', 'Seferihisar', 'Karaburun', 'Foça', 'Dikili', 'Bergama'],
    center: { lat: 38.4192, lng: 27.1287 },
    weight: 10,
  },
  {
    name: 'Aydın',
    region: 'Ege',
    districts: ['Didim', 'Kuşadası', 'Söke', 'Çine', 'Bozdoğan'],
    center: { lat: 37.856, lng: 27.8416 },
    weight: 5,
  },
  {
    name: 'Muğla',
    region: 'Ege',
    districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Datça', 'Köyceğiz', 'Milas'],
    center: { lat: 37.2153, lng: 28.3636 },
    weight: 7,
  },
  {
    name: 'Manisa',
    region: 'Ege',
    districts: ['Akhisar', 'Salihli', 'Soma', 'Turgutlu', 'Alaşehir'],
    center: { lat: 38.6191, lng: 27.4289 },
    weight: 3,
  },

  // Akdeniz
  {
    name: 'Antalya',
    region: 'Akdeniz',
    districts: ['Kaş', 'Kalkan', 'Manavgat', 'Side', 'Serik', 'Kemer', 'Alanya', 'Demre'],
    center: { lat: 36.8841, lng: 30.7056 },
    weight: 9,
  },
  {
    name: 'Mersin',
    region: 'Akdeniz',
    districts: ['Erdemli', 'Silifke', 'Tarsus', 'Anamur', 'Bozyazı'],
    center: { lat: 36.812, lng: 34.6415 },
    weight: 4,
  },
  {
    name: 'Hatay',
    region: 'Akdeniz',
    districts: ['Samandağ', 'Arsuz', 'İskenderun', 'Belen'],
    center: { lat: 36.2025, lng: 36.1606 },
    weight: 2,
  },

  // İç Anadolu
  {
    name: 'Ankara',
    region: 'İç Anadolu',
    districts: ['Çubuk', 'Beypazarı', 'Polatlı', 'Haymana', 'Kızılcahamam', 'Akyurt'],
    center: { lat: 39.9334, lng: 32.8597 },
    weight: 7,
  },
  {
    name: 'Konya',
    region: 'İç Anadolu',
    districts: ['Beyşehir', 'Akşehir', 'Çumra', 'Karatay', 'Selçuklu'],
    center: { lat: 37.8746, lng: 32.4932 },
    weight: 3,
  },
  {
    name: 'Eskişehir',
    region: 'İç Anadolu',
    districts: ['Tepebaşı', 'Odunpazarı', 'Çifteler', 'Sivrihisar'],
    center: { lat: 39.7767, lng: 30.5206 },
    weight: 2,
  },

  // Karadeniz
  {
    name: 'Sakarya',
    region: 'Karadeniz',
    districts: ['Akyazı', 'Geyve', 'Pamukova', 'Karasu', 'Sapanca'],
    center: { lat: 40.7889, lng: 30.4068 },
    weight: 2,
  },
  {
    name: 'Bolu',
    region: 'Karadeniz',
    districts: ['Mengen', 'Gerede', 'Mudurnu', 'Göynük'],
    center: { lat: 40.7349, lng: 31.6064 },
    weight: 2,
  },
  {
    name: 'Trabzon',
    region: 'Karadeniz',
    districts: ['Akçaabat', 'Of', 'Çaykara', 'Maçka'],
    center: { lat: 41.0027, lng: 39.7168 },
    weight: 2,
  },
  {
    name: 'Sinop',
    region: 'Karadeniz',
    districts: ['Gerze', 'Türkeli', 'Ayancık'],
    center: { lat: 42.026, lng: 35.1531 },
    weight: 1,
  },

  // Doğu / Güneydoğu
  {
    name: 'Erzurum',
    region: 'Doğu Anadolu',
    districts: ['Aziziye', 'Yakutiye', 'Palandöken'],
    center: { lat: 39.9043, lng: 41.2679 },
    weight: 1,
  },
  {
    name: 'Gaziantep',
    region: 'Güneydoğu Anadolu',
    districts: ['Şahinbey', 'Şehitkamil', 'Nizip'],
    center: { lat: 37.0662, lng: 37.3833 },
    weight: 2,
  },
];

export const REGIONS = [
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
] as const;

export type TurkeyRegion = (typeof REGIONS)[number];
