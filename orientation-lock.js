// JawiKids v1.49.2 - NO FORCE ROTATE orientation helper
// Purpose: Never force device rotation. Game pages only show a friendly wide-mode guide.
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

  function isGamePage(){
    return GAME_PAGES.has(pageName()) && document.body && document.body.dataset.jkOrientation === 'game';
  }

  function isTouchDevice(){
    return window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  function hasGameModeFlag(){
    try{
      return localStorage.getItem('jawikids_game_wide_mode') === '1' ||
        localStorage.getItem('jawikids_game_mode') === '1';
    }catch(e){ return false; }
  }

  function setGameModeFlag(){
    try{
      localStorage.setItem('jawikids_game_wide_mode', '1');
      localStorage.setItem('jawikids_game_mode', '1');
    }catch(e){}
  }

  function clearGameModeFlag(){
    try{
      localStorage.removeItem('jawikids_game_wide_mode');
      localStorage.removeItem('jawikids_game_mode');
    }catch(e){}
  }

  function cleanupClasses(){
    const overlay = document.getElementById('jkRotateOverlay');
    if(overlay) overlay.remove();
    document.documentElement.classList.remove(
      'jk-touch-device',
      'jk-wide-preferred',
      'jk-child-game-mode',
      'jk-landscape-active',
      'jk-portrait-blocked',
      'jk-force-landscape',
      'jk-game-wide-mode'
    );
    if(document.body){
      document.body.classList.remove(
        'jk-wide-preferred-body',
        'jk-child-game-mode-body',
        'jk-force-landscape',
        'jk-game-wide-mode'
      );
      document.body.style.transform = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
  }

  function unlockOrientation(){
    cleanupClasses();
    // IMPORTANT: no screen.orientation.lock() is used anywhere in this file.
    try{
      if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
    }catch(e){}
  }

  function stopGameMode(){
    clearGameModeFlag();
    unlockOrientation();
  }

  window.JawiKidsOrientation = {
    startGameMode(targetUrl){
      setGameModeFlag();
      window.location.href = targetUrl || 'game-map.html';
    },
    stopGameMode,
    unlockNormalMode: unlockOrientation,
    lockLandscape(){
      // Backward-compatible function name only. It does NOT lock screen anymore.
      setGameModeFlag();
      refreshOverlay();
    },
    refresh(){}
  };

  if(!isGamePage()){
    stopGameMode();
    return;
  }

  if(!hasGameModeFlag() || !isTouchDevice()){
    unlockOrientation();
    return;
  }

  document.documentElement.classList.add('jk-touch-device', 'jk-child-game-mode');
  if(document.body) document.body.classList.add('jk-child-game-mode-body');

  function ensureOverlay(){
    let overlay = document.getElementById('jkRotateOverlay');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'jkRotateOverlay';
    overlay.className = 'jk-rotate-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML = '<div class="jk-rotate-card">' +
      '<div class="jk-rotate-visual" aria-hidden="true"><div class="jk-rotate-device"></div><div class="jk-rotate-arrow">↻</div></div>' +
      '<h2>Mode Wide Pilihan</h2>' +
      '<p>Telefon tidak akan dipaksa rotate. Pusing manual jika mahu skrin permainan lebih luas.</p>' +
      '<button type="button" id="jkContinuePortraitBtn">Teruskan Portrait</button>' +
      '<small>Dashboard dan profil akan kekal ikut orientation device.</small>' +
      '</div>';
    document.body.appendChild(overlay);
    const btn = overlay.querySelector('#jkContinuePortraitBtn');
    if(btn) btn.addEventListener('click', () => overlay.classList.remove('show'));
    return overlay;
  }

  function refreshOverlay(){
    const isPortrait = window.innerHeight > window.innerWidth;
    document.documentElement.classList.toggle('jk-landscape-active', !isPortrait);
    document.documentElement.classList.toggle('jk-wide-preferred', !isPortrait);
    if(document.body) document.body.classList.toggle('jk-wide-preferred-body', !isPortrait);
    const overlay = ensureOverlay();
    overlay.classList.toggle('show', isPortrait);
  }

  window.JawiKidsOrientation.refresh = refreshOverlay;
  window.addEventListener('orientationchange', () => setTimeout(refreshOverlay, 250));
  window.addEventListener('resize', refreshOverlay);
  document.addEventListener('DOMContentLoaded', refreshOverlay);
  if(document.readyState !== 'loading') refreshOverlay();
})();
