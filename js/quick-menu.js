// JawiKids Quick Menu FAB v1.53.0
// Mobile/tablet compact menu for system pages only. Game pages stay distraction-free.
(function(){
  'use strict';
  const GAME_PAGES = new Set(['game-map.html','lesson-game.html','lesson-practice.html','letter-intro.html','lesson-2.html','boss-challenge.html']);
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (GAME_PAGES.has(file) || document.body?.dataset?.jkOrientation === 'game') return;
  if (document.querySelector('.jk-quick-menu')) return;
  document.body.classList.add('jk-quick-menu-ready');

  const isAdmin = file.startsWith('admin') || document.body.classList.contains('admin-body') || document.querySelector('.admin-nav, .admin-sidebar');

  const parentLinks = [
    ['🏠','Dashboard','parent-dashboard.html'],
    ['👧','Profil Anak','child-select.html'],
    ['🏆','Pencapaian','achievement.html'],
    ['🎁','Ganjaran Harian','daily-reward.html'],
    ['🛒','Kedai Avatar','avatar-shop.html'],
    ['📊','Analytics','parent-analytics.html'],
    ['💳','Bayaran','payment.html'],
    ['📨','Inbox','parent-inbox.html'],
    ['🛟','Bantuan','support.html'],
    ['🤝','Affiliate','affiliate.html']
  ];

  const adminLinks = [
    ['📊','Overview','admin.html'],
    ['👨‍👩‍👧','Users / Parents','admin.html#users'],
    ['📚','Learning Modules','admin.html#modules'],
    ['❓','Questions Bank','admin.html#questions'],
    ['🔊','Audio Manager','admin-audio.html'],
    ['💳','Payments','admin.html#payments'],
    ['🛟','Support Center','admin-support.html'],
    ['🤝','Affiliate','admin-affiliate.html'],
    ['🔔','Notifications','admin.html#notifications'],
    ['⚙️','Settings','admin.html#settings']
  ];

  function isActive(href){
    const target = href.split('#')[0] || file;
    return target.toLowerCase() === file;
  }

  function makeLink(icon,label,href){
    const a = document.createElement('a');
    a.href = href;
    a.className = 'jk-quick-menu-link' + (isActive(href) ? ' active' : '');
    a.innerHTML = `<span class="jk-quick-menu-icon">${icon}</span><span>${label}</span>`;
    a.addEventListener('click', closeMenu);
    return a;
  }

  function closeMenu(){
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '<span aria-hidden="true">⚙️</span>';
  }

  function openMenu(){
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.innerHTML = '<span aria-hidden="true">✕</span>';
  }

  const root = document.createElement('div');
  root.className = 'jk-quick-menu ' + (isAdmin ? 'jk-quick-menu-admin' : 'jk-quick-menu-parent');
  root.setAttribute('data-role','quick-menu');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'jk-quick-menu-toggle';
  toggle.setAttribute('aria-label','Buka menu ringkas JawiKids');
  toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML = '<span aria-hidden="true">⚙️</span>';

  const panel = document.createElement('nav');
  panel.className = 'jk-quick-menu-panel';
  panel.setAttribute('aria-label', isAdmin ? 'Menu admin JawiKids' : 'Menu parent JawiKids');

  const title = document.createElement('div');
  title.className = 'jk-quick-menu-title';
  title.innerHTML = `<strong>${isAdmin ? 'Admin Menu' : 'Quick Menu'}</strong><small>JawiKids</small>`;
  panel.appendChild(title);

  (isAdmin ? adminLinks : parentLinks).forEach(item => panel.appendChild(makeLink(...item)));

  if (!isAdmin){
    const logout = document.createElement('button');
    logout.type = 'button';
    logout.className = 'jk-quick-menu-link jk-quick-menu-logout';
    logout.innerHTML = '<span class="jk-quick-menu-icon">🚪</span><span>Logout</span>';
    logout.addEventListener('click', function(){
      closeMenu();
      if (window.JawiKidsAuth && typeof window.JawiKidsAuth.logoutParent === 'function') window.JawiKidsAuth.logoutParent();
      else location.href = 'login.html';
    });
    panel.appendChild(logout);
  }

  root.appendChild(toggle);
  root.appendChild(panel);
  document.body.appendChild(root);

  toggle.addEventListener('click', function(){
    root.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  document.addEventListener('click', function(e){
    if (!root.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });
})();
