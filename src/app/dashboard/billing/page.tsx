import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { formatTL } from '@/lib/format';
import { CreditCard, Download } from 'lucide-react';

const INVOICES = [
  { id: 'inv_001', date: '2026-05-01', amount: 499, status: 'Ödendi' },
  { id: 'inv_002', date: '2026-04-01', amount: 499, status: 'Ödendi' },
  { id: 'inv_003', date: '2026-03-01', amount: 499, status: 'Ödendi' },
];

export default function BillingPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Faturalandırma</h1>
        <Button onClick={() => toast.show('Plan değiştirme akışı')}>Plan değiştir</Button>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <Card glow="cyan">
          <CardHeader>
            <div>
              <p className="font-medium">Profesyonel plan</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Aylık · Sonraki ödeme 2026-06-01
              </p>
            </div>
            <Badge tone="info" size="sm">
              Aktif
            </Badge>
          </CardHeader>
          <CardBody className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums">{formatTL(499)}</span>
            <span className="text-sm text-[var(--text-tertiary)]">/ ay (KDV dahil)</span>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">Ödeme metodu</span>
          </CardHeader>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon icon={CreditCard} tone="cyan" />
              <div>
                <p className="font-medium">Visa **** 4242</p>
                <p className="text-xs text-[var(--text-tertiary)]">12/27</p>
              </div>
            </div>
            <Button tone="ghost" size="sm" onClick={() => toast.show('Kart güncelleme paneli')}>
              Güncelle
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <span className="font-medium">Fatura geçmişi</span>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">No</th>
                <th className="py-2 pr-3">Tarih</th>
                <th className="py-2 pr-3">Tutar</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3 font-mono">{inv.id}</td>
                  <td className="py-2 pr-3">{inv.date}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatTL(inv.amount)}</td>
                  <td className="py-2 pr-3">
                    <Badge tone="success" size="sm">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Button
                      tone="ghost"
                      size="icon"
                      aria-label="PDF indir"
                      onClick={() => toast.success(`${inv.id} PDF indiriliyor`)}
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
