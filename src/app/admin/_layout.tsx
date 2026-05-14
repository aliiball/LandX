import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

const SIDEBAR_ENTRIES = [
  { to: '/admin', label: 'Genel', iconColor: 'var(--accent-violet)' },
  { to: '/admin/approvals', label: 'Onay Kuyruğu' },
  { to: '/admin/tenant', label: 'Tenant Yönetimi' },
  { to: '/admin/tenants', label: 'Tenants' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/auth-security', label: 'Auth & Güvenlik' },
  { to: '/admin/roles', label: 'Roller' },
  { to: '/admin/mcp', label: 'MCP Sunucusu' },
  { to: '/admin/ai-ops', label: 'AI Ops' },
  { to: '/admin/agent-registry', label: 'Agent Registry' },
  { to: '/admin/orchestration', label: 'Orkestrasyon' },
  { to: '/admin/agent-tasks', label: 'Agent Görevleri' },
  { to: '/admin/doctype-studio', label: 'DocType Studio' },
  { to: '/admin/workflow-designer', label: 'Workflow Designer' },
  { to: '/admin/rules', label: 'ECA Kuralları' },
  { to: '/admin/feature-flags', label: 'Feature Flags' },
  { to: '/admin/tkgm', label: 'TKGM' },
  { to: '/admin/audit', label: 'Audit' },
  { to: '/admin/pii', label: 'PII / DSAR' },
  { to: '/admin/compliance', label: 'Uyum' },
  { to: '/admin/observability', label: 'Observability' },
  { to: '/admin/reports', label: 'Raporlar' },
  { to: '/admin/api', label: 'API Explorer' },
  { to: '/admin/modules', label: 'Modüller (33)' },
  { to: '/admin/plugins', label: 'Pluginler' },
  { to: '/admin/security/reviews', label: 'Güvenlik İncel.' },
  { to: '/admin/config', label: 'Config' },
  { to: '/admin/doctypes', label: 'DocTypes' },
  { to: '/admin/migrations', label: 'Migrations' },
  { to: '/admin/hooks', label: 'Webhooks' },
  { to: '/admin/workflows', label: 'Workflows' },
  { to: '/admin/slo', label: 'SLO' },
  { to: '/admin/notifications-templates', label: 'Bildirim Şablon.' },
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
