// JawiKids v1.50.0 - PORTRAIT SAFE
// This file intentionally DOES NOT call screen.orientation.lock('landscape').
// It clears old game-wide state and prevents forced auto-rotate from old cache/state.
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','letter-intro.html','lesson-practice.html','lesson-game.html','lesson-2.html','boss-challenge.html']);
  function pageName(){
    const raw=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    return raw.includes('.') ? raw : (raw ? raw+'.html' : 'index.html');
  }
  function isGamePage(){ return GAME_PAGES.has(pageName()); }
  function clearState(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      sessionStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    try{
      document.documentElement.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-touch-device');
      if(document.body){
        document.body.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred-body','jk-child-game-mode-body');
      }
      const overlay=document.getElementById('jkRotateOverlay');
      if(overlay) overlay.remove();
    }catch(e){}
  }
  async function unlock(){
    clearState();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
  }
  window.JawiKidsOrientation = {
    startGameMode(targetUrl){
      // Navigate only. No localStorage orientation flag. No force landscape.
      window.location.href = targetUrl || 'game-map.html';
    },
    stopGameMode: unlock,
    unlockNormalMode: unlock,
    lockLandscape(){ return Promise.resolve(false); },
    refresh(){ clearState(); },
    isStandalonePWA(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || document.referrer.startsWith('android-app://');
    }
  };
  // Always unlock on load, including game pages. Game layout may respond to real device width, but app will not force rotate.
  unlock();
  document.addEventListener('DOMContentLoaded', unlock);
  window.addEventListener('pageshow', unlock);
  window.addEventListener('visibilitychange', function(){ if(!document.hidden) unlock(); });
})();
