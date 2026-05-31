const CACHE='jawikids-v1-00';
const ASSETS=['/','/index.html','/login.html','/register.html','/dashboard.html','/css/app.css','/js/state.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('/index.html')))));
