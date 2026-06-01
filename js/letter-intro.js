// JawiKids v1.38 - Basic Letter Intro Audio Grid (No XP)
(function(){
  'use strict';

  const LETTERS = [
    { key:'alif', jawi:'ا', name:'Alif', audioKey:'letter_alif', audioText:'Ini huruf Alif.' },
    { key:'ba', jawi:'ب', name:'Ba', audioKey:'letter_ba', audioText:'Ini huruf Ba.' },
    { key:'ta', jawi:'ت', name:'Ta', audioKey:'letter_ta', audioText:'Ini huruf Ta.' },
    { key:'tha', jawi:'ث', name:'Tha', audioKey:'letter_tha', audioText:'Ini huruf Tha.' },
    { key:'jim', jawi:'ج', name:'Jim', audioKey:'letter_jim', audioText:'Ini huruf Jim.' },
    { key:'cha', jawi:'چ', name:'Cha', audioKey:'letter_cha', audioText:'Ini huruf Cha.' },
    { key:'ha', jawi:'ح', name:'Ha', audioKey:'letter_ha', audioText:'Ini huruf Ha.' },
    { key:'kha', jawi:'خ', name:'Kha', audioKey:'letter_kha', audioText:'Ini huruf Kha.' },
    { key:'dal', jawi:'د', name:'Dal', audioKey:'letter_dal', audioText:'Ini huruf Dal.' },
    { key:'zal', jawi:'ذ', name:'Zal', audioKey:'letter_zal', audioText:'Ini huruf Zal.' },
    { key:'ra', jawi:'ر', name:'Ra', audioKey:'letter_ra', audioText:'Ini huruf Ra.' },
    { key:'zai', jawi:'ز', name:'Zai', audioKey:'letter_zai', audioText:'Ini huruf Zai.' },
    { key:'sin', jawi:'س', name:'Sin', audioKey:'letter_sin', audioText:'Ini huruf Sin.' },
    { key:'syin', jawi:'ش', name:'Syin', audioKey:'letter_syin', audioText:'Ini huruf Syin.' },
    { key:'sad', jawi:'ص', name:'Sad', audioKey:'letter_sad', audioText:'Ini huruf Sad.' },
    { key:'dad', jawi:'ض', name:'Dad', audioKey:'letter_dad', audioText:'Ini huruf Dad.' },
    { key:'to', jawi:'ط', name:'To', audioKey:'letter_to', audioText:'Ini huruf To.' },
    { key:'zo', jawi:'ظ', name:'Zo', audioKey:'letter_zo', audioText:'Ini huruf Zo.' },
    { key:'ain', jawi:'ع', name:'Ain', audioKey:'letter_ain', audioText:'Ini huruf Ain.' },
    { key:'ghain', jawi:'غ', name:'Ghain', audioKey:'letter_ghain', audioText:'Ini huruf Ghain.' },
    { key:'nga', jawi:'ڠ', name:'Nga', audioKey:'letter_nga', audioText:'Ini huruf Nga.' },
    { key:'fa', jawi:'ف', name:'Fa', audioKey:'letter_fa', audioText:'Ini huruf Fa.' },
    { key:'pa', jawi:'ڤ', name:'Pa', audioKey:'letter_pa', audioText:'Ini huruf Pa.' },
    { key:'qaf', jawi:'ق', name:'Qaf', audioKey:'letter_qaf', audioText:'Ini huruf Qaf.' },
    { key:'kaf', jawi:'ک', name:'Kaf', audioKey:'letter_kaf', audioText:'Ini huruf Kaf.' },
    { key:'ga', jawi:'ݢ', name:'Ga', audioKey:'letter_ga', audioText:'Ini huruf Ga.' },
    { key:'lam', jawi:'ل', name:'Lam', audioKey:'letter_lam', audioText:'Ini huruf Lam.' },
    { key:'mim', jawi:'م', name:'Mim', audioKey:'letter_mim', audioText:'Ini huruf Mim.' },
    { key:'nun', jawi:'ن', name:'Nun', audioKey:'letter_nun', audioText:'Ini huruf Nun.' },
    { key:'wau', jawi:'و', name:'Wau', audioKey:'letter_wau', audioText:'Ini huruf Wau.' },
    { key:'va', jawi:'ۏ', name:'Va', audioKey:'letter_va', audioText:'Ini huruf Va.' },
    { key:'ha2', jawi:'ه', name:'Ha', audioKey:'letter_ha2', audioText:'Ini huruf Ha.' },
    { key:'hamzah', jawi:'ء', name:'Hamzah', audioKey:'letter_hamzah', audioText:'Ini huruf Hamzah.' },
    { key:'ya', jawi:'ي', name:'Ya', audioKey:'letter_ya', audioText:'Ini huruf Ya.' }
  ];

  let audioSettings = {};
  let activeAudio = null;

  function $(id){ return document.getElementById(id); }
  function setText(id, value){ const el=$(id); if(el) el.textContent = value; }

  async function requireUserAndChildName(){
    try{
      if(!window.jawiSupabase) return;
      const { data: userData } = await window.jawiSupabase.auth.getUser();
      const user = userData && userData.user;
      if(!user){ window.location.href = 'login.html'; return; }
      const childId = localStorage.getItem('jawikids_selected_child_id') || localStorage.getItem('selected_child_id') || '';
      if(!childId) return;
      const { data } = await window.jawiSupabase
        .from('children')
        .select('name')
        .eq('id', childId)
        .eq('parent_id', user.id)
        .maybeSingle();
      if(data && data.name) setText('introChildText', `${data.name}, tekan mana-mana huruf untuk dengar bunyinya.`);
    }catch(e){}
  }

  async function loadAudioSettings(){
    audioSettings = {};
    if(!window.jawiSupabase) return;
    const keys = LETTERS.map(item => item.audioKey);
    const { data, error } = await window.jawiSupabase
      .from('audio_settings')
      .select('audio_key,audio_text,audio_url,is_active')
      .in('audio_key', keys)
      .eq('is_active', true);
    if(error){
      console.warn('[JawiKids] letter audio_settings fallback TTS:', error.message);
      return;
    }
    (data || []).forEach(row => { audioSettings[row.audio_key] = row; });
  }

  function renderLetters(){
    const grid = $('letterLearnGrid');
    if(!grid) return;
    grid.innerHTML = '';
    LETTERS.forEach((item, index) => {
      const card = document.createElement('button');
      card.className = 'letter-learn-card basic-letter-card';
      card.type = 'button';
      card.setAttribute('aria-label', `Dengar huruf ${item.name}`);
      card.innerHTML = `
        <span class="letter-no">${index + 1}</span>
        <span class="learn-jawi" dir="rtl">${item.jawi}</span>
        <strong>${item.name}</strong>
        <span class="learn-audio-chip">Tekan untuk dengar</span>
      `;
      card.addEventListener('click', () => playLetter(item, card));
      grid.appendChild(card);
    });
  }

  function playLetter(item, card){
    document.querySelectorAll('.letter-learn-card').forEach(el => el.classList.remove('is-playing'));
    if(card) card.classList.add('is-playing');
    setText('activeLetterName', item.name);
    setText('activeLetterJawi', item.jawi);
    setText('activeLetterStatus', 'Audio sedang dimainkan...');

    const setting = audioSettings[item.audioKey] || {};
    const url = setting.audio_url || '';
    const text = setting.audio_text || item.audioText || `Ini huruf ${item.name}.`;
    if(url) playAudioUrl(url, text, card);
    else speak(text, card);
  }

  function playAudioUrl(url, fallbackText, card){
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      if(window.speechSynthesis) window.speechSynthesis.cancel();
      activeAudio = new Audio(url);
      activeAudio.onended = () => finishPlaying(card);
      activeAudio.onerror = () => speak(fallbackText, card);
      activeAudio.play().catch(() => speak(fallbackText, card));
    }catch(e){ speak(fallbackText, card); }
  }

  function speak(text, card){
    if(!('speechSynthesis' in window)){ finishPlaying(card); return; }
    try{
      if(activeAudio){ activeAudio.pause(); activeAudio.currentTime = 0; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ms-MY';
      utter.rate = 0.8;
      utter.pitch = 1.05;
      utter.onend = () => finishPlaying(card);
      utter.onerror = () => finishPlaying(card);
      window.speechSynthesis.speak(utter);
    }catch(e){ finishPlaying(card); }
  }

  function finishPlaying(card){
    if(card) card.classList.remove('is-playing');
    setText('activeLetterStatus', 'Tekan huruf lain untuk dengar bunyinya.');
  }

  async function boot(){
    await Promise.all([requireUserAndChildName(), loadAudioSettings()]);
    renderLetters();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
