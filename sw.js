/* JawiKids Service Worker v1.44.0
   Network-first for HTML/JS/CSS to avoid stale patch issues.
   Cache-first for static images/icons/audio after first load.
*/
const CACHE_VERSION = 'v1.44.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const APP_SHELL = [
  './','./index.html','./login.html','./register.html','./parent-dashboard.html','./child-select.html','./game-map.html','./letter-intro.html','./lesson-practice.html','./lesson-game.html','./lesson-2.html','./boss-challenge.html',
  './app.css','./style.css','./js/supabase-client.js','./js/auth.js','./js/dashboard.js','./js/child-select.js','./js/game-map.js','./js/letter-intro.js','./js/lesson-game.js','./js/orientation-lock.js','./character-assets.js','./manifest.json'
];
self.addEventListener('install', (event) => { self.skipWaiting(); event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => null))); });
self.addEventListener('activate', (event) => { event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))); await self.clients.claim(); })()); });
function isNavigationRequest(request) { return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html'); }
function isFreshFile(url) { return /\.(html|js|css|json)$/i.test(url.pathname); }
function isStaticAsset(url) { return /\.(svg|png|jpg|jpeg|webp|gif|mp3|wav|ogg|woff2?)$/i.test(url.pathname); }
async function networkFirst(request) { const cache = await caches.open(STATIC_CACHE); try { const fresh = await fetch(request, { cache: 'no-store' }); if (fresh && fresh.ok) cache.put(request, fresh.clone()); return fresh; } catch (error) { const cached = await cache.match(request); if (cached) return cached; if (isNavigationRequest(request)) return cache.match('./index.html'); throw error; } }
async function cacheFirst(request) { const cache = await caches.open(STATIC_CACHE); const cached = await cache.match(request); if (cached) return cached; const fresh = await fetch(request); if (fresh && fresh.ok) cache.put(request, fresh.clone()); return fresh; }
self.addEventListener('fetch', (event) => { const { request } = event; if (request.method !== 'GET') return; const url = new URL(request.url); if (url.origin !== self.location.origin) return; if (isNavigationRequest(request) || isFreshFile(url)) { event.respondWith(networkFirst(request)); return; } if (isStaticAsset(url)) event.respondWith(cacheFirst(request)); });
self.addEventListener('message', (event) => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
