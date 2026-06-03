// Pulau Jawi v2.9 dashboard child rotate cache refresh
/* Pulau Jawi Service Worker v2.7 - dashboard clean + child gate */
const CACHE_NAME = 'pulau-jawi-v3-0-clean-child-profile-flow';
const CORE_ASSETS = [
  './', './index.html', './game-map.html?v=2.5-landscape-fix', './game-map/', './pwa-start.html', './manifest.json', './manifest-game.json',
  './style.css?v=1.52.0', './app.css?v=2.4-map-spacing', './pwa-register.js?v=1.52.0', './js/quick-menu.js?v=1.52.0',
  './js/orientation-lock.js?v=2.6-clean', './js/orientation-reset.js?v=2.6-clean'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(()=>{})));
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
function isMutable(url){
  return /\.(html|js|css|json|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith('/');
}
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  if(isMutable(url)){
    event.respondWith(fetch(req, {cache:'no-store'}).then(res=>{
      const copy=res.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res=>{
    const copy=res.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)).catch(()=>{});
    return res;
  })));
});
