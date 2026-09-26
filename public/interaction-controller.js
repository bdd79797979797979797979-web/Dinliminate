/* Dinliminate P706 — one authoritative Tinder interaction controller. */
/* Latest source checkpoint: card taps + direct decisions share the same interaction owner. */
(function(){
  'use strict';
  const VERSION='p706';
  const $=id=>document.getElementById(id);

  const state=new WeakMap();
  let suppressClickUntil=0;

  const call=(name,...args)=>{
    try{
      const fn=window[name];
      return typeof fn==='function' ? fn(...args) : undefined;
    }catch(err){
      console.error('Dinliminate interaction failed:',name,err);
      return undefined;
    }
  };

  function isInteractiveTarget(target){
    return !!target?.closest?.('button,a,input,select,textarea,[data-card-action],[data-rest-action]');
  }

  function activeCard(root){
    return root?.querySelector?.('.active') || null;
  }

  function cleanup(card){
    const s=state.get(card);
    if(!s)return;
    if(s.raf){cancelAnimationFrame(s.raf);s.raf=0;}
    card.classList.remove('dragging','show-cut','show-hold');
    card.style.removeProperty('transform');
    card.style.removeProperty('transition');
    card.style.removeProperty('opacity');
    s.dragging=false;
    s.pointerId=null;
  }

  function applyDrag(card,dx,dy){
    const s=state.get(card);
    if(!s)return;
    if(s.raf)cancelAnimationFrame(s.raf);
    s.pending={dx,dy};
    s.raf=requestAnimationFrame(()=>{
      s.raf=0;
      const p=s.pending||{dx:0,dy:0};
      const w=Math.max(300,card.getBoundingClientRect().width||360);
      const max=Math.max(260,w*.95);
      const x=Math.max(-max,Math.min(max,p.dx));
      const y=Math.max(-18,Math.min(18,p.dy*.08));
      const rotate=x*.055;
      card.style.transform=`translate3d(${x}px,${y}px,0) rotate(${rotate}deg)`;
      card.classList.toggle('show-cut',x < -55);
      card.classList.toggle('show-hold',x > 55);
    });
  }

  function animateDecision(card,dx,mode){
    const s=state.get(card);
    if(!s)return;
    s.dragging=false;
    card.style.transition='transform .28s cubic-bezier(.22,.75,.25,1), opacity .24s ease';
    const distance=Math.max(520,window.innerWidth*1.15);
    const out=dx<0 ? -distance : distance;
    card.style.transform=`translate3d(${out}px,0,0) rotate(${dx<0?-20:20}deg)`;
    card.style.opacity='0';
    suppressClickUntil=Date.now()+450;

    window.setTimeout(()=>{
      if(mode==='food'){
        if(dx<0)call('cutCurrent',card);
        else call('holdCurrent',card);
      }else{
        if(dx<0)call('restaurantCut',card);
        else call('restaurantKeep',card);
      }
    },70);
  }

  function bindCard(card,mode){
    if(!card)return null;
    const prior=state.get(card);
    if(prior?.version===VERSION)return card;
    if(prior?.cleanup){try{prior.cleanup();}catch{}}

    const s={version:VERSION,pointerId:null,startX:0,startY:0,lastX:0,lastTime:0,dragging:false,moved:false,raf:0,pending:null};
    state.set(card,s);
    card.style.touchAction='none';
    card.style.userSelect='none';
    card.style.webkitUserSelect='none';

    const down=e=>{
      if(e.pointerType==='mouse' && e.button!==0)return;
      if(isInteractiveTarget(e.target))return;
      if(document.body.classList.contains('din-transitioning')||document.body.classList.contains('din-restaurant-transitioning'))return;
      s.pointerId=e.pointerId;
      s.startX=s.lastX=e.clientX;
      s.startY=e.clientY;
      s.lastTime=performance.now();
      s.dragging=true;
      s.moved=false;
      card.classList.add('dragging');
      try{card.setPointerCapture(e.pointerId);}catch{}
      if(e.cancelable)e.preventDefault();
    };

    const move=e=>{
      if(!s.dragging||e.pointerId!==s.pointerId)return;
      const now=performance.now();
      const dx=e.clientX-s.startX;
      const dy=e.clientY-s.startY;
      s.lastX=e.clientX;
      s.lastTime=now;
      if(Math.abs(dy)>Math.abs(dx)*1.35 && Math.abs(dy)>16){
        cleanup(card);
        return;
      }
      if(Math.abs(dx)>8)s.moved=true;
      if(e.cancelable)e.preventDefault();
      applyDrag(card,dx,dy);
    };

    const end=e=>{
      if(!s.dragging||e.pointerId!==s.pointerId)return;
      const dx=e.clientX-s.startX;
      const dt=Math.max(16,performance.now()-s.lastTime);
      const vx=(e.clientX-s.lastX)/dt;
      const threshold=Math.max(58,Math.min(110,card.getBoundingClientRect().width*.18));
      const committed=s.moved && (Math.abs(dx)>=threshold || Math.abs(vx)>=0.62);
      s.pointerId=null;
      if(!committed){
        cleanup(card);
        return;
      }
      const modeName=mode==='food'?'food':'restaurant';
      animateDecision(card,dx,modeName);
      s.pointerId=null;
    };

    const cancel=e=>{
      if(!s.dragging||e.pointerId!==s.pointerId)return;
      cleanup(card);
    };

    const click=e=>{
      if(Date.now()<suppressClickUntil || Date.now()<Number(card.dataset.swipeSuppressUntil||0))return;
      if(isInteractiveTarget(e.target))return;
      if(s.moved){
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if(mode==='restaurant'){
        const item=call('currentRestaurant');
        if(item)call('openDetails',item);
      }else{
        call('openCurrentDetails');
      }
    };

    card.addEventListener('pointerdown',down,{passive:false});
    card.addEventListener('pointermove',move,{passive:false});
    card.addEventListener('pointerup',end,{passive:false});
    card.addEventListener('pointercancel',cancel,{passive:false});
    card.addEventListener('lostpointercapture',cancel,{passive:false});
    card.addEventListener('click',click);
    s.cleanup=()=>{cleanup(card);};
    return card;
  }

  function bindButtons(){
    const pairs=[
      ['cutBtn','cutCurrent','stage'],
      ['holdBtn','holdCurrent','stage'],
      ['backBtn','undoLast',null],
      ['hideBtn','hideCurrent',null],
      ['restaurantCutBtn','restaurantCut','restaurantStage'],
      ['restaurantKeepBtn','restaurantKeep','restaurantStage'],
      ['restaurantBackAction','restaurantUndo',null],
      ['restaurantHideBtn','restaurantHide',null]
    ];
    for(const [id,fn,rootId] of pairs){
      const btn=$(id);
      if(!btn || btn.dataset.p706Bound==='1')continue;
      btn.dataset.p706Bound='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        const card=rootId?activeCard($(rootId)):null;
        call(fn,card);
      });
      btn.addEventListener('pointerup',e=>e.stopPropagation(),{passive:true});
    }
  }

  function bindVisible(){
    bindCard(activeCard($('stage')),'food');
    bindCard(activeCard($('restaurantStage')),'restaurant');
    bindButtons();
  }

  function install(){
    bindVisible();
    ['stage','restaurantStage'].forEach(id=>{
      const root=$(id);
      if(!root || root.dataset.p706Observer==='1')return;
      root.dataset.p706Observer='1';
      new MutationObserver(()=>bindVisible()).observe(root,{childList:true,subtree:true});
    });
    window.DinliminateInteraction={
      version:VERSION,
      bindFoodCard:card=>bindCard(card,'food'),
      bindRestaurantCard:card=>bindCard(card,'restaurant'),
      bindVisibleCards:bindVisible,
      bindButtons
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();