// JawiKids PWA Register v1.49.3 - portrait safe updater
(function(){
  const VERSION='v1.49.3-portrait-safe';
  window.JAWIKIDS_APP_VERSION=VERSION;
  function clearOrientationState(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      localStorage.removeItem('jk_force_landscape');
      localStorage.setItem('jawikids_orientation_fix_version', VERSION);
    }catch(e){}
    try{
      document.documentElement.classList.remove('jk-touch-device','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-force-landscape','jk-game-wide-mode');
      if(document.body) document.body.classList.remove('jk-wide-preferred-body','jk-child-game-mode-body','jk-force-landscape','jk-game-wide-mode');
      const overlay=document.getElementById('jkRotateOverlay'); if(overlay) overlay.remove();
      if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
    }catch(e){}
  }
  async function clearAllCaches(){ try{ if('caches' in window){ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); } }catch(e){} }
  clearOrientationState();
  clearAllCaches();
  window.addEventListener('pageshow', clearOrientationState);
  window.addEventListener('focus', clearOrientationState);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) clearOrientationState(); });
  if(!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async()=>{
    try{
      const registration=await navigator.serviceWorker.register('./sw.js?v='+encodeURIComponent(VERSION),{scope:'./',updateViaCache:'none'});
      await registration.update();
      registration.addEventListener('updatefound',()=>{
        const nw=registration.installing; if(!nw) return;
        nw.addEventListener('statechange',()=>{ if(nw.state==='installed') nw.postMessage({type:'SKIP_WAITING'}); });
      });
      navigator.serviceWorker.addEventListener('message', event=>{ if(event.data && event.data.type==='JAWIKIDS_SW_UPDATED') clearOrientationState(); });
      let refreshed=false;
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(refreshed) return; refreshed=true; clearOrientationState(); window.location.reload();
      });
    }catch(error){ console.warn('JawiKids PWA register failed:', error); }
  });
})();
