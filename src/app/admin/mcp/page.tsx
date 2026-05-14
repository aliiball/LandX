import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import { getMcpClients, getMcpPrompts, getMcpResources, getTools } from '@/mocks/seed/agent';
import { Clipboard, Plug, Radar, ScrollText, ServerCog, Wrench } from 'lucide-react';
import { useMemo } from 'react';

const MCP_URL = 'wss://mcp.landx.test/v1';
const PROTOCOL = '2024-11-05';

const STATUS_TONE = { connected: 'success', idle: 'warning', disconnected: 'danger' } as const;

export default function McpServerPage() {
  const clients = getMcpClients();
  const resources = getMcpResources();
  const prompts = getMcpPrompts();
  const tools = getTools().filter((t) => t.mcpExposed);

  const sparkline = useMemo(() => buildSparkline(60), []);

  return (
    <AdminPage
      surfaceKey="C · /admin/mcp"
      module="A01 MCP Server"
      title="Model Context Protocol Server"
      description="Bağlı clientlar, exposed resources/tools/prompts, transport sağlığı."
      actions={
        <>
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={Clipboard} size={14} />}
            onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(MCP_URL);
              toast.success('MCP URL kopyalandı');
            }}
          >
            {MCP_URL}
          </Button>
          <Button tone="ghost" size="sm" onClick={() => toast.show('Test bağlantı çağrıldı')}>
            Test Bağlantı
          </Button>
        </>
      }
      kpis={[
        {
          label: 'Bağlı Client',
          value: String(clients.filter((c) => c.status === 'connected').length),
          tone: 'lime',
        },
        { label: 'Resource', value: String(resources.length), tone: 'cyan' },
        { label: 'Tool (MCP)', value: String(tools.length), tone: 'violet' },
        { label: 'Prompt Şablonu', value: String(prompts.length), tone: 'amber' },
        { label: 'Protocol', value: PROTOCOL, tone: 'cyan' },
        {
          label: 'Çağrı / 24sa',
          value: clients.reduce((s, c) => s + c.callsLast24h, 0).toLocaleString('tr-TR'),
          tone: 'magenta',
        },
      ]}
    >
      <Tabs
        items={[
          {
            id: 'overview',
            label: 'Genel',
            content: (
              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon icon={Radar} tone="cyan" />
                      <span className="font-medium">60dk aktivite (çağrı/dk)</span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Sparkline data={sparkline} />
                  </CardBody>
                </Card>
                <Card tone="solid">
                  <CardHeader>
                    <span className="font-medium">Endpoint</span>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-2 text-sm">
                    <KV label="URL" value={MCP_URL} mono />
                    <KV label="Protocol" value={PROTOCOL} />
                    <KV label="Transports" value="stdio · sse · http · ws" />
                    <KV label="Auth" value="bearer (tenant)" />
                    <KV label="Discovery TTL" value="60sn" />
                  </CardBody>
                </Card>
              </div>
            ),
          },
          {
            id: 'clients',
            label: `Clientlar (${clients.length})`,
            content: (
              <AdminTable
                title="MCP Clientları"
                columns={[
                  { key: 'name', label: 'İsim' },
                  { key: 'transport', label: 'Transport' },
                  { key: 'protocol', label: 'Protocol' },
                  { key: 'connected', label: 'Bağlı (sn önce)' },
                  { key: 'calls', label: 'Çağrı 24s', align: 'right' },
                  { key: 'status', label: 'Durum' },
                ]}
                rows={clients.map((c) => ({
                  name: (
                    <span className="flex items-center gap-2 font-medium">
                      <Icon icon={Plug} tone="cyan" size={14} />
                      {c.name}
                    </span>
                  ),
                  transport: <span className="font-mono text-xs">{c.transport}</span>,
                  protocol: <span className="font-mono text-xs">{c.protocolVersion}</span>,
                  connected: (
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {ago(c.connectedAt)}
                    </span>
                  ),
                  calls: (
                    <span className="tabular-nums">{c.callsLast24h.toLocaleString('tr-TR')}</span>
                  ),
                  status: (
                    <Badge tone={STATUS_TONE[c.status]} size="sm" dot>
                      {c.status}
                    </Badge>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'tools',
            label: `Tools (${tools.length})`,
            content: (
              <AdminTable
                title="MCP Exposed Tools"
                columns={[
                  { key: 'name', label: 'Ad' },
                  { key: 'scope', label: 'Scope' },
                  { key: 'side', label: 'Yan-etki' },
                  { key: 'blast', label: 'Blast' },
                  { key: 'score', label: 'LLM-okunabilir', align: 'right' },
                  { key: 'signed', label: 'Signed' },
                ]}
                rows={tools.map((t) => ({
                  name: (
                    <span className="flex items-center gap-2">
                      <Icon icon={Wrench} tone="violet" size={14} />
                      <span className="font-mono text-xs">{t.name}</span>
                    </span>
                  ),
                  scope: (
                    <Badge
                      tone={
                        t.scope === 'admin' ? 'danger' : t.scope === 'write' ? 'warning' : 'info'
                      }
                      size="sm"
                    >
                      {t.scope}
                    </Badge>
                  ),
                  side: <span className="text-xs">{t.sideEffect}</span>,
                  blast: <span className="text-xs">{t.blastRadius}</span>,
                  score: <span className="tabular-nums">{t.llmReadabilityScore}</span>,
                  signed: (
                    <Badge tone={t.signed ? 'success' : 'danger'} size="sm">
                      {t.signed ? '✓' : '✗'}
                    </Badge>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'resources',
            label: `Resources (${resources.length})`,
            content: (
              <AdminTable
                title="MCP Resources"
                columns={[
                  { key: 'uri', label: 'URI' },
                  { key: 'name', label: 'İsim' },
                  { key: 'mime', label: 'MIME' },
                  { key: 'desc', label: 'Açıklama' },
                ]}
                rows={resources.map((r) => ({
                  uri: <span className="font-mono text-xs">{r.uri}</span>,
                  name: <span className="font-medium">{r.name}</span>,
                  mime: <span className="font-mono text-xs">{r.mimeType}</span>,
                  desc: (
                    <span className="text-sm text-[var(--text-secondary)]">{r.description}</span>
                  ),
                }))}
              />
            ),
          },
          {
            id: 'prompts',
            label: `Prompts (${prompts.length})`,
            content: (
              <AdminTable
                title="MCP Prompt Templates"
                columns={[
                  { key: 'name', label: 'Ad' },
                  { key: 'desc', label: 'Açıklama' },
                  { key: 'args', label: 'Argümanlar' },
                ]}
                rows={prompts.map((p) => ({
                  name: (
                    <span className="flex items-center gap-2">
                      <Icon icon={ScrollText} tone="amber" size={14} />
                      <span className="font-mono text-xs">{p.name}</span>
                    </span>
                  ),
                  desc: <span className="text-sm">{p.description}</span>,
                  args: <span className="font-mono text-xs">{p.args.join(', ')}</span>,
                }))}
              />
            ),
          },
          {
            id: 'protocol',
            label: 'Protocol',
            content: (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon icon={ServerCog} tone="cyan" />
                    <span className="font-medium">Protocol Spec</span>
                  </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-3 text-sm">
                  <KV label="Version" value={PROTOCOL} mono />
                  <KV label="JSON-RPC" value="2.0" mono />
                  <KV label="Initialize" value="capabilities + serverInfo" />
                  <KV label="Capabilities" value="resources, tools, prompts, sampling, roots" />
                  <KV label="Transport: stdio" value="Process pipe (local)" />
                  <KV label="Transport: sse" value="text/event-stream (HTTP/2)" />
                  <KV label="Transport: ws" value="WebSocket (browser, mobile)" />
                  <KV
                    label="Error codes"
                    value="-32700 parse · -32600 invalid · -32601 not found"
                  />
                </CardBody>
              </Card>
            ),
          },
          {
            id: 'logs',
            label: 'Loglar',
            content: (
              <AdminTable
                title="Son 12 MCP Olay"
                columns={[
                  { key: 'ts', label: 'Zaman' },
                  { key: 'kind', label: 'Olay' },
                  { key: 'detail', label: 'Detay' },
                ]}
                rows={generateMcpLogs().map((l) => ({
                  ts: (
                    <span className="font-mono text-xs">
                      {new Date(l.ts).toLocaleTimeString('tr-TR')}
                    </span>
                  ),
                  kind: (
                    <Badge
                      tone={l.kind === 'error' ? 'danger' : l.kind === 'warn' ? 'warning' : 'info'}
                      size="sm"
                    >
                      {l.kind}
                    </Badge>
                  ),
                  detail: <span className="text-sm">{l.message}</span>,
                }))}
              />
            ),
          },
        ]}
      />
    </AdminPage>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{label}</span>
      <span className={`${mono ? 'font-mono text-sm' : 'text-sm font-medium'}`}>{value}</span>
    </div>
  );
}

function buildSparkline(n: number): number[] {
  return Array.from(
    { length: n },
    (_, i) => 10 + Math.sin(i / 4) * 4 + Math.sin(i / 12) * 6 + (i % 7) * 1.5,
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 90 - 5}`)
    .join(' ');
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-32 w-full"
      role="img"
      aria-label="60dk aktivite sparkline"
    >
      <title>60dk aktivite sparkline</title>
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent-cyan)"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <polyline points={`0,100 ${points} 100,100`} fill="var(--accent-cyan)" opacity={0.08} />
    </svg>
  );
}

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}sn`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}dk`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}sa`;
  return `${Math.round(hr / 24)}g`;
}

function generateMcpLogs() {
  return [
    {
      ts: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'client.connect Claude Desktop transport=stdio',
    },
    {
      ts: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'tool.invoke search_listings (lat=29s)',
    },
    {
      ts: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      kind: 'warn',
      message: 'tool.invoke value_listing latency 1.8s',
    },
    {
      ts: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'resource.read landx://listings (12 items)',
    },
    {
      ts: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      kind: 'error',
      message: 'tool.invoke tkgm_verify E002 timeout',
    },
    {
      ts: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'prompt.execute summarize-listing',
    },
    {
      ts: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'client.connect Cursor transport=http',
    },
    {
      ts: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'tool.invoke get_listing (cache hit)',
    },
    {
      ts: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      kind: 'warn',
      message: 'capabilities/list slow 920ms',
    },
    {
      ts: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'session.heartbeat 5 clients alive',
    },
    {
      ts: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'tool.invoke run_eca (rule: AI cost spike)',
    },
    {
      ts: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      kind: 'info',
      message: 'discovery.refresh 6 resources',
    },
  ] as const;
}
