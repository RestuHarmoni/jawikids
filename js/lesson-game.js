// JawiKids v1.34 - Lesson audio manager sync + selected child safe lesson flow
(function(){
  'use strict';

  const LESSON = {
    id: 'pulau-alif-ba-01',
    audioKey: 'lesson_instruction_pulau_alif_ba_01',
    island: 1,
    moduleTitle: 'Pulau Alif',
    title: 'Ketuk huruf Ba!',
    instruction: 'Dengar arahan audio, kemudian pilih huruf Jawi yang betul.',
    audioText: 'Pilih huruf Ba. Cari huruf Ba jawi.',
    question: 'Pilih huruf Ba',
    correct: 'ب',
    choices: ['ا','ب','ت','ث'],
    xpReward: 10
  };

  let currentUser = null;
  let selectedChild = null;
  let hasAnswered = false;
  let audioSettings = {};
  let activeAudio = null;

  function $(id){ return document.getElementById(id); }
  function setText(id, value){ const el = $(id); if(el) el.textContent = value; }

  function selectedChildId(){
    return localStorage.getItem('jawikids_selected_child_id') ||
           localStorage.getItem('selected_child_id') ||
           sessionStorage.getItem('jawikids_selected_child_id') ||
           sessionStorage.getItem('selected_child_id') || '';
  }

  async function initAuth(){
    if(!window.jawiSupabase) return null;
    const { data } = await window.jawiSupabase.auth.getUser();
    currentUser = data && data.user ? data.user : null;
    if(!currentUser){ window.location.href = 'login.html'; return null; }
    return currentUser;
  }

  async function loadSelectedChild(){
    const childId = selectedChildId();
    if(!childId || !window.jawiSupabase || !currentUser) return null;
    const { data, error } = await window.jawiSupabase
      .from('children')
      .select('id,name,avatar,total_xp,current_island,hearts,parent_id')
      .eq('id', childId)
      .eq('parent_id', currentUser.id)
      .maybeSingle();
    if(error){ console.warn('[JawiKids] child load error', error.message); return null; }
    selectedChild = data || null;
    return selectedChild;
  }

  async function loadAudioSettings(){
    audioSettings = {};
    if(!window.jawiSupabase) return;
    const keys = [LESSON.audioKey, 'feedback_correct', 'feedback_wrong'];
    const { data, error } = await window.jawiSupabase
      .from('audio_settings')
      .select('audio_key,audio_text,audio_url,is_active')
      .in('audio_key', keys)
      .eq('is_active', true);
    if(error){
      console.warn('[JawiKids] audio_settings not ready, using fallback TTS:', error.message);
      return;
    }
    (data || []).forEach(row => { audioSettings[row.audio_key] = row; });
  }

  async function loadProgressPercent(){
    if(!window.jawiSupabase || !selectedChild) return 0;
    const { data, error } = await window.jawiSupabase
      .from('child_progress')
      .select('progress_percent,is_completed')
      .eq('child_id', selectedChild.id)
      .eq('lesson_id', LESSON.id)
      .maybeSingle();
    if(error) return 0;
    return data && typeof data.progress_percent === 'number' ? data.progress_percent : 0;
  }

  function renderBase(progress){
    setText('lessonPill', `Lesson 1 · ${LESSON.moduleTitle}`);
    setText('lessonTitle', LESSON.title);
    setText('lessonInstruction', LESSON.instruction);
    setText('mainJawi', LESSON.correct);
    setText('childNameText', selectedChild ? selectedChild.name : 'Anak');
    setText('xpText', selectedChild ? `${selectedChild.total_xp || 0} XP` : '0 XP');
    setText('heartText', selectedChild ? '❤️'.repeat(Math.max(0, Math.min(5, selectedChild.hearts || 5))) : '❤️❤️❤️❤️❤️');
    const fill = $('lessonProgressFill');
    if(fill) fill.style.width = `${Math.max(0, Math.min(100, progress || 0))}%`;
    setText('lessonProgressText', `${Math.round(progress || 0)}% siap`);

    const grid = $('answerGrid');
    if(grid){
      grid.innerHTML = '';
      LESSON.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dir = 'rtl';
        btn.textContent = choice;
        btn.addEventListener('click', () => answer(choice, btn));
        grid.appendChild(btn);
      });
    }
  }

  function getAudioSetting(key, fallbackText){
    const setting = audioSettings[key] || {};
    return {
      url: setting.audio_url || '',
      text: setting.audio_text || fallbackText || LESSON.audioText
    };
  }

  function playAudioKey(key, fallbackText){
    const setting = getAudioSetting(key, fallbackText);
    if(setting.url){
      playAudioUrl(setting.url, setting.text);
      return;
    }
    speak(setting.text);
  }

  function playAudioUrl(url, fallbackText){
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      if(window.speechSynthesis) window.speechSynthesis.cancel();
      activeAudio = new Audio(url);
      activeAudio.onplay = () => showAudioStatus('Audio sedang dimainkan...');
      activeAudio.onended = () => showAudioStatus('Tekan speaker untuk ulang audio.');
      activeAudio.onerror = () => speak(fallbackText);
      activeAudio.play().catch(() => speak(fallbackText));
    }catch(e){
      speak(fallbackText);
    }
  }

  function getVoice(){
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find(v => /ms|malay|indonesia/i.test(v.lang + ' ' + v.name)) ||
           voices.find(v => /en/i.test(v.lang)) ||
           voices[0] || null;
  }

  function speak(text){
    if(!('speechSynthesis' in window)){
      showAudioStatus('Audio tidak disokong oleh browser ini.');
      return;
    }
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text || LESSON.audioText);
      utter.lang = 'ms-MY';
      utter.rate = 0.82;
      utter.pitch = 1.05;
      const voice = getVoice();
      if(voice) utter.voice = voice;
      utter.onstart = () => showAudioStatus('Audio sedang dimainkan...');
      utter.onend = () => showAudioStatus('Tekan speaker untuk ulang audio.');
      utter.onerror = () => showAudioStatus('Tekan speaker sekali lagi untuk main audio.');
      window.speechSynthesis.speak(utter);
    }catch(e){
      showAudioStatus('Tekan speaker sekali lagi untuk main audio.');
    }
  }

  function showAudioStatus(msg){ setText('audioStatus', msg); }

  async function answer(choice, btn){
    if(hasAnswered) return;
    const correct = choice === LESSON.correct;
    btn.classList.add(correct ? 'is-correct' : 'is-wrong');
    if(correct){
      hasAnswered = true;
      setText('coachTitle','Tahniah! Jawapan betul.');
      setText('coachNote','Zafri suka semangat kamu. XP akan disimpan.');
      playAudioKey('feedback_correct', 'Tahniah. Jawapan betul. Ini huruf Ba.');
      await saveCorrectProgress();
    }else{
      setText('coachTitle','Cuba lagi ya.');
      setText('coachNote','Zainab beri klu: bentuk Ba ada satu titik di bawah.');
      playAudioKey('feedback_wrong', 'Cuba lagi. Huruf Ba ada satu titik di bawah.');
    }
  }

  async function saveCorrectProgress(){
    if(!window.jawiSupabase || !selectedChild) return;
    const newXp = (selectedChild.total_xp || 0) + LESSON.xpReward;
    await window.jawiSupabase
      .from('children')
      .update({ total_xp: newXp, current_island: Math.max(selectedChild.current_island || 1, LESSON.island) })
      .eq('id', selectedChild.id)
      .eq('parent_id', currentUser.id);

    await window.jawiSupabase
      .from('child_progress')
      .upsert({
        child_id: selectedChild.id,
        lesson_id: LESSON.id,
        progress_percent: 100,
        is_completed: true,
        xp_earned: LESSON.xpReward,
        updated_at: new Date().toISOString()
      }, { onConflict: 'child_id,lesson_id' });

    selectedChild.total_xp = newXp;
    setText('xpText', `${newXp} XP`);
    const fill = $('lessonProgressFill');
    if(fill) fill.style.width = '100%';
    setText('lessonProgressText', '100% siap');
  }

  async function boot(){
    await initAuth();
    await Promise.all([loadSelectedChild(), loadAudioSettings()]);
    const progress = await loadProgressPercent();
    renderBase(progress);
    const audioBtn = $('playAudioBtn');
    if(audioBtn) audioBtn.addEventListener('click', () => playAudioKey(LESSON.audioKey, LESSON.audioText));
    showAudioStatus('Tekan butang speaker untuk dengar arahan.');
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
