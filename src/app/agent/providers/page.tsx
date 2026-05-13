import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const PROVIDERS = [
  {
    name: 'Anthropic',
    model: 'claude-sonnet-4.6',
    share: 64,
    cost: '$18.20',
    latency: '420ms',
    status: 'OK',
  },
  { name: 'OpenAI', model: 'gpt-4.1', share: 22, cost: '$6.40', latency: '540ms', status: 'OK' },
  { name: 'Azure', model: 'gpt-4o', share: 9, cost: '$2.80', latency: '610ms', status: 'OK' },
  {
    name: 'Bedrock',
    model: 'claude-haiku-4.5',
    share: 4,
    cost: '$0.80',
    latency: '210ms',
    status: 'OK',
  },
  {
    name: 'Ollama',
    model: 'llama-3.1-70b',
    share: 1,
    cost: '$0.20',
    latency: '1.4s',
    status: 'fallback',
  },
];

export default function AgentProvidersPage() {
  return (
    <AgentPage
      surfaceKey="D8 · /agent/providers"
      module="A07 LLM Provider"
      title="Providers"
      description="Routing rules, fallback chain, cost trend."
      actions={<Button onClick={() => toast.success('Routing rule editor')}>Routing kuralı</Button>}
    >
      <Card>
        <CardBody className="flex flex-col gap-2">
          {PROVIDERS.map((p) => (
            <div
              key={p.name}
              className="grid grid-cols-[120px_1fr_60px_80px_80px_60px] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3 text-sm"
            >
              <span className="font-medium">{p.name}</span>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">{p.model}</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-slate)]">
                <div
                  className="h-full"
                  style={{ width: `${p.share}%`, background: 'var(--accent-cyan)' }}
                />
              </div>
              <span className="font-mono tabular-nums">{p.cost}</span>
              <span className="font-mono tabular-nums text-xs">{p.latency}</span>
              <Badge tone={p.status === 'OK' ? 'success' : 'warning'} size="sm">
                {p.status}
              </Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Cost trend (12 saat)</span>
        </CardHeader>
        <CardBody>
          <div className="flex h-32 items-end gap-1">
            {[8, 12, 14, 18, 22, 19, 24, 28, 32, 28, 26, 28].map((v, i) => (
              <div
                key={`bar-${i}-${v}`}
                className="flex-1 rounded-t-[var(--radius-sm)] bg-gradient-to-t from-[var(--accent-cyan)]/30 to-[var(--accent-cyan)]"
                style={{ height: `${(v / 32) * 100}%` }}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </AgentPage>
  );
}
