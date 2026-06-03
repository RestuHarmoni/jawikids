const islands = document.querySelectorAll('.learning-island');
const detailBadge = document.getElementById('detailBadge');
const detailTitle = document.getElementById('detailTitle');
const detailStatus = document.getElementById('detailStatus');
const detailProgressFill = document.getElementById('detailProgressFill');
const detailProgressText = document.getElementById('detailProgressText');
const claimRewardBtn = document.getElementById('claimRewardBtn');

const mapChildName = document.getElementById('mapChildName');
const mapIntroName = document.getElementById('mapIntroName');
const mapChildAvatar = document.getElementById('mapChildAvatar');
const mapHearts = document.getElementById('mapHearts');
const mapXp = document.getElementById('mapXp');
const mapStreak = document.getElementById('mapStreak');

const setText = (el, text) => { if (el) el.textContent = text; };
const formatNumber = (value) => Number(value || 0).toLocaleString('ms-MY');
const clampPercent = (value) => Math.max(0, Math.min(100, Number(value || 0)));

function getProgressStatus(percent, islandNo, currentIsland) {
  if (islandNo < currentIsland) return 'Selesai';
  if (islandNo > currentIsland) return 'Terkunci';
  if (percent <= 0) return 'Belum Mula';
  if (percent >= 80) return 'Sedia Unlock';
  return 'Sedang Dipelajari';
}

async function getIslandProgressMap(supabase, childId) {
  const progressByIsland = {};
  for (let i = 1; i <= 10; i += 1) progressByIsland[i] = { total: 0, done: 0, percent: 0 };

  const { data: modules, error: moduleError } = await supabase
    .from('learning_modules')
    .select('id,order_index')
    .order('order_index', { ascending: true });
  if (moduleError) throw moduleError;

  const moduleToIsland = {};
  (modules || []).forEach((mod) => {
    moduleToIsland[mod.id] = Number(mod.order_index || 0);
  });

  const { data: lessons, error: lessonError } = await supabase
    .from('lessons')
    .select('id,module_id');
  if (lessonError) throw lessonError;

  const lessonToIsland = {};
  (lessons || []).forEach((lesson) => {
    const islandNo = moduleToIsland[lesson.module_id];
    if (!islandNo) return;
    lessonToIsland[lesson.id] = islandNo;
    progressByIsland[islandNo].total += 1;
  });

  if ((lessons || []).length === 0) return progressByIsland;

  const { data: progress, error: progressError } = await supabase
    .from('child_progress')
    .select('lesson_id,is_completed,score')
    .eq('child_id', childId);
  if (progressError) throw progressError;

  (progress || []).forEach((row) => {
    const islandNo = lessonToIsland[row.lesson_id];
    if (!islandNo) return;
    if (row.is_completed || Number(row.score || 0) > 0) progressByIsland[islandNo].done += 1;
  });

  Object.values(progressByIsland).forEach((item) => {
    item.percent = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
  });

  return progressByIsland;
}

function updateDetailPanel(islandNo, title, status, percent) {
  setText(detailBadge, `Pulau ${islandNo}`);
  setText(detailTitle, title || `Pulau ${islandNo}`);
  setText(detailStatus, `Status: ${status}`);
  if (detailProgressFill) detailProgressFill.style.width = `${clampPercent(percent)}%`;
  setText(detailProgressText, `${clampPercent(percent)}% siap • Sasaran unlock 80%`);
}


function getAvatarForChild(child) {
  const gender = (child?.gender || '').toLowerCase();
  const key = (child?.avatar_key || '').toLowerCase();
  if (window.JawiKidsCharacters?.getChildAvatar) {
    return window.JawiKidsCharacters.getChildAvatar(child);
  }
  if (key.includes('zainab') || gender === 'female' || gender === 'girl') return 'assets/characters/zainab-main.svg?v=1.52.0';
  return 'assets/characters/zafri-main.svg?v=1.52.0';
}

