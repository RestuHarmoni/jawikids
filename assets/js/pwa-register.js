/* JawiKids PWA Register v1.05 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await registration.update();

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('JawiKids updated. Refresh page to use latest version.');
          }
        });
      });
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  });
}
