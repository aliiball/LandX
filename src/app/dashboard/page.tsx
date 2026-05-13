import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  TokenStream,
  tokenize,
} from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useFeaturedListings, useGlobalListingStats } from '@/lib/api/listings';
import { useDemoIdentity } from '@/lib/auth/useDemoIdentity';
import { formatNumber } from '@/lib/format';
import { Eye, Heart, Mail, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

const AI_INSIGHTS = [
  'Karacabey portföyünde 2 ilan fiyat ayarı önerisi geliyor — ortalama %4 üstünde.',
  'Çeşme kayıtlı aramana 5 yeni ilan eklendi, 2 tanesi AI değerleme üst yüzdesinde.',
  'Bu hafta 12 görüntüleme aldın — geçen haftaya göre %22 artış.',
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const { identity } = useDemoIdentity();
  const stats = useGlobalListingStats();
  const featured = useFeaturedListings();
  const favorites = useFavorites();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <header className="flex flex-col gap-1">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
          Hoş geldin
        </span>
        <h1 className={headingRecipe({ level: 'h2' })}>{identity.displayName}</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Heart} tone="magenta" label="Favoriler" value={favorites.count} />
        <Kpi icon={Eye} tone="cyan" label="İlanlarım" value={featured.data?.items.length ?? 0} />
        <Kpi icon={Mail} tone="amber" label="Mesajlar" value={5} />
        <Kpi icon={MapPin} tone="violet" label="Kayıtlı arama" value={3} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card glow="violet">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Sparkles} tone="violet" />
              <span className="font-medium">AI Bugün</span>
            </div>
            <Badge tone="agent" size="sm" dot>
              3 öneri
            </Badge>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {AI_INSIGHTS.map((insight, idx) => (
              <div
                key={insight}
                className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)]/40 p-3"
              >
                <span className="font-mono text-xs text-[var(--text-tertiary)]">0{idx + 1}</span>
                <TokenStream tokens={tokenize(insight)} intervalMs={18} />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">Aktivite</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 text-sm">
            <ActivityItem icon={TrendingUp} label="Bu hafta 138 görüntüleme" tone="lime" />
            <ActivityItem icon={Heart} label="2 yeni favori eklendi" tone="magenta" />
            <ActivityItem icon={Mail} label="Karacabey ilanına 1 mesaj" tone="cyan" />
            <ActivityItem icon={Sparkles} label="AI değerleme güncellendi" tone="violet" />
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <span className="font-medium">Hızlı Eylem</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Button block onClick={() => navigate('/post-listing')}>
              Yeni ilan ver
            </Button>
            <Button block tone="neutral" onClick={() => navigate('/dashboard/listings')}>
              İlanlarımı yönet
            </Button>
            <Button block tone="ghost" onClick={() => navigate('/dashboard/ai')}>
              AI asistana sor
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">Global istatistik</span>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-3 text-sm">
            <StatRow label="Aktif ilan" value={formatNumber(stats.data?.activeCount ?? 0)} />
            <StatRow label="Şehir" value={formatNumber(stats.data?.cityCount ?? 0)} />
            <StatRow
              label="Doğrulu tapu"
              value={formatNumber(stats.data?.verifiedDeedCount ?? 0)}
            />
            <StatRow label="Ort. ₺/m²" value={formatNumber(stats.data?.avgPricePerSqm ?? 0)} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-medium">Son ziyaret</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 text-sm">
            {featured.data?.items.slice(0, 4).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => navigate(`/listing/${l.id}`)}
                className="flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 text-left hover:bg-[var(--surface-slate)]/60"
              >
                <span className="truncate">
                  {l.region.city} · {l.region.district}
                </span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  {l.id.slice(-5)}
                </span>
              </button>
            ))}
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function Kpi({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentProps<typeof Icon>['icon'];
  label: string;
  value: number;
  tone: 'cyan' | 'violet' | 'magenta' | 'amber';
}) {
  return (
    <Card tone="solid">
      <CardBody className="flex items-center gap-3">
        <Icon icon={icon} tone={tone} size={24} />
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            {label}
          </span>
          <span className="text-2xl font-semibold tabular-nums">{formatNumber(value)}</span>
        </div>
      </CardBody>
    </Card>
  );
}

function ActivityItem({
  icon,
  label,
  tone,
}: {
  icon: React.ComponentProps<typeof Icon>['icon'];
  label: string;
  tone: React.ComponentProps<typeof Icon>['tone'];
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon icon={icon} size={14} tone={tone} />
      <span>{label}</span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
