import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, toast } from '@/components/ui';
import { Download } from 'lucide-react';

const CONVS = [
  { id: 'cnv_001', agent: 'val-bot', user: 'usr_001', turns: 8, tokens: 12_400, cost: '$0.18' },
  { id: 'cnv_002', agent: 'qa-bot', user: 'usr_004', turns: 14, tokens: 8_200, cost: '$0.12' },
  { id: 'cnv_003', agent: 'search-bot', user: 'usr_002', turns: 4, tokens: 1_800, cost: '$0.02' },
  { id: 'cnv_004', agent: 'desc-bot', user: 'usr_007', turns: 22, tokens: 18_600, cost: '$0.28' },
];

export default function AgentConversationsPage() {
  return (
    <AgentPage
      surfaceKey="D11 · /agent/conversations"
      module="A11 Conversation"
      title="Conversations"
      description="Full mesaj akışı + tool call timeline + token/cost. Export edilebilir."
    >
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">Konuşma</th>
                <th className="py-2 pr-3">Agent</th>
                <th className="py-2 pr-3">Kullanıcı</th>
                <th className="py-2 pr-3">Tur</th>
                <th className="py-2 pr-3">Token</th>
                <th className="py-2 pr-3">Cost</th>
                <th className="py-2 pr-3 text-right">Export</th>
              </tr>
            </thead>
            <tbody>
              {CONVS.map((c) => (
                <tr key={c.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3 font-mono text-xs">{c.id}</td>
                  <td className="py-2 pr-3">
                    <Badge tone="agent" size="sm">
                      {c.agent}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs">{c.user}</td>
                  <td className="py-2 pr-3 tabular-nums">{c.turns}</td>
                  <td className="py-2 pr-3 tabular-nums">{c.tokens.toLocaleString('tr-TR')}</td>
                  <td className="py-2 pr-3 tabular-nums">{c.cost}</td>
                  <td className="py-2 pr-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        size="sm"
                        tone="ghost"
                        onClick={() => toast.success(`${c.id} JSON export`)}
                      >
                        <Download className="size-3 mr-1" aria-hidden /> JSON
                      </Button>
                      <Button
                        size="sm"
                        tone="ghost"
                        onClick={() => toast.success(`${c.id} Markdown export`)}
                      >
                        MD
                      </Button>
                      <Button
                        size="sm"
                        tone="ghost"
                        onClick={() => toast.success(`${c.id} PDF transcript`)}
                      >
                        PDF
                      </Button>
                    </div>
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
