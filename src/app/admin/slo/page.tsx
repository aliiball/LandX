import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const SLOS = [
  { name: 'API p95 latency', target: '< 300ms', current: '212ms', budget: 84, status: 'ok' },
  {
    name: 'Listing search availability',
    target: '99.9%',
    current: '99.94%',
    budget: 92,
    status: 'ok',
  },
  { name: 'AI valuation success', target: '> 95%', current: '97.2%', budget: 76, status: 'ok' },
  { name: 'Mock SSE reconnect', target: '< 1.5s', current: '2.1s', budget: 22, status: 'warn' },
];

export default function AdminSloPage() {
  return (
    <AdminPage
      surfaceKey="C15 · /admin/slo"
      module="O01 Observability"
      title="SLO Posture"
      actions={<Button onClick={() => toast.show('On-call schedule')}>On-call</Button>}
      kpis={[
        { label: 'SLO', value: '12', tone: 'cyan' },
        { label: 'OK', value: '11', tone: 'lime' },
        { label: 'At-risk', value: '1', tone: 'amber' },
        { label: 'Breached (30g)', value: '0', tone: 'lime' },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {SLOS.map((s) => (
          <Card key={s.name}>
            <CardHeader>
              <span className="font-medium">{s.name}</span>
              <Badge tone={s.status === 'ok' ? 'success' : 'warning'} size="sm" dot>
                {s.status}
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)]">Hedef</span>
                <span className="font-mono">{s.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-tertiary)]">Şu an</span>
                <span className="font-mono">{s.current}</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Error budget</span>
                  <span className="font-mono">%{s.budget}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-slate)]">
                  <div
                    className="h-full"
                    style={{
                      width: `${s.budget}%`,
                      background: s.budget > 50 ? 'var(--accent-lime)' : 'var(--accent-amber)',
                    }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
