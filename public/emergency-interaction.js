/* Dinliminate P709 — emergency single-owner interaction bridge. */
(function(){
  'use strict';
  const V='p709', $=id=>document.getElementById(id);
  const state={pointerId:null,card:null,startX:0,startY:0,lastX:0,moved:false,raf:0};

  const call=(name,...args)=>{
    try{const fn=window[name];return typeof fn==='function'?fn(...args):undefined;}
    catch(err){console.error('Dinliminate P709 action failed',name,err);}
  };
  const cardFor=t=>t?.closest?.('.stack-card.active,.restaurant-card.active');
  const isCard=t=>!!cardFor(t);
  const isControl=t=>!!t?.closest?.('button,a,input,select,textarea');
  const setDrag=(card,x,y)=>{
    if(!card)return;
    if(state.raf)cancelAnimationFrame(state.raf);
    state.raf=requestAnimationFrame(()=>{
      state.raf=0;
      const max=Math.max(240,(card.clientWidth||340)*.9);
      const dx=Math.max(-max,Math.min(max,x));
      const dy=Math.max(-12,Math.min(12,y*.06));
      card.style.transition='none';
      card.style.transform='translate3d('+dx+'px,'+dy+'px,0) rotate('+dx*.045+'deg)';
      card.classList.toggle('show-cut',dx < -52);
      card.classList.toggle('show-hold',dx > 52);
    });
  };
  const clearDrag=card=>{
    if(state.raf)cancelAnimationFrame(state.raf);
    if(card){
      card.classList.remove('dragging','show-cut','show-hold');
      card.style.removeProperty('transform');
      card.style.removeProperty('transition');
      card.style.removeProperty('opacity');
    }
    state.pointerId=null;state.card=null;state.moved=false;
  };

  function begin(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    const card=cardFor(e.target);
    if(!card || isControl(e.target))return;
    state.pointerId=e.pointerId;state.card=card;state.startX=state.lastX=e.clientX;state.startY=e.clientY;state.moved=false;
    card.classList.add('dragging');
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
  }
  function move(e){
    if(state.pointerId===null||e.pointerId!==state.pointerId||!state.card)return;
    const dx=e.clientX-state.startX,dy=e.clientY-state.startY;
    if(Math.abs(dy)>Math.abs(dx)*1.35&&Math.abs(dy)>18){clearDrag(state.card);return;}
    if(Math.abs(dx)>7)state.moved=true;
    setDrag(state.card,dx,dy);
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
  }
  function end(e){
    if(state.pointerId===null||e.pointerId!==state.pointerId||!state.card)return;
    const card=state.card,dx=e.clientX-state.startX;
    const threshold=Math.max(54,Math.min(100,(card.clientWidth||340)*.18));
    const commit=state.moved&&Math.abs(dx)>=threshold;
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
    clearDrag(card);
    if(!commit)return;
    card.dataset.p709SuppressUntil=String(Date.now()+550);
    const restaurant=card.classList.contains('restaurant-card');
    if(restaurant){
      if(dx<0)call('restaurantCut',card);else call('restaurantKeep',card);
    }else{
      if(dx<0)call('cutCurrent',card);else call('holdCurrent',card);
    }
  }

  const fixed={
    startBtn:()=>call('showGame'),
    homeRestaurantQuick:()=>call('showRestaurantMode'),
    cutBtn:()=>call('cutCurrent',$('stage')?.querySelector('.active')),
    holdBtn:()=>call('holdCurrent',$('stage')?.querySelector('.active')),
    backBtn:()=>call('undoLast'),
    hideBtn:()=>call('hideCurrent'),
    restaurantCutBtn:()=>call('restaurantCut',$('restaurantStage')?.querySelector('.active')),
    restaurantKeepBtn:()=>call('restaurantKeep',$('restaurantStage')?.querySelector('.active')),
    restaurantBackAction:()=>call('restaurantUndo'),
    restaurantHideBtn:()=>call('restaurantHide'),
    restaurantLoadBtn:()=>window.DinliminateRestaurantSearchV4?.find?.(),
    restaurantUseLocationBtn:()=>window.DinliminateRestaurantSearchV4?.locate?.(),
    restaurantEmptyFind:()=>window.DinliminateRestaurantSearchV4?.find?.(),
    restaurantEmptyLocation:()=>window.DinliminateRestaurantSearchV4?.locate?.(),
    menuBtn:()=>call('openMenu'),
    homeMenuTopBtn:()=>call('openMenu'),
    restaurantMenuBtn:()=>call('openMenu'),
    closeDrawerBtn:()=>call('closeMenu'),
    addMenuBtn:()=>call('openModal'),
    addDuringBtn:()=>call('openModal'),
    settingsBtn:()=>call('openSettings'),
    historyMenuBtn:()=>call('openLibrary','history'),
    homePhoneHelpBtn:()=>call('openPhoneHelp'),
    homeWinnerBtn:()=>call('openLastWinner')
  };

  document.addEventListener('pointerdown',e=>{
    const id=e.target?.closest?.('button')?.id;
    if(id&&fixed[id]){e.stopImmediatePropagation();return;}
    begin(e);
  },true);
  document.addEventListener('pointermove',move,true);
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',e=>{if(state.pointerId!==null){e.stopImmediatePropagation();clearDrag(state.card);}},true);
  document.addEventListener('click',e=>{
    const target=e.target;
    const id=target?.closest?.('button')?.id;
    const card=cardFor(target);
    const suppress=Number(card?.dataset.p709SuppressUntil||0)>Date.now();
    if(card && suppress){e.preventDefault();e.stopImmediatePropagation();return;}

    if(id&&fixed[id]){
      e.preventDefault();e.stopImmediatePropagation();
      void fixed[id]();
      return;
    }

    const restAction=target?.closest?.('[data-rest-action]')?.dataset?.restAction;
    if(restAction&&card){
      e.preventDefault();e.stopImmediatePropagation();
      const item=call('currentRestaurant');
      if(!item)return;
      if(restAction==='details')call('openDetails',item);
      else if(restAction==='save'){const now=call('toggleSaved',item);target.closest('[data-rest-action]').classList.toggle('saved',!!now);}
      else if(restAction==='order'){const u=item.website||item.url;if(u)window.open(u,'_blank','noopener');}
      return;
    }

    const foodAction=target?.closest?.('[data-card-action]')?.dataset?.cardAction;
    if(foodAction&&card){
      e.preventDefault();e.stopImmediatePropagation();
      const item=$('stage')?.querySelector('.active');const current=call('currentIndex');
      if(foodAction==='details')call('openCurrentDetails');
      else if(foodAction==='save' && item){const x=call('toggleSaved',call('currentIndex')>=0 ? window.activeItems?.[current] : null); }
      return;
    }

    if(card && !isControl(target)){
      e.preventDefault();e.stopImmediatePropagation();
      if(card.classList.contains('restaurant-card')){const item=call('currentRestaurant');if(item)call('openDetails',item);}
      else call('openCurrentDetails');
      return;
    }
  },true);

  window.DinliminateEmergencyInteraction={version:V};
})();
