import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatTL } from '@/lib/format';
import type { Commission } from '@/types/broker';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText } from 'lucide-react';

export default function BrokerCommissionsPage() {
  const { data } = useQuery({
    queryKey: ['broker', 'commissions'],
    queryFn: () => apiFetch<{ items: Commission[] }>('/broker/commissions'),
  });
  const items = data?.items ?? [];
  const received = items
    .filter((c) => c.status === 'received')
    .reduce((sum, c) => sum + c.netAmount, 0);
  const pending = items
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.netAmount, 0);
  const refunded = items
    .filter((c) => c.status === 'refunded')
    .reduce((sum, c) => sum + c.netAmount, 0);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Komisyon Yönetimi</h1>
        <Button
          leftIcon={<Icon icon={FileText} size={14} />}
          onClick={() => toast.success('Yıllık vergi raporu PDF hazırlandı')}
        >
          Vergi raporu (PDF)
        </Button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Alındı" value={formatTL(received, true)} tone="lime" />
        <Stat label="Bekleyen" value={formatTL(pending, true)} tone="amber" />
        <Stat label="İade" value={formatTL(refunded, true)} tone="magenta" />
      </section>

      <Card>
        <CardHeader>
          <span className="font-medium">Anlaşmalar</span>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">Tarih</th>
                <th className="py-2 pr-3">İlan</th>
                <th className="py-2 pr-3">Satış</th>
                <th className="py-2 pr-3">%</th>
                <th className="py-2 pr-3">Net</th>
                <th className="py-2 pr-3">Tahsil eden</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3 text-right">Makbuz</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3 text-xs">{c.date.slice(0, 10)}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{c.listingId}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatTL(c.salePrice, true)}</td>
                  <td className="py-2 pr-3 tabular-nums">{c.commissionPercent.toFixed(1)}%</td>
                  <td className="py-2 pr-3 tabular-nums font-medium text-[var(--accent-lime)]">
                    {formatTL(c.netAmount, true)}
                  </td>
                  <td className="py-2 pr-3 text-xs">{c.payee}</td>
                  <td className="py-2 pr-3">
                    <Badge
                      tone={
                        c.status === 'received'
                          ? 'success'
                          : c.status === 'pending'
                            ? 'warning'
                            : 'danger'
                      }
                      size="sm"
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Button
                      tone="ghost"
                      size="icon"
                      aria-label="Makbuz"
                      onClick={() => toast.success(`${c.id} makbuz PDF`)}
                    >
                      <Icon icon={Download} size={14} />
                    </Button>
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

function Stat({
  label,
  value,
  tone,
}: { label: string; value: string; tone: 'lime' | 'amber' | 'magenta' }) {
  const color = `var(--accent-${tone})`;
  return (
    <Card tone="solid">
      <CardBody className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
          {label}
        </span>
        <span className="text-2xl font-semibold tabular-nums" style={{ color }}>
          {value}
        </span>
      </CardBody>
    </Card>
  );
}
