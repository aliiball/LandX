import { ListingCard } from '@/components/listings/ListingCard';
import { MapView } from '@/components/map/MapView';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Modal,
  Skeleton,
  ThinkingDot,
  TokenStream,
  Tooltip,
  toast,
  tokenize,
} from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useListing, useSimilarListings } from '@/lib/api/listings';
import { formatNumber, formatSqm, formatTL } from '@/lib/format';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: listing, isLoading } = useListing(id);
  const similar = useSimilarListings(id);
  const { has, toggle } = useFavorites();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [askOpen, setAskOpen] = useState(false);
  const [valuationStreamKey, setValuationStreamKey] = useState(0);
  const searchHref = useRouteHref('search');

  useEffect(() => {
    setGalleryIdx(0);
    setValuationStreamKey((k) => k + 1);
  }, [id]);

  const valuationSummary = useMemo(() => {
    if (!listing) return '';
    const mid = Math.round((listing.valuation.estimateMin + listing.valuation.estimateMax) / 2);
    return `AI değerleme tamamlandı. Tahmini ${formatTL(mid)} (${formatTL(listing.valuation.estimateMin)} – ${formatTL(listing.valuation.estimateMax)}). Güven %${listing.valuation.confidence}. ${listing.valuation.comparableCount} karşılaştırılabilir parsel incelendi.`;
  }, [listing]);

  if (isLoading || !listing) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
        <Skeleton variant="rect" height={420} />
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Skeleton variant="text" lines={6} />
          <Skeleton variant="rect" height={280} />
        </div>
      </main>
    );
  }

  const isFav = has(listing.id);
  const media = listing.media;
  const heroMedia = media[galleryIdx];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <nav className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
        <button
          type="button"
          onClick={() => navigate(searchHref)}
          className="hover:text-[var(--text-primary)]"
        >
          {listing.region.city}
        </button>
        <span aria-hidden>·</span>
        <span>{listing.region.district}</span>
      </nav>

      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--stroke-default)]">
        {heroMedia && (
          <img
            src={heroMedia.url}
            alt={heroMedia.alt}
            className="aspect-[16/9] w-full object-cover"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.hasDrone && <Badge tone="agent">Drone</Badge>}
          {listing.hasPanorama && <Badge tone="agent">360°</Badge>}
          {listing.verifiedDeed && (
            <Badge tone="success" dot>
              Tapu Doğrulandı
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge tone="neutral" size="md">
            {galleryIdx + 1} / {media.length}
          </Badge>
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              tone="neutral"
              aria-label="Önceki fotoğraf"
              onClick={() => setGalleryIdx((i) => Math.max(0, i - 1))}
            >
              <Icon icon={ChevronLeft} size={20} />
            </Button>
            <Button
              type="button"
              size="icon"
              tone="neutral"
              aria-label="Sonraki fotoğraf"
              onClick={() => setGalleryIdx((i) => Math.min(media.length - 1, i + 1))}
            >
              <Icon icon={ChevronRight} size={20} />
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className={headingRecipe({ level: 'h3' })}>{listing.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
                  <Icon icon={MapPin} size={12} tone="tertiary" />
                  {listing.region.city} · {listing.region.district}
                </p>
              </div>
              <div className="flex gap-2">
                <Tooltip content="Paylaş">
                  <Button
                    type="button"
                    tone="ghost"
                    size="icon"
                    aria-label="Paylaş"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        void navigator.clipboard.writeText(window.location.href);
                      }
                      toast.success('Bağlantı kopyalandı');
                    }}
                  >
                    <Icon icon={Share2} size={16} />
                  </Button>
                </Tooltip>
                <Button
                  type="button"
                  tone={isFav ? 'agent' : 'ghost'}
                  size="icon"
                  aria-label="Favoriye ekle"
                  onClick={() => {
                    toggle(listing.id);
                    toast.show(isFav ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
                  }}
                >
                  <Icon icon={Heart} size={16} />
                </Button>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold tabular-nums text-[var(--text-primary)]">
                {formatTL(listing.price)}
              </span>
              <span className="text-sm text-[var(--text-tertiary)] tabular-nums">
                {formatSqm(listing.areaSqm)} · {formatNumber(listing.pricePerSqm)} ₺/m²
              </span>
            </div>
          </header>

          <Card glow="violet">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={Sparkles} tone="violet" />
                <span className="font-medium">AI Değerleme</span>
              </div>
              <Button size="sm" tone="ghost" onClick={() => setValuationStreamKey((k) => k + 1)}>
                Yeniden oynat
              </Button>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <ValuationStat label="Min" value={formatTL(listing.valuation.estimateMin, true)} />
                <ValuationStat
                  label="Tahmini"
                  value={formatTL(
                    Math.round((listing.valuation.estimateMin + listing.valuation.estimateMax) / 2),
                    true,
                  )}
                  highlight
                />
                <ValuationStat label="Max" value={formatTL(listing.valuation.estimateMax, true)} />
              </div>
              <TokenStream
                key={valuationStreamKey}
                tokens={tokenize(valuationSummary)}
                intervalMs={22}
              />
              <details className="rounded-[var(--radius-sm)] bg-[var(--surface-slate)]/40 p-3">
                <summary className="cursor-pointer text-sm text-[var(--text-secondary)]">
                  Neden bu fiyat?
                </summary>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                  {listing.valuation.factors.map((f) => (
                    <li key={f.label} className="flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">{f.label}</span>
                      <span
                        className={`tabular-nums font-mono ${
                          f.direction === 'positive'
                            ? 'text-[var(--success)]'
                            : f.direction === 'negative'
                              ? 'text-[var(--danger)]'
                              : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        {f.impact > 0 ? '+' : ''}
                        {f.impact}%
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            </CardBody>
            <CardFooter>
              <Button
                tone="ghost"
                size="sm"
                leftIcon={<Icon icon={FileText} size={14} />}
                onClick={() => toast.success('Değerleme raporu PDF hazırlanıyor')}
              >
                PDF rapor indir
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <span className="font-medium">Özellikler</span>
            </CardHeader>
            <CardBody>
              <dl className="grid gap-3 sm:grid-cols-2">
                <Stat label="Alan" value={formatSqm(listing.areaSqm)} />
                <Stat label="İmar" value={listing.zoning} />
                <Stat label="Tapu" value={listing.titleDeed} />
                <Stat label="Cephe" value={listing.roadFrontage} />
                <Stat label="Eğim" value={`%${listing.slopePercent}`} />
                <Stat label="Ada/Parsel" value={`${listing.ada} / ${listing.parsel}`} />
              </dl>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {listing.features.map((f) => (
                  <Badge key={f} tone="neutral" size="sm">
                    {f}
                  </Badge>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <span className="font-medium">Konum</span>
            </CardHeader>
            <CardBody>
              <div className="h-72 overflow-hidden rounded-[var(--radius-md)]">
                <MapView
                  markers={[
                    {
                      id: listing.id,
                      coord: listing.coord,
                      color: 'oklch(0.82 0.16 195)',
                      label: listing.title,
                    },
                  ]}
                  center={[listing.coord.lng, listing.coord.lat]}
                  zoom={12}
                  className="size-full"
                />
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {listing.region.city} · {listing.region.district}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <span className="font-medium">Açıklama</span>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                {listing.description}
              </p>
            </CardBody>
          </Card>

          {similar.data?.items.length ? (
            <section className="flex flex-col gap-3">
              <h2 className={headingRecipe({ level: 'h5' })}>Benzer İlanlar</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {similar.data.items.slice(0, 3).map((l) => (
                  <ListingCard key={l.id} listing={l} compact />
                ))}
              </div>
            </section>
          ) : null}
        </section>

        <aside className="flex flex-col gap-4 md:sticky md:top-20 md:self-start">
          <Card tone="strong">
            <CardHeader>
              <span className="font-medium">Sahip</span>
              <Badge tone="success" size="sm" dot>
                Doğrulandı
              </Badge>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <p className="text-sm text-[var(--text-secondary)]">
                Anonim sahip ID: <span className="font-mono">{listing.sellerId.slice(0, 12)}…</span>
              </p>
              <Button
                block
                onClick={() => toast.success('Mesaj gönderildi — sahip 24 saat içinde dönecek')}
              >
                Mesaj gönder
              </Button>
              <Button
                tone="agent"
                block
                leftIcon={<Icon icon={Sparkles} size={16} />}
                onClick={() => setAskOpen(true)}
              >
                AI'a Sor
              </Button>
            </CardBody>
            <CardFooter>
              <span className="flex items-center gap-1 text-xs text-[var(--success)]">
                <Icon icon={CheckCircle2} size={12} tone="lime" />
                KVKK uyumlu iletişim
              </span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <span className="font-medium">Bölge</span>
            </CardHeader>
            <CardBody className="flex flex-col gap-2 text-sm">
              <KeyVal label="Deprem Riski" value="Düşük" />
              <KeyVal label="İmar Planı" value="Onaylı" />
              <KeyVal label="Ulaşım Skoru" value="78/100" />
              <KeyVal label="Yatırım Skoru" value="84/100" />
            </CardBody>
          </Card>
        </aside>
      </div>

      <Modal
        open={askOpen}
        onOpenChange={setAskOpen}
        title="AI'a Sor"
        description="Sahip-onaylı AI ön cevap. Hassas sorular sahibine iletilir."
      >
        <AiAskBody listing={listing} onClose={() => setAskOpen(false)} />
      </Modal>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--stroke-subtle)] py-2 last:border-b-0">
      <dt className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</dt>
      <dd className="font-medium tabular-nums text-[var(--text-primary)] capitalize">{value}</dd>
    </div>
  );
}

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="font-mono tabular-nums text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function ValuationStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-[var(--radius-md)] border px-3 py-2 ${
        highlight
          ? 'border-[var(--accent-violet)] bg-[oklch(0.70_0.22_290_/_0.10)]'
          : 'border-[var(--stroke-default)]'
      }`}
    >
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span
        className={`text-lg font-semibold tabular-nums ${
          highlight ? 'text-[var(--accent-violet)]' : 'text-[var(--text-primary)]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function AiAskBody({
  listing,
  onClose,
}: {
  listing: { region: { city: string; district: string }; imarli: boolean };
  onClose: () => void;
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = () => {
    setLoading(true);
    setAnswer(null);
    window.setTimeout(() => {
      setAnswer(
        `Bu arsa ${listing.region.city} ${listing.region.district} bölgesinde${
          listing.imarli ? ' imar onaylı' : ' imar onayı bekleyen'
        }. Sorduğunuz "${question}" konusu sahip moderasyonuna iletildi. AI ön cevap: bölgede son 6 ayda benzer parsel satışları stabil seyrediyor.`,
      );
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        placeholder="Bu arsa hakkında ne öğrenmek istersiniz?"
        className="rounded-[var(--radius-md)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-3 py-2 focus:outline-none focus:shadow-[var(--glow-cyan)]"
      />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <ThinkingDot tone="violet" />
          <span>AI yanıtlıyor…</span>
        </div>
      ) : answer ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)]/50 p-3 text-sm">
          {answer}
        </div>
      ) : null}
      <div className="flex justify-end gap-2">
        <Button tone="ghost" onClick={onClose}>
          Kapat
        </Button>
        <Button onClick={ask} disabled={!question.trim() || loading} tone="agent">
          Sor
        </Button>
      </div>
    </div>
  );
}
