import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const AGENTS = [
  {
    id: 'agt_search',
    name: 'Search Bot',
    tier: 'production',
    scopes: ['listings.search', 'qa.ask'],
    sessions: 142,
    violations: 0,
  },
  {
    id: 'agt_val',
    name: 'Valuation Bot',
    tier: 'production',
    scopes: ['valuation.estimate'],
    sessions: 38,
    violations: 0,
  },
  {
    id: 'agt_qa',
    name: 'Q&A Bot',
    tier: 'production',
    scopes: ['qa.ask', 'listings.read'],
    sessions: 84,
    violations: 0,
  },
  {
    id: 'agt_desc',
    name: 'Description Bot',
    tier: 'staging',
    scopes: ['description.generate'],
    sessions: 12,
    violations: 1,
  },
];

export default function AgentAgentsPage() {
  return (
    <AgentPage
      surfaceKey="D4 · /agent/agents"
      module="A03 Agent Identity"
      title="Agents"
      description="Kimlik, capability scope, session limit, ihlal kayıtları."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {AGENTS.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{a.id}</p>
                <p className="font-medium">{a.name}</p>
              </div>
              <Badge tone={a.tier === 'production' ? 'success' : 'warning'} size="sm">
                {a.tier}
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  Scope
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {a.scopes.map((s) => (
                    <Badge key={s} tone="agent" size="sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <KV label="Aktif session" value={`${a.sessions}`} />
                <KV label="İhlal (7g)" value={`${a.violations}`} highlight={a.violations > 0} />
              </div>
              <Button size="sm" tone="ghost" onClick={() => toast.show(`${a.name} scope editor`)}>
                Scope düzenle
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </AgentPage>
  );
}

function KV({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
      <p className={`font-mono tabular-nums ${highlight ? 'text-[var(--danger)]' : ''}`}>{value}</p>
    </div>
  );
}
