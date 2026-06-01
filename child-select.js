/* JawiKids Child Select Live Sync v1.47 - Mula Main starts game mode only */
(function () {
  let currentProfile = null;
  let currentChildren = [];

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const setTextAll = (selector, value) => document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  const status = (msg, type='info') => {
    const el = document.getElementById('childSelectStatus');
    if (!el) return;
    el.textContent = msg;
    el.dataset.type = type;
  };
  const avatarFor = (child) => {
    const gender = (child.gender || '').toLowerCase();
    const key = (child.avatar_key || '').toLowerCase();
    return key.includes('zainab') || gender.includes('female') || gender.includes('perempuan')
      ? 'assets/characters/zainab-main.svg'
      : 'assets/characters/zafri-main.svg';
  };

  async function getUserAndProfile(supabase) {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }
    if (window.JawiKidsAuth?.ensureParentProfile) await window.JawiKidsAuth.ensureParentProfile();
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('id,full_name,premium_lifetime,max_children,subscription_status')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) throw error;

    if (!profile) {
      const meta = session.user.user_metadata || {};
      const fallbackProfile = {
        id: session.user.id,
        full_name: meta.full_name || meta.name || session.user.email || 'Parent JawiKids',
        subscription_type: 'free',
        subscription_status: 'inactive',
        premium_lifetime: false,
        max_children: 3,
        concurrent_session_limit: 5
      };
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(fallbackProfile)
        .select('id,full_name,premium_lifetime,max_children,subscription_status')
        .maybeSingle();
      if (createError) throw createError;
      profile = createdProfile || fallbackProfile;
    }

    return { user: session.user, profile };
  }

  function renderChildren() {
    const grid = document.getElementById('childSelectGrid');
    if (!grid) return;
    const maxChildren = currentProfile?.max_children || 3;
    setTextAll('[data-child-count]', currentChildren.length);
    setTextAll('[data-max-children]', maxChildren);

    const cards = currentChildren.map(child => `<div class="premium-card app-card child-card live-child-card">
      <div class="child-face avatar-face"><img src="${avatarFor(child)}" alt="${escapeHtml(child.name)}"></div>
      <div>
        <h2>${escapeHtml(child.name)}</h2>
        <p>Pulau ${child.current_island || 1} · ${Number(child.total_xp || 0).toLocaleString('ms-MY')} XP · ${child.hearts ?? 5} hati</p>
        <a class="primary-btn" href="game-map.html" data-select-child="${child.id}">Mula Main</a>
      </div>
    </div>`);

    if (currentChildren.length < maxChildren) {
      cards.push(`<div class="premium-card app-card empty-dashboard-card"><h2>Tambah Anak</h2><p>Anda masih ada ${maxChildren - currentChildren.length} slot kosong.</p><a class="secondary-btn" href="#addChildForm">Tambah Profil</a></div>`);
    } else {
      cards.push(`<div class="premium-card app-card empty-dashboard-card"><h2>Slot Penuh</h2><p>${currentChildren.length}/${maxChildren} slot digunakan. Maksimum 5 anak.</p><a class="secondary-btn" href="payment.html?type=child_slot">Tambah Slot RM10</a></div>`);
    }

    grid.innerHTML = cards.join('');
    grid.querySelectorAll('[data-select-child]').forEach(link => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        localStorage.setItem('jawikids_selected_child_id', link.dataset.selectChild);
        localStorage.setItem('selected_child_id', link.dataset.selectChild);
        
        
        window.location.href = link.getAttribute('href') || 'game-map.html';
      });
    });
  }

  async function loadChildren() {
    const supabase = window.getJawiSupabase?.();
    if (!supabase) return status('Supabase belum bersambung.', 'error');
    try {
      const ctx = await getUserAndProfile(supabase);
      if (!ctx) return;
      currentProfile = ctx.profile;
      const { data, error } = await supabase
        .from('children')
        .select('id,name,age,gender,avatar_key,total_xp,current_island,hearts,created_at')
        .eq('parent_id', ctx.user.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      currentChildren = data || [];
      renderChildren();
      status('Profil anak live sync berjaya.', 'success');
    } catch (err) {
      status('Gagal memuatkan profil anak: ' + err.message, 'error');
    }
  }

  async function addChild(event) {
    event.preventDefault();
    const supabase = window.getJawiSupabase?.();
    if (!supabase) return status('Supabase belum bersambung.', 'error');
    const btn = document.getElementById('addChildBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Menambah...'; }
    try {
      const ctx = await getUserAndProfile(supabase);
      if (!ctx) return;
      const maxChildren = ctx.profile?.max_children || 3;
      if (currentChildren.length >= maxChildren) {
        status('Slot anak sudah penuh. Tambah slot RM10 untuk tambah anak lagi.', 'error');
        return;
      }
      const name = document.getElementById('childName')?.value.trim();
      const age = Number(document.getElementById('childAge')?.value || 0);
      const gender = document.getElementById('childGender')?.value || 'male';
      if (!name || !age) {
        status('Sila isi nama dan umur anak.', 'error');
        return;
      }
      const avatarKey = gender === 'female' ? 'zainab_default' : 'zafri_default';
      const { data: child, error } = await supabase
        .from('children')
        .insert({ parent_id: ctx.user.id, name, age, gender, avatar_key: avatarKey, total_xp: 0, current_island: 1, hearts: 5 })
        .select('id,name,age,gender,avatar_key,total_xp,current_island,hearts,created_at')
        .single();
      if (error) throw error;
      await supabase.from('streaks').upsert({ child_id: child.id, current_streak: 0, longest_streak: 0 });
      document.getElementById('addChildForm')?.reset();
      currentChildren.push(child);
      renderChildren();
      status('Profil anak berjaya ditambah.', 'success');
    } catch (err) {
      status('Gagal tambah anak: ' + err.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Tambah Profil'; }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addChildForm')?.addEventListener('submit', addChild);
    loadChildren();
  });
})();
