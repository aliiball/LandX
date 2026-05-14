import { Badge, Icon } from '@/components/ui';
import {
  Banknote,
  Bell,
  Heart,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

type Priority = 'now' | 'soon' | 'later';
type NotifKind = 'offer' | 'message' | 'price' | 'favorite' | 'kvkk' | 'system' | 'ai';

type Notif = {
  id: string;
  kind: NotifKind;
  title: string;
  ts: string;
  priority: Priority;
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

function minAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

const SAMPLE: Notif[] = [
  {
    id: 'n_001',
    kind: 'offer',
    title: 'Yeni teklif: Beykoz 5.200m² · ₺2.2M',
    ts: minAgo(4),
    priority: 'now',
    unread: true,
    href: '/dashboard/messages',
  },
  {
    id: 'n_007',
    kind: 'system',
    title: 'VERBİS güncelleme — 5 gün kaldı',
    ts: minAgo(720),
    priority: 'now',
    unread: true,
    href: '/admin/compliance',
  },
  {
    id: 'n_002',
    kind: 'message',
    title: '3 yanıt bekleyen mesaj',
    ts: minAgo(18),
    priority: 'now',
    unread: true,
    href: '/dashboard/messages',
  },
  {
    id: 'n_003',
    kind: 'kvkk',
    title: 'KVKK DSAR #dsar_004 alındı',
    ts: minAgo(45),
    priority: 'soon',
    unread: true,
    href: '/legal/kvkk',
  },
  {
    id: 'n_004',
    kind: 'price',
    title: 'Favoriniz %5.7 yükseldi (Çeşme)',
    ts: minAgo(120),
    priority: 'soon',
    unread: false,
    href: '/dashboard/favorites/trends',
  },
  {
    id: 'n_005',
    kind: 'ai',
    title: 'Yeni AI önerisi · 3 sonuç',
    ts: minAgo(240),
    priority: 'soon',
    unread: false,
    href: '/',
  },
];

const PRIORITY_LABEL: Record<Priority, string> = { now: 'Acil', soon: 'Yakın', later: 'Bilgi' };

const TONE_BY_PRIORITY: Record<Priority, 'danger' | 'warning' | 'info'> = {
  now: 'danger',
  soon: 'warning',
  later: 'info',
};

export function NotificationsDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(SAMPLE);
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const grouped: Record<Priority, Notif[]> = { now: [], soon: [], later: [] };
  for (const n of items) grouped[n.priority].push(n);

  return (
    <>
      <button
        type="button"
        aria-label={`Bildirimler${unread > 0 ? ` (${unread} okunmamış)` : ''}`}
        onClick={() => setOpen(true)}
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--stroke-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)] hover:text-[var(--text-primary)]"
      >
        <Icon icon={Bell} size={14} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-magenta)] px-1 font-mono text-[9px] font-medium text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Bildirim panelini kapat"
            className="fixed inset-0 z-[70] bg-[var(--surface-void)]/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className="fixed bottom-0 right-0 top-0 z-[71] flex w-full max-w-md flex-col border-l border-[var(--stroke-default)] bg-[var(--surface-elevated)] shadow-[var(--glow-cyan)]"
            role="dialog"
            aria-label="Bildirimler"
          >
            <header className="flex items-center justify-between border-b border-[var(--stroke-subtle)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon icon={Bell} tone="cyan" />
                <span className="font-medium">Bildirimler</span>
                <Badge tone="info" size="sm">
                  {unread} okunmamış
                </Badge>
              </div>
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <Icon icon={X} size={16} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {(['now', 'soon', 'later'] as Priority[]).map((p) =>
                grouped[p].length === 0 ? null : (
                  <div key={p} className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge tone={TONE_BY_PRIORITY[p]} size="sm">
                        {PRIORITY_LABEL[p]}
                      </Badge>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {grouped[p].length}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {grouped[p].map((n) => {
                        const Icn = ICONS[n.kind];
                        const body = (
                          <span className="flex items-start gap-3">
                            <Icon icon={Icn} tone="cyan" size={14} />
                            <span className="flex-1">
                              <span
                                className={`block text-sm ${n.unread ? 'font-medium' : 'text-[var(--text-secondary)]'}`}
                              >
                                {n.title}
                              </span>
                              <span className="block text-[10px] text-[var(--text-tertiary)]">
                                {new Date(n.ts).toLocaleString('tr-TR')}
                              </span>
                            </span>
                            {n.unread && (
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)]" />
                            )}
                          </span>
                        );
                        return (
                          <li key={n.id}>
                            {n.href ? (
                              <Link
                                to={n.href}
                                onClick={() => {
                                  markRead(n.id);
                                  setOpen(false);
                                }}
                                className="block rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 hover:border-[var(--accent-cyan)] hover:bg-[var(--surface-base)]"
                              >
                                {body}
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => markRead(n.id)}
                                className="block w-full rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-left hover:border-[var(--accent-cyan)] hover:bg-[var(--surface-base)]"
                              >
                                {body}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ),
              )}
            </div>

            <footer className="border-t border-[var(--stroke-subtle)] px-3 py-2">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="block rounded-[var(--radius-md)] py-2 text-center text-sm text-[var(--accent-cyan)] hover:bg-[var(--surface-base)]"
              >
                Tüm bildirimleri gör →
              </Link>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}
