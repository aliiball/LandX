import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Icon, toast } from '@/components/ui';
import { getAgentRuns } from '@/mocks/seed/agent';
import { Bot, Hand } from 'lucide-react';

export default function AdminAgentTasksPage() {
  const runs = getAgentRuns();

  return (
    <AdminPage
      surfaceKey="C · /admin/agent-tasks"
      module="A09 Tasks"
      title="Agent Görevleri"
      description="Çalışan / bekleyen agent task'ları — HITL onay merkezi."
      kpis={[
        { label: 'Toplam', value: String(runs.length), tone: 'cyan' },
        {
          label: 'HITL',
          value: String(runs.filter((r) => r.status === 'awaiting_human').length),
          tone: 'magenta',
        },
        {
          label: 'Çalışan',
          value: String(runs.filter((r) => r.status === 'running').length),
          tone: 'amber',
        },
        {
          label: 'Failed',
          value: String(runs.filter((r) => r.status === 'failed').length),
          tone: 'magenta',
        },
      ]}
    >
      <AdminTable
        title="Tüm görevler"
        columns={[
          { key: 'name', label: 'Görev' },
          { key: 'agent', label: 'Agent' },
          { key: 'trigger', label: 'Tetikleyici' },
          { key: 'status', label: 'Durum' },
          { key: 'cost', label: 'Maliyet', align: 'right' },
          { key: 'tokens', label: 'Tokens', align: 'right' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={runs.map((r) => ({
          name: (
            <div className="flex flex-col">
              <span className="font-medium">{r.name}</span>
              <span className="font-mono text-xs text-[var(--text-tertiary)]">{r.id}</span>
            </div>
          ),
          agent: (
            <span className="flex items-center gap-2 font-mono text-xs">
              <Icon icon={Bot} size={12} tone="violet" />
              {r.agentId}
            </span>
          ),
          trigger: (
            <Badge size="sm" tone="info">
              {r.triggeredBy}
            </Badge>
          ),
          status: (
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
          ),
          cost: <span className="tabular-nums text-xs">${r.totalCost.toFixed(2)}</span>,
          tokens: (
            <span className="tabular-nums text-xs">
              {(r.totalTokens.in + r.totalTokens.out).toLocaleString('tr-TR')}
            </span>
          ),
          actions:
            r.status === 'awaiting_human' ? (
              <Button
                size="sm"
                tone="primary"
                leftIcon={<Icon icon={Hand} size={14} />}
                onClick={() => toast.success(`${r.id} onaylandı`)}
              >
                HITL onayla
              </Button>
            ) : (
              <span className="text-xs text-[var(--text-tertiary)]">—</span>
            ),
        }))}
      />
    </AdminPage>
  );
}
