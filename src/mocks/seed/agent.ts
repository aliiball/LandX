// Agent / MCP / AI runtime seed (deterministic).
// Generates: 7 MCP clients, 6 resources, 5 prompts (template), 12 tools, 60 memory entries,
// 4 vector indexes, 7 LLM providers (2026-Q2 catalog), 6 prompt templates with A/B,
// 4 agent runs (plan/execute/reflect with HITL), 8 conversations.

import type {
  AgentRun,
  AgentRunStep,
  Conversation,
  ConversationMessage,
  LlmProvider,
  McpClient,
  McpPromptTemplate,
  McpResource,
  MemoryEntry,
  PromptTemplate,
  Tool,
  VectorIndex,
} from '@/types/agent';
import { fakerTR, initFakerSeed } from './faker-config';

function minutesAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

// --- MCP (A01) ---

let cachedMcpClients: McpClient[] | null = null;
export function getMcpClients(): ReadonlyArray<McpClient> {
  if (cachedMcpClients) return cachedMcpClients;
  initFakerSeed();
  cachedMcpClients = [
    {
      id: 'mcp_c1',
      name: 'Claude Desktop',
      transport: 'stdio',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(180),
      lastSeenAt: minutesAgo(1),
      callsLast24h: 412,
      status: 'connected',
    },
    {
      id: 'mcp_c2',
      name: 'Cursor',
      transport: 'http',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(240),
      lastSeenAt: minutesAgo(3),
      callsLast24h: 286,
      status: 'connected',
    },
    {
      id: 'mcp_c3',
      name: 'Cline',
      transport: 'sse',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(480),
      lastSeenAt: minutesAgo(8),
      callsLast24h: 124,
      status: 'connected',
    },
    {
      id: 'mcp_c4',
      name: 'Custom Agent',
      transport: 'ws',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(120),
      lastSeenAt: minutesAgo(2),
      callsLast24h: 84,
      status: 'connected',
    },
    {
      id: 'mcp_c5',
      name: 'Web Console',
      transport: 'sse',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(60),
      lastSeenAt: minutesAgo(0),
      callsLast24h: 220,
      status: 'connected',
    },
    {
      id: 'mcp_c6',
      name: 'CLI',
      transport: 'stdio',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(1440),
      lastSeenAt: minutesAgo(720),
      callsLast24h: 8,
      status: 'idle',
    },
    {
      id: 'mcp_c7',
      name: 'Slack Bot',
      transport: 'http',
      protocolVersion: '2024-11-05',
      connectedAt: minutesAgo(2880),
      lastSeenAt: minutesAgo(900),
      callsLast24h: 0,
      status: 'disconnected',
    },
  ];
  return cachedMcpClients;
}

export function getMcpResources(): ReadonlyArray<McpResource> {
  return [
    {
      uri: 'landx://listings',
      name: 'Listings',
      mimeType: 'application/json',
      description: 'Aktif arsa ilanları koleksiyonu',
    },
    {
      uri: 'landx://users',
      name: 'Users',
      mimeType: 'application/json',
      description: 'Tenant kapsamlı kullanıcı kayıtları',
    },
    {
      uri: 'landx://schema/listing',
      name: 'Listing Schema',
      mimeType: 'application/json',
      description: 'DocType K02 üretimi şema',
    },
    {
      uri: 'landx://docs/kvkk',
      name: 'KVKK Politika',
      mimeType: 'text/markdown',
      description: 'Sürüm v3.2 yürürlükteki KVKK dokümanı',
    },
    {
      uri: 'landx://reports/sales-weekly',
      name: 'Haftalık Satış Raporu',
      mimeType: 'text/csv',
      description: 'Son 7 gün satış özetleri',
    },
    {
      uri: 'landx://eca/rules',
      name: 'ECA Rules',
      mimeType: 'application/json',
      description: 'Aktif ECA kural seti (K04)',
    },
  ];
}

