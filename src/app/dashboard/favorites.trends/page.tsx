import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Card, CardBody, CardHeader, Icon } from '@/components/ui';
import { ArrowDownRight, ArrowUpRight, Heart, Sparkles, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Fav = {
  id: string;
  title: string;
  city: string;
  current: number;
  trend30: Array<{ d: string; v: number }>;
};

const FAVS: Fav[] = [
  {
    id: 'lst_00214',
    title: 'Beykoz Şile yolu 5.200m²',
    city: 'İstanbul',
    current: 2_280_000,
    trend30: makeTrend(30, 2_180_000, 2_300_000),
  },
  {
    id: 'lst_00321',
    title: 'Çeşme Reisdere 1.480m² imarlı',
    city: 'İzmir',
    current: 4_650_000,
    trend30: makeTrend(30, 4_400_000, 4_720_000),
  },
  {
    id: 'lst_00498',
    title: 'Mudanya zeytinlik 3.800m²',
    city: 'Bursa',
    current: 1_440_000,
    trend30: makeTrend(30, 1_360_000, 1_460_000),
  },
  {
    id: 'lst_00102',
    title: 'Kuşadası Soğucak 920m²',
    city: 'Aydın',
    current: 2_140_000,
    trend30: makeTrend(30, 2_180_000, 2_220_000),
  },
];

function makeTrend(n: number, min: number, max: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const v = min + (max - min) * t + Math.sin(i / 4) * (max - min) * 0.1;
    return { d: `D${i + 1}`, v: Math.round(v) };
  });
}

export default function FavoritesTrendsPage() {
  return (
    <AdminPage
      surfaceKey="B · /dashboard/favorites/trends"
      module="B3 Favorites Trends"
      title="Favorilerinizin Fiyat Trendi"
      description="Son 30 günlük fiyat hareketi · AI özet · uyarı eşiği önerileri."
      kpis={[
        { label: 'Favori', value: String(FAVS.length), tone: 'magenta' },
        {
          label: 'Düşüş yapan',
          value: String(
            FAVS.filter((f) => {
              const a = f.trend30[0]?.v ?? 0;
              const b = f.trend30[f.trend30.length - 1]?.v ?? 0;
              return b < a;
            }).length,
          ),
          tone: 'lime',
        },
        {
          label: 'Yükseliş',
          value: String(
            FAVS.filter((f) => {
              const a = f.trend30[0]?.v ?? 0;
              const b = f.trend30[f.trend30.length - 1]?.v ?? 0;
              return b > a;
            }).length,
          ),
          tone: 'amber',
        },
        { label: 'Ortalama değişim', value: '%+3.2', tone: 'cyan' },
      ]}
    >
      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI özet</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Favorilerinizin 3'ü son 30 günde yükselişte, 1'i düşüşte.{' '}
          <span className="font-medium text-[var(--accent-cyan)]">Çeşme Reisdere</span> ilanı %5.7
          yükselişle hareketli — alıcı baskısı artıyor.{' '}
          <span className="font-medium">Kuşadası Soğucak</span> ise %2.3 düşüşle pazarlık marjına
          açıldı.
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {FAVS.map((f) => {
          const first = f.trend30[0]?.v ?? 1;
          const last = f.trend30[f.trend30.length - 1]?.v ?? first;
          const delta = ((last - first) / first) * 100;
          const up = delta > 0;
          return (
            <Card key={f.id}>
              <CardHeader>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Icon icon={Heart} tone="magenta" size={14} />
                    <span className="font-medium">{f.title}</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">
                    {f.id} · {f.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold tabular-nums">
                    ₺{f.current.toLocaleString('tr-TR')}
                  </span>
                  <Badge tone={up ? 'warning' : 'success'} size="sm">
                    <Icon icon={up ? ArrowUpRight : ArrowDownRight} size={12} className="mr-0.5" />
                    {up ? '+' : ''}
                    {delta.toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={f.trend30}>
                      <defs>
                        <linearGradient id={`g_${f.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor={up ? 'var(--accent-amber)' : 'var(--accent-lime)'}
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="100%"
                            stopColor={up ? 'var(--accent-amber)' : 'var(--accent-lime)'}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeOpacity={0.1} />
                      <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={['dataMin', 'dataMax']} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={up ? 'var(--accent-amber)' : 'var(--accent-lime)'}
                        fill={`url(#g_${f.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={TrendingUp} tone="cyan" />
            <span className="font-medium">Tüm favoriler ortalaması</span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={makeTrend(30, 2_300_000, 2_400_000)}>
                <CartesianGrid strokeOpacity={0.15} />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="var(--accent-cyan)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </AdminPage>
  );
}
