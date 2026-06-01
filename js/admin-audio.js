// JawiKids v1.38 - Admin Audio Manager + Letter Audio Keys
(function(){
  'use strict';

  const DEFAULT_AUDIO = [
    { audio_key:'lesson_instruction_pulau_alif_ba_01', category:'lesson', title:'Arahan Huruf Ba', audio_text:'Pilih huruf Ba. Cari huruf Ba jawi.', audio_url:'', is_active:true },
    { audio_key:'feedback_correct', category:'feedback', title:'Jawapan Betul', audio_text:'Tahniah. Jawapan betul. Hebat!', audio_url:'', is_active:true },
    { audio_key:'feedback_wrong', category:'feedback', title:'Jawapan Salah', audio_text:'Cuba lagi ya. Kamu hampir berjaya.', audio_url:'', is_active:true },
    { audio_key:'daily_reward_claim', category:'reward', title:'Ganjaran Harian', audio_text:'Tahniah. Kamu dapat ganjaran harian.', audio_url:'', is_active:true },
    { audio_key:'achievement_unlock', category:'reward', title:'Achievement Unlock', audio_text:'Hebat. Kamu membuka pencapaian baharu.', audio_url:'', is_active:true },
    { audio_key:'dashboard_welcome', category:'system', title:'Selamat Datang', audio_text:'Selamat datang ke JawiKids. Jom belajar Jawi.', audio_url:'', is_active:true },
    { audio_key:'letter_alif', category:'letter', title:'Huruf Alif', audio_text:'Ini huruf Alif.', audio_url:'', is_active:true },
    { audio_key:'letter_ba', category:'letter', title:'Huruf Ba', audio_text:'Ini huruf Ba.', audio_url:'', is_active:true },
    { audio_key:'letter_ta', category:'letter', title:'Huruf Ta', audio_text:'Ini huruf Ta.', audio_url:'', is_active:true },
    { audio_key:'letter_tha', category:'letter', title:'Huruf Tha', audio_text:'Ini huruf Tha.', audio_url:'', is_active:true },
    { audio_key:'letter_jim', category:'letter', title:'Huruf Jim', audio_text:'Ini huruf Jim.', audio_url:'', is_active:true },
    { audio_key:'letter_cha', category:'letter', title:'Huruf Cha', audio_text:'Ini huruf Cha.', audio_url:'', is_active:true },
    { audio_key:'letter_ha', category:'letter', title:'Huruf Ha', audio_text:'Ini huruf Ha.', audio_url:'', is_active:true },
    { audio_key:'letter_kha', category:'letter', title:'Huruf Kha', audio_text:'Ini huruf Kha.', audio_url:'', is_active:true },
    { audio_key:'letter_dal', category:'letter', title:'Huruf Dal', audio_text:'Ini huruf Dal.', audio_url:'', is_active:true },
    { audio_key:'letter_zal', category:'letter', title:'Huruf Zal', audio_text:'Ini huruf Zal.', audio_url:'', is_active:true },
    { audio_key:'letter_ra', category:'letter', title:'Huruf Ra', audio_text:'Ini huruf Ra.', audio_url:'', is_active:true },
    { audio_key:'letter_zai', category:'letter', title:'Huruf Zai', audio_text:'Ini huruf Zai.', audio_url:'', is_active:true },
    { audio_key:'letter_sin', category:'letter', title:'Huruf Sin', audio_text:'Ini huruf Sin.', audio_url:'', is_active:true },
    { audio_key:'letter_syin', category:'letter', title:'Huruf Syin', audio_text:'Ini huruf Syin.', audio_url:'', is_active:true },
    { audio_key:'letter_sad', category:'letter', title:'Huruf Sad', audio_text:'Ini huruf Sad.', audio_url:'', is_active:true },
    { audio_key:'letter_dad', category:'letter', title:'Huruf Dad', audio_text:'Ini huruf Dad.', audio_url:'', is_active:true },
    { audio_key:'letter_to', category:'letter', title:'Huruf To', audio_text:'Ini huruf To.', audio_url:'', is_active:true },
    { audio_key:'letter_zo', category:'letter', title:'Huruf Zo', audio_text:'Ini huruf Zo.', audio_url:'', is_active:true },
    { audio_key:'letter_ain', category:'letter', title:'Huruf Ain', audio_text:'Ini huruf Ain.', audio_url:'', is_active:true },
    { audio_key:'letter_ghain', category:'letter', title:'Huruf Ghain', audio_text:'Ini huruf Ghain.', audio_url:'', is_active:true },
    { audio_key:'letter_nga', category:'letter', title:'Huruf Nga', audio_text:'Ini huruf Nga.', audio_url:'', is_active:true },
    { audio_key:'letter_fa', category:'letter', title:'Huruf Fa', audio_text:'Ini huruf Fa.', audio_url:'', is_active:true },
    { audio_key:'letter_pa', category:'letter', title:'Huruf Pa', audio_text:'Ini huruf Pa.', audio_url:'', is_active:true },
    { audio_key:'letter_qaf', category:'letter', title:'Huruf Qaf', audio_text:'Ini huruf Qaf.', audio_url:'', is_active:true },
    { audio_key:'letter_kaf', category:'letter', title:'Huruf Kaf', audio_text:'Ini huruf Kaf.', audio_url:'', is_active:true },
    { audio_key:'letter_ga', category:'letter', title:'Huruf Ga', audio_text:'Ini huruf Ga.', audio_url:'', is_active:true },
    { audio_key:'letter_lam', category:'letter', title:'Huruf Lam', audio_text:'Ini huruf Lam.', audio_url:'', is_active:true },
    { audio_key:'letter_mim', category:'letter', title:'Huruf Mim', audio_text:'Ini huruf Mim.', audio_url:'', is_active:true },
    { audio_key:'letter_nun', category:'letter', title:'Huruf Nun', audio_text:'Ini huruf Nun.', audio_url:'', is_active:true },
    { audio_key:'letter_wau', category:'letter', title:'Huruf Wau', audio_text:'Ini huruf Wau.', audio_url:'', is_active:true },
    { audio_key:'letter_va', category:'letter', title:'Huruf Va', audio_text:'Ini huruf Va.', audio_url:'', is_active:true },
    { audio_key:'letter_ha2', category:'letter', title:'Huruf Ha', audio_text:'Ini huruf Ha.', audio_url:'', is_active:true },
    { audio_key:'letter_hamzah', category:'letter', title:'Huruf Hamzah', audio_text:'Ini huruf Hamzah.', audio_url:'', is_active:true },
    { audio_key:'letter_ya', category:'letter', title:'Huruf Ya', audio_text:'Ini huruf Ya.', audio_url:'', is_active:true }
  ];

  let currentUser = null;
  let rows = [];

  function $(id){ return document.getElementById(id); }
  function val(id){ return ($(id) && $(id).value || '').trim(); }
  function setVal(id, value){ if($(id)) $(id).value = value || ''; }
  function setText(id, text){ if($(id)) $(id).textContent = text; }

  async function boot(){
    bindUI();
    await requireAdmin();
    await loadAudioSettings();
  }

  function bindUI(){
    $('menuToggle')?.addEventListener('click', () => $('sidebar')?.classList.toggle('open'));
    $('refreshAudioBtn')?.addEventListener('click', loadAudioSettings);
    $('seedDefaultAudioBtn')?.addEventListener('click', seedDefaultAudio);
    $('testAudioBtn')?.addEventListener('click', testCurrentAudio);
    $('audioForm')?.addEventListener('submit', saveAudioSetting);
    $('audioKey')?.addEventListener('change', onAudioKeyChange);
  }

  async function requireAdmin(){
    if(!window.jawiSupabase){ showToast('Supabase belum tersedia.'); return; }
    const { data } = await window.jawiSupabase.auth.getUser();
    currentUser = data && data.user ? data.user : null;
    if(!currentUser){ window.location.href = 'login.html'; return; }

    const { data: profile, error } = await window.jawiSupabase
      .from('profiles')
      .select('id,is_admin')
      .eq('id', currentUser.id)
      .maybeSingle();

    if(error || !profile || profile.is_admin !== true){
      showToast('Akses admin diperlukan.');
      setTimeout(() => window.location.href = 'parent-dashboard.html', 900);
    }
  }

  async function loadAudioSettings(){
    if(!window.jawiSupabase) return;
    const { data, error } = await window.jawiSupabase
      .from('audio_settings')
      .select('*')
      .order('category', { ascending:true })
      .order('audio_key', { ascending:true });

    if(error){
      renderAudioList([], error.message);
      showToast('Gagal load audio_settings. Run SQL v1.34 dahulu.');
      return;
    }
    rows = data || [];
    renderAudioList(rows);
    setText('audioCount', String(rows.length));
    setText('audioActiveCount', String(rows.filter(r => r.is_active).length));
    setText('audioFallbackCount', String(rows.filter(r => !r.audio_url).length));
  }

  function renderAudioList(list, errorMsg){
    const box = $('audioList');
    if(!box) return;
    if(errorMsg){
      box.innerHTML = `<div class="content-item"><b>Table belum ready</b><span>${escapeHtml(errorMsg)}</span></div>`;
      return;
    }
    if(!list.length){
      box.innerHTML = `<div class="content-item"><b>Belum ada audio</b><span>Klik Seed Default untuk mula.</span></div>`;
      return;
    }
    box.innerHTML = list.map(row => `
      <div class="content-item audio-row" data-key="${escapeHtml(row.audio_key)}">
        <b>${escapeHtml(row.title || row.audio_key)}</b>
        <span>${escapeHtml(row.category || 'audio')} · ${row.is_active ? 'Active' : 'Off'} · ${row.audio_url ? 'MP3/URL' : 'Fallback TTS'}</span>
        <button class="mini-btn" type="button" data-edit="${escapeHtml(row.audio_key)}">Edit</button>
      </div>
    `).join('');
    box.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => fillForm(btn.dataset.edit)));
  }

  function fillForm(key){
    const row = rows.find(r => r.audio_key === key);
    if(!row) return;
    const select = $('audioKey');
    const known = Array.from(select.options).some(opt => opt.value === key);
    select.value = known ? key : 'custom';
    $('customKeyWrap')?.classList.toggle('hidden', known);
    setVal('customAudioKey', known ? '' : key);
    setVal('audioCategory', row.category || 'lesson');
    setVal('audioIsActive', row.is_active ? 'true' : 'false');
    setVal('audioTitle', row.title || '');
    setVal('audioText', row.audio_text || '');
    setVal('audioUrl', row.audio_url || '');
    showToast('Audio dimuatkan untuk edit.');
  }

  function onAudioKeyChange(){
    const isCustom = val('audioKey') === 'custom';
    $('customKeyWrap')?.classList.toggle('hidden', !isCustom);
    const key = isCustom ? val('customAudioKey') : val('audioKey');
    const row = rows.find(r => r.audio_key === key) || DEFAULT_AUDIO.find(r => r.audio_key === key);
    if(row){
      setVal('audioCategory', row.category || 'lesson');
      setVal('audioTitle', row.title || '');
      setVal('audioText', row.audio_text || '');
      setVal('audioUrl', row.audio_url || '');
      setVal('audioIsActive', row.is_active === false ? 'false' : 'true');
    }
  }

  async function uploadAudioFile(audioKey){
    const file = $('audioFile')?.files?.[0];
    if(!file) return '';
    if(file.size > 2 * 1024 * 1024){ throw new Error('Fail audio melebihi 2MB.'); }
    const ext = (file.name.split('.').pop() || 'mp3').toLowerCase();
    const safeKey = audioKey.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const path = `admin/${safeKey}-${Date.now()}.${ext}`;
    const { error } = await window.jawiSupabase.storage.from('audio').upload(path, file, { cacheControl:'3600', upsert:true });
    if(error) throw error;
    const { data } = window.jawiSupabase.storage.from('audio').getPublicUrl(path);
    return data && data.publicUrl ? data.publicUrl : '';
  }

  async function saveAudioSetting(event){
    event.preventDefault();
    if(!window.jawiSupabase) return;
    const audioKey = val('audioKey') === 'custom' ? val('customAudioKey') : val('audioKey');
    if(!audioKey){ showToast('Audio key wajib diisi.'); return; }

    try{
      showToast('Menyimpan audio...');
      const uploadedUrl = await uploadAudioFile(audioKey);
      const payload = {
        audio_key: audioKey,
        category: val('audioCategory') || 'lesson',
        title: val('audioTitle') || audioKey,
        audio_text: val('audioText'),
        audio_url: uploadedUrl || val('audioUrl'),
        is_active: val('audioIsActive') === 'true',
        updated_by: currentUser ? currentUser.id : null,
        updated_at: new Date().toISOString()
      };
      const { error } = await window.jawiSupabase
        .from('audio_settings')
        .upsert(payload, { onConflict:'audio_key' });
      if(error) throw error;
      $('audioFile').value = '';
      showToast('Audio berjaya disimpan.');
      await loadAudioSettings();
    }catch(err){
      showToast('Gagal simpan audio: ' + (err.message || err));
    }
  }

  async function seedDefaultAudio(){
    if(!window.jawiSupabase) return;
    const payload = DEFAULT_AUDIO.map(row => ({ ...row, updated_by: currentUser ? currentUser.id : null, updated_at: new Date().toISOString() }));
    const { error } = await window.jawiSupabase.from('audio_settings').upsert(payload, { onConflict:'audio_key' });
    if(error){ showToast('Gagal seed audio: ' + error.message); return; }
    showToast('Default audio berjaya dimasukkan.');
    await loadAudioSettings();
  }

  function testCurrentAudio(){
    const url = val('audioUrl');
    const text = val('audioText') || 'JawiKids audio test.';
    if(url){
      const audio = new Audio(url);
      audio.play().catch(() => speak(text));
    }else{
      speak(text);
    }
  }

  function speak(text){
    if(!('speechSynthesis' in window)){ showToast('Browser tidak sokong audio fallback.'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ms-MY';
    u.rate = 0.85;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  }

  function showToast(message){
    let toast = document.querySelector('.admin-toast');
    if(!toast){ toast = document.createElement('div'); toast.className = 'admin-toast hidden'; document.body.appendChild(toast); }
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window.__adminAudioToastTimer);
    window.__adminAudioToastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  function escapeHtml(value){
    return String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
