import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Input,
  ThinkingDot,
  TokenStream,
  tokenize,
} from '@/components/ui';
import { cn, headingRecipe } from '@/design/recipes';
import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  body: string;
  tools?: Array<{ name: string; status: string; result?: string }>;
};

const SAMPLE_REPLY =
  'Çeşme bölgesindeki son 6 ayda 84 yeni ilan eklendi. Ortalama m² fiyatı 8.400 ₺. AI değerleme güven aralığı genelinde stabil. Detaylı raporu için tool çağrısı başlattım: `search_listings(city=İzmir, district=Çeşme)`.';

export default function AiAssistantPage() {
  const [thread, setThread] = useState<ChatMessage[]>([
    {
      id: 'sys',
      role: 'assistant',
      body: 'Merhaba! Sana özel AI asistanım. Favoriler, kayıtlı aramalar ve geçmiş etkileşimlerin üzerinden öneri yapabilirim.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const userMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      role: 'user',
      body: draft.trim(),
    };
    setThread((t) => [...t, userMessage]);
    setDraft('');
    setStreaming(true);
    window.setTimeout(() => {
      setThread((t) => [
        ...t,
        {
          id: `m_${Date.now() + 1}`,
          role: 'assistant',
          body: SAMPLE_REPLY,
          tools: [
            { name: 'search_listings', status: 'success', result: '84 sonuç' },
            { name: 'compute_avg_price', status: 'success', result: '8.400 ₺/m²' },
          ],
        },
      ]);
      setStreaming(false);
    }, 800);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between">
        <h1 className={headingRecipe({ level: 'h3' })}>Kişisel AI Asistan</h1>
        <Badge tone="agent" dot size="md">
          Bağlam: favoriler + aramalar
        </Badge>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col">
          <CardBody className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
            {thread.map((m, idx) => (
              <div
                key={m.id}
                className={cn(
                  'max-w-[88%] rounded-[var(--radius-md)] px-3 py-2 text-sm',
                  m.role === 'user'
                    ? 'ml-auto bg-[var(--accent-cyan)] text-[var(--surface-void)]'
                    : 'bg-[var(--surface-slate)]',
                )}
              >
                {m.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                    <Icon icon={Sparkles} size={12} tone="violet" />
                    <span>AI</span>
                  </div>
                )}
                {m.role === 'assistant' && idx === thread.length - 1 && !streaming ? (
                  <TokenStream tokens={tokenize(m.body)} intervalMs={18} />
                ) : (
                  <p>{m.body}</p>
                )}
                {m.tools && m.tools.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1 border-t border-[var(--stroke-subtle)] pt-2 font-mono text-xs">
                    {m.tools.map((t) => (
                      <li key={t.name} className="text-[var(--text-tertiary)]">
                        ↳ {t.name}() → {t.status} · {t.result}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <ThinkingDot tone="violet" />
                <span>AI düşünüyor…</span>
              </div>
            )}
          </CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t border-[var(--stroke-subtle)] p-3"
          >
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Çeşme'de yeni ne var?"
                className="flex-1"
              />
              <Button type="submit" leftIcon={<Icon icon={Send} size={16} />}>
                Sor
              </Button>
            </div>
          </form>
        </Card>

        <Card tone="solid">
          <CardHeader>
            <span className="font-medium">Inspector</span>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 text-xs font-mono">
            <div>
              <p className="text-[var(--text-tertiary)]">Aktif tool'lar</p>
              <ul className="mt-1 flex flex-col gap-1">
                <li>search_listings</li>
                <li>valuation.estimate</li>
                <li>favorites.read</li>
              </ul>
            </div>
            <div>
              <p className="text-[var(--text-tertiary)]">Bağlam</p>
              <p className="mt-1 text-[var(--text-primary)]">
                12 favori · 3 kayıtlı arama · son 7 gün aktivite
              </p>
            </div>
            <div>
              <p className="text-[var(--text-tertiary)]">Maliyet (mock)</p>
              <p className="mt-1 text-[var(--text-primary)]">
                $0.012 · 1.2k token in / 0.4k token out
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
