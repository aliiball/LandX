import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Select, toast } from '@/components/ui';
import { useState } from 'react';

const USERS = [
  {
    id: 'u_001',
    name: 'Ali Demir',
    type: 'human',
    subtype: 'individual',
    tenant: 'landx-tr',
    last: '2 dk',
  },
  {
    id: 'u_002',
    name: 'Karaca İsmail',
    type: 'human',
    subtype: 'broker-admin',
    tenant: 'karaca-emlak',
    last: '12 dk',
  },
  {
    id: 'u_003',
    name: 'Selin Demir',
    type: 'human',
    subtype: 'broker-agent',
    tenant: 'karaca-emlak',
    last: '1 saat',
  },
  {
    id: 'u_004',
    name: 'Search Bot',
    type: 'agent',
    subtype: 'system-operator',
    tenant: 'landx-tr',
    last: '8 sn',
  },
  {
    id: 'u_005',
    name: 'Valuation Bot',
    type: 'agent',
    subtype: 'system-operator',
    tenant: 'landx-tr',
    last: '14 sn',
  },
  {
    id: 'u_006',
    name: 'Migration Service',
    type: 'service',
    subtype: 'system-operator',
    tenant: 'landx-tr',
    last: '3 saat',
  },
];

export default function AdminUsersPage() {
  const [filter, setFilter] = useState('all');
  const rows = USERS.filter((u) => filter === 'all' || u.type === filter);

  return (
    <AdminPage
      surfaceKey="C3 · /admin/users"
      module="I02 User & Identity"
      title="Users (polymorphic)"
      description="human / agent / system / service ayrımı."
      actions={
        <Select
          size="sm"
          options={[
            { value: 'all', label: 'Tümü' },
            { value: 'human', label: 'Human' },
            { value: 'agent', label: 'Agent' },
            { value: 'service', label: 'Service' },
          ]}
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
      }
      kpis={[
        { label: 'Human', value: '2.1K', tone: 'cyan' },
        { label: 'Agent', value: '128', tone: 'violet' },
        { label: 'Service', value: '24', tone: 'lime' },
        { label: 'Aktif (24h)', value: '1.8K', tone: 'amber' },
      ]}
    >
      <AdminTable
        title="Kullanıcılar"
        columns={[
          { key: 'name', label: 'Ad' },
          { key: 'type', label: 'Tip' },
          { key: 'subtype', label: 'Alt-tip' },
          { key: 'tenant', label: 'Tenant' },
          { key: 'last', label: 'Son aktivite' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={rows.map((u) => ({
          name: <span className="font-medium">{u.name}</span>,
          type: (
            <Badge
              tone={u.type === 'human' ? 'info' : u.type === 'agent' ? 'agent' : 'neutral'}
              size="sm"
            >
              {u.type}
            </Badge>
          ),
          subtype: <span className="font-mono text-xs">{u.subtype}</span>,
          tenant: <span className="font-mono text-xs">{u.tenant}</span>,
          last: <span className="text-xs text-[var(--text-tertiary)]">{u.last}</span>,
          actions: (
            <Button size="sm" tone="ghost" onClick={() => toast.show(`${u.name} detay`)}>
              Görüntüle
            </Button>
          ),
        }))}
      />
    </AdminPage>
  );
}
