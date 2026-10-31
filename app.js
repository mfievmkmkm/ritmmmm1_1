(() => {
  'use strict';
  const STORE = 'ritm_personal_v2';
  const OLD_STORE = 'ritm_week_planner_v1';
  const WEEKDAYS = ['пн','вт','ср','чт','пт','сб','вс'];
  const WEEKDAYS_LONG = ['понедельник','вторник','среда','четверг','пятница','суббота','воскресенье'];
  const CAT = {personal:['Личное','heart'],study:['Учёба','book'],health:['Здоровье','activity'],work:['Работа','briefcase'],other:['Другое','layers']};
  const ICONS = {
    'check-double':'<path d="m3.5 12 4 4 7-8"/><path d="m11 15 3 3 7-9"/>',
    'check':'<path d="m5 12 4 4L19 6"/>',
    'plus':'<path d="M12 5v14M5 12h14"/>',
    'x':'<path d="M18 6 6 18M6 6l12 12"/>',
    'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    'repeat':'<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    'chart':'<path d="M4 20V12m5 8V7m5 13v-4m5 4V4"/>',
    'settings':'<path d="M12 3.3v2m0 13.4v2M3.3 12h2m13.4 0h2M5.8 5.8l1.5 1.5m9.4 9.4 1.5 1.5M5.8 18.2l1.5-1.5m9.4-9.4 1.5-1.5"/><circle cx="12" cy="12" r="4"/>',
    'chevron-left':'<path d="m15 18-6-6 6-6"/>',
    'chevron-right':'<path d="m9 18 6-6-6-6"/>',
    'arrow-right':'<path d="M4 12h16m-7-7 7 7-7 7"/>',
    'arrow-up-right':'<path d="M6 18 18 6M8 6h10v10"/>',
    'more':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'heart':'<path d="M20.8 8.6c0 4.4-8.8 10.4-8.8 10.4S3.2 13 3.2 8.6A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.2Z"/>',
    'book':'<path d="M12 7a7 7 0 0 0-9-2v14a7 7 0 0 1 9 2m0-14a7 7 0 0 1 9-2v14a7 7 0 0 0-9 2M12 7v14"/>',
    'activity':'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    'briefcase':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    'layers':'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
    'lock':'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    'sparkles':'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/>',
    'lightbulb':'<path d="M9 18h6m-5 3h4M7 14a7 7 0 1 1 10 0c-1.5 1.2-2 2-2 4H9c0-2-1-3-2-4Z"/>',
    'shield-check':'<path d="M12 2 4 5v6c0 5 3.2 8.5 8 11 4.8-2.5 8-6 8-11V5l-8-3Z"/><path d="m8 12 3 3 5-6"/>',
    'download':'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
    'upload':'<path d="M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4"/>',
    'edit':'<path d="m4 20 4-.7 11.3-11.3a2 2 0 0 0-2.8-2.8L5.2 16.5 4 20Z"/>',
    'archive':'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v12h14V9M10 13h4"/>',
    'trash':'<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
    'skip':'<path d="m5 4 14 8-14 8V4Zm14 0v16"/>',
    'undo':'<path d="M9 14 4 9l5-5M4 9h10a6 6 0 1 1 0 12h-2"/>',
    'moon':'<path d="M20 14.1A8.5 8.5 0 0 1 9.9 4 8.5 8.5 0 1 0 20 14.1Z"/>',
    'flame':'<path d="M12 22c-5 0-8-3.1-8-7.3 0-4.6 3-6 4-10 3 1.8 4 4 4 5.2 2-1.4 3.5-3.4 3-6.2 4 2.8 5 6.1 5 10.5 0 4.5-3 7.8-8 7.8Z"/>',
    'circle-check':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'
  };
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;
  function hydrateIcons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
  const pad = n => String(n).padStart(2,'0');
  const toKey = date => `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const fromKey = key => {const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d,12);};
  const isDate = s => {if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=fromKey(s);return !Number.isNaN(d.getTime())&&toKey(d)===s&&d.getFullYear()>=2000&&d.getFullYear()<=2100;};
  const addDays = (date,n) => {const d=new Date(date);d.setDate(d.getDate()+n);return d;};
  const startWeek = d => addDays(d,-((d.getDay()+6)%7));
  const weekDay = key => (fromKey(key).getDay()+6)%7;
  const dateText = (key, options={day:'numeric',month:'long'}) => new Intl.DateTimeFormat('ru-RU',options).format(fromKey(key));
  const plural = (n,a,b,c) => {const x=Math.abs(n)%100,y=x%10;return x>10&&x<20?c:y===1?a:y>=2&&y<=4?b:c;};
  const uid = () => (globalThis.crypto && crypto.randomUUID)?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
  const fresh = () => ({version:2,tasks:[],completed:{},skipped:{},notes:{},settings:{eveningTime:'21:00'}});
  const validTime = s => typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  const safeString = (v,max) => typeof v==='string'?v.slice(0,max):'';
  const validId = id => typeof id==='string'&&id.length>0&&id.length<130;
  function cleanMap(map, maxText=null){
    const output={};if(!map||typeof map!=='object'||Array.isArray(map))return output;
    for(const [date,values] of Object.entries(map).slice(0,4000)){
      if(!isDate(date))continue;
      if(maxText!==null){if(typeof values==='string')output[date]=values.slice(0,maxText);continue;}
      if(!values||typeof values!=='object'||Array.isArray(values))continue;
      const entries=Object.entries(values).filter(([id,v])=>validId(id)&&v===true).slice(0,10000);
      if(entries.length)output[date]=Object.fromEntries(entries);
    }
    return output;
  }
  function normalize(input){
    if(!input||typeof input!=='object'||Array.isArray(input)||input.version!==2||!Array.isArray(input.tasks)||input.tasks.length>5000)throw new Error('Неизвестный формат резервной копии');
    const d=fresh(),seen=new Set();
    for(const raw of input.tasks){
      if(!raw||!validId(raw.id)||seen.has(raw.id)||typeof raw.title!=='string'||!raw.title.trim()||raw.title.length>120)throw new Error('Некорректное дело в файле');
      if(!['repeat','once'].includes(raw.kind))throw new Error('Некорректный тип дела');
      seen.add(raw.id);
      const t={id:raw.id,title:raw.title.trim(),detail:safeString(raw.detail,250),time:validTime(raw.time)?raw.time:'',category:CAT[raw.category]?raw.category:'personal',kind:raw.kind,createdAt:typeof raw.createdAt==='string'?raw.createdAt:''};
      if(t.kind==='once'){
        if(!isDate(raw.date))throw new Error('Неверная дата дела');t.date=raw.date;
      }else{
        if(!['daily','weekdays','custom'].includes(raw.repeat)||!isDate(raw.startDate))throw new Error('Неверное расписание привычки');
        t.repeat=raw.repeat;t.startDate=raw.startDate;
        t.days=raw.repeat==='custom'&&Array.isArray(raw.days)?[...new Set(raw.days.filter(x=>Number.isInteger(x)&&x>=0&&x<=6))].sort():[];
        if(t.repeat==='custom'&&!t.days.length)throw new Error('У привычки не выбраны дни');
        t.archivedAt=isDate(raw.archivedAt)?raw.archivedAt:null;
      }
      d.tasks.push(t);
    }
    d.completed=cleanMap(input.completed);d.skipped=cleanMap(input.skipped);d.notes=cleanMap(input.notes,4000);
    if(input.settings&&validTime(input.settings.eveningTime))d.settings.eveningTime=input.settings.eveningTime;
    return d;
  }
  function migrateOld(old){
    if(!old||old.version!==1||!Array.isArray(old.tasks))return null;
    const d=fresh();
    for(const raw of old.tasks){
      if(!raw||!validId(raw.id)||typeof raw.title!=='string'||!isDate(raw.startDate))continue;
      const base={id:raw.id,title:raw.title.slice(0,120),detail:'',time:'',category:'personal',createdAt:''};
      if(raw.mode==='once'&&isDate(raw.onceDate))d.tasks.push({...base,kind:'once',date:raw.onceDate});
      else if(raw.mode==='daily')d.tasks.push({...base,kind:'repeat',repeat:'daily',days:[],startDate:raw.startDate,archivedAt:isDate(raw.endDate)?raw.endDate:null});
      else if(raw.mode==='weekly'&&Array.isArray(raw.days)&&raw.days.length)d.tasks.push({...base,kind:'repeat',repeat:'custom',days:raw.days,startDate:raw.startDate,archivedAt:isDate(raw.endDate)?raw.endDate:null});
    }
    d.completed=cleanMap(old.done);
    return normalize(d);
  }
  let storageOK=true;
  function load(){
    try{
      const raw=localStorage.getItem(STORE);
      if(raw)return normalize(JSON.parse(raw));
      const old=localStorage.getItem(OLD_STORE);
      if(old){const migrated=migrateOld(JSON.parse(old));if(migrated){localStorage.setItem(STORE,JSON.stringify(migrated));return migrated;}}
    }catch(err){console.warn('Не удалось прочитать сохранённые данные:',err);if(err.name==='QuotaExceededError'||err.name==='SecurityError')storageOK=false;}
    return fresh();
  }
  let currentStore=STORE;
  let data=load();
  let state={view:'day',selected:toKey(new Date()),week:startWeek(new Date()),month:new Date(new Date().getFullYear(),new Date().getMonth(),1,12),habitFilter:'active',editId:null,taskMode:'once',openMenu:null,customDays:new Set([weekDay(toKey(new Date()))])};
  let nowDay=toKey(new Date()),toastTimer;
  function save(quietCloud=false){try{localStorage.setItem(currentStore,JSON.stringify(data));storageOK=true;$('#storage-alert').classList.add('hidden');if(!quietCloud&&window.RitmCloud)window.RitmCloud.onLocalChange();return true;}catch(err){console.error(err);storageOK=false;$('#storage-alert').classList.remove('hidden');toast('Не удалось сохранить данные. Сделай резервную копию.');return false;}}

  function hasContent(doc){return !!(doc.tasks.length||Object.keys(doc.notes).length||Object.keys(doc.completed).length||Object.keys(doc.skipped).length);}
  function loadScoped(key){try{const raw=localStorage.getItem(key);return raw?normalize(JSON.parse(raw)):fresh();}catch(e){console.warn('Кэш:',e);return fresh();}}
  function switchScope(userId){
    currentStore=userId?'ritm_cloud_cache_'+userId:STORE;
    data=userId?loadScoped(currentStore):load();
    state.openMenu=null;render();
  }
  function replaceSnapshot(next){
    data=normalize(next);save(true);state.openMenu=null;render();
  }
  window.RitmApp={
    snapshot:()=>JSON.parse(JSON.stringify(data)),
    guestSnapshot:()=>load(),
    guestHasContent:()=>hasContent(load()),
    currentHasContent:()=>hasContent(data),
    switchScope,
    replaceSnapshot,
    exportData:()=>exportData(),
    fresh
  };
  function toast(message){const target=$('#toast');target.textContent=message;target.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>target.classList.remove('visible'),3000);}
  function taskApplies(t,date){
    if(t.kind==='once')return t.date===date;
    if(date<t.startDate||(t.archivedAt&&date>=t.archivedAt))return false;
    const day=weekDay(date);
    return t.repeat==='daily'||(t.repeat==='weekdays'&&day<=4)||(t.repeat==='custom'&&t.days.includes(day));
  }
  function tasksFor(date){return data.tasks.filter(t=>taskApplies(t,date)).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')||a.title.localeCompare(b.title,'ru'));}
  function hasFlag(map,date,id){return !!map[date]?.[id];}
  function dateScore(date){const list=tasksFor(date);const skipped=list.filter(t=>hasFlag(data.skipped,date,t.id)).length;const done=list.filter(t=>hasFlag(data.completed,date,t.id)&&!hasFlag(data.skipped,date,t.id)).length;const eligible=list.length-skipped;return {total:eligible,all:list.length,done,skipped,left:eligible-done,pct:eligible?Math.round(100*done/eligible):0};}
  function datesInWeek(week){return Array.from({length:7},(_,i)=>toKey(addDays(week,i)));}
  const scopeWord = (t) => t.kind==='once'?'Разовое дело':t.repeat==='daily'?'Каждый день':t.repeat==='weekdays'?'Пн–пт':t.days.map(d=>WEEKDAYS[d]).join(' · ');
  function flag(map,date,id,value){if(!map[date])map[date]={};if(value)map[date][id]=true;else delete map[date][id];if(!Object.keys(map[date]).length)delete map[date];}
  function markDone(id,date){const t=data.tasks.find(x=>x.id===id);if(!t||!taskApplies(t,date))return;const next=!hasFlag(data.completed,date,id);flag(data.completed,date,id,next);if(next)flag(data.skipped,date,id,false);save();state.openMenu=null;render();if(next&&dateScore(date).left===0&&dateScore(date).total>0)toast('Все дела на день выполнены. Отлично!');}
  function skipOnDay(id,date){const t=data.tasks.find(x=>x.id===id);if(!t||t.kind!=='repeat'||!taskApplies(t,date))return;const next=!hasFlag(data.skipped,date,id);flag(data.skipped,date,id,next);if(next)flag(data.completed,date,id,false);save();state.openMenu=null;render();toast(next?'Пропущено только в этот день':'Пропуск отменён');}
  function selectDate(date,changeView=false){if(!isDate(date))return;state.selected=date;state.week=startWeek(fromKey(date));if(changeView)state.view='day';state.openMenu=null;render();if(changeView)window.scrollTo({top:0,behavior:'smooth'});}
  function navigateWeek(direction){state.week=addDays(state.week,direction*7);if(state.view==='day')state.selected=toKey(addDays(fromKey(state.selected),direction*7));state.openMenu=null;render();}
  function changeView(next){if(!['day','week','month','habits','stats'].includes(next))return;state.view=next;state.openMenu=null;render();window.scrollTo({top:0,behavior:'smooth'});}
  function renderChrome(){
    $$('.view').forEach(el=>el.classList.toggle('is-visible',el.id==='view-'+state.view));
    $$('[data-view]').forEach(btn=>{const active=btn.dataset.view===state.view;btn.classList.toggle('is-active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});
    $('#hero').classList.toggle('hidden',state.view!=='day');
  }
  function renderWeekStrip(){
    const days=datesInWeek(state.week),end=days[6];
    $('#week-range').textContent=`${dateText(days[0])} — ${dateText(end)}${fromKey(days[0]).getFullYear()===fromKey(end).getFullYear()?' '+fromKey(end).getFullYear():''}`;
    $('#week-days').innerHTML=days.map((date,i)=>{const s=dateScore(date);return `<button type="button" class="day-cell ${date===state.selected?'is-selected':''} ${date===nowDay?'is-today':''}" data-action="date" data-date="${date}" aria-pressed="${date===state.selected}" aria-label="${dateText(date,{weekday:'long',day:'numeric',month:'long'})}: ${s.done} из ${s.total}"><span class="day-short">${WEEKDAYS[i]}</span><span class="day-number">${fromKey(date).getDate()}</span><span class="day-track"><i style="width:${s.pct}%"></i></span><span class="day-ratio">${s.done}/${s.total}</span></button>`;}).join('');
  }
  function taskHTML(t,date,status){
    const done=status==='done',skipped=status==='skip';const category=CAT[t.category]||CAT.personal;
    let menu='';if(state.openMenu===t.id){
      menu=`<div class="task-menu" role="menu"><button type="button" data-action="edit-task" data-id="${esc(t.id)}">${icon('edit')} Изменить</button>${t.kind==='repeat'?`<button type="button" data-action="skip-task" data-id="${esc(t.id)}">${icon(skipped?'undo':'skip')} ${skipped?'Вернуть на день':'Пропустить этот день'}</button><button type="button" data-action="archive-task" data-id="${esc(t.id)}">${icon('archive')} Убрать из будущего</button>`:`<button type="button" class="is-danger" data-action="delete-task" data-id="${esc(t.id)}">${icon('trash')} Удалить дело</button>`}</div>`;
    }
    return `<div class="task-row ${done?'is-completed':''} ${skipped?'is-skipped':''}"><button type="button" class="task-checkbox ${done?'is-on':''}" data-action="toggle-task" data-id="${esc(t.id)}" aria-pressed="${done}" aria-label="${done?'Снять отметку':'Отметить выполненным'}: ${esc(t.title)}">${icon('check')}</button><div class="task-info"><div class="task-name">${esc(t.title)}${skipped?' · пропущено':''}</div><div class="task-meta"><span>${icon(category[1])} ${esc(category[0])}</span>${t.time?`<span>${icon('clock')} ${esc(t.time)}</span>`:''}<span>${icon(t.kind==='repeat'?'repeat':'calendar')} ${esc(scopeWord(t))}</span>${t.detail?`<span title="${esc(t.detail)}">${esc(t.detail)}</span>`:''}</div></div><div class="task-menu-holder"><button type="button" class="task-menu-button" aria-haspopup="menu" aria-expanded="${state.openMenu===t.id}" data-action="menu" data-id="${esc(t.id)}" aria-label="Действия с делом ${esc(t.title)}">${icon('more')}</button>${menu}</div></div>`;
  }
  function emptyHTML(){return `<div class="empty-state"><div class="empty-illustration">${icon('calendar-days')}</div><b>Пока нет запланированных дел</b><p>Добавь первое дело или выбери одну из идей:</p><div class="empty-preset"><button type="button" class="preset-chip" data-action="preset" data-preset="read">+ Читать каждый день</button><button type="button" class="preset-chip" data-action="preset" data-preset="sport">+ Зарядка</button><button type="button" class="preset-chip" data-action="preset" data-preset="review">+ Итоги дня</button></div></div>`;}
  function renderDay(){
    renderWeekStrip();
    const s=dateScore(state.selected),list=tasksFor(state.selected),pending=list.filter(t=>!hasFlag(data.completed,state.selected,t.id)&&!hasFlag(data.skipped,state.selected,t.id)),done=list.filter(t=>hasFlag(data.completed,state.selected,t.id)&&!hasFlag(data.skipped,state.selected,t.id)),skipped=list.filter(t=>hasFlag(data.skipped,state.selected,t.id));
    $('#day-date-label').textContent=dateText(state.selected,{weekday:'long',day:'numeric',month:'long'}).toUpperCase();
    $('#day-heading').textContent=state.selected===nowDay?'Дела на сегодня':'План на день';
    const [h,m]=(data.settings.eveningTime||'21:00').split(':').map(Number);
    const evening=state.selected===nowDay&&(new Date().getHours()*60+new Date().getMinutes()>=h*60+m);
    $('#day-message').textContent=evening&&s.left?'Вечерний обзор: отметь, что успел сделать.':s.all&&s.left===0?(s.total?'Все запланированное выполнено!':'На сегодня всё спокойно.'):'Твой список на этот день';
    $('#task-count-tag').textContent=`${s.all} ${plural(s.all,'дело','дела','дел')}`;
    let html='';if(!list.length)html=emptyHTML();
    if(pending.length)html+=`<div class="task-group"><div class="task-group-heading">НУЖНО СДЕЛАТЬ <span class="group-count">${pending.length}</span></div>${pending.map(t=>taskHTML(t,state.selected,'pending')).join('')}</div>`;
    if(done.length)html+=`<div class="task-group"><div class="task-group-heading">ВЫПОЛНЕНО <span class="group-count">${done.length}</span></div>${done.map(t=>taskHTML(t,state.selected,'done')).join('')}</div>`;
    if(skipped.length)html+=`<div class="task-group"><div class="task-group-heading">ПРОПУЩЕНО <span class="group-count">${skipped.length}</span></div>${skipped.map(t=>taskHTML(t,state.selected,'skip')).join('')}</div>`;
    $('#daily-tasks').innerHTML=html;
    $('#big-progress').textContent=`${s.pct}%`;
    $('#progress-caption').textContent=s.total?(s.left?'Каждая отметка имеет значение':'Все дела выполнены!'):(s.skipped?'Все дела пропущены':'Добавь первое дело');
    $('#progress-fill').style.width=`${s.pct}%`;
    $('#progress-ring').style.setProperty('--pct',s.pct);
    $('#done-caption').textContent=`${s.done} выполнено`;$('#left-caption').textContent=`${s.left} осталось`;
    const week=datesInWeek(state.week),summary=week.map(date=>dateScore(date));
    const total=summary.reduce((a,s)=>a+s.total,0),completed=summary.reduce((a,s)=>a+s.done,0);
    $('#week-summary').textContent=`${completed} из ${total} выполнено`;
    $('#weekly-bars').innerHTML=summary.map((v,i)=>`<div class="weekly-bar-row"><span>${WEEKDAYS[i]}</span><div class="bar"><i style="width:${v.pct}%"></i></div><small>${v.done}/${v.total}</small></div>`).join('');
    $('#journal-input').value=data.notes[state.selected]||'';
    $('#journal-status').textContent=data.notes[state.selected]?'Есть запись':'Личный дневник';
    $('#journal-saved').textContent='Сохраняется автоматически';
  }
  function renderWeekOverview(){
    const dates=datesInWeek(state.week),stats=dates.map(x=>dateScore(x));
    $('#week-overview-range').textContent=`${dateText(dates[0])} — ${dateText(dates[6])}`;
    const total=stats.reduce((v,s)=>v+s.total,0),done=stats.reduce((v,s)=>v+s.done,0),days=stats.filter(s=>s.total>0&&s.left===0).length;
    $('#week-summary-cards').innerHTML=`<div class="summary-card"><div class="subhead">ПО ПЛАНУ</div><div class="number">${total}</div><div class="minor">${plural(total,'дело','дела','дел')} за неделю</div></div><div class="summary-card"><div class="subhead">ВЫПОЛНЕНО</div><div class="number">${done}</div><div class="minor">из ${total} назначенных</div></div><div class="summary-card"><div class="subhead">ГОТОВО НА 100%</div><div class="number">${days}</div><div class="minor">из 7 дней</div></div>`;
    $('#week-cards').innerHTML=dates.map((date,i)=>{const s=stats[i],ts=tasksFor(date);return `<article class="week-card ${date===nowDay?'is-today':''}"><div class="week-card-head"><div><div class="subhead">${WEEKDAYS_LONG[i].toUpperCase()} ${date===nowDay?'· СЕГОДНЯ':''}</div><h3>${dateText(date)} <small>· ${s.all} ${plural(s.all,'дело','дела','дел')}</small></h3></div><span class="week-card-ratio">${s.done}/${s.total}</span></div>${ts.slice(0,4).map(t=>`<div class="week-card-task ${hasFlag(data.completed,date,t.id)?'done':''}"><span class="dot"></span><span class="wc-title">${esc(t.title)}</span></div>`).join('')}${ts.length>4?`<div class="under-heading">и ещё ${ts.length-4}…</div>`:''}${!ts.length?'<p class="under-heading">Свободный день — можно запланировать что-то хорошее.</p>':''}<div class="week-card-foot"><div class="progress-track" style="width:62%;margin:0;height:5px"><div class="progress-fill" style="width:${s.pct}%"></div></div><button class="text-link" data-action="open-day" data-date="${date}">Открыть день →</button></div></article>`;}).join('');
  }
  function renderMonth(){
    const y=state.month.getFullYear(),m=state.month.getMonth(),first=startWeek(new Date(y,m,1,12)),last=new Date(y,m+1,0,12);
    const days=Math.ceil((((new Date(y,m,1,12).getDay()+6)%7)+last.getDate())/7)*7;
    $('#calendar-title').textContent=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(state.month);
    let html=WEEKDAYS.map(name=>`<div class="calendar-dow">${name}</div>`).join('');
    for(let i=0;i<days;i++){const date=toKey(addDays(first,i)),s=dateScore(date),other=fromKey(date).getMonth()!==m;
      html+=`<button type="button" data-action="select-calendar-date" data-date="${date}" class="calendar-cell ${other?'other-month':''} ${date===state.selected?'selected':''} ${date===nowDay?'today':''} ${s.total&&s.left===0?'completed-all':''}" aria-label="${dateText(date,{day:'numeric',month:'long'})}, выполнено ${s.done} из ${s.total}"><span class="calendar-num">${fromKey(date).getDate()}</span><span class="calendar-cell-bottom"><span class="calendar-track"><i style="width:${s.pct}%"></i></span><small>${s.total?`${s.done}/${s.total}`:'—'}</small></span></button>`;
    }
    $('#calendar-grid').innerHTML=html;
    const s=dateScore(state.selected);
    $('#calendar-selected-date').textContent=dateText(state.selected,{weekday:'long',day:'numeric',month:'long'});
    $('#calendar-selected-info').textContent=s.all?`${s.done} из ${s.total} выполнено${s.skipped?`; пропущено: ${s.skipped}`:''}`:'В этот день нет задач';
  }
  function renderHabits(){
    const habits=data.tasks.filter(t=>t.kind==='repeat'),active=habits.filter(t=>!t.archivedAt),archived=habits.filter(t=>!!t.archivedAt);
    $('#habit-summary').innerHTML=`<div><div class="habit-num">${active.length}</div><p>активных ${plural(active.length,'привычка','привычки','привычек')}</p></div><div><div class="habit-num">${habits.length}</div><p>всего создано за всё время</p></div>`;
    $$('[data-habit-filter]').forEach(b=>b.classList.toggle('active',b.dataset.habitFilter===state.habitFilter));
    const list=state.habitFilter==='active'?active:archived;
    $('#habit-list').innerHTML=list.length?list.map(t=>{const c=CAT[t.category]||CAT.personal;return `<article class="habit-card"><div class="habit-card-head"><div class="habit-card-icon">${icon(c[1])}</div><div><h3>${esc(t.title)}</h3><div class="secondary">${esc(scopeWord(t))}${t.time?' · '+esc(t.time):''}</div></div></div><div class="habit-card-actions">${state.habitFilter==='active'?`<button data-action="edit-task" data-id="${esc(t.id)}">Изменить</button><button class="archive-action" data-action="archive-task" data-id="${esc(t.id)}">В архив</button>`:`<button data-action="restore-habit" data-id="${esc(t.id)}">${icon('undo')} Возобновить с сегодня</button>`}</div></article>`;}).join(''):`<div class="panel" style="grid-column:1/-1">${state.habitFilter==='active'?'<h3>Пока нет привычек</h3><p class="under-heading">Нажми «Новая привычка», выбери дни недели и она появится в каждом нужном дне.</p>':'<h3>Архив пуст</h3><p class="under-heading">Здесь появятся завершённые привычки.</p>'}</div>`;
  }
  function rangeDays(count,end=fromKey(nowDay)){return Array.from({length:count},(_,i)=>toKey(addDays(end,i-count+1)));}
  function consecutiveDays(){let end=fromKey(nowDay);let score=dateScore(nowDay);if(score.total===0||score.left>0)end=addDays(end,-1);let streak=0;for(let i=0;i<730;i++){const s=dateScore(toKey(end));if(s.total===0||s.left!==0)break;streak++;end=addDays(end,-1);}return streak;}
  function renderStats(){
    const days30=rangeDays(30),scores=days30.map(dateScore),total=scores.reduce((a,s)=>a+s.total,0),done=scores.reduce((a,s)=>a+s.done,0),streak=consecutiveDays(),daysComplete=scores.filter(s=>s.total>0&&s.left===0).length;
    $('#stats-highlights').innerHTML=`<div class="summary-card"><div class="subhead">30 ДНЕЙ</div><div class="number">${total?Math.round(done/total*100):0}%</div><div class="minor">${done} из ${total} дел</div></div><div class="summary-card"><div class="subhead">СЕРИЯ</div><div class="number">${streak}</div><div class="minor">${plural(streak,'день','дня','дней')} подряд</div></div><div class="summary-card"><div class="subhead">УДАЧНЫЕ ДНИ</div><div class="number">${daysComplete}</div><div class="minor">полностью выполнено</div></div>`;
    $('#stats-chart').innerHTML=rangeDays(14).map(date=>{const s=dateScore(date),height=s.total?Math.max(10,Math.round(Math.min(s.total,10)/10*150)):4;return `<div class="chart-day" title="${esc(dateText(date))}: ${s.done}/${s.total}"><div class="chart-bar-holder"><div class="chart-bar" style="height:${height}px"><span style="height:${s.pct}%"></span></div></div><span class="chart-label">${fromKey(date).getDate()}</span></div>`;}).join('');
    $('#activity-grid').innerHTML=rangeDays(35).map(date=>{const s=dateScore(date),lvl=!s.total?0:s.pct===100?4:s.pct>=70?3:s.pct>=35?2:1;return `<div title="${esc(dateText(date))}: ${s.done}/${s.total}" class="activity-square a${lvl}">${fromKey(date).getDate()}</div>`;}).join('');
    $('#stats-hint').textContent=total?`За последние 30 дней: ${done} выполненных ${plural(done,'дело','дела','дел')}. Пропущенные задачи не входят в процент выполнения.`:'Добавь дела, и здесь появится твой настоящий прогресс. Дни без задач не считаются успешными.';
  }
  function render(){renderChrome();if(state.view==='day')renderDay();else if(state.view==='week')renderWeekOverview();else if(state.view==='month')renderMonth();else if(state.view==='habits')renderHabits();else if(state.view==='stats')renderStats();}
  function lockScroll(locked){document.body.style.overflow=locked?'hidden':'';}
  function showOverlay(id){$(id).classList.add('is-open');$(id).setAttribute('aria-hidden','false');lockScroll(true);}
  function hideOverlay(id){$(id).classList.remove('is-open');$(id).setAttribute('aria-hidden','true');if(!$('.modal-overlay.is-open'))lockScroll(false);}
  function updateCustomDays(){ $('#custom-days').innerHTML=WEEKDAYS.map((day,i)=>`<button type="button" class="weekday-btn ${state.customDays.has(i)?'active':''}" data-action="custom-day" data-weekday="${i}" aria-pressed="${state.customDays.has(i)}">${day}</button>`).join(''); }
  function updateTaskMode(){
    $$('[data-task-mode]').forEach(b=>b.classList.toggle('active',b.dataset.taskMode===state.taskMode));
    $('#task-once-fields').classList.toggle('hidden',state.taskMode!=='once');$('#task-repeat-fields').classList.toggle('hidden',state.taskMode!=='repeat');
    $('#custom-days-wrap').classList.toggle('hidden',$('#task-repeat-input').value!=='custom');
    $('#repeat-help').textContent=state.editId?'Если изменить расписание, новые правила начнут действовать с завтрашнего дня. Прошлая статистика сохранится.':'Привычка будет автоматически появляться во все выбранные дни.';
  }
  function openTaskModal(id=null,forcedMode=null){
    state.editId=id;$('#task-form').reset();$('#form-error').textContent='';state.customDays=new Set([weekDay(state.selected)]);
    const t=id?data.tasks.find(x=>x.id===id):null;
    state.taskMode=t?t.kind:forcedMode||'once';
    $$('[data-task-mode]').forEach(b=>b.disabled=!!t);
    $('#modal-title').textContent=t?'Изменить дело':state.taskMode==='repeat'?'Новая привычка':'Добавить дело';
    $('#modal-kicker').textContent=t?'РЕДАКТИРОВАНИЕ':state.taskMode==='repeat'?'АВТОМАТИЧЕСКОЕ ПОВТОРЕНИЕ':'НОВАЯ ЗАДАЧА';
    $('#task-submit-label').textContent=t?'Сохранить изменения':'Сохранить дело';
    $('#task-title-input').value=t?.title||'';$('#task-detail-input').value=t?.detail||'';$('#task-time-input').value=t?.time||'';$('#task-category-input').value=t?.category||'personal';
    $('#task-date-input').value=t?.kind==='once'?t.date:state.selected;
    $('#task-repeat-input').value=t?.kind==='repeat'?t.repeat:'daily';
    $('#task-start-input').value=t?.kind==='repeat'?t.startDate:state.selected;
    if(t?.kind==='repeat'&&t.repeat==='custom')state.customDays=new Set(t.days);
    updateCustomDays();updateTaskMode();showOverlay('#task-overlay');setTimeout(()=>$('#task-title-input').focus(),40);
  }
  function closeTaskModal(){hideOverlay('#task-overlay');state.editId=null;}
  function createTask(payload){return {id:uid(),...payload,createdAt:new Date().toISOString()};}
  function getFormPayload(){
    const title=$('#task-title-input').value.trim(),detail=$('#task-detail-input').value.trim(),time=$('#task-time-input').value,category=$('#task-category-input').value;
    if(!title)throw new Error('Введи название дела');
    const p={title:title.slice(0,120),detail:detail.slice(0,250),time:validTime(time)?time:'',category:CAT[category]?category:'personal',kind:state.taskMode};
    if(state.taskMode==='once'){
      const date=$('#task-date-input').value;if(!isDate(date))throw new Error('Выбери дату дела');p.date=date;
    }else{
      const startDate=$('#task-start-input').value,repeat=$('#task-repeat-input').value;
      if(!isDate(startDate))throw new Error('Выбери дату начала');
      if(!['daily','weekdays','custom'].includes(repeat))throw new Error('Выбери периодичность');
      if(repeat==='custom'&&!state.customDays.size)throw new Error('Выбери хотя бы один день недели');
      Object.assign(p,{startDate,repeat,days:repeat==='custom'?[...state.customDays].sort():[],archivedAt:null});
    }
    return p;
  }
  function saveTaskFromForm(event){
    event.preventDefault();$('#form-error').textContent='';
    try{
      const payload=getFormPayload(),old=data.tasks.find(t=>t.id===state.editId);let message='Дело добавлено';
      if(!old){data.tasks.push(createTask(payload));if(payload.kind==='once'){state.selected=payload.date;state.week=startWeek(fromKey(payload.date));} }
      else if(old.kind==='repeat'){
        if(payload.kind!=='repeat')throw new Error('Тип существующей привычки менять нельзя. Создай разовое дело отдельно.');
        const scheduleChange=old.repeat!==payload.repeat||old.startDate!==payload.startDate||JSON.stringify(old.days)!==JSON.stringify(payload.days);
        if(scheduleChange){
          if(old.archivedAt)throw new Error('Привычка в архиве. Сначала возобнови её.');
          const tomorrow=toKey(addDays(fromKey(nowDay),1));
          old.archivedAt=tomorrow;
          // Schedule changes start tomorrow to preserve even today's completion record.
          payload.startDate=payload.startDate>tomorrow?payload.startDate:tomorrow;
          data.tasks.push(createTask(payload));message='Новое расписание действует с завтра. История сохранена';
        }else Object.assign(old,{title:payload.title,detail:payload.detail,time:payload.time,category:payload.category});
      }else{
        if(payload.kind!=='once')throw new Error('Для повторения создай отдельную привычку');
        Object.assign(old,payload);message='Дело обновлено';
      }
      save();closeTaskModal();render();toast(message);
    }catch(err){$('#form-error').textContent=err.message||'Не удалось сохранить дело';}
  }
  function deleteTask(id){const t=data.tasks.find(x=>x.id===id);if(!t||t.kind!=='once')return;
    if(!confirm(`Удалить «${t.title}»? Отметки выполнения этого дела также исчезнут.`))return;
    data.tasks=data.tasks.filter(x=>x.id!==id);for(const flags of [data.completed,data.skipped])for(const date of Object.keys(flags)){delete flags[date][id];if(!Object.keys(flags[date]).length)delete flags[date];}
    save();state.openMenu=null;render();toast('Разовое дело удалено');
  }
  function archiveHabit(id){const t=data.tasks.find(x=>x.id===id);if(!t||t.kind!=='repeat')return;if(t.archivedAt)return;
    if(!confirm(`Убрать «${t.title}» из будущих дней? Все прошлые отметки сохранятся.`))return;
    // Stop from tomorrow so today's completed tasks remain in the record.
    t.archivedAt=toKey(addDays(fromKey(nowDay),1));save();state.openMenu=null;render();toast('Привычка в архиве. Сегодняшний план сохранён');
  }
  function restoreHabit(id){const t=data.tasks.find(x=>x.id===id);if(!t||t.kind!=='repeat')return;
    const tomorrow=toKey(addDays(fromKey(nowDay),1));
    if(t.archivedAt===tomorrow){t.archivedAt=null;}else{const next={...t,startDate:nowDay,archivedAt:null};delete next.id;delete next.createdAt;data.tasks.push(createTask(next));}
    save();state.habitFilter='active';render();toast('Привычка возобновлена');
  }
  function addPreset(name){const names={read:['Читать 20 страниц','study'],sport:['Зарядка 10 минут','health'],review:['Подвести итоги дня','personal']};const item=names[name];if(!item)return;data.tasks.push(createTask({kind:'repeat',repeat:'daily',startDate:state.selected,archivedAt:null,days:[],title:item[0],category:item[1],detail:'',time:''}));save();render();toast('Привычка добавлена на каждый день');}
  function exportData(){
    const payload={...data,exportedAt:new Date().toISOString(),app:'ritm'};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`Ритм-резервная-копия-${nowDay}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('Резервная копия подготовлена');
  }
  async function importData(file){if(!file)return;if(file.size>3*1024*1024){toast('Слишком большой файл (максимум 3 МБ)');return;}
    try{const input=JSON.parse(await file.text());let next;
      if(input.version===1)next=migrateOld(input);else next=normalize(input);
      if(!next)throw new Error('Неподдерживаемый формат файла');
      if(!confirm(`Восстановить данные из файла? Текущие задачи (${data.tasks.length}) будут заменены на задачи из копии (${next.tasks.length}).`))return;
      data=next;save();state.selected=nowDay;state.week=startWeek(fromKey(nowDay));state.month=new Date();state.month.setDate(1);state.view='day';hideOverlay('#settings-overlay');render();toast('Данные успешно восстановлены');
    }catch(err){console.warn(err);toast('Не удалось импортировать: '+(err.message||'ошибка файла'));}finally{$('#import-file').value='';}
  }
  function clearData(){if(!confirm('Точно удалить ВСЕ задачи, привычки, отметки и заметки? Это действие нельзя отменить без резервной копии.'))return;
    if(!confirm('Последнее подтверждение. Удалить все данные?'))return;
    data=fresh();save();state.view='day';state.selected=nowDay;state.week=startWeek(fromKey(nowDay));state.openMenu=null;hideOverlay('#settings-overlay');render();toast('Планировщик очищен');
  }
  function updateNow(){const actual=toKey(new Date());if(actual!==nowDay){nowDay=actual;if(state.view==='day'&&state.selected===toKey(addDays(fromKey(nowDay),-1))){state.selected=nowDay;state.week=startWeek(fromKey(nowDay));}render();}}
  function onAction(button){
    const action=button.dataset.action,id=button.dataset.id,date=button.dataset.date;
    switch(action){
      case'go-home':state.selected=nowDay;state.week=startWeek(fromKey(nowDay));changeView('day');break;
      case'add':case'add-once':openTaskModal(null,'once');break;
      case'add-repeat':openTaskModal(null,'repeat');break;
      case'today':selectDate(nowDay);break;
      case'week-today':state.week=startWeek(fromKey(nowDay));render();break;
      case'prev-week':navigateWeek(-1);break;
      case'next-week':navigateWeek(1);break;
      case'date':selectDate(date);break;
      case'open-day':selectDate(date,true);break;
      case'prev-month':state.month=new Date(state.month.getFullYear(),state.month.getMonth()-1,1,12);render();break;
      case'next-month':state.month=new Date(state.month.getFullYear(),state.month.getMonth()+1,1,12);render();break;
      case'month-today':state.month=new Date(fromKey(nowDay).getFullYear(),fromKey(nowDay).getMonth(),1,12);state.selected=nowDay;render();break;
      case'select-calendar-date':state.selected=date;state.week=startWeek(fromKey(date));if(fromKey(date).getMonth()!==state.month.getMonth()||fromKey(date).getFullYear()!==state.month.getFullYear())state.month=new Date(fromKey(date).getFullYear(),fromKey(date).getMonth(),1,12);render();break;
      case'open-selected-day':changeView('day');break;
      case'menu':state.openMenu=state.openMenu===id?null:id;render();break;
      case'toggle-task':markDone(id,state.selected);break;
      case'skip-task':skipOnDay(id,state.selected);break;
      case'edit-task':state.openMenu=null;openTaskModal(id);break;
      case'delete-task':deleteTask(id);break;
      case'archive-task':archiveHabit(id);break;
      case'restore-habit':restoreHabit(id);break;
      case'preset':addPreset(button.dataset.preset);break;
      case'custom-day':{const x=Number(button.dataset.weekday);if(state.customDays.has(x))state.customDays.delete(x);else state.customDays.add(x);updateCustomDays();break;}
      case'close-task':closeTaskModal();break;
      case'settings':$('#evening-time').value=data.settings.eveningTime;showOverlay('#settings-overlay');break;
      case'close-settings':hideOverlay('#settings-overlay');break;
      case'export':exportData();break;
      case'import':$('#import-file').click();break;
      case'clear-data':clearData();break;
    }
  }
  function installListeners(){
    document.addEventListener('click',e=>{
      const view=e.target.closest('[data-view]');if(view){changeView(view.dataset.view);return;}
      const filter=e.target.closest('[data-habit-filter]');if(filter){state.habitFilter=filter.dataset.habitFilter;render();return;}
      const mode=e.target.closest('[data-task-mode]');if(mode){if(state.editId){const old=data.tasks.find(t=>t.id===state.editId);if(old&&old.kind!==mode.dataset.taskMode){$('#form-error').textContent='Для смены типа создай новое дело';return;}}state.taskMode=mode.dataset.taskMode;$('#form-error').textContent='';updateTaskMode();return;}
      const action=e.target.closest('[data-action]');if(action){onAction(action);return;}
      if(e.target.matches('.modal-overlay')){if(e.target.id==='task-overlay')closeTaskModal();if(e.target.id==='settings-overlay')hideOverlay('#settings-overlay');return;}
      if(state.openMenu&&!e.target.closest('.task-menu-holder')){state.openMenu=null;if(state.view==='day')renderDay();}
    });
    $('#task-repeat-input').addEventListener('change',updateTaskMode);
    $('#task-form').addEventListener('submit',saveTaskFromForm);
    $('#journal-input').addEventListener('input',e=>{data.notes[state.selected]=e.target.value;if(!data.notes[state.selected])delete data.notes[state.selected];save();$('#journal-saved').textContent=storageOK?'Сохранено':'Не сохранено';$('#journal-status').textContent=data.notes[state.selected]?'Есть запись':'Личный дневник';});
    $('#evening-time').addEventListener('change',e=>{if(validTime(e.target.value)){data.settings.eveningTime=e.target.value;save();toast('Время вечернего обзора изменено');}});
    $('#import-file').addEventListener('change',e=>importData(e.target.files?.[0]));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#task-overlay').classList.contains('is-open'))closeTaskModal();else if($('#settings-overlay').classList.contains('is-open'))hideOverlay('#settings-overlay');else if(state.openMenu){state.openMenu=null;render();}}});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateNow();});
    setInterval(updateNow,60000);
  }
  hydrateIcons();installListeners();render();
  if(!storageOK)$('#storage-alert').classList.remove('hidden');
  if('serviceWorker' in navigator && ['https:','http:'].includes(location.protocol)){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('Offline mode:',err)));
  }
  // Diagnostic helpers for local testing only; no data is sent externally.
  window.__ritmDiagnostics={version:2,score:dateScore,getData:()=>JSON.parse(JSON.stringify(data))};
})();
