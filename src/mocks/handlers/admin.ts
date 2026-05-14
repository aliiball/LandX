import {
  getApiEndpoints,
  getAuditChainStatus,
  getAuditEvents,
  getComplianceControls,
  getCompliancePosture,
  getConfigEntries,
  getDocTypes,
  getDsarRequests,
  getEcaEvents,
  getEcaRules,
  getFeatureFlags,
  getLogs,
  getModules,
  getPendingActions,
  getPiiFields,
  getPlugins,
  getRiskEvents,
  getSecurityFindings,
  getSlos,
  getTenants,
  getTkgmQueries,
  getTraces,
  getUserMfa,
  getWorkflows,
} from '@/mocks/seed/admin';
import type { TkgmStatusCode } from '@/types/tkgm';
import type { HttpHandler } from 'msw';
import { http, HttpResponse, delay } from 'msw';

export const adminHandlers: HttpHandler[] = [
  http.get('/api/admin/tenants', async () => {
    await delay(120);
    return HttpResponse.json({ items: getTenants() });
  }),

  http.get('/api/admin/audit', async ({ request }) => {
    await delay(160);
    const url = new URL(request.url);
    const sev = url.searchParams.get('severity');
    const principalType = url.searchParams.get('principalType');
    const q = url.searchParams.get('q')?.toLowerCase();
    let items = getAuditEvents().slice();
    if (sev) items = items.filter((e) => e.severity === sev);
    if (principalType) items = items.filter((e) => e.principalType === principalType);
    if (q)
      items = items.filter(
        (e) => e.action.includes(q) || e.principalLabel.toLowerCase().includes(q),
      );
    return HttpResponse.json({ items: items.slice(0, 200), total: items.length });
  }),

  http.post('/api/admin/audit/verify', async () => {
    await delay(800);
    return HttpResponse.json(getAuditChainStatus());
  }),

  http.get('/api/admin/eca/rules', async () => {
    await delay(120);
    return HttpResponse.json({ items: getEcaRules() });
  }),

  http.get('/api/admin/eca/events', async () => {
    await delay(100);
    return HttpResponse.json({ items: getEcaEvents() });
  }),

  http.post('/api/admin/eca/rules/:id/toggle', async ({ params }) => {
    await delay(160);
    return HttpResponse.json({ id: String(params.id), enabled: true });
  }),

  http.get('/api/admin/tkgm/queries', async () => {
    await delay(160);
    return HttpResponse.json({ items: getTkgmQueries() });
  }),

  http.get('/api/admin/tkgm/breakdown', async () => {
    await delay(80);
    const items = getTkgmQueries();
    const counts: Record<TkgmStatusCode, number> = {
      OK: 0,
      E001: 0,
      E002: 0,
      E003: 0,
      E099: 0,
    };
    for (const q of items) counts[q.status] += 1;
    return HttpResponse.json({
      total: items.length,
      counts,
      avgLatency: Math.round(items.reduce((s, q) => s + q.latencyMs, 0) / items.length),
    });
  }),

  http.post('/api/admin/tkgm/verify', async ({ request }) => {
    await delay(700);
    const body = (await request.json().catch(() => ({}))) as {
      il?: string;
      ada?: string;
      parsel?: string;
    };
    // Mock yön: ada 0000 → E001, parsel 999 → E002, ada 7777 → E003
    const status: TkgmStatusCode =
      body.ada === '0000'
        ? 'E001'
        : body.parsel === '999'
          ? 'E002'
          : body.ada === '7777'
            ? 'E003'
            : 'OK';
    return HttpResponse.json({
      status,
      ada: body.ada ?? '0001',
      parsel: body.parsel ?? '1',
      il: body.il ?? 'İstanbul',
      result:
        status === 'OK'
          ? {
              yuzolcumu: 4200,
              nitelik: 'Arsa',
              malSahipleri: [{ adSoyad: 'Ali Demir', hisseOran: 100 }],
            }
          : undefined,
      errorMessage:
        status === 'E001'
          ? 'Geçersiz ada/parsel'
          : status === 'E002'
            ? 'TKGM 504'
            : status === 'E003'
              ? 'Rate-limit'
              : undefined,
    });
  }),

  http.get('/api/admin/pii/fields', async () => {
    await delay(120);
    return HttpResponse.json({ items: getPiiFields() });
  }),

  http.get('/api/admin/pii/dsar', async () => {
    await delay(120);
    return HttpResponse.json({ items: getDsarRequests() });
  }),

  http.get('/api/admin/compliance/controls', async () => {
    await delay(120);
    return HttpResponse.json({ items: getComplianceControls(), posture: getCompliancePosture() });
  }),

  http.get('/api/admin/slo', async () => {
    await delay(120);
    return HttpResponse.json({ items: getSlos() });
  }),

  http.get('/api/admin/traces', async () => {
    await delay(120);
    return HttpResponse.json({ items: getTraces() });
  }),

  http.get('/api/admin/logs', async () => {
    await delay(120);
    return HttpResponse.json({ items: getLogs() });
  }),

  http.get('/api/admin/flags', async () => {
    await delay(80);
    return HttpResponse.json({ items: getFeatureFlags() });
  }),

  http.patch('/api/admin/flags/:key', async ({ params }) => {
    await delay(140);
    return HttpResponse.json({ key: String(params.key), state: 'on' });
  }),

  http.get('/api/admin/config', async () => {
    await delay(80);
    return HttpResponse.json({ items: getConfigEntries() });
  }),

  http.get('/api/admin/api-endpoints', async () => {
    await delay(80);
    return HttpResponse.json({ items: getApiEndpoints() });
  }),

  http.get('/api/admin/modules', async () => {
    await delay(80);
    return HttpResponse.json({ items: getModules() });
  }),

  http.get('/api/admin/workflows', async () => {
    await delay(80);
    return HttpResponse.json({ items: getWorkflows() });
  }),

  http.get('/api/admin/doctypes', async () => {
    await delay(100);
    return HttpResponse.json({ items: getDocTypes() });
  }),

  http.get('/api/admin/auth/mfa', async () => {
    await delay(120);
    return HttpResponse.json({ items: getUserMfa() });
  }),

  http.get('/api/admin/auth/risk-events', async () => {
    await delay(120);
    return HttpResponse.json({ items: getRiskEvents() });
  }),

  http.get('/api/admin/plugins', async () => {
    await delay(120);
    return HttpResponse.json({ items: getPlugins() });
  }),

  http.get('/api/admin/security/findings', async () => {
    await delay(120);
    return HttpResponse.json({ items: getSecurityFindings() });
  }),

  http.get('/api/admin/home/pending', async () => {
    await delay(60);
    return HttpResponse.json({ items: getPendingActions() });
  }),
];
