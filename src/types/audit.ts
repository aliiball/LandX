// Audit event domain — hash-chain enforced for tamper-evidence (D01 SLO: integrity 100%).

export type PrincipalType = 'individual' | 'org' | 'agent' | 'system' | 'service';
export type AuditSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type AuditEvent = {
  id: string;
  ts: string;
  principalType: PrincipalType;
  principalId: string;
  principalLabel: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip?: string;
  ua?: string;
  severity: AuditSeverity;
  tenant?: string;
  // Tamper-evident hash chain — `hash = sha256(prevHash || canonicalEventBody)`.
  hashPrev: string;
  hash: string;
  meta?: Record<string, string | number | boolean>;
};

export type AuditChainStatus = {
  total: number;
  verifiedAt: string;
  intact: boolean;
  brokenAt?: string;
};
