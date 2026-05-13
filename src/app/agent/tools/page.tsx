import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, toast } from '@/components/ui';

const TOOLS = [
  {
    name: 'listings.search',
    owner: '@landx/listings-core',
    sideEffect: 'read',
    cost: 'low',
    readability: 92,
  },
  {
    name: 'valuation.estimate',
    owner: '@landx/valuation-ai',
    sideEffect: 'read',
    cost: 'high',
    readability: 88,
  },
  {
    name: 'description.generate',
    owner: '@landx/valuation-ai',
    sideEffect: 'write',
    cost: 'high',
    readability: 76,
  },
  {
    name: 'broker.assign_lead',
    owner: '@landx/broker-crm',
    sideEffect: 'write',
    cost: 'low',
    readability: 84,
  },
  {
    name: 'post_listing',
    owner: '@landx/listings-core',
    sideEffect: 'write+irreversible',
    cost: 'med',
    readability: 68,
  },
];

export default function AgentToolsPage() {
  return (
    <AgentPage
      surfaceKey="D3 · /agent/tools"
      module="A02 Tool Registry"
      title="Tool Registry"
      description="LLM-readability skoru, blast radius, side-effect sınıflandırma."
      actions={<Button onClick={() => toast.success('Tool wizard')}>+ Tool ekle</Button>}
    >
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">Tool</th>
                <th className="py-2 pr-3">Owner</th>
                <th className="py-2 pr-3">Side-effect</th>
                <th className="py-2 pr-3">Cost</th>
                <th className="py-2 pr-3">LLM-readability</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((t) => (
                <tr key={t.name} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3 font-mono">{t.name}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{t.owner}</td>
                  <td className="py-2 pr-3">
                    <Badge
                      tone={
                        t.sideEffect.includes('irreversible')
                          ? 'danger'
                          : t.sideEffect === 'write'
                            ? 'warning'
                            : 'info'
                      }
                      size="sm"
                    >
                      {t.sideEffect}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge
                      tone={t.cost === 'high' ? 'danger' : t.cost === 'med' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {t.cost}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--surface-slate)]">
                        <div
                          className="h-full"
                          style={{ width: `${t.readability}%`, background: 'var(--accent-violet)' }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-xs">{t.readability}</span>
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
