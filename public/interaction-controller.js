/* Dinliminate P710 — authoritative Tinder interaction owner. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const S={id:null,card:null,x:0,y:0,startX:0,startY:0,moved:false,raf:0};
const call=(n,...a)=>{try{const f=window[n];return typeof f==='function'?f(...a):undefined;}catch(e){console.error('Dinliminate action',n,e);}};
const card=t=>t?.closest?.('.stack-card.active,.restaurant-card.active');
const control=t=>!!t?.closest?.('button,a,input,select,textarea,[data-card-action],[data-rest-action]');
const active=id=>document.getElementById(id)?.querySelector('.active');
const stop=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();};
const clear=()=>{if(S.raf)cancelAnimationFrame(S.raf);if(S.card){S.card.classList.remove('dragging','show-cut','show-hold');S.card.style.removeProperty('transform');S.card.style.removeProperty('transition');S.card.style.removeProperty('opacity');}S.id=null;S.card=null;S.moved=false;S.raf=0;};
const paint=()=>{S.raf=0;if(!S.card)return;const m=Math.max(240,(S.card.clientWidth||340)*.9),x=Math.max(-m,Math.min(m,S.x)),y=Math.max(-14,Math.min(14,S.y*.06));S.card.style.transition='none';S.card.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+x*.045+'deg)';S.card.classList.toggle('show-cut',x<-52);S.card.classList.toggle('show-hold',x>52);};
document.addEventListener('pointerdown',e=>{
  if(e.target?.closest?.('button'))return;
  const c=card(e.target);if(!c||control(e.target))return;
  if(document.body.classList.contains('din-transitioning')||document.body.classList.contains('din-restaurant-transitioning'))return;
  S.id=e.pointerId;S.card=c;S.startX=e.clientX;S.startY=e.clientY;S.x=0;S.y=0;S.moved=false;c.classList.add('dragging');try{c.setPointerCapture?.(e.pointerId)}catch{}stop(e);
},true);
document.addEventListener('pointermove',e=>{
  if(S.id!==e.pointerId||!S.card)return;
  const x=e.clientX-S.startX,y=e.clientY-S.startY;
  if(Math.abs(y)>Math.abs(x)*1.5&&Math.abs(y)>20){stop(e);clear();return;}
  if(Math.abs(x)>6)S.moved=true;S.x=x;S.y=y;if(S.raf)cancelAnimationFrame(S.raf);S.raf=requestAnimationFrame(paint);stop(e);
},true);
document.addEventListener('pointerup',e=>{
  if(S.id!==e.pointerId||!S.card)return;
  const c=S.card,x=e.clientX-S.startX,threshold=Math.max(54,Math.min(100,(c.clientWidth||340)*.18)),commit=S.moved&&Math.abs(x)>=threshold;
  stop(e);clear();if(!commit)return;c.dataset.swipeSuppressUntil=String(Date.now()+700);
  if(c.classList.contains('restaurant-card')){if(x<0)call('restaurantCut',c);else call('restaurantKeep',c);}
  else{if(x<0)call('cutCurrent',c);else call('holdCurrent',c);}
},true);
document.addEventListener('pointercancel',e=>{if(S.id!==null){stop(e);clear();}},true);
const fixed={
 startBtn:()=>call('showGame'),homeRestaurantQuick:()=>call('showRestaurantMode'),
 cutBtn:()=>call('cutCurrent',active('stage')),holdBtn:()=>call('holdCurrent',active('stage')),
 backBtn:()=>call('undoLast'),hideBtn:()=>call('hideCurrent'),
 restaurantCutBtn:()=>call('restaurantCut',active('restaurantStage')),restaurantKeepBtn:()=>call('restaurantKeep',active('restaurantStage')),
 restaurantBackAction:()=>call('restaurantUndo'),restaurantHideBtn:()=>call('restaurantHide'),
 restaurantLoadBtn:()=>window.DinliminateRestaurantSearchV4?.find?.(),restaurantUseLocationBtn:()=>window.DinliminateRestaurantSearchV4?.locate?.(),
 restaurantEmptyFind:()=>window.DinliminateRestaurantSearchV4?.find?.(),restaurantEmptyLocation:()=>window.DinliminateRestaurantSearchV4?.locate?.(),
 menuBtn:()=>call('openMenu'),homeMenuTopBtn:()=>call('openMenu'),restaurantMenuBtn:()=>call('openMenu'),closeDrawerBtn:()=>call('closeMenu'),
 addMenuBtn:()=>call('openModal'),addDuringBtn:()=>call('openModal'),settingsBtn:()=>call('openSettings'),historyMenuBtn:()=>call('openLibrary','history'),
 homePhoneHelpBtn:()=>call('openPhoneHelp'),homeWinnerBtn:()=>call('openLastWinner')
};
document.addEventListener('click',e=>{
  const t=e.target,id=t?.closest?.('button')?.id,c=card(t);
  if(c&&Number(c.dataset.swipeSuppressUntil||0)>Date.now()){stop(e);return;}
  if(id&&fixed[id]){stop(e);void fixed[id]();return;}
  const ra=t?.closest?.('[data-rest-action]')?.dataset?.restAction;
  if(ra&&c){stop(e);const it=call('currentRestaurant');if(!it)return;if(ra==='details')call('openDetails',it);else if(ra==='save'){const now=call('toggleSaved',it),b=t.closest('[data-rest-action]');if(b){b.classList.toggle('saved',!!now);b.textContent=now?'♥':'♡';}}else if(ra==='order'){const u=it.website||it.url;if(u)window.open(u,'_blank','noopener,noreferrer');}return;}
  const fa=t?.closest?.('[data-card-action]')?.dataset?.cardAction;
  if(fa&&c){stop(e);if(fa==='details')call('openCurrentDetails');else if(fa==='save'){const i=call('currentIndex'),it=Array.isArray(window.activeItems)?window.activeItems[i]:null;if(it)call('toggleSaved',it);}return;}
  if(c&&!control(t)){stop(e);if(c.classList.contains('restaurant-card')){const it=call('currentRestaurant');if(it)call('openDetails',it);}else call('openCurrentDetails');}
},true);
const mark=c=>{if(c){c.style.touchAction='none';c.style.userSelect='none';c.style.webkitUserSelect='none';}return c;};
window.DinliminateInteraction={version:'p710',bindFoodCard:mark,bindRestaurantCard:mark,bindVisibleCards:()=>{mark(active('stage'));mark(active('restaurantStage'));},bindButtons:()=>{}};
window.DinliminateInteraction.bindVisibleCards();
})();
