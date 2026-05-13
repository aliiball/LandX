import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { initFakerSeed } from './seed/faker-config';

export const worker = setupWorker(...handlers);

let started = false;

export async function startWorker(): Promise<void> {
  if (started) return;
  initFakerSeed();
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    quiet: true,
  });
  started = true;
}

export async function stopWorker(): Promise<void> {
  if (!started) return;
  worker.stop();
  started = false;
}
