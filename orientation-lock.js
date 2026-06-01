// JawiKids v1.51.0 - FORCE LANDSCAPE FOR GAME PAGES ONLY
// Official SOP: non-game pages = portrait/reset, game pages = force landscape when supported.
(function(){
  'use strict';

  const GAME_PAGES = new Set([
    'game-map.html',
    'lesson-game.html',
    'lesson-practice.html',
    'lesson-2.html',
    'letter-intro.html',
    'boss-challenge.html',
    'future-mini-games.html'
  ]);

  function pageName(){
    const raw = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return raw.includes('.') ? raw : (raw ? raw + '.html' : 'index.html');
  }

  function isGamePage(){
    return GAME_PAGES.has(pageName()) || document.body?.dataset?.jkOrientation === 'game';
  }

  function isTouchDevice(){
    return (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) || 'ontouchstart' in window;
  }

  function isLandscape(){
    return window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
  }

  function setGameState(){
    try{
      localStorage.setItem('jawikids_game_mode', '1');
      localStorage.setItem('jawikids_game_wide_mode', '1');
      sessionStorage.setItem('jawikids_game_mode', '1');
      sessionStorage.setItem('jawikids_game_wide_mode', '1');
    }catch(e){}
    document.documentElement.classList.add('jk-force-landscape','jk-game-wide-mode','jk-landscape-active');
    if(document.body) document.body.classList.add('jk-force-landscape','jk-game-wide-mode');
  }

  function clearGameState(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      sessionStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    document.documentElement.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-touch-device');
    if(document.body){
      document.body.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred-body','jk-child-game-mode-body');
    }
    const overlay = document.getElementById('jkRotateOverlay');
    if(overlay) overlay.remove();
  }

  function ensureOverlay(){
    let overlay = document.getElementById('jkRotateOverlay');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'jkRotateOverlay';
    overlay.className = 'jk-rotate-overlay';
    overlay.innerHTML = `
      <div class="jk-rotate-card" role="dialog" aria-modal="true" aria-label="Pusing peranti">
        <div class="jk-rotate-visual"><div class="jk-rotate-device"></div><div class="jk-rotate-arrow">↻</div></div>
        <h2>Sila pusingkan peranti</h2>
        <p>Permainan JawiKids menggunakan paparan landscape supaya peta dan butang lebih besar.</p>
        <button type="button" id="jkRotateLockBtn">Masuk Mode Landscape</button>
        <small>Jika iPhone/iPad tidak boleh paksa rotate, pusingkan peranti secara manual.</small>
      </div>`;
    document.body.appendChild(overlay);
    const btn = overlay.querySelector('#jkRotateLockBtn');
    if(btn){
      btn.addEventListener('click', function(){ requestLandscapeLock(true); });
    }
    return overlay;
  }

  function updateOverlay(){
    if(!isGamePage() || !isTouchDevice()) return;
    const overlay = ensureOverlay();
    if(isLandscape()) overlay.classList.remove('show');
    else overlay.classList.add('show');
  }

  async function requestFullscreenForLock(){
    try{
      if(!document.fullscreenElement && document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(function(){ return null; });
      }
    }catch(e){}
  }

  async function requestLandscapeLock(fromUserGesture){
    if(!isGamePage()) return false;
    setGameState();
    try{
      if(fromUserGesture) await requestFullscreenForLock();
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
        updateOverlay();
        return true;
      }
    }catch(e){
      // Some iOS/Safari browsers do not support forced orientation. Overlay will guide manual rotate.
    }
    updateOverlay();
    return false;
  }

  async function unlockNormalMode(){
    clearGameState();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
  }

  function bindGameGestureLock(){
    const once = function(){ requestLandscapeLock(true); };
    document.addEventListener('click', once, { once:true, passive:true });
    document.addEventListener('touchend', once, { once:true, passive:true });
  }

  window.JawiKidsOrientation = {
    startGameMode(targetUrl){
      try{
        localStorage.setItem('jawikids_game_mode', '1');
        localStorage.setItem('jawikids_game_wide_mode', '1');
      }catch(e){}
      window.location.href = targetUrl || 'game-map.html';
    },
    stopGameMode: unlockNormalMode,
    unlockNormalMode: unlockNormalMode,
    lockLandscape: function(){ return requestLandscapeLock(true); },
    refresh: function(){ if(isGamePage()) requestLandscapeLock(false); else unlockNormalMode(); },
    isStandalonePWA(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || document.referrer.startsWith('android-app://');
    }
  };

  function init(){
    if(isGamePage()){
      setGameState();
      requestLandscapeLock(false);
      bindGameGestureLock();
      updateOverlay();
    }else{
      unlockNormalMode();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pageshow', init);
  window.addEventListener('resize', updateOverlay);
  window.addEventListener('orientationchange', function(){ setTimeout(updateOverlay, 300); });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) init(); });
  init();
})();
