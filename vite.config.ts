import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // VITE_DEMO_MODE: default ON for dev + demo build; CI production check sets `false`.
  // This way `pnpm dev` (no env) and `pnpm e2e` show PersonaSwitcher; tree-shake check
  // for production build still works when explicit `false` is passed.
  const isDemo = env.VITE_DEMO_MODE !== 'false';
  const routerMode = (env.VITE_ROUTER_MODE ?? 'browser') as 'browser' | 'hash';
  // Base path for asset URLs.
  //   - Default `/` works for root deploy (custom domain, user/org GH Pages, localhost).
  //   - For GH Pages PROJECT page (https://user.github.io/repo/), set
  //     `VITE_BASE_PATH=/repo/` before `pnpm build:demo`.
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      port: 5173,
      strictPort: true,
      host: true,
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
    },
    define: {
      'import.meta.env.VITE_DEMO_MODE': JSON.stringify(isDemo),
      'import.meta.env.VITE_ROUTER_MODE': JSON.stringify(routerMode),
    },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        '@tanstack/react-query',
        'i18next',
        'react-i18next',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
      ],
    },
  };
});
