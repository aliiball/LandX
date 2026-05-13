import { Badge, Card, CardBody, CardHeader, Icon } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useListings } from '@/lib/api/listings';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { CITIES, REGIONS } from '@/mocks/seed/regions';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function RegionsPage() {
  const { data } = useListings({});
  const navigate = useNavigate();
  const searchHref = useRouteHref('search');

  const cityCounts = new Map<string, number>();
  for (const l of data?.items ?? []) {
    cityCounts.set(l.region.city, (cityCounts.get(l.region.city) ?? 0) + 1);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
      <header>
        <h1 className={headingRecipe({ level: 'h2' })}>Bölge Rehberi</h1>
        <p className="text-[var(--text-secondary)]">
          Türkiye'nin 81 ili için AI özetli arsa istatistikleri. Tıkla, ilanları gör.
        </p>
      </header>

      {REGIONS.map((region) => {
        const citiesInRegion = CITIES.filter((c) => c.region === region);
        if (citiesInRegion.length === 0) return null;
        return (
          <section key={region} className="flex flex-col gap-3">
            <h2 className={headingRecipe({ level: 'h4' })}>{region}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {citiesInRegion.map((c) => {
                const count = cityCounts.get(c.name) ?? 0;
                return (
                  <Card
                    key={c.name}
                    tone="solid"
                    className="cursor-pointer transition-colors hover:border-[var(--accent-cyan)]"
                    onClick={() => navigate(`${searchHref}?city=${encodeURIComponent(c.name)}`)}
                  >
                    <CardHeader>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">
                          {c.districts.length} ilçe
                        </div>
                      </div>
                      <Badge tone="info" size="sm">
                        {count} ilan
                      </Badge>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-2 text-sm">
                      <p className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Icon icon={Sparkles} size={12} tone="violet" />
                        AI: {c.name} bölgesinde yatırım talep skoru orta-yüksek seviyede.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.districts.slice(0, 4).map((d) => (
                          <Badge key={d} tone="neutral" size="sm">
                            {d}
                          </Badge>
                        ))}
                        {c.districts.length > 4 && (
                          <Badge tone="neutral" size="sm">
                            +{c.districts.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
