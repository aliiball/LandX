import {
  getAgentRuns,
  getConversations,
  getLlmProviders,
  getMcpClients,
  getMcpPrompts,
  getMcpResources,
  getMemoryEntries,
  getPromptTemplates,
  getTools,
  getVectorIndexes,
} from '@/mocks/seed/agent';
import type { HttpHandler } from 'msw';
import { http, HttpResponse, delay } from 'msw';

export const agentHandlers: HttpHandler[] = [
  http.get('/api/agent/mcp/clients', async () => {
    await delay(120);
    return HttpResponse.json({
      items: getMcpClients(),
      protocolVersion: '2024-11-05',
      endpoint: 'wss://mcp.landx.test/v1',
    });
  }),
  http.get('/api/agent/mcp/resources', async () => {
    await delay(100);
    return HttpResponse.json({ items: getMcpResources() });
  }),
  http.get('/api/agent/mcp/prompts', async () => {
    await delay(100);
    return HttpResponse.json({ items: getMcpPrompts() });
  }),
  http.get('/api/agent/tools', async () => {
    await delay(100);
    return HttpResponse.json({ items: getTools() });
  }),
  http.get('/api/agent/memory', async () => {
    await delay(100);
    return HttpResponse.json({ items: getMemoryEntries() });
  }),
  http.get('/api/agent/vectors', async () => {
    await delay(100);
    return HttpResponse.json({ items: getVectorIndexes() });
  }),
  http.get('/api/agent/providers', async () => {
    await delay(120);
    return HttpResponse.json({ items: getLlmProviders() });
  }),
  http.get('/api/agent/prompts', async () => {
    await delay(120);
    return HttpResponse.json({ items: getPromptTemplates() });
  }),
  http.get('/api/agent/runs', async () => {
    await delay(120);
    return HttpResponse.json({ items: getAgentRuns() });
  }),
  http.get('/api/agent/conversations', async () => {
    await delay(120);
    return HttpResponse.json({ items: getConversations() });
  }),
];
