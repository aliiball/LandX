import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, toast } from '@/components/ui';

const DOCTYPES = [
  { slug: 'listing', name: 'Listing', fields: 24, tools: 6, version: 'v12' },
  { slug: 'broker', name: 'Broker', fields: 18, tools: 4, version: 'v8' },
  { slug: 'lead', name: 'Lead', fields: 16, tools: 5, version: 'v6' },
  { slug: 'client', name: 'Client', fields: 12, tools: 2, version: 'v4' },
  { slug: 'commission', name: 'Commission', fields: 10, tools: 1, version: 'v3' },
];

export default function AdminDocTypesPage() {
  return (
    <AdminPage
      surfaceKey="C6 · /admin/doctypes"
      module="K02 DocType Engine"
      title="DocTypes"
      description="Şema editörü — alan + validation + MCP tool toggle."
      actions={<Button onClick={() => toast.success('DocType wizard')}>+ Yeni DocType</Button>}
      kpis={[
        { label: 'DocType', value: '12', tone: 'cyan' },
        { label: 'Alan toplam', value: '187', tone: 'lime' },
        { label: 'MCP tool', value: '34', tone: 'violet' },
        { label: 'Migration', value: '3 bekleyen', tone: 'amber' },
      ]}
    >
      <AdminTable
        columns={[
          { key: 'name', label: 'DocType' },
          { key: 'fields', label: 'Alan' },
          { key: 'tools', label: 'Tool' },
          { key: 'version', label: 'Sürüm' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={DOCTYPES.map((d) => ({
          name: (
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="font-mono text-xs text-[var(--text-tertiary)]">/{d.slug}</p>
            </div>
          ),
          fields: <span className="tabular-nums">{d.fields}</span>,
          tools: <span className="tabular-nums">{d.tools}</span>,
          version: (
            <Badge tone="info" size="sm">
              {d.version}
            </Badge>
          ),
          actions: (
            <Button size="sm" tone="ghost" onClick={() => toast.show(`${d.name} schema editor`)}>
              Editor
            </Button>
          ),
        }))}
      />
    </AdminPage>
  );
}
