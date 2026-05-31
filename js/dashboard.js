document.addEventListener('DOMContentLoaded',async()=>{
  const p=JK.requireAuth(); if(!p)return;
  await JK.syncAll();
  const s=JK.load();const me=JK.currentParent();const kids=s.children.filter(c=>c.parent_id===me.id);
  document.querySelectorAll('[data-parent-name]').forEach(e=>e.textContent=me.full_name);
  set('[data-child-count]',kids.length);set('[data-total-xp]',kids.reduce((a,c)=>a+(Number(c.xp)||0),0));set('[data-streak]',Math.min(7,kids.length?3:0));set('[data-noti-count]',s.notifications.filter(n=>n.parent_id===me.id&&!n.is_read).length);
  const el=document.querySelector('#childSummary');if(el)el.innerHTML=kids.map(c=>`<div class="card"><div class="stat"><div class="icon">${c.avatar||'👧'}</div><div><h3>${c.full_name}</h3><p class="muted">Level ${c.level||1} • ${c.xp||0} XP</p><div class="progress"><span style="width:${Math.min(100,(c.xp||0)%100)}%"></span></div></div></div></div>`).join('')||'<div class="card">Belum ada anak. Klik “Tambah Anak” untuk mula.</div>';
});function set(q,v){const e=document.querySelector(q);if(e)e.textContent=v}
