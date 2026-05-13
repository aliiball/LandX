import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { GitFork } from 'lucide-react';

const WORKFLOWS = [
  {
    id: 'wf_listing_approve',
    name: 'İlan Onay Akışı',
    states: ['draft', 'review', 'approved', 'live'],
    active: 4,
  },
  {
    id: 'wf_broker_invite',
    name: 'Broker Davet',
    states: ['invited', 'kvkk', 'verified', 'active'],
    active: 7,
  },
  {
    id: 'wf_kvkk_dsar',
    name: 'KVKK DSAR Talep',
    states: ['received', 'classifying', 'fulfilled', 'closed'],
    active: 2,
  },
  {
    id: 'wf_commission_settle',
    name: 'Komisyon Mahsup',
    states: ['pending', 'invoice', 'tax', 'settled'],
    active: 3,
  },
];

export default function AdminWorkflowsPage() {
  return (
    <AdminPage
      surfaceKey="C11 · /admin/workflows"
      module="S04 State Machine"
      title="Workflows"
      actions={<Button onClick={() => toast.success('Workflow editor')}>+ Yeni</Button>}
      kpis={[
        { label: 'Workflow', value: '8', tone: 'cyan' },
        { label: 'Aktif iş', value: '24', tone: 'violet' },
        { label: 'HITL bekleyen', value: '3', tone: 'amber' },
        { label: 'Hata oranı', value: '0.2%', tone: 'lime' },
      ]}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {WORKFLOWS.map((wf) => (
          <Card key={wf.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={GitFork} tone="violet" />
                <span className="font-medium">{wf.name}</span>
              </div>
              <Badge tone="info" size="sm">
                {wf.active} aktif
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {wf.states.map((s, i) => (
                  <span key={s} className="inline-flex items-center gap-2">
                    <span className="rounded-[var(--radius-pill)] border border-[var(--stroke-default)] bg-[var(--surface-slate)] px-2 py-0.5 font-mono">
                      {s}
                    </span>
                    {i < wf.states.length - 1 && (
                      <span className="text-[var(--text-tertiary)]">→</span>
                    )}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
