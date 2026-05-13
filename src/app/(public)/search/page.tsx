import { ListingCard } from '@/components/listings/ListingCard';
import { MapView } from '@/components/map/MapView';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Icon,
  Input,
  Select,
  Sheet,
  Skeleton,
  toast,
} from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useSearchFilters } from '@/features/search/useSearchFilters';
import { useListings } from '@/lib/api/listings';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { CITIES } from '@/mocks/seed/regions';
import type { ZoningType } from '@/types/listing';
import { Filter, List, Map as MapIcon, Search, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

const ZONING_OPTIONS: ReadonlyArray<{ value: ZoningType; label: string }> = [
  { value: 'konut', label: 'Konut' },
  { value: 'ticari', label: 'Ticari' },
  { value: 'tarla', label: 'Tarla' },
  { value: 'sanayi', label: 'Sanayi' },
  { value: 'turizm', label: 'Turizm' },
  { value: 'karma', label: 'Karma' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'En yeni' },
  { value: 'priceAsc', label: 'Fiyat ↑' },
  { value: 'priceDesc', label: 'Fiyat ↓' },
  { value: 'areaAsc', label: 'Alan ↑' },
  { value: 'areaDesc', label: 'Alan ↓' },
  { value: 'valuation', label: 'AI Güven' },
];

export default function SearchPage() {
  const { filters, update, reset } = useSearchFilters();
  const { data, isLoading } = useListings(filters);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const navigate = useNavigate();
  const detailHref = useRouteHref('listingDetail', { id: ':id' });

  const markers =
    data?.items.map((l) => ({
      id: l.id,
      coord: l.coord,
      label: l.title,
      color: l.zoning === 'tarla' ? 'oklch(0.88 0.20 135)' : 'oklch(0.82 0.16 195)',
      onClick: () => navigate(detailHref.replace(':id', l.id)),
    })) ?? [];

  const activeChips = [
    filters.q && { key: 'q', label: `"${filters.q}"` },
    filters.city && { key: 'city', label: filters.city },
    filters.zoning && { key: 'zoning', label: filters.zoning },
    filters.imarli && { key: 'imarli', label: 'İmarlı' },
    filters.priceMin && {
      key: 'priceMin',
      label: `≥ ${filters.priceMin.toLocaleString('tr-TR')}₺`,
    },
    filters.priceMax && {
      key: 'priceMax',
      label: `≤ ${filters.priceMax.toLocaleString('tr-TR')}₺`,
    },
  ].filter((c): c is { key: keyof typeof filters; label: string } => Boolean(c));

  return (
    <main className="flex flex-1 flex-col">
      <div className="border-b border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/80 px-4 py-3 backdrop-blur-xl md:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Input
              size="sm"
              placeholder="Arama (örn: Çeşme imarlı)"
              defaultValue={filters.q}
              leftSlot={<Icon icon={Search} size={14} />}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.currentTarget as HTMLInputElement).value;
                  update({ q: v });
                }
              }}
              className="w-full max-w-md"
            />
            <Button
              type="button"
              tone="ghost"
              size="sm"
              leftIcon={<Icon icon={Filter} size={14} />}
              onClick={() => setFilterOpen(true)}
            >
              Filtre
            </Button>
            <Button
              type="button"
              tone="agent"
              size="sm"
              leftIcon={<Icon icon={Sparkles} size={14} />}
              onClick={() => setAiOpen(true)}
            >
              AI ile Daralt
            </Button>
            <div className="ml-auto hidden items-center gap-2 md:flex">
              <Select
                size="sm"
                options={SORT_OPTIONS}
                value={filters.sort ?? 'newest'}
                onChange={(e) => update({ sort: e.currentTarget.value as typeof filters.sort })}
              />
            </div>
          </div>
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeChips.map((chip) => (
                <Badge
                  key={chip.key}
                  tone="info"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => update({ [chip.key]: undefined })}
                >
                  {chip.label} <X className="size-3" aria-hidden />
                </Badge>
              ))}
              <Button type="button" tone="ghost" size="sm" onClick={reset}>
                Temizle
              </Button>
            </div>
          )}
          {data?.aiSummary && (
            <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)]/60 px-3 py-2 text-sm text-[var(--text-secondary)]">
              <Icon icon={Sparkles} size={14} tone="violet" />
              <span>{data.aiSummary}</span>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center justify-center border-b border-[var(--stroke-subtle)] py-2">
        <div className="inline-flex overflow-hidden rounded-[var(--radius-pill)] border border-[var(--stroke-default)]">
          <Button
            size="sm"
            tone={mobileView === 'list' ? 'primary' : 'ghost'}
            onClick={() => setMobileView('list')}
            leftIcon={<Icon icon={List} size={14} />}
          >
            Liste
          </Button>
          <Button
            size="sm"
            tone={mobileView === 'map' ? 'primary' : 'ghost'}
            onClick={() => setMobileView('map')}
            leftIcon={<Icon icon={MapIcon} size={14} />}
          >
            Harita
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-6 md:flex-row md:px-6">
        <section
          className={`flex-1 ${mobileView === 'list' ? 'block' : 'hidden'} md:block`}
          aria-label="Sonuç listesi"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className={headingRecipe({ level: 'h6' })}>
              {isLoading ? '…' : `${data?.total ?? 0} sonuç`}
            </h2>
            <Button
              type="button"
              size="sm"
              tone="ghost"
              onClick={() => toast.success('Arama kaydedildi')}
            >
              Aramayı kaydet
            </Button>
          </div>
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  variant="rect"
                  height={280}
                />
              ))}
            </div>
          ) : data?.items.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.items.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
                <Icon icon={Search} size={32} tone="tertiary" />
                <p className="text-[var(--text-secondary)]">
                  Filtrelerinize uyan ilan bulunamadı. Kriterleri biraz gevşetmeyi deneyin.
                </p>
                <Button type="button" tone="neutral" onClick={reset}>
                  Filtreleri temizle
                </Button>
              </CardBody>
            </Card>
          )}
        </section>
        <aside
          className={`${mobileView === 'map' ? 'block' : 'hidden'} md:block md:w-2/5 md:sticky md:top-20 md:self-start h-[60vh] md:h-[calc(100dvh-9rem)]`}
          aria-label="Harita"
        >
          <MapView markers={markers} className="size-full" />
        </aside>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen} side="right" title="Filtreler">
        <div className="flex flex-col gap-4">
          <Select
            label="Şehir"
            placeholder="Tüm şehirler"
            options={CITIES.map((c) => ({ value: c.name, label: c.name }))}
            value={filters.city ?? ''}
            onChange={(e) => update({ city: e.currentTarget.value || undefined })}
          />
          <Select
            label="İmar Türü"
            placeholder="Tümü"
            options={ZONING_OPTIONS}
            value={filters.zoning ?? ''}
            onChange={(e) =>
              update({ zoning: (e.currentTarget.value || undefined) as ZoningType | undefined })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Fiyat (₺)"
              type="number"
              defaultValue={filters.priceMin}
              onBlur={(e) => update({ priceMin: Number(e.currentTarget.value) || undefined })}
            />
            <Input
              label="Max Fiyat (₺)"
              type="number"
              defaultValue={filters.priceMax}
              onBlur={(e) => update({ priceMax: Number(e.currentTarget.value) || undefined })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min m²"
              type="number"
              defaultValue={filters.areaMin}
              onBlur={(e) => update({ areaMin: Number(e.currentTarget.value) || undefined })}
            />
            <Input
              label="Max m²"
              type="number"
              defaultValue={filters.areaMax}
              onBlur={(e) => update({ areaMax: Number(e.currentTarget.value) || undefined })}
            />
          </div>
          <Button onClick={() => setFilterOpen(false)} block>
            Uygula
          </Button>
        </div>
      </Sheet>

      <Sheet open={aiOpen} onOpenChange={setAiOpen} side="right" title="AI ile Daralt">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Türkçe yaz, AI filter chip'lerine dökecek. Örnek: "Bursa İznik tarafında imarlı tarla, 5
            milyon altı."
          </p>
          <Input
            placeholder="Nasıl bir arsa arıyorsun?"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <Button
            block
            tone="agent"
            leftIcon={<Icon icon={Sparkles} size={16} />}
            onClick={async () => {
              const { parseNlQuery } = await import('@/features/search/parseNlQuery');
              const parsed = parseNlQuery(aiQuery);
              update(parsed.filters);
              setAiOpen(false);
              setAiQuery('');
              toast.agent({
                title: 'AI filtre uyguladı',
                description: `${parsed.chips.length} kriter çıkardı, güven %${Math.round(parsed.confidence * 100)}`,
              });
            }}
          >
            AI ile filtrele
          </Button>
        </div>
      </Sheet>
    </main>
  );
}
