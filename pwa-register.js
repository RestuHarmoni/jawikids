// JawiKids PWA Register v1.49.2
(function () {
  const VERSION = 'v1.49.2.0';
  window.JAWIKIDS_APP_VERSION = VERSION;

  async function clearOldCaches(){
    try{
      if(!('caches' in window)) return;
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
    }catch(e){}
  }

  function clearOrientationState(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      document.documentElement.classList.remove('jk-force-landscape','jk-game-wide-mode');
      document.body && document.body.classList.remove('jk-force-landscape','jk-game-wide-mode');
    }catch(e){}
  }

  clearOldCaches();
  if (!document.body || document.body.getAttribute('data-jk-orientation') !== 'game') clearOrientationState();

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=' + encodeURIComponent(VERSION), {
        scope: './',
        updateViaCache: 'none'
      });
      await registration.update();

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') newWorker.postMessage({ type: 'SKIP_WAITING' });
        });
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if(event.data && event.data.type === 'JAWIKIDS_SW_UPDATED'){
          if (!document.body || document.body.getAttribute('data-jk-orientation') !== 'game') clearOrientationState();
        }
      });

      let refreshed = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshed) return;
        refreshed = true;
        if (!document.body || document.body.getAttribute('data-jk-orientation') !== 'game') clearOrientationState();
        window.location.reload();
      });
    } catch (error) {
      console.warn('JawiKids PWA register failed:', error);
    }
  });
})();
