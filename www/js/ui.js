(function(){
'use strict';
var SUPPORT_URL='https://yzn-support.netlify.app/';
var settings={master:50,sfx:70,vibration:true,particles:true};
try{if(window.Save&&typeof Save.loadSettings==='function'){settings=Save.loadSettings();}}catch(e){}

function $(id){return document.getElementById(id);}

/* Rotate Detection */
function checkOrientation(){
  var w=$('rotate-warning');if(!w)return;
  if(window.innerHeight>window.innerWidth){w.classList.add('active');}
  else{w.classList.remove('active');}
}
window.addEventListener('resize',checkOrientation);
window.addEventListener('orientationchange',function(){setTimeout(checkOrientation,300);});
checkOrientation();

/* Title Particles */
function spawnTitleParticles(){
  try{
    var c=$('titleParticles');if(!c)return;
    for(var i=0;i<30;i++){
      var p=document.createElement('div');
      p.className='title-particle';
      p.style.left=Math.random()*100+'%';
      p.style.animationDuration=(4+Math.random()*6)+'s';
      p.style.animationDelay=(Math.random()*5)+'s';
      p.style.opacity=0.3+Math.random()*0.5;
      var sz=1+Math.random()*2;
      p.style.width=sz+'px';p.style.height=sz+'px';
      c.appendChild(p);
    }
  }catch(e){}
}

function syncSettingsUI(){
  if($('setMaster'))$('setMaster').value=settings.master;
  if($('setMasterVal'))$('setMasterVal').textContent=settings.master+'%';
  if($('setSFX'))$('setSFX').value=settings.sfx;
  if($('setSFXVal'))$('setSFXVal').textContent=settings.sfx+'%';
  if($('setVibration'))$('setVibration').checked=settings.vibration;
  if($('setParticles'))$('setParticles').checked=settings.particles;
}
function show(id){var el=$(id);if(el)el.classList.add('active');}
function hide(id){var el=$(id);if(el)el.classList.remove('active');}

/* Robust Button Binding */
function bindButton(id,handler){
  var el=$(id);
  if(!el){console.warn('Button not found:',id);return;}
  var lock=false;
  var fire=function(e){
    if(e){e.preventDefault();e.stopPropagation();}
    if(lock)return;
    lock=true;
    setTimeout(function(){lock=false;},400);
    try{handler(e);}catch(err){console.error('Button error:',id,err);}
  };
  el.addEventListener('click',fire);
  el.addEventListener('touchstart',fire,{passive:false});
}

function bindUI(){
  bindButton('btnNewGame',function(){
    try{if(window.Save)Save.reset();}catch(e){}
    var c=$('game-container'),t=$('title-screen');
    if(t)t.classList.add('hide');
    setTimeout(function(){
      if(t)t.style.display='none';
      if(c)c.classList.add('active');
      if(window.GameBridge&&GameBridge.startNewGame)GameBridge.startNewGame();
    },500);
    try{if(window.Sound)Sound.portal();}catch(e){}
  });
  bindButton('btnContinue',function(){
    var c=$('game-container'),t=$('title-screen');
    if(t)t.classList.add('hide');
    setTimeout(function(){
      if(t)t.style.display='none';
      if(c)c.classList.add('active');
      if(window.GameBridge&&GameBridge.continueGame)GameBridge.continueGame();
    },500);
    try{if(window.Sound)Sound.portal();}catch(e){}
  });
  bindButton('btnSettings',function(){syncSettingsUI();show('settingsScreen');});
  bindButton('btnAbout',function(){show('aboutScreen');});
  bindButton('btnWebsite',function(){
    try{
      if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Browser){window.Capacitor.Plugins.Browser.open({url:SUPPORT_URL});}
      else{window.open(SUPPORT_URL,'_system');}
    }catch(e){window.open(SUPPORT_URL,'_system');}
  });

  if($('setMaster'))$('setMaster').addEventListener('input',function(){settings.master=parseInt(this.value);$('setMasterVal').textContent=this.value+'%';try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
  if($('setSFX'))$('setSFX').addEventListener('input',function(){settings.sfx=parseInt(this.value);$('setSFXVal').textContent=this.value+'%';try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
  if($('setVibration'))$('setVibration').addEventListener('change',function(){settings.vibration=this.checked;try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
  if($('setParticles'))$('setParticles').addEventListener('change',function(){settings.particles=this.checked;try{if(window.Save)Save.saveSettings(settings);}catch(e){}});

  bindButton('closeSettings',function(){hide('settingsScreen');});
  bindButton('closeAbout',function(){hide('aboutScreen');});
  bindButton('closeShop',function(){hide('shopScreen');});
  bindButton('closeForge',function(){hide('forgeScreen');});

  bindButton('pauseBtn',function(){if(window.GameBridge&&GameBridge.pause)GameBridge.pause();show('pauseScreen');});
  bindButton('resumeBtn',function(){hide('pauseScreen');if(window.GameBridge&&GameBridge.resume)GameBridge.resume();});
  bindButton('quitBtn',function(){
    if(window.GameBridge&&GameBridge.save)GameBridge.save();
    if(window.GameBridge&&GameBridge.pause)GameBridge.pause();
    hide('pauseScreen');
    var c=$('game-container'),t=$('title-screen');
    if(c)c.classList.remove('active');
    if(t){t.style.display='';t.classList.remove('hide');}
  });

  bindButton('mapBtn',function(){if(window.GameMap)GameMap.show();});
  bindButton('closeMap',function(){if(window.GameMap)GameMap.hide();});
  bindButton('interactBtn',function(){if(window.GameBridge&&GameBridge.interact)GameBridge.interact();});
}

/* Shop */
window.Shop={
  open:function(gold,weaponLevel,onBuy){
    var sg=$('shopGold');if(sg)sg.textContent='💰 '+gold;
    var items=$('shopItems');if(!items)return;
    items.innerHTML='';
    var all=[
      {id:'w1',name:'Iron Blade',desc:'+15 damage',price:40,icon:'⚔'},
      {id:'w2',name:'Steel Edge',desc:'+30 damage',price:90,icon:'🗡'},
      {id:'w3',name:'Shadow Reaper',desc:'+50 damage',price:160,icon:'🌑'},
      {id:'w4',name:'Void Scythe',desc:'+80 damage',price:280,icon:'☠'},
      {id:'a1',name:'Leather Vest',desc:'+30 HP',price:50,icon:'🛡'},
      {id:'a2',name:'Iron Plate',desc:'+60 HP',price:110,icon:'🛡'},
      {id:'a3',name:'Dragon Mail',desc:'+100 HP',price:180,icon:'🛡'}
    ];
    all.forEach(function(item){
      var div=document.createElement('div');
      div.className='shop-item';
      if(gold<item.price)div.classList.add('disabled');
      div.innerHTML='<div class="shop-item__icon">'+item.icon+'</div>'+
        '<div class="shop-item__info"><div class="shop-item__name">'+item.name+'</div>'+
        '<div class="shop-item__desc">'+item.desc+'</div></div>'+
        '<div class="shop-item__price">💰 '+item.price+'</div>';
      div.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        if(gold<item.price)return;
        if(onBuy)onBuy(item);
      });
      items.appendChild(div);
    });
    show('shopScreen');
  }
};

/* Forge */
window.Forge={
  open:function(gold,weaponLevel,onUpgrade){
    var fg=$('forgeGold');if(fg)fg.textContent='💰 '+gold;
    var info=$('forgeInfo');if(!info)return;
    var prices=[0,0,100,220,400,700];
    var nextPrice=prices[weaponLevel]||0;
    if(weaponLevel>=5){
      info.innerHTML='<div class="curr">MAX LEVEL</div><div class="next">Fully upgraded!</div>';
    }else{
      info.innerHTML='<div class="curr">Weapon Lv.'+weaponLevel+'</div>'+
        '<div class="arrow">▼</div>'+
        '<div class="curr">Weapon Lv.'+(weaponLevel+1)+'</div>'+
        '<div class="next">Cost: 💰 '+nextPrice+'</div>';
    }
    var doBtn=$('doForge');
    if(doBtn){
      var newBtn=doBtn.cloneNode(true);
      doBtn.parentNode.replaceChild(newBtn,doBtn);
      newBtn.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        if(weaponLevel>=5)return;
        if(gold<nextPrice)return;
        if(onUpgrade)onUpgrade();
      });
    }
    show('forgeScreen');
  }
};

/* Boss Prompt */
window.BossPrompt={
  show:function(bossName,onYes,onNo){
    var nm=$('bossPromptName');if(nm)nm.textContent='⚔ '+bossName;
    var yb=$('bossAcceptBtn'),nb=$('bossDeclineBtn');
    if(yb){
      var newY=yb.cloneNode(true);yb.parentNode.replaceChild(newY,yb);newY.id='bossAcceptBtn';
      newY.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();hide('bossPromptScreen');if(onYes)onYes();});
    }
    if(nb){
      var newN=nb.cloneNode(true);nb.parentNode.replaceChild(newN,nb);newN.id='bossDeclineBtn';
      newN.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();hide('bossPromptScreen');if(onNo)onNo();});
    }
    show('bossPromptScreen');
  }
};

/* Hint */
window.Hint={
  show:function(){var b=$('interactBtn');if(b)b.classList.add('active');},
  hide:function(){var b=$('interactBtn');if(b)b.classList.remove('active');}
};

function init(){
  spawnTitleParticles();
  bindUI();
  syncSettingsUI();
  var tg=$('titleGold');
  if(tg&&window.Save){var d=Save.load();tg.textContent='💰 '+d.gold;}
  var l=$('loading');if(l)setTimeout(function(){l.classList.add('hide');},300);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
console.log('✅ UI loaded');
})();
