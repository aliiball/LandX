import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const REVIEWS = [
  {
    id: 'rev_001',
    plugin: '@landx/maplibre-layers',
    submittedBy: 'community',
    sandbox: 'PASS',
    supplyChain: 'PASS',
    verdict: 'approve',
  },
  {
    id: 'rev_002',
    plugin: '@third-party/zenith-ai',
    submittedBy: 'partner',
    sandbox: 'WARN',
    supplyChain: 'PASS',
    verdict: 'review',
  },
  {
    id: 'rev_003',
    plugin: '@landx/kvkk-tools',
    submittedBy: 'internal',
    sandbox: 'PASS',
    supplyChain: 'PASS',
    verdict: 'approved',
  },
];

export default function AdminSecurityReviewsPage() {
  return (
    <AdminPage
      surfaceKey="C16 · /admin/security/reviews"
      module="O03 Security Review"
      title="Plugin Security Reviews"
      kpis={[
        { label: 'Bekleyen', value: '2', tone: 'amber' },
        { label: 'Onaylanan', value: '24', tone: 'lime' },
        { label: 'Reddedilen', value: '1', tone: 'magenta' },
        { label: 'Sandbox PASS', value: '%96', tone: 'lime' },
      ]}
    >
      <div className="grid gap-3">
        {REVIEWS.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{r.id}</p>
                <p className="font-medium">{r.plugin}</p>
                <p className="text-xs text-[var(--text-tertiary)]">Submitted by: {r.submittedBy}</p>
              </div>
              <Badge
                tone={
                  r.verdict === 'approved'
                    ? 'success'
                    : r.verdict === 'approve'
                      ? 'success'
                      : 'warning'
                }
                size="sm"
              >
                {r.verdict}
              </Badge>
            </CardHeader>
            <CardBody className="grid gap-3 sm:grid-cols-3">
              <Metric label="Sandbox test" status={r.sandbox} />
              <Metric label="Supply chain" status={r.supplyChain} />
              <div className="flex items-end justify-end gap-2">
                <Button size="sm" tone="ghost" onClick={() => toast.success(`${r.id} reddedildi`)}>
                  Reddet
                </Button>
                <Button size="sm" onClick={() => toast.success(`${r.id} onaylandı`)}>
                  Onayla
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}

function Metric({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <Badge tone={status === 'PASS' ? 'success' : 'warning'} size="sm" dot>
        {status}
      </Badge>
    </div>
  );
}
