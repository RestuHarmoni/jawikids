/* JawiKids Service Worker v1.49.3 - portrait safe/no force rotate */
const CACHE_VERSION = 'v1.49.3-portrait-safe';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const APP_SHELL = [
  './','./index.html','./pwa-start.html','./login.html','./register.html','./parent-dashboard.html','./child-select.html','./game-map.html','./letter-intro.html','./lesson-practice.html','./lesson-game.html','./lesson-2.html','./boss-challenge.html','./app.css','./style.css','./pwa-register.js','./js/orientation-lock.js','./js/orientation-reset.js','./orientation-lock.js','./orientation-reset.js','./manifest.json','./manifest-game.json'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL).catch(()=>null)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(k => k.startsWith(CACHE_VERSION) ? false : caches.delete(k)));
    await self.clients.claim();
    const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clientsList) client.postMessage({type:'JAWIKIDS_SW_UPDATED',version:CACHE_VERSION,orientation:'any'});
  })());
});
function isNavigationRequest(request){ return request.mode==='navigate' || (request.headers.get('accept')||'').includes('text/html'); }
function shouldNetworkOnly(url){
  return url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/pwa-register.js') || url.pathname.endsWith('/manifest.json') || url.pathname.endsWith('/manifest-game.json') || url.pathname.endsWith('/js/orientation-lock.js') || url.pathname.endsWith('/js/orientation-reset.js') || url.pathname.endsWith('/orientation-lock.js') || url.pathname.endsWith('/orientation-reset.js') || url.pathname.endsWith('/js/child-select.js') || url.pathname.endsWith('/child-select.js');
}
async function networkFirst(request){
  const cache=await caches.open(STATIC_CACHE);
  try{ const fresh=await fetch(request,{cache:'no-store'}); if(fresh&&fresh.ok) await cache.put(request,fresh.clone()); return fresh; }
  catch(e){ const cached=await cache.match(request); if(cached) return cached; if(isNavigationRequest(request)) return cache.match('./index.html'); throw e; }
}
self.addEventListener('fetch', event => {
  const request=event.request; if(request.method!=='GET') return;
  const url=new URL(request.url); if(url.origin!==self.location.origin) return;
  if(shouldNetworkOnly(url)){ event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request))); return; }
  event.respondWith(networkFirst(request));
});
self.addEventListener('message', event => { if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting(); });
