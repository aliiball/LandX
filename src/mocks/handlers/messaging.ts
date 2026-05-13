import { getMessagesByThread, getThreads } from '@/mocks/seed/conversations';
import { getAlerts, getNotifications } from '@/mocks/seed/notifications';
import { http, HttpResponse, delay } from 'msw';

export const messagingHandlers = [
  http.get('/api/threads', async () => {
    await delay(100);
    return HttpResponse.json({ items: getThreads() });
  }),

  http.get('/api/threads/:id/messages', async ({ params }) => {
    await delay(80);
    const id = String(params.id);
    return HttpResponse.json({ items: getMessagesByThread(id) });
  }),

  http.post('/api/threads/:id/messages', async ({ request, params }) => {
    await delay(140);
    const body = (await request.json()) as { body: string };
    const id = String(params.id);
    return HttpResponse.json({
      id: `msg_${Date.now()}`,
      threadId: id,
      author: 'me',
      body: body.body,
      createdAt: new Date().toISOString(),
    });
  }),

  http.get('/api/notifications', async () => {
    await delay(80);
    return HttpResponse.json({ items: getNotifications() });
  }),

  http.get('/api/alerts', async () => {
    await delay(80);
    return HttpResponse.json({ items: getAlerts() });
  }),
];
