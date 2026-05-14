import { Badge, Button, Icon } from '@/components/ui';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useFeaturedListings } from '@/lib/api/listings';
import type { Listing } from '@/types/listing';
import { Layers, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function CompareBar() {
  const favorites = useFavorites();
  const featured = useFeaturedListings();
  const navigate = useNavigate();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  const candidates: ReadonlyArray<Listing> = useMemo(() => {
    const all = featured.data?.items ?? [];
    return all.filter((l) => favorites.ids.has(l.id)).slice(0, 4);
  }, [featured.data, favorites.ids]);

  // Hide if: dismissed, on /compare route, or fewer than 2 favorites.
  if (dismissed) return null;
  if (location.pathname.startsWith('/compare')) return null;
  if (candidates.length < 2) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[55] flex justify-center px-4 pb-3 md:pb-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--stroke-default)] bg-[var(--surface-elevated)] px-3 py-2 shadow-[var(--glow-soft)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Icon icon={Layers} tone="cyan" size={16} />
          <span className="text-sm font-medium">Kıyasla</span>
          <Badge tone="info" size="sm">
            {candidates.length} ilan
          </Badge>
        </div>
        <div className="hidden flex-1 items-center gap-1.5 overflow-x-auto sm:flex">
          {candidates.map((l) => (
            <span
              key={l.id}
              className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--stroke-subtle)] bg-[var(--surface-base)] px-2 py-0.5 text-xs"
              title={l.title}
            >
              <span className="font-mono">{l.region.district}</span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="tabular-nums">{Math.round(l.areaSqm / 100) / 10}K m²</span>
            </span>
          ))}
        </div>
        <Button
          size="sm"
          tone="primary"
          onClick={() => navigate('/compare')}
          leftIcon={<Icon icon={Layers} size={14} />}
        >
          Karşılaştır
        </Button>
        <button
          type="button"
          aria-label="Kıyas çubuğunu kapat"
          onClick={() => setDismissed(true)}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <Icon icon={X} size={14} />
        </button>
      </div>
    </div>
  );
}
