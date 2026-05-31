// JawiKids Learning System v1.12
// Sprint 2: Huruf Jawi, Flash Card, Matching Game, Quiz + Supabase progress sync
let currentCard = 0;
let quizIndex = 0;
let quizScore = 0;
let quizStartedAt = Date.now();
let currentMatchingItem = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[s]));
}

function activeChild() {
  const kids = JK.children();
  if (!kids.length) return null;
  const selectedId = localStorage.getItem('jawikids_selected_child_id');
  return kids.find(c => c.id === selectedId) || kids[0];
}

function setActiveChild(childId) {
  localStorage.setItem('jawikids_selected_child_id', childId);
  renderLearningHeader();
  renderLearningHome();
}

function childOrWarn() {
  const child = activeChild();
  if (!child) JK.toast('Sila tambah profil anak dahulu di menu Anak Saya.');
  return child;
}

function progressFor(moduleName) {
  const child = activeChild();
  if (!child) return 0;
  const rows = JK.load().progress.filter(p => p.child_id === child.id && p.module === moduleName);
  if (!rows.length) return 0;
  return Math.max(...rows.map(r => Number(r.progress || 0)));
}

async function saveProgress(moduleName, lesson, progress, completed = false) {
  const child = childOrWarn();
  if (!child) return null;
  const row = {
    child_id: child.id,
    module: moduleName,
    lesson,
    progress,
    completed,
    updated_at: new Date().toISOString()
  };
  const saved = await JK.insertRow('learning_progress', row);
  const st = JK.load();
  st.progress.push(saved.data || { ...row, id: JK.id('prog') });
  JK.save(st);
  return saved.data;
}

function renderLearningHeader() {
  const slot = document.querySelector('[data-learning-child]');
  if (!slot) return;
  const kids = JK.children();
  if (!kids.length) {
    slot.innerHTML = `<div class="alert">Belum ada profil anak. <a href="children.html">Tambah anak dahulu</a>.</div>`;
    return;
  }
  const child = activeChild();
  slot.innerHTML = `
    <div class="card compact-card">
      <label class="muted">Anak aktif</label>
      <select id="activeChildSelect">
        ${kids.map(k => `<option value="${escapeHtml(k.id)}" ${k.id === child.id ? 'selected' : ''}>${escapeHtml(k.full_name)} • Level ${k.level || 1} • ${k.xp || 0} XP</option>`).join('')}
      </select>
    </div>`;
  document.querySelector('#activeChildSelect')?.addEventListener('change', e => setActiveChild(e.target.value));
}

function renderLearningHome() {
  const el = document.querySelector('#learningSummary');
  if (!el) return;
  const modules = [
    ['Huruf Jawi', 'huruf-jawi.html', 'ا', 'Kenal semua huruf asas Jawi.'],
    ['Flash Card', 'flashcard.html', '🃏', 'Ulang kaji huruf secara kad interaktif.'],
    ['Matching Game', 'matching-game.html', '🎮', 'Padankan huruf dengan sebutan.'],
    ['Quiz Jawi', 'quiz.html', '📝', 'Uji kefahaman asas Jawi.']
  ];
  el.innerHTML = modules.map(([name, href, icon, desc]) => {
    const pct = progressFor(name);
    return `<a class="card module-card" href="${href}">
      <div class="module-icon">${icon}</div>
      <h3>${name}</h3>
      <p class="muted">${desc}</p>
      <div class="progress"><span style="width:${pct}%"></span></div>
      <small>${pct}% selesai</small>
    </a>`;
  }).join('');
}

function renderLetters() {
  const el = document.querySelector('#letterGrid');
  if (!el) return;
  el.innerHTML = JK.letters.map(([j, n], index) => `
    <button class="letter" data-letter-index="${index}">
      <div>${j}</div>
      <small>${n}</small>
      <span>Dengar / Belajar</span>
    </button>`).join('');
  el.querySelectorAll('[data-letter-index]').forEach(btn => {
    btn.addEventListener('click', () => learnLetter(Number(btn.dataset.letterIndex)));
  });
}

async function learnLetter(index) {
  const child = childOrWarn();
  if (!child) return;
  const [jawi, name] = JK.letters[index];
  const pct = Math.min(100, Math.round(((index + 1) / JK.letters.length) * 100));
  await JK.addXP(child.id, 5, 'Huruf Jawi');
  await saveProgress('Huruf Jawi', name, pct, pct >= 100);
  const detail = document.querySelector('#letterDetail');
  if (detail) {
    detail.innerHTML = `<div class="card focus-card"><div class="jawi-mega">${jawi}</div><h2>${name}</h2><p>XP +5 telah direkodkan untuk ${escapeHtml(child.full_name)}.</p><p class="muted">Progress Huruf Jawi: ${pct}%</p></div>`;
  }
  JK.toast(`${name} dipelajari. +5 XP`);
}

