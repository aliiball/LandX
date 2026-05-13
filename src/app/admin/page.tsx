import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { AlertTriangle, Bot, Database, ServerCog, Sparkles } from 'lucide-react';

const ANOMALIES = [
  {
    id: 'a1',
    severity: 'high',
    message: 'Tenant lndx-tr-001 quota %92 — büyüme tahmini overflow.',
    when: '4dk önce',
  },
  {
    id: 'a2',
    severity: 'medium',
    message: 'LLM cost spike: A07 OpenAI proxy /completions +%34.',
    when: '12dk önce',
  },
  {
    id: 'a3',
    severity: 'low',
    message: 'D02 PII scan: 3 alan için reclassification önerisi.',
    when: '37dk önce',
  },
];

const HEALTH = [
  { label: 'Plugin sağlık', value: '24/26', tone: 'amber' as const },
  { label: 'Servis sağlık', value: '12/12', tone: 'lime' as const },
  { label: 'MCP transport', value: '5/5', tone: 'lime' as const },
];

export default function AdminOverviewPage() {
  return (
    <AdminPage
      surfaceKey="Surface C · /admin"
      module="O01 SLO"
      title="Operations Overview"
      description="Platform sağlık radarı — anomalies, SLO posture, AI cost."
      kpis={[
        { label: 'Tenant', value: '128', tone: 'cyan' },
        { label: 'Aktif Kullanıcı', value: '2.4K', tone: 'lime' },
        { label: 'Agent çağrı/dk', value: '432', tone: 'violet' },
        { label: 'LLM cost/saat', value: '$28.4', tone: 'magenta' },
        { label: 'p95 latency', value: '184ms', tone: 'cyan' },
        { label: 'Error rate', value: '0.04%', tone: 'lime' },
        { label: 'Error budget', value: '%84', tone: 'amber' },
        { label: 'SLO posture', value: 'OK', tone: 'lime' },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={AlertTriangle} tone="amber" />
              <span className="font-medium">Anomaly Feed</span>
              <Badge tone="agent" size="sm" dot>
                AI
              </Badge>
            </div>
            <Button size="sm" tone="ghost" onClick={() => toast.show('Tüm anomalileri gör')}>
              Tümü
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            {ANOMALIES.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
              >
                <div className="flex items-start gap-2">
                  <Badge
                    tone={
                      a.severity === 'high'
                        ? 'danger'
                        : a.severity === 'medium'
                          ? 'warning'
                          : 'info'
                    }
                    size="sm"
                  >
                    {a.severity}
                  </Badge>
                  <span className="text-sm">{a.message}</span>
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">{a.when}</span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={ServerCog} tone="cyan" />
              <span className="font-medium">Sistem Haritası</span>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 text-sm">
            {HEALTH.map((h) => (
              <div key={h.label} className="flex items-center justify-between">
                <span>{h.label}</span>
                <Badge tone={h.tone === 'lime' ? 'success' : 'warning'} size="sm" dot>
                  {h.value}
                </Badge>
              </div>
            ))}
            <div className="border-t border-[var(--stroke-subtle)] pt-2">
              <Button
                block
                tone="agent"
                size="sm"
                leftIcon={<Icon icon={Sparkles} size={14} />}
                onClick={() => toast.agent('AI: SLO trendi sağlıklı, 7-gün öngörüsü stabil.')}
              >
                AI durum özeti
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Bot} tone="violet" />
            <span className="font-medium">Agent Operations (snapshot)</span>
          </div>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-4 text-sm">
          <KV label="Top model" value="claude-sonnet-4.6" />
          <KV label="Cost / saat" value="$28.40" />
          <KV label="Tool ihlal" value="0" />
          <KV label="Pending HITL" value="3" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Database} tone="lime" />
            <span className="font-medium">Database & Storage</span>
          </div>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-4 text-sm">
          <KV label="DB size" value="48.2 GB" />
          <KV label="Vector index" value="14.1 GB" />
          <KV label="Backup taze" value="3 saat önce" />
          <KV label="Replication lag" value="38ms" />
        </CardBody>
      </Card>
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
