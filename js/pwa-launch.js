// JawiKids PWA Launch Router v1.45
(function () {
  'use strict';
  const status = document.getElementById('launchStatus');
  function setStatus(text){ if(status) status.textContent = text; }
  function go(url){ window.location.replace(url); }

  async function route(){
    try {
      setStatus('Menyemak sesi parent...');
      const supabase = window.jawiSupabase;
      if(!supabase){ setStatus('Sambungan belum sedia. Membuka login...'); setTimeout(() => go('login.html'), 650); return; }
      const { data, error } = await supabase.auth.getSession();
      if(error || !data || !data.session){ setStatus('Sila login dahulu.'); setTimeout(() => go('login.html'), 650); return; }
      setStatus('Selamat datang semula! Membuka dashboard...');
      setTimeout(() => go('parent-dashboard.html?source=pwa'), 650);
    } catch (err) {
      console.warn('JawiKids PWA launch route error:', err);
      setStatus('Membuka login...');
      setTimeout(() => go('login.html'), 650);
    }
  }
  document.addEventListener('DOMContentLoaded', route);
})();
