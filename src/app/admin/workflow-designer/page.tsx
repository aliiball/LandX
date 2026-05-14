import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getWorkflows } from '@/mocks/seed/admin';
import type { Workflow, WorkflowState } from '@/types/admin';
import { ArrowRight, GitBranch, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';

const STATE_TONE: Record<WorkflowState['kind'], 'success' | 'warning' | 'info'> = {
  initial: 'info',
  normal: 'warning',
  final: 'success',
};

export default function WorkflowDesignerPage() {
  const workflows = getWorkflows();
  const firstId = workflows[0]?.id ?? '';
  const [activeId, setActiveId] = useState(firstId);
  const wf = workflows.find((w) => w.id === activeId) ?? workflows[0];
  const [currentState, setCurrentState] = useState(wf?.states[0]?.id ?? '');
  if (!wf) return null;

  const possibleTransitions = wf.transitions.filter((t) => t.from === currentState);

  return (
    <AdminPage
      surfaceKey="C · /admin/workflow-designer"
      module="S04 Workflow Designer"
      title="Workflow Designer"
      description="State machine editor — ilan / teklif / KYC süreçleri. Simulate mode ile transition test."
      actions={
        <>
          <Button
            tone="agent"
            size="sm"
            leftIcon={<Icon icon={Sparkles} size={14} />}
            onClick={() =>
              toast.agent('AI: bu workflow’a 1 nokta önerisi var (KYC scoring eşik düşürme)')
            }
          >
            AI öner
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={Play} size={14} />}
            onClick={() => {
              setCurrentState(wf.states[0]?.id ?? '');
              toast.show('Simülasyon başa alındı');
            }}
          >
            Simülasyonu sıfırla
          </Button>
        </>
      }
      kpis={[
        { label: 'Workflow', value: String(workflows.length), tone: 'cyan' },
        { label: 'State', value: String(wf.states.length), tone: 'violet' },
        { label: 'Transition', value: String(wf.transitions.length), tone: 'lime' },
        {
          label: 'AI assisted',
          value: String(wf.transitions.filter((t) => t.aiAssisted).length),
          tone: 'agent' as 'violet',
        },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <span className="font-medium">Workflowlar</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-1">
            {workflows.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setActiveId(w.id);
                  setCurrentState(w.states[0]?.id ?? '');
                }}
                className={`flex flex-col gap-1 rounded-[var(--radius-md)] px-3 py-2 text-left transition-colors ${
                  w.id === activeId
                    ? 'border border-[var(--accent-cyan)] bg-[var(--surface-elevated)]'
                    : 'border border-transparent hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon icon={GitBranch} size={14} tone="violet" />
                  <span className="font-medium">{w.name}</span>
                </div>
                <span className="text-xs text-[var(--text-tertiary)]">{w.description}</span>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">{wf.name}</span>
            <Badge size="sm" tone="info">
              {wf.states.length} state · {wf.transitions.length} transition
            </Badge>
          </CardHeader>
          <CardBody>
            <StateDiagram workflow={wf} currentState={currentState} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Play} tone="cyan" />
            <span className="font-medium">Simulate</span>
          </div>
          <Badge size="sm" tone="agent">
            current: {wf.states.find((s) => s.id === currentState)?.label}
          </Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <div className="text-xs text-[var(--text-tertiary)]">
            Şu anda <span className="font-mono text-[var(--accent-cyan)]">{currentState}</span>{' '}
            state'indeyiz. Aşağıdaki transition'lar mümkün:
          </div>
          {possibleTransitions.length === 0 ? (
            <span className="text-sm">Final state — başka transition yok.</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {possibleTransitions.map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  tone="primary"
                  leftIcon={<Icon icon={ArrowRight} size={14} />}
                  onClick={() => {
                    setCurrentState(t.to);
                    toast.success(
                      `Transition: ${t.trigger} → ${wf.states.find((s) => s.id === t.to)?.label}`,
                    );
                  }}
                >
                  {t.trigger} · → {wf.states.find((s) => s.id === t.to)?.label}
                </Button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <AdminTable
        title="Transition tablosu"
        columns={[
          { key: 'from', label: 'From' },
          { key: 'trig', label: 'Trigger' },
          { key: 'to', label: 'To' },
          { key: 'roles', label: 'Roles' },
          { key: 'ai', label: 'AI' },
          { key: 'guard', label: 'Guard / Action' },
        ]}
        rows={wf.transitions.map((t) => ({
          from: (
            <Badge
              tone={STATE_TONE[wf.states.find((s) => s.id === t.from)?.kind ?? 'normal']}
              size="sm"
            >
              {wf.states.find((s) => s.id === t.from)?.label ?? t.from}
            </Badge>
          ),
          trig: <span className="font-mono text-xs">{t.trigger}</span>,
          to: (
            <Badge
              tone={STATE_TONE[wf.states.find((s) => s.id === t.to)?.kind ?? 'normal']}
              size="sm"
            >
              {wf.states.find((s) => s.id === t.to)?.label ?? t.to}
            </Badge>
          ),
          roles: <span className="font-mono text-xs">{t.roles.join(', ')}</span>,
          ai: t.aiAssisted ? (
            <Badge size="sm" tone="agent">
              AI
            </Badge>
          ) : null,
          guard: (
            <span className="font-mono text-xs">
              {[t.guard, t.action].filter(Boolean).join(' / ')}
            </span>
          ),
        }))}
      />
    </AdminPage>
  );
}

function StateDiagram({ workflow, currentState }: { workflow: Workflow; currentState: string }) {
  const W = 720;
  const H = 220;
  const N = workflow.states.length;
  const margin = 70;
  const dx = (W - margin * 2) / Math.max(1, N - 1);

  function pos(idx: number) {
    return { x: margin + idx * dx, y: H / 2 };
  }

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-44 w-full min-w-[600px]"
        role="img"
        aria-label={`${workflow.name} state diagram`}
      >
        <title>{workflow.name} state diagram</title>
        {workflow.transitions.map((t) => {
          const fromIdx = workflow.states.findIndex((s) => s.id === t.from);
          const toIdx = workflow.states.findIndex((s) => s.id === t.to);
          if (fromIdx < 0 || toIdx < 0) return null;
          const a = pos(fromIdx);
          const b = pos(toIdx);
          const mid = { x: (a.x + b.x) / 2, y: a.y - (toIdx < fromIdx ? 40 : -40) };
          return (
            <g key={t.id}>
              <path
                d={`M ${a.x + 24} ${a.y} Q ${mid.x} ${mid.y}, ${b.x - 24} ${b.y}`}
                stroke={t.aiAssisted ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}
                strokeWidth={1.2}
                fill="none"
                markerEnd="url(#arrow)"
                opacity={0.7}
              />
              <text
                x={mid.x}
                y={mid.y - 6}
                fontSize={9}
                textAnchor="middle"
                fill="var(--text-secondary)"
              >
                {t.trigger}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L6,4 L0,8 Z" fill="var(--accent-cyan)" />
          </marker>
        </defs>
        {workflow.states.map((s, idx) => {
          const p = pos(idx);
          const active = s.id === currentState;
          return (
            <g key={s.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill={
                  s.kind === 'initial'
                    ? 'var(--accent-cyan)'
                    : s.kind === 'final'
                      ? 'var(--accent-lime)'
                      : 'var(--surface-elevated)'
                }
                stroke={active ? 'var(--accent-magenta)' : 'var(--stroke-subtle)'}
                strokeWidth={active ? 2.5 : 1}
              />
              <text x={p.x} y={p.y + 4} fontSize={9} textAnchor="middle" fill="var(--text-primary)">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
