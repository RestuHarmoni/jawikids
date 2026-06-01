// JawiKids v1.43 - PWA Landscape Mode + Rotate Overlay
(function(){
  'use strict';

  const GAME_PAGES = new Set([
    'parent-dashboard.html',
    'child-select.html',
    'game-map.html',
    'letter-intro.html',
    'lesson-practice.html',
    'lesson-game.html',
    'lesson-2.html',
    'boss-challenge.html'
  ]);

  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const shouldRun = GAME_PAGES.has(path) || path === 'game-map' || path === 'lesson-game' || path === 'letter-intro';
  if(!shouldRun) return;

  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isPhoneTabletSize = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight) <= 1024;
  const isLikelyPc = !isTouch || !isPhoneTabletSize;
  if(isLikelyPc) return;

  document.documentElement.classList.add('jk-touch-device','jk-wide-preferred');
  document.body && document.body.classList.add('jk-wide-preferred-body');

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
        <h2>Mode Wide Lebih Selesa</h2>
        <p>Pusingkan telefon/tablet supaya Zafri, hati, XP dan soalan nampak dalam satu skrin.</p>
        <button type="button" id="jkTryLandscapeBtn">Aktifkan Wide Mode</button>
        <small>${isStandalonePWA() ? 'PWA aktif: JawiKids akan cuba buka dalam landscape.' : 'Untuk auto landscape lebih baik, install JawiKids sebagai app PWA.'}</small>
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
      if(el.requestFullscreen && !document.fullscreenElement && isStandalonePWA()){
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
      // iOS Safari dan sebahagian browser biasa tidak benarkan lock; overlay kekal sebagai panduan rotate manual.
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
