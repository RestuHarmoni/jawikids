// Pulau Jawi v3.2 - Pulau 1 Pengenalan Jawi: 10 kids mini games (age 5-8)
(function(){
  'use strict';
  const VERSION = '3.2.0';
  const $ = (id)=>document.getElementById(id);
  const qs = new URLSearchParams(location.search);
  const selectedGame = Math.max(0, Math.min(10, parseInt(qs.get('game') || '0', 10) || 0));
  const selectedChildId = qs.get('child') || localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id') || sessionStorage.getItem('jawikids_selected_child_id') || '';

  const letters = [
    {j:'ا', r:'Alif', clue:'bentuk tegak seperti tiang', dots:'tiada titik'},
    {j:'ب', r:'Ba', clue:'satu titik di bawah', dots:'1 titik bawah'},
    {j:'ت', r:'Ta', clue:'dua titik di atas', dots:'2 titik atas'},
    {j:'ث', r:'Tha', clue:'tiga titik di atas', dots:'3 titik atas'},
    {j:'ج', r:'Jim', clue:'ada titik di bawah', dots:'1 titik bawah'},
    {j:'ح', r:'Ha', clue:'tiada titik', dots:'tiada titik'},
    {j:'خ', r:'Kha', clue:'ada titik di atas', dots:'1 titik atas'},
    {j:'د', r:'Dal', clue:'bentuk pendek tanpa titik', dots:'tiada titik'},
    {j:'ذ', r:'Dzal', clue:'seperti Dal tetapi ada titik', dots:'1 titik atas'},
    {j:'ر', r:'Ra', clue:'melengkung tanpa titik', dots:'tiada titik'}
  ];
  const allChoices = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','و','ه','ء','ي'];
  const gameList = [
    {id:1, icon:'🎈', title:'Belon Huruf Ajaib', skill:'Kenal huruf pertama', color:'pink'},
    {id:2, icon:'🎧', title:'Dengar & Pilih', skill:'Dengar bunyi huruf', color:'blue'},
    {id:3, icon:'🧩', title:'Padan Rumi Jawi', skill:'Padanan nama huruf', color:'mint'},
    {id:4, icon:'🔎', title:'Misi Cari Titik', skill:'Kenal titik huruf', color:'yellow'},
    {id:5, icon:'👀', title:'Huruf Hampir Sama', skill:'Bezakan bentuk huruf', color:'purple'},
    {id:6, icon:'🚂', title:'Kereta Alif Ba Ta', skill:'Susun turutan awal', color:'orange'},
    {id:7, icon:'🃏', title:'Kad Memori Jawi', skill:'Ingat pasangan huruf', color:'green'},
    {id:8, icon:'⭐', title:'Tangkap Bintang Huruf', skill:'Pilih huruf sasaran', color:'sky'},
    {id:9, icon:'🎨', title:'Lukis Bentuk Huruf', skill:'Cam bentuk asas', color:'peach'},
    {id:10, icon:'👑', title:'Mini Boss Pulau 1', skill:'Ulang kaji semua', color:'gold'}
  ];
  const state = { game:selectedGame, qIndex:0, score:0, total:5, locked:false, current:null, childName:'Anak Hebat' };

  function persistChildId(id){ if(!id) return; localStorage.setItem('jawikids_selected_child_id',id); localStorage.setItem('selected_child_id',id); sessionStorage.setItem('jawikids_selected_child_id',id); }
  if(selectedChildId) persistChildId(selectedChildId);

  function setText(id, text){ const el=$(id); if(el) el.textContent = text; }
  function setHTML(id, html){ const el=$(id); if(el) el.innerHTML = html; }
  function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
  function pickChoices(correct, extra=[]){
    const pool = shuffle([...new Set([...extra, ...allChoices])].filter(x=>x!==correct));
    return shuffle([correct, ...pool.slice(0,3)]);
  }
  function speak(text){
    try{
      if(!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang='ms-MY'; u.rate=.86; u.pitch=1.18;
      const voices = speechSynthesis.getVoices();
      const v = voices.find(x=>/ms|malay|indonesia/i.test(x.lang+' '+x.name)) || voices.find(x=>/female|zira|siti|google/i.test(x.name)) || voices[0];
      if(v) u.voice=v;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function tone(kind='tap'){
    try{
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const now = ctx.currentTime;
      const notes = kind==='ok' ? [660,880,1175] : kind==='bad' ? [220,170] : kind==='pop' ? [520,900] : [440,560];
      notes.forEach((f,i)=>{
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.type = kind==='bad' ? 'triangle' : 'sine'; o.frequency.value=f;
        g.gain.setValueAtTime(.001, now+i*.055); g.gain.exponentialRampToValueAtTime(.16, now+i*.055+.012); g.gain.exponentialRampToValueAtTime(.001, now+i*.055+.12);
        o.connect(g); g.connect(ctx.destination); o.start(now+i*.055); o.stop(now+i*.055+.14);
      });
    }catch(e){}
  }
  function burstConfetti(){
    const wrap = document.createElement('div'); wrap.className='pj-confetti';
    const chars=['⭐','✨','🌈','🎉','💫','🌟'];
    for(let i=0;i<26;i++){
      const s=document.createElement('span'); s.textContent=chars[i%chars.length];
      s.style.left = (8+Math.random()*84)+'%'; s.style.animationDelay=(Math.random()*.25)+'s'; s.style.setProperty('--dx',(Math.random()*180-90)+'px');
      wrap.appendChild(s);
    }
    document.body.appendChild(wrap); setTimeout(()=>wrap.remove(),1200);
  }
  function avatarSrc(){ return `assets/characters/zafri-happy.svg?v=${VERSION}`; }
  function updateHud(){
    setText('hudChildName', state.childName || 'Anak'); setText('hudXp', `${state.score*10} XP`); setText('hudHearts', '❤️❤️❤️❤️❤️');
    setText('hudQuestion', state.game ? `${state.qIndex+1}/${state.total}` : '10 Game');
    const av=$('hudAvatar'); if(av) av.src=avatarSrc();
    const pct = state.game ? Math.round((state.qIndex/state.total)*100) : 0;
    const fill=$('lessonProgressFill'); if(fill) fill.style.width=pct+'%'; setText('lessonProgressText', state.game?`${pct}% siap`:'Pilih game pengenalan Jawi');
  }
  async function loadChild(){
    try{
      if(!window.jawiSupabase && window.getJawiSupabase) window.jawiSupabase = window.getJawiSupabase();
      if(!window.jawiSupabase || !selectedChildId) return;
      const {data:{user}} = await window.jawiSupabase.auth.getUser();
      if(!user) return;
      const {data} = await window.jawiSupabase.from('children').select('name').eq('id',selectedChildId).eq('parent_id',user.id).maybeSingle();
      if(data?.name) state.childName=data.name;
    }catch(e){}
  }

  function renderHub(){
    state.game=0; document.body.classList.add('pulau1-hub-mode'); document.body.classList.remove('pulau1-game-mode');
    updateHud();
    setText('lessonPill','Pulau 1 · Pengenalan Jawi · 10 Mini Game');
    setText('lessonTitle','Pulau 1: Jom Kenal Huruf Jawi');
    setText('lessonInstruction','Mulakan dari game pertama. Setiap game pendek, ceria dan sesuai untuk anak umur 5–8 tahun.');
    setText('audioPromptTitle','Zafri kata: Jom mula dengan huruf!');
    setText('audioStatus','Tekan mana-mana game untuk mula bermain.');
    setText('mainJawi','ج');
    setText('coachTitle','Pengenalan Jawi dahulu.');
    setText('coachNote','Game Pulau 1 fokus kepada huruf, titik, bunyi dan bentuk asas Jawi.');
    const grid = $('answerGrid');
    grid.innerHTML = `<div class="pulau1-game-grid">${gameList.map(g=>`<button class="pulau1-game-card ${g.color}" data-game="${g.id}" type="button"><span class="game-no">${g.id}</span><span class="game-icon">${g.icon}</span><strong>${g.title}</strong><small>${g.skill}</small><em>Mula</em></button>`).join('')}</div>`;
    grid.querySelectorAll('[data-game]').forEach(btn=>btn.addEventListener('click',()=>{ tone('pop'); location.href = `lesson-game.html?island=1&game=${btn.dataset.game}${selectedChildId?'&child='+selectedChildId:''}`; }));
    const play=$('playAudioBtn'); if(play) play.onclick=()=>{ tone('tap'); speak('Selamat datang ke Pulau Satu. Jom kenal huruf Jawi dari mula. Pilih game pertama untuk bermula.'); };
  }

  function makeQuestion(gameId){
    const i = state.qIndex;
    const L = letters[(i + gameId - 1) % letters.length];
    if(gameId===1) return {type:'balloon', title:`Pecahkan belon huruf ${L.r}`, prompt:`Cari dan pecahkan belon huruf ${L.r}.`, correct:L.j, choices:pickChoices(L.j, ['ا','ب','ت','ث','ج','ح']), voice:`Pecahkan belon huruf ${L.r}`};
    if(gameId===2) return {type:'audio', title:`Dengar bunyi: ${L.r}`, prompt:'Tekan audio, kemudian pilih huruf yang betul.', correct:L.j, choices:pickChoices(L.j), voice:`Pilih huruf ${L.r}`};
    if(gameId===3) return {type:'match', title:`Padankan ${L.r}`, prompt:`Huruf Jawi untuk ${L.r} ialah?`, correct:L.j, choices:pickChoices(L.j), voice:`Padankan nama ${L.r} dengan huruf Jawi.`};
    if(gameId===4) return {type:'dots', title:`Misi Titik: ${L.dots}`, prompt:`Pilih huruf yang mempunyai ${L.dots}.`, correct:L.j, choices:pickChoices(L.j, ['ب','ت','ث','ج','ح','خ','د','ذ','ر']), voice:`Cari huruf yang mempunyai ${L.dots}.`};
    if(gameId===5) return {type:'similar', title:'Huruf Hampir Sama', prompt:`Antara pilihan ini, mana huruf ${L.r}?`, correct:L.j, choices:pickChoices(L.j, ['ب','ت','ث','ج','ح','خ','د','ذ','ر']), voice:`Perhatikan bentuk. Pilih huruf ${L.r}.`};
    if(gameId===6){ const seq=['ا','ب','ت','ث','ج']; return {type:'train', title:'Kereta Alif Ba Ta', prompt:`Gerabak nombor ${i+1}: pilih huruf seterusnya.`, correct:seq[i%seq.length], choices:shuffle(seq), voice:'Susun kereta huruf. Pilih huruf yang betul.'}; }
    if(gameId===7) return {type:'memory', title:`Kad Memori ${L.r}`, prompt:`Buka kad yang sama dengan ${L.j}.`, correct:L.j, choices:pickChoices(L.j), voice:`Ingat kad huruf ${L.r}.`};
    if(gameId===8) return {type:'star', title:`Tangkap bintang ${L.r}`, prompt:`Tangkap bintang yang membawa huruf ${L.r}.`, correct:L.j, choices:pickChoices(L.j), voice:`Tangkap bintang huruf ${L.r}.`};
    if(gameId===9) return {type:'shape', title:`Bentuk Huruf ${L.r}`, prompt:`${L.r}: ${L.clue}. Pilih hurufnya.`, correct:L.j, choices:pickChoices(L.j), voice:`Lihat bentuk. ${L.r} ${L.clue}.`};
    return {type:'boss', title:'Mini Boss Pulau 1', prompt:`Cabaran ulang kaji: pilih ${L.r}.`, correct:L.j, choices:pickChoices(L.j), voice:`Mini boss. Pilih huruf ${L.r}.`};
  }

  function renderGame(){
    document.body.classList.remove('pulau1-hub-mode'); document.body.classList.add('pulau1-game-mode');
    const meta = gameList[state.game-1]; state.current = makeQuestion(state.game); state.locked=false;
    updateHud();
    setText('lessonPill',`Pulau 1 · Game ${meta.id}/10 · ${meta.title}`);
    setText('lessonTitle',state.current.title); setText('lessonInstruction',state.current.prompt);
    setText('audioPromptTitle',`${meta.icon} ${meta.title}`); setText('audioStatus','Tekan audio untuk dengar arahan Zafri.');
    setText('mainJawi', state.current.type==='audio' ? '🎧' : state.current.correct);
    setText('coachTitle', meta.skill); setText('coachNote','Jawab dengan santai. Kalau salah, cuba lagi.');
    const grid=$('answerGrid');
    const cls = `pulau1-options ${state.current.type}`;
    grid.innerHTML = `<div class="${cls}">${state.current.choices.map(c=>`<button class="pulau1-choice ${state.current.type}" type="button" data-choice="${c}" dir="rtl"><span>${c}</span></button>`).join('')}</div>`;
    grid.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>handleAnswer(btn.dataset.choice,btn)));
    const play=$('playAudioBtn'); if(play) play.onclick=()=>{ tone('tap'); speak(state.current.voice); };
    setTimeout(()=>speak(state.current.voice),250);
  }

  function handleAnswer(choice, btn){
    if(state.locked) return;
    if(choice !== state.current.correct){
      btn.classList.add('wrong','shake'); tone('bad'); speak('Cuba lagi sayang. Perhatikan huruf dengan baik.');
      setText('coachTitle','Cuba lagi.'); setText('coachNote','Tak apa, belajar perlahan-lahan.');
      setTimeout(()=>btn.classList.remove('shake'),500); return;
    }
    state.locked=true; state.score++;
    btn.classList.add('correct','pop-burst'); tone(state.current.type==='balloon'?'pop':'ok'); burstConfetti();
    setText('mainJawi',choice); setText('coachTitle','Hebat! Jawapan betul.'); setText('coachNote','Zafri bagi bintang untuk kamu!');
    speak('Tahniah. Jawapan betul.');
    setTimeout(()=>{
      if(state.qIndex < state.total-1){ state.qIndex++; renderGame(); return; }
      renderComplete();
    },950);
  }
  function renderComplete(){
    const meta=gameList[state.game-1]; const next=state.game<10 ? state.game+1 : 0;
    updateHud(); const fill=$('lessonProgressFill'); if(fill) fill.style.width='100%'; setText('lessonProgressText','100% siap');
    setText('lessonPill',`Pulau 1 · ${meta.title} Selesai`); setText('lessonTitle','Syabas! Game Selesai');
    setText('lessonInstruction',`Skor kamu ${state.score}/${state.total}. Teruskan kenal huruf Jawi dari mula.`);
    setText('audioPromptTitle','Zafri bangga dengan kamu!'); setText('audioStatus','Pilih game seterusnya atau kembali ke peta.'); setText('mainJawi','🏆');
    setText('coachTitle',`+${state.score*10} XP Demo`); setText('coachNote', state.game<10?'Jom cuba game seterusnya.':'Pulau 1 pengenalan selesai. Kamu sudah kenal asas huruf!');
    const child = selectedChildId ? `&child=${selectedChildId}` : '';
    setHTML('answerGrid', `<div class="pulau1-complete-card"><div class="trophy">🏆</div><strong>${meta.title}</strong><p>Skor: ${state.score}/${state.total}</p><div class="lesson-summary-actions">${next?`<a class="primary-btn" href="lesson-game.html?island=1&game=${next}${child}">Game Seterusnya</a>`:`<a class="primary-btn" href="game-map.html">Kembali ke Peta</a>`}<a class="secondary-btn" href="lesson-game.html?island=1${child}">Senarai 10 Game</a><button class="secondary-btn" id="retryLessonBtn" type="button">Ulang Game</button></div></div>`);
    const retry=$('retryLessonBtn'); if(retry) retry.onclick=()=>{state.qIndex=0;state.score=0;renderGame();};
    burstConfetti(); speak('Syabas. Game selesai.');
  }

  async function boot(){
    await loadChild(); updateHud();
    if(selectedGame) renderGame(); else renderHub();
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
