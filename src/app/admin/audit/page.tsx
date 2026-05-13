import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardHeader, Input, toast } from '@/components/ui';

const EVENTS = [
  {
    ts: '2026-05-14 01:24:33',
    actor: 'usr_001',
    action: 'listing.update',
    resource: 'lst_00012',
    hash: '8a3f...',
  },
  {
    ts: '2026-05-14 01:23:18',
    actor: 'agt_003',
    action: 'broker.assign_lead',
    resource: 'lead_0014',
    hash: '92bc...',
  },
  {
    ts: '2026-05-14 01:22:01',
    actor: 'system',
    action: 'kvkk.consent',
    resource: 'cli_0007',
    hash: '14fd...',
  },
  {
    ts: '2026-05-14 01:21:44',
    actor: 'usr_admin',
    action: 'tenant.suspend',
    resource: 't_004',
    hash: 'cc81...',
  },
  {
    ts: '2026-05-14 01:20:11',
    actor: 'agt_001',
    action: 'tool.invoke',
    resource: 'valuation.estimate',
    hash: 'a09e...',
  },
];

export default function AdminAuditPage() {
  return (
    <AdminPage
      surfaceKey="C12 · /admin/audit"
      module="D01 Audit Log"
      title="Audit Forensics"
      description="Append-only event log + hash chain verification."
      actions={
        <Button onClick={() => toast.success('Audit verification başarılı — hash zinciri sağlam')}>
          Hash chain doğrula
        </Button>
      }
      kpis={[
        { label: 'Olay (24h)', value: '14.2K', tone: 'cyan' },
        { label: 'Aktör', value: '286', tone: 'lime' },
        { label: 'Hash chain', value: 'OK', tone: 'lime' },
        { label: 'Anomaly', value: '0', tone: 'lime' },
      ]}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Input size="sm" placeholder="actor / action / resource" className="w-64" />
            <Button size="sm" onClick={() => toast.show('Filtre uygulandı')}>
              Ara
            </Button>
          </div>
        </CardHeader>
      </Card>
      <AdminTable
        columns={[
          { key: 'ts', label: 'Zaman' },
          { key: 'actor', label: 'Aktör' },
          { key: 'action', label: 'Action' },
          { key: 'resource', label: 'Kaynak' },
          { key: 'hash', label: 'Hash' },
        ]}
        rows={EVENTS.map((e) => ({
          ts: <span className="font-mono text-xs">{e.ts}</span>,
          actor: <span className="font-mono text-xs">{e.actor}</span>,
          action: (
            <Badge tone="info" size="sm">
              {e.action}
            </Badge>
          ),
          resource: <span className="font-mono text-xs">{e.resource}</span>,
          hash: <span className="font-mono text-xs text-[var(--text-tertiary)]">{e.hash}</span>,
        }))}
      />
    </AdminPage>
  );
}
