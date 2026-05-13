import { LayoutTopBar } from '@/components/layout/LayoutTopBar';
import { Outlet } from 'react-router';

export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LayoutTopBar surfaceLabel="Public · Marketplace" envBadge="dev" />
      <Outlet />
      <footer className="border-t border-[var(--stroke-subtle)] px-4 py-6 text-center text-xs text-[var(--text-tertiary)] md:px-6">
        © {new Date().getFullYear()} arsam.net · LandX powered · KVKK · Çerez Tercihleri
      </footer>
    </div>
  );
}
