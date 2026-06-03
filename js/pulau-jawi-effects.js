let PJ_AUDIO_CTX=null;
function audioCtx(){try{PJ_AUDIO_CTX=PJ_AUDIO_CTX||new (window.AudioContext||window.webkitAudioContext)();return PJ_AUDIO_CTX}catch(e){return null}}
function tone(freq=520,dur=.09,type='sine',gain=.055,delay=0){const c=audioCtx();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,c.currentTime+delay);g.gain.setValueAtTime(0.0001,c.currentTime+delay);g.gain.exponentialRampToValueAtTime(gain,c.currentTime+delay+.012);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+delay+dur);o.connect(g);g.connect(c.destination);o.start(c.currentTime+delay);o.stop(c.currentTime+delay+dur+.02)}
function playBlip(){tone(760,.045,'triangle',.035)}
function playMagic(){tone(520,.07,'sine',.04);tone(680,.07,'sine',.04,.07);tone(880,.09,'triangle',.035,.14)}
function playWin(){tone(660,.08,'triangle',.055);tone(880,.08,'triangle',.05,.08);tone(1180,.12,'sine',.045,.17)}
function playVictory(){playWin();setTimeout(()=>{tone(900,.1,'triangle',.045);tone(1200,.12,'sine',.04,.1);tone(1500,.14,'sine',.035,.22)},220)}
function playOops(){tone(220,.11,'sawtooth',.035);tone(165,.12,'sine',.03,.12)}
function speak(text){try{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ms-MY';u.rate=.88;u.pitch=1.32;u.volume=.95;window.speechSynthesis.speak(u)}catch(e){}}
function confetti(){const wrap=document.createElement('div');wrap.className='confetti';document.body.appendChild(wrap);const colors=['#ffd43b','#a7f432','#28b9ff','#ff7ac8','#9b7bff','#ff9f43'];for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.top='-30px';p.style.background=colors[i%colors.length];p.style.animationDelay=(Math.random()*.45)+'s';p.style.transform=`rotate(${Math.random()*180}deg)`;wrap.appendChild(p)}setTimeout(()=>wrap.remove(),2400)}
document.addEventListener('click',e=>{if(e.target.closest('.btn,.option,.map-island'))playBlip()},{capture:true});
