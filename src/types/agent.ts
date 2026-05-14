// Agent / MCP / AI runtime domain. Surface D + admin AI-Ops.

export type McpTransport = 'stdio' | 'sse' | 'http' | 'ws';
export type McpClientName =
  | 'Claude Desktop'
  | 'Cursor'
  | 'Cline'
  | 'Custom Agent'
  | 'Web Console'
  | 'CLI'
  | 'Slack Bot';

export type McpClient = {
  id: string;
  name: McpClientName;
  transport: McpTransport;
  protocolVersion: string;
  connectedAt: string;
  lastSeenAt: string;
  callsLast24h: number;
  status: 'connected' | 'idle' | 'disconnected';
};

export type McpResource = {
  uri: string;
  name: string;
  mimeType: string;
  description: string;
};

export type McpPromptTemplate = {
  id: string;
  name: string;
  description: string;
  args: string[];
};

// --- Tool Registry (A02) ---

export type ToolScope = 'read' | 'write' | 'admin' | 'agent';
export type ToolBlastRadius = 'cell' | 'row' | 'table' | 'tenant' | 'global';

export type Tool = {
  id: string;
  name: string;
  description: string;
  scope: ToolScope;
  sideEffect: 'none' | 'idempotent' | 'destructive';
  blastRadius: ToolBlastRadius;
  signed: boolean;
  mcpExposed: boolean;
  llmReadabilityScore: number; // 0..100
  callsPerDay: number;
  errorRatePercent: number;
};

// --- Memory Layer (A04) ---

export type MemoryKind = 'episodic' | 'semantic' | 'preference' | 'tool_use' | 'procedural';

export type MemoryEntry = {
  id: string;
  kind: MemoryKind;
  subjectId: string;
  content: string;
  importance: number; // 0..1
  ttlDays: number | 'never';
  createdAt: string;
  lastReadAt?: string;
  embedding?: number[];
};

// --- Vector Store (A05) ---

export type VectorIndex = {
  id: string;
  name: string;
  collection: string;
  dim: number;
  count: number;
  model: string;
  sizeMb: number;
  reindexingAt?: string;
  hybrid: boolean;
};

// --- Prompt Library (A06) ---

export type PromptVersion = {
  id: string;
  semver: string;
  active: boolean;
  body: string;
  evalScore: number;
  tokensAvg: number;
  rating: number;
  createdAt: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  versions: PromptVersion[];
  ab?: { a: string; b: string; winner?: 'a' | 'b' };
};

// --- LLM Providers (A07) ---

export type LlmProviderId =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'azure'
  | 'aws-bedrock'
  | 'mistral'
  | 'ollama'
  | 'meta';

export type LlmProvider = {
  id: string;
  providerId: LlmProviderId;
  model: string;
  contextWindow: number; // tokens
  pricingPerMTokensIn: number;
  pricingPerMTokensOut: number;
  latencyP95Ms: number;
  successRatePercent: number;
  monthlyCallsK: number;
  monthlyCostUsd: number;
  notes?: string;
};

// --- Orchestration (A09) ---

export type AgentRunStepKind =
  | 'plan'
  | 'tool_call'
  | 'reflect'
  | 'human_approval'
  | 'finalize'
  | 'error';

export type AgentRunStep = {
  id: string;
  kind: AgentRunStepKind;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'awaiting_human' | 'failed';
  durationMs?: number;
  tokens?: { in: number; out: number };
  cost?: number;
};

export type AgentRun = {
  id: string;
  name: string;
  agentId: string;
  triggeredBy: 'cron' | 'user' | 'webhook';
  startedAt: string;
  status: 'running' | 'completed' | 'awaiting_human' | 'failed';
  steps: AgentRunStep[];
  totalCost: number;
  totalTokens: { in: number; out: number };
};

// --- Conversations (A11) ---

export type ConversationRole = 'user' | 'assistant' | 'tool' | 'system';
export type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
  ts: string;
  toolName?: string;
  tokens?: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ConversationMessage[];
  model: string;
  totalTokens: number;
  cost: number;
};
