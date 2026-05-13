import type { PersonaKey } from '@/lib/auth/personas';
import { PERSONA_USER_FIXTURES } from '@/mocks/seed/personas';
import type { HttpHandler } from 'msw';
import { http, HttpResponse, delay } from 'msw';

// Phase 0 ships with a tiny handler set — enough to prove the worker boots and
// `/api/me` reflects the active persona. More handlers land per phase.

export const handlers: HttpHandler[] = [
  http.get('/api/health', async () => {
    await delay(50);
    return HttpResponse.json({ status: 'ok', mode: 'msw-mock', ts: Date.now() });
  }),

  http.get('/api/me', async ({ request }) => {
    await delay(80 + Math.floor(Math.random() * 160));
    const url = new URL(request.url);
    const personaParam = url.searchParams.get('persona');
    const personaKey = (
      personaParam && personaParam in PERSONA_USER_FIXTURES ? personaParam : 'buyer'
    ) as PersonaKey;
    return HttpResponse.json(PERSONA_USER_FIXTURES[personaKey]);
  }),
];
