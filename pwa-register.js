// JawiKids v1.50.0 - PWA register with portrait-safe cache refresh
(function(){
  'use strict';
  const BUILD_VERSION = '1.50.0';
  function clearOrientationState(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
      sessionStorage.removeItem('jawikids_game_wide_mode');
      sessionStorage.removeItem('jawikids_game_mode');
    }catch(e){}
    try{
      document.documentElement.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked','jk-touch-device');
      if(document.body) document.body.classList.remove('jk-force-landscape','jk-game-wide-mode','jk-wide-preferred-body','jk-child-game-mode-body');
    }catch(e){}
    try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){}
  }
  clearOrientationState();
  window.addEventListener('pageshow', clearOrientationState);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) clearOrientationState(); });

  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js?v=' + BUILD_VERSION, { updateViaCache: 'none' })
        .then(function(reg){
          try{ reg.update(); }catch(e){}
          if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
        })
        .catch(function(){});
    });
    navigator.serviceWorker.addEventListener('controllerchange', function(){ clearOrientationState(); });
  }
})();
