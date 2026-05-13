import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/Toast';
import { i18n } from '@/i18n';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import '@/styles/globals.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a14" />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          <div
            style={{ padding: '2rem', color: 'white', background: '#0a0a14', minHeight: '100vh' }}
          >
            <h1>LandX / arsam.net</h1>
            <p>
              AI-first arsa marketplace platformu. Bu uygulamanın çalışması için JavaScript
              gereklidir. Lütfen tarayıcınızda JavaScript'i etkinleştirin ve sayfayı yenileyin. The
              arsam.net frontend requires JavaScript. Please enable it and reload. arsam.net is an
              AI-native land marketplace for Turkey, focused on listings, valuation, and broker
              tools.
            </p>
          </div>
        </noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function useMockBootstrap() {
  const [ready, setReady] = useState(import.meta.env.PROD);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let cancelled = false;
    void (async () => {
      try {
        const { startWorker } = await import('@/mocks/browser');
        await startWorker();
      } catch (err) {
        console.warn('[msw] failed to start worker:', err);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return ready;
}

export default function Root() {
  const ready = useMockBootstrap();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  if (!ready) {
    return (
      <AppShell>
        <div className="flex min-h-dvh items-center justify-center text-[var(--text-tertiary)]">
          <span className="font-mono text-xs uppercase tracking-widest">Initializing…</span>
        </div>
      </AppShell>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RadixTooltip.Provider delayDuration={350} skipDelayDuration={150}>
          <AppShell>
            <Suspense
              fallback={
                <div className="flex min-h-dvh items-center justify-center text-[var(--text-tertiary)]">
                  <span className="font-mono text-xs uppercase tracking-widest">Loading…</span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </AppShell>
          <Toaster />
        </RadixTooltip.Provider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
