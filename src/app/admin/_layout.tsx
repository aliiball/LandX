import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

const SIDEBAR_ENTRIES = [
  { to: '/admin', label: 'Genel', iconColor: 'var(--accent-violet)' },
  { to: '/admin/tenants', label: 'Tenants' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/roles', label: 'Roles' },
  { to: '/admin/plugins', label: 'Plugins' },
  { to: '/admin/doctypes', label: 'DocTypes' },
  { to: '/admin/migrations', label: 'Migrations' },
  { to: '/admin/hooks', label: 'Hooks' },
  { to: '/admin/config', label: 'Config' },
  { to: '/admin/api', label: 'API Explorer' },
  { to: '/admin/workflows', label: 'Workflows' },
  { to: '/admin/audit', label: 'Audit' },
  { to: '/admin/pii', label: 'PII / DSAR' },
  { to: '/admin/compliance', label: 'Compliance' },
  { to: '/admin/slo', label: 'SLO' },
  { to: '/admin/security/reviews', label: 'Security Reviews' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LayoutTopBar surfaceLabel="Admin · Auto Admin UI" envBadge="staging" />
      <div className="flex flex-1">
        <DashboardSidebar surfaceLabel="Admin" entries={SIDEBAR_ENTRIES} />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
