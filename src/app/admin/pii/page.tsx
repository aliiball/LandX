import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const FIELDS = [
  { name: 'User.email', class: 'restricted', encrypted: true, count: 12400 },
  { name: 'User.phone', class: 'restricted', encrypted: true, count: 8700 },
  { name: 'Listing.ada', class: 'internal', encrypted: false, count: 240 },
  { name: 'TitleDeed.image', class: 'confidential', encrypted: true, count: 184 },
  { name: 'Lead.notes', class: 'internal', encrypted: false, count: 1200 },
  { name: 'Client.kvkkConsent', class: 'restricted', encrypted: true, count: 18 },
];

const DSAR = [
  { id: 'dsar_001', subject: 'Ahmet K.', kind: 'access', age: '2 saat' },
  { id: 'dsar_002', subject: 'Selin D.', kind: 'delete', age: '6 saat' },
  { id: 'dsar_003', subject: 'Cem B.', kind: 'portability', age: '1 gün' },
];

export default function AdminPiiPage() {
  return (
    <AdminPage
      surfaceKey="C13 · /admin/pii"
      module="D02 PII Governance"
      title="PII / DSAR"
      kpis={[
        { label: 'Sınıflandırılmış alan', value: '187/187', tone: 'lime' },
        { label: 'Şifreli', value: '124', tone: 'cyan' },
        { label: 'DSAR kuyruğu', value: '3', tone: 'amber' },
        { label: 'KVKK uyum', value: '%98', tone: 'lime' },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {(['public', 'internal', 'confidential', 'restricted'] as const).map((c) => {
          const count = FIELDS.filter((f) => f.class === c).length;
          return (
            <Card key={c} tone="solid">
              <CardBody className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-[var(--text-tertiary)]">{c}</p>
                  <p className="text-2xl font-semibold tabular-nums">{count}</p>
                </div>
                <Badge
                  tone={c === 'restricted' ? 'danger' : c === 'confidential' ? 'warning' : 'info'}
                  size="sm"
                >
                  {c}
                </Badge>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <span className="font-medium">Alan sınıflandırma</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          {FIELDS.map((f) => (
            <div
              key={f.name}
              className="flex items-center justify-between border-b border-[var(--stroke-subtle)] py-1.5 last:border-b-0"
            >
              <span className="font-mono">{f.name}</span>
              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    f.class === 'restricted'
                      ? 'danger'
                      : f.class === 'confidential'
                        ? 'warning'
                        : 'info'
                  }
                  size="sm"
                >
                  {f.class}
                </Badge>
                {f.encrypted && (
                  <Badge tone="success" size="sm" dot>
                    encrypted
                  </Badge>
                )}
                <span className="font-mono text-xs text-[var(--text-tertiary)]">{f.count}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">DSAR kuyruğu</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {DSAR.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2 text-sm"
            >
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{d.id}</p>
                <p>
                  {d.subject} · {d.kind}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-tertiary)]">{d.age}</span>
                <Button size="sm" onClick={() => toast.success(`${d.id} işleme alındı`)}>
                  İşle
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
