// Demo persona fixtures (R-01) — pre-seeded identity + tenant + permissions per persona.
// Used by useDemoIdentity hook and by MSW handlers to swap "logged in" user.

import { PERSONAS, type PersonaKey, type PrincipalSubtype } from '@/lib/auth/personas';

export type DemoUserFixture = {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly principalType: 'human';
  readonly principalSubtype: PrincipalSubtype;
  readonly tenantId: string;
  readonly permissions: ReadonlyArray<string>;
  readonly agentScopes: ReadonlyArray<string>;
};

const PERMISSION_PRESETS: Record<PrincipalSubtype, ReadonlyArray<string>> = {
  individual: [
    'listing:view',
    'listing:favorite',
    'listing:contact',
    'search:save',
    'profile:update',
  ],
  broker: [
    'listing:view',
    'listing:create',
    'listing:update',
    'lead:view',
    'lead:respond',
    'showcase:manage',
  ],
  'broker-admin': [
    'listing:view',
    'listing:create',
    'listing:update',
    'listing:delete',
    'lead:view',
    'lead:assign',
    'lead:respond',
    'broker:invite_member',
    'broker:set_permissions',
    'commission:view',
    'commission:configure',
    'showcase:manage',
    'subscription:manage',
    'team:manage',
  ],
  'broker-agent': [
    'listing:view',
    'listing:update',
    'lead:view_assigned',
    'lead:respond',
    'commission:view_own',
  ],
  'system-operator': [
    'tenant:manage',
    'user:manage',
    'plugin:manage',
    'doctype:manage',
    'audit:view',
    'compliance:view',
    'slo:view',
    'agent:debug',
  ],
};

const AGENT_SCOPE_PRESETS: Record<PrincipalSubtype, ReadonlyArray<string>> = {
  individual: ['search.execute', 'valuation.estimate', 'qa.ask'],
  broker: ['search.execute', 'valuation.estimate', 'description.generate', 'lead.score'],
  'broker-admin': [
    'search.execute',
    'valuation.estimate',
    'description.generate',
    'lead.score',
    'segment.clients',
    'follow_up.generate',
  ],
  'broker-agent': ['search.execute', 'qa.ask', 'follow_up.generate'],
  'system-operator': ['*'],
};

export const PERSONA_USER_FIXTURES: Record<PersonaKey, DemoUserFixture> = (() => {
  const result = {} as Record<PersonaKey, DemoUserFixture>;
  for (const key of Object.keys(PERSONAS) as PersonaKey[]) {
    const persona = PERSONAS[key];
    result[key] = {
      id: persona.userId,
      displayName: persona.displayName,
      email: `${persona.key}@arsam.net.demo`,
      principalType: 'human',
      principalSubtype: persona.principalSubtype,
      tenantId: persona.tenantId,
      permissions: PERMISSION_PRESETS[persona.principalSubtype],
      agentScopes: AGENT_SCOPE_PRESETS[persona.principalSubtype],
    };
  }
  return result;
})();
