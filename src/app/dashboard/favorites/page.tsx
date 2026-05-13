import { ListingCard } from '@/components/listings/ListingCard';
import { Button, Card, CardBody, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFavorites } from '@/features/favorites/useFavorites';
import { useFeaturedListings } from '@/lib/api/listings';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { data } = useFeaturedListings();
  const favorites = useFavorites();
  const filtered = (data?.items ?? []).filter((l) => favorites.has(l.id));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Favorilerim</h1>
        <Button tone="ghost" onClick={() => toast.success('Karşılaştırma sayfasına yönlendir')}>
          Karşılaştır
        </Button>
      </header>

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
            <Icon icon={Heart} size={32} tone="tertiary" />
            <p className="text-[var(--text-secondary)]">
              Henüz favori eklemedin. Arama sayfasından kalp ikonuna tıklayarak ekleyebilirsin.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} compact />
          ))}
        </div>
      )}
    </main>
  );
}
