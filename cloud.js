/* Ритм — личная синхронизация с Supabase. Только публичный ключ в браузере. */
(() => {
  'use strict';
  const APP=window.RitmApp, $=s=>document.querySelector(s);
  const config=window.RITM_SUPABASE||{};
  const url=String(config.url||'').replace(/\/+$/,'');
  const key=String(config.publishableKey||'');
  const offlineLastKey='ritm_cloud_last_user';
  let api=null,user=null,uid=null,revision=0,booted=false,working=false,needsSync=false;
  let timer=null,authMode='login',conflict=null,migration=false,recovery=false,active=false;
  const scoped=(name)=>'ritm_cloud_'+name+'_'+uid;
  const saved=(name,fallback='')=>{try{return localStorage.getItem(name)||fallback;}catch{return fallback;}};
  const store=(name,value)=>{try{localStorage.setItem(name,String(value));}catch(e){console.warn('Local metadata:',e);}};
  function setState(kind,message) {
    const pills={synced:'Облако',saving:'Сохраняю',offline:'Офлайн',conflict:'Конфликт',error:'Ошибка',auth:'Войти',local:'Локально'};
    $('#cloud-pill').dataset.syncState=kind;
    $('#cloud-pill-label').textContent=pills[kind]||'Облако';
    $('#cloud-pill').title=message;
    $('#cloud-status-text').textContent=message;
    $('#cloud-modal-status').textContent=message;
    $('#cloud-last-sync').textContent=message;
  }
  function visible(id,show){const el=$(id);if(el)el.classList.toggle('hidden',!show);}
  function panel() {
    visible('#cloud-config-view',!api);
    visible('#cloud-auth-view',!!api&&!user&&!conflict&&!migration&&!recovery);
    visible('#cloud-user-view',!!api&&!!user&&!conflict&&!migration&&!recovery);
    visible('#cloud-conflict-view',!!conflict&&!recovery);
    visible('#cloud-migration-view',migration&&!recovery);
    visible('#cloud-reset-view',recovery);
    visible('#cloud-import-guest',APP.guestHasContent());
    $('#cloud-login-tab').classList.toggle('active',authMode==='login');
    $('#cloud-signup-tab').classList.toggle('active',authMode==='signup');
    $('#cloud-auth-submit').textContent=authMode==='login'?'Войти в аккаунт':'Создать аккаунт';
    $('#cloud-password').autocomplete=authMode==='login'?'current-password':'new-password';
    $('#cloud-url').value=url;$('#cloud-key').value=key;
    if(user)$('#cloud-user-email').textContent=user.email||'Аккаунт';
  }
  function open(){
    const settings=$('#settings-overlay');
    settings?.classList.remove('is-open');settings?.setAttribute('aria-hidden','true');
    $('#cloud-overlay').classList.add('is-open');
    $('#cloud-overlay').setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';panel();
  }
  function close(){
    $('#cloud-overlay').classList.remove('is-open');
    $('#cloud-overlay').setAttribute('aria-hidden','true');
    if(!document.querySelector('.modal-overlay.is-open'))document.body.style.overflow='';
  }
  function message(text,isError=false){
    $('#cloud-auth-message').textContent=text;
    $('#cloud-auth-message').classList.toggle('error',isError);
  }
  function errText(e) {
    const m=String(e?.message||e||'Ошибка');
    if(/invalid login/i.test(m))return 'Неверная почта или пароль.';
    if(/email not confirmed/i.test(m))return 'Подтверди почту через письмо.';
    if(/rate limit/i.test(m))return 'Слишком много попыток. Попробуй позже.';
    if(/network|fetch failed|failed to fetch|offline/i.test(m))return 'Нет соединения, локальная копия сохранена.';
    return m.slice(0,210);
  }
  function dirty(){return uid&&saved(scoped('pending'))==='1';}
  function setDirty(value){if(uid)store(scoped('pending'),value?'1':'0');}
  function setRev(value){revision=Number(value)||0;if(uid)store(scoped('revision'),revision);}
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function signOutLocal(){
    user=null;uid=null;active=false;working=false;conflict=null;migration=false;recovery=false;
    APP.switchScope(null);setState('auth','Войди для синхронизации');panel();
  }
  async function fetchRemote(){
    if(!navigator.onLine)throw new Error('offline');
    if(!user)throw new Error('Не авторизован');
    const {data,error}=await api.from('ritm_data').select('document,revision').eq('user_id',uid).maybeSingle();
    if(error)throw error;return data;
  }
  async function adopt(sessionUser){
    if(!sessionUser?.id)return;
    if(user?.id===sessionUser.id&&active)return;
    if(working)return;
    working=true;user=sessionUser;uid=sessionUser.id;
    store(offlineLastKey,uid);APP.switchScope(uid);
    setRev(saved(scoped('revision'),'0'));
    setState('saving','Проверяю облачные данные…');panel();
    try{
      const remote=await fetchRemote();
      if(!remote){
        if(APP.currentHasContent()){setDirty(true);active=true;await send();}
        else if(APP.guestHasContent()){migration=true;active=true;setState('auth','Найдены локальные дела для переноса');open();}
        else{setDirty(true);active=true;await send();}
      }else if(dirty()){
        if(same(APP.snapshot(),remote.document)){
          APP.replaceSnapshot(remote.document);setRev(remote.revision);setDirty(false);
          active=true;setState('synced','Синхронизировано с Supabase');
        }else if(revision!==remote.revision){
          conflict=remote;active=true;setState('conflict','Обнаружены изменения с другого устройства');open();
        }else{active=true;await send();}
      }else{
        APP.replaceSnapshot(remote.document);setRev(remote.revision);setDirty(false);
        active=true;setState('synced','Синхронизировано с Supabase');
      }
    }catch(e){setState(navigator.onLine?'error':'offline',errText(e));active=false;}
    finally{working=false;panel();}
  }
  async function send(){
    if(!user||conflict||migration)return;
    if(working&&!active)return;
    if(!navigator.onLine){setState('offline','Без интернета, изменения сохранены на устройстве');return;}
    if(needsSync)return;needsSync=true;
    const snapshot=APP.snapshot(),serialized=JSON.stringify(snapshot),expected=revision;
    setState('saving','Сохраняю изменения…');
    try{
      const {data,error}=await api.rpc('ritm_save_state',{p_expected_revision:expected,p_document:snapshot});
      if(error)throw error;
      if(!data?.ok){
        const remote=await fetchRemote();
        if(remote){conflict=remote;setState('conflict','Конфликт версий: выбери, какую сохранить');open();}
        else{setRev(0);setDirty(true);setState('error','Не удалось подтвердить сохранение');}
        return;
      }
      setRev(data.revision);
      if(JSON.stringify(APP.snapshot())===serialized){setDirty(false);setState('synced','Синхронизировано с Supabase');}
      else{setDirty(true);setState('saving','Сохраняю новые изменения…');}
    }catch(e){setDirty(true);setState(navigator.onLine?'error':'offline',errText(e));}
    finally{
      needsSync=false;
      if(dirty()&&!conflict&&navigator.onLine&&user&&!working){
        clearTimeout(timer);timer=setTimeout(()=>send(),1500);
      }
    }
  }
  function onLocalChange(){
    if(!uid)return;
    if(migration){migration=false;close();}
    setDirty(true);
    if(conflict){setState('conflict','Конфликт версий, требуется выбор');return;}
    setState(navigator.onLine?'saving':'offline',navigator.onLine?'Изменения ждут сохранения…':'Нет интернета, сохранено на устройстве');
    clearTimeout(timer);
    if(user&&!working)timer=setTimeout(()=>send(),1000);
  }
  async function sync(){
    if(!user){open();return;}
    if(conflict||migration){open();return;}
    if(needsSync||working)return;
    if(dirty())return send();
    setState('saving','Проверяю облачную версию…');
    try{
      const remote=await fetchRemote();
      if(dirty())return send();
      if(!remote){setDirty(true);return send();}
      if(Number(remote.revision)!==revision){
        APP.replaceSnapshot(remote.document);setRev(remote.revision);
      }
      setState('synced','Синхронизировано с Supabase');
    }catch(e){setState(navigator.onLine?'error':'offline',errText(e));}
  }
  async function chooseRemote(){
    if(!conflict)return;
    if(!confirm('Заменить локальную копию облачной? При необходимости сначала скачай резервную копию.'))return;
    APP.replaceSnapshot(conflict.document);setRev(conflict.revision);setDirty(false);
    conflict=null;setState('synced','Загружена облачная версия');close();panel();
  }
  async function chooseLocal(){
    if(!conflict)return;
    if(!confirm('Перезаписать облачную версию данными этого устройства?'))return;
    try{
      const remote=await fetchRemote();
      if(!remote){setState('error','Облачная версия недоступна');return;}
      if(remote.revision!==conflict.revision){conflict=remote;setState('conflict','Облако изменилось ещё раз. Подтверди выбор повторно.');return;}
      setRev(remote.revision);conflict=null;setDirty(true);await send();
      if(!dirty())close();
    }catch(e){setState('error',errText(e));}
    panel();
  }
  async function migrateGuest(){
    if(!APP.guestHasContent())return;
    APP.replaceSnapshot(APP.guestSnapshot());migration=false;setDirty(true);await send();
    if(!dirty())close();panel();
  }
  async function cleanStart(){
    APP.replaceSnapshot(APP.fresh());migration=false;setDirty(true);await send();
    if(!dirty())close();panel();
  }
  async function copyGuest(){
    if(!APP.guestHasContent())return;
    if(!confirm('Перенос гостевых дел заменит содержимое облака. Сначала можно скачать резервную копию. Продолжить?'))return;
    try{
      const remote=await fetchRemote();
      if((remote?.revision??0)!==revision){conflict=remote;setState('conflict','Конфликт версий');open();return;}
      APP.replaceSnapshot(APP.guestSnapshot());setDirty(true);await send();
    }catch(e){setState('error',errText(e));}
  }
  async function authSubmit(e){
    e.preventDefault();if(!api)return;
    const email=$('#cloud-email').value.trim(),password=$('#cloud-password').value;
    if(!email||password.length<8)return message('Укажи почту и пароль длиной от 8 символов.',true);
    const btn=$('#cloud-auth-submit');btn.disabled=true;message('Проверяю…');
    try{
      if(authMode==='signup'){
        const {data,error}=await api.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});
        if(error)throw error;
        message(data?.session?'Аккаунт создан. Подключаю…':'На почту отправлено письмо для подтверждения регистрации.');
        if(data?.session?.user)await adopt(data.session.user);
      }else{
        const {data,error}=await api.auth.signInWithPassword({email,password});
        if(error)throw error;
        await adopt(data.user);if(!conflict&&!migration)close();
      }
      $('#cloud-password').value='';
    }catch(e){message(errText(e),true);}
    finally{btn.disabled=false;}
  }
  async function action(name){
    switch(name){
      case 'open':open();break;
      case 'close':close();break;
      case 'login-mode':authMode='login';panel();message('');break;
      case 'signup-mode':authMode='signup';panel();message('');break;
      case 'sync-now':await sync();break;
      case 'download-local':APP.exportData();break;
      case 'use-remote':await chooseRemote();break;
      case 'use-local':await chooseLocal();break;
      case 'migrate-guest':await migrateGuest();break;
      case 'start-clean':await cleanStart();break;
      case 'copy-guest':await copyGuest();break;
      case 'logout':
        if(dirty()&&!confirm('Есть несинхронизированные изменения. Выйти?'))return;
        {const {error}=await api.auth.signOut();if(error){setState('error',errText(error));return;}signOutLocal();close();}break;
      case 'forgot-password':{
        const email=$('#cloud-email').value.trim();
        if(!email)return message('Сначала введи почту.',true);
        const {error}=await api.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
        message(error?errText(error):'Письмо для смены пароля отправлено.',!!error);break;
      }
      case 'edit-config':setState('synced','Подключено к личной базе Supabase');break;
    }
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-cloud-action]');
    if(el){e.preventDefault();action(el.dataset.cloudAction).catch(err=>setState('error',errText(err)));}
    else if(e.target===$('#cloud-overlay'))close();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#cloud-overlay').classList.contains('is-open'))close();});
  $('#cloud-auth-form').addEventListener('submit',authSubmit);
  $('#cloud-config-form').addEventListener('submit',e=>{e.preventDefault();setState('synced','Облачная база уже настроена');});
  $('#cloud-reset-form').addEventListener('submit',async e=>{
    e.preventDefault();
    const password=$('#cloud-new-password').value;
    if(password.length<8){$('#cloud-reset-message').textContent='Минимум 8 символов';return;}
    const {error}=await api.auth.updateUser({password});
    $('#cloud-reset-message').textContent=error?errText(error):'Пароль успешно изменён';
    if(!error){recovery=false;panel();}
  });
  window.addEventListener('online',()=>{if(!api)start();else if(user)sync();});
  window.addEventListener('offline',()=>{if(uid)setState('offline','Нет интернета, работа продолжается локально');});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&user&&active)sync();});
  setInterval(()=>{if(user&&active&&!document.hidden&&navigator.onLine)sync();},60000);
  window.RitmCloud={onLocalChange,syncNow:sync};
  async function start(){
    if(booted||!url||!key)return;booted=true;
    setState('saving','Подключаю Supabase…');
    try{
      if(!window.supabase?.createClient){
        await new Promise((resolve,reject)=>{
          const s=document.createElement('script');
          s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
          s.onload=resolve;s.onerror=()=>reject(new Error('Не удалось загрузить Supabase SDK'));
          document.head.appendChild(s);
        });
      }
      api=window.supabase.createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      api.auth.onAuthStateChange((event,session)=>{
        if(event==='SIGNED_OUT'){queueMicrotask(signOutLocal);return;}
        if(event==='PASSWORD_RECOVERY'){
          queueMicrotask(async()=>{if(session?.user)await adopt(session.user);recovery=true;open();});return;
        }
        if(session?.user&&['INITIAL_SESSION','SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event)){
          queueMicrotask(()=>adopt(session.user));
        }
      });
      const {data,error}=await api.auth.getSession();if(error)throw error;
      if(data?.session?.user)await adopt(data.session.user);
      else{setState('auth','Войди для синхронизации');panel();}
    }catch(e){booted=false;setState(navigator.onLine?'error':'offline',errText(e));}
  }
  const cached=saved(offlineLastKey);
  if(!navigator.onLine&&/^[\da-f]{8}-[\da-f-]{27,}$/i.test(cached)){
    uid=cached;APP.switchScope(uid);setRev(saved(scoped('revision'),'0'));
    setState('offline','Офлайн: локальная копия аккаунта');
  }
  start();
})();