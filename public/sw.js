/* Stickera PWA — cache shell + content JSON; network-first for catalog updates */
const CACHE = 'stickera-v1';
const BASE = '/stickera/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(BASE)) return;

  const isAppShell =
    url.pathname.endsWith('.html') ||
    url.pathname.includes('/_expo/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css');

  if (!isAppShell && !url.pathname.includes('catalog.json') && !url.pathname.includes('/albums/')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      try {
        const res = await fetch(event.request);
        if (res.ok) cache.put(event.request, res.clone());
        return res;
      } catch {
        if (cached) return cached;
        throw new Error('offline');
      }
    }),
  );
});
