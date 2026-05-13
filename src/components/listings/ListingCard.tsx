import { Badge, Button, Card, CardBody, Icon, Link as UiLink, toast } from '@/components/ui';
import { cn } from '@/design/recipes';
import { useFavorites } from '@/features/favorites/useFavorites';
import { formatSqm, formatTL } from '@/lib/format';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import type { Listing } from '@/types/listing';
import { Heart, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ListingCardProps = {
  listing: Listing;
  compact?: boolean;
};

export function ListingCard({ listing, compact }: ListingCardProps) {
  const { t } = useTranslation();
  const { has, toggle } = useFavorites();
  const isFav = has(listing.id);
  const href = useRouteHref('listingDetail', { id: listing.id });
  const hero = listing.media[0];

  return (
    <Card tone="default" className={cn('overflow-hidden', compact && 'h-full')}>
      <div className="relative">
        {hero && (
          <UiLink to={href} aria-label={listing.title}>
            <img
              src={hero.url}
              alt={hero.alt}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-[var(--duration-medium)] ease-[var(--ease-out-expo)] hover:scale-105"
            />
          </UiLink>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {listing.verifiedDeed && (
            <Badge tone="success" size="sm" dot>
              Tapu Doğrulandı
            </Badge>
          )}
          {listing.imarli && (
            <Badge tone="info" size="sm">
              İmar
            </Badge>
          )}
          {listing.hasDrone && (
            <Badge tone="agent" size="sm">
              Drone
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            toggle(listing.id);
            toast.show(isFav ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
          }}
          aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          className={cn(
            'absolute right-3 top-3 grid size-9 place-items-center rounded-full border backdrop-blur-md',
            'border-[var(--stroke-default)] bg-[var(--surface-elevated)]/80',
            'transition-colors focus-visible:shadow-[var(--glow-cyan)] focus-visible:outline-none',
            isFav
              ? 'text-[var(--accent-magenta)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          )}
        >
          <Heart className="size-4" fill={isFav ? 'currentColor' : 'none'} aria-hidden />
        </button>
      </div>
      <CardBody className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
          <Icon icon={MapPin} size={12} tone="tertiary" />
          <span>
            {listing.region.city} · {listing.region.district}
          </span>
        </div>
        <UiLink
          to={href}
          className="line-clamp-2 text-[var(--text-body)] font-medium text-[var(--text-primary)] hover:text-[var(--accent-cyan)]"
        >
          {listing.title}
        </UiLink>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[var(--text-lead)] font-semibold text-[var(--text-primary)] tabular-nums">
            {formatTL(listing.price, true)}
          </span>
          <span className="text-xs text-[var(--text-tertiary)] tabular-nums">
            {formatSqm(listing.areaSqm)} · {listing.pricePerSqm.toLocaleString('tr-TR')} ₺/m²
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <Icon icon={Sparkles} size={12} tone="violet" />
            AI{' '}
            {Math.round(
              (listing.valuation.estimateMin + listing.valuation.estimateMax) / 2 / 1000,
            ).toLocaleString('tr-TR')}
            K ±{listing.valuation.confidence}%
          </span>
          {listing.verifiedDeed && (
            <span className="flex items-center gap-1 text-xs text-[var(--success)]">
              <Icon icon={ShieldCheck} size={12} tone="lime" />
              {t('listings.deedVerifiedShort', { defaultValue: 'Tapu OK' })}
            </span>
          )}
        </div>
        {!compact && (
          <Button
            type="button"
            tone="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              window.location.assign(href);
            }}
            className="mt-2"
          >
            Detaya git
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