function renderFlashcard() {
  const el = document.querySelector('#flashcardBox');
  if (!el) return;
  const [j, n] = JK.letters[currentCard % JK.letters.length];
  el.innerHTML = `<div class="flash-card-inner"><div class="jawi-mega">${j}</div><p class="muted">Klik kad untuk lihat nama huruf</p></div>`;
  el.onclick = async () => {
    el.innerHTML = `<div class="flash-card-inner"><h1>${n}</h1><p class="jawi-big">${j}</p><p class="muted">Kad ${currentCard + 1}/${JK.letters.length}</p></div>`;
    const child = childOrWarn();
    if (child) {
      const pct = Math.min(100, Math.round(((currentCard + 1) / JK.letters.length) * 100));
      await JK.addXP(child.id, 2, 'Flash Card');
      await saveProgress('Flash Card', n, pct, pct >= 100);
    }
  };
  const next = document.querySelector('#nextCard');
  if (next) next.onclick = () => { currentCard = (currentCard + 1) % JK.letters.length; renderFlashcard(); };
  const prev = document.querySelector('#prevCard');
  if (prev) prev.onclick = () => { currentCard = (currentCard - 1 + JK.letters.length) % JK.letters.length; renderFlashcard(); };
}

function renderMatching() {
  const el = document.querySelector('#matchingBox');
  if (!el) return;
  const item = JK.letters[Math.floor(Math.random() * JK.letters.length)];
  currentMatchingItem = item;
  const opts = [item[1], ...JK.letters.filter(x => x[1] !== item[1]).sort(() => .5 - Math.random()).slice(0, 3).map(x => x[1])].sort(() => .5 - Math.random());
  el.innerHTML = `<div class="card focus-card"><div class="jawi-mega">${item[0]}</div><h3>Pilih sebutan yang betul</h3><div class="grid grid-2">${opts.map(o => `<button class="option" data-match="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('')}</div></div>`;
  el.querySelectorAll('[data-match]').forEach(btn => {
    btn.addEventListener('click', () => answerMatch(btn, btn.dataset.match, item[1]));
  });
}

async function answerMatch(btn, ans, correct) {
  const child = childOrWarn();
  if (ans === correct) {
    btn.classList.add('correct');
    if (child) {
      await JK.addXP(child.id, 10, 'Matching Game');
      await saveProgress('Matching Game', correct, Math.min(100, progressFor('Matching Game') + 10), false);
    }
    JK.toast('Betul! +10 XP');
    setTimeout(renderMatching, 800);
  } else {
    btn.classList.add('wrong');
    JK.toast('Cuba lagi.');
  }
}

function renderQuiz() {
  const el = document.querySelector('#quizBox');
  if (!el) return;
  const q = JK.questions[quizIndex % JK.questions.length];
  el.innerHTML = `<div class="card focus-card"><p class="muted">Soalan ${quizIndex + 1}/${JK.questions.length}</p><h2>${escapeHtml(q.q)}</h2><div class="grid grid-2">${q.o.map(o => `<button class="option" data-quiz-option="${escapeHtml(o)}">${escapeHtml(o)}</button>`).join('')}</div><p>Skor: <b>${quizScore}</b></p></div>`;
  el.querySelectorAll('[data-quiz-option]').forEach(btn => {
    btn.addEventListener('click', () => answerQuiz(btn, btn.dataset.quizOption, q.a));
  });
}

async function answerQuiz(btn, ans, correct) {
  const child = childOrWarn();
  if (ans === correct) {
    quizScore++;
    btn.classList.add('correct');
    if (child) await JK.addXP(child.id, 20, 'Quiz Jawi');
  } else {
    btn.classList.add('wrong');
  }
  setTimeout(async () => {
    quizIndex++;
    if (quizIndex >= JK.questions.length) {
      const selected = childOrWarn();
      const duration = Math.round((Date.now() - quizStartedAt) / 1000);
      if (selected) {
        await JK.saveQuizResult({ child_id: selected.id, quiz_type: 'Jawi Asas v1.12', score: quizScore, correct: quizScore, wrong: JK.questions.length - quizScore, duration, created_at: new Date().toISOString() });
        await saveProgress('Quiz Jawi', 'Quiz Jawi Asas', 100, true);
      }
      document.querySelector('#quizBox').innerHTML = `<div class="card focus-card"><h2>Keputusan Quiz</h2><p>Markah: <b>${quizScore}/${JK.questions.length}</b></p><p>Masa: ${duration} saat</p><button class="btn" onclick="location.reload()">Ulang Quiz</button></div>`;
    } else renderQuiz();
  }, 700);
}

document.addEventListener('DOMContentLoaded', async () => {
  const parent = JK.requireAuth();
  if (!parent) return;
  await JK.syncAll();
  renderLearningHeader();
  renderLearningHome();
  renderLetters();
  renderFlashcard();
  renderMatching();
  renderQuiz();
});
