
/*
  JawiKids v1.17 Beta Completion Features
  Demo-safe frontend behaviour only.
  Production integration target: Supabase tables in 007_beta_completion_features.sql
*/
(function(){
  const claimBtn = document.querySelector('[data-claim-daily]');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      claimBtn.textContent = 'Ganjaran Telah Diclaim ✅';
      claimBtn.disabled = true;
      showBetaToast('🎁 Daily Reward', 'Tahniah! +40 XP telah ditambah ke akaun demo.');
    });
  }

  document.querySelectorAll('.shop-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.shopFilter;
      document.querySelectorAll('[data-shop-item]').forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.shopItem === filter) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.shop-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = 'Preview Tebus ✅';
      showBetaToast('🎒 Kedai Avatar', 'Item ini akan ditebus menggunakan XP apabila Supabase disambungkan.');
    });
  });

  function showBetaToast(title, message){
    let toast = document.getElementById('betaToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'betaToast';
      toast.className = 'slide-notification show';
      toast.innerHTML = '<span>🔔</span><div><strong></strong><small></small></div><button type="button">×</button>';
      document.body.appendChild(toast);
      toast.querySelector('button').addEventListener('click', () => toast.classList.remove('show'));
    }
    toast.querySelector('strong').textContent = title;
    toast.querySelector('small').textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__betaToastTimer);
    window.__betaToastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }
})();
