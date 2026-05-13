import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const STEPS = [
  { id: 's1', label: 'Plan: kullanıcı niyetini parse et', status: 'done', tool: 'parse_query' },
  {
    id: 's2',
    label: 'Execute: search_listings(city=İzmir)',
    status: 'done',
    tool: 'search_listings',
  },
  { id: 's3', label: 'Reflect: sonuçlar yeterli mi?', status: 'done', tool: '—' },
  {
    id: 's4',
    label: 'Execute: valuation.estimate × 12',
    status: 'running',
    tool: 'valuation.estimate',
  },
  { id: 's5', label: 'Reflect: özet oluştur', status: 'pending', tool: '—' },
  { id: 's6', label: 'HITL: kullanıcıdan onay al', status: 'pending', tool: 'human_approval' },
];

export default function AgentWorkflowsPage() {
  return (
    <AgentPage
      surfaceKey="D10 · /agent/workflows"
      module="A09 Agent Orchestration"
      title="Plan-Execute-Reflect"
      description="Aktif iş akışları + HITL bekleyen kuyruk."
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Workflow run · wf_run_8a3f</span>
          <Badge tone="agent" size="sm" dot>
            running
          </Badge>
        </CardHeader>
        <CardBody>
          <ol className="flex flex-col gap-2">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-[var(--stroke-default)] bg-[var(--surface-slate)] font-mono text-xs">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2">
                  <p className="text-sm">{s.label}</p>
                  <p className="font-mono text-xs text-[var(--text-tertiary)]">{s.tool}</p>
                </div>
                <Badge
                  tone={
                    s.status === 'done' ? 'success' : s.status === 'running' ? 'info' : 'neutral'
                  }
                  size="sm"
                  dot
                >
                  {s.status}
                </Badge>
              </li>
            ))}
          </ol>
        </CardBody>
        <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
          <div className="flex gap-2">
            <Button onClick={() => toast.success('HITL onay verildi — workflow devam ediyor')}>
              HITL onayla
            </Button>
            <Button tone="ghost" onClick={() => toast.show('Workflow replay (branch)')}>
              Replay & branch
            </Button>
          </div>
        </CardBody>
      </Card>
    </AgentPage>
  );
}
