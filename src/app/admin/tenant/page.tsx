import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getTenants } from '@/mocks/seed/admin';
import type { TenantPlan, TenantStatus } from '@/types/admin';
import { Building2, Sparkles } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PLAN_TONE: Record<TenantPlan, 'info' | 'success' | 'warning' | 'agent'> = {
  demo: 'info',
  starter: 'success',
  pro: 'warning',
  enterprise: 'agent',
};

const STATUS_TONE: Record<TenantStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  active: 'success',
  suspended: 'danger',
  provisioning: 'info',
  archived: 'warning',
};

export default function AdminTenantPage() {
  const tenants = getTenants();
  const total = tenants.length;
  const active = tenants.filter((t) => t.status === 'active').length;

  return (
    <AdminPage
      surfaceKey="C · /admin/tenant"
      module="I01 Tenant Management"
      title="Tenant Yönetimi"
      description="Çoklu kiracı yapısı · plan & kota matrisi · provisioning wizard · 30g usage."
      actions={
        <Button
          tone="primary"
          size="sm"
          leftIcon={<Icon icon={Sparkles} size={14} />}
          onClick={() => toast.show('New tenant wizard (mock) açıldı')}
        >
          + Yeni tenant
        </Button>
      }
      kpis={[
        { label: 'Tenant', value: String(total), tone: 'cyan' },
        { label: 'Active', value: String(active), tone: 'lime' },
        {
          label: 'Provisioning',
          value: String(tenants.filter((t) => t.status === 'provisioning').length),
          tone: 'amber',
        },
        {
          label: 'Suspended',
          value: String(tenants.filter((t) => t.status === 'suspended').length),
          tone: 'magenta',
        },
      ]}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(['demo', 'starter', 'pro', 'enterprise'] as TenantPlan[]).map((p) => {
          const items = tenants.filter((t) => t.plan === p);
          return (
            <Card key={p}>
              <CardBody className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {p}
                </span>
                <span className="text-2xl font-semibold tabular-nums">{items.length}</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  ortalama kullanım %
                  {Math.round(
                    items.reduce(
                      (s, t) => s + (t.usage.listings / Math.max(t.quota.listings, 1)) * 100,
                      0,
                    ) / Math.max(items.length, 1),
                  )}
                </span>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <AdminTable
        title="Tenants"
        columns={[
          { key: 'name', label: 'Tenant' },
          { key: 'plan', label: 'Plan' },
          { key: 'status', label: 'Durum' },
          { key: 'usage', label: 'Kullanım' },
          { key: 'apiCalls', label: 'API/ay', align: 'right' },
          { key: 'storage', label: 'Storage', align: 'right' },
        ]}
        rows={tenants.map((t) => {
          const pct = Math.round((t.usage.listings / Math.max(t.quota.listings, 1)) * 100);
          return {
            name: (
              <div className="flex items-center gap-2">
                <Icon icon={Building2} size={14} tone="cyan" />
                <div className="flex flex-col">
                  <span className="font-medium">{t.name}</span>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">{t.slug}</span>
                </div>
              </div>
            ),
            plan: (
              <Badge tone={PLAN_TONE[t.plan]} size="sm">
                {t.plan}
              </Badge>
            ),
            status: (
              <Badge tone={STATUS_TONE[t.status]} size="sm">
                {t.status}
              </Badge>
            ),
            usage: (
              <div className="flex flex-col gap-1 w-44">
                <div className="flex justify-between text-xs">
                  <span>
                    {t.usage.listings} / {t.quota.listings} ilan
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct > 85
                          ? 'var(--accent-magenta)'
                          : pct > 60
                            ? 'var(--accent-amber)'
                            : 'var(--accent-lime)',
                    }}
                  />
                </div>
              </div>
            ),
            apiCalls: (
              <span className="tabular-nums text-xs">
                {(t.usage.monthlyApiCalls / 1000).toFixed(1)}K /{' '}
                {(t.quota.monthlyApiCalls / 1000).toFixed(0)}K
              </span>
            ),
            storage: (
              <span className="tabular-nums text-xs">
                {t.usage.storageGb.toFixed(1)} / {t.quota.storageGb}GB
              </span>
            ),
          };
        })}
      />

      <Card>
        <CardHeader>
          <span className="font-medium">30g Tenant Aktivitesi (API çağrı)</span>
        </CardHeader>
        <CardBody>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={Array.from({ length: 30 }, (_, i) => ({
                  label: `D${i + 1}`,
                  value: 24000 + Math.sin(i / 3) * 8000 + i * 320,
                }))}
              >
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.15} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="var(--accent-cyan)" fill="url(#tg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </AdminPage>
  );
}
