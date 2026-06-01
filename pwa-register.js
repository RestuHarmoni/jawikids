// JawiKids PWA Register v1.45
(function () {
  const VERSION = 'v1.45.0';
  window.JAWIKIDS_APP_VERSION = VERSION;
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=' + encodeURIComponent(VERSION), { scope: './' });
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
