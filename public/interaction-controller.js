/* Dinliminate P707 — single Tinder interaction owner, no double-transition. */
(function(){
  'use strict';
  const VERSION='p707';
  const $=id=>document.getElementById(id);
  const states=new WeakMap();
  let suppressClickUntil=0;

  const call=(name,...args)=>{
    try{const fn=window[name];return typeof fn==='function'?fn(...args):undefined;}
    catch(err){console.error('Dinliminate action failed',name,err);}
  };

  const isControl=t=>!!t?.closest?.('button,a,input,select,textarea,[data-card-action],[data-rest-action]');
  const active=(root)=>root?.querySelector?.('.active')||null;

  function cleanup(card){
    const s=states.get(card); if(!s)return;
    if(s.raf)cancelAnimationFrame(s.raf);
    card.classList.remove('dragging','show-cut','show-hold');
    card.style.removeProperty('transform');
    card.style.removeProperty('opacity');
    card.style.removeProperty('transition');
    s.raf=0;s.dragging=false;s.pointerId=null;s.moved=false;
  }

  function renderDrag(card,dx,dy){
    const s=states.get(card); if(!s)return;
    if(s.raf)cancelAnimationFrame(s.raf);
    s.pending={dx,dy};
    s.raf=requestAnimationFrame(()=>{
      s.raf=0;
      const p=s.pending||{dx:0,dy:0};
      const x=Math.max(-Math.max(240,(card.clientWidth||340)*.9),Math.min(Math.max(240,(card.clientWidth||340)*.9),p.dx));
      const y=Math.max(-12,Math.min(12,p.dy*.06));
      card.style.transform=`translate3d(${x}px,${y}px,0) rotate(${x*.045}deg)`;
      card.classList.toggle('show-cut',x < -52);
      card.classList.toggle('show-hold',x > 52);
    });
  }

  function bindCard(card,mode){
    if(!card)return null;
    const old=states.get(card);
    if(old?.version===VERSION)return card;
    if(old?.cleanup)old.cleanup();

    const s={version:VERSION,pointerId:null,startX:0,startY:0,lastX:0,dragging:false,moved:false,raf:0,pending:null,cleanup:null};
    states.set(card,s);
    card.style.touchAction='none';
    card.style.userSelect='none';
    card.style.webkitUserSelect='none';

    const down=e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      if(isControl(e.target))return;
      if(document.body.classList.contains('din-transitioning')||document.body.classList.contains('din-restaurant-transitioning'))return;
      s.pointerId=e.pointerId;s.startX=s.lastX=e.clientX;s.startY=e.clientY;
      s.dragging=true;s.moved=false;card.classList.add('dragging');
      try{card.setPointerCapture(e.pointerId);}catch{}
      if(e.cancelable)e.preventDefault();
    };

    const move=e=>{
      if(!s.dragging||e.pointerId!==s.pointerId)return;
      const dx=e.clientX-s.startX,dy=e.clientY-s.startY;
      if(Math.abs(dy)>Math.abs(dx)*1.4&&Math.abs(dy)>18){cleanup(card);return;}
      if(Math.abs(dx)>7)s.moved=true;
      if(e.cancelable)e.preventDefault();
      renderDrag(card,dx,dy);
    };

    const end=e=>{
      if(!s.dragging||e.pointerId!==s.pointerId)return;
      const dx=e.clientX-s.startX;
      const distance=Math.max(54,Math.min(100,(card.clientWidth||340)*.18));
      const committed=s.moved&&Math.abs(dx)>=distance;
      s.pointerId=null;
      if(!committed){cleanup(card);return;}
      s.dragging=false;
      card.dataset.swipeSuppressUntil=String(Date.now()+500);
      suppressClickUntil=Date.now()+500;
      // Do not animate here. The canonical food/restaurant transition functions
      // own the fly-off animation and the state mutation.
      cleanup(card);
      if(mode==='food'){
        if(dx<0)call('cutCurrent',card); else call('holdCurrent',card);
      }else{
        if(dx<0)call('restaurantCut',card); else call('restaurantKeep',card);
      }
    };

    const cancel=e=>{if(s.dragging&&e.pointerId===s.pointerId)cleanup(card);};

    const click=e=>{
      if(Date.now()<suppressClickUntil||Date.now()<Number(card.dataset.swipeSuppressUntil||0))return;
      if(isControl(e.target))return;
      if(mode==='restaurant'){
        const item=call('currentRestaurant');
        if(item)call('openDetails',item);
      }else call('openCurrentDetails');
    };

    card.addEventListener('pointerdown',down,{passive:false});
    card.addEventListener('pointermove',move,{passive:false});
    card.addEventListener('pointerup',end,{passive:false});
    card.addEventListener('pointercancel',cancel,{passive:false});
    card.addEventListener('lostpointercapture',cancel,{passive:false});
    card.addEventListener('click',click);
    s.cleanup=()=>cleanup(card);
    return card;
  }

  function bindButtons(){
    const pairs=[
      ['cutBtn','cutCurrent','stage'],['holdBtn','holdCurrent','stage'],['backBtn','undoLast',null],['hideBtn','hideCurrent',null],
      ['restaurantCutBtn','restaurantCut','restaurantStage'],['restaurantKeepBtn','restaurantKeep','restaurantStage'],
      ['restaurantBackAction','restaurantUndo',null],['restaurantHideBtn','restaurantHide',null]
    ];
    for(const [id,fn,rootId] of pairs){
      const b=$(id);if(!b||b.dataset.p707Bound==='1')continue;
      b.dataset.p707Bound='1';
      b.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        call(fn,rootId?active($(rootId)):undefined);
      });
    }
  }

  function bindVisible(){
    bindCard(active($('stage')),'food');
    bindCard(active($('restaurantStage')),'restaurant');
    bindButtons();
  }

  function install(){
    bindVisible();
    for(const id of ['stage','restaurantStage']){
      const root=$(id);if(!root||root.dataset.p707Observe==='1')continue;
      root.dataset.p707Observe='1';
      new MutationObserver(bindVisible).observe(root,{childList:true,subtree:true});
    }
    window.DinliminateInteraction={version:VERSION,bindFoodCard:c=>bindCard(c,'food'),bindRestaurantCard:c=>bindCard(c,'restaurant'),bindVisibleCards:bindVisible,bindButtons};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();