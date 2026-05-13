import { DemoModeBadge } from '@/components/layout/DemoModeBadge';
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher';
import { cn } from '@/design/recipes';
import { Link, NavLink, Outlet } from 'react-router';

const NAV = [
  { to: '/search', label: 'Ara' },
  { to: '/map', label: 'Harita' },
  { to: '/regions', label: 'Bölgeler' },
  { to: '/compare', label: 'Karşılaştır' },
  { to: '/pricing', label: 'Fiyatlandırma' },
  { to: '/blog', label: 'Blog' },
];

export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="font-mono text-sm font-semibold">
            arsam<span className="text-[var(--accent-cyan)]">.</span>net
          </Link>
          <nav aria-label="Ana navigasyon" className="hidden gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--surface-slate)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-slate)]/60 hover:text-[var(--text-primary)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:inline"
            >
              Giriş
            </Link>
            <DemoModeBadge />
            <PersonaSwitcher />
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="mt-auto border-t border-[var(--stroke-subtle)] bg-[var(--surface-obsidian)]/60">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-8 md:grid-cols-4 md:px-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold">arsam.net</span>
            <p className="text-xs text-[var(--text-tertiary)]">
              AI-first arsa marketplace · LandX powered
            </p>
          </div>
          <FooterCol
            title="Keşfet"
            links={[
              { to: '/search', label: 'Ara' },
              { to: '/map', label: 'Harita' },
              { to: '/regions', label: 'Bölgeler' },
              { to: '/blog', label: 'Blog' },
            ]}
          />
          <FooterCol
            title="Şirket"
            links={[
              { to: '/about', label: 'Hakkımızda' },
              { to: '/pricing', label: 'Fiyatlandırma' },
              { to: '/contact', label: 'İletişim' },
            ]}
          />
          <FooterCol
            title="Yasal"
            links={[
              { to: '/legal/kvkk', label: 'KVKK' },
              { to: '/legal/cookies', label: 'Çerez' },
              { to: '/legal/terms', label: 'Şartlar' },
            ]}
          />
        </div>
        <div className="border-t border-[var(--stroke-subtle)] px-4 py-4 text-center text-xs text-[var(--text-tertiary)] md:px-6">
          © {new Date().getFullYear()} arsam.net · KVKK uyumlu · ISO 27001 kapsamında
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ to: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{title}</span>
      <ul className="flex flex-col gap-1.5 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
