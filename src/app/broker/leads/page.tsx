import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { cn, headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatRelative, formatTL } from '@/lib/format';
import type { Lead, LeadHeat } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Flame, Snowflake, ThermometerSun } from 'lucide-react';
import { useState } from 'react';

const HEAT_META: Record<
  LeadHeat,
  {
    icon: React.ComponentProps<typeof Icon>['icon'];
    tone: React.ComponentProps<typeof Icon>['tone'];
    label: string;
  }
> = {
  hot: { icon: Flame, tone: 'magenta', label: 'Sıcak' },
  warm: { icon: ThermometerSun, tone: 'amber', label: 'Ilık' },
  cold: { icon: Snowflake, tone: 'cyan', label: 'Soğuk' },
};

export default function BrokerLeadsPage() {
  const { data } = useQuery({
    queryKey: ['broker', 'leads'],
    queryFn: () => apiFetch<{ items: Lead[] }>('/broker/leads'),
  });
  const leads = data?.items ?? [];
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const active = leads.find((l) => l.id === activeId) ?? leads[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Lead / CRM</h1>
      </header>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_2fr]">
        <aside className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {leads.map((l) => {
            const heat = HEAT_META[l.heat];
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setActiveId(l.id)}
                className={cn(
                  'rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm transition-colors',
                  active?.id === l.id
                    ? 'border-[var(--accent-cyan)] bg-[var(--surface-slate)]'
                    : 'border-[var(--stroke-subtle)] hover:bg-[var(--surface-slate)]/40',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{l.clientName}</span>
                  <Icon icon={heat.icon} tone={heat.tone} size={14} />
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {l.stage} · {l.nextAction}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  SLA: {formatRelative(l.slaDueAt)}
                </p>
              </button>
            );
          })}
        </aside>

        {active && (
          <Card>
            <CardHeader>
              <div>
                <p className="font-medium">{active.clientName}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{active.clientPhone}</p>
              </div>
              <Badge
                tone={active.heat === 'hot' ? 'agent' : active.heat === 'warm' ? 'premium' : 'info'}
                size="sm"
                dot
              >
                {HEAT_META[active.heat].label}
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Aşama" value={active.stage} />
                <Stat label="Sonraki" value={active.nextAction} />
                <Stat label="Kaynak" value={active.source} />
                <Stat label="Tahmini Değer" value={formatTL(active.estimatedValue, true)} />
                <Stat label="Atanan" value={active.assignedAgentId ?? '—'} />
                <Stat label="Oluşturuldu" value={formatRelative(active.createdAt)} />
              </div>
              <p className="rounded-[var(--radius-md)] bg-[var(--surface-slate)]/40 p-2 text-[var(--text-secondary)]">
                Notlar: {active.notes}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success(`${active.clientName} aranıyor`)}>
                  Geri ara
                </Button>
                <Button tone="neutral" onClick={() => toast.success('WhatsApp şablonu açıldı')}>
                  WhatsApp
                </Button>
                <Button tone="ghost" onClick={() => toast.show('Stage güncellendi')}>
                  Stage değiştir
                </Button>
                <Button tone="agent" onClick={() => toast.agent('AI takip mesajı hazırlandı')}>
                  AI takip
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-slate)]/40 px-2 py-1.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
