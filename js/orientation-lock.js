// Pulau Jawi v3.7 - Silent Stable Game Session
// Policy: rotate guidance appears only before game entry from Child Profile.
// Game pages must NEVER show a rotate prompt/overlay again.
(function(){
  'use strict';

  const GAME_PATHS = ['game-map', 'lesson-game', 'lesson-practice', 'lesson-2', 'letter-intro', 'boss-challenge', 'future-mini-games'];

  function isGamePage(){
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    const last = (path.split('/').pop() || '').replace('.html','');
    return GAME_PATHS.includes(last) || document.body?.dataset?.jkOrientation === 'game';
  }
  function isLandscape(){ return window.matchMedia && window.matchMedia('(orientation: landscape)').matches; }

  function killRotateOverlay(){
    try{
      document.querySelectorAll('#jkRotateOverlay,.jk-rotate-overlay,.rotate-overlay,.orientation-overlay,[data-rotate-overlay]').forEach(el=>{
        el.classList.remove('show','active','is-active','visible');
        el.setAttribute('aria-hidden','true');
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('opacity','0','important');
        el.style.setProperty('pointer-events','none','important');
        if(el.id === 'jkRotateOverlay' || el.classList.contains('jk-rotate-overlay') || el.dataset.rotateOverlay !== undefined){
          try{ el.remove(); }catch(_e){}
        }
      });
    }catch(e){}
  }

  function markGameSession(){
    try{
      sessionStorage.setItem('pulau_jawi_game_session','1');
      sessionStorage.setItem('jawikids_game_mode','1');
      sessionStorage.setItem('jawikids_game_wide_mode','1');
      sessionStorage.setItem('pulau_jawi_rotate_prompt_done','1');
      localStorage.setItem('jawikids_game_wide_mode','1');
      localStorage.setItem('pulau_jawi_rotate_prompt_done','1');
    }catch(e){}

    document.documentElement.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active','pj-no-rotate-popup','pj-silent-game-session');
    document.documentElement.classList.toggle('pj-device-landscape', isLandscape());
    document.documentElement.classList.toggle('pj-device-portrait', !isLandscape());
    if(document.body){
      document.body.classList.add('pj-game-session','jk-force-landscape','jk-game-wide-mode','pj-no-rotate-popup','pj-silent-game-session');
      document.body.classList.toggle('pj-device-landscape', isLandscape());
      document.body.classList.toggle('pj-device-portrait', !isLandscape());
    }
    killRotateOverlay();
  }

  async function silentLandscapeLock(fromGesture){
    if(!isGamePage()) return false;
    markGameSession();
    try{
      if(fromGesture && !document.fullscreenElement && document.documentElement.requestFullscreen){
        await document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>null);
      }
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
        markGameSession();
        return true;
      }
    }catch(e){}
    markGameSession();
    return false;
  }

  async function unlockNormalMode(){
    try{
      sessionStorage.removeItem('pulau_jawi_game_session');
      sessionStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    document.documentElement.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','jk-landscape-active','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device','pj-no-rotate-popup','pj-silent-game-session');
    if(document.body){
      document.body.classList.remove('pj-game-session','jk-force-landscape','jk-game-wide-mode','pj-device-landscape','pj-device-portrait','jk-portrait-blocked','jk-touch-device','pj-no-rotate-popup','pj-silent-game-session');
    }
    killRotateOverlay();
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
    try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){}
  }

  window.PulauJawiOrientation = window.JawiKidsOrientation = {
    startGameMode(targetUrl){
      markGameSession();
      silentLandscapeLock(true).finally(()=>{ window.location.href = targetUrl || 'game-map.html'; });
    },
    stopGameMode: unlockNormalMode,
    unlockNormalMode,
    lockLandscape(){ return silentLandscapeLock(true); },
    refresh(){ if(isGamePage()) markGameSession(); else unlockNormalMode(); },
    removeRotateOverlay: killRotateOverlay,
    isStandalonePWA(){
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || document.referrer.startsWith('android-app://');
    }
  };

  function bindGesture(){
    if(window.__pulauJawiSilentOrientationBound) return;
    window.__pulauJawiSilentOrientationBound = true;
    const handler = ()=>{ if(isGamePage()) silentLandscapeLock(true); killRotateOverlay(); };
    document.addEventListener('pointerdown', handler, {passive:true});
    document.addEventListener('touchend', handler, {passive:true});
    document.addEventListener('click', handler, {passive:true, capture:true});
  }

  function observe(){
    if(window.__pulauJawiNoRotateObserver) return;
    window.__pulauJawiNoRotateObserver = true;
    try{
      const mo = new MutationObserver(killRotateOverlay);
      mo.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style']});
    }catch(e){}
  }

  function init(){
    if(isGamePage()){
      markGameSession();
      silentLandscapeLock(false);
      bindGesture();
      observe();
      [0,50,200,600,1200,2500].forEach(t=>setTimeout(killRotateOverlay,t));
    }else{
      unlockNormalMode();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pageshow', init);
  window.addEventListener('resize', ()=>{ if(isGamePage()) markGameSession(); });
  window.addEventListener('orientationchange', ()=>setTimeout(()=>{ if(isGamePage()) markGameSession(); }, 180));
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) init(); });
  init();
})();