export function getMcpPrompts(): ReadonlyArray<McpPromptTemplate> {
  return [
    {
      id: 'mp_summary',
      name: 'summarize-listing',
      description: 'Bir ilanın AI özetini üretir',
      args: ['listingId'],
    },
    {
      id: 'mp_compare',
      name: 'compare-listings',
      description: '2-4 ilan arasında karşılaştırma',
      args: ['ids[]'],
    },
    {
      id: 'mp_risk',
      name: 'risk-score',
      description: 'Tapu / TKGM risk değerlendirmesi',
      args: ['listingId'],
    },
    {
      id: 'mp_lead',
      name: 'lead-followup',
      description: 'Lead için takip mesajı önerir',
      args: ['leadId', 'tone'],
    },
    {
      id: 'mp_dsar',
      name: 'dsar-acknowledgement',
      description: 'DSAR kabul yanıtı taslağı',
      args: ['requestId'],
    },
  ];
}

// --- Tool Registry (A02) — 12 tools ---

let cachedTools: Tool[] | null = null;
export function getTools(): ReadonlyArray<Tool> {
  if (cachedTools) return cachedTools;
  initFakerSeed();
  cachedTools = [
    {
      id: 'tl_search_listings',
      name: 'search_listings',
      description: 'NL + filter tabanlı ilan arama',
      scope: 'read',
      sideEffect: 'none',
      blastRadius: 'row',
      signed: true,
      mcpExposed: true,
      llmReadabilityScore: 92,
      callsPerDay: 1840,
      errorRatePercent: 0.4,
    },
    {
      id: 'tl_get_listing',
      name: 'get_listing',
      description: 'Tekil ilan detay',
      scope: 'read',
      sideEffect: 'none',
      blastRadius: 'row',
      signed: true,
      mcpExposed: true,
      llmReadabilityScore: 95,
      callsPerDay: 980,
      errorRatePercent: 0.2,
    },
    {
      id: 'tl_value_listing',
      name: 'value_listing',
      description: 'AI değerleme tahmini',
      scope: 'agent',
      sideEffect: 'idempotent',
      blastRadius: 'row',
      signed: true,
      mcpExposed: true,
      llmReadabilityScore: 88,
      callsPerDay: 220,
      errorRatePercent: 1.1,
    },
    {
      id: 'tl_tkgm_verify',
      name: 'tkgm_verify',
      description: 'TKGM doğrulama (E001-E099)',
      scope: 'agent',
      sideEffect: 'idempotent',
      blastRadius: 'row',
      signed: true,
      mcpExposed: true,
      llmReadabilityScore: 84,
      callsPerDay: 140,
      errorRatePercent: 4.2,
    },
    {
      id: 'tl_create_listing',
      name: 'create_listing',
      description: 'Yeni ilan oluştur',
      scope: 'write',
      sideEffect: 'idempotent',
      blastRadius: 'row',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 80,
      callsPerDay: 36,
      errorRatePercent: 0.8,
    },
    {
      id: 'tl_send_message',
      name: 'send_message',
      description: 'Thread içine mesaj',
      scope: 'write',
      sideEffect: 'idempotent',
      blastRadius: 'row',
      signed: true,
      mcpExposed: true,
      llmReadabilityScore: 90,
      callsPerDay: 280,
      errorRatePercent: 0.6,
    },
    {
      id: 'tl_open_dsar',
      name: 'open_dsar',
      description: 'KVKK m.11 talep aç',
      scope: 'admin',
      sideEffect: 'idempotent',
      blastRadius: 'tenant',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 78,
      callsPerDay: 4,
      errorRatePercent: 0,
    },
    {
      id: 'tl_archive_listing',
      name: 'archive_listing',
      description: 'İlan arşivle',
      scope: 'write',
      sideEffect: 'idempotent',
      blastRadius: 'row',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 82,
      callsPerDay: 18,
      errorRatePercent: 0.4,
    },
    {
      id: 'tl_delete_listing',
      name: 'delete_listing',
      description: 'İlan kalıcı sil — destructive',
      scope: 'admin',
      sideEffect: 'destructive',
      blastRadius: 'row',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 70,
      callsPerDay: 2,
      errorRatePercent: 0,
    },
    {
      id: 'tl_run_eca',
      name: 'run_eca',
      description: 'ECA kural değerlendir',
      scope: 'agent',
      sideEffect: 'idempotent',
      blastRadius: 'tenant',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 86,
      callsPerDay: 720,
      errorRatePercent: 0.3,
    },
    {
      id: 'tl_flag_toggle',
      name: 'flag_toggle',
      description: 'Feature flag toggle',
      scope: 'admin',
      sideEffect: 'destructive',
      blastRadius: 'global',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 76,
      callsPerDay: 6,
      errorRatePercent: 0,
    },
    {
      id: 'tl_audit_verify',
      name: 'audit_verify',
      description: 'Hash zinciri doğrula',
      scope: 'admin',
      sideEffect: 'none',
      blastRadius: 'global',
      signed: true,
      mcpExposed: false,
      llmReadabilityScore: 88,
      callsPerDay: 24,
      errorRatePercent: 0,
    },
  ];
  return cachedTools;
}

