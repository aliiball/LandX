import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

type Viewing = {
  id: string;
  listingTitle: string;
  city: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  broker: string;
};

const VIEWINGS: Viewing[] = [
  {
    id: 'v_001',
    listingTitle: 'Beykoz Şile yolu 5.200m²',
    city: 'İstanbul',
    date: '2026-05-18',
    time: '14:00',
    status: 'scheduled',
    broker: 'Karaca İsmail',
  },
  {
    id: 'v_002',
    listingTitle: 'Çeşme Reisdere 1.480m² imarlı',
    city: 'İzmir',
    date: '2026-05-22',
    time: '11:30',
    status: 'scheduled',
    broker: 'Mert Kıyı',
  },
  {
    id: 'v_003',
    listingTitle: 'Mudanya zeytinlik 3.800m²',
    city: 'Bursa',
    date: '2026-05-26',
    time: '10:00',
    status: 'scheduled',
    broker: 'Selin Demir',
  },
  {
    id: 'v_004',
    listingTitle: 'Bodrum Yalıçiftlik 2.200m²',
    city: 'Muğla',
    date: '2026-05-09',
    time: '15:00',
    status: 'completed',
    broker: 'Karaca İsmail',
  },
  {
    id: 'v_005',
    listingTitle: 'Kuşadası Soğucak 920m²',
    city: 'Aydın',
    date: '2026-05-02',
    time: '13:00',
    status: 'completed',
    broker: 'Burak Akın',
  },
  {
    id: 'v_006',
    listingTitle: 'Polatlı tarla 12.500m²',
    city: 'Ankara',
    date: '2026-04-28',
    time: '14:30',
    status: 'cancelled',
    broker: 'Ayşe Anadolu',
  },
];

const STATUS_TONE = { scheduled: 'info', completed: 'success', cancelled: 'warning' } as const;

export default function DashboardViewingsPage() {
  const upcoming = VIEWINGS.filter((v) => v.status === 'scheduled');
  const past = VIEWINGS.filter((v) => v.status !== 'scheduled');

  return (
    <AdminPage
      surfaceKey="B · /dashboard/viewings"
      module="B5 Viewings"
      title="Randevular"
      description="İlan inceleme randevularınız — tarih, lokasyon, danışman."
      actions={
        <Button tone="primary" size="sm" onClick={() => toast.show('Yeni randevu oluştur')}>
          + Yeni randevu
        </Button>
      }
      kpis={[
        { label: 'Yaklaşan', value: String(upcoming.length), tone: 'cyan' },
        {
          label: 'Tamamlanmış',
          value: String(past.filter((v) => v.status === 'completed').length),
          tone: 'lime',
        },
        {
          label: 'İptal',
          value: String(past.filter((v) => v.status === 'cancelled').length),
          tone: 'amber',
        },
        { label: 'Toplam', value: String(VIEWINGS.length), tone: 'violet' },
      ]}
    >
      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI önerisi</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          18 Mayıs Pazar günkü <span className="font-medium">Beykoz Şile yolu</span> randevunuzdan
          önce ulaşım rotasını kontrol etmenizi öneririm — Pazar günleri Şile yolu yoğun. Çıkış
          saati 12:30 idealdir.
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Yaklaşan ({upcoming.length})</span>
        </CardHeader>
        <CardBody className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((v) => (
            <ViewingCard key={v.id} v={v} />
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-medium">Geçmiş ({past.length})</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {past.map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)]/40 px-3 py-2 text-sm"
            >
              <Badge tone={STATUS_TONE[v.status]} size="sm">
                {v.status}
              </Badge>
              <span className="flex items-center gap-1 text-xs">
                <Icon icon={Calendar} size={12} />
                {v.date} {v.time}
              </span>
              <span className="flex-1">{v.listingTitle}</span>
              <span className="text-xs text-[var(--text-tertiary)]">danışman: {v.broker}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}

function ViewingCard({ v }: { v: Viewing }) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3">
      <div className="flex items-center justify-between">
        <Badge tone={STATUS_TONE[v.status]} size="sm" dot>
          {v.status}
        </Badge>
        <span className="flex items-center gap-1 font-mono text-xs">
          <Icon icon={Calendar} size={12} />
          {v.date}
        </span>
      </div>
      <span className="font-medium">{v.listingTitle}</span>
      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1">
          <Icon icon={MapPin} size={12} />
          {v.city}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon={Clock} size={12} />
          {v.time}
        </span>
      </div>
      <span className="text-xs text-[var(--text-tertiary)]">Danışman: {v.broker}</span>
    </div>
  );
}
