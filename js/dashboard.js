/* Pulau Jawi Dashboard Live Sync v2.7 - simplified parent dashboard */
(function () {
  const avatarFor = (child) => {
    const key = (child.avatar_key || '').toLowerCase();
    const gender = (child.gender || '').toLowerCase();
    return key.includes('zainab') || gender.includes('female') || gender.includes('perempuan')
      ? 'assets/characters/zainab-main.svg'
      : 'assets/characters/zafri-main.svg';
  };

  const formatNumber = (num) => Number(num || 0).toLocaleString('ms-MY');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const setTextAll = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  const status = (msg, type='info') => {
    const el = document.getElementById('dashboardStatus');
    if (!el) return;
    el.textContent = msg;
    el.dataset.type = type;
  };

  async function loadUnreadNotifications(supabase, userId) {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id,is_read,notification:notifications(title,message,type,created_at)')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.warn('Inbox preview warning:', error.message);
      return [];
    }
    return data || [];
  }

  function renderInbox(items) {
    const list = document.getElementById('dashboardInboxList');
    if (!list) return;
    if (!items.length) {
      list.innerHTML = '<div class="mini-inbox-item"><span>🔔</span><div><strong>Tiada mesej baru</strong><small>Notifikasi akan muncul di sini.</small></div></div>';
      return;
    }
    list.innerHTML = items.map(item => {
      const n = item.notification || {};
      return `<a href="parent-inbox.html" class="mini-inbox-item unread"><span>🔔</span><div><strong>${escapeHtml(n.title || 'Notifikasi Pulau Jawi')}</strong><small>${escapeHtml(n.message || '')}</small></div></a>`;
    }).join('');
    const first = items[0]?.notification;
    if (first) {
      const slide = document.getElementById('slideNotification');
      const slideText = document.getElementById('slideNotificationText');
      if (slide && slideText) {
        slideText.textContent = first.title || 'Notifikasi baru diterima.';
        setTimeout(() => slide.classList.add('show'), 900);
      }
    }
  }

  async function loadDashboard() {
    const supabase = window.getJawiSupabase?.();
    if (!supabase) return status('Supabase belum bersambung. Semak js/supabase-client.js.', 'error');

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    const user = session.user;
    if (window.JawiKidsAuth?.ensureParentProfile) await window.JawiKidsAuth.ensureParentProfile();

    const [{ data: profile, error: profileError }, { data: children, error: childrenError }, inboxItems] = await Promise.all([
      supabase.from('profiles').select('id,full_name,subscription_type,subscription_status,premium_lifetime,max_children,concurrent_session_limit').eq('id', user.id).maybeSingle(),
      supabase.from('children').select('id,name,age,gender,avatar_key,total_xp,current_island,hearts,created_at').eq('parent_id', user.id).order('created_at', { ascending: true }),
      loadUnreadNotifications(supabase, user.id)
    ]);

    if (profileError) console.warn('Profile warning:', profileError.message);
    const safeProfile = profile || {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Parent Pulau Jawi',
      subscription_status: 'inactive',
      premium_lifetime: false,
      max_children: 3,
      concurrent_session_limit: 5
    };
    if (childrenError) {
      status('Gagal baca profil anak: ' + childrenError.message, 'error');
      return;
    }

    const childRows = children || [];
    const childIds = childRows.map(c => c.id);
    let streaks = [];
    let progress = [];

    if (childIds.length) {
      const [streakRes, progressRes] = await Promise.all([
        supabase.from('streaks').select('child_id,current_streak,longest_streak,last_activity_date').in('child_id', childIds),
        supabase.from('child_progress').select('child_id,is_completed,score').in('child_id', childIds)
      ]);
      if (!streakRes.error) streaks = streakRes.data || [];
      if (!progressRes.error) progress = progressRes.data || [];
    }

    const streakByChild = new Map(streaks.map(s => [s.child_id, s]));
    const progressByChild = progress.reduce((acc, row) => {
      acc[row.child_id] ||= { completed: 0, score: 0 };
      if (row.is_completed) acc[row.child_id].completed += 1;
      acc[row.child_id].score += Number(row.score || 0);
      return acc;
    }, {});

    const maxChildren = safeProfile?.max_children || 3;
    const totalXp = childRows.reduce((sum, c) => sum + Number(c.total_xp || 0), 0);
    const bestStreak = streaks.reduce((max, s) => Math.max(max, Number(s.current_streak || 0), Number(s.longest_streak || 0)), 0);
    const premiumText = safeProfile?.premium_lifetime ? 'Premium' : (safeProfile?.subscription_status === 'active' ? 'Active' : 'Free');

    setTextAll('[data-parent-name]', safeProfile?.full_name || user.user_metadata?.full_name || user.email || 'Parent Pulau Jawi');
    setTextAll('[data-child-count]', childRows.length);
    setTextAll('[data-max-children]', maxChildren);
    setTextAll('[data-total-xp]', formatNumber(totalXp));
    setTextAll('[data-best-streak]', bestStreak);
    setTextAll('[data-subscription-status]', premiumText);
    setTextAll('[data-inbox-count]', inboxItems.length);
    renderInbox(inboxItems);

    // Dashboard parent v2.7 dipermudahkan: tiada paparan Peta Pulau / senarai progress anak di dashboard.
    // Parent masuk ke Profil Anak dahulu, kemudian pilih anak sebelum Game Map dibuka.
    status('Dashboard Pulau Jawi live sync berjaya.', 'success');
  }

  document.addEventListener('DOMContentLoaded', loadDashboard);
})();
