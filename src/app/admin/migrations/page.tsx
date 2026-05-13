import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const PENDING = [
  {
    id: 'mig_142',
    title: 'Listing.imarli: nullable → not-null',
    risk: 'low',
    suggestion: 'auto-backfill from imar_aciklama',
  },
  {
    id: 'mig_143',
    title: 'Lead.score: add column FLOAT default 0',
    risk: 'low',
    suggestion: 'safe',
  },
  {
    id: 'mig_144',
    title: 'Tenant.region: enum → table FK',
    risk: 'high',
    suggestion: 'staged, requires app pause',
  },
];

const APPLIED = [
  { id: 'mig_141', date: '2026-05-08', author: 'system', summary: 'Add Commission.payee_id FK' },
  {
    id: 'mig_140',
    date: '2026-05-02',
    author: 'karaca',
    summary: 'Broker.specialties JSONB → array',
  },
];

export default function AdminMigrationsPage() {
  return (
    <AdminPage
      surfaceKey="C7 · /admin/migrations"
      module="K03 Migration & Versioning"
      title="Migrations"
      kpis={[
        { label: 'Bekleyen', value: '3', tone: 'amber' },
        { label: 'Uygulanan (30g)', value: '14', tone: 'lime' },
        { label: 'Rollback', value: '0', tone: 'lime' },
        { label: 'AI Önerisi', value: '3', tone: 'violet' },
      ]}
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Bekleyen migration'lar</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {PENDING.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
            >
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{m.id}</p>
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-[var(--text-tertiary)]">AI önerisi: {m.suggestion}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={m.risk === 'high' ? 'danger' : 'success'} size="sm">
                  {m.risk}
                </Badge>
                <Button
                  size="sm"
                  tone="ghost"
                  onClick={() => toast.success(`${m.id} dry-run başarılı`)}
                >
                  Dry run
                </Button>
                <Button size="sm" onClick={() => toast.success(`${m.id} uygulandı`)}>
                  Uygula
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Geçmiş</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          {APPLIED.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border-b border-[var(--stroke-subtle)] py-1 last:border-b-0"
            >
              <span className="font-mono text-xs">{m.id}</span>
              <span>{m.summary}</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                {m.date} · {m.author}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
