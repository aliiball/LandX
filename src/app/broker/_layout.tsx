import { BottomNav } from '@/components/layout/BottomNav';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

const SIDEBAR_ENTRIES = [
  { to: '/broker', label: 'Genel', iconColor: 'var(--accent-amber)' },
  { to: '/broker/portfolio', label: 'Portföy' },
  { to: '/broker/leads', label: 'Lead / CRM' },
  { to: '/broker/clients', label: 'Müşteriler' },
  { to: '/broker/commissions', label: 'Komisyonlar' },
  { to: '/broker/showcase', label: 'Vitrin' },
  { to: '/broker/team', label: 'Takım' },
  { to: '/broker/analytics', label: 'Analitik' },
  { to: '/broker/ai-tools', label: 'AI Araçları' },
  { to: '/broker/subscription', label: 'Abonelik' },
];

const BOTTOM_TABS = [
  { to: '/broker/portfolio', label: 'Portföy' },
  { to: '/broker/leads', label: 'Lead' },
  { to: '/broker/clients', label: 'Müşteri' },
  { to: '/broker/ai-tools', label: 'AI' },
  { to: '/broker', label: 'Genel' },
];

export default function BrokerLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LayoutTopBar surfaceLabel="Broker · Emlakçı Ops" envBadge="dev" />
      <div className="flex flex-1">
        <DashboardSidebar surfaceLabel="Broker" entries={SIDEBAR_ENTRIES} />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
      <BottomNav tabs={BOTTOM_TABS} />
    </div>
  );
}
