import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getAuditEvents, getEcaEvents, getPendingActions } from '@/mocks/seed/admin';
import {
  AlertTriangle,
  Bot,
  Database,
  GitBranch,
  Layers,
  ServerCog,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const HEALTH = [
  { label: 'Plugin sağlık', value: '24/26', tone: 'amber' as const },
  { label: 'Servis sağlık', value: '12/12', tone: 'lime' as const },
  { label: 'MCP transport', value: '5/5', tone: 'lime' as const },
  { label: 'Hash chain', value: '100%', tone: 'lime' as const },
];

const SEVERITY_TONE = {
  info: 'info',
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
} as const;

export default function AdminOverviewPage() {
  const pending = getPendingActions();
  const audit = getAuditEvents().slice(0, 6);
  const ecaEvents = getEcaEvents();
  const [livePulse, setLivePulse] = useState(0);
  const [liveList, setLiveList] = useState(() => ecaEvents.slice(0, 6));

  useEffect(() => {
    // Pulse every 30-45s with a new ECA event prepended.
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      const delay = 30_000 + Math.floor(Math.random() * 15_000);
      timer = setTimeout(() => {
        if (cancelled) return;
        setLivePulse((n) => n + 1);
        setLiveList((prev) => {
          const next = ecaEvents[(prev.length + livePulse) % ecaEvents.length];
          if (!next) return prev;
          return [{ ...next, ts: new Date().toISOString() }, ...prev.slice(0, 5)];
        });
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ecaEvents, livePulse]);

  return (
    <AdminPage
      surfaceKey="Surface C · /admin"
      module="O01 SLO"
      title="Operations Overview"
      description="Platform sağlık radarı — anomalies, SLO posture, AI cost, pending compliance."
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
              <span className="font-medium">Bekleyen Aksiyonlar</span>
              <Badge tone="agent" size="sm" dot>
                Compliance
              </Badge>
            </div>
            <Button size="sm" tone="ghost" onClick={() => toast.show('Tümünü gör')}>
              Tümü
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            {pending.map((p) => (
              <Link
                key={p.id}
                to={p.href}
                className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3 hover:bg-[var(--surface-elevated)]"
              >
                <div className="flex items-start gap-2">
                  <Badge tone={SEVERITY_TONE[p.severity]} size="sm">
                    {p.severity}
                  </Badge>
                  <span className="text-sm">{p.label}</span>
                </div>
                <span className="font-mono text-xs uppercase text-[var(--text-tertiary)]">
                  {p.category}
                </span>
              </Link>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-lime)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-lime)]" />
              </span>
              <span className="font-medium">Canlı ECA Akışı</span>
              <Badge tone="success" size="sm">
                {livePulse} yeni
              </Badge>
            </div>
            <Link to="/admin/rules" className="text-xs text-[var(--text-tertiary)] hover:underline">
              Tüm kurallar →
            </Link>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            {liveList.map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
              >
                <div className="flex items-start gap-2">
                  <Icon
                    icon={Zap}
                    tone={
                      e.outcome === 'matched' ? 'lime' : e.outcome === 'error' ? 'magenta' : 'amber'
                    }
                    size={14}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">{e.ruleName}</span>
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      {e.outcome} · {e.durationMs}ms
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {new Date(e.ts).toLocaleTimeString('tr-TR')}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Shield} tone="violet" />
              <span className="font-medium">Son Audit Olayları</span>
              <Badge tone="agent" size="sm">
                D01
              </Badge>
            </div>
            <Link to="/admin/audit" className="text-xs text-[var(--text-tertiary)] hover:underline">
              Tüm log →
            </Link>
          </CardHeader>
          <CardBody className="flex flex-col gap-1">
            {audit.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)]/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge tone={SEVERITY_TONE[a.severity]} size="sm">
                    {a.severity}
                  </Badge>
                  <span className="font-mono text-xs">{a.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-tertiary)]">{a.principalLabel}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Bot} tone="violet" />
              <span className="font-medium">Agent Operations</span>
            </div>
          </CardHeader>
          <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
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
          <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
            <KV label="DB size" value="48.2 GB" />
            <KV label="Vector index" value="14.1 GB" />
            <KV label="Backup taze" value="3 saat" />
            <KV label="Replication lag" value="38ms" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Layers} tone="cyan" />
              <span className="font-medium">Modül Durumu (33)</span>
            </div>
          </CardHeader>
          <CardBody className="grid gap-3 text-sm sm:grid-cols-2">
            <KV label="Full" value="20" />
            <KV label="Partial" value="11" />
            <KV label="Planned" value="2" />
            <KV label="AI/MCP" value="14/8" />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[3fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={GitBranch} tone="amber" />
              <span className="font-medium">Hızlı Erişim</span>
            </div>
          </CardHeader>
          <CardBody className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { to: '/admin/mcp', label: 'MCP Server (A01)' },
              { to: '/admin/doctype-studio', label: 'DocType Studio (K02)' },
              { to: '/admin/tkgm', label: 'TKGM Ops' },
              { to: '/admin/audit', label: 'Audit (D01)' },
              { to: '/admin/pii', label: 'PII / DSAR (D02)' },
              { to: '/admin/compliance', label: 'Compliance (D03)' },
              { to: '/admin/observability', label: 'Observability (O01)' },
              { to: '/admin/ai-ops', label: 'AI Ops (A06/A07/A08)' },
              { to: '/admin/agent-registry', label: 'Agent Registry' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-sm hover:border-[var(--accent-cyan)] hover:bg-[var(--surface-elevated)]"
              >
                {q.label}
              </Link>
            ))}
          </CardBody>
        </Card>
        <Card tone="solid">
          <CardBody className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              AI Operatör Notu
            </span>
            <p className="text-sm">
              <span className="text-[var(--accent-cyan)]">opus-4.7-router</span>:&nbsp; Son 24sa
              içinde hash chain bütünlüğü 100%, DSAR yasal süre 5 talepte uyum içinde, AI cost 1.4×
              ortalama — gece batch'i 02:00'da çalışacak.
            </p>
          </CardBody>
        </Card>
      </div>
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
