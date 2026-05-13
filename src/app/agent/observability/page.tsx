import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, Input, toast } from '@/components/ui';

const TRACES = [
  {
    id: 'tr_8a3f',
    agent: 'val-bot',
    model: 'sonnet-4.6',
    tokens: 1240,
    cost: '$0.018',
    latency: '1.4s',
    halluc: 0.04,
  },
  {
    id: 'tr_92bc',
    agent: 'qa-bot',
    model: 'sonnet-4.6',
    tokens: 820,
    cost: '$0.012',
    latency: '820ms',
    halluc: 0.02,
  },
  {
    id: 'tr_cc81',
    agent: 'desc-bot',
    model: 'gpt-4.1',
    tokens: 2200,
    cost: '$0.044',
    latency: '2.1s',
    halluc: 0.18,
  },
  {
    id: 'tr_14fd',
    agent: 'search-bot',
    model: 'haiku-4.5',
    tokens: 380,
    cost: '$0.003',
    latency: '210ms',
    halluc: 0.01,
  },
];

export default function AgentObservabilityPage() {
  return (
    <AgentPage
      surfaceKey="D9 · /agent/observability"
      module="A08 LLM Observability"
      title="Trace Explorer"
      actions={
        <div className="flex gap-2">
          <Input size="sm" placeholder="filter: agent, cost > X..." className="w-64" />
          <Button size="sm" onClick={() => toast.show('Filtre uygulandı')}>
            Filtrele
          </Button>
        </div>
      }
    >
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">Trace</th>
                <th className="py-2 pr-3">Agent</th>
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Token</th>
                <th className="py-2 pr-3">Cost</th>
                <th className="py-2 pr-3">Latency</th>
                <th className="py-2 pr-3">Halluc</th>
                <th className="py-2 pr-3 text-right">Replay</th>
              </tr>
            </thead>
            <tbody>
              {TRACES.map((t) => (
                <tr key={t.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3 font-mono text-xs">{t.id}</td>
                  <td className="py-2 pr-3">{t.agent}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{t.model}</td>
                  <td className="py-2 pr-3 tabular-nums">{t.tokens}</td>
                  <td className="py-2 pr-3 tabular-nums">{t.cost}</td>
                  <td className="py-2 pr-3 tabular-nums text-xs">{t.latency}</td>
                  <td className="py-2 pr-3">
                    <Badge
                      tone={t.halluc > 0.1 ? 'danger' : t.halluc > 0.05 ? 'warning' : 'success'}
                      size="sm"
                    >
                      {t.halluc.toFixed(2)}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Button
                      size="sm"
                      tone="ghost"
                      onClick={() => toast.success(`${t.id} replay başlatıldı`)}
                    >
                      Replay
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </AgentPage>
  );
}
