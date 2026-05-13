import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Card, CardBody, CardHeader, Icon, TokenStream, tokenize } from '@/components/ui';
import { Activity, AlertCircle, Sparkles } from 'lucide-react';

const TRACES = [
  {
    id: 'tr_001',
    ts: '01:32:18',
    agent: 'search-bot',
    tool: 'listings.search',
    cost: '$0.004',
    latency: '212ms',
    status: 'success',
  },
  {
    id: 'tr_002',
    ts: '01:32:14',
    agent: 'val-bot',
    tool: 'valuation.estimate',
    cost: '$0.012',
    latency: '1.4s',
    status: 'success',
  },
  {
    id: 'tr_003',
    ts: '01:32:12',
    agent: 'qa-bot',
    tool: 'qa.answer',
    cost: '$0.008',
    latency: '820ms',
    status: 'success',
  },
  {
    id: 'tr_004',
    ts: '01:32:08',
    agent: 'desc-bot',
    tool: 'description.generate',
    cost: '$0.022',
    latency: '2.1s',
    status: 'partial',
  },
  {
    id: 'tr_005',
    ts: '01:32:01',
    agent: 'search-bot',
    tool: 'listings.search',
    cost: '$0.004',
    latency: '198ms',
    status: 'success',
  },
];

export default function AgentOverviewPage() {
  return (
    <AgentPage
      surfaceKey="Surface D · /agent"
      module="A01-A11 + I03"
      title="Agent Operations"
      description="MCP transport, tool registry, trace explorer, prompt versioning."
    >
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Çağrı/dk" value="432" hint="+8% son saat" tone="cyan" />
        <Kpi label="Ort. latency" value="640ms" hint="p95 1.2s" tone="violet" />
        <Kpi label="Başarı oranı" value="%97.4" hint="0.4 ihlal" tone="lime" />
        <Kpi label="Cost/saat" value="$28.4" hint="claude-sonnet-4.6 dominant" tone="magenta" />
      </section>

      <Card glow="violet">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">Hallucination skoru (son 24h)</span>
          </div>
          <Badge tone="success" size="sm" dot>
            %2.1
          </Badge>
        </CardHeader>
        <CardBody>
          <TokenStream
            tokens={tokenize(
              'AI çıktı kalitesi stabil. 432 trace incelendi. 9 tanesinde hallucination flag tetiklendi — hepsi sahibinin onay sürecinden geçti.',
            )}
            intervalMs={20}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Activity} tone="cyan" />
            <span className="font-medium">Live trace feed</span>
          </div>
          <Badge tone="success" size="sm" dot>
            SSE
          </Badge>
        </CardHeader>
        <CardBody>
          <ul className="flex flex-col gap-1 font-mono text-xs">
            {TRACES.map((t) => (
              <li
                key={t.id}
                className="grid grid-cols-[80px_140px_180px_80px_80px_70px] items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--surface-slate)]/40 px-2 py-1"
              >
                <span className="text-[var(--text-tertiary)]">{t.ts}</span>
                <span className="text-[var(--accent-cyan)]">{t.agent}</span>
                <span>{t.tool}</span>
                <span className="text-[var(--accent-lime)]">{t.cost}</span>
                <span className="text-[var(--text-secondary)]">{t.latency}</span>
                <Badge tone={t.status === 'success' ? 'success' : 'warning'} size="sm">
                  {t.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={AlertCircle} tone="amber" />
            <span className="font-medium">Cost heatmap (tenant × feature)</span>
          </div>
        </CardHeader>
        <CardBody>
          <table className="w-full text-xs">
            <thead className="text-[var(--text-tertiary)]">
              <tr>
                <th className="text-left">Tenant</th>
                <th>Search</th>
                <th>Valuation</th>
                <th>Q&A</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {['landx-tr', 'karaca-emlak', 'ege-arsa'].map((t, i) => (
                <tr key={t}>
                  <td>{t}</td>
                  {['Search', 'Valuation', 'Q&A', 'Description'].map((_, j) => {
                    const intensity = (i + j) % 4;
                    const colors = [
                      'bg-[var(--surface-slate)]',
                      'bg-[oklch(0.82_0.16_195_/_0.25)]',
                      'bg-[oklch(0.82_0.16_195_/_0.5)]',
                      'bg-[oklch(0.82_0.16_195_/_0.75)]',
                    ];
                    return (
                      <td
                        key={`${t}-${j}`}
                        className={`rounded-[var(--radius-sm)] p-2 text-center text-[var(--text-primary)] ${colors[intensity]}`}
                      >
                        ${(intensity * 1.4 + 0.3).toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </AgentPage>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: { label: string; value: string; hint: string; tone: 'cyan' | 'violet' | 'lime' | 'magenta' }) {
  return (
    <Card tone="solid">
      <CardBody className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
          {label}
        </span>
        <span
          className="text-2xl font-semibold tabular-nums"
          style={{ color: `var(--accent-${tone})` }}
        >
          {value}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">{hint}</span>
      </CardBody>
    </Card>
  );
}
