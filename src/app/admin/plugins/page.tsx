import { AdminPage, AdminTable } from '@/components/admin/AdminPage';
import { Badge, Button, Icon, toast } from '@/components/ui';
import { Box, Download, Trash2 } from 'lucide-react';

const PLUGINS = [
  { id: 'pl_001', name: '@landx/listings-core', version: '2.4.1', status: 'active', health: 'OK' },
  { id: 'pl_002', name: '@landx/valuation-ai', version: '1.3.0', status: 'active', health: 'OK' },
  { id: 'pl_003', name: '@landx/kvkk-suite', version: '0.9.4', status: 'active', health: 'OK' },
  { id: 'pl_004', name: '@landx/broker-crm', version: '1.0.2', status: 'active', health: 'warn' },
  {
    id: 'pl_005',
    name: '@landx/maplibre-layers',
    version: '0.6.1',
    status: 'inactive',
    health: '—',
  },
];

export default function AdminPluginsPage() {
  return (
    <AdminPage
      surfaceKey="C5 · /admin/plugins"
      module="K01 + O02"
      title="Plugins & Marketplace"
      actions={
        <Button
          leftIcon={<Icon icon={Box} size={14} />}
          onClick={() => toast.success('Marketplace açıldı')}
        >
          Marketplace
        </Button>
      }
      kpis={[
        { label: 'Yüklü', value: '24', tone: 'cyan' },
        { label: 'Aktif', value: '22', tone: 'lime' },
        { label: 'Uyarı', value: '1', tone: 'amber' },
        { label: 'Hata', value: '0', tone: 'lime' },
      ]}
    >
      <AdminTable
        title="Yüklü plugin'ler"
        columns={[
          { key: 'name', label: 'Paket' },
          { key: 'version', label: 'Sürüm' },
          { key: 'status', label: 'Durum' },
          { key: 'health', label: 'Sağlık' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        rows={PLUGINS.map((p) => ({
          name: <span className="font-mono text-xs">{p.name}</span>,
          version: <span className="tabular-nums">{p.version}</span>,
          status: (
            <Badge tone={p.status === 'active' ? 'success' : 'neutral'} size="sm">
              {p.status}
            </Badge>
          ),
          health: (
            <Badge
              tone={p.health === 'OK' ? 'success' : p.health === 'warn' ? 'warning' : 'neutral'}
              size="sm"
              dot
            >
              {p.health}
            </Badge>
          ),
          actions: (
            <div className="inline-flex gap-1">
              <Button
                size="icon"
                tone="ghost"
                aria-label="Upgrade"
                onClick={() => toast.success(`${p.name} yükseltildi`)}
              >
                <Icon icon={Download} size={14} />
              </Button>
              <Button
                size="icon"
                tone="ghost"
                aria-label="Uninstall"
                onClick={() => toast.error(`${p.name} kaldırma kuyruğunda`)}
              >
                <Icon icon={Trash2} size={14} />
              </Button>
            </div>
          ),
        }))}
      />
    </AdminPage>
  );
}
