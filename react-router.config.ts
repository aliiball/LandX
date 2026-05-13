import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src/app',
  ssr: false,
  prerender: false,
  buildDirectory: 'build',
  // Mirror Vite's `base` for routing — required when deploying under
  // a sub-path (GH Pages project page: /<repo>/).
  basename: process.env.VITE_BASE_PATH || '/',
} satisfies Config;
