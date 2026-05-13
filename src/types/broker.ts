export type BrokerSubtype = 'broker' | 'broker-admin' | 'broker-agent';

export type LeadStage = 'new' | 'interested' | 'negotiating' | 'agreed' | 'closed' | 'lost';
export type LeadHeat = 'hot' | 'warm' | 'cold';

export type Lead = {
  id: string;
  listingId: string;
  clientName: string;
  clientPhone: string;
  source: 'site' | 'whatsapp' | 'agent' | 'referral';
  stage: LeadStage;
  heat: LeadHeat;
  assignedAgentId?: string;
  estimatedValue: number;
  nextAction: string;
  slaDueAt: string;
  createdAt: string;
  notes: string;
};

export type Client = {
  id: string;
  fullName: string;
  type: 'buyer' | 'seller' | 'both';
  email: string;
  phone: string;
  activeLeadCount: number;
  lastContactAt: string;
  totalCommission: number;
  kvkkConsentAt: string;
  notes: string;
};

export type Commission = {
  id: string;
  date: string;
  listingId: string;
  clientId: string;
  salePrice: number;
  commissionPercent: number;
  netAmount: number;
  status: 'pending' | 'received' | 'refunded';
  payee: string;
};

export type BrokerTeamMember = {
  id: string;
  name: string;
  role: BrokerSubtype;
  email: string;
  assignedLeadCount: number;
  monthlyCommission: number;
  joinedAt: string;
};

export type BrokerShowcase = {
  slug: string;
  officeName: string;
  brandColor: string;
  logoInitial: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  featuredListingIds: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  stats: {
    visitsLast30d: number;
    leadConversion: number;
    avgResponseHours: number;
  };
};
