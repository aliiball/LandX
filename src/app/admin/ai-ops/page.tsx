import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import { getLlmProviders, getPromptTemplates } from '@/mocks/seed/agent';
import { Activity, Banknote, Brain, Coins, ScrollText, Sparkles, TestTubes } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AdminAiOpsPage() {
  const providers = getLlmProviders();
  const prompts = getPromptTemplates();
  const totalCost = providers.reduce((s, p) => s + p.monthlyCostUsd, 0);
  const totalCalls = providers.reduce((s, p) => s + p.monthlyCallsK, 0);

  return (
    <AdminPage
      surfaceKey="C · /admin/ai-ops"
      module="A06 / A07 / A08 AI Ops"
      title="AI Operations"
      description="Prompt library (A06), LLM providers (A07), observability (A08) — tek panel."
      kpis={[
        { label: 'Provider', value: String(providers.length), tone: 'cyan' },
        { label: 'Aylık çağrı', value: `${totalCalls.toLocaleString('tr-TR')}K`, tone: 'violet' },
        { label: 'Aylık maliyet', value: `$${totalCost.toLocaleString('en-US')}`, tone: 'magenta' },
        { label: 'Prompt template', value: String(prompts.length), tone: 'amber' },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'providers',
            label: 'LLM Providers',
            content: (
              <AdminTable
                title="Provider routing tablosu"
                columns={[
                  { key: 'model', label: 'Model' },
                  { key: 'ctx', label: 'Context', align: 'right' },
                  { key: 'price', label: 'In/Out $/M', align: 'right' },
                  { key: 'lat', label: 'p95 latency', align: 'right' },
                  { key: 'succ', label: 'Başarı', align: 'right' },
                  { key: 'calls', label: 'Çağrı/ay', align: 'right' },
                  { key: 'cost', label: 'Cost/ay', align: 'right' },
                ]}
                rows={providers.map((p) => ({
                  model: (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm">{p.model}</span>
                      <span className="font-mono text-xs text-[var(--text-tertiary)]">
                        {p.providerId}
                      </span>
                    </div>
                  ),
                  ctx: (
                    <span className="tabular-nums text-xs">
                      {(p.contextWindow / 1000).toFixed(0)}K
                    </span>
                  ),
                  price: (
                    <span className="font-mono text-xs">
                      {p.pricingPerMTokensIn} / {p.pricingPerMTokensOut}
                    </span>
                  ),
                  lat: <span className="tabular-nums text-xs">{p.latencyP95Ms}ms</span>,
                  succ: (
                    <Badge tone={p.successRatePercent > 99.5 ? 'success' : 'warning'} size="sm">
                      {p.successRatePercent.toFixed(1)}%
                    </Badge>
                  ),
                  calls: <span className="tabular-nums">{p.monthlyCallsK}K</span>,
                  cost: (
                    <span className="tabular-nums">
                      ${p.monthlyCostUsd.toLocaleString('en-US')}
                    </span>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'prompts',
            label: 'Prompt Library',
            content: (
              <div className="grid gap-3">
                {prompts.map((t) => (
                  <Card key={t.id}>
                    <CardHeader>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Icon icon={ScrollText} tone="amber" size={14} />
                          <span className="font-medium">{t.name}</span>
                          {t.ab?.winner && (
                            <Badge size="sm" tone="agent">
                              A/B winner: {t.ab.winner.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {t.description}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        tone="ghost"
                        leftIcon={<Icon icon={TestTubes} size={14} />}
                        onClick={() => toast.show(`${t.name} dry-run başlatıldı`)}
                      >
                        Dry-run
                      </Button>
                    </CardHeader>
                    <CardBody className="grid gap-2">
                      {t.versions.map((v) => (
                        <div
                          key={v.id}
                          className={`flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-2 ${
                            v.active
                              ? 'border-[var(--accent-cyan)] bg-[var(--surface-elevated)]'
                              : 'border-[var(--stroke-subtle)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs">{v.semver}</span>
                            {v.active && (
                              <Badge tone="success" size="sm">
                                active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span>eval {v.evalScore}</span>
                            <span>tokens {v.tokensAvg}</span>
                            <span>★ {v.rating}</span>
                            <Button
                              size="sm"
                              tone="ghost"
                              onClick={() => toast.show(`${v.semver} kopyalandı`)}
                            >
                              Kopya
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: 'obs',
            label: 'Observability',
            content: (
              <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Coins} tone="magenta" />
                      <span className="font-medium">Saatlik Cost ($)</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hours(24, 12, 56)}>
                          <CartesianGrid strokeOpacity={0.15} />
                          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent-magenta)"
                            fill="var(--accent-magenta)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Activity} tone="cyan" />
                      <span className="font-medium">Tokens / dk</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hours(24, 4000, 18000)}>
                          <CartesianGrid strokeOpacity={0.15} />
                          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent-cyan)"
                            fill="var(--accent-cyan)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Brain} tone="violet" />
                      <span className="font-medium">Latency p95 (ms)</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hours(24, 800, 3200)}>
                          <CartesianGrid strokeOpacity={0.15} />
                          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--accent-violet)"
                            fill="var(--accent-violet)"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
                <Card tone="solid">
                  <CardHeader>
                    <span className="font-medium">Routing politikası</span>
                  </CardHeader>
                  <CardBody className="grid gap-2 text-sm sm:grid-cols-2">
                    <Row label="Default" value="claude-sonnet-4-6" />
                    <Row label="Long context (>200K)" value="claude-opus-4-7 (1M)" />
                    <Row label="Cheap fast" value="claude-haiku-4-5" />
                    <Row label="Fallback" value="gpt-5-pro → gemini-2.5-pro" />
                    <Row label="Self-host" value="llama-4-405b (ollama)" />
                    <Row label="Cost cap (saat)" value="$50" />
                  </CardBody>
                </Card>
                <Card tone="solid">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Banknote} tone="lime" />
                      <span className="font-medium">Aylık kompozisyon</span>
                    </div>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-2">
                    {providers.map((p) => {
                      const pct = (p.monthlyCostUsd / totalCost) * 100;
                      return (
                        <div key={p.id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono">{p.model}</span>
                            <span>${p.monthlyCostUsd}</span>
                          </div>
                          <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                            <div
                              className="absolute inset-y-0 left-0 bg-[var(--accent-cyan)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardBody>
                </Card>
                <Card tone="solid">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Sparkles} tone="violet" />
                      <span className="font-medium">AI Operatör Notları</span>
                    </div>
                  </CardHeader>
                  <CardBody className="text-sm text-[var(--text-secondary)]">
                    Son 24sa içinde Opus-4.7 1M context promotion sayfaları %18 daha az "ben
                    context'i aşıyorum" hatası verdi. Haiku-4.5 mesaj yanıt önerilerinde %96 başarı,
                    ortalama 420ms — birinci tercih.
                  </CardBody>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-2">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

function hours(n: number, min: number, max: number): Array<{ label: string; value: number }> {
  return Array.from({ length: n }, (_, i) => ({
    label: `${i}:00`,
    value: Math.round(min + ((max - min) * (Math.sin(i / 3) + 1)) / 2),
  }));
}
