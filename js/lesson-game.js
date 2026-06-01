// JawiKids v1.39 - Pulau 1 learning path: Intro -> Practice -> Lesson 1 -> Lesson 2 -> Boss Challenge
(function(){
  'use strict';

  const COMMON_CHOICES = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','و','ه','ء','ي'];
  const LESSONS = {
    practice: {
      id: 'pulau-1-practice-01', island: 1, moduleTitle: 'Pulau Huruf', label: 'Latihan Ringkas', title: 'Latihan Kenal Huruf',
      instruction: 'Latihan ringkas tanpa XP. Dengar audio, kemudian pilih huruf yang betul.', xpReward: 0, bonusXp: 0, trackProgress: false,
      questions: [
        {id:'p1-alif', audioKey:'practice_alif_01', title:'Latihan 1: Pilih Alif', promptTitle:'Dengar Alif, kemudian pilih jawapan.', audioText:'Pilih huruf Alif.', correct:'ا', choices:['ا','ب','ت','ث'], hint:'Alif bentuknya tegak.'},
        {id:'p2-ba', audioKey:'practice_ba_01', title:'Latihan 2: Pilih Ba', promptTitle:'Dengar Ba, kemudian pilih jawapan.', audioText:'Pilih huruf Ba.', correct:'ب', choices:['ت','ب','ا','ث'], hint:'Ba ada satu titik di bawah.'},
        {id:'p3-ta', audioKey:'practice_ta_01', title:'Latihan 3: Pilih Ta', promptTitle:'Dengar Ta, kemudian pilih jawapan.', audioText:'Pilih huruf Ta.', correct:'ت', choices:['ث','ا','ت','ب'], hint:'Ta ada dua titik di atas.'},
        {id:'p4-jim', audioKey:'practice_jim_01', title:'Latihan 4: Pilih Jim', promptTitle:'Dengar Jim, kemudian pilih jawapan.', audioText:'Pilih huruf Jim.', correct:'ج', choices:['ح','ج','خ','د'], hint:'Jim ada satu titik di bawah.'},
        {id:'p5-ra', audioKey:'practice_ra_01', title:'Latihan 5: Pilih Ra', promptTitle:'Dengar Ra, kemudian pilih jawapan.', audioText:'Pilih huruf Ra.', correct:'ر', choices:['ز','د','ر','ذ'], hint:'Ra tiada titik.'}
      ]
    },
    lesson1: {
      id: 'pulau-1-lesson-1', island: 1, moduleTitle: 'Pulau Huruf', label: 'Lesson 1', title: 'Kuiz Huruf Asas 1',
      instruction: 'Dengar arahan audio, kemudian pilih huruf Jawi yang betul.', xpReward: 10, bonusXp: 20, trackProgress: true,
      questions: [
        {id:'l1-q1-alif', audioKey:'lesson1_alif_01', title:'Soalan 1: Pilih Alif', promptTitle:'Dengar huruf Alif, kemudian pilih jawapan.', audioText:'Pilih huruf Alif.', correct:'ا', choices:['ا','ب','ت','ث'], hint:'Alif bentuknya tegak.'},
        {id:'l1-q2-ba', audioKey:'lesson1_ba_01', title:'Soalan 2: Pilih Ba', promptTitle:'Dengar huruf Ba, kemudian pilih jawapan.', audioText:'Pilih huruf Ba.', correct:'ب', choices:['ا','ب','ت','ث'], hint:'Ba ada satu titik di bawah.'},
        {id:'l1-q3-ta', audioKey:'lesson1_ta_01', title:'Soalan 3: Pilih Ta', promptTitle:'Dengar huruf Ta, kemudian pilih jawapan.', audioText:'Pilih huruf Ta.', correct:'ت', choices:['ث','ب','ت','ا'], hint:'Ta ada dua titik di atas.'},
        {id:'l1-q4-tha', audioKey:'lesson1_tha_01', title:'Soalan 4: Pilih Tha', promptTitle:'Dengar huruf Tha, kemudian pilih jawapan.', audioText:'Pilih huruf Tha.', correct:'ث', choices:['ا','ت','ب','ث'], hint:'Tha ada tiga titik di atas.'},
        {id:'l1-q5-jim', audioKey:'lesson1_jim_01', title:'Soalan 5: Pilih Jim', promptTitle:'Dengar huruf Jim, kemudian pilih jawapan.', audioText:'Pilih huruf Jim.', correct:'ج', choices:['ح','ج','خ','د'], hint:'Jim ada titik di bawah.'},
        {id:'l1-q6-ha', audioKey:'lesson1_ha_01', title:'Soalan 6: Pilih Ha', promptTitle:'Dengar huruf Ha, kemudian pilih jawapan.', audioText:'Pilih huruf Ha.', correct:'ح', choices:['ج','خ','ح','د'], hint:'Ha tiada titik.'},
        {id:'l1-q7-kha', audioKey:'lesson1_kha_01', title:'Soalan 7: Pilih Kha', promptTitle:'Dengar huruf Kha, kemudian pilih jawapan.', audioText:'Pilih huruf Kha.', correct:'خ', choices:['ح','د','ج','خ'], hint:'Kha ada titik di atas.'},
        {id:'l1-q8-dal', audioKey:'lesson1_dal_01', title:'Soalan 8: Pilih Dal', promptTitle:'Dengar huruf Dal, kemudian pilih jawapan.', audioText:'Pilih huruf Dal.', correct:'د', choices:['ذ','ر','د','ز'], hint:'Dal tiada titik.'},
        {id:'l1-q9-dzal', audioKey:'lesson1_dzal_01', title:'Soalan 9: Pilih Dzal', promptTitle:'Dengar huruf Dzal, kemudian pilih jawapan.', audioText:'Pilih huruf Dzal.', correct:'ذ', choices:['د','ر','ز','ذ'], hint:'Dzal ada titik di atas.'},
        {id:'l1-q10-ra', audioKey:'lesson1_ra_01', title:'Soalan 10: Pilih Ra', promptTitle:'Dengar huruf Ra, kemudian pilih jawapan.', audioText:'Pilih huruf Ra.', correct:'ر', choices:['ز','ر','د','ذ'], hint:'Ra tiada titik.'}
      ]
    },
    lesson2: {
      id: 'pulau-1-lesson-2', island: 1, moduleTitle: 'Pulau Huruf', label: 'Lesson 2', title: 'Kuiz Huruf Asas 2',
      instruction: 'Dengar audio dan bezakan huruf yang hampir sama.', xpReward: 10, bonusXp: 20, trackProgress: true,
      questions: [
        {id:'l2-q1-zai', audioKey:'lesson2_zai_01', title:'Soalan 1: Pilih Zai', promptTitle:'Dengar huruf Zai, kemudian pilih jawapan.', audioText:'Pilih huruf Zai.', correct:'ز', choices:['ر','ز','ذ','د'], hint:'Zai ada titik di atas.'},
        {id:'l2-q2-sin', audioKey:'lesson2_sin_01', title:'Soalan 2: Pilih Sin', promptTitle:'Dengar huruf Sin, kemudian pilih jawapan.', audioText:'Pilih huruf Sin.', correct:'س', choices:['س','ش','ص','ض'], hint:'Sin tiada titik.'},
        {id:'l2-q3-syin', audioKey:'lesson2_syin_01', title:'Soalan 3: Pilih Syin', promptTitle:'Dengar huruf Syin, kemudian pilih jawapan.', audioText:'Pilih huruf Syin.', correct:'ش', choices:['س','ص','ش','ض'], hint:'Syin ada tiga titik.'},
        {id:'l2-q4-sod', audioKey:'lesson2_sod_01', title:'Soalan 4: Pilih Sod', promptTitle:'Dengar huruf Sod, kemudian pilih jawapan.', audioText:'Pilih huruf Sod.', correct:'ص', choices:['ض','ص','س','ش'], hint:'Sod tiada titik.'},
        {id:'l2-q5-dod', audioKey:'lesson2_dod_01', title:'Soalan 5: Pilih Dod', promptTitle:'Dengar huruf Dod, kemudian pilih jawapan.', audioText:'Pilih huruf Dod.', correct:'ض', choices:['ص','س','ض','ش'], hint:'Dod ada titik di atas.'},
        {id:'l2-q6-to', audioKey:'lesson2_to_01', title:'Soalan 6: Pilih To', promptTitle:'Dengar huruf To, kemudian pilih jawapan.', audioText:'Pilih huruf To.', correct:'ط', choices:['ظ','ط','ع','غ'], hint:'To tiada titik.'},
        {id:'l2-q7-zo', audioKey:'lesson2_zo_01', title:'Soalan 7: Pilih Zo', promptTitle:'Dengar huruf Zo, kemudian pilih jawapan.', audioText:'Pilih huruf Zo.', correct:'ظ', choices:['ط','ع','ظ','غ'], hint:'Zo ada titik di atas.'},
        {id:'l2-q8-ain', audioKey:'lesson2_ain_01', title:'Soalan 8: Pilih Ain', promptTitle:'Dengar huruf Ain, kemudian pilih jawapan.', audioText:'Pilih huruf Ain.', correct:'ع', choices:['غ','ع','ط','ظ'], hint:'Ain tiada titik.'},
        {id:'l2-q9-ghain', audioKey:'lesson2_ghain_01', title:'Soalan 9: Pilih Ghain', promptTitle:'Dengar huruf Ghain, kemudian pilih jawapan.', audioText:'Pilih huruf Ghain.', correct:'غ', choices:['ع','غ','ظ','ط'], hint:'Ghain ada titik di atas.'},
        {id:'l2-q10-fa', audioKey:'lesson2_fa_01', title:'Soalan 10: Pilih Fa', promptTitle:'Dengar huruf Fa, kemudian pilih jawapan.', audioText:'Pilih huruf Fa.', correct:'ف', choices:['ق','ف','ك','ل'], hint:'Fa ada satu titik di atas.'}
      ]
    },
    boss: {
      id: 'pulau-1-boss-challenge', island: 1, moduleTitle: 'Pulau Huruf', label: 'Boss Challenge', title: 'Cabaran Zafri Pulau Huruf',
      instruction: 'Cabaran campuran Alif sampai Ya. Jawab 20 soalan untuk lengkapkan Pulau 1.', xpReward: 15, bonusXp: 50, trackProgress: true,
      questions: [
        ['ا','Alif'],['ب','Ba'],['ت','Ta'],['ث','Tha'],['ج','Jim'],['ح','Ha'],['خ','Kha'],['د','Dal'],['ذ','Dzal'],['ر','Ra'],['ز','Zai'],['س','Sin'],['ش','Syin'],['ص','Sod'],['ض','Dod'],['ط','To'],['ظ','Zo'],['ع','Ain'],['غ','Ghain'],['ي','Ya']
      ].map((x,i)=>({id:`boss-q${i+1}`, audioKey:`boss_${i+1}_${x[1].toLowerCase()}`, title:`Cabaran ${i+1}: Pilih ${x[1]}`, promptTitle:`Dengar huruf ${x[1]}, kemudian pilih jawapan.`, audioText:`Pilih huruf ${x[1]}.`, correct:x[0], choices: makeChoices(x[0], i), hint:'Dengar semula audio dan pilih huruf yang betul.'}))
    }
  };

  function makeChoices(correct, seed){
    const pool = COMMON_CHOICES.filter(x => x !== correct);
    const picks = [correct];
    for(let i=0; picks.length<4; i++) picks.push(pool[(seed*3+i)%pool.length]);
    return picks.sort((a,b)=> ((a.charCodeAt(0)+seed)%7) - ((b.charCodeAt(0)+seed)%7));
  }

  function pageLessonKey(){
    const path = location.pathname.toLowerCase();
    const qs = new URLSearchParams(location.search);
    if(path.includes('lesson-practice')) return 'practice';
    if(path.includes('lesson-2')) return 'lesson2';
    if(path.includes('boss-challenge')) return 'boss';
    return qs.get('lesson') || 'lesson1';
  }

  const LESSON = LESSONS[pageLessonKey()] || LESSONS.lesson1;
  let currentUser = null, selectedChild = null, audioSettings = {}, activeAudio = null;
  let currentQuestionIndex = 0, score = 0, xpEarnedThisRun = 0, answeredCurrent = false;

  function $(id){ return document.getElementById(id); }
  function setText(id, value){ const el = $(id); if(el) el.textContent = value; }
  function currentQuestion(){ return LESSON.questions[currentQuestionIndex] || LESSON.questions[0]; }
  function progressPercent(){ return Math.round((currentQuestionIndex / LESSON.questions.length) * 100); }
  function selectedChildId(){ return localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id') || sessionStorage.getItem('jawikids_selected_child_id') || sessionStorage.getItem('selected_child_id') || ''; }

  async function initAuth(){
    if(!window.jawiSupabase && window.getJawiSupabase) window.jawiSupabase = window.getJawiSupabase();
    if(!window.jawiSupabase) return null;
    const { data } = await window.jawiSupabase.auth.getUser();
    currentUser = data?.user || null;
    if(!currentUser){ window.location.href = 'login.html'; return null; }
    return currentUser;
  }

  async function loadSelectedChild(){
    const childId = selectedChildId();
    if(!childId || !window.jawiSupabase || !currentUser) return null;
    const { data, error } = await window.jawiSupabase.from('children').select('id,name,avatar,total_xp,current_island,hearts,parent_id').eq('id', childId).eq('parent_id', currentUser.id).maybeSingle();
    if(error){ console.warn('[JawiKids] child load error', error.message); return null; }
    selectedChild = data || null;
    return selectedChild;
  }

  async function loadAudioSettings(){
    audioSettings = {};
    if(!window.jawiSupabase) return;
    const keys = Array.from(new Set([...LESSON.questions.map(q => q.audioKey), 'feedback_correct', 'feedback_wrong', 'lesson_complete']));
    const { data, error } = await window.jawiSupabase.from('audio_settings').select('audio_key,audio_text,audio_url,is_active').in('audio_key', keys).eq('is_active', true);
    if(error){ console.warn('[JawiKids] audio_settings fallback TTS:', error.message); return; }
    (data || []).forEach(row => { audioSettings[row.audio_key] = row; });
  }

  async function loadProgress(){
    if(!LESSON.trackProgress || !window.jawiSupabase || !selectedChild) return;
    const { data, error } = await window.jawiSupabase.from('child_progress').select('progress_percent,is_completed,xp_earned').eq('child_id', selectedChild.id).eq('lesson_id', LESSON.id).maybeSingle();
    if(error || !data) return;
    const pct = Number(data.progress_percent || 0);
    if(data.is_completed || pct >= 100) currentQuestionIndex = 0;
    else currentQuestionIndex = Math.max(0, Math.min(LESSON.questions.length - 1, Math.floor((pct / 100) * LESSON.questions.length)));
  }

  function renderQuestion(){
    const q = currentQuestion();
    answeredCurrent = false;
    setText('lessonPill', `${LESSON.label} · ${LESSON.moduleTitle} · ${currentQuestionIndex + 1}/${LESSON.questions.length}`);
    setText('lessonTitle', q.title || LESSON.title);
    setText('lessonInstruction', LESSON.instruction);
    setText('audioPromptTitle', q.promptTitle || 'Dengar dahulu, kemudian jawab.');
    setText('mainJawi', '🎧');
    setText('childNameText', selectedChild ? selectedChild.name : 'Anak');
    setText('xpText', selectedChild ? `${selectedChild.total_xp || 0} XP` : '0 XP');
    setText('heartText', selectedChild ? '❤️'.repeat(Math.max(0, Math.min(5, selectedChild.hearts || 5))) : '❤️❤️❤️❤️❤️');
    setText('coachTitle', LESSON.trackProgress ? 'Hebat! Cuba pilih jawapan.' : 'Latihan sahaja. Cuba pilih jawapan.');
    setText('coachNote', LESSON.trackProgress ? 'Dengar audio dahulu, kemudian pilih huruf Jawi yang betul.' : 'Latihan ini tidak memberi XP. Tujuannya untuk membiasakan anak dengan huruf.');
    updateProgressBar(progressPercent());
    const grid = $('answerGrid');
    if(grid){
      grid.innerHTML = '';
      q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn'; btn.dir = 'rtl'; btn.type = 'button'; btn.textContent = choice;
        btn.addEventListener('click', () => answer(choice, btn));
        grid.appendChild(btn);
      });
    }
    showAudioStatus('Tekan butang main untuk dengar arahan.');
  }

  function updateProgressBar(percent){ const pct = Math.max(0, Math.min(100, Number(percent || 0))); const fill = $('lessonProgressFill'); if(fill) fill.style.width = `${pct}%`; setText('lessonProgressText', `${Math.round(pct)}% siap`); }
  function lockAnswers(){ document.querySelectorAll('.answer-btn').forEach(btn => { btn.disabled = true; }); }
  function getAudioSetting(key, fallbackText){ const setting = audioSettings[key] || {}; return { url: setting.audio_url || '', text: setting.audio_text || fallbackText || '' }; }
  function playAudioKey(key, fallbackText){ const setting = getAudioSetting(key, fallbackText); if(setting.url){ playAudioUrl(setting.url, setting.text); return; } speak(setting.text || fallbackText); }
  function playAudioUrl(url, fallbackText){ try{ if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; } if(window.speechSynthesis) window.speechSynthesis.cancel(); activeAudio = new Audio(url); activeAudio.onplay = () => { setAudioPlaying(true); showAudioStatus('Audio sedang dimainkan...'); }; activeAudio.onended = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main untuk ulang audio.'); }; activeAudio.onerror = () => { setAudioPlaying(false); speak(fallbackText); }; activeAudio.play().catch(() => speak(fallbackText)); }catch(e){ speak(fallbackText); } }
  function getVoice(){ const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; return voices.find(v => /ms|malay|indonesia/i.test(v.lang + ' ' + v.name)) || voices.find(v => /en/i.test(v.lang)) || voices[0] || null; }
  function speak(text){ if(!('speechSynthesis' in window)){ showAudioStatus('Audio tidak disokong oleh browser ini.'); return; } try{ if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; } window.speechSynthesis.cancel(); const utter = new SpeechSynthesisUtterance(text || 'Pilih jawapan yang betul.'); utter.lang = 'ms-MY'; utter.rate = 0.82; utter.pitch = 1.05; const voice = getVoice(); if(voice) utter.voice = voice; utter.onstart = () => { setAudioPlaying(true); showAudioStatus('Audio sedang dimainkan...'); }; utter.onend = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main untuk ulang audio.'); }; utter.onerror = () => { setAudioPlaying(false); showAudioStatus('Tekan butang main sekali lagi untuk main audio.'); }; window.speechSynthesis.speak(utter); }catch(e){ setAudioPlaying(false); showAudioStatus('Tekan butang main sekali lagi untuk main audio.'); } }
  function setAudioPlaying(isPlaying){ const card = $('lessonAudioCard'); const btn = $('playAudioBtn'); if(card) card.classList.toggle('is-playing', !!isPlaying); if(btn){ btn.classList.toggle('is-playing', !!isPlaying); const label = btn.querySelector('strong'); if(label) label.textContent = isPlaying ? 'Sedang Main...' : 'Mainkan Audio'; } }
  function showAudioStatus(msg){ setText('audioStatus', msg); }

  async function answer(choice, btn){
    if(answeredCurrent) return;
    const q = currentQuestion(); const correct = choice === q.correct;
    btn.classList.add(correct ? 'is-correct' : 'is-wrong');
    if(correct){
      answeredCurrent = true; lockAnswers(); score += 1;
      if(LESSON.trackProgress) xpEarnedThisRun += LESSON.xpReward;
      setText('mainJawi', q.correct); setText('coachTitle','Tahniah! Jawapan betul.');
      setText('coachNote', currentQuestionIndex < LESSON.questions.length - 1 ? 'Bagus! Soalan seterusnya akan muncul sekejap lagi.' : 'Hebat! Kamu sudah habiskan semua soalan.');
      playAudioKey('feedback_correct', `Tahniah. Jawapan betul. Ini huruf ${q.correct}.`);
      await savePartialProgress(); setTimeout(nextQuestion, 1000);
    }else{
      btn.disabled = true; setText('coachTitle','Cuba lagi ya.'); setText('coachNote', q.hint || 'Dengar semula audio dan cuba pilih jawapan yang betul.'); playAudioKey('feedback_wrong', `Cuba lagi. ${q.hint || ''}`);
    }
  }

  async function nextQuestion(){ if(currentQuestionIndex < LESSON.questions.length - 1){ currentQuestionIndex += 1; renderQuestion(); return; } await completeLesson(); }

  async function savePartialProgress(){
    if(!LESSON.trackProgress || !window.jawiSupabase || !selectedChild || !currentUser) { updateProgressBar(Math.round(((currentQuestionIndex+1)/LESSON.questions.length)*100)); return; }
    const answeredCount = Math.min(LESSON.questions.length, currentQuestionIndex + 1);
    const pct = Math.round((answeredCount / LESSON.questions.length) * 100);
    const newXp = (selectedChild.total_xp || 0) + LESSON.xpReward;
    await window.jawiSupabase.from('children').update({ total_xp: newXp, current_island: Math.max(selectedChild.current_island || 1, LESSON.island) }).eq('id', selectedChild.id).eq('parent_id', currentUser.id);
    await window.jawiSupabase.from('child_progress').upsert({ child_id: selectedChild.id, lesson_id: LESSON.id, progress_percent: pct, is_completed: pct >= 100, xp_earned: xpEarnedThisRun, updated_at: new Date().toISOString() }, { onConflict: 'child_id,lesson_id' });
    selectedChild.total_xp = newXp; setText('xpText', `${newXp} XP`); updateProgressBar(pct);
  }

  async function completeLesson(){
    const finalBonus = LESSON.trackProgress ? LESSON.bonusXp : 0;
    if(LESSON.trackProgress && window.jawiSupabase && selectedChild && currentUser){
      const finalXp = (selectedChild.total_xp || 0) + finalBonus;
      await window.jawiSupabase.from('children').update({ total_xp: finalXp, current_island: Math.max(selectedChild.current_island || 1, LESSON.island) }).eq('id', selectedChild.id).eq('parent_id', currentUser.id);
      await window.jawiSupabase.from('child_progress').upsert({ child_id: selectedChild.id, lesson_id: LESSON.id, progress_percent: 100, is_completed: true, xp_earned: xpEarnedThisRun + finalBonus, updated_at: new Date().toISOString() }, { onConflict: 'child_id,lesson_id' });
      selectedChild.total_xp = finalXp; setText('xpText', `${finalXp} XP`);
    }
    updateProgressBar(100); renderSummary(finalBonus); playAudioKey('lesson_complete', LESSON.trackProgress ? 'Tahniah. Lesson selesai. Kamu hebat belajar Jawi hari ini.' : 'Latihan selesai. Jom teruskan ke lesson.');
  }

  function nextPath(){
    if(LESSON.id === 'pulau-1-practice-01') return 'lesson-game.html';
    if(LESSON.id === 'pulau-1-lesson-1') return 'lesson-2.html';
    if(LESSON.id === 'pulau-1-lesson-2') return 'boss-challenge.html';
    return 'game-map.html';
  }
  function nextLabel(){
    if(LESSON.id === 'pulau-1-practice-01') return 'Mula Lesson 1';
    if(LESSON.id === 'pulau-1-lesson-1') return 'Mula Lesson 2';
    if(LESSON.id === 'pulau-1-lesson-2') return 'Mula Boss Challenge';
    return 'Kembali ke Peta';
  }

  function renderSummary(finalBonus){
    setText('lessonPill', `${LESSON.label} · Selesai`);
    setText('lessonTitle', LESSON.trackProgress ? 'Tahniah! Lesson Selesai' : 'Latihan Selesai');
    setText('lessonInstruction', LESSON.trackProgress ? 'Kamu sudah menjawab semua soalan dalam lesson ini.' : 'Kamu sudah selesai latihan ringkas. Tiada XP diberikan untuk latihan ini.');
    setText('audioPromptTitle', 'Zafri bangga dengan usaha kamu!');
    setText('audioStatus', 'Tekan main untuk dengar ucapan tahniah.');
    setText('mainJawi', 'ج');
    setText('coachTitle', `Skor ${score}/${LESSON.questions.length}`);
    setText('coachNote', LESSON.trackProgress ? `XP lesson: +${xpEarnedThisRun} · Bonus selesai: +${finalBonus}.` : 'Latihan ini hanya untuk membiasakan anak sebelum kuiz.');
    const grid = $('answerGrid');
    if(grid){
      grid.innerHTML = `<div class="lesson-summary-actions"><a class="primary-btn" href="${nextPath()}">${nextLabel()}</a><a class="secondary-btn" href="game-map.html">Kembali ke Peta</a><button class="secondary-btn" type="button" id="retryLessonBtn">Ulang</button></div>`;
      const retry = $('retryLessonBtn'); if(retry){ retry.addEventListener('click', () => { currentQuestionIndex = 0; score = 0; xpEarnedThisRun = 0; renderQuestion(); }); }
    }
  }

  async function boot(){
    await initAuth(); await Promise.all([loadSelectedChild(), loadAudioSettings()]); await loadProgress(); renderQuestion();
    const audioBtn = $('playAudioBtn'); if(audioBtn) audioBtn.addEventListener('click', () => { const q = currentQuestion(); playAudioKey(q.audioKey || 'lesson_complete', q.audioText || 'Tahniah. Lesson selesai.'); });
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