// --- Memory Layer (A04) — 60 entries ---

let cachedMemory: MemoryEntry[] | null = null;
export function getMemoryEntries(): ReadonlyArray<MemoryEntry> {
  if (cachedMemory) return cachedMemory;
  initFakerSeed();
  const kinds: MemoryEntry['kind'][] = [
    'episodic',
    'semantic',
    'preference',
    'tool_use',
    'procedural',
  ];
  const entries: MemoryEntry[] = [];
  for (let i = 0; i < 60; i += 1) {
    const kind = kinds[i % kinds.length] ?? 'episodic';
    entries.push({
      id: `mem_${(i + 1).toString().padStart(4, '0')}`,
      kind,
      subjectId: `usr_${((i % 12) + 1).toString().padStart(4, '0')}`,
      content:
        kind === 'episodic'
          ? `Kullanıcı ${i + 1} dk önce ${fakerTR.lorem.sentence({ min: 5, max: 10 })}`
          : kind === 'semantic'
            ? `Bilgi: ${fakerTR.lorem.sentence({ min: 6, max: 12 })}`
            : kind === 'preference'
              ? `Tercih: bildirimler ${fakerTR.helpers.arrayElement(['sessiz', 'sesli', 'sadece-acil'])}`
              : kind === 'tool_use'
                ? `tool=search_listings used ${fakerTR.number.int({ min: 2, max: 18 })}× son 30g`
                : 'Süreç: KVKK DSAR akışı 3 adımda tamamlanır',
      importance: fakerTR.number.float({ min: 0.2, max: 0.95, fractionDigits: 2 }),
      ttlDays: kind === 'episodic' ? 30 : kind === 'preference' ? 'never' : 180,
      createdAt: minutesAgo(i * 18 + 2),
      lastReadAt: minutesAgo(fakerTR.number.int({ min: 1, max: 24 * 60 })),
    });
  }
  cachedMemory = entries;
  return cachedMemory;
}

// --- Vector Store (A05) — 4 indexes ---

export function getVectorIndexes(): ReadonlyArray<VectorIndex> {
  return [
    {
      id: 'vec_listing_text',
      name: 'listing.text',
      collection: 'listings',
      dim: 1536,
      count: 12_400,
      model: 'text-embedding-3-large',
      sizeMb: 142,
      hybrid: true,
    },
    {
      id: 'vec_listing_image',
      name: 'listing.image',
      collection: 'listings.media',
      dim: 512,
      count: 38_200,
      model: 'clip-ViT-L/14',
      sizeMb: 218,
      hybrid: false,
    },
    {
      id: 'vec_message',
      name: 'message',
      collection: 'messages',
      dim: 768,
      count: 96_400,
      model: 'e5-large-v2',
      sizeMb: 612,
      hybrid: true,
      reindexingAt: minutesAgo(8),
    },
    {
      id: 'vec_eca_rule',
      name: 'eca.rule',
      collection: 'eca_rules',
      dim: 768,
      count: 24,
      model: 'e5-small-v2',
      sizeMb: 0.4,
      hybrid: false,
    },
  ];
}

