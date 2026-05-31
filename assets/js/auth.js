document.addEventListener('DOMContentLoaded',()=>{
  const loginForm=document.querySelector('#loginForm');
  const registerForm=document.querySelector('#registerForm');
  const forgotForm=document.querySelector('#forgotForm');

  async function getOrCreateParentFromSupabase(user, fallback={}){
    if(!window.jawikidsSupabase || !user) return null;
    const email=(user.email || fallback.email || '').toLowerCase();
    const meta=user.user_metadata || {};
    const profile={
      auth_user_id:user.id,
      email,
      full_name:fallback.full_name || meta.full_name || email.split('@')[0] || 'Parent',
      phone:fallback.phone || meta.phone || '',
      package:'TRIAL',
      status:'active',
      last_login:new Date().toISOString()
    };

    let {data: parent, error: selectError}=await jawikidsSupabase
      .from('parents')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if(selectError) console.warn('Parent select warning:', selectError.message);

    if(!parent){
      const {data: inserted, error: insertError}=await jawikidsSupabase
        .from('parents')
        .insert(profile)
        .select('*')
        .single();

      if(insertError){
        console.warn('Parent insert warning:', insertError.message);
        const byEmail=await jawikidsSupabase
          .from('parents')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        parent=byEmail.data || null;
      }else{
        parent=inserted;
      }
    }else{
      await jawikidsSupabase
        .from('parents')
        .update({last_login:new Date().toISOString()})
        .eq('id', parent.id);
    }
    return parent;
  }

  function syncLocalParent(parent, email){
    const s=JK.load();
    let p=s.parents.find(x=>x.id===parent?.id) || s.parents.find(x=>x.email===(parent?.email||email));
    if(parent){
      const mapped={
        id:parent.id,
        auth_user_id:parent.auth_user_id,
        email:parent.email,
        full_name:parent.full_name || 'Parent',
        phone:parent.phone || '',
        package:parent.package || 'TRIAL',
        status:parent.status || 'active',
        created_at:parent.created_at || new Date().toISOString(),
        last_login:new Date().toISOString()
      };
      if(p) Object.assign(p,mapped); else {p=mapped;s.parents.push(p);}
    }
    if(p){
      s.session={parentId:p.id,email:p.email,loggedAt:new Date().toISOString()};
      p.last_login=new Date().toISOString();
      JK.save(s);
    }
    return p;
  }

  if(loginForm) loginForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const email=loginForm.email.value.trim().toLowerCase();
    const password=loginForm.password.value;

    if(email==='demo@jawikids.com' && password==='demo12345'){
      const s=JK.load();
      let p=s.parents.find(x=>x.email===email);
      if(!p){
        p={id:JK.id('parent'),email,full_name:'Demo Parent',phone:'',package:'TRIAL',status:'active',created_at:new Date().toISOString()};
        s.parents.push(p);
        s.children.push({id:JK.id('child'),parent_id:p.id,full_name:'Ali',gender:'Lelaki',birth_year:2018,avatar:'👦',level:1,xp:35,created_at:new Date().toISOString()});
        s.notifications.push({id:JK.id('noti'),parent_id:p.id,type:'SYSTEM',title:'Akaun Demo Aktif',message:'Ini data demo untuk mencuba JawiKids.',is_read:false,created_at:new Date().toISOString()});
      }
      s.session={parentId:p.id,email:p.email,loggedAt:new Date().toISOString()};
      p.last_login=new Date().toISOString();
      JK.save(s);
      location.href='dashboard.html';
      return;
    }

    if(window.jawikidsSupabase){
      const {data,error}=await jawikidsSupabase.auth.signInWithPassword({email,password});
      if(error) return JK.toast(error.message);
      const parent=await getOrCreateParentFromSupabase(data.user,{email});
      const localParent=syncLocalParent(parent,email);
      if(!localParent) return JK.toast('Login berjaya tetapi profil parent gagal dibuat. Semak RLS parents/auth_user_id.');
      location.href='dashboard.html';
      return;
    }

    const s=JK.load();
    let p=s.parents.find(x=>x.email===email);
    if(!p) return JK.toast('Akaun tidak dijumpai. Daftar dahulu atau guna demo@jawikids.com / demo12345');
    s.session={parentId:p.id,email:p.email,loggedAt:new Date().toISOString()};
    p.last_login=new Date().toISOString();
    JK.save(s);
    location.href='dashboard.html';
  });

  if(registerForm) registerForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const full_name=registerForm.full_name.value.trim();
    const email=registerForm.email.value.trim().toLowerCase();
    const phone=registerForm.phone.value.trim();
    const password=registerForm.password.value;
    if(password.length<8) return JK.toast('Password minimum 8 aksara.');

    if(window.jawikidsSupabase){
      const {data,error}=await jawikidsSupabase.auth.signUp({email,password,options:{data:{full_name,phone}}});
      if(error) return JK.toast(error.message);
      if(data?.session && data?.user){
        const parent=await getOrCreateParentFromSupabase(data.user,{email,full_name,phone});
        syncLocalParent(parent,email);
        location.href='children.html';
      }else{
        JK.toast('Pendaftaran berjaya. Sila semak email untuk pengesahan, kemudian login.');
        setTimeout(()=>{location.href='login.html';},1800);
      }
      return;
    }

    const s=JK.load();
    if(s.parents.some(p=>p.email===email)) return JK.toast('Email sudah didaftarkan.');
    const p={id:JK.id('parent'),email,full_name,phone,package:'TRIAL',status:'active',created_at:new Date().toISOString(),last_login:new Date().toISOString()};
    s.parents.push(p);
    s.session={parentId:p.id,email:p.email,loggedAt:new Date().toISOString()};
    s.notifications.push({id:JK.id('noti'),parent_id:p.id,type:'SYSTEM',title:'Selamat Datang ke JawiKids',message:'Akaun parent berjaya didaftarkan.',is_read:false,created_at:new Date().toISOString()});
    JK.save(s);
    location.href='children.html';
  });

  if(forgotForm) forgotForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const email=forgotForm.email.value.trim().toLowerCase();
    if(window.jawikidsSupabase){
      await jawikidsSupabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/login.html'});
    }
    JK.toast('Jika email wujud, link reset password akan dihantar.');
  });
});
