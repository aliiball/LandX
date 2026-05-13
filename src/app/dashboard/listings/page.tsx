import { ListingCard } from '@/components/listings/ListingCard';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import { useFeaturedListings } from '@/lib/api/listings';
import { Pencil, Sparkles, Trash2 } from 'lucide-react';

export default function MyListings() {
  const { data } = useFeaturedListings();
  const items = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>İlanlarım</h1>
        <Button onClick={() => toast.success("Yeni ilan wizard'a yönlendiriliyor")}>
          + Yeni ilan
        </Button>
      </header>

      <Card>
        <CardHeader>
          <span className="font-medium">Aktif</span>
          <Badge tone="success" size="sm">
            {items.length}
          </Badge>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-[var(--text-tertiary)]">
              <tr className="border-b border-[var(--stroke-subtle)]">
                <th className="py-2 pr-3">İlan</th>
                <th className="py-2 pr-3">Durum</th>
                <th className="py-2 pr-3">Görüntülenme</th>
                <th className="py-2 pr-3">Mesaj</th>
                <th className="py-2 pr-3 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 6).map((l) => (
                <tr key={l.id} className="border-b border-[var(--stroke-subtle)]/40">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{l.title}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {l.region.city} · {l.region.district}
                    </div>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge tone={l.status === 'active' ? 'success' : 'warning'} size="sm">
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{l.viewCount}</td>
                  <td className="py-2 pr-3 tabular-nums">{l.inquiryCount}</td>
                  <td className="py-2 pr-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="AI öner"
                        onClick={() => toast.agent('AI içerik önerisi hazırlandı')}
                      >
                        <Icon icon={Sparkles} size={14} />
                      </Button>
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="Düzenle"
                        onClick={() => toast.show('Düzenleme paneli')}
                      >
                        <Icon icon={Pencil} size={14} />
                      </Button>
                      <Button
                        tone="ghost"
                        size="icon"
                        aria-label="Sil"
                        onClick={() => toast.error('Silme onayı bekleniyor')}
                      >
                        <Icon icon={Trash2} size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((l) => (
          <ListingCard key={l.id} listing={l} compact />
        ))}
      </section>
    </main>
  );
}
