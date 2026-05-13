// Persona definitions — drive PersonaSwitcher + useDemoIdentity.
// PROMPT R-01 (§4.4) + R-04 (§5.3 principal_subtype).

export type PrincipalSubtype =
  | 'individual'
  | 'broker'
  | 'broker-admin'
  | 'broker-agent'
  | 'system-operator';

export type PersonaKey = 'buyer' | 'seller' | 'broker-admin' | 'admin' | 'agent';

export type PersonaIdentity = {
  readonly key: PersonaKey;
  readonly label: string;
  readonly principalSubtype: PrincipalSubtype;
  readonly routePrefix: string;
  readonly userId: string;
  readonly tenantId: string;
  readonly displayName: string;
  readonly avatarColor: string;
  readonly description: string;
};

export const PERSONAS: Record<PersonaKey, PersonaIdentity> = {
  buyer: {
    key: 'buyer',
    label: 'Alıcı',
    principalSubtype: 'individual',
    routePrefix: '/',
    userId: 'usr_demo_buyer_001',
    tenantId: 'tenant_landx_default',
    displayName: 'Ayşe Demir',
    avatarColor: 'oklch(0.82 0.16 195)',
    description: 'Bireysel arsa alıcısı — public marketplace deneyimi',
  },
  seller: {
    key: 'seller',
    label: 'Satıcı',
    principalSubtype: 'individual',
    routePrefix: '/dashboard',
    userId: 'usr_demo_seller_001',
    tenantId: 'tenant_landx_default',
    displayName: 'Mehmet Yılmaz',
    avatarColor: 'oklch(0.88 0.20 135)',
    description: 'Bireysel satıcı/yatırımcı — kişisel dashboard',
  },
  'broker-admin': {
    key: 'broker-admin',
    label: 'Emlakçı',
    principalSubtype: 'broker-admin',
    routePrefix: '/broker',
    userId: 'usr_demo_broker_admin_001',
    tenantId: 'tenant_broker_office_001',
    displayName: 'Karaca Emlak — Yönetici',
    avatarColor: 'oklch(0.82 0.16 75)',
    description: 'Emlakçı ofis yöneticisi — portföy + takım + komisyon',
  },
  admin: {
    key: 'admin',
    label: 'Yönetici',
    principalSubtype: 'system-operator',
    routePrefix: '/admin',
    userId: 'usr_demo_admin_001',
    tenantId: 'tenant_landx_default',
    displayName: 'Sistem Operatörü',
    avatarColor: 'oklch(0.70 0.22 290)',
    description: 'Platform yöneticisi — Auto Admin UI',
  },
  agent: {
    key: 'agent',
    label: 'Agent Debugger',
    principalSubtype: 'system-operator',
    routePrefix: '/agent',
    userId: 'usr_demo_agent_001',
    tenantId: 'tenant_landx_default',
    displayName: 'MCP Debugger',
    avatarColor: 'oklch(0.72 0.25 340)',
    description: 'AI gözlemleme ve MCP tool debugger',
  },
};

export const PERSONA_ORDER: readonly PersonaKey[] = [
  'buyer',
  'seller',
  'broker-admin',
  'admin',
  'agent',
];

export const DEFAULT_PERSONA: PersonaKey = 'buyer';

// Conditional so the literal string is dead-code-eliminated in production builds
// (VITE_DEMO_MODE=false). Vite `define` replaces VITE_DEMO_MODE → esbuild folds
// the ternary → empty string remains. Demo builds keep the real key.
export const SESSION_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE ? 'landx_demo_persona' : '';
