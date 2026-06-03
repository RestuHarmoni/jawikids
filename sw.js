// Pulau Jawi v3.5 One-Time Rotate / No In-Game Popup
// Pulau Jawi v3.3 lesson game HP layout cache refresh
const CACHE_NAME = "pulau-jawi-v3-3-lesson-game-hp-fix";
const CORE_ASSETS = [
  './',
  './index.html',
  './parent-dashboard.html',
  './child-profile.html',
  './game-map.html',
  './lesson-game.html',
  './app.css',
  './style.css'
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
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async()=>{
    try{
      const fresh = await fetch(req);
      const copy = fresh.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)).catch(()=>{});
      return fresh;
    }catch(e){
      const cached = await caches.match(req);
      return cached || new Response('Offline', {status:503, statusText:'Offline'});
    }
  })());
});
