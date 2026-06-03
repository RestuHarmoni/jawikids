// Pulau Jawi v3.5 - One-Time Rotate Guidance Policy
// Rotate guidance belongs ONLY before entering the game from Child Profile.
// Once inside Game Map / Lesson Game / Boss Battle, never show rotate popup again.
(function(){
  'use strict';

  const GAME_PATHS = ['game-map', 'lesson-game', 'lesson-practice', 'lesson-2', 'letter-intro', 'boss-challenge', 'future-mini-games'];

  function isGamePage(){
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    const last = (path.split('/').pop() || '').replace('.html','');
    return GAME_PATHS.includes(last) || document.body?.dataset?.jkOrientation === 'game';
  }

  function isLandscape(){
    return window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
  }

  function removeRotateOverlay(){
    document.querySelectorAll('#jkRotateOverlay,.jk-rotate-overlay,.rotate-overlay,.orientation-overlay').forEach(el=>{
      el.classList.remove('show','active','is-active','visible');
      el.setAttribute('aria-hidden','true');
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('pointer-events','none','important');
      // Remove only the known rotate prompt to avoid interfering with normal modals.
      if(el.id === 'jkRotateOverlay' || el.classList.contains('jk-rotate-overlay')){
        try{ el.remove(); }catch(e){}
      }
    });
  }

  function setGameSession(){
    try{
      sessionStorage.setItem('pulau_jawi_game_session', '1');
      sessionStorage.setItem('jawikids_game_mode', '1');
      sessionStorage.setItem('jawikids_game_wide_mode', '1');
      sessionStorage.setItem('pulau_jawi_rotate_prompt_done', '1');
      localStorage.setItem('jawikids_game_wide_mode', '1');
      localStorage.setItem('pulau_jawi_rotate_prompt_done', '1');
    }catch(e){}

    document.documentElement.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active','pj-no-rotate-popup');
    document.documentElement.classList.toggle('pj-device-landscape', isLandscape());
    document.documentElement.classList.toggle('pj-device-portrait', !isLandscape());

    if(document.body){
      document.body.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode','pj-no-rotate-popup');
      document.body.classList.toggle('pj-device-landscape', isLandscape());
      document.body.classList.toggle('pj-device-portrait', !isLandscape());
    }
    removeRotateOverlay();
  }

  function clearGameSession(){
    try{
      sessionStorage.removeItem('pulau_jawi_game_session');
      sessionStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    document.documentElement.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device','pj-no-rotate-popup');
    if(document.body){
      document.body.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device','pj-no-rotate-popup');
    }
    removeRotateOverlay();
  }

  async function tryNativeLandscapeLock(fromUserGesture){
    if(!isGamePage()) return false;
    setGameSession();
    try{
      if(fromUserGesture && !document.fullscreenElement && document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(()=>null);
      }
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
        setGameSession();
        return true;
      }
    }catch(e){
      // Silent fallback. Do not show rotate popup in active game pages.
    }
    setGameSession();
    return false;
  }

  function bindFirstGestureOnly(){
    if(window.__pulauJawiOrientationBound) return;
    window.__pulauJawiOrientationBound = true;
    const once = function(){ tryNativeLandscapeLock(true); removeRotateOverlay(); };
    document.addEventListener('pointerdown', once, { once:true, passive:true });
    document.addEventListener('touchend', once, { once:true, passive:true });
    document.addEventListener('click', once, { once:true, passive:true });
  }

  async function unlockNormalMode(){
    clearGameSession();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
  }

  window.PulauJawiOrientation = window.JawiKidsOrientation = {
    startGameMode(targetUrl){
      setGameSession();
      window.location.href = targetUrl || 'game-map.html';
    },
    stopGameMode: unlockNormalMode,
    unlockNormalMode,
    lockLandscape(){ return tryNativeLandscapeLock(true); },
    refresh(){ if(isGamePage()) setGameSession(); else unlockNormalMode(); },
    removeRotateOverlay,
    isStandalonePWA(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || document.referrer.startsWith('android-app://');
    }
  };

  function observeOverlay(){
    if(!isGamePage() || window.__pulauJawiNoRotateObserver) return;
    window.__pulauJawiNoRotateObserver = true;
    const mo = new MutationObserver(removeRotateOverlay);
    mo.observe(document.documentElement, { childList:true, subtree:true, attributes:true, attributeFilter:['class','style'] });
  }

  function init(){
    if(isGamePage()){
      setGameSession();
      tryNativeLandscapeLock(false);
      bindFirstGestureOnly();
      observeOverlay();
      setTimeout(removeRotateOverlay, 50);
      setTimeout(removeRotateOverlay, 250);
      setTimeout(removeRotateOverlay, 900);
    }else{
      unlockNormalMode();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pageshow', init);
  window.addEventListener('resize', function(){ if(isGamePage()) setGameSession(); });
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ if(isGamePage()) setGameSession(); }, 250); });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) init(); });
  document.addEventListener('click', function(){ if(isGamePage()) removeRotateOverlay(); }, true);
  init();
})();
