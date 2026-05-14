// Admin / platform mock seed — deterministic (faker seed 20260513).
// Generators: tenants, audit (500 + hash chain), eca rules (24), pii fields (14),
// dsar requests (5), compliance controls (13), SLOs (7), feature flags (12),
// config (10), api endpoints (20), modules (33), workflows (3), users (60),
// plugins (8), security findings (6), pending actions (6).

import type {
  ApiEndpoint,
  ComplianceControl,
  CompliancePosture,
  ConfigEntry,
  DocType,
  DsarRequest,
  EcaEvent,
  EcaRule,
  FeatureFlag,
  LogEntry,
  ModuleEntry,
  PendingAction,
  PiiField,
  Plugin,
  RiskEvent,
  SecurityFinding,
  Slo,
  Tenant,
  Trace,
  UserMfa,
  Workflow,
} from '@/types/admin';
import type { AuditChainStatus, AuditEvent, AuditSeverity } from '@/types/audit';
import type { TkgmQuery, TkgmStatusCode } from '@/types/tkgm';
import { fakerTR, initFakerSeed } from './faker-config';

// --- Helpers ---

function pick<T>(arr: ReadonlyArray<T>): T {
  const idx = fakerTR.number.int({ min: 0, max: arr.length - 1 });
  const item = arr[idx];
  if (item === undefined) throw new Error('pick: empty array');
  return item;
}

function pickWithProb<T>(items: ReadonlyArray<readonly [T, number]>): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = fakerTR.number.float({ min: 0, max: total });
  for (const [v, w] of items) {
    r -= w;
    if (r <= 0) return v;
  }
  const fallback = items[0];
  if (!fallback) throw new Error('pickWithProb: empty');
  return fallback[0];
}

