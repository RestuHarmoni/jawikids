// JawiKids Service Worker v1.11 CLEAN JS STRUCTURE
const CACHE_NAME = 'jawikids-cache-v1.11';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/children.html',
  '/learning.html',
  '/offline.html',
  '/css/app.css',
  '/assets/js/state.js',
  '/assets/js/auth.js',
  '/assets/js/session.js',
  '/assets/js/dashboard.js',
  '/assets/js/children.js',
  '/assets/js/pwa-register.js',
  '/supabase/config.js',
  '/supabase/client.js',
  '/manifest.json'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(() => null)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.hostname.includes('supabase.co') || req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => null);
      return res;
    }).catch(() => caches.match(req).then(res => res || caches.match('/offline.html')))
  );
});
