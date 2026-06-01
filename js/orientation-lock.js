// JawiKids v1.49.3 - NO FORCE ROTATE controller
// This file intentionally NEVER calls screen.orientation.lock().
// It only clears old landscape state and lets the user's device orientation setting control the screen.
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','letter-intro.html','lesson-practice.html','lesson-game.html','lesson-2.html','boss-challenge.html']);
  function pageName(){
    const raw=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    return raw.includes('.')?raw:(raw?raw+'.html':'index.html');
  }
  function cleanup(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      localStorage.removeItem('jk_force_landscape');
      localStorage.setItem('jawikids_orientation_fix_version','v1.49.3');
    }catch(e){}
    const overlay=document.getElementById('jkRotateOverlay');
    if(overlay) overlay.remove();
    document.documentElement.classList.remove('jk-touch-device','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-force-landscape','jk-game-wide-mode');
    if(document.body) document.body.classList.remove('jk-wide-preferred-body','jk-child-game-mode-body','jk-force-landscape','jk-game-wide-mode');
  }
  async function unlock(){
    cleanup();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
  }
  window.JawiKidsOrientation = {
    startGameMode(targetUrl){ cleanup(); window.location.href = targetUrl || 'game-map.html'; },
    stopGameMode: unlock,
    unlockNormalMode: unlock,
    lockLandscape: unlock,
    refresh: cleanup,
    isStandalonePWA(){ return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; }
  };
  unlock();
  window.addEventListener('pageshow', unlock);
  window.addEventListener('focus', unlock);
  window.addEventListener('resize', cleanup);
  window.addEventListener('orientationchange', cleanup);
  document.addEventListener('DOMContentLoaded', cleanup);
  document.addEventListener('visibilitychange', () => { if(!document.hidden) unlock(); });
})();
