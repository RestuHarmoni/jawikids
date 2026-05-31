// JawiKids State + Supabase Full Schema Sync v1.10
// Semua query diselaraskan dengan schema.sql semasa:
// parents, children, learning_progress, quiz_results, achievements, notifications,
// support_tickets, ticket_messages, affiliate_interest, payments, subscriptions, settings, admin_users.
const JK = (() => {
  const KEY = 'jawikids_local_state_v110';
  const LEGACY_KEYS = ['jawikids_local_state_v109','jawikids_local_state_v108','jawikids_local_state_v107','jawikids_local_state_v106','jawikids_local_state_v105','jawikids_local_state_v104'];
  const defaultState = {
    parents: [],
    children: [],
    progress: [],
    quiz_results: [],
    achievements: [],
    notifications: [],
    support_tickets: [],
    ticket_messages: [],
    affiliate_interest: [],
    payments: [],
    subscriptions: [],
    settings: [],
    session: null
  };

  const letters = [['ا','Alif'],['ب','Ba'],['ت','Ta'],['ث','Tha'],['ج','Jim'],['ح','Ha'],['خ','Kha'],['د','Dal'],['ذ','Zal'],['ر','Ra'],['ز','Zai'],['س','Sin'],['ش','Syin'],['ص','Sod'],['ض','Dhod'],['ط','To'],['ظ','Zo'],['ع','Ain'],['غ','Ghain'],['ف','Fa'],['ق','Qaf'],['ك','Kaf'],['ل','Lam'],['م','Mim'],['ن','Nun'],['و','Wau'],['ه','Ha'],['ي','Ya']];
  const questions = [
    { q:'Apakah nama huruf ا ?', a:'Alif', o:['Alif','Ba','Ta','Jim'] },
    { q:'Apakah nama huruf ب ?', a:'Ba', o:['Dal','Ba','Sin','Nun'] },
    { q:'Pilih huruf untuk Ta', a:'ت', o:['ب','ت','ث','ج'] },
    { q:'Pilih huruf untuk Mim', a:'م', o:['ن','م','ل','ك'] },
    { q:'Apakah nama huruf ج ?', a:'Jim', o:['Jim','Ha','Kha','Dal'] }
  ];

  function safeJson(raw){ try { return JSON.parse(raw || '{}') || {}; } catch { return {}; } }
  function load(){
    let current = safeJson(localStorage.getItem(KEY));
    if (!current.session && !current.parents?.length) {
      for (const k of LEGACY_KEYS) {
        const old = safeJson(localStorage.getItem(k));
        if (old.session || old.parents?.length) { current = old; break; }
      }
    }
    return { ...defaultState, ...current };
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify({ ...defaultState, ...s })); }
  function id(prefix){ return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
  function toast(msg){
    let t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }
  function supabase(){ return window.jawikidsSupabase || null; }
  function currentParent(){ const s = load(); return s.parents.find(p => p.id === s.session?.parentId) || null; }
  function requireAuth(){ const p = currentParent(); if (!p) { location.href = 'login.html'; return null; } return p; }
  async function getAuthUser(){
    const sb = supabase(); if (!sb) return null;
    const { data, error } = await sb.auth.getSession();
    if (error) console.warn('Supabase session error:', error.message);
    return data?.session?.user || null;
  }

  function syncLocalParent(parent){
    if (!parent) return null;
    const s = load();
    const mapped = {
      id: parent.id,
      auth_user_id: parent.auth_user_id,
      email: parent.email,
      full_name: parent.full_name || 'Parent',
      phone: parent.phone || '',
      package: parent.package || 'TRIAL',
      status: parent.status || 'active',
      created_at: parent.created_at || new Date().toISOString(),
      last_login: parent.last_login || new Date().toISOString()
    };
    let local = s.parents.find(x => x.id === mapped.id) || s.parents.find(x => x.email === mapped.email);
    if (local) Object.assign(local, mapped); else s.parents.push(mapped);
    s.session = { parentId: mapped.id, email: mapped.email, loggedAt: new Date().toISOString() };
    save(s);
    return mapped;
  }

  async function getSupabaseParent(){
    const sb = supabase();
    const local = currentParent();
    if (!sb) return local;
    const user = await getAuthUser();
    if (!user) return local;
    let { data: parent, error } = await sb.from('parents').select('*').eq('auth_user_id', user.id).maybeSingle();
    if (error) console.warn('parents select:', error.message);
    if (!parent) {
      const email = (user.email || local?.email || '').toLowerCase();
      const profile = {
        auth_user_id: user.id,
        email,
        full_name: local?.full_name || user.user_metadata?.full_name || email.split('@')[0] || 'Parent',
        phone: local?.phone || user.user_metadata?.phone || '',
        package: local?.package || 'TRIAL',
        status: 'active',
        last_login: new Date().toISOString()
      };
      const ins = await sb.from('parents').insert(profile).select('*').single();
      if (ins.error) { console.error('parents insert:', ins.error); return local; }
      parent = ins.data;
    } else {
      await sb.from('parents').update({ last_login: new Date().toISOString() }).eq('id', parent.id);
    }
    return syncLocalParent(parent);
  }

  function replaceRows(s, key, rows, matchField, matchValues){
    const set = new Set(Array.isArray(matchValues) ? matchValues : [matchValues]);
    s[key] = [ ...s[key].filter(x => !set.has(x[matchField])), ...(rows || []) ];
  }

  async function syncAll(){
    const sb = supabase();
    if (!sb) return load();
    const p = await getSupabaseParent();
    if (!p) return load();
    const s = load();

    const childrenQuery = await sb.from('children').select('*').eq('parent_id', p.id).order('created_at', { ascending: true });
    if (childrenQuery.error) console.warn('children sync:', childrenQuery.error.message);
    else replaceRows(s, 'children', childrenQuery.data, 'parent_id', p.id);

    const childIds = (childrenQuery.data || s.children.filter(c => c.parent_id === p.id)).map(c => c.id);

    const parentWithCreatedAt = ['notifications','support_tickets','affiliate_interest','payments'];
    for (const table of parentWithCreatedAt) {
      const q = await sb.from(table).select('*').eq('parent_id', p.id).order('created_at', { ascending: false });
      if (q.error) console.warn(`${table} sync:`, q.error.message);
      else replaceRows(s, table, q.data, 'parent_id', p.id);
    }

    // Schema v1.03/v1.10: subscriptions dan settings TIADA created_at. Jangan order created_at.
    for (const table of ['subscriptions','settings']) {
      const q = await sb.from(table).select('*').eq('parent_id', p.id);
      if (q.error) console.warn(`${table} sync:`, q.error.message);
      else replaceRows(s, table, q.data, 'parent_id', p.id);
    }

    if (childIds.length) {
      const childTables = {
        learning_progress: 'progress',
        quiz_results: 'quiz_results',
        achievements: 'achievements'
      };
      for (const [table, key] of Object.entries(childTables)) {
        const q = await sb.from(table).select('*').in('child_id', childIds);
        if (q.error) console.warn(`${table} sync:`, q.error.message);
        else replaceRows(s, key, q.data, 'child_id', childIds);
      }
    }

    const ticketIds = s.support_tickets.filter(t => t.parent_id === p.id).map(t => t.id);
    if (ticketIds.length) {
      const q = await sb.from('ticket_messages').select('*').in('ticket_id', ticketIds).order('created_at', { ascending: true });
      if (q.error) console.warn('ticket_messages sync:', q.error.message);
      else replaceRows(s, 'ticket_messages', q.data, 'ticket_id', ticketIds);
    }

    save(s);
    return s;
  }

  async function insertRow(table, row){ const sb = supabase(); if (!sb) return { data: null, error: null }; return await sb.from(table).insert(row).select('*').single(); }
  async function updateRow(table, id, row){ const sb = supabase(); if (!sb) return { data: null, error: null }; return await sb.from(table).update(row).eq('id', id).select('*').single(); }
  async function upsertByParent(table, row){
    const sb = supabase(); if (!sb) return { data: null, error: null };
    const existing = await sb.from(table).select('*').eq('parent_id', row.parent_id).maybeSingle();
    if (existing.error) return { data: null, error: existing.error };
    if (existing.data) return await sb.from(table).update(row).eq('id', existing.data.id).select('*').single();
    return await sb.from(table).insert(row).select('*').single();
  }
  async function logout(){ const sb = supabase(); if (sb) await sb.auth.signOut(); const s = load(); s.session = null; save(s); location.href = 'login.html'; }
  function children(){ const p = currentParent(), s = load(); return p ? s.children.filter(c => c.parent_id === p.id) : []; }
  function selectedChild(){ return children()[0] || null; }

  async function notify(parentId, title, message, type='SYSTEM'){
    const row = { parent_id: parentId, type, title, message, is_read: false, created_at: new Date().toISOString() };
    const ins = await insertRow('notifications', row);
    const s = load(); s.notifications.unshift(ins.data || { ...row, id: id('noti') }); save(s);
  }
  async function markNotificationsRead(parentId){
    const sb = supabase(); if (sb) await sb.from('notifications').update({ is_read: true }).eq('parent_id', parentId);
    const s = load(); s.notifications.forEach(n => { if (n.parent_id === parentId) n.is_read = true; }); save(s);
  }
  async function addXP(childId, xp, activity){
    const s = load(); const c = s.children.find(x => x.id === childId); if (!c) return;
    c.xp = (Number(c.xp) || 0) + xp;
    c.level = Math.max(1, Math.floor(c.xp / 100) + 1);
    const sb = supabase(); if (sb) await sb.from('children').update({ xp: c.xp, level: c.level }).eq('id', c.id);
    const prog = { child_id: childId, module: activity, lesson: activity, progress: 100, completed: true, updated_at: new Date().toISOString() };
    const progIns = await insertRow('learning_progress', prog); s.progress.push(progIns.data || { ...prog, id: id('prog') });
    const badges = [['First Letter',5],['Jawi Explorer',100],['Jawi Champion',500]];
    for (const [badge, need] of badges) {
      if (c.xp >= need && !s.achievements.some(a => a.child_id === childId && a.badge === badge)) {
        const ach = { child_id: childId, badge, xp_reward: xp, unlocked_at: new Date().toISOString() };
        const achIns = await insertRow('achievements', ach); s.achievements.push(achIns.data || { ...ach, id: id('ach') });
        const noti = { parent_id: c.parent_id, type:'ACHIEVEMENT', title:'Badge Baru Dibuka', message:`${c.full_name} dapat badge ${badge}.`, is_read:false, created_at:new Date().toISOString() };
        const notiIns = await insertRow('notifications', noti); s.notifications.unshift(notiIns.data || { ...noti, id: id('noti') });
      }
    }
    save(s);
  }
  async function saveQuizResult(row){ const ins = await insertRow('quiz_results', row); const s = load(); s.quiz_results.push(ins.data || { ...row, id: id('quiz') }); save(s); return ins.data; }

  return { load, save, id, toast, supabase, currentParent, requireAuth, getAuthUser, getSupabaseParent, syncLocalParent, syncAll, insertRow, updateRow, upsertByParent, logout, children, selectedChild, notify, markNotificationsRead, addXP, saveQuizResult, letters, questions };
})();

document.addEventListener('click', e => { if (e.target.closest('[data-logout]')) { e.preventDefault(); JK.logout(); } });
