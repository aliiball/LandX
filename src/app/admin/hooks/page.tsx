import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const EVENTS = [
  { ts: '01:24:33', event: 'listing.created', tenant: 'karaca-emlak', subs: 4 },
  { ts: '01:24:31', event: 'lead.assigned', tenant: 'karaca-emlak', subs: 2 },
  { ts: '01:24:29', event: 'valuation.completed', tenant: 'landx-tr', subs: 7 },
  { ts: '01:24:18', event: 'user.login', tenant: 'ege-arsa', subs: 1 },
  { ts: '01:24:12', event: 'commission.received', tenant: 'karaca-emlak', subs: 3 },
];

export default function AdminHooksPage() {
  return (
    <AdminPage
      surfaceKey="C8 · /admin/hooks"
      module="K04 Hook & Event Bus"
      title="Hooks & Events"
      kpis={[
        { label: 'Aktif hook', value: '48', tone: 'cyan' },
        { label: 'Event/dk', value: '124', tone: 'violet' },
        { label: 'Dead letter', value: '2', tone: 'amber' },
        { label: 'Latency p95', value: '32ms', tone: 'lime' },
      ]}
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Canlı event stream</span>
          <Badge tone="success" size="sm" dot>
            SSE bağlı
          </Badge>
        </CardHeader>
        <CardBody>
          <ul className="flex flex-col gap-1 font-mono text-xs">
            {EVENTS.map((e) => (
              <li
                key={`${e.ts}-${e.event}`}
                className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--surface-slate)]/40 px-2 py-1"
              >
                <span className="text-[var(--text-tertiary)]">{e.ts}</span>
                <span className="text-[var(--accent-cyan)]">{e.event}</span>
                <span className="text-[var(--text-secondary)]">{e.tenant}</span>
                <span className="text-[var(--text-tertiary)]">subs={e.subs}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Dead-letter queue</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2">
            <span>commission.refund — 2 başarısız teslim</span>
            <Button size="sm" tone="ghost" onClick={() => toast.success('Replay başlatıldı')}>
              Replay
            </Button>
          </div>
        </CardBody>
      </Card>
    </AdminPage>
  );
}
