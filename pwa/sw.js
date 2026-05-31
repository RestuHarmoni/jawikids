/* JawiKids Service Worker v1.08
   Fix: clear old cache so updated login/register module files load correctly. */
const CACHE_NAME = 'jawikids-v1.08';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/forgot-password.html',
  '/dashboard.html',
  '/offline.html',
  '/manifest.json',
  '/css/app.css',
  '/assets/css/style.css',
  '/assets/css/auth.css',
  '/assets/css/dashboard.css',
  '/assets/js/auth.js',
  '/assets/js/session.js',
  '/assets/js/dashboard.js',
  '/assets/js/pwa-register.js',
  '/supabase/config.js',
  '/supabase/client.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => null))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Network-first for HTML/JS/CSS/config to avoid stale login/register code.
  const networkFirst =
    request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/supabase/');

  if (networkFirst) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  // Cache-first for static assets.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
