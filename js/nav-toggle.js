// JawiKids v1.49 - minimal hide/show top navigation
(function(){
  'use strict';
  function setup(){
    document.querySelectorAll('.app-header').forEach(header=>{
      const nav=header.querySelector('.app-nav');
      if(!nav || header.querySelector('.jk-nav-toggle')) return;
      const btn=document.createElement('button');
      btn.type='button'; btn.className='jk-nav-toggle'; btn.setAttribute('aria-label','Buka atau sembunyikan menu');
      btn.innerHTML='<span></span><span></span><span></span>';
      const key='jawikids_nav_hidden_'+(location.pathname.split('/').pop()||'home');
      if(localStorage.getItem(key)==='1' || window.matchMedia('(max-width: 980px)').matches) header.classList.add('jk-nav-hidden');
      btn.addEventListener('click',()=>{
        header.classList.toggle('jk-nav-hidden');
        header.classList.toggle('jk-nav-open', !header.classList.contains('jk-nav-hidden'));
        localStorage.setItem(key, header.classList.contains('jk-nav-hidden') ? '1' : '0');
      });
      header.insertBefore(btn, nav);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', setup, {once:true}); else setup();
})();
