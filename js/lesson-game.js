// JawiKids v1.37 - Lesson quiz after letter intro: no '?' card, quiz flow sync
(function(){
  'use strict';

  const LESSON = {
    id: 'pulau-alif-ba-01',
    island: 1,
    moduleTitle: 'Pulau Alif',
    title: 'Kenal Huruf Asas',
    instruction: 'Dengar arahan audio, kemudian pilih huruf Jawi yang betul.',
    xpReward: 10,
    bonusXp: 20,
    questions: [
      {
        id: 'q1-alif',
        audioKey: 'lesson_instruction_alif_01',
        title: 'Soalan 1: Pilih huruf Alif',
        promptTitle: 'Dengar huruf Alif, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Alif. Cari huruf Alif jawi.',
        correct: 'ا',
        choices: ['ا', 'ب', 'ت', 'ث'],
        hint: 'Alif bentuknya tegak seperti batang.'
      },
      {
        id: 'q2-ba',
        audioKey: 'lesson_instruction_ba_01',
        title: 'Soalan 2: Pilih huruf Ba',
        promptTitle: 'Dengar huruf Ba, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Ba. Cari huruf Ba jawi.',
        correct: 'ب',
        choices: ['ا', 'ب', 'ت', 'ث'],
        hint: 'Ba ada satu titik di bawah.'
      },
      {
        id: 'q3-ta',
        audioKey: 'lesson_instruction_ta_01',
        title: 'Soalan 3: Pilih huruf Ta',
        promptTitle: 'Dengar huruf Ta, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Ta. Cari huruf Ta jawi.',
        correct: 'ت',
        choices: ['ث', 'ب', 'ت', 'ا'],
        hint: 'Ta ada dua titik di atas.'
      },
      {
        id: 'q4-tha',
        audioKey: 'lesson_instruction_tha_01',
        title: 'Soalan 4: Pilih huruf Tha',
        promptTitle: 'Dengar huruf Tha, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Tha. Cari huruf Tha jawi.',
        correct: 'ث',
        choices: ['ا', 'ت', 'ب', 'ث'],
        hint: 'Tha ada tiga titik di atas.'
      },
      {
        id: 'q5-ba',
        audioKey: 'lesson_instruction_ba_02',
        title: 'Soalan 5: Ulang Huruf Ba',
        promptTitle: 'Dengar semula huruf Ba, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Ba.',
        correct: 'ب',
        choices: ['ت', 'ث', 'ب', 'ا'],
        hint: 'Ba ada satu titik di bawah.'
      },
      {
        id: 'q6-alif',
        audioKey: 'lesson_instruction_alif_02',
        title: 'Soalan 6: Ulang Huruf Alif',
        promptTitle: 'Dengar semula huruf Alif, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Alif.',
        correct: 'ا',
        choices: ['ب', 'ا', 'ث', 'ت'],
        hint: 'Alif bentuknya tegak.'
      },
      {
        id: 'q7-ta',
        audioKey: 'lesson_instruction_ta_02',
        title: 'Soalan 7: Ulang Huruf Ta',
        promptTitle: 'Dengar semula huruf Ta, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Ta.',
        correct: 'ت',
        choices: ['ا', 'ث', 'ت', 'ب'],
        hint: 'Ta ada dua titik di atas.'
      },
      {
        id: 'q8-tha',
        audioKey: 'lesson_instruction_tha_02',
        title: 'Soalan 8: Ulang Huruf Tha',
        promptTitle: 'Dengar semula huruf Tha, kemudian pilih jawapan.',
        audioText: 'Pilih huruf Tha.',
        correct: 'ث',
        choices: ['ث', 'ت', 'ب', 'ا'],
        hint: 'Tha ada tiga titik di atas.'
      },
      {
        id: 'q9-campur-alif',
        audioKey: 'lesson_instruction_mix_alif_01',
        title: 'Soalan 9: Campuran Alif',
        promptTitle: 'Dengar audio dan pilih huruf yang betul.',
        audioText: 'Pilih huruf Alif.',
        correct: 'ا',
        choices: ['ت', 'ا', 'ث', 'ب'],
        hint: 'Dengar semula audio dan pilih bentuk yang betul.'
      },
      {
        id: 'q10-campur-ta',
        audioKey: 'lesson_instruction_mix_ta_01',
        title: 'Soalan 10: Campuran Ta',
        promptTitle: 'Dengar audio dan pilih huruf yang betul.',
        audioText: 'Pilih huruf Ta.',
        correct: 'ت',
        choices: ['ب', 'ث', 'ا', 'ت'],
        hint: 'Dengar semula audio dan pilih bentuk yang betul.'
      }
    ]
  };

  let currentUser = null;
  let selectedChild = null;
  let audioSettings = {};
  let activeAudio = null;
  let currentQuestionIndex = 0;
  let score = 0;
  let xpEarnedThisRun = 0;
  let answeredCurrent = false;
  let completedQuestionIds = new Set();

  function $(id){ return document.getElementById(id); }
  function setText(id, value){ const el = $(id); if(el) el.textContent = value; }
  function currentQuestion(){ return LESSON.questions[currentQuestionIndex] || LESSON.questions[0]; }
  function progressPercent(){ return Math.round((currentQuestionIndex / LESSON.questions.length) * 100); }

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
    const keys = Array.from(new Set([
      ...LESSON.questions.map(q => q.audioKey),
      'feedback_correct',
      'feedback_wrong',
      'lesson_complete'
    ]));
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

  async function loadProgress(){
    if(!window.jawiSupabase || !selectedChild) return;
    const { data, error } = await window.jawiSupabase
      .from('child_progress')
      .select('progress_percent,is_completed,xp_earned')
      .eq('child_id', selectedChild.id)
      .eq('lesson_id', LESSON.id)
      .maybeSingle();
    if(error || !data) return;
    const pct = Number(data.progress_percent || 0);
    if(data.is_completed || pct >= 100){
      currentQuestionIndex = 0;
    }else{
      currentQuestionIndex = Math.max(0, Math.min(LESSON.questions.length - 1, Math.floor((pct / 100) * LESSON.questions.length)));
    }
  }

  function renderQuestion(){
    const q = currentQuestion();
    answeredCurrent = false;
    setText('lessonPill', `Lesson 1 · ${LESSON.moduleTitle} · ${currentQuestionIndex + 1}/${LESSON.questions.length}`);
    setText('lessonTitle', q.title || LESSON.title);
    setText('lessonInstruction', LESSON.instruction);
    setText('audioPromptTitle', q.promptTitle || 'Dengar dahulu, kemudian jawab.');
    setText('mainJawi', '🎧');
    setText('childNameText', selectedChild ? selectedChild.name : 'Anak');
    setText('xpText', selectedChild ? `${selectedChild.total_xp || 0} XP` : '0 XP');
    setText('heartText', selectedChild ? '❤️'.repeat(Math.max(0, Math.min(5, selectedChild.hearts || 5))) : '❤️❤️❤️❤️❤️');
    setText('coachTitle','Hebat! Cuba pilih jawapan.');
    setText('coachNote','Dengar audio dahulu, kemudian pilih huruf Jawi yang betul.');
    updateProgressBar(progressPercent());

    const grid = $('answerGrid');
    if(grid){
      grid.innerHTML = '';
      q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dir = 'rtl';
        btn.type = 'button';
        btn.textContent = choice;
        btn.addEventListener('click', () => answer(choice, btn));
        grid.appendChild(btn);
      });
    }
    showAudioStatus('Tekan butang main untuk dengar arahan.');
  }

  function updateProgressBar(percent){
    const pct = Math.max(0, Math.min(100, Number(percent || 0)));
    const fill = $('lessonProgressFill');
    if(fill) fill.style.width = `${pct}%`;
    setText('lessonProgressText', `${Math.round(pct)}% siap`);
  }

  function lockAnswers(){
    document.querySelectorAll('.answer-btn').forEach(btn => { btn.disabled = true; });
  }

  function getAudioSetting(key, fallbackText){
    const setting = audioSettings[key] || {};
    return { url: setting.audio_url || '', text: setting.audio_text || fallbackText || '' };
  }

  function playAudioKey(key, fallbackText){
    const setting = getAudioSetting(key, fallbackText);
    if(setting.url){ playAudioUrl(setting.url, setting.text); return; }
    speak(setting.text || fallbackText);
  }

  function playAudioUrl(url, fallbackText){
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      if(window.speechSynthesis) window.speechSynthesis.cancel();
      activeAudio = new Audio(url);
      activeAudio.onplay = () => { setAudioPlaying(true); showAudioStatus('Audio sedang dimainkan...'); };
      activeAudio.onended = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main untuk ulang audio.'); };
      activeAudio.onerror = () => { setAudioPlaying(false); speak(fallbackText); };
      activeAudio.play().catch(() => speak(fallbackText));
    }catch(e){ speak(fallbackText); }
  }

  function getVoice(){
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return voices.find(v => /ms|malay|indonesia/i.test(v.lang + ' ' + v.name)) ||
           voices.find(v => /en/i.test(v.lang)) || voices[0] || null;
  }

  function speak(text){
    if(!('speechSynthesis' in window)){ showAudioStatus('Audio tidak disokong oleh browser ini.'); return; }
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text || 'Pilih jawapan yang betul.');
      utter.lang = 'ms-MY';
      utter.rate = 0.82;
      utter.pitch = 1.05;
      const voice = getVoice();
      if(voice) utter.voice = voice;
      utter.onstart = () => { setAudioPlaying(true); showAudioStatus('Audio sedang dimainkan...'); };
      utter.onend = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main untuk ulang audio.'); };
      utter.onerror = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main sekali lagi untuk main audio.'); };
      window.speechSynthesis.speak(utter);
    }catch(e){ setAudioPlaying(false); showAudioStatus('Tekan butang main sekali lagi untuk main audio.'); }
  }

  function setAudioPlaying(isPlaying){
    const card = $('lessonAudioCard');
    const btn = $('playAudioBtn');
    if(card) card.classList.toggle('is-playing', !!isPlaying);
    if(btn){
      btn.classList.toggle('is-playing', !!isPlaying);
      const label = btn.querySelector('strong');
      if(label) label.textContent = isPlaying ? 'Sedang Main...' : 'Mainkan Audio';
    }
  }

  function showAudioStatus(msg){ setText('audioStatus', msg); }

  async function answer(choice, btn){
    if(answeredCurrent) return;
    const q = currentQuestion();
    const correct = choice === q.correct;
    btn.classList.add(correct ? 'is-correct' : 'is-wrong');

    if(correct){
      answeredCurrent = true;
      lockAnswers();
      score += 1;
      xpEarnedThisRun += LESSON.xpReward;
      completedQuestionIds.add(q.id);
      setText('mainJawi', q.correct);
      setText('coachTitle','Tahniah! Jawapan betul.');
      setText('coachNote', currentQuestionIndex < LESSON.questions.length - 1 ? 'Bagus! Soalan seterusnya akan muncul sekejap lagi.' : 'Hebat! Kamu sudah habiskan semua soalan.');
      playAudioKey('feedback_correct', `Tahniah. Jawapan betul. Ini huruf ${q.correct}.`);
      await savePartialProgress();
      setTimeout(nextQuestion, 1200);
    }else{
      btn.disabled = true;
      setText('coachTitle','Cuba lagi ya.');
      setText('coachNote', q.hint || 'Dengar semula audio dan cuba pilih jawapan yang betul.');
      playAudioKey('feedback_wrong', `Cuba lagi. ${q.hint || ''}`);
    }
  }

  async function nextQuestion(){
    if(currentQuestionIndex < LESSON.questions.length - 1){
      currentQuestionIndex += 1;
      renderQuestion();
      return;
    }
    await completeLesson();
  }

  async function savePartialProgress(){
    if(!window.jawiSupabase || !selectedChild || !currentUser) return;
    const answeredCount = Math.min(LESSON.questions.length, currentQuestionIndex + 1);
    const pct = Math.round((answeredCount / LESSON.questions.length) * 100);
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
        progress_percent: pct,
        is_completed: pct >= 100,
        xp_earned: xpEarnedThisRun,
        updated_at: new Date().toISOString()
      }, { onConflict: 'child_id,lesson_id' });

    selectedChild.total_xp = newXp;
    setText('xpText', `${newXp} XP`);
    updateProgressBar(pct);
  }

  async function completeLesson(){
    const finalBonus = LESSON.bonusXp;
    if(window.jawiSupabase && selectedChild && currentUser){
      const finalXp = (selectedChild.total_xp || 0) + finalBonus;
      await window.jawiSupabase
        .from('children')
        .update({ total_xp: finalXp, current_island: Math.max(selectedChild.current_island || 1, LESSON.island) })
        .eq('id', selectedChild.id)
        .eq('parent_id', currentUser.id);

      await window.jawiSupabase
        .from('child_progress')
        .upsert({
          child_id: selectedChild.id,
          lesson_id: LESSON.id,
          progress_percent: 100,
          is_completed: true,
          xp_earned: xpEarnedThisRun + finalBonus,
          updated_at: new Date().toISOString()
        }, { onConflict: 'child_id,lesson_id' });

      selectedChild.total_xp = finalXp;
      setText('xpText', `${finalXp} XP`);
    }
    updateProgressBar(100);
    renderSummary(finalBonus);
    playAudioKey('lesson_complete', 'Tahniah. Lesson selesai. Kamu hebat belajar Jawi hari ini.');
  }

  function renderSummary(finalBonus){
    setText('lessonPill', `Lesson 1 · Selesai`);
    setText('lessonTitle', 'Tahniah! Lesson Selesai');
    setText('lessonInstruction', 'Kamu sudah menjawab semua soalan dalam lesson ini.');
    setText('audioPromptTitle', 'Zafri bangga dengan usaha kamu!');
    setText('audioStatus', 'Tekan main untuk dengar ucapan tahniah.');
    setText('mainJawi', 'ج');
    setText('coachTitle', `Skor ${score}/${LESSON.questions.length}`);
    setText('coachNote', `XP lesson: +${xpEarnedThisRun} · Bonus selesai: +${finalBonus}. Tekan Kembali ke Peta untuk teruskan pengembaraan.`);

    const grid = $('answerGrid');
    if(grid){
      grid.innerHTML = `
        <div class="lesson-summary-actions">
          <a class="primary-btn" href="game-map.html">Kembali ke Peta</a>
          <button class="secondary-btn" type="button" id="retryLessonBtn">Ulang Lesson</button>
        </div>
      `;
      const retry = $('retryLessonBtn');
      if(retry){ retry.addEventListener('click', () => { currentQuestionIndex = 0; score = 0; xpEarnedThisRun = 0; renderQuestion(); }); }
    }
  }

  async function boot(){
    await initAuth();
    await Promise.all([loadSelectedChild(), loadAudioSettings()]);
    await loadProgress();
    renderQuestion();
    const audioBtn = $('playAudioBtn');
    if(audioBtn) audioBtn.addEventListener('click', () => {
      const q = currentQuestion();
      if(currentQuestionIndex >= LESSON.questions.length) playAudioKey('lesson_complete', 'Tahniah. Lesson selesai.');
      else playAudioKey(q.audioKey, q.audioText);
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
