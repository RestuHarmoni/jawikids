// JawiKids TASK 11A - Parent Inbox System (Frontend Demo + Supabase-ready hooks)
// This file keeps inbox UI working in demo mode. Later, connect loadInboxFromSupabase()
// to notifications + user_notifications tables.

const DEMO_UNREAD_COUNT = 3;

document.addEventListener('DOMContentLoaded', () => {
  updateInboxBadges(DEMO_UNREAD_COUNT);
  setupInboxFilters();
  setupMarkAllRead();
  autoHideSlideNotification();
});

function updateInboxBadges(count) {
  document.querySelectorAll('[data-inbox-count]').forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'inline-grid' : 'none';
  });
}

function setupInboxFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const messages = document.querySelectorAll('.inbox-message');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      messages.forEach((msg) => {
        msg.style.display = filter === 'all' || msg.dataset.type === filter ? 'grid' : 'none';
      });
    });
  });
}

function setupMarkAllRead() {
  const btn = document.getElementById('markAllReadBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.inbox-message.unread').forEach((msg) => msg.classList.remove('unread'));
    document.querySelectorAll('.message-top span').forEach((badge) => badge.remove());
    updateInboxBadges(0);
    btn.textContent = 'Semua Sudah Dibaca';
    btn.disabled = true;
  });
}

function autoHideSlideNotification() {
  const toast = document.getElementById('slideNotification');
  if (!toast) return;
  setTimeout(() => toast.classList.remove('show'), 4200);
}

// Future Supabase hook example:
// async function loadInboxFromSupabase(supabase, userId) {
//   const { data, error } = await supabase
//     .from('user_notifications')
//     .select('is_read, notifications(id,title,message,type,created_at)')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false, foreignTable: 'notifications' });
//   if (error) throw error;
//   return data;
// }
