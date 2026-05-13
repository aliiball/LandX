import { DemoModeBadge } from '@/components/layout/DemoModeBadge';
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher';
import { Outlet } from 'react-router';
import { Link } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-mono text-sm font-semibold">
          arsam<span className="text-[var(--accent-cyan)]">.</span>net
        </Link>
        <div className="flex items-center gap-3">
          <DemoModeBadge />
          <PersonaSwitcher />
        </div>
      </header>

      <main className="relative flex items-center justify-center px-6 py-20 lg:px-16">
        <Outlet />
      </main>

      <aside
        aria-hidden
        className="relative hidden overflow-hidden border-l border-[var(--stroke-subtle)] lg:block"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--stroke-default) 1px, transparent 1px), linear-gradient(90deg, var(--stroke-default) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.08,
          }}
        />
        <div
          className="absolute -right-32 top-1/3 size-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.82 0.16 195 / 0.18), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Obsidian Grid
          </p>
          <p className="mt-2 text-2xl text-[var(--text-secondary)]">
            AI-first marketplace.
            <br />
            Türkiye'nin arsasını yeniden düşünüyoruz.
          </p>
        </div>
      </aside>
    </div>
  );
}
