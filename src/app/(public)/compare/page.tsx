import { Badge, Button, Card, CardBody, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useFeaturedListings } from '@/lib/api/listings';
import { formatNumber, formatSqm, formatTL } from '@/lib/format';
import type { Listing } from '@/types/listing';
import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

function AiCompareSummary({ listings }: { listings: ReadonlyArray<Listing> }) {
  if (listings.length < 2) return null;
  let bestIdx = 0;
  let worstIdx = 0;
  let bestScore = Number.NEGATIVE_INFINITY;
  let worstScore = Number.POSITIVE_INFINITY;
  for (let i = 0; i < listings.length; i += 1) {
    const l = listings[i];
    if (!l) continue;
    const score = (l.verifiedDeed ? 20 : 0) + l.valuation.confidence - l.pricePerSqm / 1000;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
    if (score < worstScore) {
      worstScore = score;
      worstIdx = i;
    }
  }
  const best = listings[bestIdx];
  const worst = listings[worstIdx];
  if (!best || !worst || best === worst) return null;
  return (
    <Card tone="solid">
      <CardBody className="flex flex-wrap items-start gap-3">
        <Badge tone="agent" size="sm" dot>
          AI özet
        </Badge>
        <p className="flex-1 text-sm">
          <span className="font-medium">{best.region.district}</span> en düşük risk profili (tapu{' '}
          {best.verifiedDeed ? 'doğrulanmış' : 'beklemede'}, %{best.valuation.confidence} güven,
          ₺/m² {formatNumber(best.pricePerSqm)}). En yüksek risk{' '}
          <span className="font-medium">{worst.region.district}</span> — değerleme aralığı geniş.
          Yatırım için <span className="text-[var(--accent-cyan)]">{best.region.district}</span>{' '}
          önerilir.
        </p>
      </CardBody>
    </Card>
  );
}

export default function ComparePage() {
  const featured = useFeaturedListings();
  const favorites = useFavorites();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [...favorites.ids].slice(0, 2));

  const candidates = featured.data?.items ?? [];
  const selectedListings = useMemo(
    () =>
      selectedIds
        .map((id) => candidates.find((l) => l.id === id))
        .filter((l): l is Listing => Boolean(l)),
    [selectedIds, candidates],
  );

  const rows: Array<{ label: string; getValue: (l: Listing) => string }> = [
    { label: 'Fiyat', getValue: (l) => formatTL(l.price) },
    { label: 'Alan', getValue: (l) => formatSqm(l.areaSqm) },
    { label: '₺/m²', getValue: (l) => formatNumber(l.pricePerSqm) },
    { label: 'İmar', getValue: (l) => l.zoning },
    { label: 'Tapu', getValue: (l) => (l.verifiedDeed ? 'Doğrulandı' : 'Bekliyor') },
    { label: 'Cephe', getValue: (l) => l.roadFrontage },
    {
      label: 'AI Tahmini',
      getValue: (l) =>
        formatTL(Math.round((l.valuation.estimateMin + l.valuation.estimateMax) / 2), true),
    },
    { label: 'Güven', getValue: (l) => `%${l.valuation.confidence}` },
    { label: 'Görüntülenme', getValue: (l) => formatNumber(l.viewCount) },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h2' })}>Arsa Karşılaştır</h1>
        <p className="text-[var(--text-secondary)]">2-4 ilan yan yana — AI farkları yorumlar.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        {selectedListings.map((l) => (
          <Card key={l.id} tone="solid">
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 font-medium">{l.title}</p>
                <button
                  type="button"
                  aria-label="Kaldır"
                  onClick={() => setSelectedIds((ids) => ids.filter((i) => i !== l.id))}
                  className="text-[var(--text-tertiary)] hover:text-[var(--danger)]"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <Badge tone="info" size="sm">
                {l.region.city}
              </Badge>
              <span className="text-lg font-semibold tabular-nums">{formatTL(l.price)}</span>
            </CardBody>
          </Card>
        ))}
        {selectedListings.length < 4 && (
          <Card tone="default">
            <CardBody className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Icon icon={Plus} tone="tertiary" />
              <p className="text-sm text-[var(--text-secondary)]">İlan ekle</p>
              <select
                value=""
                onChange={(e) => {
                  if (e.currentTarget.value)
                    setSelectedIds((ids) => [...ids, e.currentTarget.value]);
                }}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-2 py-1 text-sm"
                aria-label="İlan seç"
              >
                <option value="">Seç…</option>
                {candidates
                  .filter((l) => !selectedIds.includes(l.id))
                  .slice(0, 12)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title.slice(0, 50)}
                    </option>
                  ))}
              </select>
            </CardBody>
          </Card>
        )}
      </div>

      <AiCompareSummary listings={selectedListings} />

      {selectedListings.length >= 2 ? (
        <Card>
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--stroke-subtle)] text-left">
                  <th className="py-2 pr-3 font-mono uppercase text-xs text-[var(--text-tertiary)]">
                    Özellik
                  </th>
                  {selectedListings.map((l) => (
                    <th key={l.id} className="py-2 pr-3 font-medium">
                      {l.region.district}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const values = selectedListings.map((l) => row.getValue(l));
                  const allEqual = values.every((v) => v === values[0]);
                  return (
                    <tr key={row.label} className="border-b border-[var(--stroke-subtle)]/50">
                      <td className="py-2 pr-3 text-[var(--text-tertiary)]">{row.label}</td>
                      {selectedListings.map((l) => (
                        <td
                          key={l.id}
                          className={`py-2 pr-3 ${
                            allEqual ? '' : 'text-[var(--accent-cyan)]'
                          } tabular-nums`}
                        >
                          {row.getValue(l)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-[var(--text-secondary)]">Karşılaştırma için en az 2 ilan seç.</p>
            <Button onClick={() => toast.show('Öne çıkanlardan otomatik seç')} tone="ghost">
              İlk 2 öne çıkanı al
            </Button>
          </CardBody>
        </Card>
      )}
    </main>
  );
}
