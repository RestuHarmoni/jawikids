// JawiKids PWA Register v1.11
// Uses root service worker and clears old cache versions through updated sw.js.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.active && !reg.active.scriptURL.endsWith('/sw.js')) {
          await reg.unregister();
        }
      }
      await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    } catch (err) {
      console.warn('PWA registration failed:', err);
    }
  });
}
