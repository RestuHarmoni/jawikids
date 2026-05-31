const JK = (()=>{
  const KEY = 'jawikids_local_state_v103';
  const defaultState = {parents:[],children:[],progress:[],quiz_results:[],achievements:[],notifications:[],support_tickets:[],ticket_messages:[],affiliate_interest:[],payments:[],settings:[],session:null};
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
  function currentParent(){const s=load();return s.parents.find(p=>p.id===s.session?.parentId)||null}
  function requireAuth(){const p=currentParent();if(!p){location.href='login.html';return null}return p}
  function logout(){const s=load();s.session=null;save(s);location.href='login.html'}
  function children(){const p=currentParent(),s=load();return p?s.children.filter(c=>c.parent_id===p.id):[]}
  function notify(parentId,title,message,type='SYSTEM'){const s=load();s.notifications.unshift({id:id('noti'),parent_id:parentId,type,title,message,is_read:false,created_at:new Date().toISOString()});save(s)}
  function addXP(childId,xp,activity){const s=load();const c=s.children.find(x=>x.id===childId);if(!c)return;c.xp=(Number(c.xp)||0)+xp;c.level=Math.max(1,Math.floor(c.xp/100)+1);s.progress.push({id:id('prog'),child_id:childId,module:activity,lesson:activity,progress:100,completed:true,updated_at:new Date().toISOString()});const badges=[['First Letter',5],['Jawi Explorer',100],['Jawi Champion',500]];for(const [badge,need] of badges){if(c.xp>=need&&!s.achievements.some(a=>a.child_id===childId&&a.badge===badge)){s.achievements.push({id:id('ach'),child_id:childId,badge,xp_reward:xp,unlocked_at:new Date().toISOString()});s.notifications.unshift({id:id('noti'),parent_id:c.parent_id,type:'ACHIEVEMENT',title:'Badge Baru Dibuka',message:`${c.full_name} dapat badge ${badge}.`,is_read:false,created_at:new Date().toISOString()});}}
    save(s)}
  function selectedChild(){const kids=children();return kids[0]||null}
  return {load,save,id,toast,currentParent,requireAuth,logout,children,notify,addXP,selectedChild,letters,questions};
})();

document.addEventListener('click', e=>{if(e.target.closest('[data-logout]')){e.preventDefault();JK.logout();}});
