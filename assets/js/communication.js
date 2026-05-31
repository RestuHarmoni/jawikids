// JawiKids Communication System v1.10 - notifications + support
async function renderNotifications(){
  const p = JK.currentParent(); if (!p) return;
  const s = JK.load();
  const el = document.querySelector('#notificationList'); if (!el) return;
  const list = s.notifications.filter(n => n.parent_id === p.id);
  el.innerHTML = list.map(n => `
    <div class="card">
      <span class="badge">${n.type || 'SYSTEM'}</span>
      <h3>${n.title || 'Makluman'}</h3>
      <p>${n.message || ''}</p>
      <p class="muted">${n.created_at ? new Date(n.created_at).toLocaleString('ms-MY') : ''}</p>
    </div>`).join('') || '<div class="card">Tiada makluman.</div>';
  await JK.markNotificationsRead(p.id);
}

function renderSupport(){
  const p = JK.currentParent(); if (!p) return;
  const s = JK.load();
  const el = document.querySelector('#supportList') || document.querySelector('#ticketList');
  const form = document.querySelector('#ticketForm');
  if (el) {
    const tickets = s.support_tickets.filter(t => t.parent_id === p.id);
    el.innerHTML = tickets.map(t => {
      const msgs = s.ticket_messages.filter(m => m.ticket_id === t.id);
      return `<div class="card">
        <span class="badge ${t.status === 'CLOSED' ? 'status-closed' : 'status-open'}">${t.status || 'OPEN'}</span>
        <h3>${t.title || 'Tiket Support'}</h3>
        <p class="muted">${t.category || ''} ${t.created_at ? '• ' + new Date(t.created_at).toLocaleString('ms-MY') : ''}</p>
        <p>${t.message || ''}</p>
        ${msgs.map(m => `<p><b>${m.sender || 'USER'}:</b> ${m.message || ''}</p>`).join('')}
      </div>`;
    }).join('') || '<div class="card">Belum ada tiket support.</div>';
  }
  if (form && !form.dataset.ready) {
    form.dataset.ready = '1';
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const parent = await JK.getSupabaseParent();
      if (!parent) return JK.toast('Sesi tidak sah. Sila login semula.');
      const row = {
        parent_id: parent.id,
        category: form.category.value,
        title: form.title.value.trim(),
        message: form.message.value.trim(),
        status: 'OPEN',
        created_at: new Date().toISOString()
      };
      if (!row.title || !row.message) return JK.toast('Sila isi tajuk dan mesej.');
      const ins = await JK.insertRow('support_tickets', row);
      if (ins.error) { console.error('support_tickets insert:', ins.error); return JK.toast('Gagal hantar tiket: ' + ins.error.message); }
      const st = JK.load(); st.support_tickets.unshift(ins.data || { ...row, id: JK.id('ticket') }); JK.save(st);
      form.reset(); JK.toast('Tiket berjaya dihantar.'); renderSupport();
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const p = JK.requireAuth(); if (!p) return;
  await JK.syncAll();
  await renderNotifications();
  renderSupport();
});
