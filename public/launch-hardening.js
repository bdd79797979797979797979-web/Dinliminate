/* Dinliminate P633 — launch interaction layer. */
(function(){
  'use strict';
  const VERSION='p705';
  const ROUND_SCHEMA=2;
  const $=id=>document.getElementById(id);
  const html=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const foodKey=x=>`food::${String(x?.id||x?.name||'').trim().toLowerCase()}`;
  const restKey=x=>`restaurant::${String(x?.id||x?.name||'').trim().toLowerCase()}`;
  const uniq=(arr,keyFn)=>{const m=new Map();for(const x of arr||[]){if(!x)continue;const k=keyFn(x);if(!m.has(k))m.set(k,x);}return [...m.values()];};

  const FOOD_ROUND_KEY='dinliminateFoodRound';
  const FOOD_ROUND_MAX_AGE=24*60*60*1000;
  const RESTAURANT_ROUND_KEY='dinliminateRestaurantRound';
  const RESTAURANT_ROUND_MAX_AGE=24*60*60*1000;
  async function idbGet(key,store='records'){try{const db=await openDinliminateIDB?.();if(!db)return null;return await new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly');const req=tx.objectStore(store).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=reject;});}catch{return null;}}
  async function hydratePrimaryStorage(){
    const specs=[['custom','dinliminateCustom','dinliminateCustomUpdatedAt'],['saved','dinliminateSaved','dinliminateSavedUpdatedAt'],['history','dinliminateHistory','dinliminateHistoryUpdatedAt'],['hidden','dinliminateHidden','dinliminateHiddenUpdatedAt'],['preferences','dinliminatePreferences','dinliminatePreferencesUpdatedAt']];
    let changed=false;
    for(const [store,key,stampKey] of specs){
      const row=await idbGet(key,store);
      if(!row || row.value==null || !Number.isFinite(Number(row.updatedAt)) || Number(row.updatedAt)<=Number(safeRead(stampKey,'0'))) continue;
      try{
        if(store==='custom' && Array.isArray(row.value)) customItems=row.value.map(i=>({...i,id:i.id||slugId(i.name,'custom')}));
        else if(store==='saved' && Array.isArray(row.value)) savedItems=row.value.slice(0,100);
        else if(store==='history' && Array.isArray(row.value)) historyItems=row.value.slice(0,100);
        else if(store==='hidden' && Array.isArray(row.value)) hiddenItems=row.value.slice(0,500);
        else if(store==='preferences' && row.value && typeof row.value==='object') foodPreferences=Object.assign({quick:false,comfort:false},row.value);
        else continue;
        safeWrite(key,JSON.stringify(row.value)); safeWrite(stampKey,String(row.updatedAt)); changed=true;
      }catch{}
    }
    if(changed){allItems=dedupe([...homeMeals,...customItems]);activeItems=allItems.filter(i=>i.type!=='restaurant'&&!isDeletedFood(i)&&(!hideEnabled||!isHidden(i)));originalCount=Math.max(activeItems.length,1);updateHomeCount();syncWinnerAccess?.();}
    return changed;
  }
  function roundSnapshot(){return {schema:ROUND_SCHEMA,version:VERSION,savedAt:Date.now(),base:foodBase,active:activeItems||[],holding:holdingItems||[],finalist:!!finalistMode,originalCount,searchQuery:String(searchQuery||''),quick:[...foodQuickHidden],manual:[...foodManual]};}
  function saveFoodRoundState(){if(!foodInProgress){safeWrite(FOOD_ROUND_KEY,'');idbDelete?.('foodRound');return;}const state=roundSnapshot();safeWrite(FOOD_ROUND_KEY,JSON.stringify(state));idbPut?.('foodRound',state);}
  async function hydrateFoodRound(){
    let state=null;
    try{const raw=safeRead(FOOD_ROUND_KEY,'');if(raw)state=JSON.parse(raw);}catch{}
    if(!state){const row=await idbGet('foodRound');state=row?.value||null;if(state)safeWrite(FOOD_ROUND_KEY,JSON.stringify(state));}
    if(!state || (state.schema && state.schema!==ROUND_SCHEMA) || !Number.isFinite(state.savedAt) || Date.now()-state.savedAt>FOOD_ROUND_MAX_AGE || !Array.isArray(state.base) || state.base.length<2)return false;
    foodBase=uniq(state.base,foodKey);activeItems=uniq(state.active||[],foodKey);holdingItems=uniq(state.holding||[],foodKey);foodManual=new Set(Array.isArray(state.manual)?state.manual:[]);foodQuickHidden=new Set(Array.isArray(state.quick)?state.quick:[]);foodInProgress=true;finalistMode=!!state.finalist;originalCount=Number(state.originalCount)||foodBase.length;searchQuery=String(state.searchQuery||'');
    return true;
  }

  let foodBase=[], foodManual=new Set(), foodQuickHidden=new Set(), foodInProgress=false;
  let foodHydrationDone=false;
  let foodHydrationPromise=null;
  let restaurantBase=[], restaurantManual=new Set();
  let restaurantRoundInProgress=false;
  let restaurantHydrationDone=false;
  let restaurantHydrationPromise=null;
  let pass=null;
  let calendarCursor=new Date(new Date().getFullYear(),new Date().getMonth(),1);
  let legacyShowGame,legacyResetList,legacyRenderStage,legacyUndo,legacyCut,legacyHold,legacyShowRestaurant,legacyApplyRestaurant,legacyRenderRestaurant,legacyRestaurantCut,legacyRestaurantKeep,legacyRestaurantUndo,legacyRenderLibrary,legacyShowWinner;

  function restaurantRoundSnapshot(){
    return {schema:ROUND_SCHEMA,version:VERSION,savedAt:Date.now(),items:uniq([...(restaurantItems||[]),...(activeRestaurants||[]),...(holdingRestaurants||[])],restKey),active:[...(activeRestaurants||[])],holding:[...(holdingRestaurants||[])],finalist:!!restaurantFinalistMode,exhausted:!!restaurantEliminationExhausted,quick:[...(restaurantQuickCuts||new Set())],filters:{...(restaurantFilters||{}),query:String(restaurantFilters?.query||'')},radius:Number(restaurantRadiusMiles)||10,locationMode:restaurantLocationMode,area:restaurantAreaCoords,userCity:String(userCity||'')};
  }
  function saveRestaurantRoundState(){
    if(!restaurantRoundInProgress||!(restaurantItems||[]).length){try{localStorage.removeItem(RESTAURANT_ROUND_KEY);}catch{};return;}
    try{safeWrite(RESTAURANT_ROUND_KEY,JSON.stringify(restaurantRoundSnapshot()));}catch{}
  }
  function clearRestaurantRoundState(){restaurantRoundInProgress=false;try{localStorage.removeItem(RESTAURANT_ROUND_KEY);}catch{};}
  async function hydrateRestaurantRound(){
    let state=null;try{const raw=safeRead(RESTAURANT_ROUND_KEY,'');if(raw)state=JSON.parse(raw);}catch{}
    if(!state|| (state.schema && state.schema!==ROUND_SCHEMA)||!Number.isFinite(state.savedAt)||Date.now()-state.savedAt>RESTAURANT_ROUND_MAX_AGE||!Array.isArray(state.items)||!state.items.length)return false;
    restaurantItems=uniq(state.items,restKey);activeRestaurants=uniq(state.active||[],restKey);holdingRestaurants=uniq(state.holding||[],restKey);restaurantFinalistMode=!!state.finalist;restaurantEliminationExhausted=!!state.exhausted;restaurantQuickCuts=new Set(Array.isArray(state.quick)?state.quick:[]);restaurantFilters={query:String(state.filters?.query||''),sort:state.filters?.sort==='closest'?'closest':'shuffle',openNow:!!state.filters?.openNow};restaurantRadiusMiles=Math.min(RESTAURANT_MAX_MILES,Math.max(1,Number(state.radius)||10));restaurantLocationMode=state.locationMode==='device'?'device':'area';restaurantAreaCoords=state.area&&Number.isFinite(Number(state.area.lat))&&Number.isFinite(Number(state.area.lon))?state.area:null;userCity=String(state.userCity||'');restaurantBase=uniq([...(restaurantItems||[]),...(activeRestaurants||[]),...(holdingRestaurants||[])],restKey);restaurantManual=new Set();restaurantRoundInProgress=true;return !!activeRestaurants.length||!!holdingRestaurants.length;
  }
  function foodQuickMatch(item,k){return typeof quickCutMatches==='function'&&QUICK_CUT_RULES?.[k]&&quickCutMatches(item,QUICK_CUT_RULES[k]);}
  function restQuickMatch(item,k){return typeof restaurantQuickCutMatches==='function'&&restaurantQuickCutMatches(item,k);}
  function addFoodBase(){for(const x of [...(activeItems||[]),...(holdingItems||[])])if(x&&!foodBase.some(y=>foodKey(y)===foodKey(x)))foodBase.push(x);}
  function foodVisible(){const held=new Set((holdingItems||[]).map(foodKey));return foodBase.filter(x=>!foodManual.has(foodKey(x))&&!held.has(foodKey(x))&&!Array.from(foodQuickHidden).some(k=>foodQuickMatch(x,k)));}
  function recomputeFoodManual(){const present=new Set([...(activeItems||[]),...(holdingItems||[])].map(foodKey));foodManual=new Set(foodBase.filter(x=>!present.has(foodKey(x))&&!Array.from(foodQuickHidden).some(k=>foodQuickMatch(x,k))).map(foodKey));}

  function renderFoodQuickCuts(){
    const host=$('quickCutsBar'); if(!host)return;
    const title=host.closest('.quick-cuts-panel')?.querySelector('.quick-cuts-title');
    if(title)title.textContent=finalistMode?'FINALISTS':'Quick Cuts';
    if(finalistMode){host.innerHTML='';return;}
    const keys=['burgers','pizza','chicken','mexican','italian','pasta','potato','southern','healthy','soupstew','sandwiches','seafood','steak','bbq','breakfast'];
    host.innerHTML=keys.filter(k=>QUICK_CUT_RULES?.[k]).map(k=>{
      const r=QUICK_CUT_RULES[k],h=foodQuickHidden.has(k),n=(h?foodBase:activeItems).filter(x=>foodQuickMatch(x,k)).length;
      return `<button type="button" class="quick-cut${h?' is-quick-hidden':''}" data-launch-quick="${html(k)}" ${(!n||pass)?'disabled':''} aria-pressed="${h}"><span class="quick-cut-copy"><strong>${html(r.label)}</strong><em>${h?'show':'hide'} · ${n}</em></span><span class="quick-cut-x" aria-hidden="true">${h?'↺':'×'}</span></button>`;
    }).join('');
    host.querySelectorAll('[data-launch-quick]').forEach(b=>{const photoKey=QUICK_CUT_RULES[b.dataset.launchQuick]?.photo;const photo=photoKey&&PHOTO_LIBRARY?.[photoKey];if(photo)b.style.setProperty('--quick-photo',`url("${photo.replace(/"/g,'&quot;')}")`);b.onclick=()=>toggleFoodQuick(b.dataset.launchQuick);});
  }
  function toggleFoodQuick(k){
    if(pass){toast('Quick Cuts are locked during Pass Around.');return;}
    addFoodBase(); if(!foodBase.some(x=>foodQuickMatch(x,k))){toast('No matching choices in this round.');return;}
    foodQuickHidden.has(k)?foodQuickHidden.delete(k):foodQuickHidden.add(k);
    activeItems=foodVisible(); searchQuery=''; saveFoodRoundState(); renderStage(); renderFoodQuickCuts(); setStatus(`${activeItems.length} options left`,'live');
    toast(`${QUICK_CUT_RULES[k].label} ${foodQuickHidden.has(k)?'hidden':'brought back'}.`);
  }

  function freshFood(){
    const base=uniq([...(homeMeals||[]),...(customItems||[])],foodKey).filter(x=>x.type!=='restaurant'&&!isDeletedFood(x)&&(!hideEnabled||!isHidden(x)));
    foodBase=[...base]; foodManual.clear(); foodQuickHidden.clear(); foodInProgress=true;
    activeItems=[...base]; holdingItems=[]; finalistMode=false; undoStack=[]; searchQuery=''; originalCount=Math.max(1,base.length);
    saveFoodRoundState(); foodShowUI(`${base.length} fresh options ready`);
  }
  function resumeFood(){
    if(!foodBase.length||(!activeItems.length&&!holdingItems.length)){freshFood();return;}
    foodInProgress=true; foodShowUI(`${activeItems.length} options left`);
  }
  function foodShowUI(status){
    currentWinnerMode='food'; document.body.classList.remove('restaurant-mode','finalist-mode'); document.body.classList.add('game-mode');
    $('homePanel')?.classList.add('hidden');$('winnerPanel')?.classList.add('hidden');$('restaurantPanel')?.classList.add('hidden');$('gamePanel')?.classList.remove('hidden');
    updateBackButton();syncDecisionActionLabels();renderStage();renderFoodQuickCuts();if(status)setStatus(status,'live');
  }

  function setupRestaurantTools(){
    const block=document.querySelector('.restaurant-location-block'),row=$('restaurantLocationRow'); if(!block||!row)return;
    $('searchBtn')?.classList.add('menu-search-hidden');
    let bar=$('restaurantUtilityBar');
    if(!bar){
      bar=document.createElement('div');bar.id='restaurantUtilityBar';bar.className='restaurant-utility-bar';
      bar.innerHTML='<button type="button" class="restaurant-utility-btn" id="restaurantOpenNowBtn">Open/unknown hours</button><button type="button" class="restaurant-utility-btn" id="restaurantSearchBtn">Search</button><button type="button" class="restaurant-utility-btn restaurant-pass-utility" id="restaurantPassAroundBtn">Pass Around</button><div class="restaurant-inline-search-wrap"><input id="restaurantInlineQuery" class="restaurant-inline-query" type="search" placeholder="Search restaurants" autocomplete="off" aria-label="Search restaurants"><button type="button" class="restaurant-search-clear" id="restaurantSearchClear" aria-label="Clear restaurant search">×</button></div>';
      block.insertBefore(bar,$('restaurantLocationLabel'));
      $('restaurantOpenNowBtn').onclick=()=>{restaurantFilters.openNow=!restaurantFilters.openNow;saveRestaurantFilters?.();renderRestaurantStage();syncRestaurantTools();saveRestaurantRoundState();};
      $('restaurantSearchBtn').onclick=()=>{bar.classList.toggle('search-open');if(bar.classList.contains('search-open')){$('restaurantInlineQuery')?.focus();}};
      $('restaurantPassAroundBtn').onclick=()=>openPass('restaurant');
      $('restaurantSearchClear').onclick=()=>{$('restaurantInlineQuery').value='';restaurantFilters.query='';renderRestaurantStage();syncRestaurantTools();saveRestaurantRoundState();};
      $('restaurantInlineQuery').addEventListener('input',()=>{restaurantFilters.query=$('restaurantInlineQuery').value;renderRestaurantStage();syncRestaurantTools();saveRestaurantRoundState();});
      $('restaurantInlineQuery').addEventListener('keydown',e=>{if(e.key==='Escape'){restaurantFilters.query='';$('restaurantInlineQuery').value='';bar.classList.remove('search-open');renderRestaurantStage();syncRestaurantTools();}if(e.key==='Enter')e.preventDefault();});
    }
    syncRestaurantTools();
  }
  function syncRestaurantTools(){
    const b=$('restaurantUtilityBar'),q=$('restaurantInlineQuery'),o=$('restaurantOpenNowBtn'),s=$('restaurantSearchBtn');
    if(!b)return;
    if(q)q.value=restaurantFilters.query||''; b.classList.toggle('search-open',!!restaurantFilters.query);
    o?.classList.toggle('active',!!restaurantFilters.openNow);o?.setAttribute('aria-pressed',String(!!restaurantFilters.openNow));o?.setAttribute('aria-label',restaurantFilters.openNow?'Showing open or unknown hours':'Show open or unknown hours');
    s?.classList.toggle('active',!!restaurantFilters.query);s?.setAttribute('aria-expanded',String(b.classList.contains('search-open')));
    const l=$('restaurantLocationLabel'); if(l){const loc=restaurantLocationMode==='device'&&userCoords?'Using your device location':(userCity?`Near ${userCity}`:'Pick an area');const filt=[restaurantFilters.openNow?'open now':'',restaurantFilters.sort==='closest'?'nearest first':''].filter(Boolean);l.textContent=`${loc}${filt.length?' · '+filt.join(' · '):''} · cut until one is left`;}
  }
  function filterRestaurants(){
    let a=[...(activeRestaurants||[])];
    const q=String(restaurantFilters.query||'').trim().toLowerCase();
    if(q)a=a.filter(r=>`${r.name||''} ${r.address||''} ${r.brand||''} ${r.operator||''} ${r.category||''}`.toLowerCase().includes(q));
    if(restaurantFilters.openNow)a=a.filter(r=>restaurantOpenStatus(r)!==false);
    if(restaurantFilters.sort==='closest')a.sort((x,y)=>(Number(x.distanceMiles)||Infinity)-(Number(y.distanceMiles)||Infinity));
    return a;
  }
  function renderRestaurantQuickCuts(){
    const host=$('restaurantQuickCuts'),title=$('restaurantQuickCutsTitle');if(!host)return;
    if(restaurantFinalistMode){host.innerHTML='';if(title)title.textContent='FINALISTS';return;}
    if(title)title.textContent='Quick Cuts';
    const list=Array.isArray(RESTAURANT_QUICK_CUTS)?RESTAURANT_QUICK_CUTS:[];
    host.innerHTML=list.map(([label,k,photoKey])=>{const h=restaurantQuickCuts.has(k),n=(h?restaurantBase:activeRestaurants).filter(x=>restQuickMatch(x,k)).length,photo=PHOTO_LIBRARY?.[photoKey]||RESTAURANT_FALLBACK_PHOTO;return `<button type="button" class="quick-cut restaurant-quick-cut${h?' is-quick-hidden':''}" data-launch-rq="${html(k)}" ${(!n||pass)?'disabled':''} aria-pressed="${h}" style="--quick-photo:url('${html(photo)}')"><span class="quick-cut-copy"><strong>${html(label)}</strong><em>${h?'show':'hide'} · ${n}</em></span><span class="quick-cut-x" aria-hidden="true">${h?'↺':'×'}</span></button>`;}).join('');
    host.querySelectorAll('[data-launch-rq]').forEach(b=>b.onclick=()=>toggleRestaurantQuick(b.dataset.launchRq));
  }
  function visibleRestaurants(){const held=new Set((holdingRestaurants||[]).map(restKey));return restaurantBase.filter(x=>!held.has(restKey(x))&&!restaurantManual.has(restKey(x))&&!Array.from(restaurantQuickCuts||[]).some(k=>restQuickMatch(x,k)));}
  function recomputeRestaurantManual(){const present=new Set([...(activeRestaurants||[]),...(holdingRestaurants||[])].map(restKey));restaurantManual=new Set(restaurantBase.filter(x=>!present.has(restKey(x))&&!Array.from(restaurantQuickCuts||[]).some(k=>restQuickMatch(x,k))).map(restKey));}
  function toggleRestaurantQuick(k){
    if(pass){toast('Quick Cuts are locked during Pass Around.');return;}
    if(!restaurantBase.length)restaurantBase=uniq([...(activeRestaurants||[]),...(holdingRestaurants||[])],restKey);
    if(!restaurantBase.some(x=>restQuickMatch(x,k))){toast('No matching restaurants in this round.');return;}
    restaurantQuickCuts.has(k)?restaurantQuickCuts.delete(k):restaurantQuickCuts.add(k);
    activeRestaurants=visibleRestaurants();restaurantFilters.query='';restaurantRoundInProgress=true;saveRestaurantRoundState();renderRestaurantQuickCuts();renderRestaurantStage();syncRestaurantTools();
    toast(`${k==='fast_food'?'Fast Food':'Category'} ${restaurantQuickCuts.has(k)?'hidden':'brought back'}.`);
  }

  function openPass(mode){
    if(pass)return;
    let pool;
    if(mode==='restaurant') pool=uniq(filterRestaurants(),restKey);
    else pool=uniq([...(activeItems||[]),...(holdingItems||[])].filter(x=>x&&!isDeletedFood(x)),foodKey);
    if(pool.length<2){toast('Pass Around needs at least two choices.');return;}
    const b=document.createElement('div');b.id='passSetupBackdrop';b.className='pass-modal-backdrop';
    b.innerHTML=`<div class="pass-modal" role="dialog" aria-modal="true" aria-labelledby="passSetupTitle"><h3 id="passSetupTitle">Pass Around</h3><p>Each person gets the complete same list and swipes through every choice. Left cuts it; right keeps it. After everyone finishes, only the choices everyone kept become finalists.</p><div class="pass-count-grid">${[2,3,4,5,6].map(n=>`<button type="button" class="pass-count-btn" data-pass-n="${n}">${n} people</button>`).join('')}</div><div class="pass-modal-actions"><button type="button" class="pass-cancel-btn" data-pass-cancel>Cancel</button></div></div>`;
    document.body.appendChild(b);b.querySelector('[data-pass-cancel]').onclick=()=>b.remove();b.querySelectorAll('[data-pass-n]').forEach(btn=>btn.onclick=()=>startPass(mode,Number(btn.dataset.passN),pool));
  }
  function startPass(mode,count,pool){
    $('passSetupBackdrop')?.remove();
    pass={mode,count,current:1,pool:[...pool],votes:Array.from({length:count},()=>new Map()),snapshot:mode==='restaurant'?{active:[...activeRestaurants],holding:[...holdingRestaurants],finalist:restaurantFinalistMode,exhausted:restaurantEliminationExhausted,quick:[...restaurantQuickCuts],filters:{...restaurantFilters}}:{active:[...activeItems],holding:[...holdingItems],finalist:finalistMode,originalCount,searchQuery,quick:[...foodQuickHidden],manual:[...foodManual]}};
    if(mode==='restaurant'){activeRestaurants=[...pool];holdingRestaurants=[];restaurantFinalistMode=false;restaurantEliminationExhausted=false;restaurantFilters={...restaurantFilters,query:'',openNow:false,sort:'shuffle'};showRestaurantUIForPass();}
    else{activeItems=[...pool];holdingItems=[];finalistMode=false;searchQuery='';originalCount=pool.length;foodShowUI(null);}
    saveFoodRoundState();renderPassStatus();toast(`Person 1 of ${count}: swipe through every choice.`);
  }
  function showRestaurantUIForPass(){legacyShowRestaurant?.();document.body.classList.add('restaurant-mode');setupRestaurantTools();renderRestaurantStage();syncRestaurantActionLabels?.();}
  function passCurrent(){return pass?.mode==='restaurant'?(filterRestaurants()[0]||null):(activeItems?.[0]||null);}
  function passAct(kind,card){
    if(!pass)return false;const item=passCurrent();if(!item)return true;
    const list=pass.mode==='restaurant'?activeRestaurants:activeItems;
    const keyFn=pass.mode==='restaurant'?restKey:foodKey;const idx=list.findIndex(x=>keyFn(x)===keyFn(item));if(idx<0)return true;
    pass.votes[pass.current-1].set(keyFn(item),kind==='cut');
    const finish=()=>{list.splice(idx,1);if(!list.length){if(pass.current<pass.count)showHandoff();else finishPass();return;}pass.mode==='restaurant'?renderRestaurantStage():renderStage();renderPassStatus();};
    if(card&&pass.mode==='food'&&typeof transitionCard==='function')transitionCard(card,kind==='cut'?-1:1,finish);else if(card&&pass.mode==='restaurant'&&typeof transitionRestaurantCard==='function')transitionRestaurantCard(card,kind==='cut'?-1:1,finish);else finish();return true;
  }
  function showHandoff(){
    const n=pass.current+1,b=document.createElement('div');b.id='passHandoffBackdrop';b.className='pass-modal-backdrop';
    b.innerHTML=`<div class="pass-modal pass-handoff" role="dialog" aria-modal="true" aria-labelledby="handoffTitle"><div class="pass-icon">↔</div><h4 id="handoffTitle">Pass the phone to Person ${n}</h4><p>Person ${n} gets the complete same list. Everyone must swipe through every choice.</p><button type="button" class="pass-primary-btn" data-pass-start>Start Person ${n}</button><div class="pass-modal-actions"><button type="button" class="pass-cancel-btn" data-pass-end>End Pass Around</button></div></div>`;
    document.body.appendChild(b);b.querySelector('[data-pass-start]').onclick=()=>{b.remove();pass.current=n;if(pass.mode==='restaurant'){activeRestaurants=[...pass.pool];holdingRestaurants=[];renderRestaurantStage();}else{activeItems=[...pass.pool];holdingItems=[];saveFoodRoundState();renderStage();}renderPassStatus();toast(`Person ${n} of ${pass.count}: your turn.`);};b.querySelector('[data-pass-end]').onclick=cancelPass;
  }
  function finishPass(){
    const p=pass,keyFn=p.mode==='restaurant'?restKey:foodKey,cutCount=new Map();p.votes.forEach(v=>v.forEach((cut,k)=>{if(cut)cutCount.set(k,(cutCount.get(k)||0)+1);}));
    let finals=p.pool.filter(x=>p.votes.every(v=>v.get(keyFn(x))===false));
    if(!finals.length)finals=[...p.pool].sort((a,b)=>(cutCount.get(keyFn(a))||0)-(cutCount.get(keyFn(b))||0)).slice(0,Math.min(4,p.pool.length));
    pass=null;$('passStatus')?.remove();
    if(p.mode==='restaurant'){activeRestaurants=[...finals];holdingRestaurants=[];restaurantFinalistMode=true;restaurantUndoStack=[];restaurantQuickCuts.clear();restaurantFilters={...p.snapshot.filters,query:''};renderRestaurantQuickCuts();renderRestaurantStage();syncRestaurantActionLabels?.();setStatus(`${finals.length} finalists left · choose one`,'live');}
    else{activeItems=[...finals];holdingItems=[];finalistMode=true;undoStack=[];originalCount=p.pool.length;searchQuery='';saveFoodRoundState();renderStage();renderFoodQuickCuts();syncDecisionActionLabels();document.body.classList.add('finalist-mode');setStatus(`${finals.length} finalists left · choose one`,'live');}
    toast('Everyone finished. The finalists are ready to choose.');
  }
  function cancelPass(){
    const p=pass;if(!p)return;pass=null;$('passStatus')?.remove();$('passHandoffBackdrop')?.remove();
    if(p.mode==='restaurant'){activeRestaurants=[...(p.snapshot.active||[])];holdingRestaurants=[...(p.snapshot.holding||[])];restaurantFinalistMode=!!p.snapshot.finalist;restaurantEliminationExhausted=!!p.snapshot.exhausted;restaurantQuickCuts=new Set(p.snapshot.quick||[]);restaurantFilters={...p.snapshot.filters};renderRestaurantQuickCuts();renderRestaurantStage();syncRestaurantActionLabels?.();}
    else{activeItems=[...(p.snapshot.active||[])];holdingItems=[...(p.snapshot.holding||[])];finalistMode=!!p.snapshot.finalist;originalCount=p.snapshot.originalCount;searchQuery=p.snapshot.searchQuery||'';foodQuickHidden=new Set(p.snapshot.quick||[]);foodManual=new Set(p.snapshot.manual||[]);saveFoodRoundState();renderStage();renderFoodQuickCuts();syncDecisionActionLabels();}
    toast('Pass Around ended. Your round is restored.');
  }
  function renderPassStatus(){
    if(!pass)return;const host=pass.mode==='restaurant'?$('restaurantStage'):$('stage');if(!host)return;let bar=$('passStatus');if(!bar){bar=document.createElement('div');bar.id='passStatus';bar.className='pass-status';host.parentNode?.insertBefore(bar,host);}
    const remaining=pass.mode==='restaurant'?filterRestaurants().length:(activeItems||[]).length,done=pass.pool.length-remaining;bar.innerHTML=`<span><strong>Person ${pass.current} of ${pass.count}</strong><span class="pass-status-detail"> · ${done} of ${pass.pool.length}</span></span><button type="button" id="passEndBtn">End pass</button>`;$('passEndBtn').onclick=cancelPass;
  }

  function historyDayKey(value){const d=new Date(value||Date.now());return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function renderHistoryCalendar(){
    const host=$('libraryList');if(!host)return;const y=calendarCursor.getFullYear(),m=calendarCursor.getMonth(),days=new Date(y,m+1,0).getDate(),start=new Date(y,m,1).getDay(),by=new Map();
    (historyItems||[]).forEach((it,i)=>{const k=historyDayKey(it.date);if(!by.has(k))by.set(k,[]);by.get(k).push({it,i});});
    let cells='';for(let n=0;n<42;n++){const day=n-start+1,d=new Date(y,m,day),other=day<1||day>days,k=historyDayKey(d),events=by.get(k)||[],today=historyDayKey(new Date())===k;
      cells+=`<div class="history-day${other?' other-month':''}${today?' today':''}" role="gridcell" aria-label="${d.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}${events.length?`, ${events.length} decision${events.length===1?'':'s'}`:''}"><div class="history-day-number"><span>${d.getDate()}</span>${events.length?`<span>${events.length}</span>`:''}</div><div class="history-events">${events.slice(0,4).map(({it,i})=>`<div class="history-event"><button type="button" class="history-event-main" data-history-open="${i}" title="View ${html(it.name||'decision')}"><img src="${html(it.photo||photoFor(it))}" alt="${html(it.name||'Decision')}" loading="lazy" decoding="async"></button><button type="button" class="history-event-x" data-history-remove="${i}" aria-label="Remove ${html(it.name||'decision')} from history">×</button></div>`).join('')}${events.length>4?`<span class="history-more">+${events.length-4}</span>`:''}</div></div>`;
    }
    host.innerHTML=`<div class="history-calendar-wrap"><div class="history-calendar-toolbar"><div><div class="history-calendar-kicker">DECISIONS</div><h4 id="historyCalendarTitle">${calendarCursor.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h4></div><div class="history-calendar-nav"><button type="button" data-cal-prev aria-label="Previous month">‹</button><button type="button" data-cal-today>Today</button><button type="button" data-cal-next aria-label="Next month">›</button></div></div><div class="history-weekdays" role="row">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<div role="columnheader">${x}</div>`).join('')}</div><div class="history-calendar-grid" role="grid" aria-labelledby="historyCalendarTitle">${cells}</div><div class="history-legend"><span>Tap a photo for details</span><span>× removes the decision</span></div></div>`;
    host.querySelector('[data-cal-prev]').onclick=()=>{calendarCursor=new Date(y,m-1,1);renderHistoryCalendar();};host.querySelector('[data-cal-next]').onclick=()=>{calendarCursor=new Date(y,m+1,1);renderHistoryCalendar();};host.querySelector('[data-cal-today]').onclick=()=>{const d=new Date();calendarCursor=new Date(d.getFullYear(),d.getMonth(),1);renderHistoryCalendar();};
    host.querySelectorAll('[data-history-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();const it=historyItems[Number(b.dataset.historyOpen)];if(it){closeLibrary();openDetails(it);}});
    host.querySelectorAll('[data-history-remove]').forEach(b=>b.onclick=e=>{e.stopPropagation();const i=Number(b.dataset.historyRemove);if(historyItems[i]){const n=historyItems[i].name;historyItems.splice(i,1);saveHistoryItems();renderHistoryCalendar();toast(`${n||'Decision'} removed from history.`);}});
  }
  function renderLibraryLaunch(){if(libraryTab==='history'){const b=$('clearLibraryBtn');if(b){b.classList.add('show');b.textContent='Reset history';}renderHistoryCalendar();return;}legacyRenderLibrary?.apply(this,arguments);}

  function wrapRestaurantRender(){
    return function(){
      legacyRenderRestaurant.apply(this,arguments);
      setupRestaurantTools();renderRestaurantQuickCuts();
      const q=String(restaurantFilters.query||'').trim();
      if(q&&!filterRestaurants().length){
        $('restaurantStage').innerHTML=`<div class="restaurant-empty-v240 restaurant-search-empty"><div class="restaurant-empty-icon">⌕</div><strong>No restaurants match “${html(q)}”.</strong><p>Try another name, brand, address, or clear Search.</p><div class="restaurant-empty-actions"><button class="restaurant-empty-btn" type="button" id="restaurantSearchEmptyClear">Clear search</button></div></div>`;
        $('restaurantSearchEmptyClear').onclick=()=>{$('restaurantInlineQuery').value='';restaurantFilters.query='';renderRestaurantStage();syncRestaurantTools();};
      }
      syncRestaurantTools();if(pass?.mode==='restaurant')renderPassStatus();
      document.querySelectorAll('.restaurant-meta-v240').forEach(el=>{const card=el.closest('.restaurant-card');const item=(activeRestaurants||[]).find(r=>String(r.id)===String(card?.dataset?.restaurantId));if(!item)return;const rating=Number(item.rating)||0;el.textContent=`${item.fastFood?'Fast Food':'Restaurant'}${rating?` · ★ ${rating.toFixed(1)}`:''}`;});
    };
  }

  function backToStartFresh(){
    clearRestaurantRoundState();try{localStorage.removeItem(FOOD_ROUND_KEY);}catch{};foodInProgress=false;try{idbDelete?.('foodRound');}catch{};
    activeItems=[...(allItems||[])].filter(i=>i.type!=='restaurant'&&!isDeletedFood(i)&&(!hideEnabled||!isHidden(i)));holdingItems=[];finalistMode=false;undoStack=[];searchQuery='';
    restaurantQuickCuts.clear();restaurantFinalistMode=false;restaurantEliminationExhausted=false;holdingRestaurants=[];restaurantUndoStack=[];
    goHome();toast('Back to start. Next round starts fresh.');
  }
  window.DinliminateBackToStart=backToStartFresh;

  async function install(){
    safeWrite('dinliminateLaunchVersion',VERSION);
    await hydratePrimaryStorage().catch(()=>false);
    $('startOverBtn')?.replaceChildren(document.createTextNode('Start fresh'));
    legacyShowGame=window.showGame;legacyResetList=window.resetList;legacyRenderStage=window.renderStage;legacyUndo=window.undoLast;legacyCut=window.cutCurrent;legacyHold=window.holdCurrent;legacyShowRestaurant=window.showRestaurantMode;legacyApplyRestaurant=window.applyRestaurantData;legacyRenderRestaurant=window.renderRestaurantStage;legacyRestaurantCut=window.restaurantCut;legacyRestaurantKeep=window.restaurantKeep;legacyRestaurantUndo=window.restaurantUndo;legacyRenderLibrary=window.renderLibrary;legacyShowWinner=window.showWinner;
    window.showGame=()=>{if(!foodHydrationDone&&foodHydrationPromise){return foodHydrationPromise.then(()=>window.showGame());}return foodInProgress&&((activeItems||[]).length+(holdingItems||[]).length)>0?resumeFood():freshFood();};window.resetList=()=>{foodHydrationDone=true;return freshFood();};
    window.renderStage=function(){addFoodBase();legacyRenderStage.apply(this,arguments);renderFoodQuickCuts();if(pass?.mode==='food')renderPassStatus();};
    window.cutCurrent=function(card){if(pass?.mode==='food')return passAct('cut',card);const it=activeItems?.[currentIndex()];if(it)foodManual.add(foodKey(it));const r=legacyCut.apply(this,arguments);setTimeout(()=>{recomputeFoodManual();saveFoodRoundState();renderFoodQuickCuts();},220);return r;};
    window.holdCurrent=function(card){if(pass?.mode==='food')return passAct('hold',card);const r=legacyHold.apply(this,arguments);setTimeout(()=>saveFoodRoundState(),220);return r;};
    window.undoLast=function(){const r=legacyUndo.apply(this,arguments);recomputeFoodManual();saveFoodRoundState();renderFoodQuickCuts();return r;};
    window.showRestaurantMode=()=>{
      if(!restaurantHydrationDone&&restaurantHydrationPromise){return restaurantHydrationPromise.then(()=>window.showRestaurantMode());}
      const hasRound=restaurantRoundInProgress&&((activeRestaurants||[]).length+(holdingRestaurants||[]).length)>0;
      const r=legacyShowRestaurant.apply(this,arguments);setupRestaurantTools();renderRestaurantQuickCuts();
      if(hasRound){setRadiusUi?.();renderRestaurantStage();syncRestaurantTools();setStatus(`${activeRestaurants.length} restaurants left · continuing your round`,'live');}
      return r;
    };
    window.applyRestaurantData=function(){const r=legacyApplyRestaurant.apply(this,arguments);restaurantBase=uniq([...(activeRestaurants||[]),...(holdingRestaurants||[])],restKey);restaurantManual.clear();restaurantRoundInProgress=!!restaurantItems.length;saveRestaurantRoundState();renderRestaurantQuickCuts();return r;};
    window.renderRestaurantStage=wrapRestaurantRender();
    window.filteredRestaurants=filterRestaurants;window.renderRestaurantQuickCuts=renderRestaurantQuickCuts;window.eliminateRestaurantCategory=toggleRestaurantQuick;
    window.restaurantCut=function(card){if(pass?.mode==='restaurant')return passAct('cut',card);const it=filterRestaurants()[0];if(it)restaurantManual.add(restKey(it));const r=legacyRestaurantCut.apply(this,arguments);setTimeout(()=>{recomputeRestaurantManual();restaurantRoundInProgress=true;saveRestaurantRoundState();renderRestaurantQuickCuts();},250);return r;};
    window.restaurantKeep=function(card){if(pass?.mode==='restaurant')return passAct('hold',card);const r=legacyRestaurantKeep.apply(this,arguments);setTimeout(()=>{restaurantRoundInProgress=true;saveRestaurantRoundState();},250);return r;};window.restaurantUndo=function(){const r=legacyRestaurantUndo.apply(this,arguments);recomputeRestaurantManual();restaurantRoundInProgress=true;saveRestaurantRoundState();renderRestaurantQuickCuts();return r;};
    window.showWinner=function(){foodInProgress=false;safeWrite(FOOD_ROUND_KEY,'');idbDelete('foodRound');return legacyShowWinner.apply(this,arguments);};window.renderLibrary=renderLibraryLaunch;
    const foodBottom=$('gamePanel')?.querySelector('.game-bottom');if(foodBottom&&!$('passAroundBtn')){const b=document.createElement('button');b.id='passAroundBtn';b.type='button';b.className='text-btn food-secondary-action pass-food-btn';b.textContent='Pass Around';b.setAttribute('aria-label','Pass Around with other people');b.onclick=()=>openPass('food');const add=$('addDuringBtn');if(add&&add.parentElement===foodBottom)foodBottom.insertBefore(b,add);else foodBottom.appendChild(b);}
    $('restaurantPassAroundWrap')?.remove();
    document.querySelectorAll('[data-library-tab]').forEach(b=>b.addEventListener('click',()=>{libraryTab=b.dataset.libraryTab;renderLibraryLaunch();}));$('historyMenuBtn')?.addEventListener('click',()=>setTimeout(renderLibraryLaunch,0));
    // Disable the legacy website-metadata image hydrator so it cannot substitute another restaurant's photo.
    setupRestaurantTools();renderFoodQuickCuts();renderRestaurantQuickCuts();
    foodHydrationPromise=hydrateFoodRound().then(restored=>{foodHydrationDone=true;if(restored && document.body.classList.contains('game-mode')){foodShowUI(`${activeItems.length} options left · continuing your round`);}return restored;}).catch(()=>{foodHydrationDone=true;return false;});
    restaurantHydrationPromise=hydrateRestaurantRound().then(restored=>{restaurantHydrationDone=true;return restored;}).catch(()=>{restaurantHydrationDone=true;return false;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
