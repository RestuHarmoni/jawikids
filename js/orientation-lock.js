// JawiKids v1.44 - Landscape starts only after child taps Mula Main
(function(){
  'use strict';

  const LEARNING_PAGES = new Set([
    'game-map.html',
    'letter-intro.html',
    'lesson-practice.html',
    'lesson-game.html',
    'lesson-2.html',
    'boss-challenge.html'
  ]);

  const pathRaw = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const path = pathRaw.includes('.') ? pathRaw : (pathRaw ? pathRaw + '.html' : 'index.html');
  const isLearningPage = LEARNING_PAGES.has(path);
  const gameModeRequested = localStorage.getItem('jawikids_game_wide_mode') === '1';

  // Dashboard, profile/child select, support and parent pages stay normal.
  if(!isLearningPage || !gameModeRequested) return;

  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isPhoneTabletSize = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight) <= 1024;
  const isLikelyPc = !isTouch || !isPhoneTabletSize;
  if(isLikelyPc) return;

  document.documentElement.classList.add('jk-touch-device','jk-wide-preferred','jk-child-game-mode');
  document.body && document.body.classList.add('jk-wide-preferred-body','jk-child-game-mode-body');

  function isStandalonePWA(){
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.startsWith('android-app://');
  }

  function ensureOverlay(){
    let overlay = document.getElementById('jkRotateOverlay');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'jkRotateOverlay';
    overlay.className = 'jk-rotate-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML = `
      <div class="jk-rotate-card">
        <div class="jk-rotate-visual" aria-hidden="true">
          <div class="jk-rotate-device"></div>
          <div class="jk-rotate-arrow">↻</div>
        </div>
        <h2>Jom Main Dalam Mode Wide</h2>
        <p>Pusingkan telefon/tablet supaya nama pemain, hati, XP dan soalan nampak dalam satu skrin.</p>
        <button type="button" id="jkTryLandscapeBtn">Aktifkan Wide Mode</button>
        <small>${isStandalonePWA() ? 'App mode aktif: JawiKids akan cuba kekal wide semasa bermain.' : 'Dalam browser biasa, pusing manual mungkin diperlukan.'}</small>
      </div>`;
    document.body.appendChild(overlay);
    const btn = overlay.querySelector('#jkTryLandscapeBtn');
    if(btn) btn.addEventListener('click', lockLandscapeFromUserGesture);
    overlay.addEventListener('click', (e) => {
      if(e.target === overlay) lockLandscapeFromUserGesture();
    });
    return overlay;
  }

  async function requestFullscreenIfNeeded(){
    try{
      const el = document.documentElement;
      if(el.requestFullscreen && !document.fullscreenElement){
        await el.requestFullscreen();
      }
    }catch(e){}
  }

  async function lockLandscapeFromUserGesture(){
    try{
      await requestFullscreenIfNeeded();
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
      }
    }catch(e){
      // iOS Safari dan sebahagian browser tidak benarkan lock. Overlay jadi panduan rotate manual.
    }
    refreshOverlay();
  }

  async function softTryLock(){
    try{
      if(isStandalonePWA() && screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
      }
    }catch(e){}
  }

  function refreshOverlay(){
    const overlay = ensureOverlay();
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.classList.toggle('show', isPortrait);
    document.documentElement.classList.toggle('jk-landscape-active', !isPortrait);
    document.documentElement.classList.toggle('jk-portrait-blocked', isPortrait);
  }

  window.JawiKidsOrientation = {
    lockLandscape: lockLandscapeFromUserGesture,
    refresh: refreshOverlay,
    isStandalonePWA
  };

  window.addEventListener('orientationchange', () => setTimeout(refreshOverlay, 250));
  window.addEventListener('resize', refreshOverlay);
  document.addEventListener('visibilitychange', refreshOverlay);
  document.addEventListener('DOMContentLoaded', () => {
    ensureOverlay();
    refreshOverlay();
    softTryLock().finally(() => setTimeout(refreshOverlay, 600));
  });
})();
