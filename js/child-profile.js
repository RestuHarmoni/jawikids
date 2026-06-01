/* JawiKids Child Profile Premium Page v1.55.0
   UI/read-only profile rendering. Does not modify auth, payment, game logic, XP engine, or RLS. */
(function(){
  'use strict';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const formatNumber = (num) => Number(num || 0).toLocaleString('ms-MY');
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
  const setTextAll = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  const status = (msg, type='info') => {
    const el = document.getElementById('childProfileStatus');
    if (!el) return;
    el.textContent = msg;
    el.dataset.type = type;
  };

  const avatarFor = (child) => {
    const key = (child?.avatar_key || '').toLowerCase();
    const gender = (child?.gender || '').toLowerCase();
    return key.includes('zainab') || gender.includes('female') || gender.includes('perempuan')
      ? 'assets/characters/zainab-main.svg'
      : 'assets/characters/zafri-main.svg';
  };

  function levelFromXp(xp){
    const safeXp = Number(xp || 0);
    return Math.max(1, Math.floor(safeXp / 500) + 1);
  }

  function renderHearts(hearts){
    const total = 5;
    const active = clamp(Number(hearts ?? 5), 0, total);
    return Array.from({length: total}, (_, idx) => idx < active ? '❤️' : '🤍').join('');
  }

  function renderIslandTrack(currentIsland){
    const holder = document.getElementById('profileIslandTrack');
    if (!holder) return;
    const current = clamp(Number(currentIsland || 1), 1, 10);
    holder.innerHTML = Array.from({length: 10}, (_, idx) => {
      const island = idx + 1;
      const state = island < current ? 'done' : island === current ? 'current' : 'locked';
      const icon = state === 'done' ? '✅' : state === 'current' ? '🔄' : '🔒';
      return `<div class="profile-island-step ${state}"><span>🏝️</span><strong>Pulau ${island}</strong><small>${icon}</small></div>`;
    }).join('');
  }

  function renderStats(child, progressRows, streak){
    const holder = document.getElementById('profileStatGrid');
    if (!holder) return;
    const completed = progressRows.filter(row => row.is_completed).length;
    const totalScore = progressRows.reduce((sum, row) => sum + Number(row.score || 0), 0);
    const accuracy = progressRows.length ? clamp(Math.round(totalScore / Math.max(progressRows.length, 1)), 0, 100) : (completed ? 85 : 0);
    const minutes = progressRows.length ? Math.max(10, progressRows.length * 3) : Math.min(60, Math.ceil(Number(child.total_xp || 0) / 20));
    holder.innerHTML = `
      <div><span>📚</span><strong>${formatNumber(progressRows.length || completed)}</strong><small>Aktiviti / Soalan</small></div>
      <div><span>🎯</span><strong>${accuracy}%</strong><small>Ketepatan</small></div>
      <div><span>⏱️</span><strong>${minutes}m</strong><small>Masa belajar</small></div>
      <div><span>🔥</span><strong>${Number(streak?.current_streak || 0)}</strong><small>Streak</small></div>`;
  }

  function renderAchievements(items){
    const holder = document.getElementById('profileAchievementList');
    if (!holder) return;
    if (!items.length) {
      holder.innerHTML = '<div class="achievement-mini-item muted-achievement"><span>🏆</span><div><strong>Belum ada pencapaian</strong><small>Badge akan muncul selepas anak melengkapkan aktiviti.</small></div></div>';
      return;
    }
    holder.innerHTML = items.slice(0, 3).map(item => {
      const a = item.achievement || {};
      const icon = a.icon || a.badge_icon || '🏆';
      return `<a class="achievement-mini-item" href="achievement.html"><span>${escapeHtml(icon)}</span><div><strong>${escapeHtml(a.title || a.name || 'Pencapaian JawiKids')}</strong><small>${escapeHtml(a.description || 'Tahniah! Anak berjaya buka badge baru.')}</small></div></a>`;
    }).join('');
  }

  function renderRewards(achievementCount){
    const holder = document.getElementById('rewardSummaryGrid');
    if (!holder) return;
    holder.innerHTML = `
      <div><span>🎁</span><strong>${Math.min(achievementCount + 2, 99)}</strong><small>Reward Dibuka</small></div>
      <div><span>🛍️</span><strong>${Math.min(achievementCount, 99)}</strong><small>Avatar Item</small></div>
      <div><span>🏅</span><strong>${achievementCount}</strong><small>Badge</small></div>`;
  }

  async function loadUnreadCount(supabase, userId){
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('is_read', false)
      .limit(20);
    if (error) return 0;
    return (data || []).length;
  }

  async function loadChildProfile(){
    const supabase = window.getJawiSupabase?.();
    if (!supabase) return status('Supabase belum bersambung. Semak js/supabase-client.js.', 'error');

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    const user = session.user;

    const savedChildId = localStorage.getItem('jawikids_selected_child_id');
    let childQuery = supabase
      .from('children')
      .select('id,name,age,gender,avatar_key,total_xp,current_island,hearts,created_at')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true });

    const [{ data: children, error: childError }, unreadCount] = await Promise.all([
      childQuery,
      loadUnreadCount(supabase, user.id)
    ]);

    setTextAll('[data-inbox-count]', unreadCount);

    if (childError) return status('Gagal baca profil anak: ' + childError.message, 'error');
    const rows = children || [];
    if (!rows.length) {
      status('Belum ada profil anak. Sila tambah anak dahulu.', 'info');
      document.querySelector('.child-profile-grid')?.insertAdjacentHTML('afterbegin', '<section class="premium-card app-card"><h2>Belum ada anak</h2><p>Tambah anak pertama untuk mula menggunakan profil premium.</p><a class="primary-btn" href="child-select.html">Tambah Anak</a></section>');
      return;
    }

    const child = rows.find(row => row.id === savedChildId) || rows[0];
    localStorage.setItem('jawikids_selected_child_id', child.id);

    const [streakRes, progressRes, achievementRes] = await Promise.all([
      supabase.from('streaks').select('child_id,current_streak,longest_streak,last_activity_date').eq('child_id', child.id).maybeSingle(),
      supabase.from('child_progress').select('child_id,is_completed,score,updated_at,created_at').eq('child_id', child.id).order('updated_at', { ascending: false }).limit(200),
      supabase.from('child_achievements').select('id,child_id,unlocked_at,achievement:achievements(title,name,description,icon,badge_icon)').eq('child_id', child.id).order('unlocked_at', { ascending: false }).limit(3)
    ]);

    const streak = streakRes.data || { current_streak: 0, longest_streak: 0 };
    const progressRows = progressRes.data || [];
    const achievements = achievementRes.data || [];
    const xp = Number(child.total_xp || 0);
    const level = levelFromXp(xp);
    const currentLevelXp = (level - 1) * 500;
    const nextLevelXp = level * 500;
    const percent = clamp(Math.round(((xp - currentLevelXp) / 500) * 100), 0, 100);

    setTextAll('[data-child-name]', child.name || 'Anak JawiKids');
    setTextAll('[data-child-level]', 'Lv ' + level);
    setTextAll('[data-child-xp-short]', formatNumber(xp) + ' XP');
    setTextAll('[data-child-xp]', formatNumber(xp));
    setTextAll('[data-child-next-xp]', formatNumber(nextLevelXp));
    setTextAll('[data-child-island]', 'Pulau ' + (child.current_island || 1));
    setTextAll('[data-child-streak]', Number(streak.current_streak || 0));

    const avatar = document.getElementById('childProfileAvatar');
    if (avatar) {
      avatar.src = avatarFor(child);
      avatar.alt = 'Avatar ' + (child.name || 'anak');
    }

    const xpFill = document.getElementById('profileXpFill');
    if (xpFill) requestAnimationFrame(() => { xpFill.style.width = percent + '%'; });
    const xpPercent = document.getElementById('profileXpPercent');
    if (xpPercent) xpPercent.textContent = percent + '%';

    const heartRow = document.getElementById('profileHeartRow');
    if (heartRow) heartRow.textContent = renderHearts(child.hearts);
    const heartText = document.getElementById('profileHeartText');
    if (heartText) heartText.textContent = `${clamp(Number(child.hearts ?? 5), 0, 5)} / 5`;

    const streakFire = document.getElementById('streakFireRow');
    if (streakFire) streakFire.textContent = Number(streak.current_streak || 0) ? '🔥'.repeat(clamp(Number(streak.current_streak || 0), 1, 12)) : '🔥';

    document.querySelectorAll('#continueLearningBtn,#openIslandMapBtn').forEach(link => {
      link.addEventListener('click', () => localStorage.setItem('jawikids_selected_child_id', child.id));
    });

    renderIslandTrack(child.current_island || 1);
    renderStats(child, progressRows, streak);
    renderAchievements(achievements);
    renderRewards(achievements.length);

    status('Profil anak premium berjaya dimuatkan.', 'success');
  }

  document.addEventListener('DOMContentLoaded', loadChildProfile);
})();
