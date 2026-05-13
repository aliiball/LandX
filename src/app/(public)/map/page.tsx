import { MapView } from '@/components/map/MapView';
import { Badge, Button, Card, CardBody, Icon, Sheet, toast } from '@/components/ui';
import { useListings } from '@/lib/api/listings';
import { useRouteHref } from '@/lib/routing/useRouteHref';
import { Layers, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function MapPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { data, isLoading } = useListings({});
  const navigate = useNavigate();
  const detailHref = useRouteHref('listingDetail', { id: ':id' });

  const markers =
    data?.items.map((l) => ({
      id: l.id,
      coord: l.coord,
      label: l.title,
      color:
        l.zoning === 'tarla'
          ? 'oklch(0.88 0.20 135)'
          : l.zoning === 'turizm'
            ? 'oklch(0.82 0.16 75)'
            : 'oklch(0.82 0.16 195)',
      onClick: () => navigate(detailHref.replace(':id', l.id)),
    })) ?? [];

  return (
    <main className="relative flex flex-1 flex-col">
      <div className="absolute inset-x-0 top-3 z-20 mx-auto flex max-w-2xl items-center gap-2 px-3">
        <Card tone="strong" className="flex-1">
          <CardBody className="flex items-center gap-2 py-2">
            <Icon icon={Search} size={16} tone="tertiary" />
            <span className="text-sm text-[var(--text-secondary)]">
              {isLoading ? 'Yükleniyor…' : `${data?.total ?? 0} ilan haritada`}
            </span>
            <div className="ml-auto flex gap-1.5">
              <Badge tone="info" size="sm" dot>
                Konut
              </Badge>
              <Badge tone="success" size="sm" dot>
                Tarla
              </Badge>
              <Badge tone="premium" size="sm" dot>
                Turizm
              </Badge>
            </div>
          </CardBody>
        </Card>
        <Button
          tone="neutral"
          leftIcon={<Icon icon={Layers} size={14} />}
          onClick={() => setFilterOpen(true)}
        >
          Katman
        </Button>
      </div>

      <div className="h-[calc(100dvh-9rem)]">
        <MapView markers={markers} className="size-full" />
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen} side="right" title="Harita Katmanları">
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-[var(--text-secondary)]">
            Phase 7'de ısı haritası, imar overlay'i ve deprem riski katmanı eklenecek.
          </p>
          <div className="rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-slate)] p-3">
            <p className="font-medium">AI Bölge Özeti</p>
            <p className="mt-1 text-[var(--text-secondary)]">
              {data
                ? `Görünen ${data.items.length} ilanın ortalama m² fiyatı yüksek volatilitede. Marmara/Ege bölgesinde yoğunlaşma var.`
                : 'Veri bekleniyor…'}
            </p>
          </div>
          <Button onClick={() => toast.success('Bölge raporu oluşturuldu')} block>
            Bölge AI raporu
          </Button>
        </div>
      </Sheet>
    </main>
  );
}
