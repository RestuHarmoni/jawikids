/* Pulau Jawi Child Profile Premium Page v2.8
   Focus: parent-friendly profile summary only. No map preview, no shop, no reward panel. */
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

  function stageFromLevel(level){
    if (level >= 8) return 'Pendekar Jawi';
    if (level >= 5) return 'Penjelajah Jawi';
    if (level >= 3) return 'Murid Rajin';
    return 'Pemula Jawi';
  }

  function renderMainStats(child, progressRows, streak){
    const holder = document.getElementById('profileStatGrid');
    if (!holder) return;
    const completed = progressRows.filter(row => row.is_completed).length;
    const totalScore = progressRows.reduce((sum, row) => sum + Number(row.score || 0), 0);
    const accuracy = progressRows.length ? clamp(Math.round(totalScore / Math.max(progressRows.length, 1)), 0, 100) : 0;
    holder.innerHTML = `
      <div class="premium-card app-card profile-stat-tile"><span>🏆</span><strong>${formatNumber(child.total_xp || 0)}</strong><small>Total XP</small></div>
      <div class="premium-card app-card profile-stat-tile"><span>🔥</span><strong>${Number(streak?.current_streak || 0)}</strong><small>Streak Semasa</small></div>
      <div class="premium-card app-card profile-stat-tile"><span>📚</span><strong>${formatNumber(completed)}</strong><small>Lesson Selesai</small></div>
      <div class="premium-card app-card profile-stat-tile"><span>🎯</span><strong>${accuracy}%</strong><small>Ketepatan Jawapan</small></div>`;
  }

  function renderToday(progressRows, child){
    const recentRows = progressRows.slice(0, 3);
    const todayLessons = recentRows.filter(row => row.is_completed).length;
    const minutes = recentRows.length ? Math.max(3, recentRows.length * 3) : 0;
    const todayXp = todayLessons ? todayLessons * 20 : Math.min(50, Math.floor(Number(child.total_xp || 0) / 20));
    setTextAll('[data-today-minutes]', minutes + 'm');
    setTextAll('[data-today-lessons]', todayLessons);
    setTextAll('[data-today-xp]', '+' + todayXp);
  }

  function setSkill(selector, percent){
    const safe = clamp(Number(percent || 0), 0, 100);
    setTextAll(selector, safe + '%');
    const row = document.querySelector(selector)?.closest('.skill-row');
    const fill = row?.querySelector('em i');
    if (fill) requestAnimationFrame(() => { fill.style.width = safe + '%'; });
  }

  function renderSkills(child, progressRows){
    const xp = Number(child.total_xp || 0);
    const completed = progressRows.filter(row => row.is_completed).length;
    const letters = clamp(Math.max(completed * 6, Math.floor(xp / 8)), 0, 100);
    const words = clamp(Math.max(completed * 4, Math.floor(xp / 14)), 0, 100);
    const sentences = clamp(Math.max(completed * 2, Math.floor(xp / 28)), 0, 100);
    setSkill('[data-skill-letters]', letters);
    setSkill('[data-skill-words]', words);
    setSkill('[data-skill-sentences]', sentences);
  }

  function renderAchievements(items){
    const holder = document.getElementById('profileAchievementList');
    if (!holder) return;
    if (!items.length) {
      holder.innerHTML = '<div class="achievement-mini-item muted-achievement"><span>🏆</span><div><strong>Belum ada pencapaian</strong><small>Badge akan muncul selepas anak melengkapkan aktiviti.</small></div></div>';
      return;
    }
    holder.innerHTML = items.slice(0, 5).map(item => {
      const a = item.achievement || {};
      const icon = a.icon || a.badge_icon || '🏆';
      return `<a class="achievement-mini-item" href="achievement.html"><span>${escapeHtml(icon)}</span><div><strong>${escapeHtml(a.title || a.name || 'Pencapaian Pulau Jawi')}</strong><small>${escapeHtml(a.description || 'Tahniah! Anak berjaya buka badge baru.')}</small></div></a>`;
    }).join('');
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

    const savedChildId = localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id');
    const [{ data: children, error: childError }, unreadCount] = await Promise.all([
      supabase
        .from('children')
        .select('id,name,age,gender,avatar_key,total_xp,current_island,hearts,created_at')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true }),
      loadUnreadCount(supabase, user.id)
    ]);

    setTextAll('[data-inbox-count]', unreadCount);

    if (childError) return status('Gagal baca profil anak: ' + childError.message, 'error');
    const rows = children || [];
    if (!rows.length) {
      status('Belum ada profil anak. Sila tambah anak dahulu.', 'info');
      document.querySelector('.child-profile-main')?.insertAdjacentHTML('afterbegin', '<section class="premium-card app-card"><h2>Belum ada anak</h2><p>Tambah anak pertama untuk mula menggunakan Profil Anak Pulau Jawi.</p><a class="primary-btn" href="child-select.html">Tambah Anak</a></section>');
      return;
    }

    const child = rows.find(row => row.id === savedChildId) || rows[0];
    localStorage.setItem('jawikids_selected_child_id', child.id);
    localStorage.setItem('selected_child_id', child.id);

    const [streakRes, progressRes, achievementRes] = await Promise.all([
      supabase.from('streaks').select('child_id,current_streak,longest_streak,last_activity_date').eq('child_id', child.id).maybeSingle(),
      supabase.from('child_progress').select('child_id,is_completed,score,updated_at,created_at').eq('child_id', child.id).order('updated_at', { ascending: false }).limit(200),
      supabase.from('child_achievements').select('id,child_id,unlocked_at,achievement:achievements(title,name,description,icon,badge_icon)').eq('child_id', child.id).order('unlocked_at', { ascending: false }).limit(5)
    ]);

    const streak = streakRes.data || { current_streak: 0, longest_streak: 0 };
    const progressRows = progressRes.data || [];
    const achievements = achievementRes.data || [];
    const xp = Number(child.total_xp || 0);
    const level = levelFromXp(xp);

    setTextAll('[data-child-name]', child.name || 'Anak Pulau Jawi');
    setTextAll('[data-child-age]', child.age ? child.age + ' tahun' : '-');
    setTextAll('[data-child-level]', 'Lv ' + level);
    setTextAll('[data-child-stage]', stageFromLevel(level));
    setTextAll('[data-child-xp-short]', formatNumber(xp) + ' XP');

    const avatar = document.getElementById('childProfileAvatar');
    if (avatar) {
      avatar.src = avatarFor(child);
      avatar.alt = 'Avatar ' + (child.name || 'anak');
    }

    const chooseBtn = document.getElementById('chooseAndPlayBtn');
    if (chooseBtn) {
      chooseBtn.addEventListener('click', () => {
        localStorage.setItem('jawikids_selected_child_id', child.id);
        localStorage.setItem('selected_child_id', child.id);
        localStorage.setItem('pulau_jawi_selected_child', JSON.stringify({
          id: child.id,
          name: child.name,
          age: child.age,
          gender: child.gender,
          avatar_key: child.avatar_key,
          current_island: child.current_island || 1,
          total_xp: child.total_xp || 0
        }));
      });
    }

    renderMainStats(child, progressRows, streak);
    renderToday(progressRows, child);
    renderSkills(child, progressRows);
    renderAchievements(achievements);

    status('Profil anak berjaya dimuatkan.', 'success');
  }

  document.addEventListener('DOMContentLoaded', loadChildProfile);
})();
