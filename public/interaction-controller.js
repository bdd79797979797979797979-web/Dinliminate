/* Dinliminate P703 — single owner for card swipes and decision buttons. */
(function(){
  'use strict';
  const VERSION='p704';
  const $=id=>document.getElementById(id);

  const safeCall=(fn,...args)=>{
    try { return typeof fn==='function' ? fn(...args) : undefined; }
    catch(err){ console.error('Dinliminate action failed',err); return undefined; }
  };

  function bindFoodCard(card){ return bindCard(card,'food'); }
  function bindRestaurantCard(card){ return bindCard(card,'restaurant'); }

  function bindCard(card,mode){
    if(!card || card.dataset.dinInteractionBound==='p704') return card;
    card.dataset.dinInteractionBound='p704';
    card.style.touchAction='none';

    let pointerId=null;
    let startX=0,startY=0,lastX=0;
    let moved=false,dragging=false;

    const isAction=e=>!!e?.target?.closest?.('button,a,[data-card-action],[data-rest-action]');
    const isBusy=()=>mode==='food'
      ? !!document.body.classList.contains('din-transitioning')
      : !!document.body.classList.contains('din-restaurant-transitioning');

    const reset=()=>{
      card.classList.remove('dragging','show-cut','show-hold');
      card.style.removeProperty('transform');
      pointerId=null;dragging=false;moved=false;
    };

    const begin=e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      if(isAction(e)||isBusy())return;
      pointerId=e.pointerId;startX=lastX=e.clientX;startY=e.clientY;moved=false;dragging=true;
      card.classList.add('dragging');
      try{card.setPointerCapture(e.pointerId);}catch{}
      if(e.cancelable)e.preventDefault();
    };

    const move=e=>{
      if(!dragging||e.pointerId!==pointerId)return;
      const dx=e.clientX-startX,dy=e.clientY-startY;lastX=e.clientX;
      if(Math.abs(dy)>Math.abs(dx)*1.25&&Math.abs(dy)>12){reset();return;}
      if(Math.abs(dx)>8)moved=true;
      if(e.cancelable)e.preventDefault();
      const width=Math.max(280,card.getBoundingClientRect().width||350);
      const max=Math.max(220,width*.84);
      const px=Math.max(-max,Math.min(max,dx));
      card.style.transform=`translate(${px}px,${Math.max(-12,Math.min(12,dy*.07))}px) rotate(${px*.045}deg)`;
      card.classList.toggle('show-cut',px<-48);
      card.classList.toggle('show-hold',px>48);
    };

    const finish=(e,cancelled)=>{
      if(!dragging||e.pointerId!==pointerId)return;
      const dx=e.clientX-startX;
      const act=!cancelled&&moved&&Math.abs(dx)>=54;
      reset();
      if(!act)return;
      if(mode==='food'){
        if(dx<0)safeCall(window.cutCurrent,card);
        else safeCall(window.holdCurrent,card);
      }else{
        if(dx<0)safeCall(window.restaurantCut,card);
        else safeCall(window.restaurantKeep,card);
      }
    };

    card.addEventListener('pointerdown',begin,{passive:false});
    card.addEventListener('pointermove',move,{passive:false});
    card.addEventListener('pointerup',e=>finish(e,false),{passive:false});
    card.addEventListener('pointercancel',e=>finish(e,true),{passive:false});
    card.addEventListener('lostpointercapture',e=>{if(e.pointerId===pointerId)finish(e,false);},{passive:false});
    return card;
  }

  function current(root,mode){
    const card=root?.querySelector?.('.active');
    return bindCard(card,mode);
  }

  function bindButtons(){
    if(document.documentElement.dataset.dinDecisionClicks==='p704') return;
    document.documentElement.dataset.dinDecisionClicks='p704';
    document.addEventListener('click',e=>{
      const btn=e.target?.closest?.('#cutBtn,#holdBtn,#backBtn,#hideBtn,#restaurantCutBtn,#restaurantKeepBtn,#restaurantBackAction,#restaurantHideBtn');
      if(!btn)return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      switch(btn.id){
        case 'cutBtn': return safeCall(window.cutCurrent,$('stage')?.querySelector?.('.active'));
        case 'holdBtn': return safeCall(window.holdCurrent,$('stage')?.querySelector?.('.active'));
        case 'backBtn': return safeCall(window.undoLast);
        case 'hideBtn': return safeCall(window.hideCurrent);
        case 'restaurantCutBtn': return safeCall(window.restaurantCut,$('restaurantStage')?.querySelector?.('.active'));
        case 'restaurantKeepBtn': return safeCall(window.restaurantKeep,$('restaurantStage')?.querySelector?.('.active'));
        case 'restaurantBackAction': return safeCall(window.restaurantUndo);
        case 'restaurantHideBtn': return safeCall(window.restaurantHide);
      }
    },true);
  }

  function bindVisibleCards(){
    bindFoodCard($('stage')?.querySelector?.('.active'));
    bindRestaurantCard($('restaurantStage')?.querySelector?.('.active'));
  }

  function install(){
    bindButtons();
    bindVisibleCards();

    ['stage','restaurantStage'].forEach(id=>{
      const root=$(id);if(!root)return;
      const observer=new MutationObserver(bindVisibleCards);
      observer.observe(root,{childList:true,subtree:true});
    });

    window.DinliminateInteraction={version:VERSION,bindFoodCard,bindRestaurantCard,bindButtons,bindVisibleCards};
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
