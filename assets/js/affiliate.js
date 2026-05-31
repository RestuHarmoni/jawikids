(function () {
  const form = document.getElementById('affiliateForm');
  const statusBox = document.getElementById('affiliateStatus');

  function setStatus(message, type = 'info') {
    if (!statusBox) return;
    statusBox.innerHTML = `<div class="card"><h2>Program Affiliate</h2><p>${message}</p><p><b>Status:</b> Akan Datang</p></div>`;
  }

  async function getCurrentParentId() {
    if (!window.jawikidsSupabase) return null;
    const { data } = await window.jawikidsSupabase.auth.getUser();
    return data?.user?.id || null;
  }

  async function loadAffiliateStatus() {
    setStatus('Daftar minat anda untuk menerima makluman apabila program Affiliate JawiKids dibuka.');
    if (!window.jawikidsSupabase) return;

    const parentId = await getCurrentParentId();
    if (!parentId) return;

    const { data, error } = await window.jawikidsSupabase
      .from('affiliate_interest')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length) {
      const row = data[0];
      setStatus(`Anda sudah mendaftar minat. Platform: ${row.platform || '-'}. Status: ${row.status || 'WAITING'}.`);
    }
  }

  async function submitAffiliateInterest(event) {
    event.preventDefault();
    if (!window.jawikidsSupabase) {
      alert('Supabase belum dikonfigurasi. Sila kemas kini supabase/config.js.');
      return;
    }

    const parentId = await getCurrentParentId();
    if (!parentId) {
      alert('Sila login dahulu.');
      window.location.href = 'login.html';
      return;
    }

    const formData = new FormData(form);
    const payload = {
      parent_id: parentId,
      platform: formData.get('platform'),
      reason: formData.get('reason'),
      status: 'WAITING'
    };

    const { error } = await window.jawikidsSupabase.from('affiliate_interest').insert(payload);
    if (error) {
      alert('Gagal daftar minat: ' + error.message);
      return;
    }

    form.reset();
    setStatus('Terima kasih. Minat anda sudah direkodkan.');
    alert('Pendaftaran minat Affiliate berjaya.');
  }

  document.addEventListener('DOMContentLoaded', loadAffiliateStatus);
  if (form) form.addEventListener('submit', submitAffiliateInterest);
})();
