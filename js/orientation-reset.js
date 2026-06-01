// JawiKids v1.50.0 - Orientation reset / portrait safe
(function(){
  'use strict';
  function reset(){
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
