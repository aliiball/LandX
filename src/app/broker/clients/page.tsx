import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatRelative, formatTL } from '@/lib/format';
import type { Client } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Download, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';

export default function BrokerClientsPage() {
  const { data } = useQuery({
    queryKey: ['broker', 'clients'],
    queryFn: () => apiFetch<{ items: Client[] }>('/broker/clients'),
  });
  const clients = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Müşteri Kartları</h1>
      </header>

      <Card>
        <CardHeader>
          <span className="font-medium">Aktif müşteriler</span>
          <Badge tone="info" size="sm">
            {clients.length}
          </Badge>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">Müşteri</th>
                <th className="py-2 pr-3">Tip</th>
                <th className="py-2 pr-3">Lead</th>
                <th className="py-2 pr-3">Son temas</th>
                <th className="py-2 pr-3">Komisyon</th>
                <th className="py-2 pr-3">KVKK</th>
                <th className="py-2 pr-3 text-right">KVKK Aksiyonu</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{c.fullName}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{c.email}</div>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge tone="neutral" size="sm">
                      {c.type}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{c.activeLeadCount}</td>
                  <td className="py-2 pr-3">{formatRelative(c.lastContactAt)}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatTL(c.totalCommission, true)}</td>
                  <td className="py-2 pr-3">
                    <Badge tone="success" size="sm" dot>
                      <Icon icon={ShieldCheck} size={12} tone="lime" />
                      <span>Onaylı</span>
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="AI özet"
                        onClick={() => toast.agent('AI: 3 ay aktivite özeti hazır')}
                      >
                        <Icon icon={Sparkles} size={14} />
                      </Button>
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="Veri indir"
                        onClick={() => toast.success('Veri paketi PDF hazırlandı')}
                      >
                        <Icon icon={Download} size={14} />
                      </Button>
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="KVKK silme"
                        onClick={() => toast.error('DSAR silme kuyruğuna eklendi')}
                      >
                        <Icon icon={Trash2} size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </main>
  );
}
