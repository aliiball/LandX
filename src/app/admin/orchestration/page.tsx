import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getAgentRuns } from '@/mocks/seed/agent';
import type { AgentRunStep } from '@/types/agent';
import { Bot, CheckCircle2, Hand, Loader2, XCircle } from 'lucide-react';

const KIND_LABEL: Record<AgentRunStep['kind'], string> = {
  plan: 'PLAN',
  tool_call: 'TOOL',
  reflect: 'REFLECT',
  human_approval: 'HITL',
  finalize: 'FINAL',
  error: 'ERROR',
};

const KIND_COLOR: Record<AgentRunStep['kind'], string> = {
  plan: 'var(--accent-cyan)',
  tool_call: 'var(--accent-violet)',
  reflect: 'var(--accent-amber)',
  human_approval: 'var(--accent-magenta)',
  finalize: 'var(--accent-lime)',
  error: 'var(--accent-magenta)',
};

export default function OrchestrationPage() {
  const runs = getAgentRuns();
  return (
    <AdminPage
      surfaceKey="C · /admin/orchestration"
      module="A09 Agent Orchestration"
      title="Plan / Execute / Reflect"
      description="Agent run akışları — HITL onay duraklarıyla. Token/cost başına izleme."
      kpis={[
        {
          label: 'Aktif run',
          value: String(runs.filter((r) => r.status === 'running').length),
          tone: 'cyan',
        },
        {
          label: 'HITL bekliyor',
          value: String(runs.filter((r) => r.status === 'awaiting_human').length),
          tone: 'magenta',
        },
        {
          label: 'Tamamlanmış',
          value: String(runs.filter((r) => r.status === 'completed').length),
          tone: 'lime',
        },
        {
          label: 'Hata',
          value: String(runs.filter((r) => r.status === 'failed').length),
          tone: 'amber',
        },
      ]}
    >
      <div className="grid gap-4">
        {runs.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon={Bot} tone="violet" size={14} />
                  <span className="font-medium">{r.name}</span>
                  <Badge
                    tone={
                      r.status === 'running'
                        ? 'info'
                        : r.status === 'awaiting_human'
                          ? 'warning'
                          : r.status === 'completed'
                            ? 'success'
                            : 'danger'
                    }
                    size="sm"
                    dot
                  >
                    {r.status}
                  </Badge>
                  <Badge size="sm" tone="info">
                    {r.triggeredBy}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  {r.agentId} · {new Date(r.startedAt).toLocaleTimeString('tr-TR')} ·{' '}
                  {r.totalTokens.in + r.totalTokens.out} tok · ${r.totalCost.toFixed(2)}
                </span>
              </div>
              {r.status === 'awaiting_human' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    tone="primary"
                    onClick={() => toast.success(`${r.id} onaylandı`)}
                  >
                    Onayla
                  </Button>
                  <Button size="sm" tone="ghost" onClick={() => toast.show(`${r.id} reddedildi`)}>
                    Reddet
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              {r.steps.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: KIND_COLOR[s.kind], minWidth: 56 }}
                  >
                    {KIND_LABEL[s.kind]}
                  </span>
                  <span className="flex-1 text-sm">{s.label}</span>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                    {s.tokens && (
                      <span className="tabular-nums">
                        {s.tokens.in}+{s.tokens.out} tok
                      </span>
                    )}
                    {s.cost !== undefined && (
                      <span className="tabular-nums">${s.cost.toFixed(2)}</span>
                    )}
                    {s.durationMs !== undefined && (
                      <span className="tabular-nums">{s.durationMs}ms</span>
                    )}
                  </div>
                  <Icon
                    icon={
                      s.status === 'completed'
                        ? CheckCircle2
                        : s.status === 'running'
                          ? Loader2
                          : s.status === 'awaiting_human'
                            ? Hand
                            : s.status === 'failed'
                              ? XCircle
                              : Bot
                    }
                    tone={
                      s.status === 'completed'
                        ? 'lime'
                        : s.status === 'awaiting_human'
                          ? 'magenta'
                          : s.status === 'failed'
                            ? 'magenta'
                            : 'cyan'
                    }
                    size={14}
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
