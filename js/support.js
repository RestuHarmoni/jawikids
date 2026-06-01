/* JawiKids TASK 11 — Parent Support Ticket System
   Production path: Supabase support_tickets + support_messages.
   Demo fallback: localStorage when Supabase credentials are not configured. */
(function () {
  const DEMO_TICKETS_KEY = 'jawikids_demo_support_tickets';
  const DEMO_MESSAGES_KEY = 'jawikids_demo_support_messages';

  const seedTickets = [
    {
      id: 'demo-ticket-1',
      subject: 'Pembayaran premium belum aktif',
      category: 'payment',
      status: 'open',
      parent_name: 'Puan Aisyah',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
    },
    {
      id: 'demo-ticket-2',
      subject: 'Audio huruf Ba tidak keluar',
      category: 'audio',
      status: 'pending',
      parent_name: 'Encik Hafiz',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    }
  ];

  const seedMessages = {
    'demo-ticket-1': [
      { id: 'm1', sender_role: 'parent', message: 'Saya sudah bayar premium tetapi akaun masih belum aktif.', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { id: 'm2', sender_role: 'admin', message: 'Terima kasih. Sila berikan bill code ToyyibPay untuk semakan.', created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() }
    ],
    'demo-ticket-2': [
      { id: 'm3', sender_role: 'parent', message: 'Audio untuk huruf Ba tidak berbunyi di tablet anak saya.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
    ]
  };

  function $(id) { return document.getElementById(id); }

  function isSupabaseReady() {
    return Boolean(window.JAWIKIDS_SUPABASE_READY && window.jawiSupabase);
  }

  function showToast(message, type = 'success') {
    const toast = $('supportToast');
    if (!toast) return;
    toast.className = `support-toast ${type} show`;
    toast.innerHTML = `<span>🔔</span><b>${escapeHtml(message)}</b>`;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function formatDate(value) {
    try { return new Intl.DateTimeFormat('ms-MY', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
    catch (_) { return '-'; }
  }

  function getDemoTickets() {
    const stored = localStorage.getItem(DEMO_TICKETS_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(DEMO_TICKETS_KEY, JSON.stringify(seedTickets));
    localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(seedMessages));
    return seedTickets;
  }

  function setDemoTickets(tickets) { localStorage.setItem(DEMO_TICKETS_KEY, JSON.stringify(tickets)); }
  function getDemoMessages() {
    const stored = localStorage.getItem(DEMO_MESSAGES_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(seedMessages));
    return seedMessages;
  }
  function setDemoMessages(messages) { localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(messages)); }

  async function getCurrentUser() {
    if (!isSupabaseReady()) return null;
    const { data, error } = await window.jawiSupabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  async function createTicket({ subject, category, message, attachmentUrl }) {
    if (isSupabaseReady()) {
      const user = await getCurrentUser();
      if (!user) throw new Error('Sila login parent dahulu sebelum menghantar tiket.');

      const { data: ticket, error: ticketError } = await window.jawiSupabase
        .from('support_tickets')
        .insert({ user_id: user.id, subject, category, status: 'open' })
        .select()
        .single();
      if (ticketError) throw ticketError;

      const { error: messageError } = await window.jawiSupabase
        .from('support_messages')
        .insert({ ticket_id: ticket.id, sender_id: user.id, sender_role: 'parent', message, attachment_url: attachmentUrl || null });
      if (messageError) throw messageError;

      return ticket;
    }

    const tickets = getDemoTickets();
    const messages = getDemoMessages();
    const ticket = {
      id: `demo-ticket-${Date.now()}`,
      subject,
      category,
      status: 'open',
      parent_name: 'Demo Parent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tickets.unshift(ticket);
    messages[ticket.id] = [{ id: `m-${Date.now()}`, sender_role: 'parent', message, attachment_url: attachmentUrl || '', created_at: new Date().toISOString() }];
    setDemoTickets(tickets);
    setDemoMessages(messages);
    return ticket;
  }

  async function fetchParentTickets() {
    if (isSupabaseReady()) {
      const user = await getCurrentUser();
      if (!user) return [];
      const { data, error } = await window.jawiSupabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return getDemoTickets();
  }

  async function fetchTicketMessages(ticketId) {
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

  async function addParentReply(ticketId, message) {
    if (isSupabaseReady()) {
      const user = await getCurrentUser();
      if (!user) throw new Error('Sila login dahulu.');
      const { error } = await window.jawiSupabase.from('support_messages').insert({ ticket_id: ticketId, sender_id: user.id, sender_role: 'parent', message });
      if (error) throw error;
      await window.jawiSupabase.from('support_tickets').update({ status: 'open', updated_at: new Date().toISOString() }).eq('id', ticketId);
      return;
    }
    const messages = getDemoMessages();
    messages[ticketId] = messages[ticketId] || [];
    messages[ticketId].push({ id: `m-${Date.now()}`, sender_role: 'parent', message, created_at: new Date().toISOString() });
    setDemoMessages(messages);
    const tickets = getDemoTickets().map(t => t.id === ticketId ? { ...t, status: 'open', updated_at: new Date().toISOString() } : t);
    setDemoTickets(tickets);
  }

  function renderTicketList(tickets) {
    const list = $('ticketList');
    if (!list) return;
    if (!tickets.length) {
      list.innerHTML = '<div class="support-empty">Belum ada tiket bantuan.</div>';
      return;
    }
    list.innerHTML = tickets.map(ticket => `
      <article class="ticket-card">
        <header>
          <div><b>${escapeHtml(ticket.subject)}</b><small>${formatDate(ticket.updated_at || ticket.created_at)}</small></div>
          <span class="ticket-status ${escapeHtml(ticket.status)}">${escapeHtml(ticket.status)}</span>
        </header>
        <div class="ticket-meta"><span class="ticket-category">${escapeHtml(ticket.category || 'technical')}</span></div>
        <a class="secondary-btn" href="ticket-thread.html?id=${encodeURIComponent(ticket.id)}">Buka Thread</a>
      </article>`).join('');
  }

  async function loadSupportPage() {
    const form = $('supportTicketForm');
    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const subject = $('ticketSubject').value.trim();
        const category = $('ticketCategory').value;
        const message = $('ticketMessage').value.trim();
        const attachmentUrl = $('ticketAttachment').value.trim();
        if (!subject || !message) return showToast('Sila isi subjek dan mesej.', 'error');
        try {
          await createTicket({ subject, category, message, attachmentUrl });
          form.reset();
          showToast('Tiket berjaya dihantar.');
          renderTicketList(await fetchParentTickets());
        } catch (error) {
          showToast(error.message || 'Gagal menghantar tiket.', 'error');
        }
      });
      renderTicketList(await fetchParentTickets());
    }
  }

  function getTicketIdFromUrl() {
    return new URLSearchParams(window.location.search).get('id') || 'demo-ticket-1';
  }

  async function loadThreadPage() {
    const messageList = $('messageList');
    if (!messageList) return;
    const ticketId = getTicketIdFromUrl();
    const tickets = await fetchParentTickets();
    const ticket = tickets.find(item => item.id === ticketId) || tickets[0];
    if (ticket) {
      $('threadSubject').textContent = ticket.subject;
      $('threadMeta').textContent = `Kategori: ${ticket.category || 'technical'} · Status: ${ticket.status}`;
      $('threadStatus').textContent = ticket.status;
      $('threadStatus').className = `ticket-status ${ticket.status}`;
    }
    const renderMessages = async () => {
      const messages = await fetchTicketMessages(ticketId);
      messageList.innerHTML = messages.map(msg => `
        <div class="message-bubble ${msg.sender_role === 'admin' ? 'admin' : 'parent'}">
          ${escapeHtml(msg.message)}
          ${msg.attachment_url ? `<br><a href="${escapeHtml(msg.attachment_url)}" target="_blank" rel="noopener">Lihat lampiran</a>` : ''}
          <small>${msg.sender_role === 'admin' ? 'Admin JawiKids' : 'Parent'} · ${formatDate(msg.created_at)}</small>
        </div>`).join('') || '<div class="support-empty">Belum ada mesej.</div>';
    };
    await renderMessages();
    const replyForm = $('replyForm');
    replyForm?.addEventListener('submit', async event => {
      event.preventDefault();
      const message = $('replyMessage').value.trim();
      if (!message) return;
      try {
        await addParentReply(ticketId, message);
        $('replyMessage').value = '';
        showToast('Balasan dihantar.');
        await renderMessages();
      } catch (error) { showToast(error.message || 'Gagal hantar balasan.', 'error'); }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSupportPage().catch(error => showToast(error.message || 'Gagal load support.', 'error'));
    loadThreadPage().catch(error => showToast(error.message || 'Gagal load thread.', 'error'));
  });
})();
