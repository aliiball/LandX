import { Button, Card, CardBody, CardHeader, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Download } from 'lucide-react';

const KPI_DATA = [
  { label: 'Görüntülenme', value: '23.412', change: '+12%' },
  { label: 'Lead/İlan', value: '1.8', change: '+0.3' },
  { label: 'Ort. Satış Süresi', value: '42 gün', change: '-4 gün' },
  { label: 'Top Bölge', value: 'Karacabey', change: '+6 ilan' },
];

const TREND = [22, 28, 31, 35, 29, 38, 42, 48, 44, 51, 57, 62];

export default function BrokerAnalyticsPage() {
  const max = Math.max(...TREND);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Analitik & Insights</h1>
        <Button onClick={() => toast.success('Aylık rapor PDF hazırlandı')}>
          <Download className="size-4 mr-1.5" aria-hidden /> Aylık rapor
        </Button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_DATA.map((kpi) => (
          <Card key={kpi.label} tone="solid">
            <CardBody className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                {kpi.label}
              </span>
              <span className="text-2xl font-semibold tabular-nums">{kpi.value}</span>
              <span className="text-xs text-[var(--accent-lime)]">{kpi.change}</span>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <span className="font-medium">Portföy büyüklüğü (son 12 ay)</span>
        </CardHeader>
        <CardBody>
          <div className="flex h-40 items-end gap-2">
            {TREND.map((v, i) => (
              <div
                key={`bar-${i}-${v}`}
                className="flex-1 rounded-t-[var(--radius-sm)] bg-gradient-to-t from-[var(--accent-cyan)]/30 to-[var(--accent-cyan)]"
                style={{ height: `${(v / max) * 100}%` }}
                aria-label={`Ay ${i + 1}: ${v}`}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Rakip karşılaştırma (AI)</span>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Karacabey bölgesinde son 7 günde 3 rakip ofis daha aktif. Ortalama fiyat aralığı
          portföyünüzden %12 farklı. AI önerisi: 4 ilanın fiyat ayarı pozisyonu güçlendirecek.
        </CardBody>
      </Card>
    </main>
  );
}
