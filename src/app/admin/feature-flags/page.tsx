import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon, Switch, Tabs, toast } from '@/components/ui';
import { getConfigEntries, getFeatureFlags } from '@/mocks/seed/admin';
import type { FeatureFlag, FlagCategory, FlagState } from '@/types/admin';
import { Boxes, EyeOff, FlaskConical, Settings2, Sliders } from 'lucide-react';
import { useState } from 'react';

const CATEGORY_TONE: Record<FlagCategory, 'agent' | 'danger' | 'info' | 'warning' | 'success'> = {
  experiment: 'agent',
  'kill-switch': 'danger',
  rollout: 'info',
  permission: 'warning',
  ai: 'agent',
};

const STATE_TONE: Record<FlagState, 'success' | 'danger' | 'warning' | 'info'> = {
  on: 'success',
  off: 'danger',
  ramp: 'warning',
  targeted: 'info',
};

export default function AdminFeatureFlagsPage() {
  const flags = getFeatureFlags();
  const config = getConfigEntries();
  const [localFlags, setLocalFlags] = useState(flags);

  return (
    <AdminPage
      surfaceKey="C · /admin/feature-flags"
      module="K05 Feature Flags & Config"
      title="Feature Flags & Config"
      description="Experiment · kill-switch · rollout · permission · ai — <2sn propagate. Config hierarchy + secrets."
      kpis={[
        { label: 'Flag', value: String(flags.length), tone: 'cyan' },
        {
          label: 'Açık',
          value: String(flags.filter((f) => f.state === 'on').length),
          tone: 'lime',
        },
        {
          label: 'Ramp',
          value: String(flags.filter((f) => f.state === 'ramp').length),
          tone: 'amber',
        },
        {
          label: 'Kill-switch',
          value: String(flags.filter((f) => f.category === 'kill-switch').length),
          tone: 'magenta',
        },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'flags',
            label: `Flags (${flags.length})`,
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={FlaskConical} tone="violet" />
                    <span className="font-medium">Feature Flag Listesi</span>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  {localFlags.map((f) => (
                    <FlagRow
                      key={f.key}
                      flag={f}
                      onToggle={() => {
                        setLocalFlags((prev) =>
                          prev.map((x) =>
                            x.key === f.key
                              ? {
                                  ...x,
                                  state: x.state === 'on' ? 'off' : 'on',
                                  updatedAt: new Date().toISOString(),
                                }
                              : x,
                          ),
                        );
                        toast.success(
                          `${f.key} ${f.state === 'on' ? 'kapatıldı' : 'açıldı'} (<2sn propagate)`,
                        );
                      }}
                    />
                  ))}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'config',
            label: `Config (${config.length})`,
            content: (
              <AdminTable
                title="Config hierarchy (env → db → override)"
                columns={[
                  { key: 'key', label: 'Anahtar' },
                  { key: 'value', label: 'Değer' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'source', label: 'Kaynak' },
                  { key: 'mask', label: 'Maskeli' },
                  { key: 'updated', label: 'Güncellendi' },
                ]}
                rows={config.map((c) => ({
                  key: <span className="font-mono text-xs">{c.key}</span>,
                  value: c.masked ? (
                    <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                      <Icon icon={EyeOff} size={12} />
                      <span className="font-mono">••••••</span>
                    </span>
                  ) : (
                    <span className="font-mono text-xs">{c.value}</span>
                  ),
                  scope: (
                    <Badge size="sm" tone="info">
                      {c.scope}
                    </Badge>
                  ),
                  source: (
                    <Badge size="sm" tone={c.source === 'override' ? 'warning' : 'success'}>
                      {c.source}
                    </Badge>
                  ),
                  mask: c.masked ? (
                    <Badge size="sm" tone="danger">
                      yes
                    </Badge>
                  ) : (
                    <Badge size="sm" tone="info">
                      no
                    </Badge>
                  ),
                  updated: (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {new Date(c.updatedAt).toLocaleDateString('tr-TR')}
                    </span>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'di',
            label: 'DI Container',
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={Boxes} tone="cyan" />
                    <span className="font-medium">Servis bağlam haritası</span>
                  </div>
                </CardHeader>
                <CardBody className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    { name: 'AuthProvider', binding: 'OidcAuthProvider', singleton: true },
                    { name: 'StorageProvider', binding: 'S3StorageProvider', singleton: true },
                    { name: 'AiRouter', binding: 'ClaudeOpusRouter (1M ctx)', singleton: true },
                    { name: 'TkgmGateway', binding: 'MockTkgmGateway (dev)', singleton: false },
                    { name: 'AuditAppender', binding: 'HashChainAppender', singleton: true },
                    { name: 'NotificationBus', binding: 'SlackBus + EmailBus', singleton: true },
                  ].map((d) => (
                    <div
                      key={d.name}
                      className="flex flex-col gap-0.5 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{d.name}</span>
                        <Badge size="sm" tone="info">
                          {d.singleton ? 'singleton' : 'transient'}
                        </Badge>
                      </div>
                      <span className="font-mono text-xs text-[var(--text-tertiary)]">
                        → {d.binding}
                      </span>
                    </div>
                  ))}
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'secrets',
            label: 'Secrets',
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={Settings2} tone="amber" />
                    <span className="font-medium">Secrets — read-protected</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <AdminTable
                    columns={[
                      { key: 'key', label: 'Anahtar' },
                      { key: 'kms', label: 'KMS Key' },
                      { key: 'rot', label: 'Son rotasyon' },
                      { key: 'next', label: 'Sonraki' },
                    ]}
                    rows={[
                      {
                        key: 'jwt.signing.private',
                        kms: 'kms/landx/2026-q2',
                        rot: '14g önce',
                        next: '76g sonra',
                      },
                      {
                        key: 'sentry.dsn',
                        kms: 'kms/landx/secrets',
                        rot: '60g önce',
                        next: '30g sonra',
                      },
                      {
                        key: 'tkgm.api.token',
                        kms: 'kms/landx/secrets',
                        rot: '24sa önce',
                        next: '24sa sonra',
                      },
                      {
                        key: 'stripe.webhook',
                        kms: 'kms/landx/secrets',
                        rot: '90g önce',
                        next: 'manuel',
                      },
                      {
                        key: 'mcp.signing.private',
                        kms: 'kms/landx/agent',
                        rot: '7g önce',
                        next: '83g sonra',
                      },
                    ].map((s) => ({
                      key: <span className="font-mono text-xs">{s.key}</span>,
                      kms: <span className="font-mono text-xs">{s.kms}</span>,
                      rot: <span className="text-xs">{s.rot}</span>,
                      next: <span className="text-xs">{s.next}</span>,
                    }))}
                  />
                </CardBody>
              </Card>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}

function FlagRow({ flag, onToggle }: { flag: FeatureFlag; onToggle: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1 lg:flex-1">
        <div className="flex items-center gap-2">
          <Icon icon={Sliders} size={14} tone="cyan" />
          <span className="font-mono text-xs font-medium">{flag.key}</span>
          <Badge tone={CATEGORY_TONE[flag.category]} size="sm">
            {flag.category}
          </Badge>
          <Badge tone={STATE_TONE[flag.state]} size="sm">
            {flag.state}
          </Badge>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">{flag.description}</span>
        {flag.targets && (
          <span className="text-xs text-[var(--text-tertiary)]">
            Hedefler: {flag.targets.join(', ')}
          </span>
        )}
      </div>
      {flag.state === 'ramp' && flag.rampPercent !== undefined && (
        <div className="flex items-center gap-2 lg:w-48">
          <span className="text-xs text-[var(--text-tertiary)]">Ramp</span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
            <div
              className="absolute inset-y-0 left-0 bg-[var(--accent-amber)]"
              style={{ width: `${flag.rampPercent}%` }}
            />
          </div>
          <span className="tabular-nums text-xs">{flag.rampPercent}%</span>
        </div>
      )}
      <Switch checked={flag.state === 'on'} onChange={onToggle} aria-label={`${flag.key} toggle`} />
    </div>
  );
}
