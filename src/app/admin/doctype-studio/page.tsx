import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Card, CardBody, CardHeader, Icon, Tabs, toast } from '@/components/ui';
import { getDocTypes } from '@/mocks/seed/admin';
import type { DocField, DocType } from '@/types/admin';
import { Boxes, Database, FileCode2, Save, Server, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

const TYPE_TONE: Record<DocField['type'], string> = {
  uuid: 'info',
  string: 'info',
  text: 'info',
  int: 'success',
  decimal: 'success',
  boolean: 'warning',
  datetime: 'warning',
  enum: 'agent',
  jsonb: 'agent',
  vector: 'danger',
  foreign: 'danger',
  file: 'neutral',
};

export default function DocTypeStudioPage() {
  const docs = getDocTypes();
  const [selectedId, setSelectedId] = useState(docs[0]?.id ?? '');
  const selected = docs.find((d) => d.id === selectedId) ?? docs[0];
  if (!selected) return null;

  return (
    <AdminPage
      surfaceKey="C · /admin/doctype-studio"
      module="K02 DocType Studio"
      title="DocType Studio"
      description="Şema tanımı → SQL · REST API · Admin UI · MCP araç şeması — tek kaynaktan otomatik üretim."
      actions={
        <>
          <Button
            tone="ghost"
            size="sm"
            leftIcon={<Icon icon={Wand2} size={14} />}
            onClick={() => toast.agent('AI ile alan önerileri üretildi')}
          >
            AI alan öner
          </Button>
          <Button
            tone="primary"
            size="sm"
            leftIcon={<Icon icon={Save} size={14} />}
            onClick={() => toast.success(`${selected.name} taslak olarak kaydedildi`)}
          >
            Kaydet
          </Button>
          <Button
            tone="agent"
            size="sm"
            leftIcon={<Icon icon={Server} size={14} />}
            onClick={() => toast.agent(`${selected.name} deploy başlatıldı (mock)`)}
          >
            Deploy
          </Button>
        </>
      }
      kpis={[
        { label: 'DocType', value: String(docs.length), tone: 'violet' },
        {
          label: 'Yayında',
          value: String(docs.filter((d) => d.status === 'published').length),
          tone: 'lime',
        },
        {
          label: 'Taslak',
          value: String(docs.filter((d) => d.status === 'draft').length),
          tone: 'amber',
        },
        {
          label: 'Alan toplam',
          value: String(docs.reduce((s, d) => s + d.fields.length, 0)),
          tone: 'cyan',
        },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card>
          <CardHeader>
            <span className="font-medium">DocTypes</span>
            <Button size="sm" tone="ghost" onClick={() => toast.show('Yeni DocType oluştur')}>
              + Yeni
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-1">
            {docs.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedId(d.id)}
                className={`flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition-colors ${
                  d.id === selectedId
                    ? 'border border-[var(--accent-cyan)] bg-[var(--surface-elevated)]'
                    : 'border border-transparent hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon icon={Boxes} size={14} tone="cyan" />
                  {d.name}
                </span>
                <Badge tone={d.status === 'published' ? 'success' : 'warning'} size="sm">
                  {d.status}
                </Badge>
              </button>
            ))}
          </CardBody>
        </Card>

        <div className="flex flex-col gap-3">
          <Card tone="solid">
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">{selected.name}</span>
                <span className="text-sm text-[var(--text-secondary)]">{selected.description}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge tone="info" size="sm">
                  {selected.fields.length} alan
                </Badge>
                <Badge tone={selected.status === 'published' ? 'success' : 'warning'} size="sm">
                  {selected.status}
                </Badge>
              </div>
            </CardBody>
          </Card>

          <Tabs
            items={[
              { id: 'fields', label: 'Fields', content: <FieldsTab fields={selected.fields} /> },
              { id: 'sql', label: 'SQL', content: <SqlPreview doc={selected} /> },
              { id: 'api', label: 'REST API', content: <ApiPreview doc={selected} /> },
              { id: 'admin', label: 'Admin UI', content: <AdminPreview doc={selected} /> },
              { id: 'mcp', label: 'MCP Tool', content: <McpPreview doc={selected} /> },
            ]}
          />
        </div>
      </div>
    </AdminPage>
  );
}

function FieldsTab({ fields }: { fields: DocField[] }) {
  return (
    <AdminTable
      title="Alanlar"
      columns={[
        { key: 'name', label: 'Ad' },
        { key: 'type', label: 'Tip' },
        { key: 'flags', label: 'Flags' },
        { key: 'ref', label: 'Referans' },
        { key: 'ai', label: 'AI/MCP' },
      ]}
      rows={fields.map((f) => ({
        name: <span className="font-mono text-sm">{f.name}</span>,
        type: (
          <Badge tone={TYPE_TONE[f.type] as 'info'} size="sm">
            {f.type}
          </Badge>
        ),
        flags: (
          <div className="flex flex-wrap gap-1">
            {f.required && (
              <Badge size="sm" tone="danger">
                required
              </Badge>
            )}
            {f.unique && (
              <Badge size="sm" tone="warning">
                unique
              </Badge>
            )}
            {f.indexed && (
              <Badge size="sm" tone="info">
                indexed
              </Badge>
            )}
          </div>
        ),
        ref: f.refDocType ? (
          <span className="font-mono text-xs">→ {f.refDocType}</span>
        ) : f.vectorDim ? (
          <span className="font-mono text-xs">dim={f.vectorDim}</span>
        ) : f.enumValues ? (
          <span className="text-xs text-[var(--text-tertiary)]">{f.enumValues.length} değer</span>
        ) : (
          <span className="text-xs text-[var(--text-tertiary)]">—</span>
        ),
        ai: (
          <div className="flex gap-1">
            {f.aiExposed && (
              <Badge size="sm" tone="agent">
                AI
              </Badge>
            )}
            {f.mcpExposed && (
              <Badge size="sm" tone="info">
                MCP
              </Badge>
            )}
          </div>
        ),
      }))}
    />
  );
}

function SqlPreview({ doc }: { doc: DocType }) {
  const lines = [
    `CREATE TABLE ${snake(doc.name)} (`,
    ...doc.fields.map((f, i) => {
      const t = sqlType(f);
      const constraints = [f.required ? 'NOT NULL' : null, f.unique ? 'UNIQUE' : null]
        .filter(Boolean)
        .join(' ');
      return `  ${f.name} ${t}${constraints ? ` ${constraints}` : ''}${i === doc.fields.length - 1 ? '' : ','}`;
    }),
    ');',
    ...doc.fields
      .filter((f) => f.indexed && !f.unique)
      .map(
        (f) => `CREATE INDEX idx_${snake(doc.name)}_${f.name} ON ${snake(doc.name)} (${f.name});`,
      ),
  ];
  return <CodeBlock lang="sql" lines={lines} icon={Database} />;
}

function ApiPreview({ doc }: { doc: DocType }) {
  const name = snake(doc.name);
  return (
    <CodeBlock
      lang="openapi"
      icon={FileCode2}
      lines={[
        `GET    /api/${name}            // list (paginated)`,
        `POST   /api/${name}            // create`,
        `GET    /api/${name}/:id        // detail`,
        `PATCH  /api/${name}/:id        // partial update`,
        `DELETE /api/${name}/:id        // soft-delete`,
        '',
        '# Schema (request body):',
        '{',
        ...doc.fields
          .filter((f) => f.name !== 'id')
          .map((f) => `  "${f.name}": ${exampleValue(f)}${f.required ? ' // required' : ''},`),
        '}',
      ]}
    />
  );
}

function AdminPreview({ doc }: { doc: DocType }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon={Sparkles} tone="violet" />
          <span className="font-medium">Otomatik Admin UI — Form Generator önizleme</span>
        </div>
      </CardHeader>
      <CardBody className="grid gap-3 sm:grid-cols-2">
        {doc.fields
          .filter((f) => f.name !== 'id')
          .map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {f.name}
                </span>
                <Badge tone={TYPE_TONE[f.type] as 'info'} size="sm">
                  {f.type}
                </Badge>
              </div>
              <div className="h-9 rounded-[var(--radius-md)] border border-[var(--stroke-subtle)] bg-[var(--surface-base)]" />
              <span className="text-xs text-[var(--text-tertiary)]">
                {f.aiExposed ? 'AI tarafından erişilebilir' : 'AI kapsam dışı'}
              </span>
            </div>
          ))}
      </CardBody>
    </Card>
  );
}

