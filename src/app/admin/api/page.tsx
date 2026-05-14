import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, toast } from '@/components/ui';
import { getApiEndpoints } from '@/mocks/seed/admin';
import type { HttpMethod } from '@/types/admin';
import { FileDown, PlayCircle } from 'lucide-react';
import { useState } from 'react';

const METHOD_TONE: Record<HttpMethod, 'info' | 'success' | 'warning' | 'danger' | 'agent'> = {
  GET: 'success',
  POST: 'info',
  PUT: 'warning',
  PATCH: 'warning',
  DELETE: 'danger',
};

const SCOPE_TONE = {
  public: 'success',
  tenant: 'info',
  admin: 'danger',
  agent: 'agent',
} as const;

export default function AdminApiPage() {
  const endpoints = getApiEndpoints();
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id ?? '');
  const selected = endpoints.find((e) => e.id === selectedId) ?? endpoints[0];
  if (!selected) return null;

  return (
    <AdminPage
      surfaceKey="C · /admin/api"
      module="S01 API Explorer"
      title="API Explorer"
      description="OpenAPI uyumlu endpoint katalog · try-it console · rate-limit · MCP eşleniği."
      actions={
        <Button
          tone="ghost"
          size="sm"
          leftIcon={<Icon icon={FileDown} size={14} />}
          onClick={() => toast.success('OpenAPI YAML indirildi')}
        >
          YAML
        </Button>
      }
      kpis={[
        { label: 'Endpoint', value: String(endpoints.length), tone: 'cyan' },
        {
          label: 'Public',
          value: String(endpoints.filter((e) => e.authScope === 'public').length),
          tone: 'lime',
        },
        {
          label: 'Admin',
          value: String(endpoints.filter((e) => e.authScope === 'admin').length),
          tone: 'magenta',
        },
        { label: 'Rate-limit ortl.', value: '60/dk', tone: 'amber' },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <AdminTable
          title="Endpointler"
          columns={[
            { key: 'method', label: 'Method' },
            { key: 'path', label: 'Path' },
            { key: 'summary', label: 'Açıklama' },
            { key: 'scope', label: 'Scope' },
            { key: 'rate', label: 'Rate-limit', align: 'right' },
            { key: 'action', label: '', align: 'right' },
          ]}
          rows={endpoints.map((e) => ({
            method: (
              <Badge tone={METHOD_TONE[e.method]} size="sm">
                {e.method}
              </Badge>
            ),
            path: <span className="font-mono text-xs">{e.path}</span>,
            summary: <span className="text-sm">{e.summary}</span>,
            scope: (
              <Badge tone={SCOPE_TONE[e.authScope]} size="sm">
                {e.authScope}
              </Badge>
            ),
            rate: <span className="text-xs">{e.rateLimit}</span>,
            action: (
              <Button
                size="sm"
                tone="ghost"
                leftIcon={<Icon icon={PlayCircle} size={14} />}
                onClick={() => {
                  setSelectedId(e.id);
                  toast.show(`${e.method} ${e.path} seçildi`);
                }}
              >
                Try
              </Button>
            ),
          }))}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge tone={METHOD_TONE[selected.method]} size="sm">
                {selected.method}
              </Badge>
              <span className="font-mono text-sm">{selected.path}</span>
            </div>
            <Button
              tone="primary"
              size="sm"
              onClick={() => toast.success(`${selected.path} → 200 OK (mock)`)}
            >
              Çağır
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 text-sm">
            <p className="text-[var(--text-secondary)]">{selected.summary}</p>
            <KV label="Auth scope" value={selected.authScope} />
            <KV label="Rate-limit" value={selected.rateLimit} />
            {selected.errorCodes && selected.errorCodes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  Hata kodları:
                </span>
                {selected.errorCodes.map((c) => (
                  <Badge key={c} size="sm" tone="warning">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
            <Section title="Request body">
              <Code>{selected.exampleRequest ?? '// Body gerekmez'}</Code>
            </Section>
            <Section title="Response">
              <Code>{selected.exampleResponse ?? '{ "ok": true }'}</Code>
            </Section>
          </CardBody>
        </Card>
      </div>
    </AdminPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{title}</span>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface-base)] p-3 font-mono text-xs">
      {children}
    </pre>
  );
}
