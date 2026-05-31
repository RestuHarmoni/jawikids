// JawiKids Child Profile System v1.08 - Supabase table sync
async function renderChildren(){
  const p=JK.requireAuth(); if(!p) return;
  await JK.syncAll();
  const s=JK.load(); const kids=s.children.filter(c=>c.parent_id===p.id);
  const count=document.querySelector('[data-child-count]'); if(count) count.textContent=`${kids.length}/5`;
  const el=document.querySelector('#childrenList'); if(!el) return;
  el.innerHTML=kids.map(c=>`<div class="card"><div class="stat"><div class="icon">${c.avatar||'👧'}</div><div><h3>${c.full_name}</h3><p class="muted">${c.gender||''} • ${c.birth_year||''}</p><p>Level ${c.level||1} • ${c.xp||0} XP</p></div></div></div>`).join('') || '<div class="card">Belum ada anak.</div>';
}

document.addEventListener('DOMContentLoaded',async()=>{
  const p=JK.requireAuth(); if(!p) return;
  await renderChildren();
  const form=document.querySelector('#childForm');
  if(form) form.addEventListener('submit',async e=>{
    e.preventDefault();
    const parent=await JK.getSupabaseParent();
    const s=JK.load(); const kids=s.children.filter(c=>c.parent_id===parent.id);
    if(kids.length>=5) return JK.toast('Maksimum 5 anak sahaja.');
    const row={parent_id:parent.id,full_name:form.full_name.value.trim(),gender:form.gender.value,birth_year:Number(form.birth_year.value),avatar:form.avatar.value,level:1,xp:0,created_at:new Date().toISOString()};
    let child=row;
    if(JK.supabase()){
      const {data,error}=await JK.insertRow('children',row);
      if(error){console.error(error); return JK.toast('Gagal simpan anak ke Supabase: '+error.message);}
      child=data;
    } else child={...row,id:JK.id('child')};
    const st=JK.load(); st.children.push(child); JK.save(st);
    await JK.notify(parent.id,'Profil Anak Ditambah',`${child.full_name} berjaya ditambah.`,'SYSTEM');
    form.reset(); JK.toast('Profil anak berjaya disimpan.'); await renderChildren();
  });
});
