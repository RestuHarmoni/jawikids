/* JawiKids Service Worker v1.51.0 - force landscape game mode aware */
const CACHE_NAME = 'jawikids-v1-51-0-force-landscape-game';
const CORE_ASSETS = [
  './', './index.html', './pwa-start.html', './manifest.json', './manifest-game.json',
  './style.css?v=1.51.0', './app.css?v=1.51.0', './pwa-register.js?v=1.51.0',
  './js/orientation-lock.js?v=1.51.0', './js/orientation-reset.js?v=1.51.0',
  './orientation-lock.js?v=1.51.0', './orientation-reset.js?v=1.51.0'
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
