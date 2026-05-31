// JawiKids Affiliate Interest v1.10
async function renderAffiliate(){
  const p = JK.currentParent(); if (!p) return;
  const s = JK.load();
  const existing = s.affiliate_interest.find(a => a.parent_id === p.id);
  const status = document.querySelector('#affiliateStatus');
  if (status) {
    status.innerHTML = existing ? `
      <div class="card">
        <h3>Status: ${existing.status || 'WAITING'}</h3>
        <p>Platform: ${existing.platform || '-'}</p>
        <p class="muted">${existing.reason || ''}</p>
      </div>` : '<div class="card"><h3>Program Affiliate Akan Datang</h3><p class="muted">Daftar minat anda sekarang.</p></div>';
  }
  const form = document.querySelector('#affiliateForm');
  if (form && !form.dataset.ready) {
    form.dataset.ready = '1';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const parent = await JK.getSupabaseParent();
      if (!parent) return JK.toast('Sesi tidak sah. Sila login semula.');
      await JK.syncAll();
      const st = JK.load();
      if (st.affiliate_interest.some(a => a.parent_id === parent.id)) return JK.toast('Anda sudah daftar minat affiliate.');
      const row = {
        parent_id: parent.id,
        full_name: parent.full_name || '',
        email: parent.email || '',
        phone: parent.phone || '',
        platform: form.platform.value,
        reason: form.reason.value.trim(),
        status: 'WAITING',
        created_at: new Date().toISOString()
      };
      const ins = await JK.insertRow('affiliate_interest', row);
      if (ins.error) { console.error('affiliate_interest insert:', ins.error); return JK.toast('Gagal daftar affiliate: ' + ins.error.message); }
      st.affiliate_interest.push(ins.data || { ...row, id: JK.id('aff') }); JK.save(st);
      form.reset(); JK.toast('Minat affiliate berjaya dihantar.'); await renderAffiliate();
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const p = JK.requireAuth(); if (!p) return;
  await JK.syncAll();
  await renderAffiliate();
});
