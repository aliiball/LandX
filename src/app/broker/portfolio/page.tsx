import { Badge, Button, Card, CardBody, CardHeader, Checkbox, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFeaturedListings } from '@/lib/api/listings';
import { formatNumber, formatTL } from '@/lib/format';
import { Download, Sparkles, Upload } from 'lucide-react';

export default function BrokerPortfolioPage() {
  const { data } = useFeaturedListings();
  const items = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Portföy Yönetimi</h1>
        <div className="flex gap-2">
          <Button
            tone="ghost"
            leftIcon={<Icon icon={Upload} size={14} />}
            onClick={() => toast.success('CSV içe aktarım hazır')}
          >
            CSV içe aktar
          </Button>
          <Button
            tone="agent"
            leftIcon={<Icon icon={Sparkles} size={14} />}
            onClick={() => toast.agent('AI toplu iyileştirme önerisi hazırlandı')}
          >
            AI toplu öneri
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <span className="font-medium">Aktif portföy</span>
          <Badge tone="success" size="sm">
            {items.length} ilan
          </Badge>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">
                  <Checkbox size="sm" />
                </th>
                <th className="py-2 pr-3">İlan</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3">Fiyat</th>
                <th className="py-2 pr-3">m²</th>
                <th className="py-2 pr-3">Görüntülenme</th>
                <th className="py-2 pr-3">Lead</th>
                <th className="py-2 pr-3">Atanan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3">
                    <Checkbox size="sm" />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="font-medium">{l.title.slice(0, 60)}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {l.region.city} · {l.region.district}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge tone={l.status === 'active' ? 'success' : 'warning'} size="sm">
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{formatTL(l.price, true)}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatNumber(l.areaSqm)}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatNumber(l.viewCount)}</td>
                  <td className="py-2 pr-3 tabular-nums">{l.inquiryCount}</td>
                  <td className="py-2 pr-3 text-xs text-[var(--text-tertiary)]">Selin</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Button tone="neutral" onClick={() => toast.success('Toplu fiyat %5 düşürüldü')}>
          Toplu -%5
        </Button>
        <Button tone="neutral" onClick={() => toast.success('Toplu fiyat %5 artırıldı')}>
          Toplu +%5
        </Button>
        <Button
          tone="ghost"
          leftIcon={<Icon icon={Download} size={14} />}
          onClick={() => toast.success('CSV indirildi')}
        >
          Dışa aktar
        </Button>
      </div>
    </main>
  );
}
