// Admin / platform domain types. Surface C (admin) + agent backbone.

import type { TkgmStatusCode } from './tkgm';

// --- Tenant (I01) ---

export type TenantPlan = 'demo' | 'starter' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'provisioning' | 'archived';

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  createdAt: string;
  usage: {
    listings: number;
    users: number;
    storageGb: number;
    monthlyApiCalls: number;
  };
  quota: {
    listings: number;
    users: number;
    storageGb: number;
    monthlyApiCalls: number;
  };
  contact: { name: string; email: string };
};

// --- Feature Flag (K05) ---

export type FlagCategory = 'experiment' | 'kill-switch' | 'rollout' | 'permission' | 'ai';
export type FlagState = 'on' | 'off' | 'ramp' | 'targeted';

export type FeatureFlag = {
  key: string;
  description: string;
  category: FlagCategory;
  state: FlagState;
  rampPercent?: number;
  targets?: string[];
  updatedBy: string;
  updatedAt: string;
};

// --- Config & Secrets ---

export type ConfigEntry = {
  key: string;
  value: string;
  scope: 'global' | 'tenant' | 'user';
  source: 'env' | 'db' | 'override';
  masked: boolean;
  updatedAt: string;
};

// --- ECA Rule (K04) ---

export type EcaCondition = {
  field: string;
  op: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains' | 'regex';
  value: string | number | boolean | Array<string | number>;
};

export type EcaAction = {
  kind: 'notify' | 'mutate' | 'webhook' | 'agent-call' | 'workflow' | 'flag';
  target: string;
  params?: Record<string, string | number | boolean>;
};

export type EcaRule = {
  id: string;
  name: string;
  event: string;
  conditions: EcaCondition[];
  actions: EcaAction[];
  enabled: boolean;
  priority: number;
  aiGenerated: boolean;
  lastTriggeredAt?: string;
  triggerCount: number;
  createdAt: string;
};

export type EcaEvent = {
  id: string;
  ts: string;
  ruleId: string;
  ruleName: string;
  outcome: 'matched' | 'skipped' | 'error';
  durationMs: number;
};

// --- PII / DSAR (D02) ---

export type PiiClassification = 'public' | 'internal' | 'pii' | 'sensitive-pii' | 'special';
export type PiiField = {
  id: string;
  table: string;
  column: string;
  classification: PiiClassification;
  kvkkBasis: string; // m.5/2c, m.6, etc.
  retentionYears: number;
  maskRule: string;
  detectedBy: 'manual' | 'ai-scan';
  reviewedAt: string;
};

export type DsarKind = 'access' | 'erase' | 'rectify' | 'portability' | 'object';
export type DsarStatus = 'open' | 'in-progress' | 'fulfilled' | 'rejected' | 'expired';

export type DsarRequest = {
  id: string;
  kind: DsarKind;
  subjectName: string;
  subjectEmail: string;
  receivedAt: string;
  deadline: string;
  status: DsarStatus;
  scopeTables: string[];
  ownerEmail: string;
  notes?: string;
};

// --- Compliance (D03) ---

export type ComplianceFramework =
  | 'KVKK'
  | 'GDPR'
  | 'SOC2'
  | 'ISO27001'
  | 'VERBIS'
  | 'NIS2'
  | 'AI-Act';

export type ComplianceControl = {
  id: string;
  framework: ComplianceFramework;
  code: string;
  title: string;
  status: 'met' | 'partial' | 'unmet' | 'na';
  evidenceFreshDays: number;
  ownerEmail: string;
  lastReviewedAt: string;
  nextDueAt: string;
  notes?: string;
};

export type CompliancePosture = {
  overallScore: number; // 0..100
  byFramework: Array<{ framework: ComplianceFramework; score: number; gaps: number }>;
};

// --- SLO / Observability (O01) ---

export type Slo = {
  id: string;
  name: string;
  service: string;
  objective: number; // e.g. 99.9
  windowDays: 7 | 28 | 90;
  burnRate: number;
  errorBudgetRemaining: number; // 0..1
  status: 'healthy' | 'warning' | 'breach';
  trend: number[];
};

