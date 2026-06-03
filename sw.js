// Pulau Jawi v3.8 - Service Worker Cache Refresh
// WAJIB update setiap kali ada perubahan/tambahan file supaya PWA/browser tarik versi terbaru.
const CACHE_NAME = "pulau-jawi-v3-8-cache-refresh";
const CORE_ASSETS = [
  './',
  './index.html',
  './login.html',
  './register.html',
  './parent-dashboard.html',
  './child-profile.html',
  './game-map.html',
  './game-map/index.html',
  './lesson-game.html',
  './boss-challenge.html',
  './achievement.html',
  './reward.html',
  './parent-inbox.html',
  './support.html',
  './affiliate.html',
  './parent-analytics.html',
  './app.css',
  './style.css',
  './js/dashboard.js',
  './js/child-profile.js',
  './js/game-map.js',
  './js/lesson-game.js',
  './js/orientation-lock.js',
  './js/orientation-reset.js',
  './manifest.json',
  './manifest-game.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isPageRequest = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  const isSameOrigin = url.origin === self.location.origin;

  event.respondWith((async () => {
    try {
      // HTML/pages: network-first supaya update cepat nampak selepas upload.
      if (isPageRequest || isSameOrigin) {
        const fresh = await fetch(req, { cache: 'no-store' });
        const copy = fresh.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        return fresh;
      }

      const cached = await caches.match(req);
      if (cached) return cached;

      const fresh = await fetch(req);
      const copy = fresh.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return caches.match('./index.html') || new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
