import type { Message, Thread } from '@/types/messaging';
import { fakerTR, initFakerSeed } from './faker-config';
import { getListings } from './listings';

let cachedThreads: Thread[] | null = null;
let cachedMessages: Map<string, Message[]> | null = null;

const AGENT_NAMES = ['AI Asistan', 'Değerleme Agent', 'Q&A Agent', 'Mesaj Agent'];

const STARTERS = [
  'Merhaba, ilan hâlâ aktif mi?',
  'Bu arsayla ilgili daha fazla bilgi alabilir miyim?',
  'Tapu doğrulamasının detayları nelerdir?',
  'Fiyatta pazarlık payı var mı?',
  'Yerinde görme imkânı mümkün mü?',
  'AI değerleme raporunu paylaşabilir misiniz?',
];

const REPLIES = [
  'Evet, ilan hâlâ aktif. Görüşme için müsait olduğunuz tarihi belirtirseniz organize edebilirim.',
  'Tabii, tapu hash doğrulaması yapıldı. Belge linkini hemen paylaşıyorum.',
  'Fiyatta pazarlığa açığız, somut bir teklifle gelmeniz durumunda değerlendiririz.',
  'Yerinde görme için hafta sonu uygunum, lokasyon koordinatlarını ileteceğim.',
];

function buildThreads() {
  initFakerSeed();
  const listings = getListings().slice(0, 14);
  const threads: Thread[] = [];
  const messageMap = new Map<string, Message[]>();

  let messageId = 0;

  for (let i = 0; i < listings.length; i += 1) {
    const listing = listings[i];
    if (!listing) continue;
    const isAgent = i % 3 === 0;
    const threadId = `thr_${String(i + 1).padStart(4, '0')}`;
    const participantName = isAgent
      ? (AGENT_NAMES[i % AGENT_NAMES.length] ?? 'AI Asistan')
      : fakerTR.person.fullName();
    const participantColor = isAgent ? 'oklch(0.72 0.25 340)' : 'oklch(0.78 0.18 175)';

    const messageCount = fakerTR.number.int({ min: 3, max: 9 });
    const messages: Message[] = [];
    let lastTime = Date.now() - fakerTR.number.int({ min: 60_000, max: 3 * 24 * 3600 * 1000 });
    const direction = ['me', 'other'] as const;
    for (let m = 0; m < messageCount; m += 1) {
      messageId += 1;
      const author = isAgent ? (m % 2 === 0 ? 'me' : 'agent') : (direction[m % 2] ?? 'me');
      const body =
        author === 'me'
          ? (STARTERS[m % STARTERS.length] ?? '')
          : author === 'agent'
            ? `Tool çağrısı tamamlandı. ${REPLIES[m % REPLIES.length]}`
            : (REPLIES[m % REPLIES.length] ?? '');
      lastTime += fakerTR.number.int({ min: 60_000, max: 4 * 3600 * 1000 });
      const toolCalls =
        author === 'agent'
          ? [
              {
                id: `tc_${messageId}`,
                toolName: 'search_listings',
                args: { city: listing.region.city, limit: 5 },
                status: 'success' as const,
                durationMs: 240,
                result: { count: 5 },
              },
            ]
          : undefined;
      messages.push({
        id: `msg_${messageId}`,
        threadId,
        author,
        body,
        createdAt: new Date(lastTime).toISOString(),
        toolCalls,
        approvedBySeller: author === 'agent' ? true : undefined,
      });
    }

    const last = messages[messages.length - 1];
    threads.push({
      id: threadId,
      listingId: listing.id,
      participantId: isAgent ? `agt_${i}` : `usr_${i}`,
      participantName,
      participantAvatarColor: participantColor,
      isAgent,
      lastMessage: last?.body ?? '',
      lastMessageAt: last?.createdAt ?? new Date(lastTime).toISOString(),
      unreadCount: i % 4 === 0 ? fakerTR.number.int({ min: 1, max: 3 }) : 0,
    });

    messageMap.set(threadId, messages);
  }

  cachedThreads = threads.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  cachedMessages = messageMap;
}

export function getThreads(): ReadonlyArray<Thread> {
  if (!cachedThreads) buildThreads();
  return cachedThreads ?? [];
}

export function getMessagesByThread(threadId: string): ReadonlyArray<Message> {
  if (!cachedMessages) buildThreads();
  return cachedMessages?.get(threadId) ?? [];
}
