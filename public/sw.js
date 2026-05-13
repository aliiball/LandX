// Minimal service worker — Phase 7 scaffold. Full Workbox precaching lands later.
const CACHE = 'landx-v1';
const PRECACHE = ['/', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('/api/')) return; // never cache API
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ??
        fetch(req)
          .then((res) => {
            if (res.status === 200 && res.type === 'basic') {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(req, clone));
            }
            return res;
          })
          .catch(() => caches.match('/')),
    ),
  );
});