function McpPreview({ doc }: { doc: DocType }) {
  const tools = [
    `${doc.name}_list`,
    `${doc.name}_get`,
    `${doc.name}_create`,
    `${doc.name}_update`,
  ].map((n) => n.toLowerCase());

  return (
    <CodeBlock
      lang="mcp"
      icon={Server}
      lines={[
        `# MCP tool schema — auto-generated for ${doc.name}`,
        '{',
        '  "tools": [',
        ...tools.map(
          (t, i) =>
            `    { "name": "${t}", "description": "${doc.description}", "inputSchema": {...} }${i === tools.length - 1 ? '' : ','}`,
        ),
        '  ],',
        '  "exposed_fields": [',
        ...doc.fields
          .filter((f) => f.mcpExposed)
          .map((f, i, a) => `    "${f.name}"${i === a.length - 1 ? '' : ','}`),
        '  ]',
        '}',
      ]}
    />
  );
}

function CodeBlock({
  lang,
  lines,
  icon,
}: {
  lang: string;
  lines: ReadonlyArray<string>;
  icon: typeof Database;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon={icon} tone="cyan" />
          <span className="font-mono text-xs uppercase tracking-widest">{lang}</span>
        </div>
        <Button size="sm" tone="ghost" onClick={() => toast.show('Kopyalandı')}>
          Kopyala
        </Button>
      </CardHeader>
      <CardBody>
        <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface-base)] p-3 font-mono text-xs leading-relaxed">
          {lines.join('\n')}
        </pre>
      </CardBody>
    </Card>
  );
}

