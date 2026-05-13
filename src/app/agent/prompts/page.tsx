import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const PROMPTS = [
  {
    id: 'pr_listing_desc',
    name: 'listing.description.generate',
    versions: 7,
    current: 'v7',
    eval: '92%',
    stage: 'prod',
  },
  {
    id: 'pr_valuation',
    name: 'valuation.summary',
    versions: 4,
    current: 'v4',
    eval: '88%',
    stage: 'prod',
  },
  {
    id: 'pr_lead_score',
    name: 'lead.scorer',
    versions: 12,
    current: 'v11',
    eval: '85%',
    stage: 'staging',
  },
  { id: 'pr_qa', name: 'qa.answer', versions: 8, current: 'v8', eval: '94%', stage: 'prod' },
];

export default function AgentPromptsPage() {
  return (
    <AgentPage
      surfaceKey="D7 · /agent/prompts"
      module="A06 Prompt Library"
      title="Prompts"
      description="Version history, eval suite, deploy stage (dev → staging → prod)."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {PROMPTS.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{p.id}</p>
                <p className="font-medium">{p.name}</p>
              </div>
              <Badge tone={p.stage === 'prod' ? 'success' : 'warning'} size="sm">
                {p.stage}
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <KV label="Versiyon" value={`${p.current} (${p.versions} toplam)`} />
                <KV label="Eval" value={p.eval} />
                <KV label="A/B winner" value="v7" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" tone="ghost" onClick={() => toast.show(`${p.name} diff viewer`)}>
                  Diff
                </Button>
                <Button
                  size="sm"
                  tone="ghost"
                  onClick={() => toast.success(`${p.name} eval rerun`)}
                >
                  Eval çalıştır
                </Button>
                <Button
                  size="sm"
                  onClick={() => toast.success(`${p.name} v${p.versions + 1} → staging`)}
                >
                  Deploy
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </AgentPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
      <p className="font-mono tabular-nums text-xs">{value}</p>
    </div>
  );
}
