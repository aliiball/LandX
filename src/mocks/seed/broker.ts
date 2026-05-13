import type {
  BrokerShowcase,
  BrokerTeamMember,
  Client,
  Commission,
  Lead,
  LeadHeat,
  LeadStage,
} from '@/types/broker';
import { fakerTR, initFakerSeed } from './faker-config';
import { getListings } from './listings';

const STAGES: ReadonlyArray<LeadStage> = [
  'new',
  'interested',
  'negotiating',
  'agreed',
  'closed',
  'lost',
];
const HEATS: ReadonlyArray<LeadHeat> = ['hot', 'warm', 'cold'];

let _leads: Lead[] | null = null;
let _clients: Client[] | null = null;
let _commissions: Commission[] | null = null;
let _team: BrokerTeamMember[] | null = null;
let _showcase: BrokerShowcase | null = null;

function build() {
  initFakerSeed();
  const listings = getListings();

  _team = [
    {
      id: 'agt_001',
      name: 'Karaca İsmail',
      role: 'broker-admin',
      email: 'karaca@karacaemlak.tr',
      assignedLeadCount: 0,
      monthlyCommission: 280_000,
      joinedAt: '2024-01-15',
    },
    {
      id: 'agt_002',
      name: 'Demir Selin',
      role: 'broker-agent',
      email: 'selin@karacaemlak.tr',
      assignedLeadCount: 18,
      monthlyCommission: 92_000,
      joinedAt: '2024-06-01',
    },
    {
      id: 'agt_003',
      name: 'Yılmaz Can',
      role: 'broker-agent',
      email: 'can@karacaemlak.tr',
      assignedLeadCount: 12,
      monthlyCommission: 64_000,
      joinedAt: '2024-09-20',
    },
    {
      id: 'agt_004',
      name: 'Kara Ayşe',
      role: 'broker-agent',
      email: 'ayse@karacaemlak.tr',
      assignedLeadCount: 9,
      monthlyCommission: 48_000,
      joinedAt: '2025-02-10',
    },
  ];

  _clients = Array.from({ length: 18 }, (_, i) => ({
    id: `cli_${String(i + 1).padStart(4, '0')}`,
    fullName: fakerTR.person.fullName(),
    type: (['buyer', 'seller', 'both'] as const)[i % 3] as 'buyer',
    email: fakerTR.internet.email().toLowerCase(),
    phone: `+90 5${fakerTR.number.int({ min: 30, max: 59 })} ${fakerTR.number.int({ min: 100, max: 999 })} ${fakerTR.number.int({ min: 1000, max: 9999 })}`,
    activeLeadCount: fakerTR.number.int({ min: 0, max: 4 }),
    lastContactAt: new Date(
      Date.now() - fakerTR.number.int({ min: 3600_000, max: 30 * 86400_000 }),
    ).toISOString(),
    totalCommission: fakerTR.number.int({ min: 0, max: 320_000 }),
    kvkkConsentAt: new Date(
      Date.now() - fakerTR.number.int({ min: 86400_000, max: 60 * 86400_000 }),
    ).toISOString(),
    notes: fakerTR.lorem.sentence(),
  }));

  _leads = Array.from({ length: 28 }, (_, i) => {
    const listing = listings[i % listings.length];
    if (!listing) {
      throw new Error('listings empty');
    }
    const client = _clients?.[i % (_clients?.length ?? 1)];
    const team = _team ?? [];
    const agent = team[1 + (i % 3)];
    return {
      id: `lead_${String(i + 1).padStart(4, '0')}`,
      listingId: listing.id,
      clientName: client?.fullName ?? 'Bilinmeyen',
      clientPhone: client?.phone ?? '',
      source: (['site', 'whatsapp', 'agent', 'referral'] as const)[i % 4] as 'site',
      stage: STAGES[i % STAGES.length] as LeadStage,
      heat: HEATS[i % HEATS.length] as LeadHeat,
      assignedAgentId: agent?.id,
      estimatedValue: listing.price,
      nextAction:
        ['Geri ara', 'Mesaj at', 'Sahaya götür', 'Teklif sun', 'Sözleşme'][i % 5] ?? 'Geri ara',
      slaDueAt: new Date(
        Date.now() + fakerTR.number.int({ min: -86400_000, max: 5 * 86400_000 }),
      ).toISOString(),
      createdAt: new Date(
        Date.now() - fakerTR.number.int({ min: 3600_000, max: 30 * 86400_000 }),
      ).toISOString(),
      notes: fakerTR.lorem.sentence(),
    } satisfies Lead;
  });

  _commissions = Array.from({ length: 16 }, (_, i) => {
    const listing = listings[(i * 7) % listings.length];
    const client = _clients?.[(i * 3) % (_clients?.length ?? 1)];
    const salePrice = listing?.price ?? 1_000_000;
    const percent = 2 + (i % 3) * 0.5;
    return {
      id: `com_${String(i + 1).padStart(4, '0')}`,
      date: new Date(Date.now() - i * 12 * 86400_000).toISOString(),
      listingId: listing?.id ?? '',
      clientId: client?.id ?? '',
      salePrice,
      commissionPercent: percent,
      netAmount: Math.round((salePrice * percent) / 100),
      status: (['received', 'received', 'pending', 'refunded'] as const)[i % 4] as 'received',
      payee: (_team ?? [])[1 + (i % 3)]?.name ?? 'Karaca İsmail',
    } satisfies Commission;
  });

  _showcase = {
    slug: 'karaca-emlak',
    officeName: 'Karaca Emlak',
    brandColor: 'oklch(0.82 0.16 75)',
    logoInitial: 'K',
    bio: 'Karacabey, Bursa ve Marmara bölgesinde 12 yıllık arsa tecrübesi. Yatırım odaklı portföy yönetimi.',
    specialties: ['Bursa', 'Karacabey', 'İznik', 'Tarla', 'Konut imarlı'],
    certifications: ['Lisanslı emlakçı', 'KVKK uyum', 'AI-doğrulu portföy'],
    featuredListingIds: listings.slice(0, 6).map((l) => l.id),
    contact: {
      phone: '+90 850 100 00 00',
      email: 'info@karacaemlak.tr',
      address: 'Bursa Karacabey Cumhuriyet Cad. No:12',
    },
    stats: {
      visitsLast30d: 2840,
      leadConversion: 18,
      avgResponseHours: 2.4,
    },
  };
}

export function getBrokerTeam(): ReadonlyArray<BrokerTeamMember> {
  if (!_team) build();
  return _team ?? [];
}
export function getBrokerClients(): ReadonlyArray<Client> {
  if (!_clients) build();
  return _clients ?? [];
}
export function getBrokerLeads(): ReadonlyArray<Lead> {
  if (!_leads) build();
  return _leads ?? [];
}
export function getBrokerCommissions(): ReadonlyArray<Commission> {
  if (!_commissions) build();
  return _commissions ?? [];
}
export function getBrokerShowcase(): BrokerShowcase {
  if (!_showcase) build();
  if (!_showcase) throw new Error('showcase not built');
  return _showcase;
}
