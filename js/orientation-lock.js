// JawiKids v1.49 - Game wide guide only, no forced auto-rotate
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','letter-intro.html','lesson-practice.html','lesson-game.html','lesson-2.html','boss-challenge.html']);
  function pageName(){ let raw=(location.pathname.split('/').pop()||'index.html').toLowerCase(); return raw.includes('.')?raw:raw+'.html'; }
  const isGamePage = GAME_PAGES.has(pageName()) && document.body && document.body.dataset.jkOrientation === 'game';
  const gameMode = localStorage.getItem('jawikids_game_wide_mode') === '1' || localStorage.getItem('jawikids_game_mode') === '1';
  if(!isGamePage || !gameMode) return;
  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isSmallDevice = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight) <= 1180;
  if(!isTouch || !isSmallDevice) return;
  document.documentElement.classList.add('jk-child-game-mode','jk-wide-guide-enabled');
  document.body.classList.add('jk-child-game-mode-body','jk-wide-guide-enabled-body');
  function ensureOverlay(){
    let overlay=document.getElementById('jkRotateOverlay'); if(overlay) return overlay;
    overlay=document.createElement('div'); overlay.id='jkRotateOverlay'; overlay.className='jk-rotate-overlay';
    overlay.innerHTML=`<div class="jk-rotate-card"><div class="jk-rotate-visual" aria-hidden="true"><div class="jk-rotate-device"></div><div class="jk-rotate-arrow">↻</div></div><h2>Pusingkan Peranti</h2><p>Untuk game JawiKids, pusing telefon/tablet ke mode wide supaya nama pemain, hati, XP dan soalan muat dalam satu skrin.</p><button type="button" id="jkContinuePortraitBtn">Teruskan Dulu</button><small>Browser iPhone/Android tidak sentiasa benarkan app paksa rotate. Pusing manual paling stabil.</small></div>`;
    document.body.appendChild(overlay);
    const btn=overlay.querySelector('#jkContinuePortraitBtn'); if(btn) btn.addEventListener('click',()=>overlay.classList.remove('show'));
    return overlay;
  }
  function refresh(){ const isPortrait=window.innerHeight>window.innerWidth; document.documentElement.classList.toggle('jk-game-landscape-view',!isPortrait); document.documentElement.classList.toggle('jk-game-portrait-view',isPortrait); ensureOverlay().classList.toggle('show',isPortrait); }
  window.JawiKidsOrientation={refresh,unlock:function(){}};
  window.addEventListener('resize',refresh); window.addEventListener('orientationchange',()=>setTimeout(refresh,250)); document.addEventListener('DOMContentLoaded',refresh);
})();
