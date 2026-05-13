// Listing domain types — used across search, detail, map, compare.

export type ListingStatus = 'active' | 'pending' | 'sold' | 'paused';
export type ZoningType = 'konut' | 'ticari' | 'tarla' | 'sanayi' | 'turizm' | 'karma';
export type TitleDeedType = 'mustakil' | 'hisseli' | 'kat-irtifaki' | 'tapu-tahsis' | 'yok';
export type RoadFrontage = 'asfalt' | 'stabilize' | 'toprak' | 'yok';

export type Region = {
  city: string;
  district: string;
  neighborhood?: string;
};

export type Coord = {
  lat: number;
  lng: number;
};

export type ListingMedia = {
  url: string;
  alt: string;
  type: 'photo' | 'drone' | 'panorama';
};

export type ValuationFactor = {
  label: string;
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
};

export type ListingValuation = {
  estimateMin: number;
  estimateMax: number;
  confidence: number;
  comparableCount: number;
  factors: ValuationFactor[];
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  status: ListingStatus;
  region: Region;
  coord: Coord;
  price: number;
  pricePerSqm: number;
  areaSqm: number;
  zoning: ZoningType;
  titleDeed: TitleDeedType;
  roadFrontage: RoadFrontage;
  slopePercent: number;
  ada?: string;
  parsel?: string;
  imarli: boolean;
  verifiedDeed: boolean;
  hasDrone: boolean;
  hasPanorama: boolean;
  media: ListingMedia[];
  features: string[];
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  postedAt: string;
  updatedAt: string;
  sellerId: string;
  brokerId?: string;
  valuation: ListingValuation;
};

export type ListingSearchFilters = {
  q?: string;
  city?: string;
  district?: string;
  zoning?: ZoningType;
  titleDeed?: TitleDeedType;
  imarli?: boolean;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  sort?: 'newest' | 'priceAsc' | 'priceDesc' | 'areaAsc' | 'areaDesc' | 'valuation';
  page?: number;
};

export type ListingSearchResult = {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facets: {
    cities: Array<{ name: string; count: number }>;
    zoning: Array<{ value: ZoningType; count: number }>;
  };
  aiSummary?: string;
};