function daysAgo(d: number) {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

function pseudoHash(s: string): string {
  // Deterministic non-crypto hash for chain demo. Hex-like 16-char fingerprint.
  let h = 0xcafe_beef;
  for (let i = 0; i < s.length; i += 1) {
    h = (h ^ s.charCodeAt(i)) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + ((h * 2654435769) >>> 0).toString(16).padStart(8, '0');
}

// --- Tenants (I01) ---

let cachedTenants: Tenant[] | null = null;
export function getTenants(): ReadonlyArray<Tenant> {
  if (cachedTenants) return cachedTenants;
  initFakerSeed();
  cachedTenants = [
    {
      id: 'ten_demo',
      slug: 'demo',
      name: 'LandX Demo',
      plan: 'demo',
      status: 'active',
      createdAt: daysAgo(120),
      usage: { listings: 12, users: 4, storageGb: 0.4, monthlyApiCalls: 1200 },
      quota: { listings: 50, users: 10, storageGb: 1, monthlyApiCalls: 5000 },
      contact: { name: 'Demo Owner', email: 'demo@arsam.net' },
    },
    {
      id: 'ten_kiyi',
      slug: 'kiyi-emlak',
      name: 'Kıyı Emlak Grubu',
      plan: 'pro',
      status: 'active',
      createdAt: daysAgo(96),
      usage: { listings: 184, users: 12, storageGb: 8.4, monthlyApiCalls: 124_800 },
      quota: { listings: 500, users: 25, storageGb: 25, monthlyApiCalls: 250_000 },
      contact: { name: 'Mert Kıyı', email: 'mert@kiyiemlak.tr' },
    },
    {
      id: 'ten_karaca',
      slug: 'karaca-emlak',
      name: 'Karaca Emlak',
      plan: 'pro',
      status: 'active',
      createdAt: daysAgo(60),
      usage: { listings: 220, users: 18, storageGb: 12.1, monthlyApiCalls: 96_000 },
      quota: { listings: 500, users: 25, storageGb: 25, monthlyApiCalls: 250_000 },
      contact: { name: 'Karaca İsmail', email: 'ismail@karaca.com.tr' },
    },
    {
      id: 'ten_anadolu',
      slug: 'anadolu-yatirim',
      name: 'Anadolu Yatırım',
      plan: 'enterprise',
      status: 'active',
      createdAt: daysAgo(220),
      usage: { listings: 1480, users: 64, storageGb: 42.8, monthlyApiCalls: 1_280_000 },
      quota: { listings: 5000, users: 200, storageGb: 200, monthlyApiCalls: 5_000_000 },
      contact: { name: 'Ayşe Anadolu', email: 'ayse@anadoluyatirim.tr' },
    },
    {
      id: 'ten_provis',
      slug: 'aegean-pro',
      name: 'Aegean Pro (provisioning)',
      plan: 'starter',
      status: 'provisioning',
      createdAt: daysAgo(2),
      usage: { listings: 0, users: 1, storageGb: 0, monthlyApiCalls: 0 },
      quota: { listings: 150, users: 5, storageGb: 5, monthlyApiCalls: 25_000 },
      contact: { name: 'Ege Ege', email: 'ege@aegeanpro.tr' },
    },
    {
      id: 'ten_suspended',
      slug: 'old-firm',
      name: 'Eski Firma (askıda)',
      plan: 'starter',
      status: 'suspended',
      createdAt: daysAgo(400),
      usage: { listings: 4, users: 1, storageGb: 0.1, monthlyApiCalls: 12 },
      quota: { listings: 150, users: 5, storageGb: 5, monthlyApiCalls: 25_000 },
      contact: { name: 'Suspended Admin', email: 'admin@oldfirm.tr' },
    },
  ];
  return cachedTenants;
}

// --- Audit (D01) — 500 events with hash chain ---

let cachedAudit: AuditEvent[] | null = null;
export function getAuditEvents(): ReadonlyArray<AuditEvent> {
  if (cachedAudit) return cachedAudit;
  initFakerSeed();
  const events: AuditEvent[] = [];
  const tenants = ['landx-tr', 'karaca-emlak', 'kiyi-emlak', 'anadolu-yatirim'];
  const actions = [
    'listing.create',
    'listing.update',
    'listing.delete',
    'listing.publish',
    'listing.approve',
    'offer.submit',
    'offer.accept',
    'offer.reject',
    'user.login',
    'user.logout',
    'user.create',
    'user.suspend',
    'user.impersonate',
    'role.update',
    'plugin.install',
    'plugin.enable',
    'plugin.disable',
    'eca.fire',
    'eca.skip',
    'tkgm.query',
    'tkgm.bulk',
    'pii.access',
    'pii.export',
    'dsar.open',
    'dsar.fulfill',
    'workflow.transition',
    'flag.toggle',
    'flag.rollout',
    'agent.tool_call',
    'agent.run.start',
    'agent.run.finalize',
    'mcp.client.connect',
    'mcp.tool.invoke',
    'config.update',
    'secret.read',
    'audit.verify',
  ];
  const principals = [
    { type: 'individual', id: 'usr_ali', label: 'Ali Demir' },
    { type: 'individual', id: 'usr_selin', label: 'Selin Demir' },
    { type: 'individual', id: 'usr_admin', label: 'Platform Admin' },
    { type: 'agent', id: 'agt_valuation', label: 'agent:valuation-bot' },
    { type: 'agent', id: 'agt_search', label: 'agent:search-bot' },
    { type: 'agent', id: 'agt_router', label: 'agent:opus-4.7-router' },
    { type: 'system', id: 'sys_migration', label: 'system:migration-svc' },
    { type: 'system', id: 'sys_eca', label: 'system:eca-runner' },
    { type: 'service', id: 'svc_tkgm', label: 'service:tkgm-gateway' },
  ] as const;
  let prevHash = '00000000feedface';
  for (let i = 0; i < 500; i += 1) {
    const principal = pick(principals);
    const action = pick(actions);
    const sev: AuditSeverity = action.startsWith('user.impersonate')
      ? 'critical'
      : action.endsWith('.delete') || action.includes('pii.export') || action.includes('secret.')
        ? 'high'
        : action.includes('suspend') || action.includes('reject') || action.startsWith('dsar.')
          ? 'medium'
          : 'info';
    const id = `aud_${(i + 1).toString().padStart(5, '0')}`;
    const ts = minutesAgo(500 - i + fakerTR.number.int({ min: 0, max: 3 }));
    const body = `${id}|${ts}|${principal.id}|${action}|${prevHash}`;
    const hash = pseudoHash(body);
    events.push({
      id,
      ts,
      principalType: principal.type,
      principalId: principal.id,
      principalLabel: principal.label,
      action,
      resource: action.split('.')[0] ?? 'system',
      resourceId: `res_${fakerTR.number.int({ min: 1000, max: 99_999 })}`,
      ip: `${fakerTR.number.int({ min: 1, max: 255 })}.${fakerTR.number.int({ min: 0, max: 255 })}.${fakerTR.number.int({ min: 0, max: 255 })}.${fakerTR.number.int({ min: 1, max: 255 })}`,
      ua: 'Mozilla/5.0 (LandX) Chrome/130',
      severity: sev,
      tenant: pick(tenants),
      hashPrev: prevHash,
      hash,
    });
    prevHash = hash;
  }
  cachedAudit = events.reverse(); // newest first
  return cachedAudit;
}

export function getAuditChainStatus(): AuditChainStatus {
  const ev = getAuditEvents();
  return {
    total: ev.length,
    verifiedAt: minutesAgo(2),
    intact: true,
  };
}

// --- ECA Rules (K04) — 24 rules ---

let cachedEca: EcaRule[] | null = null;
export function getEcaRules(): ReadonlyArray<EcaRule> {
  if (cachedEca) return cachedEca;
  initFakerSeed();
  const events = [
    'listing.created',
    'listing.approved',
    'offer.received',
    'offer.expired',
    'tkgm.failed',
    'tkgm.success',
    'eca.timer',
    'dsar.received',
    'risk.high',
    'flag.toggled',
    'agent.run.failed',
    'cost.spike',
  ];
  const rules: EcaRule[] = [];
  const names = [
    'Yüksek puanlı ilanı yayına alma sırasına sok',
    'Tapu E001 hatasında listing pasifleştir',
    'Yeni teklif tarafına AI özet öner',
    '24 saatte yanıtsız teklifi hatırlat',
    'KVKK DSAR alındığında 30g sayaç başlat',
    'Anormal coğrafi girişte step-up zorla',
    'Plugin imzasız ise install reddet',
    'AI cost saatte $50 aşarsa kill-switch',
    'Yeni VERBİS bildirimini ekipken paylaş',
    'Tenant kotası %85 aşarsa upsell ping',
    'Düşük confidence valuation’a HITL bekle',
    'Listing.delete kritik audit + alert',
    'Konum şüpheliyse manuel review',
    'TKGM rate-limit görünce 5dk geri-çekil',
    'Onaylı listing’i sosyalde tweet et',
    'KYC.full başarısı olunca premium öneri',
    'İmpossible-travel sezilirse session iptal',
    'Hisseli tapuyu UI’da uyarı ile göster',
    'Zeytinlik vasfı tespit edilirse legal kontrol',
    'Audit zinciri kırılırsa pager-duty',
    'Vector index 90%+ dolu olursa reindex job',
    'Agent.tool_call destructive olursa onay iste',
    'Tenant suspend durumunda export limitle',
    'AI fingerprint duplicate listing flag’le',
  ];
  for (let i = 0; i < 24; i += 1) {
    const enabled = i < 18;
    rules.push({
      id: `eca_${(i + 1).toString().padStart(3, '0')}`,
      name: names[i] ?? `Kural ${i + 1}`,
      event: events[i % events.length] ?? 'eca.timer',
      conditions: [
        { field: 'severity', op: 'gt', value: 'medium' },
        { field: 'tenant', op: 'neq', value: 'demo' },
      ],
      actions: [
        { kind: 'notify', target: 'ops@landx.test' },
        { kind: 'webhook', target: 'https://hooks.landx.test/eca' },
      ],
      enabled,
      priority: 100 - i,
      aiGenerated: i % 4 === 0,
      lastTriggeredAt: enabled ? minutesAgo(fakerTR.number.int({ min: 1, max: 1440 })) : undefined,
      triggerCount: enabled ? fakerTR.number.int({ min: 4, max: 220 }) : 0,
      createdAt: daysAgo(fakerTR.number.int({ min: 5, max: 180 })),
    });
  }
  cachedEca = rules;
  return cachedEca;
}

let cachedEcaEvents: EcaEvent[] | null = null;
export function getEcaEvents(): ReadonlyArray<EcaEvent> {
  if (cachedEcaEvents) return cachedEcaEvents;
  initFakerSeed();
  const rules = getEcaRules().filter((r) => r.enabled);
  const events: EcaEvent[] = [];
  for (let i = 0; i < 80; i += 1) {
    const rule = rules[i % rules.length];
    if (!rule) continue;
    events.push({
      id: `evt_${(i + 1).toString().padStart(4, '0')}`,
      ts: minutesAgo(i * 3 + fakerTR.number.int({ min: 0, max: 2 })),
      ruleId: rule.id,
      ruleName: rule.name,
      outcome: pickWithProb([
        ['matched', 7],
        ['skipped', 2],
        ['error', 1],
      ] as const),
      durationMs: fakerTR.number.int({ min: 4, max: 240 }),
    });
  }
  cachedEcaEvents = events;
  return cachedEcaEvents;
}

// --- TKGM (60 queries) ---

let cachedTkgm: TkgmQuery[] | null = null;
export function getTkgmQueries(): ReadonlyArray<TkgmQuery> {
  if (cachedTkgm) return cachedTkgm;
  initFakerSeed();
  const cities = [
    { il: 'İstanbul', ilceler: ['Beykoz', 'Sancaktepe', 'Şile'] },
    { il: 'İzmir', ilceler: ['Çeşme', 'Urla', 'Karaburun'] },
    { il: 'Antalya', ilceler: ['Kaş', 'Manavgat', 'Side'] },
    { il: 'Muğla', ilceler: ['Bodrum', 'Fethiye'] },
    { il: 'Bursa', ilceler: ['Mudanya', 'Gemlik'] },
  ];
  const queries: TkgmQuery[] = [];
  for (let i = 0; i < 60; i += 1) {
    const city = pick(cities);
    const ilce = pick(city.ilceler);
    const status: TkgmStatusCode = pickWithProb([
      ['OK', 70],
      ['E001', 14],
      ['E002', 8],
      ['E003', 5],
      ['E099', 3],
    ] as const);
    const isOk = status === 'OK';
    queries.push({
      id: `tkgm_${(i + 1).toString().padStart(4, '0')}`,
      ts: minutesAgo(i * 11 + fakerTR.number.int({ min: 0, max: 5 })),
      principal: pick(['agent:tkgm-bot', 'usr_ali', 'usr_selin', 'svc_listing-pipeline']),
      il: city.il,
      ilce,
      ada: String(fakerTR.number.int({ min: 100, max: 9999 })),
      parsel: String(fakerTR.number.int({ min: 1, max: 850 })),
      pafta: String(fakerTR.number.int({ min: 1, max: 80 })),
      status,
      latencyMs:
        status === 'E002'
          ? fakerTR.number.int({ min: 2400, max: 5800 })
          : fakerTR.number.int({ min: 220, max: 1200 }),
      result: isOk
        ? {
            yuzolcumu: fakerTR.number.int({ min: 480, max: 14_500 }),
            nitelik: pick(['Arsa', 'Tarla', 'Bağ', 'Bahçe', 'Zeytinlik']),
            malSahipleri: [
              {
                adSoyad: fakerTR.person.fullName(),
                hisseOran: fakerTR.number.int({ min: 25, max: 100 }),
              },
            ],
            serh: i % 7 === 0 ? ['Aile şerhi (TMK m.1010)'] : undefined,
            tedbir: i % 11 === 0 ? ['İhtiyati tedbir (TMK m.1011)'] : undefined,
          }
        : undefined,
      errorMessage:
        status === 'E001'
          ? 'Geçersiz ada/parsel kombinasyonu.'
          : status === 'E002'
            ? 'TKGM ana sistem zaman aşımına uğradı (504).'
            : status === 'E003'
              ? 'Yetkisiz sorgu — IP rate-limit aşıldı.'
              : status === 'E099'
                ? 'Bilinmeyen TKGM hatası — tekrar deneyin.'
                : undefined,
    });
  }
  cachedTkgm = queries;
  return cachedTkgm;
}

// --- PII Fields (D02) — 14 fields ---

let cachedPii: PiiField[] | null = null;
export function getPiiFields(): ReadonlyArray<PiiField> {
  if (cachedPii) return cachedPii;
  initFakerSeed();
  cachedPii = [
    {
      id: 'pii_01',
      table: 'users',
      column: 'email',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 5,
      maskRule: 'partial(local)@domain',
      detectedBy: 'manual',
      reviewedAt: daysAgo(14),
    },
    {
      id: 'pii_02',
      table: 'users',
      column: 'phone',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 5,
      maskRule: '+90 5*** ** **',
      detectedBy: 'manual',
      reviewedAt: daysAgo(14),
    },
    {
      id: 'pii_03',
      table: 'users',
      column: 'tckn',
      classification: 'sensitive-pii',
      kvkkBasis: 'm.6 (özel nitelikli değil — kimlik)',
      retentionYears: 10,
      maskRule: '***********',
      detectedBy: 'manual',
      reviewedAt: daysAgo(7),
    },
    {
      id: 'pii_04',
      table: 'users',
      column: 'fullName',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 5,
      maskRule: 'A*** D***',
      detectedBy: 'manual',
      reviewedAt: daysAgo(30),
    },
    {
      id: 'pii_05',
      table: 'kyc',
      column: 'idDocPath',
      classification: 'sensitive-pii',
      kvkkBasis: 'm.6',
      retentionYears: 10,
      maskRule: 'aes-256 + s3 signed url',
      detectedBy: 'manual',
      reviewedAt: daysAgo(7),
    },
    {
      id: 'pii_06',
      table: 'kyc',
      column: 'addressFull',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 5,
      maskRule: 'ilçe + ***',
      detectedBy: 'ai-scan',
      reviewedAt: daysAgo(3),
    },
    {
      id: 'pii_07',
      table: 'kyc',
      column: 'biometricFace',
      classification: 'special',
      kvkkBasis: 'm.6 (özel nitelikli)',
      retentionYears: 2,
      maskRule: 'aes-256 + hardware kms',
      detectedBy: 'manual',
      reviewedAt: daysAgo(2),
    },
    {
      id: 'pii_08',
      table: 'listings',
      column: 'ownerNote',
      classification: 'internal',
      kvkkBasis: 'iç kayıt',
      retentionYears: 3,
      maskRule: 'redact "TC|telefon|email"',
      detectedBy: 'ai-scan',
      reviewedAt: daysAgo(1),
    },
    {
      id: 'pii_09',
      table: 'audit',
      column: 'ip',
      classification: 'internal',
      kvkkBasis: 'm.5/2f',
      retentionYears: 2,
      maskRule: 'last-octet truncate',
      detectedBy: 'manual',
      reviewedAt: daysAgo(60),
    },
    {
      id: 'pii_10',
      table: 'audit',
      column: 'ua',
      classification: 'internal',
      kvkkBasis: 'm.5/2f',
      retentionYears: 2,
      maskRule: 'family-only',
      detectedBy: 'manual',
      reviewedAt: daysAgo(60),
    },
    {
      id: 'pii_11',
      table: 'messages',
      column: 'body',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 3,
      maskRule: 'redact (PII regex)',
      detectedBy: 'ai-scan',
      reviewedAt: daysAgo(5),
    },
    {
      id: 'pii_12',
      table: 'offers',
      column: 'priceOffered',
      classification: 'internal',
      kvkkBasis: 'iç kayıt',
      retentionYears: 5,
      maskRule: 'aggregate only',
      detectedBy: 'manual',
      reviewedAt: daysAgo(45),
    },
    {
      id: 'pii_13',
      table: 'broker_team',
      column: 'salaryShare',
      classification: 'sensitive-pii',
      kvkkBasis: 'sözleşmesel veri',
      retentionYears: 7,
      maskRule: 'aes-256',
      detectedBy: 'manual',
      reviewedAt: daysAgo(20),
    },
    {
      id: 'pii_14',
      table: 'agent_memory',
      column: 'subjectContent',
      classification: 'pii',
      kvkkBasis: 'm.5/2c',
      retentionYears: 1,
      maskRule: 'ttl + redact',
      detectedBy: 'ai-scan',
      reviewedAt: daysAgo(1),
    },
  ];
  return cachedPii;
}

let cachedDsar: DsarRequest[] | null = null;
export function getDsarRequests(): ReadonlyArray<DsarRequest> {
  if (cachedDsar) return cachedDsar;
  initFakerSeed();
  cachedDsar = [
    {
      id: 'dsar_001',
      kind: 'access',
      subjectName: 'Mehmet Yılmaz',
      subjectEmail: 'mehmet@example.tr',
      receivedAt: daysAgo(6),
      deadline: daysAgo(-24),
      status: 'in-progress',
      scopeTables: ['users', 'listings', 'offers', 'messages'],
      ownerEmail: 'kvkk@landx.test',
    },
    {
      id: 'dsar_002',
      kind: 'erase',
      subjectName: 'Esra Kaya',
      subjectEmail: 'esra@example.tr',
      receivedAt: daysAgo(14),
      deadline: daysAgo(-16),
      status: 'open',
      scopeTables: ['users', 'kyc', 'messages', 'favorites'],
      ownerEmail: 'kvkk@landx.test',
    },
    {
      id: 'dsar_003',
      kind: 'rectify',
      subjectName: 'Burak Akın',
      subjectEmail: 'burak@example.tr',
      receivedAt: daysAgo(28),
      deadline: daysAgo(-2),
      status: 'in-progress',
      scopeTables: ['users'],
      ownerEmail: 'kvkk@landx.test',
      notes: 'İsim düzeltme talebi.',
    },
    {
      id: 'dsar_004',
      kind: 'portability',
      subjectName: 'Pınar Demir',
      subjectEmail: 'pinar@example.tr',
      receivedAt: daysAgo(3),
      deadline: daysAgo(-27),
      status: 'open',
      scopeTables: ['listings', 'favorites', 'saved_searches'],
      ownerEmail: 'kvkk@landx.test',
    },
    {
      id: 'dsar_005',
      kind: 'object',
      subjectName: 'Onur Çelik',
      subjectEmail: 'onur@example.tr',
      receivedAt: daysAgo(45),
      deadline: daysAgo(-15),
      status: 'fulfilled',
      scopeTables: ['ai_memory'],
      ownerEmail: 'kvkk@landx.test',
      notes: 'AI personalizasyonuna itiraz — kapatıldı.',
    },
  ];
  return cachedDsar;
}

// --- Compliance (D03) — 13 controls + posture ---

let cachedCompliance: ComplianceControl[] | null = null;
export function getComplianceControls(): ReadonlyArray<ComplianceControl> {
  if (cachedCompliance) return cachedCompliance;
  initFakerSeed();
  cachedCompliance = [
    {
      id: 'kvkk_m7',
      framework: 'KVKK',
      code: 'm.7',
      title: 'Silme, yok etme ve anonimleştirme',
      status: 'met',
      evidenceFreshDays: 12,
      ownerEmail: 'kvkk@landx.test',
      lastReviewedAt: daysAgo(12),
      nextDueAt: daysAgo(-78),
    },
    {
      id: 'kvkk_m11',
      framework: 'KVKK',
      code: 'm.11',
      title: 'İlgili kişinin hakları (DSAR)',
      status: 'met',
      evidenceFreshDays: 6,
      ownerEmail: 'kvkk@landx.test',
      lastReviewedAt: daysAgo(6),
      nextDueAt: daysAgo(-84),
    },
    {
      id: 'kvkk_m12',
      framework: 'KVKK',
      code: 'm.12',
      title: 'Veri güvenliği yükümlülükleri',
      status: 'partial',
      evidenceFreshDays: 38,
      ownerEmail: 'sec@landx.test',
      lastReviewedAt: daysAgo(38),
      nextDueAt: daysAgo(-52),
      notes: 'VERBİS bildirimi 14g içinde yenilenmeli.',
    },
    {
      id: 'verbis_kayit',
      framework: 'VERBIS',
      code: 'VERBİS',
      title: 'VERBİS kayıt güncelliği',
      status: 'partial',
      evidenceFreshDays: 95,
      ownerEmail: 'kvkk@landx.test',
      lastReviewedAt: daysAgo(95),
      nextDueAt: daysAgo(-5),
      notes: 'Yıllık güncelleme yakın.',
    },
    {
      id: 'gdpr_30',
      framework: 'GDPR',
      code: 'Art.30',
      title: 'Records of processing',
      status: 'met',
      evidenceFreshDays: 28,
      ownerEmail: 'dpo@landx.test',
      lastReviewedAt: daysAgo(28),
      nextDueAt: daysAgo(-62),
    },
    {
      id: 'gdpr_33',
      framework: 'GDPR',
      code: 'Art.33',
      title: 'Breach notification (72h)',
      status: 'met',
      evidenceFreshDays: 60,
      ownerEmail: 'sec@landx.test',
      lastReviewedAt: daysAgo(60),
      nextDueAt: daysAgo(-30),
    },
    {
      id: 'gdpr_35',
      framework: 'GDPR',
      code: 'Art.35',
      title: 'DPIA — Data Protection Impact Assessment',
      status: 'partial',
      evidenceFreshDays: 110,
      ownerEmail: 'dpo@landx.test',
      lastReviewedAt: daysAgo(110),
      nextDueAt: daysAgo(20),
      notes: 'AI ranking için DPIA tazelenmeli.',
    },
    {
      id: 'soc2_cc1',
      framework: 'SOC2',
      code: 'CC1',
      title: 'Control environment',
      status: 'met',
      evidenceFreshDays: 45,
      ownerEmail: 'sec@landx.test',
      lastReviewedAt: daysAgo(45),
      nextDueAt: daysAgo(-45),
    },
    {
      id: 'soc2_cc6',
      framework: 'SOC2',
      code: 'CC6',
      title: 'Logical access',
      status: 'met',
      evidenceFreshDays: 22,
      ownerEmail: 'sec@landx.test',
      lastReviewedAt: daysAgo(22),
      nextDueAt: daysAgo(-68),
    },
    {
      id: 'soc2_cc7',
      framework: 'SOC2',
      code: 'CC7',
      title: 'System operations',
      status: 'met',
      evidenceFreshDays: 14,
      ownerEmail: 'ops@landx.test',
      lastReviewedAt: daysAgo(14),
      nextDueAt: daysAgo(-76),
    },
    {
      id: 'soc2_cc8',
      framework: 'SOC2',
      code: 'CC8',
      title: 'Change management',
      status: 'unmet',
      evidenceFreshDays: 240,
      ownerEmail: 'eng@landx.test',
      lastReviewedAt: daysAgo(240),
      nextDueAt: daysAgo(120),
      notes: 'Change-mgmt SOP eksik.',
    },
    {
      id: 'iso_a816',
      framework: 'ISO27001',
      code: 'A.8.16',
      title: 'Monitoring activities',
      status: 'met',
      evidenceFreshDays: 18,
      ownerEmail: 'ops@landx.test',
      lastReviewedAt: daysAgo(18),
      nextDueAt: daysAgo(-72),
    },
    {
      id: 'iso_pentest',
      framework: 'ISO27001',
      code: 'Pentest',
      title: 'Yıllık penetrasyon testi',
      status: 'partial',
      evidenceFreshDays: 320,
      ownerEmail: 'sec@landx.test',
      lastReviewedAt: daysAgo(320),
      nextDueAt: daysAgo(45),
      notes: 'Yıllık pentest süresi yaklaşıyor.',
    },
  ];
  return cachedCompliance;
}

export function getCompliancePosture(): CompliancePosture {
  const c = getComplianceControls();
  const fws = new Set(c.map((x) => x.framework));
  const byFramework = Array.from(fws).map((fw) => {
    const items = c.filter((x) => x.framework === fw);
    const met = items.filter((x) => x.status === 'met').length;
    return {
      framework: fw,
      score: Math.round((met / items.length) * 100),
      gaps: items.filter((x) => x.status !== 'met').length,
    };
  });
  const met = c.filter((x) => x.status === 'met').length;
  return { overallScore: Math.round((met / c.length) * 100), byFramework };
}

// --- SLO / Observability (O01) — 7 SLOs + traces + logs ---

let cachedSlo: Slo[] | null = null;
export function getSlos(): ReadonlyArray<Slo> {
  if (cachedSlo) return cachedSlo;
  initFakerSeed();
  function trend(base: number, n = 28): number[] {
    return Array.from(
      { length: n },
      (_, i) =>
        base +
        Math.sin(i / 3) * 0.4 +
        fakerTR.number.float({ min: -0.3, max: 0.3, fractionDigits: 2 }),
    );
  }
  cachedSlo = [
    {
      id: 'slo_api_p95',
      name: 'API latency p95 < 200ms',
      service: 'api-gateway',
      objective: 99.9,
      windowDays: 28,
      burnRate: 0.6,
      errorBudgetRemaining: 0.84,
      status: 'healthy',
      trend: trend(99.94),
    },
    {
      id: 'slo_login',
      name: 'Login success > 99.5%',
      service: 'auth',
      objective: 99.5,
      windowDays: 28,
      burnRate: 1.2,
      errorBudgetRemaining: 0.58,
      status: 'warning',
      trend: trend(99.58),
    },
    {
      id: 'slo_ai_resp',
      name: 'AI response < 3s p95',
      service: 'ai-router',
      objective: 99.0,
      windowDays: 7,
      burnRate: 0.4,
      errorBudgetRemaining: 0.92,
      status: 'healthy',
      trend: trend(99.2),
    },
    {
      id: 'slo_tkgm',
      name: 'TKGM availability > 98%',
      service: 'tkgm-gateway',
      objective: 98.0,
      windowDays: 28,
      burnRate: 1.8,
      errorBudgetRemaining: 0.32,
      status: 'warning',
      trend: trend(98.1),
    },
    {
      id: 'slo_hash_chain',
      name: 'Audit hash-chain integrity 100%',
      service: 'audit',
      objective: 100,
      windowDays: 90,
      burnRate: 0,
      errorBudgetRemaining: 1,
      status: 'healthy',
      trend: trend(100),
    },
    {
      id: 'slo_mcp',
      name: 'MCP discovery < 500ms p95',
      service: 'mcp-server',
      objective: 99.5,
      windowDays: 7,
      burnRate: 0.3,
      errorBudgetRemaining: 0.96,
      status: 'healthy',
      trend: trend(99.7),
    },
    {
      id: 'slo_dsar',
      name: 'DSAR fulfilled < 30g',
      service: 'kvkk-workflow',
      objective: 100,
      windowDays: 90,
      burnRate: 2.1,
      errorBudgetRemaining: 0.18,
      status: 'breach',
      trend: trend(96.5),
    },
  ];
  return cachedSlo;
}

let cachedTraces: Trace[] | null = null;
export function getTraces(): ReadonlyArray<Trace> {
  if (cachedTraces) return cachedTraces;
  initFakerSeed();
  const ops = [
    { svc: 'api-gateway', op: 'GET /api/listings' },
    { svc: 'ai-router', op: 'POST /ai/valuation' },
    { svc: 'tkgm-gateway', op: 'POST /tkgm/verify' },
    { svc: 'auth', op: 'POST /auth/login' },
    { svc: 'mcp-server', op: 'mcp.tool.invoke' },
    { svc: 'audit', op: 'append + hash' },
    { svc: 'eca-runner', op: 'rule.evaluate' },
  ];
  const traces: Trace[] = [];
  for (let i = 0; i < 14; i += 1) {
    const op = ops[i % ops.length];
    if (!op) continue;
    const total = fakerTR.number.int({ min: 80, max: 1800 });
    const spanCount = fakerTR.number.int({ min: 3, max: 9 });
    let cursor = 0;
    const spans = Array.from({ length: spanCount }, (_, j) => {
      const dur = Math.floor(total / spanCount + fakerTR.number.int({ min: -20, max: 20 }));
      const span = {
        id: `span_${i}_${j}`,
        service: pick(['api-gateway', 'auth', 'ai-router', 'tkgm-gateway', 'mcp-server']),
        name: pick(['handle', 'auth.verify', 'cache.get', 'db.query', 'llm.invoke', 'tkgm.fetch']),
        durationMs: Math.max(2, dur),
        startOffsetMs: cursor,
        status: 'ok' as const,
      };
      cursor += span.durationMs;
      return span;
    });
    traces.push({
      id: `trc_${(i + 1).toString().padStart(4, '0')}`,
      ts: minutesAgo(i * 7 + 1),
      service: op.svc,
      operation: op.op,
      durationMs: total,
      spanCount,
      status: i % 9 === 0 ? 'error' : 'ok',
      spans,
    });
  }
  cachedTraces = traces;
  return cachedTraces;
}

let cachedLogs: LogEntry[] | null = null;
export function getLogs(): ReadonlyArray<LogEntry> {
  if (cachedLogs) return cachedLogs;
  initFakerSeed();
  const logs: LogEntry[] = [];
  for (let i = 0; i < 40; i += 1) {
    const level = pickWithProb([
      ['info', 50],
      ['warn', 20],
      ['debug', 15],
      ['error', 12],
      ['fatal', 3],
    ] as const);
    logs.push({
      id: `log_${(i + 1).toString().padStart(4, '0')}`,
      ts: minutesAgo(i * 2),
      level,
      service: pick(['api-gateway', 'auth', 'ai-router', 'tkgm-gateway', 'eca-runner']),
      message:
        level === 'error'
          ? `${pick(['DB connection failed', 'TKGM 504 timeout', 'AI provider quota exceeded'])}`
          : level === 'fatal'
            ? 'Sentinel: audit chain mismatch detected — investigating'
            : level === 'warn'
              ? `${pick(['Slow query 1.2s', 'Cache miss rate 18%', 'Rate-limit warn'])}`
              : `${pick(['Request handled', 'Cache hit', 'OK'])}`,
      traceId: i % 3 === 0 ? `trc_${(i + 1).toString().padStart(4, '0')}` : undefined,
    });
  }
  cachedLogs = logs;
  return cachedLogs;
}

// --- Feature Flags (K05) — 12 flags ---

let cachedFlags: FeatureFlag[] | null = null;
export function getFeatureFlags(): ReadonlyArray<FeatureFlag> {
  if (cachedFlags) return cachedFlags;
  initFakerSeed();
  cachedFlags = [
    {
      key: 'ai.valuation.v2',
      description: 'Yeni değerleme modeli',
      category: 'experiment',
      state: 'ramp',
      rampPercent: 35,
      updatedBy: 'ai-team',
      updatedAt: daysAgo(2),
    },
    {
      key: 'killswitch.ai.cost',
      description: 'AI maliyet kill-switch',
      category: 'kill-switch',
      state: 'off',
      updatedBy: 'ops',
      updatedAt: daysAgo(30),
    },
    {
      key: 'broker.subroles.enabled',
      description: '3 broker sub-role',
      category: 'rollout',
      state: 'on',
      updatedBy: 'product',
      updatedAt: daysAgo(40),
    },
    {
      key: 'auth.passkey.required',
      description: 'Yöneticilere passkey zorunluluğu',
      category: 'permission',
      state: 'targeted',
      targets: ['admin', 'broker-admin'],
      updatedBy: 'sec',
      updatedAt: daysAgo(7),
    },
    {
      key: 'public.compare.aiSummary',
      description: 'Compare sayfası AI özet',
      category: 'experiment',
      state: 'on',
      updatedBy: 'product',
      updatedAt: daysAgo(3),
    },
    {
      key: 'ai.thinking.dot',
      description: 'Token stream UI',
      category: 'ai',
      state: 'on',
      updatedBy: 'design',
      updatedAt: daysAgo(10),
    },
    {
      key: 'tkgm.bulk.enabled',
      description: 'TKGM bulk sorgu',
      category: 'rollout',
      state: 'ramp',
      rampPercent: 60,
      updatedBy: 'ops',
      updatedAt: daysAgo(5),
    },
    {
      key: 'tenant.aegean.dark-mode',
      description: 'Aegean Pro için karanlık mod',
      category: 'rollout',
      state: 'targeted',
      targets: ['ten_provis'],
      updatedBy: 'product',
      updatedAt: daysAgo(1),
    },
    {
      key: 'dsar.auto-fulfill.low-risk',
      description: 'Düşük riskli DSAR otomatik karşıla',
      category: 'ai',
      state: 'ramp',
      rampPercent: 10,
      updatedBy: 'kvkk',
      updatedAt: daysAgo(4),
    },
    {
      key: 'public.investmentSim.advanced',
      description: 'Yatırım sim. ileri seviye',
      category: 'experiment',
      state: 'off',
      updatedBy: 'product',
      updatedAt: daysAgo(20),
    },
    {
      key: 'admin.workflowDesigner',
      description: 'Workflow designer GA',
      category: 'rollout',
      state: 'on',
      updatedBy: 'product',
      updatedAt: daysAgo(8),
    },
    {
      key: 'mcp.public.discovery',
      description: 'MCP discovery public',
      category: 'permission',
      state: 'off',
      updatedBy: 'sec',
      updatedAt: daysAgo(15),
    },
  ];
  return cachedFlags;
}

let cachedConfig: ConfigEntry[] | null = null;
export function getConfigEntries(): ReadonlyArray<ConfigEntry> {
  if (cachedConfig) return cachedConfig;
  initFakerSeed();
  cachedConfig = [
    {
      key: 'app.locale.default',
      value: 'tr',
      scope: 'global',
      source: 'env',
      masked: false,
      updatedAt: daysAgo(180),
    },
    {
      key: 'app.timezone',
      value: 'Europe/Istanbul',
      scope: 'global',
      source: 'env',
      masked: false,
      updatedAt: daysAgo(180),
    },
    {
      key: 'auth.jwt.secret',
      value: '••••••••••••••••',
      scope: 'global',
      source: 'env',
      masked: true,
      updatedAt: daysAgo(90),
    },
    {
      key: 'storage.s3.bucket',
      value: 'landx-prod-uploads',
      scope: 'global',
      source: 'env',
      masked: false,
      updatedAt: daysAgo(30),
    },
    {
      key: 'tkgm.api.endpoint',
      value: 'https://api.tkgm.gov.tr/v2',
      scope: 'global',
      source: 'env',
      masked: false,
      updatedAt: daysAgo(45),
    },
    {
      key: 'ai.cost.hourCapUsd',
      value: '50',
      scope: 'tenant',
      source: 'db',
      masked: false,
      updatedAt: daysAgo(5),
    },
    {
      key: 'ai.cost.dayCapUsd',
      value: '600',
      scope: 'tenant',
      source: 'db',
      masked: false,
      updatedAt: daysAgo(5),
    },
    {
      key: 'msw.enabled',
      value: 'true',
      scope: 'global',
      source: 'override',
      masked: false,
      updatedAt: daysAgo(2),
    },
    {
      key: 'sentry.dsn',
      value: '••••••••••••••••',
      scope: 'global',
      source: 'env',
      masked: true,
      updatedAt: daysAgo(60),
    },
    {
      key: 'broker.team.maxAgents',
      value: '24',
      scope: 'tenant',
      source: 'db',
      masked: false,
      updatedAt: daysAgo(12),
    },
  ];
  return cachedConfig;
}

// --- API Explorer (S01) — 20 endpoints ---

let cachedApi: ApiEndpoint[] | null = null;
export function getApiEndpoints(): ReadonlyArray<ApiEndpoint> {
  if (cachedApi) return cachedApi;
  initFakerSeed();
  cachedApi = [
    {
      id: 'ep_listings_search',
      method: 'GET',
      path: '/api/listings',
      summary: 'İlan ara',
      authScope: 'public',
      rateLimit: '60 / dk',
      exampleResponse: '{ "items": [...], "total": 240 }',
    },
    {
      id: 'ep_listings_detail',
      method: 'GET',
      path: '/api/listings/:id',
      summary: 'İlan detay',
      authScope: 'public',
      rateLimit: '120 / dk',
    },
    {
      id: 'ep_listings_create',
      method: 'POST',
      path: '/api/listings',
      summary: 'Yeni ilan',
      authScope: 'tenant',
      rateLimit: '10 / dk',
      errorCodes: ['400 invalid_schema', '402 quota_exceeded'],
    },
    {
      id: 'ep_listings_update',
      method: 'PATCH',
      path: '/api/listings/:id',
      summary: 'İlan güncelle',
      authScope: 'tenant',
      rateLimit: '20 / dk',
    },
    {
      id: 'ep_listings_delete',
      method: 'DELETE',
      path: '/api/listings/:id',
      summary: 'İlan sil',
      authScope: 'tenant',
      rateLimit: '5 / dk',
    },
    {
      id: 'ep_offers_create',
      method: 'POST',
      path: '/api/offers',
      summary: 'Teklif ver',
      authScope: 'tenant',
      rateLimit: '20 / dk',
    },
    {
      id: 'ep_offers_accept',
      method: 'POST',
      path: '/api/offers/:id/accept',
      summary: 'Teklif kabul',
      authScope: 'tenant',
      rateLimit: '20 / dk',
    },
    {
      id: 'ep_users_me',
      method: 'GET',
      path: '/api/me',
      summary: 'Aktif kullanıcı',
      authScope: 'tenant',
      rateLimit: '120 / dk',
    },
    {
      id: 'ep_messages_send',
      method: 'POST',
      path: '/api/threads/:id/messages',
      summary: 'Mesaj gönder',
      authScope: 'tenant',
      rateLimit: '60 / dk',
    },
    {
      id: 'ep_ai_valuation',
      method: 'POST',
      path: '/api/ai/valuation',
      summary: 'AI değerleme',
      authScope: 'tenant',
      rateLimit: '20 / dk',
      exampleRequest: '{ "listingId": "lst_001" }',
    },
    {
      id: 'ep_ai_description',
      method: 'POST',
      path: '/api/ai/description',
      summary: 'AI açıklama üret',
      authScope: 'tenant',
      rateLimit: '30 / dk',
    },
    {
      id: 'ep_ai_chat',
      method: 'POST',
      path: '/api/ai/chat',
      summary: 'AI sohbet (SSE)',
      authScope: 'tenant',
      rateLimit: '20 / dk',
    },
    {
      id: 'ep_tkgm_verify',
      method: 'POST',
      path: '/api/tkgm/verify',
      summary: 'TKGM doğrula',
      authScope: 'admin',
      rateLimit: '30 / dk',
      errorCodes: ['E001', 'E002', 'E003', 'E099'],
    },
    {
      id: 'ep_tkgm_bulk',
      method: 'POST',
      path: '/api/tkgm/bulk',
      summary: 'TKGM toplu sorgu',
      authScope: 'admin',
      rateLimit: '5 / dk',
    },
    {
      id: 'ep_audit_list',
      method: 'GET',
      path: '/api/admin/audit',
      summary: 'Audit log',
      authScope: 'admin',
      rateLimit: '60 / dk',
    },
    {
      id: 'ep_audit_verify',
      method: 'POST',
      path: '/api/admin/audit/verify',
      summary: 'Hash zinciri doğrula',
      authScope: 'admin',
      rateLimit: '1 / dk',
    },
    {
      id: 'ep_dsar_list',
      method: 'GET',
      path: '/api/admin/dsar',
      summary: 'DSAR talepleri',
      authScope: 'admin',
      rateLimit: '60 / dk',
    },
    {
      id: 'ep_flags_list',
      method: 'GET',
      path: '/api/admin/flags',
      summary: 'Feature flag listesi',
      authScope: 'admin',
      rateLimit: '120 / dk',
    },
    {
      id: 'ep_flags_toggle',
      method: 'PATCH',
      path: '/api/admin/flags/:key',
      summary: 'Flag toggle',
      authScope: 'admin',
      rateLimit: '60 / dk',
    },
    {
      id: 'ep_mcp_clients',
      method: 'GET',
      path: '/api/agent/mcp/clients',
      summary: 'MCP bağlı clientlar',
      authScope: 'admin',
      rateLimit: '60 / dk',
    },
  ];
  return cachedApi;
}

// --- Modules catalog (33 modules) ---

let cachedModules: ModuleEntry[] | null = null;
export function getModules(): ReadonlyArray<ModuleEntry> {
  if (cachedModules) return cachedModules;
  initFakerSeed();
  cachedModules = [
    // L0 Kernel
    {
      id: 'm_k01',
      code: 'K01',
      name: 'Plugin Manager',
      layer: 'L0-Kernel',
      description: 'Plugin registry, install, enable',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/plugins'],
    },
    {
      id: 'm_k02',
      code: 'K02',
      name: 'DocType Studio',
      layer: 'L0-Kernel',
      description: 'Schema → SQL/API/Admin/MCP',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: true,
      routes: ['/admin/doctype-studio'],
    },
    {
      id: 'm_k03',
      code: 'K03',
      name: 'Migrations',
      layer: 'L0-Kernel',
      description: 'Şema değişiklik kuyruğu',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/migrations'],
    },
    {
      id: 'm_k04',
      code: 'K04',
      name: 'ECA Rules',
      layer: 'L0-Kernel',
      description: 'Event-Condition-Action engine',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/rules'],
    },
    {
      id: 'm_k05',
      code: 'K05',
      name: 'Feature Flags & Config',
      layer: 'L0-Kernel',
      description: 'Flag + config + secrets',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/feature-flags', '/admin/config'],
    },
    {
      id: 'm_k06',
      code: 'K06',
      name: 'i18n & Locales',
      layer: 'L0-Kernel',
      description: 'TR + EN parity',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
    },
    // L1 Identity
    {
      id: 'm_i01',
      code: 'I01',
      name: 'Tenant Management',
      layer: 'L1-Identity',
      description: 'Çoklu kiracı + kota',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/tenant'],
    },
    {
      id: 'm_i02',
      code: 'I02',
      name: 'User & Identity',
      layer: 'L1-Identity',
      description: 'Polimorfik kullanıcı',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: true,
      routes: ['/admin/users'],
    },
    {
      id: 'm_i03',
      code: 'I03',
      name: 'Auth & Security',
      layer: 'L1-Identity',
      description: 'MFA + risk-based auth',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/auth-security'],
    },
    {
      id: 'm_i04',
      code: 'I04',
      name: 'Roles & Permissions',
      layer: 'L1-Identity',
      description: 'RBAC + ABAC',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/roles'],
    },
    {
      id: 'm_i05',
      code: 'I05',
      name: 'Tenant Isolation',
      layer: 'L1-Identity',
      description: 'Row-level security + KMS',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
    },
    // L2 AI Runtime
    {
      id: 'm_a01',
      code: 'A01',
      name: 'MCP Server',
      layer: 'L2-AI-Runtime',
      description: 'Model Context Protocol',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: true,
      routes: ['/admin/mcp', '/agent/mcp'],
    },
    {
      id: 'm_a02',
      code: 'A02',
      name: 'Tool Registry',
      layer: 'L2-AI-Runtime',
      description: 'Araç kataloğu + signed',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: true,
      routes: ['/admin/agent-registry', '/agent/tools'],
    },
    {
      id: 'm_a03',
      code: 'A03',
      name: 'Agent Roster',
      layer: 'L2-AI-Runtime',
      description: 'Agent scope editor',
      implStatus: 'partial',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/agent/agents'],
    },
    {
      id: 'm_a04',
      code: 'A04',
      name: 'Memory Layer',
      layer: 'L2-AI-Runtime',
      description: 'Episodic/Semantic/Pref/Tool-use',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/agent-registry', '/agent/memory'],
    },
    {
      id: 'm_a05',
      code: 'A05',
      name: 'Vector Store',
      layer: 'L2-AI-Runtime',
      description: 'Hibrit arama (vec + BM25)',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/agent-registry', '/agent/vectors'],
    },
    {
      id: 'm_a06',
      code: 'A06',
      name: 'Prompt Library',
      layer: 'L2-AI-Runtime',
      description: 'Versiyonlu prompt + A/B',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/ai-ops'],
    },
    {
      id: 'm_a07',
      code: 'A07',
      name: 'LLM Providers',
      layer: 'L2-AI-Runtime',
      description: 'Routing + fallback + cost',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/ai-ops'],
    },
    {
      id: 'm_a08',
      code: 'A08',
      name: 'AI Observability',
      layer: 'L2-AI-Runtime',
      description: 'Traces + cost + replay',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/ai-ops', '/agent/observability'],
    },
    {
      id: 'm_a09',
      code: 'A09',
      name: 'Agent Orchestration',
      layer: 'L2-AI-Runtime',
      description: 'Plan/Execute/Reflect + HITL',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/orchestration', '/admin/agent-tasks'],
    },
    // L3 Application
    {
      id: 'm_l1',
      code: 'L01',
      name: 'Listing Catalog',
      layer: 'L3-Application',
      description: 'Arsa marketplace',
      implStatus: 'partial',
      aiEnabled: true,
      mcpEnabled: false,
    },
    {
      id: 'm_l2',
      code: 'L02',
      name: 'Offers & Messaging',
      layer: 'L3-Application',
      description: 'Teklif & sohbet',
      implStatus: 'partial',
      aiEnabled: true,
      mcpEnabled: false,
    },
    {
      id: 'm_l3',
      code: 'L03',
      name: 'Search & Filters',
      layer: 'L3-Application',
      description: 'NL parser + filter',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
    },
    {
      id: 'm_l4',
      code: 'L04',
      name: 'Map & Geo',
      layer: 'L3-Application',
      description: 'MapLibre + deck.gl',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
    },
    // L4 Data & Compliance
    {
      id: 'm_d01',
      code: 'D01',
      name: 'Audit Log + Hash Chain',
      layer: 'L4-Data-Compliance',
      description: 'Tamper-evident',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/audit'],
    },
    {
      id: 'm_d02',
      code: 'D02',
      name: 'PII Governance',
      layer: 'L4-Data-Compliance',
      description: 'KVKK + DSAR',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/pii'],
    },
    {
      id: 'm_d03',
      code: 'D03',
      name: 'Compliance Framework',
      layer: 'L4-Data-Compliance',
      description: 'KVKK/GDPR/SOC2/ISO27001',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/compliance'],
    },
    {
      id: 'm_d04',
      code: 'D04',
      name: 'Data Retention',
      layer: 'L4-Data-Compliance',
      description: 'Otomatik silme',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
    },
    // L5 Operations
    {
      id: 'm_o01',
      code: 'O01',
      name: 'SLO & Observability',
      layer: 'L5-Operations',
      description: 'SLO + traces + logs',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/observability', '/admin/slo'],
    },
    {
      id: 'm_o02',
      code: 'O02',
      name: 'Plugin Marketplace',
      layer: 'L5-Operations',
      description: 'Listele + install',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/plugins'],
    },
    {
      id: 'm_o03',
      code: 'O03',
      name: 'Security Reviews',
      layer: 'L5-Operations',
      description: 'Bulgu + remediation',
      implStatus: 'partial',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/security/reviews'],
    },
    {
      id: 'm_s01',
      code: 'S01',
      name: 'API Explorer',
      layer: 'L5-Operations',
      description: 'OpenAPI + try-it',
      implStatus: 'full',
      aiEnabled: false,
      mcpEnabled: false,
      routes: ['/admin/api'],
    },
    {
      id: 'm_s04',
      code: 'S04',
      name: 'Workflow Designer',
      layer: 'L5-Operations',
      description: 'State machine + simulate',
      implStatus: 'full',
      aiEnabled: true,
      mcpEnabled: false,
      routes: ['/admin/workflow-designer'],
    },
  ];
  return cachedModules;
}

// --- Workflows (S04) — 3 workflows ---

let cachedWorkflows: Workflow[] | null = null;
export function getWorkflows(): ReadonlyArray<Workflow> {
  if (cachedWorkflows) return cachedWorkflows;
  initFakerSeed();
  cachedWorkflows = [
    {
      id: 'wf_listing',
      name: 'İlan Yayın Süreci',
      description: 'Taslak → Onay bekleyen → Yayında / Reddedildi',
      states: [
        { id: 'draft', label: 'Taslak', kind: 'initial' },
        { id: 'pending', label: 'Onay bekliyor', kind: 'normal' },
        { id: 'live', label: 'Yayında', kind: 'normal' },
        { id: 'rejected', label: 'Reddedildi', kind: 'final' },
        { id: 'archived', label: 'Arşivlendi', kind: 'final' },
      ],
      transitions: [
        {
          id: 't1',
          from: 'draft',
          to: 'pending',
          trigger: 'submit',
          roles: ['seller'],
          aiAssisted: true,
          action: 'ai.scan(content)',
        },
        {
          id: 't2',
          from: 'pending',
          to: 'live',
          trigger: 'approve',
          roles: ['admin', 'moderator'],
          aiAssisted: false,
        },
        {
          id: 't3',
          from: 'pending',
          to: 'rejected',
          trigger: 'reject',
          roles: ['admin', 'moderator'],
          aiAssisted: false,
          guard: 'reason ≠ null',
        },
        {
          id: 't4',
          from: 'live',
          to: 'archived',
          trigger: 'archive',
          roles: ['seller', 'admin'],
          aiAssisted: false,
        },
      ],
    },
    {
      id: 'wf_offer',
      name: 'Teklif Yaşam Döngüsü',
      description: 'Verildi → Karşı/Kabul/Red → Kapandı',
      states: [
        { id: 'submitted', label: 'Verildi', kind: 'initial' },
        { id: 'counter', label: 'Karşı teklif', kind: 'normal' },
        { id: 'accepted', label: 'Kabul', kind: 'normal' },
        { id: 'rejected', label: 'Red', kind: 'final' },
        { id: 'closed', label: 'Kapandı', kind: 'final' },
      ],
      transitions: [
        {
          id: 't1',
          from: 'submitted',
          to: 'counter',
          trigger: 'counter',
          roles: ['seller'],
          aiAssisted: true,
          action: 'ai.suggestPrice',
        },
        {
          id: 't2',
          from: 'submitted',
          to: 'accepted',
          trigger: 'accept',
          roles: ['seller'],
          aiAssisted: false,
        },
        {
          id: 't3',
          from: 'submitted',
          to: 'rejected',
          trigger: 'reject',
          roles: ['seller'],
          aiAssisted: false,
        },
        {
          id: 't4',
          from: 'accepted',
          to: 'closed',
          trigger: 'close',
          roles: ['admin'],
          aiAssisted: false,
        },
      ],
    },
    {
      id: 'wf_kyc',
      name: 'KYC Doğrulama',
      description: 'Başlatıldı → Belgeler → AI risk skor → Onay',
      states: [
        { id: 'start', label: 'Başlatıldı', kind: 'initial' },
        { id: 'docs', label: 'Belgeler yüklendi', kind: 'normal' },
        { id: 'scored', label: 'Risk skorlandı', kind: 'normal' },
        { id: 'approved', label: 'Onaylandı', kind: 'final' },
        { id: 'rejected', label: 'Reddedildi', kind: 'final' },
      ],
      transitions: [
        {
          id: 't1',
          from: 'start',
          to: 'docs',
          trigger: 'upload',
          roles: ['user'],
          aiAssisted: true,
          action: 'ai.ocr(deed)',
        },
        {
          id: 't2',
          from: 'docs',
          to: 'scored',
          trigger: 'score',
          roles: ['system'],
          aiAssisted: true,
          action: 'ai.risk',
        },
        {
          id: 't3',
          from: 'scored',
          to: 'approved',
          trigger: 'approve',
          roles: ['admin'],
          aiAssisted: false,
          guard: 'risk < 0.5',
        },
        {
          id: 't4',
          from: 'scored',
          to: 'rejected',
          trigger: 'reject',
          roles: ['admin'],
          aiAssisted: false,
          guard: 'risk >= 0.5',
        },
      ],
    },
  ];
  return cachedWorkflows;
}

// --- DocTypes (K02) — 4 ---

let cachedDocTypes: DocType[] | null = null;
export function getDocTypes(): ReadonlyArray<DocType> {
  if (cachedDocTypes) return cachedDocTypes;
  initFakerSeed();
  cachedDocTypes = [
    {
      id: 'dt_listing',
      name: 'Listing',
      description: 'Arsa ilanı — public marketplace',
      status: 'published',
      updatedAt: daysAgo(2),
      fields: [
        {
          id: 'f1',
          name: 'id',
          type: 'uuid',
          required: true,
          unique: true,
          indexed: true,
          aiExposed: false,
          mcpExposed: true,
        },
        {
          id: 'f2',
          name: 'title',
          type: 'string',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
        },
        {
          id: 'f3',
          name: 'description',
          type: 'text',
          required: false,
          unique: false,
          indexed: false,
          aiExposed: true,
          mcpExposed: true,
        },
        {
          id: 'f4',
          name: 'price',
          type: 'decimal',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
        },
        {
          id: 'f5',
          name: 'areaSqm',
          type: 'int',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
        },
        {
          id: 'f6',
          name: 'zoning',
          type: 'enum',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
          enumValues: [
            'konut',
            'ticari',
            'tarla',
            'sanayi',
            'turizm',
            'zeytinlik',
            'karma',
            'imarsiz',
          ],
        },
        {
          id: 'f7',
          name: 'titleDeed',
          type: 'enum',
          required: true,
          unique: false,
          indexed: false,
          aiExposed: true,
          mcpExposed: true,
          enumValues: [
            'mustakil',
            'hisseli',
            'kat-irtifaki',
            'arsa-tapulu',
            'tarla-tapulu',
            'tapu-tahsis',
            'yok',
          ],
        },
        {
          id: 'f8',
          name: 'titleEmbedding',
          type: 'vector',
          required: false,
          unique: false,
          indexed: true,
          aiExposed: false,
          mcpExposed: false,
          vectorDim: 1536,
        },
        {
          id: 'f9',
          name: 'sellerId',
          type: 'foreign',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: false,
          mcpExposed: true,
          refDocType: 'User',
        },
        {
          id: 'f10',
          name: 'media',
          type: 'jsonb',
          required: false,
          unique: false,
          indexed: false,
          aiExposed: true,
          mcpExposed: false,
        },
      ],
    },
    {
      id: 'dt_user',
      name: 'User',
      description: 'Polimorfik kullanıcı (human / agent / system / service)',
      status: 'published',
      updatedAt: daysAgo(20),
      fields: [
        {
          id: 'f1',
          name: 'id',
          type: 'uuid',
          required: true,
          unique: true,
          indexed: true,
          aiExposed: false,
          mcpExposed: true,
        },
        {
          id: 'f2',
          name: 'email',
          type: 'string',
          required: true,
          unique: true,
          indexed: true,
          aiExposed: false,
          mcpExposed: false,
        },
        {
          id: 'f3',
          name: 'principalType',
          type: 'enum',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
          enumValues: ['individual', 'org', 'agent', 'system', 'service'],
        },
        {
          id: 'f4',
          name: 'tenant',
          type: 'foreign',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: false,
          mcpExposed: true,
          refDocType: 'Tenant',
        },
      ],
    },
    {
      id: 'dt_offer',
      name: 'Offer',
      description: 'Teklif',
      status: 'published',
      updatedAt: daysAgo(10),
      fields: [
        {
          id: 'f1',
          name: 'id',
          type: 'uuid',
          required: true,
          unique: true,
          indexed: true,
          aiExposed: false,
          mcpExposed: true,
        },
        {
          id: 'f2',
          name: 'listingId',
          type: 'foreign',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
          refDocType: 'Listing',
        },
        {
          id: 'f3',
          name: 'priceOffered',
          type: 'decimal',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
        },
        {
          id: 'f4',
          name: 'status',
          type: 'enum',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: true,
          mcpExposed: true,
          enumValues: ['submitted', 'counter', 'accepted', 'rejected', 'closed'],
        },
        {
          id: 'f5',
          name: 'createdAt',
          type: 'datetime',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: false,
          mcpExposed: false,
        },
      ],
    },
    {
      id: 'dt_proph',
      name: 'PropertyHistory',
      description: 'Taslak — TKGM sorgu geçmişi',
      status: 'draft',
      updatedAt: daysAgo(1),
      fields: [
        {
          id: 'f1',
          name: 'id',
          type: 'uuid',
          required: true,
          unique: true,
          indexed: true,
          aiExposed: false,
          mcpExposed: false,
        },
        {
          id: 'f2',
          name: 'listingId',
          type: 'foreign',
          required: true,
          unique: false,
          indexed: true,
          aiExposed: false,
          mcpExposed: false,
          refDocType: 'Listing',
        },
        {
          id: 'f3',
          name: 'queryStatus',
          type: 'enum',
          required: true,
          unique: false,
          indexed: false,
          aiExposed: false,
          mcpExposed: false,
          enumValues: ['OK', 'E001', 'E002', 'E003', 'E099'],
        },
        {
          id: 'f4',
          name: 'rawPayload',
          type: 'jsonb',
          required: false,
          unique: false,
          indexed: false,
          aiExposed: false,
          mcpExposed: false,
        },
      ],
    },
  ];
  return cachedDocTypes;
}

// --- Auth & Security (I03) — 60 user MFA + 24 risk events ---

let cachedMfa: UserMfa[] | null = null;
export function getUserMfa(): ReadonlyArray<UserMfa> {
  if (cachedMfa) return cachedMfa;
  initFakerSeed();
  const items: UserMfa[] = [];
  for (let i = 0; i < 60; i += 1) {
    const method = pickWithProb([
      ['passkey', 28],
      ['totp', 20],
      ['sms', 6],
      ['email', 4],
      ['none', 12],
    ] as const);
    items.push({
      userId: `usr_${(i + 1).toString().padStart(4, '0')}`,
      email: fakerTR.internet.email().toLowerCase(),
      method,
      passkeyCount: method === 'passkey' ? fakerTR.number.int({ min: 1, max: 3 }) : 0,
      riskScore: fakerTR.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      lastLoginAt: minutesAgo(fakerTR.number.int({ min: 1, max: 60 * 24 * 14 })),
    });
  }
  cachedMfa = items;
  return cachedMfa;
}

let cachedRisk: RiskEvent[] | null = null;
export function getRiskEvents(): ReadonlyArray<RiskEvent> {
  if (cachedRisk) return cachedRisk;
  initFakerSeed();
  const kinds: RiskEvent['kind'][] = [
    'unusual_geo',
    'impossible_travel',
    'tor_exit',
    'leaked_password',
    'brute_force',
    'session_hijack',
  ];
  const events: RiskEvent[] = [];
  for (let i = 0; i < 24; i += 1) {
    const kind = kinds[i % kinds.length] ?? 'unusual_geo';
    events.push({
      id: `risk_${(i + 1).toString().padStart(4, '0')}`,
      ts: minutesAgo(i * 17 + 4),
      userEmail: fakerTR.internet.email().toLowerCase(),
      kind,
      geo: pick(['İstanbul', 'Berlin', 'Moskova', 'Tahran', 'Bangkok', 'Rio', 'Lagos']),
      ip: `${fakerTR.number.int({ min: 1, max: 255 })}.${fakerTR.number.int({ min: 0, max: 255 })}.${fakerTR.number.int({ min: 0, max: 255 })}.${fakerTR.number.int({ min: 1, max: 255 })}`,
      action:
        kind === 'leaked_password' || kind === 'tor_exit'
          ? 'block'
          : kind === 'impossible_travel'
            ? 'step-up'
            : 'review',
    });
  }
  cachedRisk = events;
  return cachedRisk;
}

// --- Plugins + Security Findings ---

let cachedPlugins: Plugin[] | null = null;
export function getPlugins(): ReadonlyArray<Plugin> {
  if (cachedPlugins) return cachedPlugins;
  initFakerSeed();
  cachedPlugins = [
    {
      id: 'pl_001',
      name: 'TKGM Connector',
      version: '2.4.1',
      vendor: 'arsam.net',
      description: 'TKGM gateway proxy',
      status: 'installed',
      signed: true,
      installs: 240,
      rating: 4.8,
      scopes: ['tkgm.read', 'audit.write'],
    },
    {
      id: 'pl_002',
      name: 'KVKK DSAR Workflow',
      version: '1.7.0',
      vendor: 'arsam.net',
      description: 'DSAR otomasyon paketi',
      status: 'installed',
      signed: true,
      installs: 64,
      rating: 4.6,
      scopes: ['kvkk.read', 'kvkk.write'],
    },
    {
      id: 'pl_003',
      name: 'Stripe Billing',
      version: '3.2.0',
      vendor: 'Stripe Inc.',
      description: 'Abonelik + commission',
      status: 'available',
      signed: true,
      installs: 14_000,
      rating: 4.9,
      scopes: ['billing.read', 'billing.write'],
    },
    {
      id: 'pl_004',
      name: 'Slack Notifier',
      version: '1.1.2',
      vendor: 'Slack',
      description: 'Bildirim köprüsü',
      status: 'installed',
      signed: true,
      installs: 8400,
      rating: 4.5,
      scopes: ['notify.send'],
    },
    {
      id: 'pl_005',
      name: 'Sentry Errors',
      version: '0.9.1',
      vendor: 'Sentry',
      description: 'Hata izleme',
      status: 'installed',
      signed: true,
      installs: 12_000,
      rating: 4.7,
      scopes: ['logs.send'],
    },
    {
      id: 'pl_006',
      name: 'Iyzico Ödeme',
      version: '2.0.4',
      vendor: 'Iyzico',
      description: 'TR ödeme',
      status: 'available',
      signed: true,
      installs: 980,
      rating: 4.4,
      scopes: ['billing.write'],
    },
    {
      id: 'pl_007',
      name: 'Eski Plugin',
      version: '0.4.1',
      vendor: '3rd',
      description: 'İmzasız — block',
      status: 'review',
      signed: false,
      installs: 12,
      rating: 3.2,
      scopes: ['mcp.write'],
    },
    {
      id: 'pl_008',
      name: 'Tableau Bridge',
      version: '0.2.0',
      vendor: 'Salesforce',
      description: 'Analitik export',
      status: 'disabled',
      signed: true,
      installs: 220,
      rating: 3.8,
      scopes: ['reports.read'],
    },
  ];
  return cachedPlugins;
}

let cachedFindings: SecurityFinding[] | null = null;
export function getSecurityFindings(): ReadonlyArray<SecurityFinding> {
  if (cachedFindings) return cachedFindings;
  initFakerSeed();
  cachedFindings = [
    {
      id: 'sf_001',
      title: 'Eksik CSP rapor-uri',
      severity: 'medium',
      status: 'open',
      component: 'web-shell',
      discoveredAt: daysAgo(12),
      owner: 'sec@landx.test',
    },
    {
      id: 'sf_002',
      title: 'Audit hash chain manuel doğrulanmamış (90g)',
      severity: 'low',
      status: 'mitigated',
      component: 'audit',
      discoveredAt: daysAgo(95),
      owner: 'sec@landx.test',
    },
    {
      id: 'sf_003',
      title: 'Eski TLS 1.0 fallback',
      severity: 'high',
      status: 'open',
      component: 'api-gateway',
      discoveredAt: daysAgo(4),
      owner: 'ops@landx.test',
    },
    {
      id: 'sf_004',
      title: 'AI prompt injection PoC',
      severity: 'high',
      status: 'mitigated',
      component: 'ai-router',
      discoveredAt: daysAgo(30),
      owner: 'ai-team@landx.test',
    },
    {
      id: 'sf_005',
      title: 'Rate-limit hatası 5xx — TKGM',
      severity: 'low',
      status: 'fixed',
      component: 'tkgm-gateway',
      discoveredAt: daysAgo(50),
      owner: 'ops@landx.test',
    },
    {
      id: 'sf_006',
      title: 'Sentry DSN scope çok geniş',
      severity: 'medium',
      status: 'open',
      component: 'observability',
      discoveredAt: daysAgo(8),
      owner: 'sec@landx.test',
    },
  ];
  return cachedFindings;
}

// --- Pending Actions (AdminHome) ---

export function getPendingActions(): ReadonlyArray<PendingAction> {
  return [
    {
      id: 'pa_001',
      category: 'dsar',
      label: 'DSAR esra@example.tr — 16g kaldı',
      due: daysAgo(-16),
      severity: 'high',
      href: '/admin/pii',
    },
    {
      id: 'pa_002',
      category: 'verbis',
      label: 'VERBİS kayıt güncelle — 5g',
      due: daysAgo(-5),
      severity: 'critical',
      href: '/admin/compliance',
    },
    {
      id: 'pa_003',
      category: 'eca',
      label: '3 taslak ECA kuralı onay bekliyor',
      due: daysAgo(-3),
      severity: 'medium',
      href: '/admin/rules',
    },
    {
      id: 'pa_004',
      category: 'listing',
      label: '14 ilan moderasyon kuyruğunda',
      due: daysAgo(-1),
      severity: 'low',
      href: '/admin/approvals',
    },
    {
      id: 'pa_005',
      category: 'kyc',
      label: '6 KYC manuel inceleme',
      due: daysAgo(-2),
      severity: 'medium',
      href: '/admin/users',
    },
    {
      id: 'pa_006',
      category: 'offer',
      label: '22 açık teklif > 48s yanıtsız',
      due: daysAgo(-1),
      severity: 'low',
      href: '/broker/leads',
    },
  ];
}
