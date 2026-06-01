/* JawiKids Service Worker v1.49.2.0
   PWA cache refresh for orientation fix.
   Purpose: force installed PWA to stop using old orientation-lock/reset/child-select files.
*/
const CACHE_VERSION = 'v1.49.2.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const APP_SHELL = [
  './',
  './index.html',
  './pwa-start.html',
  './login.html',
  './register.html',
  './parent-dashboard.html',
  './child-select.html',
  './game-map.html',
  './letter-intro.html',
  './lesson-practice.html',
  './lesson-game.html',
  './lesson-2.html',
  './boss-challenge.html',
  './app.css',
  './style.css',
  './pwa-register.js',
  './js/supabase-client.js',
  './js/auth.js',
  './js/dashboard.js',
  './js/child-select.js',
  './js/game-map.js',
  './js/letter-intro.js',
  './js/lesson-game.js',
  './js/orientation-lock.js',
  './js/orientation-reset.js',
  './js/pwa-launch.js',
  './orientation-lock.js',
  './orientation-reset.js',
  './child-select.js',
  './character-assets.js',
  './manifest.json',
  './manifest-game.json',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/icons/apple-touch-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => null))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (!key.startsWith(CACHE_VERSION)) return caches.delete(key);
      return Promise.resolve(false);
    }));
    await self.clients.claim();
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      client.postMessage({ type: 'JAWIKIDS_SW_UPDATED', version: CACHE_VERSION });
    }
  })());
});

function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}
function isFreshFile(url) {
  return /\.(html|js|css|json|webmanifest)$/i.test(url.pathname);
}
function isStaticAsset(url) {
  return /\.(svg|png|jpg|jpeg|webp|gif|mp3|wav|ogg|woff2?)$/i.test(url.pathname);
}
function shouldBypassCache(url) {
  return url.pathname.endsWith('/sw.js') ||
    url.pathname.endsWith('/pwa-register.js') ||
    url.pathname.endsWith('/js/orientation-lock.js') ||
    url.pathname.endsWith('/js/orientation-reset.js') ||
    url.pathname.endsWith('/js/child-select.js') ||
    url.pathname.endsWith('/orientation-lock.js') ||
    url.pathname.endsWith('/orientation-reset.js') ||
    url.pathname.endsWith('/child-select.js');
}

async function networkOnly(request) {
  return fetch(request, { cache: 'no-store' });
}

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    if (fresh && fresh.ok) await cache.put(request, fresh.clone());
    return fresh;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (isNavigationRequest(request)) return cache.match('./index.html');
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.ok) await cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (shouldBypassCache(url)) {
    event.respondWith(networkOnly(request).catch(() => caches.match(request)));
    return;
  }
  if (isNavigationRequest(request) || isFreshFile(url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
