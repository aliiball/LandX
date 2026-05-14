import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Input,
  Select,
  toast,
} from '@/components/ui';
import { getAuditChainStatus, getAuditEvents } from '@/mocks/seed/admin';
import type { AuditSeverity } from '@/types/audit';
import { Fingerprint, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

const SEVERITY_TONE: Record<AuditSeverity, 'info' | 'warning' | 'danger'> = {
  info: 'info',
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
};

export default function AdminAuditPage() {
  const events = getAuditEvents();
  const [q, setQ] = useState('');
  const [sev, setSev] = useState<'all' | AuditSeverity>('all');
  const [principal, setPrincipal] = useState<'all' | 'individual' | 'agent' | 'system' | 'service'>(
    'all',
  );
  const [range, setRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [chain, setChain] = useState(getAuditChainStatus());
  const [verifying, setVerifying] = useState(false);

  const filtered = useMemo(() => {
    const cutoff =
      range === '24h'
        ? 24 * 60
        : range === '7d'
          ? 7 * 24 * 60
          : range === '30d'
            ? 30 * 24 * 60
            : Number.POSITIVE_INFINITY;
    const now = Date.now();
    return events.filter((e) => {
      if (sev !== 'all' && e.severity !== sev) return false;
      if (principal !== 'all' && e.principalType !== principal) return false;
      if (
        q &&
        !e.action.toLowerCase().includes(q.toLowerCase()) &&
        !e.principalLabel.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      if ((now - new Date(e.ts).getTime()) / 60_000 > cutoff) return false;
      return true;
    });
  }, [events, q, sev, principal, range]);

  return (
    <AdminPage
      surfaceKey="C · /admin/audit"
      module="D01 Audit + Hash Chain"
      title="Audit Log"
      description="Tamper-evident audit zinciri. Action keyword tabanlı severity türetimi. KVKK m.12 kanıt."
      actions={
        <>
          <Button
            tone="agent"
            size="sm"
            loading={verifying}
            leftIcon={<Icon icon={ShieldCheck} size={14} />}
            onClick={async () => {
              setVerifying(true);
              await new Promise((r) => setTimeout(r, 1200));
              const next = getAuditChainStatus();
              setChain(next);
              setVerifying(false);
              toast.success(`Hash zinciri doğrulandı (${next.total} olay, intact=${next.intact}).`);
            }}
          >
            Hash zincirini doğrula
          </Button>
          <Button tone="ghost" size="sm" onClick={() => toast.show('CSV indiriliyor')}>
            CSV indir
          </Button>
        </>
      }
      kpis={[
        { label: 'Olay (toplam)', value: events.length.toLocaleString('tr-TR'), tone: 'cyan' },
        {
          label: 'Kritik',
          value: String(events.filter((e) => e.severity === 'critical').length),
          tone: 'magenta',
        },
        {
          label: 'Yüksek',
          value: String(events.filter((e) => e.severity === 'high').length),
          tone: 'amber',
        },
        {
          label: 'Hash chain',
          value: chain.intact ? 'INTACT' : 'BROKEN',
          tone: chain.intact ? 'lime' : 'magenta',
        },
        { label: 'Son doğrulama', value: ago(chain.verifiedAt), tone: 'cyan' },
      ]}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              leftSlot={<Icon icon={Search} size={14} />}
              placeholder="action / kullanıcı ara"
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
              size="sm"
            />
            <Select
              size="sm"
              value={sev}
              onChange={(e) => setSev(e.currentTarget.value as 'all' | AuditSeverity)}
              options={[
                { value: 'all', label: 'Tüm severity' },
                { value: 'info', label: 'info' },
                { value: 'low', label: 'low' },
                { value: 'medium', label: 'medium' },
                { value: 'high', label: 'high' },
                { value: 'critical', label: 'critical' },
              ]}
            />
            <Select
              size="sm"
              value={principal}
              onChange={(e) => setPrincipal(e.currentTarget.value as typeof principal)}
              options={[
                { value: 'all', label: 'Tüm principal' },
                { value: 'individual', label: 'individual' },
                { value: 'agent', label: 'agent' },
                { value: 'system', label: 'system' },
                { value: 'service', label: 'service' },
              ]}
            />
            <Select
              size="sm"
              value={range}
              onChange={(e) => setRange(e.currentTarget.value as typeof range)}
              options={[
                { value: '24h', label: 'Son 24sa' },
                { value: '7d', label: 'Son 7g' },
                { value: '30d', label: 'Son 30g' },
                { value: 'all', label: 'Hepsi' },
              ]}
            />
            <Badge tone="info" size="sm">
              {filtered.length} sonuç
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <AdminTable
            columns={[
              { key: 'ts', label: 'Zaman' },
              { key: 'sev', label: 'Severity' },
              { key: 'action', label: 'Action' },
              { key: 'principal', label: 'Principal' },
              { key: 'res', label: 'Resource' },
              { key: 'hash', label: 'Hash', align: 'right' },
            ]}
            rows={filtered.slice(0, 80).map((e) => ({
              ts: (
                <span className="font-mono text-xs">{new Date(e.ts).toLocaleString('tr-TR')}</span>
              ),
              sev: (
                <Badge tone={SEVERITY_TONE[e.severity]} size="sm">
                  {e.severity}
                </Badge>
              ),
              action: <span className="font-mono text-xs">{e.action}</span>,
              principal: (
                <div className="flex items-center gap-2">
                  <Badge
                    size="sm"
                    tone={
                      e.principalType === 'agent'
                        ? 'agent'
                        : e.principalType === 'system'
                          ? 'warning'
                          : 'info'
                    }
                  >
                    {e.principalType}
                  </Badge>
                  <span className="text-xs">{e.principalLabel}</span>
                </div>
              ),
              res: (
                <span className="font-mono text-xs">
                  {e.resource}/{e.resourceId ?? '-'}
                </span>
              ),
              hash: (
                <span className="flex items-center justify-end gap-1 font-mono text-[10px] text-[var(--text-tertiary)]">
                  <Icon icon={Fingerprint} size={12} />
                  {e.hash.slice(0, 12)}…
                </span>
              ),
            }))}
          />
        </CardBody>
      </Card>

      <Card tone="solid">
        <CardBody className="flex flex-wrap items-center gap-3 text-sm">
          <Icon icon={ShieldCheck} tone="lime" />
          <span className="font-medium">Hash zinciri tutarlı.</span>
          <span className="text-[var(--text-secondary)]">
            Son doğrulama: {new Date(chain.verifiedAt).toLocaleString('tr-TR')} ·{' '}
            {chain.total.toLocaleString('tr-TR')} olay ·{' '}
            <span className="font-mono">prevHash → SHA256(prevHash || body)</span>
          </span>
        </CardBody>
      </Card>
    </AdminPage>
  );
}

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 60) return `${min}dk önce`;
  return `${Math.round(min / 60)}sa önce`;
}