async function ensureSelectedChild(supabase, userId) {
  let selectedChildId = localStorage.getItem('jawikids_selected_child_id');
  let child = null;

  if (selectedChildId) {
    const { data, error } = await supabase
      .from('children')
      .select('id,parent_id,name,gender,avatar_key,total_xp,current_island,hearts')
      .eq('id', selectedChildId)
      .eq('parent_id', userId)
      .maybeSingle();
    if (!error && data) child = data;
  }

  if (!child) {
    const { data, error } = await supabase
      .from('children')
      .select('id,parent_id,name,gender,avatar_key,total_xp,current_island,hearts')
      .eq('parent_id', userId)
      .order('created_at', { ascending: true })
      .limit(1);
    if (error) throw error;
    child = data?.[0] || null;
    if (child?.id) localStorage.setItem('jawikids_selected_child_id', child.id);
  }

  return child;
}

async function loadSelectedChild() {
  const supabase = window.getJawiSupabase?.();
  if (!supabase) {
    setText(mapChildName, 'Supabase belum aktif');
    return;
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const child = await ensureSelectedChild(supabase, user.id);
    if (!child) {
      setText(mapChildName, 'Pilih anak');
      setText(mapIntroName, 'anak hebat');
      setText(mapXp, '0 XP');
      setText(mapHearts, '0');
      setText(mapStreak, '0 Hari');
      window.location.href = 'child-profile.html';
      return;
    }

    const { data: streak } = await supabase
      .from('streaks')
      .select('current_streak,longest_streak')
      .eq('child_id', child.id)
      .maybeSingle();

    setText(mapChildName, child.name || 'Anak');
    setText(mapIntroName, child.name || 'anak hebat');
    setText(mapHearts, `${child.hearts ?? 5}`);
    setText(mapXp, `${formatNumber(child.total_xp)} XP`);
    setText(mapStreak, `${streak?.current_streak || 0} Hari`);

    if (mapChildAvatar) {
      mapChildAvatar.src = getAvatarForChild(child);
      mapChildAvatar.alt = `Avatar ${child.name || 'anak'}`;
    }

    const currentIsland = Number(child.current_island || 1);
    const progressByIsland = await getIslandProgressMap(supabase, child.id);
    islands.forEach((island) => {
      const islandNo = Number(island.dataset.island || 0);
      island.classList.remove('island-done', 'island-current', 'island-locked', 'selected-island');
      const percent = progressByIsland[islandNo]?.percent || 0;
      const status = getProgressStatus(percent, islandNo, currentIsland);
      island.dataset.status = status;
      island.dataset.xp = `${percent}% siap • Sasaran unlock 80%`;
      const islandSmall = island.querySelector('small');
      if (islandSmall) islandSmall.textContent = status;
      if (islandNo < currentIsland) island.classList.add('island-done');
      else if (islandNo === currentIsland) {
        island.classList.add('island-current', 'selected-island');
        updateDetailPanel(islandNo, island.dataset.title, status, percent);
      } else island.classList.add('island-locked');
    });
  } catch (error) {
    console.error('Gagal memuatkan anak untuk game map:', error);
    setText(mapChildName, 'Ralat anak');
    alert(`Gagal memuatkan anak dipilih: ${error.message}`);
  }
}

islands.forEach((island) => {
  island.addEventListener('click', () => {
    islands.forEach((item) => item.classList.remove('selected-island'));
    island.classList.add('selected-island');
    const number = island.dataset.island;
    const title = island.dataset.title;
    const status = island.dataset.status;
    const xp = island.dataset.xp || '0% siap • Sasaran unlock 80%';
    const percent = Number((xp.match(/\d+/) || ['0'])[0]);
    updateDetailPanel(number, title, status, percent);
    localStorage.setItem('jawikids_selected_island', number);
  });
});

claimRewardBtn?.addEventListener('click', async () => {
  claimRewardBtn.textContent = 'Done!';
  claimRewardBtn.disabled = true;
  document.querySelector('.daily-reward-card strong').textContent = 'Reward sudah dituntut';
  document.querySelector('.daily-reward-card span').textContent = 'Daily reward akan disync dalam modul reward.';
});

document.addEventListener('DOMContentLoaded', loadSelectedChild);
