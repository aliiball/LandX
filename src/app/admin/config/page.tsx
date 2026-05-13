import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Switch, toast } from '@/components/ui';

const FLAGS = [
  { key: 'feature.broker-ai-tools', enabled: true, scope: 'global' },
  { key: 'feature.ai-valuation-streaming', enabled: true, scope: 'global' },
  { key: 'feature.kvkk-dsar-portal', enabled: true, scope: 'tenant:karaca-emlak' },
  { key: 'feature.advanced-analytics', enabled: false, scope: 'plan:enterprise' },
  { key: 'feature.custom-domains', enabled: false, scope: 'plan:enterprise' },
];

const SECRETS = [
  { key: 'AGENT_API_KEY', rotated: '14 gün önce', scope: 'global' },
  { key: 'STRIPE_WEBHOOK', rotated: '32 gün önce', scope: 'global' },
  { key: 'POSTGRES_REPLICA', rotated: '8 gün önce', scope: 'global' },
];

export default function AdminConfigPage() {
  return (
    <AdminPage
      surfaceKey="C9 · /admin/config"
      module="K05 Service Container"
      title="Config & Feature Flags"
      kpis={[
        { label: 'Flag', value: '32', tone: 'cyan' },
        { label: 'Aktif', value: '24', tone: 'lime' },
        { label: 'Tenant override', value: '12', tone: 'amber' },
        { label: 'Secret', value: '8', tone: 'violet' },
      ]}
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Feature flags</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {FLAGS.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
            >
              <div>
                <p className="font-mono text-sm">{f.key}</p>
                <p className="text-xs text-[var(--text-tertiary)]">scope: {f.scope}</p>
              </div>
              <Switch
                defaultChecked={f.enabled}
                onChange={() => toast.show(`${f.key} ayarı değişti — instant propagation`)}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Secret rotation</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          {SECRETS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between border-b border-[var(--stroke-subtle)] py-1.5 last:border-b-0"
            >
              <span className="font-mono">{s.key}</span>
              <div className="flex items-center gap-2">
                <Badge tone="neutral" size="sm">
                  {s.scope}
                </Badge>
                <span className="text-xs text-[var(--text-tertiary)]">rotated {s.rotated}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
