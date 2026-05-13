import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatTL } from '@/lib/format';
import type { BrokerTeamMember } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Mail, ShieldOff, UserPlus } from 'lucide-react';

export default function BrokerTeamPage() {
  const { data } = useQuery({
    queryKey: ['broker', 'team'],
    queryFn: () => apiFetch<{ items: BrokerTeamMember[] }>('/broker/team'),
  });
  const team = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Takım Yönetimi</h1>
        <Button
          leftIcon={<Icon icon={UserPlus} size={14} />}
          onClick={() => toast.success('Davet e-postası gönderildi')}
        >
          Üye davet et
        </Button>
      </header>

      <Card>
        <CardHeader>
          <span className="font-medium">Ekip üyeleri</span>
          <Badge tone="info" size="sm">
            {team.length}
          </Badge>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {team.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-3"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {m.email} · {m.role}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right">
                  <p className="text-xs text-[var(--text-tertiary)]">Atanan lead</p>
                  <p className="font-semibold tabular-nums">{m.assignedLeadCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-tertiary)]">Ay-içi komisyon</p>
                  <p className="font-semibold tabular-nums text-[var(--accent-lime)]">
                    {formatTL(m.monthlyCommission, true)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    tone="ghost"
                    size="icon"
                    aria-label="Mesaj"
                    onClick={() => toast.show(`${m.name} mesaj gönderiliyor`)}
                  >
                    <Icon icon={Mail} size={14} />
                  </Button>
                  {m.role !== 'broker-admin' && (
                    <Button
                      tone="ghost"
                      size="icon"
                      aria-label="Yetki"
                      onClick={() => toast.warning('Yetki düzenleme paneli')}
                    >
                      <Icon icon={ShieldOff} size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}
