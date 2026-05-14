import { Badge, Card, CardBody, CardHeader, Icon } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { Activity, Eye, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] as const;

// 24×7 heatmap data (mock) — seller activity by hour & day
function heatmap(): number[][] {
  return DAYS.map((_, day) =>
    Array.from({ length: 24 }, (_, h) => {
      // Peak weekday evenings + weekend afternoons
      const weekendBoost = day >= 5 ? 1.3 : 1;
      const eveningBoost = h >= 18 && h <= 22 ? 1.6 : h >= 11 && h <= 14 ? 1.2 : 1;
      const noise = Math.sin(day * 1.7 + h / 3) * 0.3 + 1;
      return Math.round(Math.max(0, 10 + 30 * weekendBoost * eveningBoost * noise + (h % 3) * 4));
    }),
  );
}

export default function BrokerPerformancePage() {
  const data = heatmap();
  const max = Math.max(...data.flat());

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            B' · /broker/performance
          </span>
          <h1 className={headingRecipe({ level: 'h3' })}>Performans</h1>
          <p className="text-[var(--text-secondary)]">
            Görüntülenme · mesaj · teklif · dönüşüm — saatlik heatmap, il bazlı dağılım, 30g trend.
          </p>
        </div>
        <Badge tone="agent" size="md" dot>
          AI: ay sonu %+8 öngörü
        </Badge>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Görüntülenme (30g)" value="48.4K" delta="+12%" icon={Eye} tone="cyan" />
        <Stat label="Mesaj" value="284" delta="+8%" icon={MessageSquare} tone="violet" />
        <Stat label="Teklif" value="42" delta="+18%" icon={TrendingUp} tone="lime" />
        <Stat label="Dönüşüm" value="%4.6" delta="+0.4 pp" icon={Activity} tone="amber" />
      </section>

      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI insight</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Cumartesi 18-20 saatleri en yoğun ilgi alıyor — yeni ilan yayını için ideal pencere.
          Çarşamba sabah 09-11 mesaj aktivitesi en yüksek (lead takibi için en iyi zaman). Mevcut
          hızla ay sonunda{' '}
          <span className="font-medium text-[var(--accent-lime)]">+%8 dönüşüm</span> öngörüyorum.
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Aktivite Heatmap (24×7)</span>
          <Badge size="sm" tone="info">
            son 30g · saat × gün
          </Badge>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-[40px_repeat(24,_minmax(0,_1fr))] gap-0.5">
              <span className="text-[10px] text-[var(--text-tertiary)]" />
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className="text-center font-mono text-[10px] text-[var(--text-tertiary)]"
                >
                  {i % 3 === 0 ? `${i}` : ''}
                </span>
              ))}
            </div>
            {data.map((row, day) => (
              <div key={day} className="grid grid-cols-[40px_repeat(24,_minmax(0,_1fr))] gap-0.5">
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  {DAYS[day]}
                </span>
                {row.map((v, hour) => {
                  const intensity = v / max;
                  return (
                    <div
                      key={hour}
                      title={`${DAYS[day]} ${hour}:00 → ${v}`}
                      className="h-6 rounded-sm"
                      style={{
                        background:
                          intensity > 0.75
                            ? 'var(--accent-magenta)'
                            : intensity > 0.5
                              ? 'var(--accent-violet)'
                              : intensity > 0.3
                                ? 'var(--accent-cyan)'
                                : 'var(--surface-elevated)',
                        opacity: 0.3 + intensity * 0.7,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <span>Az</span>
            {[0.2, 0.4, 0.6, 0.85].map((v) => (
              <div
                key={v}
                className="h-3 w-6"
                style={{
                  background:
                    v > 0.75
                      ? 'var(--accent-magenta)'
                      : v > 0.5
                        ? 'var(--accent-violet)'
                        : v > 0.3
                          ? 'var(--accent-cyan)'
                          : 'var(--surface-elevated)',
                  opacity: 0.3 + v * 0.7,
                }}
              />
            ))}
            <span>Çok</span>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <span className="font-medium">30 günlük Görüntülenme Trendi</span>
          </CardHeader>
          <CardBody>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={Array.from({ length: 30 }, (_, i) => ({
                    d: `D${i + 1}`,
                    v: 1200 + Math.sin(i / 3) * 400 + i * 24,
                  }))}
                >
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeOpacity={0.15} />
                  <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke="var(--accent-cyan)" fill="url(#pg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <span className="font-medium">İl bazlı Performans (top 6)</span>
          </CardHeader>
          <CardBody>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { c: 'İstanbul', v: 12_400 },
                    { c: 'İzmir', v: 9_200 },
                    { c: 'Muğla', v: 6_800 },
                    { c: 'Antalya', v: 5_400 },
                    { c: 'Bursa', v: 4_100 },
                    { c: 'Aydın', v: 2_800 },
                  ]}
                >
                  <CartesianGrid strokeOpacity={0.15} />
                  <XAxis dataKey="c" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="v" fill="var(--accent-violet)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  delta,
  icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: typeof Eye;
  tone: 'cyan' | 'violet' | 'lime' | 'amber';
}) {
  return (
    <Card tone="solid">
      <CardBody className="flex items-center gap-3">
        <Icon icon={icon} tone={tone} />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            {label}
          </span>
          <span className="text-xl font-semibold tabular-nums">{value}</span>
          <span className="text-xs text-[var(--accent-lime)]">{delta}</span>
        </div>
      </CardBody>
    </Card>
  );
}
