import { Badge, Card, CardBody, CardHeader, Icon, TokenStream, tokenize } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatNumber, formatTL } from '@/lib/format';
import type { BrokerTeamMember, Commission, Lead } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

const AI_INSIGHTS = [
  'Pazarlık aşamasında 4 lead 3 günden uzun beklemede — SLA risk.',
  'Karacabey portföyünde 2 ilan fiyat ayarı önerisi (ortalama %4 üstünde).',
  'Bu hafta lead dönüşüm oranı %18 — geçen haftaya göre +3 puan.',
];

export default function BrokerOverviewPage() {
  const leads = useQuery({
    queryKey: ['broker', 'leads'],
    queryFn: () => apiFetch<{ items: Lead[] }>('/broker/leads'),
  });
  const com = useQuery({
    queryKey: ['broker', 'commissions'],
    queryFn: () => apiFetch<{ items: Commission[] }>('/broker/commissions'),
  });
  const team = useQuery({
    queryKey: ['broker', 'team'],
    queryFn: () => apiFetch<{ items: BrokerTeamMember[] }>('/broker/team'),
  });

  const stages = ['new', 'interested', 'negotiating', 'agreed', 'closed'] as const;
  const stageCount = (s: string) => (leads.data?.items ?? []).filter((l) => l.stage === s).length;
  const monthlyTotal = (com.data?.items ?? []).reduce(
    (sum, c) => sum + (c.status === 'received' ? c.netAmount : 0),
    0,
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Karaca Emlak
        </span>
        <h1 className={headingRecipe({ level: 'h2' })}>Broker Ops Overview</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Aktif Portföy"
          value={`${(leads.data?.items ?? []).length}`}
          icon={TrendingUp}
          tone="cyan"
        />
        <Kpi
          label="Ay-içi Komisyon"
          value={formatTL(monthlyTotal, true)}
          icon={TrendingUp}
          tone="lime"
        />
        <Kpi
          label="Lead Pipeline"
          value={formatNumber((leads.data?.items ?? []).length)}
          icon={Users}
          tone="amber"
        />
        <Kpi
          label="Dönüşüm"
          value={`%${Math.round(((stageCount('agreed') + stageCount('closed')) / Math.max(1, (leads.data?.items ?? []).length)) * 100)}`}
          icon={Sparkles}
          tone="violet"
        />
      </section>

      <Card glow="violet">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI Bugün</span>
          </div>
          <Badge tone="agent" size="sm" dot>
            3 öneri
          </Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {AI_INSIGHTS.map((insight, i) => (
            <div
              key={insight}
              className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)]/40 p-3 text-sm"
            >
              <span className="font-mono text-xs text-[var(--text-tertiary)]">0{i + 1}</span>
              <TokenStream tokens={tokenize(insight)} intervalMs={18} />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Lead Pipeline Funnel</span>
        </CardHeader>
        <CardBody className="grid grid-cols-5 gap-2 text-center">
          {stages.map((s, i) => {
            const count = stageCount(s);
            const widthPct = 100 - i * 12;
            return (
              <div key={s} className="flex flex-col items-center gap-2">
                <div
                  className="h-12 rounded-[var(--radius-md)] bg-[var(--accent-cyan)]/30"
                  style={{ width: `${widthPct}%`, opacity: 1 - i * 0.12 }}
                />
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {s}
                </span>
                <span className="text-lg font-semibold tabular-nums">{count}</span>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Takım</span>
          <Badge tone="info" size="sm">
            {(team.data?.items ?? []).length} üye
          </Badge>
        </CardHeader>
        <CardBody className="grid gap-2 sm:grid-cols-2">
          {(team.data?.items ?? []).map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.role}</p>
              </div>
              <span className="font-mono tabular-nums text-[var(--accent-lime)]">
                {formatTL(m.monthlyCommission, true)}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}

function Kpi({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Icon>['icon'];
  tone: React.ComponentProps<typeof Icon>['tone'];
}) {
  return (
    <Card tone="solid">
      <CardBody className="flex items-center gap-3">
        <Icon icon={icon} tone={tone} size={24} />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            {label}
          </span>
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
        </div>
      </CardBody>
    </Card>
  );
}
