document.addEventListener('DOMContentLoaded',()=>{
  if(document.body.classList.contains('public-page')) return;
  const p=JK.currentParent();
  if(!p && !['/login.html','/register.html','/forgot-password.html','/index.html','/pricing.html','/demo.html','/offline.html','/'].some(x=>location.pathname.endsWith(x))) location.href='login.html';
  document.querySelectorAll('[data-parent-name]').forEach(el=>el.textContent=p?.full_name||'Parent');
});
