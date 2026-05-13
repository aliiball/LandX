import { ListingCard } from '@/components/listings/ListingCard';
import { Badge, Button, Card, CardBody, Icon, Skeleton, Link as UiLink } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { parseNlQuery } from '@/features/search/parseNlQuery';
import { useFeaturedListings, useGlobalListingStats } from '@/lib/api/listings';
import { formatNumber } from '@/lib/format';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { ArrowRight, MapPin, Search, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

const NL_SAMPLES = [
  "İznik'te 2 dönüm imarlı tarla…",
  "Çeşme'de yatırımlık tarla…",
  "Bursa'da imar barışlı arsa…",
  "Bodrum'da denize yakın tarla…",
  "Karacabey'de 5 dönüm üzeri…",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const featured = useFeaturedListings();
  const stats = useGlobalListingStats();
  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const searchHref = useRouteHref('search');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % NL_SAMPLES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = query.trim();
    if (!text) {
      navigate(searchHref);
      return;
    }
    const parsed = parseNlQuery(text);
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(parsed.filters)) {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    }
    navigate(`${searchHref}?${params.toString()}`);
  };

  const placeholder = useMemo(() => NL_SAMPLES[placeholderIdx] ?? '', [placeholderIdx]);

  return (
    <main className="flex flex-col gap-20 pb-24">
      <section className="relative overflow-hidden px-4 pt-12 md:pt-20 lg:pt-28">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Badge tone="agent" size="md" dot>
            AI-first arsa marketplace
          </Badge>
          <h1 className={`${headingRecipe({ level: 'display' })} max-w-3xl`}>
            <span className="bg-gradient-to-br from-[var(--text-primary)] via-[var(--accent-cyan)] to-[var(--accent-violet)] bg-clip-text text-transparent">
              Arsa aramayı yeniden tanımladık.
            </span>
          </h1>
          <p className="max-w-2xl text-[var(--text-lead)] text-[var(--text-secondary)]">
            Türkiye'nin AI-native arsa platformu. Doğal dilde sor, anında değerle, sahiple konuş.
          </p>

          <form onSubmit={onSubmit} className="mt-2 w-full max-w-2xl">
            <div className="group flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-4 py-2 transition-colors focus-within:border-[var(--accent-cyan)] focus-within:shadow-[var(--glow-cyan)]">
              <Icon icon={Search} tone="tertiary" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label="Arama"
                className="flex-1 bg-transparent py-2.5 text-[var(--text-lead)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
              />
              <Button type="submit" rightIcon={<Icon icon={ArrowRight} size={16} />}>
                Ara
              </Button>
            </div>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--text-tertiary)]">
              <Icon icon={Sparkles} size={12} tone="violet" /> AI doğal dilde arama desteği — il,
              ilçe, m², imar durumu yazabilirsin
            </p>
          </form>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-3/4 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.82 0.16 195 / 0.18), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Aktif İlan"
            value={stats.data?.activeCount ?? 0}
            loading={stats.isLoading}
          />
          <StatCard
            label="Tapu Doğrulandı"
            value={stats.data?.verifiedDeedCount ?? 0}
            loading={stats.isLoading}
          />
          <StatCard label="Şehir" value={stats.data?.cityCount ?? 0} loading={stats.isLoading} />
          <StatCard
            label="Ort. ₺/m²"
            value={stats.data?.avgPricePerSqm ?? 0}
            loading={stats.isLoading}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className={headingRecipe({ level: 'h3' })}>Öne Çıkan İlanlar</h2>
            <p className="text-[var(--text-secondary)]">
              AI değerleme ve tapu doğrulamasından geçmiş seçkin arsalar.
            </p>
          </div>
          <UiLink to={searchHref} tone="neon" className="hidden md:inline-flex">
            Tümünü gör →
          </UiLink>
        </div>
        {featured.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                variant="rect"
                height={280}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.data?.items.slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} compact />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className={headingRecipe({ level: 'h3' })}>Nasıl Çalışır</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StepCard
            icon={Search}
            tone="cyan"
            step="01"
            title="Ara"
            body="Doğal dilde anlat — AI parametreleri çıkartır, sonuçları daraltır."
          />
          <StepCard
            icon={Sparkles}
            tone="violet"
            step="02"
            title="AI Değerle"
            body="Karşılaştırılabilir parsellerden bağımsız tahmin + güven aralığı."
          />
          <StepCard
            icon={Shield}
            tone="lime"
            step="03"
            title="Güvenle Konuş"
            body="Tapu hash doğrulaması ve KVKK uyumlu iletişim akışı."
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <Card glow="violet">
          <CardBody className="flex flex-col items-center gap-4 py-12 text-center md:py-16">
            <Icon icon={TrendingUp} size={32} tone="violet" />
            <h2 className={headingRecipe({ level: 'h2' })}>Yatırım Trend</h2>
            <p className="max-w-2xl text-[var(--text-secondary)]">
              Bölgesel fiyat değişimi, parsel yoğunluğu ve AI talep skoru — tek bir cmd-K
              mesafesinde.
            </p>
            <div className="grid w-full max-w-2xl grid-cols-3 gap-2">
              <KpiTile label="Marmara" value="+8.4%" tone="lime" />
              <KpiTile label="Ege" value="+12.1%" tone="cyan" />
              <KpiTile label="Akdeniz" value="+6.7%" tone="amber" />
            </div>
            <Button
              tone="agent"
              leftIcon={<Icon icon={Sparkles} size={16} />}
              onClick={() => navigate(searchHref)}
            >
              Tüm trendleri keşfet
            </Button>
          </CardBody>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <Card tone="strong" glow="cyan">
          <CardBody className="flex flex-col items-center gap-3 py-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className={headingRecipe({ level: 'h4' })}>İlanını sen de yayınla</h3>
              <p className="text-[var(--text-secondary)]">
                AI rehberli 6-adımlı sihirbaz — OCR, AI değerleme, AI açıklama dahil.
              </p>
            </div>
            <Button
              size="lg"
              leftIcon={<Icon icon={MapPin} size={18} />}
              onClick={() => navigate('/post-listing')}
            >
              İlan Ver
            </Button>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <Card tone="solid">
      <CardBody className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
          {label}
        </span>
        {loading ? (
          <Skeleton variant="text" lines={1} />
        ) : (
          <span className="text-2xl font-semibold text-[var(--text-primary)] tabular-nums">
            {formatNumber(value)}
          </span>
        )}
      </CardBody>
    </Card>
  );
}

function StepCard({
  icon,
  tone,
  step,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Icon>['icon'];
  tone: 'cyan' | 'violet' | 'lime';
  step: string;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Icon icon={icon} size={24} tone={tone} />
          <span className="font-mono text-xs text-[var(--text-tertiary)]">{step}</span>
        </div>
        <h3 className="text-lg font-medium text-[var(--text-primary)]">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{body}</p>
      </CardBody>
    </Card>
  );
}

function KpiTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'lime' | 'cyan' | 'amber';
}) {
  const colorVar = `var(--accent-${tone})`;
  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--stroke-default)] bg-[var(--surface-slate)] px-3 py-2 text-left"
      style={{ borderColor: colorVar }}
    >
      <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</div>
      <div className="font-semibold tabular-nums" style={{ color: colorVar }}>
        {value}
      </div>
    </div>
  );
}
