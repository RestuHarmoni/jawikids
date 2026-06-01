// JawiKids v1.37 - Letter intro before lesson quiz
(function(){
  'use strict';
  const LETTERS = [
    { jawi:'ا', name:'Alif', sound:'Alif', tip:'Bentuk tegak seperti batang.' },
    { jawi:'ب', name:'Ba', sound:'Ba', tip:'Ada satu titik di bawah.' },
    { jawi:'ت', name:'Ta', sound:'Ta', tip:'Ada dua titik di atas.' },
    { jawi:'ث', name:'Tha', sound:'Tha', tip:'Ada tiga titik di atas.' }
  ];
  function $(id){ return document.getElementById(id); }
  function speak(text){
    if(!('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ms-MY'; utter.rate = 0.78; utter.pitch = 1.05;
      window.speechSynthesis.speak(utter);
    }catch(e){}
  }
  function render(){
    const grid = $('letterLearnGrid');
    if(!grid) return;
    grid.innerHTML = '';
    LETTERS.forEach(item => {
      const card = document.createElement('button');
      card.className = 'letter-learn-card';
      card.type = 'button';
      card.innerHTML = `<span class="learn-jawi" dir="rtl">${item.jawi}</span><strong>${item.name}</strong><small>${item.tip}</small><span class="learn-audio-chip">Mainkan bunyi</span>`;
      card.addEventListener('click', () => speak(`Ini huruf ${item.sound}. ${item.tip}`));
      grid.appendChild(card);
    });
  }
  async function loadChildName(){
    try{
      if(!window.jawiSupabase) return;
      const { data: userData } = await window.jawiSupabase.auth.getUser();
      const user = userData && userData.user;
      if(!user){ window.location.href = 'login.html'; return; }
      const childId = localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id') || '';
      if(!childId) return;
      const { data } = await window.jawiSupabase.from('children').select('name').eq('id', childId).eq('parent_id', user.id).maybeSingle();
      if(data && data.name){ const el=$('introChildText'); if(el) el.textContent = `${data.name}, tekan setiap kad untuk dengar bunyi huruf.`; }
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', () => { render(); loadChildName(); });
})();