export type TraceSpan = {
  id: string;
  service: string;
  name: string;
  durationMs: number;
  startOffsetMs: number;
  status: 'ok' | 'error';
};

export type Trace = {
  id: string;
  ts: string;
  service: string;
  operation: string;
  durationMs: number;
  spanCount: number;
  status: 'ok' | 'error';
  spans: TraceSpan[];
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogEntry = {
  id: string;
  ts: string;
  level: LogLevel;
  service: string;
  message: string;
  traceId?: string;
};

// --- API Explorer (S01) ---

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ApiEndpoint = {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  authScope: 'public' | 'tenant' | 'admin' | 'agent';
  rateLimit: string;
  exampleRequest?: string;
  exampleResponse?: string;
  errorCodes?: string[];
};

// --- Module catalog (33 Excel modules) ---

export type ModuleLayer =
  | 'L0-Kernel'
  | 'L1-Identity'
  | 'L2-AI-Runtime'
  | 'L3-Application'
  | 'L4-Data-Compliance'
  | 'L5-Operations';

export type ModuleEntry = {
  id: string;
  code: string;
  name: string;
  layer: ModuleLayer;
  description: string;
  implStatus: 'full' | 'partial' | 'planned';
  aiEnabled: boolean;
  mcpEnabled: boolean;
  routes?: string[];
};

// --- Workflow Designer (S04) ---

export type WorkflowState = {
  id: string;
  label: string;
  kind: 'initial' | 'normal' | 'final';
};

export type WorkflowTransition = {
  id: string;
  from: string;
  to: string;
  trigger: string;
  guard?: string;
  action?: string;
  roles: string[];
  aiAssisted: boolean;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
};

// --- DocType Studio (K02) ---

export type FieldType =
  | 'uuid'
  | 'string'
  | 'text'
  | 'int'
  | 'decimal'
  | 'boolean'
  | 'datetime'
  | 'enum'
  | 'jsonb'
  | 'vector'
  | 'foreign'
  | 'file';

export type DocField = {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  aiExposed: boolean;
  mcpExposed: boolean;
  refDocType?: string;
  enumValues?: string[];
  vectorDim?: number;
};

export type DocType = {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  fields: DocField[];
  updatedAt: string;
};

// --- Auth & Security (I03) ---

export type MfaMethod = 'passkey' | 'totp' | 'sms' | 'email' | 'none';

export type UserMfa = {
  userId: string;
  email: string;
  method: MfaMethod;
  passkeyCount: number;
  riskScore: number;
  lastLoginAt: string;
};

export type RiskEventKind =
  | 'unusual_geo'
  | 'impossible_travel'
  | 'tor_exit'
  | 'leaked_password'
  | 'brute_force'
  | 'session_hijack';

export type RiskEvent = {
  id: string;
  ts: string;
  userEmail: string;
  kind: RiskEventKind;
  geo?: string;
  ip: string;
  action: 'block' | 'step-up' | 'review' | 'allow';
};

// --- Plugins (K01) + Security Reviews (O03) ---

export type PluginStatus = 'installed' | 'available' | 'disabled' | 'review';
export type Plugin = {
  id: string;
  name: string;
  version: string;
  vendor: string;
  description: string;
  status: PluginStatus;
  signed: boolean;
  installs: number;
  rating: number;
  scopes: string[];
};

export type SecurityFinding = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'mitigated' | 'accepted' | 'fixed';
  component: string;
  discoveredAt: string;
  owner: string;
};

// --- Pending Actions widget (AdminHome) ---

export type PendingAction = {
  id: string;
  category: 'dsar' | 'kvkk' | 'verbis' | 'eca' | 'kyc' | 'listing' | 'offer';
  label: string;
  due: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  href: string;
};

// --- TKGM monitoring summary ---

export type TkgmCodeBreakdown = {
  code: TkgmStatusCode;
  count: number;
};