// --- LLM Providers (A07) — 7 (2026-Q2 catalog) ---

export function getLlmProviders(): ReadonlyArray<LlmProvider> {
  return [
    {
      id: 'lp_opus47',
      providerId: 'anthropic',
      model: 'claude-opus-4-7',
      contextWindow: 1_000_000,
      pricingPerMTokensIn: 15,
      pricingPerMTokensOut: 75,
      latencyP95Ms: 6800,
      successRatePercent: 99.8,
      monthlyCallsK: 86,
      monthlyCostUsd: 2840,
      notes: 'Default router öncelikli; 1M context demo',
    },
    {
      id: 'lp_sonnet46',
      providerId: 'anthropic',
      model: 'claude-sonnet-4-6',
      contextWindow: 200_000,
      pricingPerMTokensIn: 3,
      pricingPerMTokensOut: 15,
      latencyP95Ms: 1800,
      successRatePercent: 99.9,
      monthlyCallsK: 240,
      monthlyCostUsd: 1480,
    },
    {
      id: 'lp_haiku45',
      providerId: 'anthropic',
      model: 'claude-haiku-4-5-20251001',
      contextWindow: 200_000,
      pricingPerMTokensIn: 0.8,
      pricingPerMTokensOut: 4,
      latencyP95Ms: 420,
      successRatePercent: 99.9,
      monthlyCallsK: 1840,
      monthlyCostUsd: 720,
    },
    {
      id: 'lp_gpt5pro',
      providerId: 'openai',
      model: 'gpt-5-pro',
      contextWindow: 256_000,
      pricingPerMTokensIn: 12,
      pricingPerMTokensOut: 48,
      latencyP95Ms: 2900,
      successRatePercent: 99.6,
      monthlyCallsK: 124,
      monthlyCostUsd: 1980,
    },
    {
      id: 'lp_gem25',
      providerId: 'google',
      model: 'gemini-2.5-pro',
      contextWindow: 2_000_000,
      pricingPerMTokensIn: 7,
      pricingPerMTokensOut: 21,
      latencyP95Ms: 3200,
      successRatePercent: 99.4,
      monthlyCallsK: 78,
      monthlyCostUsd: 720,
    },
    {
      id: 'lp_llama4',
      providerId: 'meta',
      model: 'llama-4-405b',
      contextWindow: 128_000,
      pricingPerMTokensIn: 2,
      pricingPerMTokensOut: 6,
      latencyP95Ms: 1400,
      successRatePercent: 99.2,
      monthlyCallsK: 220,
      monthlyCostUsd: 420,
      notes: 'Self-host (ollama)',
    },
    {
      id: 'lp_mistral3',
      providerId: 'mistral',
      model: 'mistral-large-3',
      contextWindow: 128_000,
      pricingPerMTokensIn: 4,
      pricingPerMTokensOut: 12,
      latencyP95Ms: 1200,
      successRatePercent: 99.5,
      monthlyCallsK: 48,
      monthlyCostUsd: 320,
    },
  ];
}

// --- Prompt Library (A06) — 6 templates ---

