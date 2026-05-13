import { BottomNav } from '@/components/layout/BottomNav';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

const SIDEBAR_ENTRIES = [
  { to: '/dashboard', label: 'Ana' },
  { to: '/dashboard/listings', label: 'İlanlarım' },
  { to: '/dashboard/favorites', label: 'Favoriler' },
  { to: '/dashboard/alerts', label: 'Uyarılar' },
  { to: '/dashboard/messages', label: 'Mesajlar' },
  { to: '/dashboard/ai', label: 'AI Asistan' },
  { to: '/dashboard/security', label: 'Güvenlik' },
  { to: '/dashboard/profile', label: 'Profil' },
  { to: '/dashboard/billing', label: 'Faturalandırma' },
  { to: '/dashboard/kyc', label: 'KYC' },
];

const BOTTOM_TABS = [
  { to: '/dashboard', label: 'Ana' },
  { to: '/dashboard/listings', label: 'İlanlar' },
  { to: '/dashboard/ai', label: 'AI' },
  { to: '/dashboard/messages', label: 'Mesaj' },
  { to: '/dashboard/profile', label: 'Profil' },
];

export default function DashboardLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LayoutTopBar surfaceLabel="Dashboard · Buyer/Seller" envBadge="dev" />
      <div className="flex flex-1">
        <DashboardSidebar surfaceLabel="Dashboard" entries={SIDEBAR_ENTRIES} />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
      <BottomNav tabs={BOTTOM_TABS} />
    </div>
  );
}
