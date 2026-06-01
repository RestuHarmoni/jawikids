const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

document.querySelectorAll('.admin-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    sidebar?.classList.remove('open');
  });
});

const questionBuilder = document.getElementById('questionBuilder');
const questionPreview = document.getElementById('questionPreview');
const questionList = document.getElementById('questionList');
const notificationForm = document.getElementById('notificationForm');

function getQuestionData() {
  return {
    module: document.getElementById('moduleSelect')?.value || '',
    lesson: document.getElementById('lessonSelect')?.value || '',
    gameType: document.getElementById('gameType')?.value || '',
    status: document.getElementById('questionStatus')?.value || 'draft',
    question: document.getElementById('questionText')?.value || '',
    correct: document.getElementById('correctAnswer')?.value || '',
    xp: document.getElementById('xpReward')?.value || '10',
    options: (document.getElementById('answerOptions')?.value || '').split(',').map(v => v.trim()).filter(Boolean),
    audio: document.getElementById('audioPath')?.value || '',
    image: document.getElementById('imagePath')?.value || '',
    hint: document.getElementById('zainabHint')?.value || ''
  };
}

function renderQuestionPreview() {
  if (!questionPreview) return;
  const q = getQuestionData();
  const options = q.options.length ? q.options : ['ا','ب','ت','ج'];
  questionPreview.innerHTML = `
    <div class="preview-top"><span>❤️❤️❤️❤️❤️</span><span>⭐ +${q.xp} XP</span></div>
    <p class="preview-instruction">${escapeHtml(q.question)}</p>
    <div class="balloon-preview" dir="rtl">
      ${options.map(opt => `<button class="${opt === q.correct ? 'correct' : ''}">${escapeHtml(opt)}</button>`).join('')}
    </div>
    <div class="zainab-tip">💡 Zainab: ${escapeHtml(q.hint)}</div>
  `;
}

document.getElementById('previewQuestionBtn')?.addEventListener('click', () => {
  renderQuestionPreview();
  showToast('Preview soalan dikemaskini.');
});

questionBuilder?.addEventListener('submit', (event) => {
  event.preventDefault();
  const q = getQuestionData();
  const item = document.createElement('div');
  item.className = 'content-item';
  item.innerHTML = `<b>${escapeHtml(q.question)}</b><span>${escapeHtml(q.module)} · ${escapeHtml(q.gameType)} · ${escapeHtml(q.status)}</span>`;
  questionList?.prepend(item);
  showToast('Soalan disimpan dalam draft local. Sambung Supabase pada fasa integrasi.');
});

document.getElementById('exportQuestionsBtn')?.addEventListener('click', () => {
  const q = getQuestionData();
  const payload = {
    lesson_id: 'replace-with-supabase-lesson-id',
    game_type: q.gameType,
    question_text: q.question,
    question_audio_url: q.audio,
    question_image_url: q.image,
    options: q.options,
    correct_answer: q.correct,
    klu_zainab: q.hint,
    xp_reward: Number(q.xp),
    status: q.status
  };
  navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
  showToast('Contoh JSON soalan telah disalin.');
});

document.getElementById('previewNotificationBtn')?.addEventListener('click', () => {
  showSlideNotification(getNotificationTitle(), getNotificationMessage());
});

notificationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  showSlideNotification(getNotificationTitle(), getNotificationMessage());
  showToast('Notifikasi demo dihantar dan akan masuk Inbox Parent selepas sambungan Supabase.');
});

function getNotificationTitle() {
  return document.getElementById('notificationTitle')?.value || 'JawiKids';
}
function getNotificationMessage() {
  return document.getElementById('notificationMessage')?.value || 'Notifikasi baharu.';
}

function showSlideNotification(title, message) {
  const el = document.getElementById('slideNotification');
  if (!el) return;
  el.innerHTML = `<b>🔔 ${escapeHtml(title)}</b><span>${escapeHtml(message)}</span>`;
  el.classList.remove('hidden');
  clearTimeout(window.__slideNoticeTimer);
  window.__slideNoticeTimer = setTimeout(() => el.classList.add('hidden'), 3200);
}

function showToast(message) {
  let toast = document.querySelector('.admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'admin-toast hidden';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(window.__adminToastTimer);
  window.__adminToastTimer = setTimeout(() => toast.classList.add('hidden'), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

renderQuestionPreview();
