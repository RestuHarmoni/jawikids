// JawiKids v1.48 - game-page-only orientation lock, activated only by Mula Main
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','letter-intro.html','lesson-practice.html','lesson-game.html','lesson-2.html','boss-challenge.html']);
  function pageName(){ let raw=(location.pathname.split('/').pop()||'index.html').toLowerCase(); return raw.includes('.')?raw:raw+'.html'; }
  function isTouchDevice(){ return matchMedia('(hover: none) and (pointer: coarse)').matches; }
  function isSmallDevice(){ const minSide=Math.min(window.screen.width||window.innerWidth, window.screen.height||window.innerHeight); return minSide<=1024; }
  function isStandalonePWA(){ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true || document.referrer.startsWith('android-app://'); }
  function cleanup(){
    document.getElementById('jkRotateOverlay')?.remove();
    document.documentElement.classList.remove('jk-touch-device','jk-wide-preferred','jk-child-game-mode','jk-landscape-active','jk-portrait-blocked');
    document.body?.classList.remove('jk-wide-preferred-body','jk-child-game-mode-body');
  }
  async function unlockNormalMode(){ cleanup(); try{ if(screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); }catch(e){} try{ if(document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); }catch(e){} }
  function stopGameMode(){ try{ localStorage.removeItem('jawikids_game_wide_mode'); localStorage.removeItem('jawikids_game_mode'); }catch(e){} return unlockNormalMode(); }
  window.JawiKidsOrientation = {
    startGameMode(targetUrl){ try{ localStorage.setItem('jawikids_game_wide_mode','1'); localStorage.setItem('jawikids_game_mode','1'); }catch(e){} window.location.href = targetUrl || 'game-map.html'; },
    stopGameMode, unlockNormalMode, refresh: cleanup, isStandalonePWA
  };
  const isGamePage = GAME_PAGES.has(pageName()) && document.body?.dataset?.jkOrientation === 'game';
  const gameModeOn = localStorage.getItem('jawikids_game_wide_mode') === '1' || localStorage.getItem('jawikids_game_mode') === '1';
  const shouldRun = isGamePage && gameModeOn && isTouchDevice() && isSmallDevice();
  if(!shouldRun){ unlockNormalMode(); return; }
  document.documentElement.classList.add('jk-touch-device','jk-wide-preferred','jk-child-game-mode');
  document.body?.classList.add('jk-wide-preferred-body','jk-child-game-mode-body');
  function ensureOverlay(){
    let overlay=document.getElementById('jkRotateOverlay'); if(overlay) return overlay;
    overlay=document.createElement('div'); overlay.id='jkRotateOverlay'; overlay.className='jk-rotate-overlay'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
    overlay.innerHTML=`<div class="jk-rotate-card"><div class="jk-rotate-visual" aria-hidden="true"><div class="jk-rotate-device"></div><div class="jk-rotate-arrow">↻</div></div><h2>Jom Main Dalam Mode Wide</h2><p>Pusingkan telefon/tablet supaya nama pemain, hati, XP dan soalan nampak dalam satu skrin.</p><button type="button" id="jkTryLandscapeBtn">Aktifkan Wide Mode</button><small>${isStandalonePWA()?'App mode aktif: JawiKids akan cuba kekal wide semasa bermain.':'Dalam browser biasa, pusing manual mungkin diperlukan.'}</small></div>`;
    document.body.appendChild(overlay); overlay.querySelector('#jkTryLandscapeBtn')?.addEventListener('click', lockLandscapeFromGesture); return overlay;
  }
  async function requestFullscreenIfNeeded(){ try{ if(document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); }catch(e){} }
  async function lockLandscapeFromGesture(){ try{ localStorage.setItem('jawikids_game_wide_mode','1'); localStorage.setItem('jawikids_game_mode','1'); }catch(e){} try{ await requestFullscreenIfNeeded(); if(screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); }catch(e){} refreshOverlay(); }
  async function softTryLock(){ try{ if(isStandalonePWA() && screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); }catch(e){} }
  function refreshOverlay(){ const overlay=ensureOverlay(); const isPortrait=window.innerHeight>window.innerWidth; overlay.classList.toggle('show', isPortrait); document.documentElement.classList.toggle('jk-landscape-active', !isPortrait); document.documentElement.classList.toggle('jk-portrait-blocked', isPortrait); }
  window.JawiKidsOrientation.lockLandscape=lockLandscapeFromGesture; window.JawiKidsOrientation.refresh=refreshOverlay;
  window.addEventListener('orientationchange',()=>setTimeout(refreshOverlay,250)); window.addEventListener('resize', refreshOverlay); document.addEventListener('visibilitychange', refreshOverlay);
  document.addEventListener('DOMContentLoaded',()=>{ ensureOverlay(); refreshOverlay(); softTryLock().finally(()=>setTimeout(refreshOverlay,600)); });
})();
