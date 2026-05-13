import type { Alert, Notification } from '@/types/messaging';
import { fakerTR, initFakerSeed } from './faker-config';

let cachedNotifications: Notification[] | null = null;
let cachedAlerts: Alert[] | null = null;

const NOTIFICATION_TEMPLATES: Array<Pick<Notification, 'category' | 'title' | 'body' | 'href'>> = [
  {
    category: 'alert',
    title: 'Çeşme aramanız için 3 yeni ilan',
    body: 'Kaydedilmiş aramanıza uyan yeni sonuçlar listede.',
    href: '/dashboard/alerts',
  },
  {
    category: 'message',
    title: 'Satıcı yanıtladı',
    body: 'İznik 2 dönüm ilanı hakkında yeni mesaj geldi.',
    href: '/dashboard/messages',
  },
  {
    category: 'agent',
    title: 'AI değerleme raporu hazır',
    body: 'Karacabey lst_00042 için detaylı PDF rapor hazır.',
    href: '/dashboard/listings',
  },
  {
    category: 'system',
    title: 'KVKK aydınlatma metni güncellendi',
    body: 'Lütfen incelemenizi rica ederiz.',
    href: '/legal/kvkk',
  },
];

function build() {
  initFakerSeed();
  cachedNotifications = NOTIFICATION_TEMPLATES.flatMap((t, i) =>
    Array.from({ length: 3 }, (_, j) => {
      const created = new Date(
        Date.now() - (i * 3 + j) * fakerTR.number.int({ min: 3, max: 18 }) * 3600 * 1000,
      );
      return {
        id: `not_${i + 1}_${j + 1}`,
        channel: (['in-app', 'email', 'push'] as const)[j % 3] as 'in-app',
        category: t.category,
        title: t.title,
        body: t.body,
        href: t.href,
        createdAt: created.toISOString(),
        read: j > 1,
      } satisfies Notification;
    }),
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  cachedAlerts = [
    {
      id: 'alr_001',
      name: 'Çeşme imarlı arsa',
      filters: { city: 'İzmir', district: 'Çeşme', imarli: 'true' },
      channels: ['in-app', 'email'],
      matchCount: 12,
      createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
      enabled: true,
    },
    {
      id: 'alr_002',
      name: 'Karacabey 5 dönüm+',
      filters: { city: 'Bursa', district: 'Karacabey', areaMin: '5000' },
      channels: ['in-app', 'push'],
      matchCount: 4,
      createdAt: new Date(Date.now() - 18 * 86400_000).toISOString(),
      enabled: true,
    },
    {
      id: 'alr_003',
      name: 'Bodrum turizm',
      filters: { city: 'Muğla', district: 'Bodrum', zoning: 'turizm' },
      channels: ['in-app'],
      matchCount: 2,
      createdAt: new Date(Date.now() - 32 * 86400_000).toISOString(),
      enabled: false,
    },
  ];
}

export function getNotifications(): ReadonlyArray<Notification> {
  if (!cachedNotifications) build();
  return cachedNotifications ?? [];
}

export function getAlerts(): ReadonlyArray<Alert> {
  if (!cachedAlerts) build();
  return cachedAlerts ?? [];
}
