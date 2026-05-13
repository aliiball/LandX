import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, toast } from '@/components/ui';

const TENANTS = [
  { id: 't_001', name: 'landx-tr', region: 'Marmara', users: 1240, status: 'active', quota: '92%' },
  {
    id: 't_002',
    name: 'karaca-emlak',
    region: 'Marmara',
    users: 24,
    status: 'active',
    quota: '34%',
  },
  { id: 't_003', name: 'ege-arsa', region: 'Ege', users: 86, status: 'active', quota: '12%' },
  { id: 't_004', name: 'bodrum-co', region: 'Ege', users: 12, status: 'suspended', quota: '78%' },
  { id: 't_005', name: 'demo-org', region: 'Akdeniz', users: 3, status: 'trial', quota: '4%' },
];

export default function AdminTenantsPage() {
  return (
    <AdminPage
      surfaceKey="C2 · /admin/tenants"
      module="I01 Tenant Lifecycle"
      title="Tenants"
      description="Provisioning, kota, izolasyon."
      actions={<Button onClick={() => toast.success('Yeni tenant wizard')}>+ Yeni Tenant</Button>}
      kpis={[
        { label: 'Aktif', value: '124', tone: 'lime' },
        { label: 'Trial', value: '8', tone: 'amber' },
        { label: 'Suspended', value: '3', tone: 'magenta' },
        { label: 'Toplam Kullanıcı', value: '12.4K', tone: 'cyan' },
      ]}
    >
      <AdminTable
        title="Tenant listesi"
        columns={[
          { key: 'name', label: 'Tenant' },
          { key: 'region', label: 'Bölge' },
          { key: 'users', label: 'Kullanıcı' },
          { key: 'status', label: 'Durum' },
          { key: 'quota', label: 'Kota' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={TENANTS.map((t) => ({
          name: <span className="font-mono">{t.name}</span>,
          region: t.region,
          users: <span className="tabular-nums">{t.users}</span>,
          status: (
            <Badge
              tone={t.status === 'active' ? 'success' : t.status === 'trial' ? 'warning' : 'danger'}
              size="sm"
            >
              {t.status}
            </Badge>
          ),
          quota: <span className="tabular-nums">{t.quota}</span>,
          actions: (
            <Button size="sm" tone="ghost" onClick={() => toast.show(`${t.name} detay`)}>
              Detay
            </Button>
          ),
        }))}
      />
    </AdminPage>
  );
}
