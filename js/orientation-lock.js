// JawiKids v1.42 - Landscape helper for phone/tablet gameplay
(function(){
  'use strict';
  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isSmallDevice = Math.min(window.innerWidth, window.innerHeight) < 900;
  if(!isTouch || !isSmallDevice) return; // PC/laptop tidak diganggu

  document.documentElement.classList.add('jk-touch-device');

  function ensureOverlay(){
    let overlay = document.getElementById('jkRotateOverlay');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'jkRotateOverlay';
    overlay.className = 'jk-rotate-overlay';
    overlay.innerHTML = `
      <div class="jk-rotate-card">
        <div class="jk-rotate-phone">↻</div>
        <h2>Pusingkan skrin</h2>
        <p>JawiKids lebih selesa dalam mode wide untuk bermain.</p>
        <button type="button" id="jkTryLandscapeBtn">Aktifkan Wide Mode</button>
        <small>Jika tidak berubah, pusingkan telefon/tablet secara manual.</small>
      </div>`;
    document.body.appendChild(overlay);
    const btn = overlay.querySelector('#jkTryLandscapeBtn');
    if(btn) btn.addEventListener('click', tryLockLandscape);
    return overlay;
  }

  async function tryLockLandscape(){
    try{
      if(document.documentElement.requestFullscreen && !document.fullscreenElement){
        await document.documentElement.requestFullscreen();
      }
      if(screen.orientation && screen.orientation.lock){
        await screen.orientation.lock('landscape');
      }
    }catch(e){
      // Browser biasa kadang-kadang tidak benarkan lock. Overlay masih jadi panduan.
    }
    refreshOverlay();
  }

  function refreshOverlay(){
    const overlay = ensureOverlay();
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.classList.toggle('show', isPortrait);
  }

  window.addEventListener('orientationchange', refreshOverlay);
  window.addEventListener('resize', refreshOverlay);
  document.addEventListener('DOMContentLoaded', () => {
    ensureOverlay();
    refreshOverlay();
    // Cubaan lembut sahaja; browser mungkin ignore tanpa user gesture.
    setTimeout(() => { if(window.innerHeight > window.innerWidth) tryLockLandscape(); }, 500);
  });
})();
