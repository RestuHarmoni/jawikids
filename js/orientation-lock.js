// Pulau Jawi v3.4 - Stable Game Session Orientation
// Goal: Game pages stay in one stable wide-game session from map -> lesson -> boss.
// No repeated "please rotate" popup during questions/answer taps.
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

  function setGameSession(){
    try{
      sessionStorage.setItem('pulau_jawi_game_session', '1');
      sessionStorage.setItem('jawikids_game_mode', '1');
      sessionStorage.setItem('jawikids_game_wide_mode', '1');
      localStorage.setItem('jawikids_game_wide_mode', '1');
    }catch(e){}

    document.documentElement.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active');
    document.documentElement.classList.toggle('pj-device-landscape', isLandscape());
    document.documentElement.classList.toggle('pj-device-portrait', !isLandscape());

    if(document.body){
      document.body.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode');
      document.body.classList.toggle('pj-device-landscape', isLandscape());
      document.body.classList.toggle('pj-device-portrait', !isLandscape());
    }
  }

  function clearGameSession(){
    try{
      sessionStorage.removeItem('pulau_jawi_game_session');
      sessionStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    document.documentElement.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device');
    if(document.body){
      document.body.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device');
    }
    const overlay = document.getElementById('jkRotateOverlay');
    if(overlay) overlay.remove();
  }

  async function tryNativeLandscapeLock(fromUserGesture){
    if(!isGamePage()) return false;
    setGameSession();
    try{
      // Native lock mostly works in Android PWA/fullscreen. It often fails in normal Chrome/Safari.
      if(fromUserGesture && !document.fullscreenElement && document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(()=>null);
      }
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
        setGameSession();
        return true;
      }
    }catch(e){
      // Silent fallback. Do not show rotate popup repeatedly.
    }
    setGameSession();
    return false;
  }

  function bindFirstGestureOnly(){
    if(window.__pulauJawiOrientationBound) return;
    window.__pulauJawiOrientationBound = true;
    const once = function(){ tryNativeLandscapeLock(true); };
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
    isStandalonePWA(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || document.referrer.startsWith('android-app://');
    }
  };

  function init(){
    if(isGamePage()){
      setGameSession();
      tryNativeLandscapeLock(false);
      bindFirstGestureOnly();
    }else{
      unlockNormalMode();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pageshow', init);
  window.addEventListener('resize', setGameSession);
  window.addEventListener('orientationchange', function(){ setTimeout(setGameSession, 250); });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) init(); });
  init();
})();
