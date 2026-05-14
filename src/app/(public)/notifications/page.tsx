import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { headingRecipe } from '@/design/recipes';
import {
  Banknote,
  Bell,
  CheckCircle2,
  Heart,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

type Priority = 'now' | 'soon' | 'later';
type NotifKind = 'offer' | 'message' | 'price' | 'favorite' | 'kvkk' | 'system' | 'ai';

type Notif = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  ts: string;
  priority: Priority;
  groupKey?: string;
  unread: boolean;
  href?: string;
};

const ICONS: Record<NotifKind, typeof Bell> = {
  offer: Banknote,
  message: MessageSquare,
  price: TrendingUp,
  favorite: Heart,
  kvkk: ShieldAlert,
  system: Bell,
  ai: Sparkles,
};

const TONE_BY_PRIORITY: Record<Priority, 'danger' | 'warning' | 'info'> = {
  now: 'danger',
  soon: 'warning',
  later: 'info',
};

function minAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

const INITIAL: Notif[] = [
  {
    id: 'n_001',
    kind: 'offer',
    title: 'Yeni teklif: Beykoz 5.200m²',
    body: 'Mert K. ₺2.2M tutarında teklif gönderdi.',
    ts: minAgo(4),
    priority: 'now',
    unread: true,
    href: '/dashboard/messages',
  },
  {
    id: 'n_002',
    kind: 'message',
    title: '3 yanıt bekleyen mesaj',
    body: 'Karaca İsmail ve 2 alıcı sizden geri dönüş bekliyor.',
    ts: minAgo(18),
    priority: 'now',
    unread: true,
    groupKey: 'pending-replies',
    href: '/dashboard/messages',
  },
  {
    id: 'n_003',
    kind: 'kvkk',
    title: 'KVKK DSAR talebiniz alındı',
    body: 'Talep #dsar_004 — 27 gün içinde yanıtlanacak.',
    ts: minAgo(45),
    priority: 'soon',
    unread: true,
    href: '/legal/kvkk',
  },
  {
    id: 'n_004',
    kind: 'price',
    title: 'Favoriniz %5.7 yükseldi',
    body: 'Çeşme Reisdere ilanı fiyatı arttı.',
    ts: minAgo(120),
    priority: 'soon',
    unread: false,
    href: '/dashboard/favorites/trends',
  },
  {
    id: 'n_005',
    kind: 'ai',
    title: 'Yeni AI önerisi',
    body: '"Sizin için" sekmesinde 3 yeni öneri hazır.',
    ts: minAgo(240),
    priority: 'soon',
    unread: false,
    href: '/',
  },
  {
    id: 'n_006',
    kind: 'favorite',
    title: 'İlanınız favoriler listesine eklendi',
    body: 'Mudanya zeytinlik ilanını 4 kullanıcı favoriledi.',
    ts: minAgo(360),
    priority: 'later',
    unread: false,
  },
  {
    id: 'n_007',
    kind: 'system',
    title: 'VERBİS güncelleme yakın',
    body: 'Yıllık kayıt yenileme 5 gün içinde.',
    ts: minAgo(720),
    priority: 'now',
    unread: true,
    href: '/admin/compliance',
  },
  {
    id: 'n_008',
    kind: 'message',
    title: '2 randevu hatırlatması',
    body: '18 Mayıs 14:00 Beykoz arsa görüntüleme.',
    ts: minAgo(1440),
    priority: 'later',
    unread: false,
    groupKey: 'viewing-reminders',
    href: '/dashboard/viewings',
  },
  {
    id: 'n_009',
    kind: 'price',
    title: 'Bölge raporu güncellendi',
    body: 'Bodrum/Yalıçiftlik ortalama ₺/m² %3.2 değişti.',
    ts: minAgo(2880),
    priority: 'later',
    unread: false,
  },
  {
    id: 'n_010',
    kind: 'ai',
    title: 'AI sohbet geçmişiniz hazır',
    body: "Geçen ay 24 sohbet, 18.4K token. Detaylar /ai-history'de.",
    ts: minAgo(4320),
    priority: 'later',
    unread: false,
    href: '/dashboard/ai-history',
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(INITIAL);
  const unread = items.filter((i) => i.unread).length;
  const grouped: Record<Priority, Notif[]> = { now: [], soon: [], later: [] };
  for (const n of items) grouped[n.priority].push(n);

  const markAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('Tüm bildirimler okundu işaretlendi');
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={headingRecipe({ level: 'h2' })}>Bildirimler</h1>
          <p className="text-[var(--text-secondary)]">
            AI-gruplama ile önceliklendirilmiş. <span className="font-medium">{unread}</span>{' '}
            okunmamış.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={CheckCircle2} size={14} />}
            onClick={markAll}
          >
            Hepsini okundu işaretle
          </Button>
        </div>
      </header>

      <Card tone="solid">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Sparkles} tone="violet" />
            <span className="font-medium">AI özet</span>
          </div>
        </CardHeader>
        <CardBody className="text-sm text-[var(--text-secondary)]">
          Son 24 saatte <span className="font-medium">{grouped.now.length}</span> acil,{' '}
          <span className="font-medium">{grouped.soon.length}</span> yakın takip,{' '}
          <span className="font-medium">{grouped.later.length}</span> bilgilendirme. Acil olanlardan
          en kritik:{' '}
          <span className="text-[var(--accent-magenta)] font-medium">VERBİS yenileme</span> — 5 gün
          kaldı.
        </CardBody>
      </Card>

      {(['now', 'soon', 'later'] as const).map((p) =>
        grouped[p].length === 0 ? null : (
          <section key={p}>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={TONE_BY_PRIORITY[p]} size="sm">
                {p === 'now' ? 'Acil' : p === 'soon' ? 'Yakın' : 'Bilgi'}
              </Badge>
              <span className="text-xs text-[var(--text-tertiary)]">
                {grouped[p].length} bildirim
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {grouped[p].map((n) => {
                const Icn = ICONS[n.kind];
                return (
                  <Card key={n.id}>
                    <CardBody className="flex items-start gap-3">
                      <Icon icon={Icn} tone="cyan" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${n.unread ? '' : 'text-[var(--text-secondary)]'}`}
                          >
                            {n.title}
                          </span>
                          {n.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
                          )}
                          {n.groupKey && (
                            <Badge size="sm" tone="info">
                              grup
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{n.body}</p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                          <span>{new Date(n.ts).toLocaleString('tr-TR')}</span>
                          {n.href && (
                            <a href={n.href} className="text-[var(--accent-cyan)] hover:underline">
                              Aç →
                            </a>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </section>
        ),
      )}
    </main>
  );
}
