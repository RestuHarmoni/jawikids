const islands = document.querySelectorAll('.learning-island');
const detailBadge = document.getElementById('detailBadge');
const detailTitle = document.getElementById('detailTitle');
const detailStatus = document.getElementById('detailStatus');
const claimRewardBtn = document.getElementById('claimRewardBtn');

const mapChildName = document.getElementById('mapChildName');
const mapIntroName = document.getElementById('mapIntroName');
const mapChildAvatar = document.getElementById('mapChildAvatar');
const mapHearts = document.getElementById('mapHearts');
const mapXp = document.getElementById('mapXp');
const mapStreak = document.getElementById('mapStreak');

const setText = (el, text) => { if (el) el.textContent = text; };
const formatNumber = (value) => Number(value || 0).toLocaleString('ms-MY');

function getAvatarForChild(child) {
  const gender = (child?.gender || '').toLowerCase();
  const key = (child?.avatar_key || '').toLowerCase();
  if (window.JawiKidsCharacters?.getChildAvatar) {
    return window.JawiKidsCharacters.getChildAvatar(child);
  }
  if (key.includes('zainab') || gender === 'female' || gender === 'girl') return 'assets/characters/zainab-main.svg?v=1.31.0';
  return 'assets/characters/zafri-main.svg?v=1.31.0';
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
      window.location.href = 'child-select.html';
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
    islands.forEach((island) => {
      const islandNo = Number(island.dataset.island || 0);
      island.classList.remove('island-done', 'island-current', 'island-locked', 'selected-island');
      if (islandNo < currentIsland) island.classList.add('island-done');
      else if (islandNo === currentIsland) {
        island.classList.add('island-current', 'selected-island');
        detailBadge.textContent = `Pulau ${islandNo}`;
        detailTitle.textContent = island.dataset.title || `Pulau ${islandNo}`;
        detailStatus.textContent = `Status: Sedang Dipelajari`;
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
    const xp = island.dataset.xp;
    detailBadge.textContent = `Pulau ${number}`;
    detailTitle.textContent = title;
    detailStatus.textContent = `Status: ${status} • ${xp}`;
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
