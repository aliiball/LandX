/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_MODE: boolean;
  readonly VITE_ROUTER_MODE: 'browser' | 'hash';
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_POSTHOG: boolean;
  readonly VITE_POSTHOG_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
