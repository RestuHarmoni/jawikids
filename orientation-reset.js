// JawiKids v1.52.0 - Orientation reset for non-game pages
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','lesson-game.html','lesson-practice.html','lesson-2.html','letter-intro.html','boss-challenge.html','future-mini-games.html']);
  function pageName(){
    const raw=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    return raw.includes('.') ? raw : (raw ? raw+'.html' : 'index.html');
  }
  function isGamePage(){ return GAME_PAGES.has(pageName()) || document.body?.dataset?.jkOrientation === 'game'; }
  function reset(){
    if(isGamePage()) return;
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
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
  }
  window.JawiKidsResetOrientation = reset;
  reset();
  document.addEventListener('DOMContentLoaded', reset);
  window.addEventListener('pageshow', reset);
})();
