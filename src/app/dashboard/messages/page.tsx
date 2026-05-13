import { Badge, Button, Card, CardBody, CardHeader, Icon, Input, toast } from '@/components/ui';
import { cn, headingRecipe } from '@/design/recipes';
import { apiFetch } from '@/lib/api/client';
import { formatRelative } from '@/lib/format';
import type { Message, Thread } from '@/types/messaging';
import { useQuery } from '@tanstack/react-query';
import { Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MessagesPage() {
  const threadsQ = useQuery({
    queryKey: ['threads'],
    queryFn: () => apiFetch<{ items: Thread[] }>('/threads'),
  });
  const threads = threadsQ.data?.items ?? [];
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:px-6 md:py-8">
      <header>
        <h1 className={headingRecipe({ level: 'h3' })}>Mesajlar</h1>
      </header>
      <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
        <aside className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
          {threads.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={cn(
                'flex flex-col gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-left transition-colors',
                active?.id === t.id
                  ? 'border-[var(--accent-cyan)] bg-[var(--surface-slate)]'
                  : 'border-[var(--stroke-subtle)] hover:bg-[var(--surface-slate)]/40',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: t.participantAvatarColor }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium">{t.participantName}</span>
                  {t.isAgent && (
                    <Badge tone="agent" size="sm">
                      AI
                    </Badge>
                  )}
                </span>
                {t.unreadCount > 0 && (
                  <Badge tone="info" size="sm">
                    {t.unreadCount}
                  </Badge>
                )}
              </div>
              <p className="line-clamp-1 text-xs text-[var(--text-tertiary)]">{t.lastMessage}</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {formatRelative(t.lastMessageAt)}
              </p>
            </button>
          ))}
        </aside>
        {active ? (
          <ConversationPanel thread={active} />
        ) : (
          <Card>
            <CardBody className="flex h-full items-center justify-center py-12 text-[var(--text-secondary)]">
              Bir konuşma seç
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}

function ConversationPanel({ thread }: { thread: Thread }) {
  const messagesQ = useQuery({
    queryKey: ['threadMessages', thread.id],
    queryFn: () => apiFetch<{ items: Message[] }>(`/threads/${thread.id}/messages`),
  });
  const messages = messagesQ.data?.items ?? [];
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: thread.participantAvatarColor }}
            aria-hidden
          />
          <span className="font-medium">{thread.participantName}</span>
          {thread.isAgent && (
            <Badge tone="agent" size="sm">
              AI Agent
            </Badge>
          )}
        </div>
        {thread.isAgent && (
          <Badge tone="agent" dot size="sm">
            Sahip onaylı
          </Badge>
        )}
      </CardHeader>
      <CardBody
        className="flex max-h-[55vh] flex-1 flex-col gap-3 overflow-y-auto"
        ref={scrollRef as never}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'max-w-[80%] rounded-[var(--radius-md)] px-3 py-2 text-sm',
              m.author === 'me'
                ? 'ml-auto bg-[var(--accent-cyan)] text-[var(--surface-void)]'
                : m.author === 'agent'
                  ? 'border border-[var(--accent-magenta)] bg-[oklch(0.72_0.25_340_/_0.10)] text-[var(--text-primary)]'
                  : 'bg-[var(--surface-slate)] text-[var(--text-primary)]',
            )}
          >
            {m.author === 'agent' && (
              <div className="mb-1 flex items-center gap-1 text-xs">
                <Icon icon={Sparkles} size={12} tone="magenta" />
                <span>AI Agent</span>
              </div>
            )}
            <p>{m.body}</p>
            {m.toolCalls && m.toolCalls.length > 0 && (
              <details className="mt-1 text-xs">
                <summary className="cursor-pointer text-[var(--text-tertiary)]">
                  Tool çağrıları ({m.toolCalls.length})
                </summary>
                {m.toolCalls.map((tc) => (
                  <div key={tc.id} className="mt-1 font-mono text-[var(--text-tertiary)]">
                    {tc.toolName}({JSON.stringify(tc.args)}) → {tc.status} ({tc.durationMs}ms)
                  </div>
                ))}
              </details>
            )}
            <div className="mt-1 text-[10px] text-current opacity-60">
              {formatRelative(m.createdAt)}
            </div>
          </div>
        ))}
      </CardBody>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          toast.success('Mesaj gönderildi');
          setDraft('');
        }}
        className="border-t border-[var(--stroke-subtle)] p-3"
      >
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Mesaj yaz…"
            className="flex-1"
          />
          <Button type="submit" leftIcon={<Icon icon={Send} size={16} />}>
            Gönder
          </Button>
        </div>
      </form>
    </Card>
  );
}
