// JawiKids v1.48.1 - Normal portrait reset for parent/admin/non-game pages
// This file must exist in /js because HTML pages load js/orientation-reset.js.
(function(){
  'use strict';

  const GAME_PAGES = new Set([
    'game-map.html',
    'letter-intro.html',
    'lesson-practice.html',
    'lesson-game.html',
    'lesson-2.html',
    'boss-challenge.html'
  ]);

  function pageName(){
    const raw = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return raw.includes('.') ? raw : (raw ? raw + '.html' : 'index.html');
  }

  const isGamePage = GAME_PAGES.has(pageName()) && document.body && document.body.dataset.jkOrientation === 'game';
  if(isGamePage) return;

  function cleanup(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
    }catch(e){}

    const overlay = document.getElementById('jkRotateOverlay');
    if(overlay) overlay.remove();

    document.documentElement.classList.remove(
      'jk-touch-device',
      'jk-wide-preferred',
      'jk-child-game-mode',
      'jk-landscape-active',
      'jk-portrait-blocked'
    );

    if(document.body){
      document.body.classList.remove('jk-wide-preferred-body', 'jk-child-game-mode-body');
    }
  }

  async function unlock(){
    cleanup();
    try{
      if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
    }catch(e){}
    try{
      if(document.fullscreenElement && document.exitFullscreen){
        await document.exitFullscreen();
      }
    }catch(e){}
  }

  window.JawiKidsOrientation = Object.assign({}, window.JawiKidsOrientation || {}, {
    stopGameMode: unlock,
    unlockNormalMode: unlock,
    refresh: cleanup
  });

  unlock();
  window.addEventListener('pageshow', unlock);
  window.addEventListener('focus', unlock);
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden) unlock();
  });
})();