function snake(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

function sqlType(f: DocField): string {
  switch (f.type) {
    case 'uuid':
      return 'UUID PRIMARY KEY';
    case 'string':
      return 'TEXT';
    case 'text':
      return 'TEXT';
    case 'int':
      return 'INTEGER';
    case 'decimal':
      return 'NUMERIC(12,2)';
    case 'boolean':
      return 'BOOLEAN';
    case 'datetime':
      return 'TIMESTAMPTZ';
    case 'enum':
      return `TEXT CHECK (${f.name} IN (${(f.enumValues ?? []).map((v) => `'${v}'`).join(', ')}))`;
    case 'jsonb':
      return 'JSONB';
    case 'vector':
      return `VECTOR(${f.vectorDim ?? 1536})`;
    case 'foreign':
      return `UUID REFERENCES ${snake(f.refDocType ?? 'unknown')}(id)`;
    case 'file':
      return 'TEXT';
  }
}

function exampleValue(f: DocField): string {
  switch (f.type) {
    case 'uuid':
      return '"uuid-here"';
    case 'string':
    case 'text':
      return `"..."`;
    case 'int':
      return '0';
    case 'decimal':
      return '0.00';
    case 'boolean':
      return 'false';
    case 'datetime':
      return '"2026-05-14T12:00:00Z"';
    case 'enum':
      return `"${(f.enumValues ?? ['enum'])[0]}"`;
    case 'jsonb':
      return '{}';
    case 'vector':
      return `[${(f.vectorDim ?? 1536) > 4 ? '...' : '0,0'}]`;
    case 'foreign':
      return '"foreign-uuid"';
    case 'file':
      return '"s3://path"';
  }
}