export function getPromptTemplates(): ReadonlyArray<PromptTemplate> {
  return [
    {
      id: 'pt_value',
      name: 'Listing değerleme açıklayıcısı',
      description: 'AI değerleme + faktör breakdown',
      versions: [
        {
          id: 'v1',
          semver: '1.0.0',
          active: false,
          body: '...',
          evalScore: 78,
          tokensAvg: 240,
          rating: 4.1,
          createdAt: daysAgo(180),
        },
        {
          id: 'v2',
          semver: '2.0.0',
          active: true,
          body: '...',
          evalScore: 88,
          tokensAvg: 280,
          rating: 4.6,
          createdAt: daysAgo(28),
        },
      ],
      ab: { a: 'v1', b: 'v2', winner: 'b' },
    },
    {
      id: 'pt_compare',
      name: 'İlan karşılaştırma özeti',
      description: '4 ilana kadar best-of',
      versions: [
        {
          id: 'v1',
          semver: '1.0.0',
          active: true,
          body: '...',
          evalScore: 84,
          tokensAvg: 310,
          rating: 4.5,
          createdAt: daysAgo(46),
        },
      ],
    },
    {
      id: 'pt_risk',
      name: 'Tapu / TKGM risk skoru',
      description: 'Risk açıklaması (LIME-vari)',
      versions: [
        {
          id: 'v1',
          semver: '0.9.0',
          active: false,
          body: '...',
          evalScore: 70,
          tokensAvg: 220,
          rating: 4.0,
          createdAt: daysAgo(60),
        },
        {
          id: 'v2',
          semver: '1.0.0',
          active: true,
          body: '...',
          evalScore: 86,
          tokensAvg: 260,
          rating: 4.7,
          createdAt: daysAgo(8),
        },
      ],
      ab: { a: 'v1', b: 'v2', winner: 'b' },
    },
    {
      id: 'pt_lead',
      name: 'Lead takip mesajı',
      description: 'Tone-aware reply suggester',
      versions: [
        {
          id: 'v1',
          semver: '1.2.0',
          active: true,
          body: '...',
          evalScore: 81,
          tokensAvg: 140,
          rating: 4.4,
          createdAt: daysAgo(14),
        },
      ],
    },
    {
      id: 'pt_listing_desc',
      name: 'AI ilan açıklaması (wizard)',
      description: '6-adım wizard içi açıklama gen',
      versions: [
        {
          id: 'v1',
          semver: '1.0.0',
          active: false,
          body: '...',
          evalScore: 79,
          tokensAvg: 320,
          rating: 4.2,
          createdAt: daysAgo(90),
        },
        {
          id: 'v2',
          semver: '1.5.0',
          active: true,
          body: '...',
          evalScore: 91,
          tokensAvg: 290,
          rating: 4.8,
          createdAt: daysAgo(4),
        },
      ],
      ab: { a: 'v1', b: 'v2', winner: 'b' },
    },
    {
      id: 'pt_kvkk_ack',
      name: 'KVKK / DSAR ack',
      description: 'Otomatik kabul yanıtı',
      versions: [
        {
          id: 'v1',
          semver: '1.0.0',
          active: true,
          body: '...',
          evalScore: 92,
          tokensAvg: 110,
          rating: 4.9,
          createdAt: daysAgo(30),
        },
      ],
    },
  ];
}

// --- Agent Runs (A09) — 4 ---

function step(
  kind: AgentRunStep['kind'],
  label: string,
  status: AgentRunStep['status'],
  durationMs?: number,
  inTok?: number,
  outTok?: number,
  cost?: number,
): AgentRunStep {
  return {
    id: Math.random().toString(36).slice(2, 9),
    kind,
    label,
    status,
    durationMs,
    tokens: inTok || outTok ? { in: inTok ?? 0, out: outTok ?? 0 } : undefined,
    cost,
  };
}

