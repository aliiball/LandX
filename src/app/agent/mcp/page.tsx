import { AgentPage } from '@/components/admin/AgentPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const TRANSPORTS = [
  { id: 'mcp_stdio', kind: 'stdio', uptime: '99.8%', handshake: '12 dk', status: 'OK' },
  { id: 'mcp_sse', kind: 'sse', uptime: '99.9%', handshake: '4 dk', status: 'OK' },
  { id: 'mcp_http', kind: 'streaming-http', uptime: '99.7%', handshake: '2 dk', status: 'OK' },
  { id: 'mcp_ws', kind: 'websocket', uptime: '98.4%', handshake: '14 dk', status: 'warn' },
];

export default function AgentMcpPage() {
  return (
    <AgentPage
      surfaceKey="D2 · /agent/mcp"
      module="A01 MCP Server"
      title="MCP Transports"
      description="stdio / sse / streaming-http / websocket sağlık göstergeleri."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {TRANSPORTS.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div>
                <p className="font-mono text-xs text-[var(--text-tertiary)]">{t.id}</p>
                <p className="font-medium">{t.kind}</p>
              </div>
              <Badge tone={t.status === 'OK' ? 'success' : 'warning'} size="sm" dot>
                {t.status}
              </Badge>
            </CardHeader>
            <CardBody className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Uptime</p>
                <p className="font-mono tabular-nums">{t.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Son handshake</p>
                <p className="font-mono tabular-nums">{t.handshake}</p>
              </div>
            </CardBody>
            <CardBody className="border-t border-[var(--stroke-subtle)] pt-3">
              <Button
                size="sm"
                tone="ghost"
                onClick={() => toast.success(`${t.id} test edildi — handshake OK`)}
              >
                Test bağlantı
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </AgentPage>
  );
}
