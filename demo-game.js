const questions = [
  { audio: 'Ketuk huruf Ba!', target: 'ب', options: ['ا','ب','ت','ج'], clue: 'Ba berbunyi seperti permulaan perkataan Baju.' },
  { audio: 'Ketuk huruf Alif!', target: 'ا', options: ['د','ا','ر','س'], clue: 'Alif berdiri tegak seperti tiang.' },
  { audio: 'Ketuk huruf Ta!', target: 'ت', options: ['ب','ن','ت','ي'], clue: 'Ta ada dua titik di atas.' },
  { audio: 'Ketuk huruf Jim!', target: 'ج', options: ['ح','خ','ج','چ'], clue: 'Jim ada satu titik di bawah.' },
  { audio: 'Ketuk huruf Dal!', target: 'د', options: ['د','ذ','ر','ز'], clue: 'Dal bentuknya melengkung tanpa titik.' }
];

const ASSETS = window.JawiKidsAssets || {};
const CHAR = ASSETS.characters || {};
const getAvatar = (character, mood) => CHAR?.[character]?.[mood] || `assets/avatars/${character}/${character}-default.svg`;

const colors = ['#fb7185','#38bdf8','#a78bfa','#f59e0b','#22c55e','#ef4444'];
let current = 0;
let hearts = 5;
let xp = 0;
let locked = false;

const heartDisplay = document.getElementById('heartDisplay');
const xpDisplay = document.getElementById('xpDisplay');
const questionCounter = document.getElementById('questionCounter');
const commandText = document.getElementById('commandText');
const balloonGrid = document.getElementById('balloonGrid');
const feedbackText = document.getElementById('feedbackText');
const helperIcon = document.getElementById('helperIcon');
const helperName = document.getElementById('helperName');
const helperText = document.getElementById('helperText');
const resultPanel = document.getElementById('resultPanel');
const gameStage = document.getElementById('gameStage');
const restartBtn = document.getElementById('restartBtn');
const resultSummary = document.getElementById('resultSummary');
const soundBtn = document.getElementById('soundBtn');

function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace('Ketuk huruf ', '').replace('!', ''));
  u.lang = 'ms-MY';
  u.rate = 0.82;
  u.pitch = 1.08;
  window.speechSynthesis.speak(u);
}

function tone(type){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type === 'good' ? 'sine' : 'triangle';
    osc.frequency.value = type === 'good' ? 880 : 220;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);
    osc.start(); osc.stop(ctx.currentTime + 0.14);
  }catch(e){}
}

function render(){
  locked = false;
  const q = questions[current];
  heartDisplay.textContent = '❤️'.repeat(hearts) + '♡'.repeat(5-hearts);
  xpDisplay.textContent = `${xp} XP`;
  questionCounter.textContent = `${current+1}/5`;
  commandText.textContent = q.audio;
  feedbackText.textContent = 'Pilih belon yang betul.';
  helperIcon.src = getAvatar('zafri', 'default'); helperIcon.alt = 'Zafri'; helperName.textContent = 'Zafri';
  helperText.textContent = 'Dengar arahan dan ketuk belon huruf yang betul!';
  balloonGrid.innerHTML = '';
  q.options.forEach((opt, i)=>{
    const btn = document.createElement('button');
    btn.className = 'balloon';
    btn.dir = 'rtl';
    btn.textContent = opt;
    btn.style.background = `linear-gradient(160deg, ${colors[i]}, ${colors[(i+2)%colors.length]})`;
    btn.onclick = () => answer(opt, btn);
    balloonGrid.appendChild(btn);
  });
}

function answer(opt, btn){
  if(locked) return;
  locked = true;
  const q = questions[current];
  if(opt === q.target){
    xp += 10;
    btn.classList.add('correct');
    tone('good');
    helperIcon.src = getAvatar('zafri', 'happy'); helperIcon.alt = 'Zafri'; helperName.textContent = 'Zafri';
    helperText.textContent = 'Hebat! Jawapan betul. Teruskan pengembaraan!';
    feedbackText.textContent = '+10 XP Demo ⭐';
  }else{
    hearts = Math.max(0, hearts-1);
    btn.classList.add('wrong');
    tone('soft');
    helperIcon.src = getAvatar('zainab', 'help'); helperIcon.alt = 'Zainab'; helperName.textContent = 'Zainab';
    helperText.textContent = q.clue;
    feedbackText.textContent = 'Cuba lagi dengan tenang. Zainab beri klu!';
  }
  heartDisplay.textContent = '❤️'.repeat(hearts) + '♡'.repeat(5-hearts);
  xpDisplay.textContent = `${xp} XP`;
  setTimeout(()=>{
    if(current >= questions.length-1 || hearts === 0){ finish(); }
    else { current++; render(); }
  }, opt === q.target ? 850 : 1400);
}

function finish(){
  gameStage.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  resultSummary.textContent = `Anak anda berjaya mengumpul ${xp} XP demo. Daftar akaun parent untuk simpan progress, buka pulau baru dan kumpul badge sebenar.`;
}

restartBtn.addEventListener('click', ()=>{
  current = 0; hearts = 5; xp = 0;
  resultPanel.classList.add('hidden');
  gameStage.classList.remove('hidden');
  render();
});
soundBtn.addEventListener('click', ()=> speak(questions[current].audio));
render();
