// JawiKids PWA Register v1.48
(function () {
  const VERSION = 'v1.48.0';
  window.JAWIKIDS_APP_VERSION = VERSION;
  async function clearOldCaches(){
    try{
      if(!('caches' in window)) return;
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
    }catch(e){}
  }
  clearOldCaches();
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=' + encodeURIComponent(VERSION), { scope: './', updateViaCache: 'none' });
      await registration.update();
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) newWorker.postMessage({ type: 'SKIP_WAITING' });
        });
      });
      let refreshed = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshed) return;
        refreshed = true;
        window.location.reload();
      });
    } catch (error) { console.warn('JawiKids PWA register failed:', error); }
  });
})();
