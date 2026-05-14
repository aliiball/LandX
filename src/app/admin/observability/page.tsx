import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon, Tabs } from '@/components/ui';
import { getLogs, getSlos, getTraces } from '@/mocks/seed/admin';
import type { LogLevel, Slo } from '@/types/admin';
import { Activity, BarChart3, FileWarning, Gauge, Timer } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const STATUS_TONE: Record<Slo['status'], 'success' | 'warning' | 'danger'> = {
  healthy: 'success',
  warning: 'warning',
  breach: 'danger',
};

const LEVEL_TONE: Record<LogLevel, 'info' | 'warning' | 'danger'> = {
  debug: 'info',
  info: 'info',
  warn: 'warning',
  error: 'danger',
  fatal: 'danger',
};

export default function AdminObservabilityPage() {
  const slos = getSlos();
  const traces = getTraces();
  const logs = getLogs();

  return (
    <AdminPage
      surfaceKey="C · /admin/observability"
      module="O01 Observability"
      title="Observability"
      description="SLO posture, distributed traces, structured logs, metrics, incidents — tek panel."
      kpis={[
        { label: 'SLO', value: String(slos.length), tone: 'cyan' },
        {
          label: 'Healthy',
          value: String(slos.filter((s) => s.status === 'healthy').length),
          tone: 'lime',
        },
        {
          label: 'Warning',
          value: String(slos.filter((s) => s.status === 'warning').length),
          tone: 'amber',
        },
        {
          label: 'Breach',
          value: String(slos.filter((s) => s.status === 'breach').length),
          tone: 'magenta',
        },
        { label: 'Traces (son)', value: String(traces.length), tone: 'violet' },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'slo',
            label: `SLO (${slos.length})`,
            content: (
              <div className="grid gap-3">
                {slos.map((slo) => (
                  <Card key={slo.id}>
                    <CardBody className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-center">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Icon icon={Gauge} tone="cyan" size={14} />
                          <span className="font-medium">{slo.name}</span>
                          <Badge tone={STATUS_TONE[slo.status]} size="sm">
                            {slo.status}
                          </Badge>
                        </div>
                        <span className="font-mono text-xs text-[var(--text-tertiary)]">
                          {slo.service} · objective {slo.objective}% · window {slo.windowDays}g
                        </span>
                      </div>
                      <KV
                        label="Error budget"
                        value={`%${Math.round(slo.errorBudgetRemaining * 100)}`}
                      />
                      <KV label="Burn rate" value={slo.burnRate.toFixed(2)} />
                      <div className="h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={slo.trend.map((v, i) => ({ i, v }))}>
                            <Line
                              type="monotone"
                              dataKey="v"
                              stroke="var(--accent-cyan)"
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: 'traces',
            label: `Traces (${traces.length})`,
            content: (
              <AdminTable
                title="Distributed Traces"
                columns={[
                  { key: 'id', label: 'Trace ID' },
                  { key: 'op', label: 'İşlem' },
                  { key: 'svc', label: 'Servis' },
                  { key: 'spans', label: 'Spans', align: 'right' },
                  { key: 'dur', label: 'Süre', align: 'right' },
                  { key: 'status', label: 'Durum' },
                ]}
                rows={traces.map((t) => ({
                  id: <span className="font-mono text-xs">{t.id}</span>,
                  op: <span className="font-mono text-xs">{t.operation}</span>,
                  svc: (
                    <Badge size="sm" tone="info">
                      {t.service}
                    </Badge>
                  ),
                  spans: <span className="tabular-nums">{t.spanCount}</span>,
                  dur: <span className="tabular-nums">{t.durationMs}ms</span>,
                  status: (
                    <Badge tone={t.status === 'ok' ? 'success' : 'danger'} size="sm">
                      {t.status}
                    </Badge>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'logs',
            label: `Loglar (${logs.length})`,
            content: (
              <AdminTable
                title="Structured logs"
                columns={[
                  { key: 'ts', label: 'Zaman' },
                  { key: 'level', label: 'Level' },
                  { key: 'svc', label: 'Servis' },
                  { key: 'msg', label: 'Mesaj' },
                  { key: 'trc', label: 'TraceID' },
                ]}
                rows={logs.slice(0, 30).map((l) => ({
                  ts: (
                    <span className="font-mono text-xs">
                      {new Date(l.ts).toLocaleTimeString('tr-TR')}
                    </span>
                  ),
                  level: (
                    <Badge tone={LEVEL_TONE[l.level]} size="sm">
                      {l.level}
                    </Badge>
                  ),
                  svc: <span className="font-mono text-xs">{l.service}</span>,
                  msg: <span className="text-sm">{l.message}</span>,
                  trc: l.traceId ? (
                    <span className="font-mono text-xs text-[var(--accent-cyan)]">{l.traceId}</span>
                  ) : (
                    <span className="text-xs text-[var(--text-tertiary)]">—</span>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'metrics',
            label: 'Metrics',
            content: (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'CPU', value: '%34', icon: Activity },
                  { label: 'Memory', value: '%62', icon: BarChart3 },
                  { label: 'Network IO', value: '142 MB/s', icon: Timer },
                  { label: 'DB queries/s', value: '1.4K', icon: Activity },
                  { label: 'Cache hit', value: '%92', icon: Activity },
                  { label: 'p99 latency', value: '480ms', icon: Timer },
                ].map((m) => (
                  <Card key={m.label} tone="solid">
                    <CardBody className="flex items-center gap-3">
                      <Icon icon={m.icon} tone="cyan" />
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                          {m.label}
                        </span>
                        <span className="text-lg font-semibold tabular-nums">{m.value}</span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: 'incidents',
            label: 'Incidents',
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={FileWarning} tone="amber" />
                    <span className="font-medium">Son 30g</span>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-2 text-sm">
                  {[
                    {
                      date: '2026-05-12',
                      sev: 'high',
                      title: 'TKGM gateway 504 spike (38dk)',
                      resolved: true,
                    },
                    {
                      date: '2026-05-08',
                      sev: 'medium',
                      title: 'AI maliyet kill-switch tetik',
                      resolved: true,
                    },
                    { date: '2026-05-02', sev: 'low', title: 'Sentry quota %90', resolved: true },
                    {
                      date: '2026-04-22',
                      sev: 'critical',
                      title: 'DSAR yasal süre breach (1 talep)',
                      resolved: false,
                    },
                  ].map((i) => (
                    <div
                      key={i.title}
                      className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[var(--text-tertiary)]">
                          {i.date}
                        </span>
                        <Badge
                          tone={
                            i.sev === 'critical'
                              ? 'danger'
                              : i.sev === 'high'
                                ? 'danger'
                                : i.sev === 'medium'
                                  ? 'warning'
                                  : 'info'
                          }
                          size="sm"
                        >
                          {i.sev}
                        </Badge>
                        <span>{i.title}</span>
                      </div>
                      <Badge tone={i.resolved ? 'success' : 'warning'} size="sm">
                        {i.resolved ? 'çözüldü' : 'açık'}
                      </Badge>
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
