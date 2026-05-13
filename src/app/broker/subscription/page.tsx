import { Badge, Button, Card, CardBody, CardHeader, Switch, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { formatTL } from '@/lib/format';

const USAGE = [
  { label: 'Aktif ilan', current: 187, max: 200, unit: '' },
  { label: 'Ay-içi AI çağrısı', current: 4280, max: 10000, unit: '' },
  { label: 'Takım üyesi', current: 4, max: 5, unit: '' },
  { label: 'Depolama', current: 18, max: 100, unit: 'GB' },
];

const FEATURES = [
  { label: 'AI lead scorer', enabled: true },
  { label: 'Advanced analytics', enabled: true },
  { label: 'White-label vitrin', enabled: false },
  { label: 'Custom domain', enabled: false },
];

export default function BrokerSubscriptionPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Abonelik & Limitler</h1>
        <Button onClick={() => toast.success('Upgrade wizard açılıyor')}>Plan değiştir</Button>
      </header>

      <Card glow="cyan">
        <CardHeader>
          <div>
            <p className="font-medium">Kurumsal plan</p>
            <p className="text-xs text-[var(--text-tertiary)]">Sonraki ödeme 2026-06-01</p>
          </div>
          <Badge tone="info" size="sm">
            Aktif
          </Badge>
        </CardHeader>
        <CardBody className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums">{formatTL(1_999)}</span>
          <span className="text-sm text-[var(--text-tertiary)]">/ ay</span>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Kullanım metrikleri</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          {USAGE.map((u) => {
            const pct = Math.min(100, (u.current / u.max) * 100);
            return (
              <div key={u.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{u.label}</span>
                  <span className="font-mono tabular-nums text-[var(--text-secondary)]">
                    {u.current}
                    {u.unit} / {u.max}
                    {u.unit}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-slate)]">
                  <div className="h-full bg-[var(--accent-cyan)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Premium özellikler</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
            >
              <span>{f.label}</span>
              <Switch
                defaultChecked={f.enabled}
                onChange={() => toast.show(`${f.label} ayarı değişti`)}
              />
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
}