export function getAgentRuns(): ReadonlyArray<AgentRun> {
  return [
    {
      id: 'run_001',
      name: 'admin-ops cron — daily compliance check',
      agentId: 'agt_admin_ops',
      triggeredBy: 'cron',
      startedAt: minutesAgo(40),
      status: 'completed',
      steps: [
        step(
          'plan',
          'KVKK DSAR + VERBİS taraması planı oluştur',
          'completed',
          1200,
          280,
          320,
          0.08,
        ),
        step('tool_call', 'audit_verify chain integrity', 'completed', 480, 80, 40, 0.02),
        step('tool_call', 'open_dsar (no new)', 'completed', 240, 60, 20, 0.01),
        step('reflect', 'Sonuçları yorumla', 'completed', 800, 320, 240, 0.06),
        step('finalize', 'Rapor yaz + cmt log', 'completed', 320, 100, 60, 0.02),
      ],
      totalCost: 0.19,
      totalTokens: { in: 840, out: 680 },
    },
    {
      id: 'run_002',
      name: 'seller-assist — autodescribe 14 ilan',
      agentId: 'agt_seller_helper',
      triggeredBy: 'user',
      startedAt: minutesAgo(12),
      status: 'awaiting_human',
      steps: [
        step('plan', 'Eksik açıklama tespit', 'completed', 200, 60, 40, 0.01),
        step('tool_call', 'search_listings (drafts)', 'completed', 320, 90, 20, 0.01),
        step('tool_call', 'value_listing × 14', 'completed', 4800, 1400, 2200, 0.34),
        step('tool_call', 'create description × 14', 'completed', 6200, 1800, 5200, 0.62),
        step('human_approval', '14 açıklamayı toplu onayla', 'awaiting_human'),
        step('finalize', 'Yayına gönder', 'pending'),
      ],
      totalCost: 0.98,
      totalTokens: { in: 3350, out: 7460 },
    },
    {
      id: 'run_003',
      name: 'buyer-helper — Beykoz arsa öneri',
      agentId: 'agt_buyer_companion',
      triggeredBy: 'user',
      startedAt: minutesAgo(6),
      status: 'running',
      steps: [
        step('plan', 'Beykoz 5000+ m² imarlı arama planı', 'completed', 280, 100, 60, 0.02),
        step('tool_call', 'search_listings (Beykoz)', 'completed', 420, 120, 80, 0.02),
        step('reflect', 'Top 3 ile karşılaştırma', 'running'),
        step('finalize', 'Özet + e-posta hazırla', 'pending'),
      ],
      totalCost: 0.04,
      totalTokens: { in: 220, out: 140 },
    },
    {
      id: 'run_004',
      name: 'eca-runner — tkgm.failed → pasifle',
      agentId: 'agt_eca_runner',
      triggeredBy: 'webhook',
      startedAt: minutesAgo(2),
      status: 'failed',
      steps: [
        step('plan', 'Failed TKGM kayıtlarını topla', 'completed', 80, 20, 10, 0.0),
        step('tool_call', 'archive_listing × 2', 'failed', 220, 40, 20, 0.0),
      ],
      totalCost: 0.0,
      totalTokens: { in: 60, out: 30 },
    },
  ];
}

// --- Conversations (A11) — 8 short ---

function msg(role: ConversationMessage['role'], content: string, ts: string): ConversationMessage {
  return { id: Math.random().toString(36).slice(2, 9), role, content, ts };
}

export function getConversations(): ReadonlyArray<Conversation> {
  return [
    {
      id: 'cv_001',
      title: 'Beykoz arsa karşılaştırma',
      model: 'claude-sonnet-4-6',
      totalTokens: 1840,
      cost: 0.04,
      messages: [
        msg('user', 'Beykoz’da 5000+ m² imarlı 2.5M altı arsa öner', minutesAgo(18)),
        msg('assistant', '3 ilan buldum. Detayları analiz ediyorum...', minutesAgo(17)),
        msg('tool', 'search_listings → 3 sonuç', minutesAgo(17)),
        msg(
          'assistant',
          'En uygun ilan #lst_00214 — değerleme range %12 alt sınır altında.',
          minutesAgo(16),
        ),
      ],
    },
    {
      id: 'cv_002',
      title: 'KVKK DSAR şablonu',
      model: 'claude-haiku-4-5',
      totalTokens: 620,
      cost: 0.01,
      messages: [
        msg('user', 'DSAR ack yazısı oluştur', minutesAgo(50)),
        msg('assistant', 'Versiyon 1.0.0 ile yazıldı. 30g sayaç başlatıldı.', minutesAgo(49)),
      ],
    },
  ];
}
