/* JawiKids TASK 11 — Admin Support Center
   Production: admin reads all tickets using RLS is_admin policy.
   Demo: localStorage ticket queue. */
(function () {
  const TICKETS_KEY = 'jawikids_demo_support_tickets';
  const MESSAGES_KEY = 'jawikids_demo_support_messages';
  let selectedTicketId = null;
  let ticketsCache = [];

  function $(id) { return document.getElementById(id); }
  function isSupabaseReady() { return Boolean(window.JAWIKIDS_SUPABASE_READY && window.jawiSupabase); }
  function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function formatDate(value) { try { return new Intl.DateTimeFormat('ms-MY', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); } catch (_) { return '-'; } }
  function showToast(message, type = 'success') { const toast = $('supportToast'); if (!toast) return; toast.className = `support-toast ${type} show`; toast.innerHTML = `<span>🔔</span><b>${escapeHtml(message)}</b>`; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200); }

  function getDemoTickets() {
    const stored = localStorage.getItem(TICKETS_KEY);
    if (stored) return JSON.parse(stored);
    const starter = [
      { id: 'demo-ticket-1', subject: 'Pembayaran premium belum aktif', category: 'payment', status: 'open', parent_name: 'Puan Aisyah', user_id: 'demo-parent-1', created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date(Date.now() - 1200000).toISOString() },
      { id: 'demo-ticket-2', subject: 'Audio huruf Ba tidak keluar', category: 'audio', status: 'pending', parent_name: 'Encik Hafiz', user_id: 'demo-parent-2', created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 'demo-ticket-3', subject: 'Anak tersangkut di Pulau 2', category: 'progress', status: 'open', parent_name: 'Puan Huda', user_id: 'demo-parent-3', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 3600000).toISOString() }
    ];
    localStorage.setItem(TICKETS_KEY, JSON.stringify(starter));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify({
      'demo-ticket-1': [{ id: 'm1', sender_role: 'parent', message: 'Saya sudah bayar premium tetapi akaun masih belum aktif.', created_at: new Date(Date.now() - 3600000).toISOString() }],
      'demo-ticket-2': [{ id: 'm2', sender_role: 'parent', message: 'Audio huruf Ba tidak berbunyi di tablet anak saya.', created_at: new Date(Date.now() - 14400000).toISOString() }],
      'demo-ticket-3': [{ id: 'm3', sender_role: 'parent', message: 'Selepas tamat lesson, Pulau 3 masih terkunci.', created_at: new Date(Date.now() - 86400000).toISOString() }]
    }));
    return starter;
  }
  function setDemoTickets(tickets) { localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets)); }
  function getDemoMessages() { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '{}'); }
  function setDemoMessages(messages) { localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages)); }

  async function fetchTickets() {
    if (isSupabaseReady()) {
      const { data, error } = await window.jawiSupabase
        .from('support_tickets')
        .select('*, profiles(full_name)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(ticket => ({ ...ticket, parent_name: ticket.profiles?.full_name || 'Parent' }));
    }
    return getDemoTickets();
  }

  async function fetchMessages(ticketId) {
    if (isSupabaseReady()) {
      const { data, error } = await window.jawiSupabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }
    return getDemoMessages()[ticketId] || [];
  }

  async function addAdminReply(ticket, message) {
    if (isSupabaseReady()) {
      const { data: authData } = await window.jawiSupabase.auth.getUser();
      const adminId = authData?.user?.id;
      if (!adminId) throw new Error('Sila login admin dahulu.');
      const { error } = await window.jawiSupabase.from('support_messages').insert({ ticket_id: ticket.id, sender_id: adminId, sender_role: 'admin', message });
      if (error) throw error;
      await window.jawiSupabase.from('support_tickets').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', ticket.id);
      await createSupportNotification(ticket.user_id, 'Admin telah membalas tiket anda', message);
      return;
    }
    const messages = getDemoMessages();
    messages[ticket.id] = messages[ticket.id] || [];
    messages[ticket.id].push({ id: `m-${Date.now()}`, sender_role: 'admin', message, created_at: new Date().toISOString() });
    setDemoMessages(messages);
    const tickets = getDemoTickets().map(item => item.id === ticket.id ? { ...item, status: 'pending', updated_at: new Date().toISOString() } : item);
    setDemoTickets(tickets);
  }

  async function updateTicketStatus(ticketId, status) {
    if (isSupabaseReady()) {
      const { error } = await window.jawiSupabase.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', ticketId);
      if (error) throw error;
      return;
    }
    const tickets = getDemoTickets().map(item => item.id === ticketId ? { ...item, status, updated_at: new Date().toISOString() } : item);
    setDemoTickets(tickets);
  }

  async function createSupportNotification(userId, title, message) {
    if (!isSupabaseReady() || !userId) return;
    const { data: notification, error } = await window.jawiSupabase
      .from('notifications')
      .insert({ title, message, notification_type: 'support' })
      .select()
      .single();
    if (error) return console.warn('Notification create failed:', error.message);
    await window.jawiSupabase.from('user_notifications').insert({ user_id: userId, notification_id: notification.id, is_read: false });
  }

  function getFilteredTickets() {
    const search = ($('ticketSearch')?.value || '').toLowerCase();
    const status = $('statusFilter')?.value || 'all';
    const category = $('categoryFilter')?.value || 'all';
    return ticketsCache.filter(ticket => {
      const matchesSearch = !search || `${ticket.subject} ${ticket.parent_name}`.toLowerCase().includes(search);
      const matchesStatus = status === 'all' || ticket.status === status;
      const matchesCategory = category === 'all' || ticket.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  function renderTicketSidebar() {
    const list = $('adminTicketList');
    if (!list) return;
    const filtered = getFilteredTickets();
    $('openCount').textContent = `${ticketsCache.filter(t => t.status === 'open').length} Open`;
    if (!filtered.length) { list.innerHTML = '<div class="support-empty">Tiada tiket dijumpai.</div>'; return; }
    list.innerHTML = filtered.map(ticket => `
      <button class="admin-ticket-item ${ticket.id === selectedTicketId ? 'active' : ''}" data-ticket-id="${escapeHtml(ticket.id)}" type="button">
        <strong>${escapeHtml(ticket.subject)}</strong>
        <span>${escapeHtml(ticket.parent_name || 'Parent')} · ${formatDate(ticket.updated_at || ticket.created_at)}</span>
        <span class="ticket-status ${escapeHtml(ticket.status)}">${escapeHtml(ticket.status)}</span>
      </button>`).join('');
    list.querySelectorAll('[data-ticket-id]').forEach(button => button.addEventListener('click', () => selectTicket(button.dataset.ticketId)));
  }

  async function selectTicket(ticketId) {
    selectedTicketId = ticketId;
    renderTicketSidebar();
    const ticket = ticketsCache.find(item => item.id === ticketId);
    if (!ticket) return;
    $('adminThreadSubject').textContent = ticket.subject;
    $('adminThreadMeta').textContent = `${ticket.parent_name || 'Parent'} · ${ticket.category || 'technical'} · ${formatDate(ticket.created_at)}`;
    $('adminThreadStatus').textContent = ticket.status;
    $('adminThreadStatus').className = `ticket-status ${ticket.status}`;
    await renderMessages(ticketId);
  }

  async function renderMessages(ticketId) {
    const list = $('adminMessageList');
    const messages = await fetchMessages(ticketId);
    list.innerHTML = messages.map(msg => `
      <div class="message-bubble ${msg.sender_role === 'admin' ? 'admin' : 'parent'}">
        ${escapeHtml(msg.message)}
        <small>${msg.sender_role === 'admin' ? 'Admin JawiKids' : 'Parent'} · ${formatDate(msg.created_at)}</small>
      </div>`).join('') || '<div class="support-empty">Belum ada mesej.</div>';
  }

  async function refreshTickets() {
    ticketsCache = await fetchTickets();
    if (!selectedTicketId && ticketsCache.length) selectedTicketId = ticketsCache[0].id;
    renderTicketSidebar();
    if (selectedTicketId) await selectTicket(selectedTicketId);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    $('menuToggle')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('open'));
    ['ticketSearch', 'statusFilter', 'categoryFilter'].forEach(id => $(id)?.addEventListener('input', renderTicketSidebar));
    $('adminReplyForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const ticket = ticketsCache.find(item => item.id === selectedTicketId);
      const message = $('adminReplyMessage').value.trim();
      if (!ticket || !message) return;
      try {
        await addAdminReply(ticket, message);
        $('adminReplyMessage').value = '';
        showToast('Balasan admin dihantar ke Parent Inbox.');
        await refreshTickets();
      } catch (error) { showToast(error.message || 'Gagal hantar balasan.', 'error'); }
    });
    document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', async () => {
      if (!selectedTicketId) return;
      try { await updateTicketStatus(selectedTicketId, button.dataset.status); showToast(`Status ditukar kepada ${button.dataset.status}.`); await refreshTickets(); }
      catch (error) { showToast(error.message || 'Gagal tukar status.', 'error'); }
    }));
    try { await refreshTickets(); }
    catch (error) { showToast(error.message || 'Gagal load admin support.', 'error'); }
  });
})();
