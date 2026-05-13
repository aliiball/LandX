import {
  getBrokerClients,
  getBrokerCommissions,
  getBrokerLeads,
  getBrokerShowcase,
  getBrokerTeam,
} from '@/mocks/seed/broker';
import { http, HttpResponse, delay } from 'msw';

export const brokerHandlers = [
  http.get('/api/broker/leads', async () => {
    await delay(90);
    return HttpResponse.json({ items: getBrokerLeads() });
  }),
  http.get('/api/broker/clients', async () => {
    await delay(90);
    return HttpResponse.json({ items: getBrokerClients() });
  }),
  http.get('/api/broker/commissions', async () => {
    await delay(90);
    return HttpResponse.json({ items: getBrokerCommissions() });
  }),
  http.get('/api/broker/team', async () => {
    await delay(80);
    return HttpResponse.json({ items: getBrokerTeam() });
  }),
  http.get('/api/broker/showcase', async () => {
    await delay(80);
    return HttpResponse.json(getBrokerShowcase());
  }),
];
