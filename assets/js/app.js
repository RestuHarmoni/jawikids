const JK = (()=>{
  const KEY='jawikids_local_state_v100';
  const defaultState={parents:[],children:[],progress:[],quiz_results:[],achievements:[],notifications:[],support_tickets:[],ticket_messages:[],affiliate_interest:[],payments:[],settings:[],session:null};
  const letters=[['ا','Alif'],['ب','Ba'],['ت','Ta'],['ث','Tha'],['ج','Jim'],['ح','Ha'],['خ','Kha'],['د','Dal'],['ذ','Zal'],['ر','Ra'],['ز','Zai'],['س','Sin'],['ش','Syin'],['ص','Sod'],['ض','Dhod'],['ط','To'],['ظ','Zo'],['ع','Ain'],['غ','Ghain'],['ف','Fa'],['ق','Qaf'],['ك','Kaf'],['ل','Lam'],['م','Mim'],['ن','Nun'],['و','Wau'],['ه','Ha'],['ي','Ya']];
  function load(){try{return {...defaultState,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...defaultState}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
  function id(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
  function toast(msg){let t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}
  function currentParent(){const s=load();return s.parents.find(p=>p.id===s.session?.parentId)||null}
  function requireAuth(){if(!currentParent()){location.href='login.html';return null}return currentParent()}
  function logout(){const s=load();s.session=null;save(s);location.href='login.html'}
  function addXP(childId,xp,activity){const s=load();const c=s.children.find(x=>x.id===childId);if(!c)return;c.xp=(c.xp||0)+xp;c.level=Math.max(1,Math.floor(c.xp/100)+1);s.progress.push({id:id('prog'),child_id:childId,module:activity,progress:100,completed:true,updated_at:new Date().toISOString()});if(c.xp>=100&&!s.achievements.some(a=>a.child_id===childId&&a.badge==='Jawi Explorer'))s.achievements.push({id:id('ach'),child_id:childId,badge:'Jawi Explorer',xp_reward:20,unlocked_at:new Date().toISOString()});save(s)}
  return {load,save,id,toast,currentParent,requireAuth,logout,addXP,letters};
})();
