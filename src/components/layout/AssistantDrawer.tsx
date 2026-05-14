import {
  Badge,
  Button,
  Card,
  CardBody,
  Icon,
  Input,
  Tabs,
  ThinkingDot,
  TokenStream,
  toast,
  tokenize,
} from '@/components/ui';
import { Bot, MessageSquare, Send, Sparkles, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Msg = { id: string; role: 'user' | 'assistant'; text: string; ts: number };

const SUGGESTIONS = [
  { id: 's1', label: "Beykoz'da 5000+ m² imarlı 2.5M altı arsa öner" },
  { id: 's2', label: 'Çeşme bölgesi son 6 ay fiyat trendi' },
  { id: 's3', label: 'TKGM E001 nasıl çözülür?' },
  { id: 's4', label: 'Mudanya zeytinlik (3573) hukuki risk' },
];

const AUTOMATIONS = [
  {
    id: 'a1',
    name: 'Düşük fiyat alarmı',
    desc: 'Favoriler %5+ düşerse anında bildir',
    enabled: true,
  },
  { id: 'a2', name: 'Lead takip', desc: '24sa yanıtsız teklif → AI mesaj öner', enabled: true },
  {
    id: 'a3',
    name: 'KVKK 30g sayaç',
    desc: 'DSAR talepleri için yasal süre uyarısı',
    enabled: true,
  },
  {
    id: 'a4',
    name: 'Eski ilan revize',
    desc: '60g+ ilanlar için AI açıklama önerisi',
    enabled: false,
  },
];

export function AssistantDrawer() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 'sys',
      role: 'assistant',
      text: 'Merhaba! Sayfa-aware AI asistanım. Mevcut bağlamına göre öneri yapabilirim — listing, broker leads, audit log, …',
      ts: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('landx:open-assistant', handler);
    return () => window.removeEventListener('landx:open-assistant', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: `m_${Date.now()}`, role: 'user', text: text.trim(), ts: Date.now() };
    setMsgs((m) => [...m, userMsg]);
    setDraft('');
    setStreaming(true);
    window.setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: `m_${Date.now() + 1}`,
          role: 'assistant',
          text: mockReply(text.trim()),
          ts: Date.now(),
        },
      ]);
      setStreaming(false);
    }, 720);
  }

  return (
    <>
      <button
        type="button"
        aria-label="AI asistanı aç"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent-violet)] bg-[var(--surface-elevated)] text-[var(--accent-violet)] shadow-[var(--glow-violet)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] md:bottom-6 md:right-6"
      >
        <span className="relative inline-flex">
          <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-[var(--accent-violet)] opacity-30" />
          <Icon icon={Sparkles} tone="violet" size={20} />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="AI asistanını kapat"
            className="fixed inset-0 z-[70] bg-[var(--surface-void)]/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <aside
            className="fixed bottom-0 right-0 top-0 z-[71] flex w-full max-w-md flex-col border-l border-[var(--stroke-default)] bg-[var(--surface-elevated)] shadow-[var(--glow-violet)] md:bottom-4 md:right-4 md:top-16 md:rounded-[var(--radius-lg)] md:border"
            role="dialog"
            aria-label="AI Asistanı"
          >
            <header className="flex items-center justify-between border-b border-[var(--stroke-subtle)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon icon={Sparkles} tone="violet" />
                <span className="font-medium">AI Asistanı</span>
                <Badge tone="agent" size="sm" dot>
                  claude-sonnet-4-6
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

            <div className="flex-1 overflow-hidden">
              <Tabs
                items={[
                  {
                    id: 'chat',
                    label: (
                      <span className="flex items-center gap-1">
                        <Icon icon={MessageSquare} size={12} />
                        Sohbet
                      </span>
                    ),
                    content: (
                      <div className="flex h-[55vh] flex-col md:h-[60vh]">
                        <div
                          ref={scrollRef}
                          className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-2"
                        >
                          {msgs.map((m, idx) => (
                            <div
                              key={m.id}
                              className={`max-w-[88%] rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                                m.role === 'user'
                                  ? 'ml-auto bg-[var(--accent-cyan)] text-[var(--surface-void)]'
                                  : 'bg-[var(--surface-base)]'
                              }`}
                            >
                              {m.role === 'assistant' && idx === msgs.length - 1 && !streaming ? (
                                <TokenStream tokens={tokenize(m.text)} intervalMs={14} />
                              ) : (
                                <p className="whitespace-pre-line">{m.text}</p>
                              )}
                            </div>
                          ))}
                          {streaming && (
                            <div className="flex items-center gap-2 px-3 text-xs text-[var(--text-secondary)]">
                              <ThinkingDot tone="violet" />
                              <span>AI yanıt yazıyor…</span>
                            </div>
                          )}
                        </div>
                        <form
                          className="flex gap-2 border-t border-[var(--stroke-subtle)] p-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            send(draft);
                          }}
                        >
                          <Input
                            value={draft}
                            onChange={(e) => setDraft(e.currentTarget.value)}
                            placeholder="Bağlama göre soru sor…"
                            className="flex-1"
                          />
                          <Button
                            type="submit"
                            tone="agent"
                            leftIcon={<Icon icon={Send} size={14} />}
                          >
                            Gönder
                          </Button>
                        </form>
                      </div>
                    ),
                  },
                  {
                    id: 'suggestions',
                    label: (
                      <span className="flex items-center gap-1">
                        <Icon icon={Bot} size={12} />
                        Öneriler
                      </span>
                    ),
                    content: (
                      <div className="flex flex-col gap-2 overflow-y-auto p-3">
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => send(s.label)}
                            className="rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2 text-left text-sm hover:border-[var(--accent-violet)] hover:bg-[var(--surface-base)]"
                          >
                            <Icon icon={Sparkles} size={12} tone="violet" className="mr-1.5" />
                            {s.label}
                          </button>
                        ))}
                        <Card tone="solid">
                          <CardBody className="text-xs text-[var(--text-secondary)]">
                            AI öneri seçimleri /admin/ai-ops &gt; Prompt Library altında
                            düzenlenebilir.
                          </CardBody>
                        </Card>
                      </div>
                    ),
                  },
                  {
                    id: 'automations',
                    label: (
                      <span className="flex items-center gap-1">
                        <Icon icon={Zap} size={12} />
                        Otomasyon
                      </span>
                    ),
                    content: (
                      <div className="flex flex-col gap-2 overflow-y-auto p-3">
                        {AUTOMATIONS.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{a.name}</span>
                              <span className="text-xs text-[var(--text-tertiary)]">{a.desc}</span>
                            </div>
                            <Badge tone={a.enabled ? 'success' : 'warning'} size="sm">
                              {a.enabled ? 'aktif' : 'pasif'}
                            </Badge>
                          </div>
                        ))}
                        <Button
                          tone="ghost"
                          onClick={() =>
                            toast.show('Otomasyonlar /admin/rules altında genişletilebilir')
                          }
                        >
                          Tüm kuralları gör
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function mockReply(q: string): string {
  const low = q.toLowerCase();
  if (low.includes('beykoz')) {
    return 'Beykoz 5000+ m² imarlı 2.5M altı 3 sonuç buldum:\n• lst_00214 — 5.200m² · ₺2.28M · %92 güven\n• lst_00187 — 6.100m² · ₺2.42M · %88 güven\n• lst_00302 — 5.400m² · ₺2.05M · %84 güven (tapu beklemede)';
  }
  if (low.includes('çeşme')) {
    return 'Çeşme bölgesi son 6 ayda ortalama ₺/m² %12 yükseldi. Reisdere ve Alaçatı en hızlı, Karaburun stabil. Detaylı rapor /admin/reports/geographic';
  }
  if (low.includes('e001') || low.includes('tkgm')) {
    return 'E001 = geçersiz ada/parsel kombinasyonu. Çözüm: pafta numarasını da girip tekrar deneyin. Pafta gerekmiyorsa il/ilçe doğrulayın. Yardım: /admin/tkgm';
  }
  if (low.includes('zeytinlik') || low.includes('3573')) {
    return '3573 sayılı kanun: 100\'den fazla zeytin ağacı bulunan parseller "zeytinlik" sayılır. İnşaat için Bakanlık izni gerekir; tarımsal kullanım serbest. Listing detayda risk badge\'i ile gösterilir.';
  }
  return `"${q}" sorusu için bağlam topladım. Mevcut sayfada bulduğum 4 ilgili kaynak var. Daha spesifik bir konu belirtebilir misiniz?`;
}
