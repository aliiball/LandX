import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Switch, toast } from '@/components/ui';
import { getEcaEvents, getEcaRules } from '@/mocks/seed/admin';
import { GripVertical, PlayCircle, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AdminRulesPage() {
  const initial = getEcaRules();
  const events = getEcaEvents();
  const [rules, setRules] = useState(initial.slice());
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    toast.success('Kural durumu güncellendi (dry-run önerilir)');
  }

  function onDragStart(idx: number) {
    setDragIdx(idx);
  }

  function onDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) return;
    setRules((prev) => {
      const next = prev.slice();
      const [moved] = next.splice(dragIdx, 1);
      if (moved) next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    toast.show('Sıralama güncellendi (priority yeniden hesaplandı)');
  }

  return (
    <AdminPage
      surfaceKey="C · /admin/rules"
      module="K04 ECA Rules"
      title="Event-Condition-Action Engine"
      description="24 kural · sürükle-bırak öncelik · dry-run · AI generated rule önerileri."
      actions={
        <>
          <Button
            tone="agent"
            size="sm"
            leftIcon={<Icon icon={Sparkles} size={14} />}
            onClick={() => toast.agent('AI ile 3 kural önerisi oluşturuldu')}
          >
            AI öner
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={PlayCircle} size={14} />}
            onClick={() => toast.show('Dry-run başlatıldı — son 7g audit üzerinde')}
          >
            Dry-run
          </Button>
        </>
      }
      kpis={[
        { label: 'Kural', value: String(rules.length), tone: 'cyan' },
        { label: 'Aktif', value: String(rules.filter((r) => r.enabled).length), tone: 'lime' },
        {
          label: 'AI generated',
          value: String(rules.filter((r) => r.aiGenerated).length),
          tone: 'violet',
        },
        {
          label: 'Son 1sa tetik',
          value: String(
            events.filter((e) => Date.now() - new Date(e.ts).getTime() < 60 * 60 * 1000).length,
          ),
          tone: 'amber',
        },
      ]}
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Kural sırası (sürükleyerek değiştir)</span>
          <Badge tone="info" size="sm">
            {rules.length}
          </Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-1">
          {rules.map((r, i) => (
            <div
              key={r.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2 ${
                r.enabled
                  ? 'border-[var(--stroke-subtle)]'
                  : 'border-[var(--stroke-subtle)]/40 opacity-60'
              } ${dragIdx === i ? 'bg-[var(--surface-elevated)]' : ''}`}
            >
              <Icon icon={GripVertical} tone="cyan" size={14} />
              <span className="w-8 font-mono text-xs text-[var(--text-tertiary)]">#{i + 1}</span>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  {r.aiGenerated && (
                    <Badge size="sm" tone="agent">
                      AI
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <Icon icon={Zap} size={12} />
                  <span className="font-mono">on {r.event}</span>
                  <span>·</span>
                  <span>{r.actions.map((a) => a.kind).join(', ')}</span>
                  {r.lastTriggeredAt && (
                    <>
                      <span>·</span>
                      <span>
                        tetik {r.triggerCount}× · son {ago(r.lastTriggeredAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Switch
                checked={r.enabled}
                onChange={() => toggle(r.id)}
                aria-label={`${r.name} toggle`}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <AdminTable
        title="Son tetiklemeler"
        columns={[
          { key: 'ts', label: 'Zaman' },
          { key: 'rule', label: 'Kural' },
          { key: 'outcome', label: 'Outcome' },
          { key: 'dur', label: 'Süre', align: 'right' },
        ]}
        rows={events.slice(0, 14).map((e) => ({
          ts: (
            <span className="font-mono text-xs">{new Date(e.ts).toLocaleTimeString('tr-TR')}</span>
          ),
          rule: <span className="text-sm">{e.ruleName}</span>,
          outcome: (
            <Badge
              tone={
                e.outcome === 'matched' ? 'success' : e.outcome === 'error' ? 'danger' : 'warning'
              }
              size="sm"
            >
              {e.outcome}
            </Badge>
          ),
          dur: <span className="tabular-nums text-xs">{e.durationMs}ms</span>,
        }))}
      />
    </AdminPage>
  );
}

function ago(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 60) return `${min}dk`;
  return `${Math.round(min / 60)}sa`;
}
