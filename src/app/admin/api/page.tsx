import { AdminPage } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, toast } from '@/components/ui';

const ENDPOINTS = [
  { method: 'GET', path: '/api/listings', module: 'S06', mcp: 'search.execute' },
  { method: 'GET', path: '/api/listings/:id', module: 'S06', mcp: 'listing.read' },
  { method: 'POST', path: '/api/listings', module: 'A05', mcp: 'listing.create' },
  { method: 'GET', path: '/api/broker/leads', module: 'R-04', mcp: 'broker.leads.list' },
  { method: 'POST', path: '/api/valuation', module: 'A02', mcp: 'valuation.estimate' },
  { method: 'GET', path: '/api/agent/traces', module: 'A08', mcp: 'observability.trace' },
];

export default function AdminApiPage() {
  return (
    <AdminPage
      surfaceKey="C10 · /admin/api"
      module="S01 Auto REST API"
      title="API Explorer"
      description="OpenAPI viewer — her endpoint için MCP eşleniği."
      actions={<Button onClick={() => toast.success('OpenAPI YAML indirildi')}>YAML indir</Button>}
      kpis={[
        { label: 'Endpoint', value: '124', tone: 'cyan' },
        { label: 'MCP tool eşleşmiş', value: '118', tone: 'lime' },
        { label: 'Çağrı/dk', value: '1.2K', tone: 'violet' },
        { label: 'p95', value: '212ms', tone: 'amber' },
      ]}
    >
      <Card>
        <CardHeader>
          <span className="font-medium">Endpoint'ler</span>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {ENDPOINTS.map((e) => (
            <div
              key={e.path}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Badge tone={e.method === 'GET' ? 'info' : 'agent'} size="sm">
                  {e.method}
                </Badge>
                <span className="font-mono text-sm">{e.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="neutral" size="sm">
                  {e.module}
                </Badge>
                <Badge tone="violet" size="sm">
                  {e.mcp}
                </Badge>
                <Button size="sm" tone="ghost" onClick={() => toast.show(`${e.path} try-it-out`)}>
                  Try
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </AdminPage>
  );
}
