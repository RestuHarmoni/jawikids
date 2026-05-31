// JawiKids Settings v1.10 - parents + settings table sync
async function loadSettings(){
  const p = JK.requireAuth(); if (!p) return;
  await JK.syncAll();
  const me = JK.currentParent();
  const s = JK.load();
  const form = document.querySelector('#settingsForm'); if (!form) return;
  if (form.full_name) form.full_name.value = me.full_name || '';
  if (form.phone) form.phone.value = me.phone || '';
  const row = s.settings.find(x => x.parent_id === me.id);
  const themeSelect = form.querySelector('select[name="theme"], select');
  if (themeSelect && row?.theme) themeSelect.value = row.theme;
}

document.addEventListener('DOMContentLoaded', async () => {
  const p = JK.requireAuth(); if (!p) return;
  await loadSettings();
  const form = document.querySelector('#settingsForm');
  if (!form || form.dataset.ready) return;
  form.dataset.ready = '1';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const me = JK.currentParent();
    const profile = {
      full_name: form.full_name?.value.trim() || me.full_name,
      phone: form.phone?.value.trim() || '',
      last_login: new Date().toISOString()
    };
    if (JK.supabase()) {
      const up = await JK.updateRow('parents', me.id, profile);
      if (up.error) { console.error('parents update:', up.error); return JK.toast('Gagal kemaskini profil: ' + up.error.message); }
      const themeSelect = form.querySelector('select[name="theme"], select');
      const settingRow = {
        parent_id: me.id,
        notification: true,
        sound: true,
        theme: themeSelect?.value || 'light',
        updated_at: new Date().toISOString()
      };
      const stUp = await JK.upsertByParent('settings', settingRow);
      if (stUp.error) console.warn('settings upsert:', stUp.error.message);
    }
    const s = JK.load();
    const local = s.parents.find(x => x.id === me.id); if (local) Object.assign(local, profile);
    JK.save(s);
    await JK.syncAll();
    JK.toast('Tetapan dikemaskini.');
  });
});
