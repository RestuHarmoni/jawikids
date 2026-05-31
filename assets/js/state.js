// JawiKids State + Supabase DB Sync v1.08
// Tujuan: semua modul utama sync ke table Supabase, dengan localStorage sebagai fallback/cache.
const JK = (()=>{
  const KEY = 'jawikids_local_state_v108';
  const defaultState = {parents:[],children:[],progress:[],quiz_results:[],achievements:[],notifications:[],support_tickets:[],ticket_messages:[],affiliate_interest:[],payments:[],subscriptions:[],settings:[],session:null};
  const letters = [['ا','Alif'],['ب','Ba'],['ت','Ta'],['ث','Tha'],['ج','Jim'],['ح','Ha'],['خ','Kha'],['د','Dal'],['ذ','Zal'],['ر','Ra'],['ز','Zai'],['س','Sin'],['ش','Syin'],['ص','Sod'],['ض','Dhod'],['ط','To'],['ظ','Zo'],['ع','Ain'],['غ','Ghain'],['ف','Fa'],['ق','Qaf'],['ك','Kaf'],['ل','Lam'],['م','Mim'],['ن','Nun'],['و','Wau'],['ه','Ha'],['ي','Ya']];
  const questions = [
    {q:'Apakah nama huruf ا ?', a:'Alif', o:['Alif','Ba','Ta','Jim']},
    {q:'Apakah nama huruf ب ?', a:'Ba', o:['Dal','Ba','Sin','Nun']},
    {q:'Pilih huruf untuk Ta', a:'ت', o:['ب','ت','ث','ج']},
    {q:'Pilih huruf untuk Mim', a:'م', o:['ن','م','ل','ك']},
    {q:'Apakah nama huruf ج ?', a:'Jim', o:['Jim','Ha','Kha','Dal']}
  ];
  function load(){try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...defaultState}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function id(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
  function toast(msg){let t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
  function supabase(){return window.jawikidsSupabase || null}
  function currentParent(){const s=load();return s.parents.find(p=>p.id===s.session?.parentId)||null}
  function requireAuth(){const p=currentParent();if(!p){location.href='login.html';return null}return p}
  async function getAuthUser(){const sb=supabase(); if(!sb) return null; const {data,error}=await sb.auth.getSession(); if(error) console.warn('Session error:',error.message); return data?.session?.user || null;}
  async function getSupabaseParent(){
    const sb=supabase(); const local=currentParent(); if(!sb) return local;
    const user=await getAuthUser(); if(!user) return local;
    let {data:parent,error}=await sb.from('parents').select('*').eq('auth_user_id',user.id).maybeSingle();
    if(error) console.warn('Parent select:', error.message);
    if(!parent){
      const email=(user.email||local?.email||'').toLowerCase();
      const profile={auth_user_id:user.id,email,full_name:local?.full_name||user.user_metadata?.full_name||email.split('@')[0]||'Parent',phone:local?.phone||user.user_metadata?.phone||'',package:local?.package||'TRIAL',status:'active',last_login:new Date().toISOString()};
      const ins=await sb.from('parents').insert(profile).select('*').single();
      if(ins.error){console.error('Parent insert failed:',ins.error); return local;}
      parent=ins.data;
    }
    const s=load();
    const mapped={id:parent.id,auth_user_id:parent.auth_user_id,email:parent.email,full_name:parent.full_name||'Parent',phone:parent.phone||'',package:parent.package||'TRIAL',status:parent.status||'active',created_at:parent.created_at,last_login:parent.last_login};
    let p=s.parents.find(x=>x.id===mapped.id)||s.parents.find(x=>x.email===mapped.email);
    if(p) Object.assign(p,mapped); else s.parents.push(mapped);
    s.session={parentId:mapped.id,email:mapped.email,loggedAt:new Date().toISOString()};
    save(s);
    return mapped;
  }
  async function syncAll(){
    const sb=supabase(); if(!sb) return load();
    const p=await getSupabaseParent(); if(!p) return load();
    const s=load();
    const replaceByParent=(key,rows,field='parent_id')=>{s[key]=[...s[key].filter(x=>x[field]!==p.id),...(rows||[])];};
    const ch=await sb.from('children').select('*').eq('parent_id',p.id).order('created_at',{ascending:true});
    if(!ch.error){replaceByParent('children', ch.data);}
    const childrenIds=(ch.data||s.children.filter(c=>c.parent_id===p.id)).map(c=>c.id);
    const parentTables=['notifications','support_tickets','affiliate_interest','payments','subscriptions','settings'];
    for(const t of parentTables){
      const q=await sb.from(t).select('*').eq('parent_id',p.id).order('created_at',{ascending:false});
      if(!q.error) replaceByParent(t,q.data);
    }
    if(childrenIds.length){
      const map={learning_progress:'progress',quiz_results:'quiz_results',achievements:'achievements'};
      for(const [table,key] of Object.entries(map)){
        const q=await sb.from(table).select('*').in('child_id',childrenIds);
        if(!q.error) s[key]=[...s[key].filter(x=>!childrenIds.includes(x.child_id)),...(q.data||[])];
      }
    }
    const ticketIds=s.support_tickets.filter(t=>t.parent_id===p.id).map(t=>t.id);
    if(ticketIds.length){
      const q=await sb.from('ticket_messages').select('*').in('ticket_id',ticketIds).order('created_at',{ascending:true});
      if(!q.error) s.ticket_messages=[...s.ticket_messages.filter(x=>!ticketIds.includes(x.ticket_id)),...(q.data||[])];
    }
    save(s); return s;
  }
  async function insertRow(table,row){const sb=supabase(); if(!sb) return {data:null,error:null}; return await sb.from(table).insert(row).select('*').single();}
  async function updateRow(table,id,row){const sb=supabase(); if(!sb) return {data:null,error:null}; return await sb.from(table).update(row).eq('id',id).select('*').single();}
  async function logout(){const sb=supabase(); if(sb) await sb.auth.signOut(); const s=load();s.session=null;save(s);location.href='login.html'}
  function children(){const p=currentParent(),s=load();return p?s.children.filter(c=>c.parent_id===p.id):[]}
  async function notify(parentId,title,message,type='SYSTEM'){
    const row={parent_id:parentId,type,title,message,is_read:false,created_at:new Date().toISOString()};
    const ins=await insertRow('notifications',row); const s=load();s.notifications.unshift(ins.data||{...row,id:id('noti')});save(s);
  }
  async function markNotificationsRead(parentId){
    const sb=supabase(); if(sb) await sb.from('notifications').update({is_read:true}).eq('parent_id',parentId);
    const s=load();s.notifications.forEach(n=>{if(n.parent_id===parentId)n.is_read=true});save(s);
  }
  async function addXP(childId,xp,activity){
    const s=load();const c=s.children.find(x=>x.id===childId);if(!c)return;
    c.xp=(Number(c.xp)||0)+xp;c.level=Math.max(1,Math.floor(c.xp/100)+1);
    const sb=supabase(); if(sb) await sb.from('children').update({xp:c.xp,level:c.level}).eq('id',c.id);
    const prog={child_id:childId,module:activity,lesson:activity,progress:100,completed:true,updated_at:new Date().toISOString()};
    const progIns=await insertRow('learning_progress',prog); s.progress.push(progIns.data||{...prog,id:id('prog')});
    const badges=[['First Letter',5],['Jawi Explorer',100],['Jawi Champion',500]];
    for(const [badge,need] of badges){
      if(c.xp>=need&&!s.achievements.some(a=>a.child_id===childId&&a.badge===badge)){
        const ach={child_id:childId,badge,xp_reward:xp,unlocked_at:new Date().toISOString()};
        const achIns=await insertRow('achievements',ach); s.achievements.push(achIns.data||{...ach,id:id('ach')});
        const noti={parent_id:c.parent_id,type:'ACHIEVEMENT',title:'Badge Baru Dibuka',message:`${c.full_name} dapat badge ${badge}.`,is_read:false,created_at:new Date().toISOString()};
        const notiIns=await insertRow('notifications',noti); s.notifications.unshift(notiIns.data||{...noti,id:id('noti')});
      }
    }
    save(s);
  }
  async function saveQuizResult(row){const ins=await insertRow('quiz_results',row); const s=load();s.quiz_results.push(ins.data||{...row,id:id('quiz')});save(s);return ins.data;}
  function selectedChild(){const kids=children();return kids[0]||null}
  return {load,save,id,toast,supabase,currentParent,requireAuth,getAuthUser,getSupabaseParent,syncAll,insertRow,updateRow,logout,children,notify,markNotificationsRead,addXP,saveQuizResult,selectedChild,letters,questions};
})();

document.addEventListener('click', e=>{if(e.target.closest('[data-logout]')){e.preventDefault();JK.logout();}});
