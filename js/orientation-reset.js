// JawiKids v1.49 - orientation/game mode reset for all non-game pages
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','letter-intro.html','lesson-practice.html','lesson-game.html','lesson-2.html','boss-challenge.html']);
  function pageName(){ let raw=(location.pathname.split('/').pop()||'index.html').toLowerCase(); return raw.includes('.')?raw:raw+'.html'; }
  const isGamePage = GAME_PAGES.has(pageName()) && document.body && document.body.dataset.jkOrientation === 'game';
  if(isGamePage) return;
  try{ localStorage.removeItem('jawikids_game_wide_mode'); localStorage.removeItem('jawikids_game_mode'); }catch(e){}
  function cleanup(){
    document.documentElement.classList.remove('jk-touch-device','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-wide-guide-enabled','jk-game-landscape-view','jk-game-portrait-view');
    if(document.body) document.body.classList.remove('jk-wide-preferred-body','jk-child-game-mode-body','jk-wide-guide-enabled-body');
    const overlay=document.getElementById('jkRotateOverlay'); if(overlay) overlay.remove();
  }
  async function reset(){ cleanup(); try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){} try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){} }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', reset, {once:true}); else reset();
  window.addEventListener('pageshow', reset);
})();
