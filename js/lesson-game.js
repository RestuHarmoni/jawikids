// JawiKids v1.41 - Boss Challenge victory overlay + auto return to map unlock effect
(function(){
  'use strict';

  const COMMON_CHOICES = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','و','ه','ء','ي'];
  const BASE = [
    ['ا','Alif','Alif bentuknya tegak.'],['ب','Ba','Ba ada satu titik di bawah.'],['ت','Ta','Ta ada dua titik di atas.'],['ث','Tha','Tha ada tiga titik di atas.'],
    ['ج','Jim','Jim ada titik di bawah.'],['ح','Ha','Ha tiada titik.'],['خ','Kha','Kha ada titik di atas.'],['د','Dal','Dal tiada titik.'],['ذ','Dzal','Dzal ada titik di atas.'],['ر','Ra','Ra tiada titik.']
  ];
  const SECOND = [
    ['ز','Zai','Zai ada titik di atas.'],['س','Sin','Sin tiada titik.'],['ش','Syin','Syin ada tiga titik.'],['ص','Sod','Sod tiada titik.'],['ض','Dod','Dod ada titik di atas.'],
    ['ط','To','To tiada titik.'],['ظ','Zo','Zo ada titik di atas.'],['ع','Ain','Ain tiada titik.'],['غ','Ghain','Ghain ada titik di atas.'],['ف','Fa','Fa ada satu titik di atas.']
  ];
  const ALL_BOSS = [...BASE, ...SECOND, ['ق','Qaf','Qaf ada dua titik di atas.'],['ك','Kaf','Kaf seperti bentuk terbuka.'],['ل','Lam','Lam tinggi dan melengkung.'],['م','Mim','Mim ada bentuk bulat.'],['ن','Nun','Nun ada satu titik di atas.'],['و','Wau','Wau melengkung.'],['ه','Ha','Ha lembut bentuknya.'],['ء','Hamzah','Hamzah kecil.'],['ي','Ya','Ya ada dua titik di bawah.']];

  function makeChoices(correct, seed, pool = COMMON_CHOICES){
    const others = pool.filter(x => x !== correct);
    const picks = [correct];
    for(let i=0; picks.length<4; i++) picks.push(others[(seed*5+i)%others.length]);
    return picks.sort((a,b)=> ((a.charCodeAt(0)+seed)%11) - ((b.charCodeAt(0)+seed)%11));
  }
  function buildQuestions(list, prefix, mode){
    return list.map((x,i)=>({
      id:`${prefix}-q${i+1}`,
      audioKey:`${prefix}_${x[1].toLowerCase()}_${String(i+1).padStart(2,'0')}`,
      title: mode === 'boss' ? `Cabaran ${i+1}: Cari ${x[1]}` : `Soalan ${i+1}: Pilih ${x[1]}`,
      promptTitle: mode === 'match' ? `Padankan bunyi ${x[1]} dengan huruf.` : `Dengar huruf ${x[1]}, kemudian pilih jawapan.`,
      audioText:`Pilih huruf ${x[1]}.`, correct:x[0], choices: makeChoices(x[0], i), hint:x[2]
    }));
  }

  const LESSONS = {
    practice: { id:'pulau-1-practice-01', island:1, label:'Latihan Ringkas', moduleTitle:'Pulau Huruf', title:'Padankan Bunyi Huruf', instruction:'Latihan santai tanpa XP. Tekan audio, pilih huruf yang betul.', xpReward:0, bonusXp:0, trackProgress:false, mode:'match', questions: buildQuestions(BASE.slice(0,5),'practice','match') },
    lesson1: { id:'pulau-1-lesson-1', island:1, label:'Lesson 1', moduleTitle:'Pulau Huruf', title:'Pilih Huruf Yang Disebut', instruction:'Dengar audio dan pilih huruf. 10 soalan.', xpReward:10, bonusXp:20, trackProgress:true, mode:'audio-pick', questions: buildQuestions(BASE,'lesson1','audio-pick') },
    lesson2: { id:'pulau-1-lesson-2', island:1, label:'Lesson 2', moduleTitle:'Pulau Huruf', title:'Cari Huruf Hampir Sama', instruction:'Bezakan huruf yang hampir sama. 10 soalan.', xpReward:10, bonusXp:20, trackProgress:true, mode:'look-find', questions: buildQuestions(SECOND,'lesson2','look-find') },
    boss: { id:'pulau-1-boss-challenge', island:1, unlockIsland:2, label:'Boss Challenge', moduleTitle:'Pulau Huruf', title:'Cabaran Zafri', instruction:'Cabaran campuran Alif sampai Ya. 20 soalan.', xpReward:15, bonusXp:50, trackProgress:true, mode:'boss', questions: buildQuestions(ALL_BOSS.slice(0,20),'boss','boss') }
  };

  function pageLessonKey(){ const p = location.pathname.toLowerCase(); if(p.includes('lesson-practice')) return 'practice'; if(p.includes('lesson-2')) return 'lesson2'; if(p.includes('boss-challenge')) return 'boss'; return 'lesson1'; }
  const LESSON = LESSONS[pageLessonKey()] || LESSONS.lesson1;
  let currentUser=null, selectedChild=null, audioSettings={}, activeAudio=null;
  let currentQuestionIndex=0, score=0, xpEarnedThisRun=0, answeredCurrent=false, wrongThisQuestion=false;

  const $ = id => document.getElementById(id);
  const setText = (id,v) => { const el=$(id); if(el) el.textContent = v; };
  const qNow = () => LESSON.questions[currentQuestionIndex] || LESSON.questions[0];
  const childId = () => localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id') || sessionStorage.getItem('jawikids_selected_child_id') || sessionStorage.getItem('selected_child_id') || '';

  async function initAuth(){
    if(!window.jawiSupabase && window.getJawiSupabase) window.jawiSupabase = window.getJawiSupabase();
    if(!window.jawiSupabase) return null;
    const { data } = await window.jawiSupabase.auth.getUser();
    currentUser = data?.user || null;
    if(!currentUser) location.href = 'login.html';
    return currentUser;
  }
  async function loadSelectedChild(){
    const id = childId();
    if(!id || !window.jawiSupabase || !currentUser) return null;
    const { data, error } = await window.jawiSupabase.from('children').select('id,name,avatar,total_xp,current_island,hearts,parent_id').eq('id',id).eq('parent_id',currentUser.id).maybeSingle();
    if(error) console.warn('[JawiKids] child load error', error.message);
    selectedChild = data || null;
    return selectedChild;
  }
  async function loadAudioSettings(){
    audioSettings = {};
    if(!window.jawiSupabase) return;
    const keys = Array.from(new Set([...LESSON.questions.map(q=>q.audioKey),'feedback_correct','feedback_wrong','lesson_complete']));
    const { data, error } = await window.jawiSupabase.from('audio_settings').select('audio_key,audio_text,audio_url,is_active').in('audio_key',keys).eq('is_active',true);
    if(error){ console.warn('[JawiKids] audio fallback:', error.message); return; }
    (data||[]).forEach(r => audioSettings[r.audio_key] = r);
  }
  async function loadProgress(){
    if(!LESSON.trackProgress || !window.jawiSupabase || !selectedChild) return;
    const { data } = await window.jawiSupabase.from('child_progress').select('progress_percent,is_completed').eq('child_id',selectedChild.id).eq('lesson_id',LESSON.id).maybeSingle();
    if(data && !data.is_completed){ currentQuestionIndex = Math.max(0, Math.min(LESSON.questions.length - 1, Math.floor((Number(data.progress_percent||0)/100)*LESSON.questions.length))); }
  }

  function renderHud(){
    setText('hudChildName', selectedChild?.name || 'Anak');
    setText('hudXp', `${selectedChild?.total_xp || 0} XP`);
    const hearts = Math.max(0, Math.min(5, selectedChild?.hearts || 5));
    setText('hudHearts', '❤️'.repeat(hearts));
    const av = $('hudAvatar'); if(av) av.src = selectedChild?.avatar || 'assets/characters/zafri-happy.svg?v=1.41.0';
  }
  function updateProgress(pct){
    pct = Math.max(0, Math.min(100, Number(pct||0)));
    const fill=$('lessonProgressFill'); if(fill) fill.style.width = pct + '%';
    setText('lessonProgressText', `${Math.round(pct)}% siap`);
    setText('hudQuestion', `${Math.min(currentQuestionIndex+1, LESSON.questions.length)}/${LESSON.questions.length}`);
  }
  function modeLabel(){ return LESSON.mode === 'match' ? 'Latihan Padanan' : LESSON.mode === 'look-find' ? 'Cari Huruf' : LESSON.mode === 'boss' ? 'Cabaran Masa' : 'Kuiz Audio'; }

  function renderQuestion(){
    const q=qNow(); answeredCurrent=false; wrongThisQuestion=false;
    document.body.dataset.lessonMode = LESSON.mode;
    renderHud();
    setText('lessonPill', `${LESSON.label} · ${modeLabel()} · ${currentQuestionIndex+1}/${LESSON.questions.length}`);
    setText('lessonTitle', q.title || LESSON.title);
    setText('lessonInstruction', LESSON.instruction);
    setText('audioPromptTitle', q.promptTitle || 'Dengar dahulu, kemudian jawab.');
    setText('mainJawi', LESSON.mode === 'look-find' ? q.correct : '🎧');
    setText('coachTitle', LESSON.mode === 'boss' ? 'Fokus! Cabaran Zafri bermula.' : 'Dengar audio dan pilih jawapan.');
    setText('coachNote', LESSON.mode === 'look-find' ? 'Lihat huruf sasaran, kemudian cari jawapan yang sama.' : 'Tekan Mainkan Audio dahulu jika belum dengar.');
    updateProgress(Math.round((currentQuestionIndex/LESSON.questions.length)*100));
    const grid=$('answerGrid'); if(!grid) return;
    grid.innerHTML='';
    q.choices.forEach(choice=>{
      const btn=document.createElement('button'); btn.className='answer-btn compact-answer'; btn.dir='rtl'; btn.type='button'; btn.textContent=choice;
      btn.addEventListener('click',()=>answer(choice,btn)); grid.appendChild(btn);
    });
    showAudioStatus('Tekan butang main untuk dengar arahan.');
  }
  function lockAnswers(){ document.querySelectorAll('.answer-btn').forEach(b=>b.disabled=true); }

  function getAudio(key,fallback){ const s=audioSettings[key]||{}; return {url:s.audio_url||'', text:s.audio_text||fallback||''}; }
  function playAudioKey(key,fallback){ const s=getAudio(key,fallback); if(s.url) playUrl(s.url,s.text); else speak(s.text||fallback); }
  function playUrl(url,fallback){
    try{ if(activeAudio){activeAudio.pause(); activeAudio.currentTime=0;} if(window.speechSynthesis) speechSynthesis.cancel(); activeAudio=new Audio(url);
      activeAudio.onplay=()=>setPlaying(true); activeAudio.onended=()=>setPlaying(false); activeAudio.onerror=()=>{setPlaying(false); speak(fallback);}; activeAudio.play().catch(()=>speak(fallback));
    }catch(e){ speak(fallback); }
  }
  function voice(){ const v=window.speechSynthesis?.getVoices()||[]; return v.find(x=>/ms|malay|indonesia/i.test(x.lang+' '+x.name))||v.find(x=>/en/i.test(x.lang))||v[0]||null; }
  function speak(text){
    if(!('speechSynthesis' in window)){ showAudioStatus('Audio tidak disokong browser ini.'); return; }
    try{ if(activeAudio){activeAudio.pause(); activeAudio.currentTime=0;} speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text||'Pilih jawapan yang betul.'); u.lang='ms-MY'; u.rate=.82; u.pitch=1.05; const v=voice(); if(v) u.voice=v; u.onstart=()=>setPlaying(true); u.onend=()=>setPlaying(false); u.onerror=()=>setPlaying(false); speechSynthesis.speak(u); }catch(e){ setPlaying(false); }
  }
  function setPlaying(on){ const card=$('lessonAudioCard'), btn=$('playAudioBtn'); if(card) card.classList.toggle('is-playing',!!on); if(btn){ btn.classList.toggle('is-playing',!!on); const label=btn.querySelector('strong'); if(label) label.textContent=on?'Sedang Main...':'Mainkan Audio'; } showAudioStatus(on?'Audio sedang dimainkan...':'Tekan butang main untuk ulang audio.'); }
  function showAudioStatus(msg){ setText('audioStatus',msg); }

  async function answer(choice,btn){
    if(answeredCurrent) return;
    const q=qNow(), correct=choice===q.correct;
    btn.classList.add(correct?'is-correct':'is-wrong');
    if(!correct){ wrongThisQuestion=true; btn.disabled=true; setText('coachTitle','Cuba lagi ya.'); setText('coachNote',q.hint||'Dengar semula audio dan cuba lagi.'); playAudioKey('feedback_wrong',`Cuba lagi. ${q.hint||''}`); return; }
    answeredCurrent=true; lockAnswers(); score++; if(LESSON.trackProgress) xpEarnedThisRun += LESSON.xpReward;
    setText('mainJawi', q.correct); setText('coachTitle','Tahniah! Jawapan betul.'); setText('coachNote', currentQuestionIndex<LESSON.questions.length-1?'Bagus! Soalan seterusnya muncul sekejap lagi.':'Hebat! Aktiviti selesai.');
    playAudioKey('feedback_correct',`Tahniah. Jawapan betul. Ini huruf ${q.correct}.`);
    await savePartialProgress(); setTimeout(nextQuestion, 900);
  }
  async function nextQuestion(){ if(currentQuestionIndex < LESSON.questions.length-1){ currentQuestionIndex++; renderQuestion(); return; } await completeLesson(); }
  async function savePartialProgress(){
    if(!LESSON.trackProgress || !window.jawiSupabase || !selectedChild || !currentUser) return;
    const answeredCount=Math.min(LESSON.questions.length,currentQuestionIndex+1), pct=Math.round((answeredCount/LESSON.questions.length)*100), newXp=(selectedChild.total_xp||0)+LESSON.xpReward;
    await window.jawiSupabase.from('children').update({total_xp:newXp,current_island:Math.max(selectedChild.current_island||1,LESSON.island)}).eq('id',selectedChild.id).eq('parent_id',currentUser.id);
    await window.jawiSupabase.from('child_progress').upsert({child_id:selectedChild.id,lesson_id:LESSON.id,progress_percent:pct,is_completed:pct>=100,xp_earned:xpEarnedThisRun,updated_at:new Date().toISOString()},{onConflict:'child_id,lesson_id'});
    selectedChild.total_xp=newXp; renderHud(); updateProgress(pct);
  }
  function isBossChallenge(){ return LESSON.id === 'pulau-1-boss-challenge'; }

  async function completeLesson(){
    const bonus=LESSON.trackProgress?LESSON.bonusXp:0;
    const shouldUnlockNextIsland = isBossChallenge();
    if(LESSON.trackProgress && window.jawiSupabase && selectedChild && currentUser){
      const finalXp=(selectedChild.total_xp||0)+bonus;
      const nextIsland = shouldUnlockNextIsland ? (LESSON.unlockIsland || 2) : Math.max(selectedChild.current_island || 1, LESSON.island || 1);
      await window.jawiSupabase
        .from('children')
        .update({total_xp:finalXp,current_island:nextIsland})
        .eq('id',selectedChild.id)
        .eq('parent_id',currentUser.id);

      await window.jawiSupabase.from('child_progress').upsert({
        child_id:selectedChild.id,
        lesson_id:LESSON.id,
        progress_percent:100,
        is_completed:true,
        xp_earned:xpEarnedThisRun+bonus,
        updated_at:new Date().toISOString()
      },{onConflict:'child_id,lesson_id'});

      selectedChild.total_xp=finalXp;
      selectedChild.current_island=nextIsland;
      renderHud();
    }
    updateProgress(100);
    renderSummary(bonus);
    playAudioKey('lesson_complete', shouldUnlockNextIsland ? 'Tahniah. Cabaran selesai. Pulau baru telah dibuka.' : (LESSON.trackProgress?'Tahniah. Lesson selesai.':'Latihan selesai. Jom teruskan.'));
    if(shouldUnlockNextIsland) showBossVictoryOverlay(bonus);
  }
  function nextPath(){ if(LESSON.id==='pulau-1-practice-01') return 'lesson-game.html'; if(LESSON.id==='pulau-1-lesson-1') return 'lesson-2.html'; if(LESSON.id==='pulau-1-lesson-2') return 'boss-challenge.html'; return 'game-map.html'; }
  function nextLabel(){ if(LESSON.id==='pulau-1-practice-01') return 'Mula Lesson 1'; if(LESSON.id==='pulau-1-lesson-1') return 'Mula Lesson 2'; if(LESSON.id==='pulau-1-lesson-2') return 'Mula Boss Challenge'; return 'Kembali ke Peta'; }
  function renderSummary(bonus){
    const boss = isBossChallenge();
    setText('lessonPill', boss ? 'Boss Challenge · Pulau 1 Selesai' : `${LESSON.label} · Selesai`);
    setText('lessonTitle', boss ? 'Pulau Huruf Berjaya Ditawan!' : (LESSON.trackProgress?'Tahniah! Lesson Selesai':'Latihan Selesai'));
    setText('lessonInstruction', boss ? 'Zafri dan Zainab sedang membuka laluan ke Pulau 2.' : (LESSON.trackProgress?'Kamu sudah menjawab semua soalan.':'Latihan ringkas selesai. Tiada XP diberikan.'));
    setText('audioPromptTitle', boss ? 'Pulau 2 dibuka!' : 'Zafri bangga dengan usaha kamu!');
    setText('mainJawi', boss ? '🔓' : '🏆');
    setText('coachTitle', boss ? `Skor ${score}/${LESSON.questions.length} · Badge Wira Huruf` : `Skor ${score}/${LESSON.questions.length}`);
    setText('coachNote', boss ? `XP: +${xpEarnedThisRun} · Bonus: +${bonus}. Kamu akan kembali ke peta secara automatik.` : (LESSON.trackProgress?`XP: +${xpEarnedThisRun} · Bonus: +${bonus}`:'Latihan sahaja sebelum kuiz.'));
    const grid=$('answerGrid');
    if(grid){
      if(boss){
        grid.innerHTML=`<div class="lesson-summary-actions"><div class="unlock-note">🏅 Badge Wira Huruf diperoleh · 🔓 Pulau 2 dibuka</div><a class="primary-btn" href="game-map.html">Pergi Ke Peta Sekarang</a></div>`;
      }else{
        grid.innerHTML=`<div class="lesson-summary-actions"><a class="primary-btn" href="${nextPath()}">${nextLabel()}</a><a class="secondary-btn" href="game-map.html">Kembali ke Peta</a><button class="secondary-btn" type="button" id="retryLessonBtn">Ulang</button></div>`;
      }
    }
    const retry=$('retryLessonBtn'); if(retry) retry.addEventListener('click',()=>{currentQuestionIndex=0;score=0;xpEarnedThisRun=0;renderQuestion();});
  }

  function showBossVictoryOverlay(bonus){
    const old = document.getElementById('bossVictoryOverlay');
    if(old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'bossVictoryOverlay';
    overlay.className = 'boss-victory-overlay';
    overlay.innerHTML = `
      <div class="boss-victory-card">
        <div class="victory-glow"></div>
        <img src="assets/characters/zafri-happy.svg?v=1.41.0" alt="Zafri" class="victory-avatar victory-zafri">
        <img src="assets/characters/zainab-happy.svg?v=1.41.0" alt="Zainab" class="victory-avatar victory-zainab">
        <div class="victory-badge">🏅</div>
        <h2>Pulau 1 Selesai!</h2>
        <p class="victory-subtitle">Kamu dapat <strong>Badge Wira Huruf</strong></p>
        <div class="victory-rewards">
          <span>⭐ +${xpEarnedThisRun + bonus} XP</span>
          <span>🔓 Pulau 2 Dibuka</span>
        </div>
        <div class="map-portal">
          <span class="island-dot done">1</span>
          <span class="portal-line"></span>
          <span class="island-dot unlocked">2</span>
        </div>
        <small>Menuju ke peta...</small>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(()=>overlay.classList.add('show'), 30);
    setTimeout(()=>{ window.location.href='game-map.html?unlocked=pulau-2'; }, 4200);
  }
  async function boot(){
    await initAuth(); await Promise.all([loadSelectedChild(),loadAudioSettings()]); await loadProgress(); renderQuestion();
    const audioBtn=$('playAudioBtn'); if(audioBtn) audioBtn.addEventListener('click',()=>{ const q=qNow(); playAudioKey(q.audioKey,q.audioText); });
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
