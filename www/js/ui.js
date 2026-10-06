(function(){
'use strict';
var SUPPORT_URL='https://yzn-support.netlify.app/';
var settings={master:50,sfx:70,vibration:true,particles:true};
try{if(window.Save&&typeof Save.loadSettings==='function'){settings=Save.loadSettings();}}catch(e){}
function $(id){return document.getElementById(id);}
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
  try{
    if($('setMaster'))$('setMaster').value=settings.master;
    if($('setMasterVal'))$('setMasterVal').textContent=settings.master+'%';
    if($('setSFX'))$('setSFX').value=settings.sfx;
    if($('setSFXVal'))$('setSFXVal').textContent=settings.sfx+'%';
    if($('setVibration'))$('setVibration').checked=settings.vibration;
    if($('setParticles'))$('setParticles').checked=settings.particles;
  }catch(e){}
}
function show(id){var el=$(id);if(el)el.classList.add('active');}
function hide(id){var el=$(id);if(el)el.classList.remove('active');}
function bindUI(){
  try{
    if($('btnNewGame'))$('btnNewGame').addEventListener('click',function(){
      try{if(window.Save)Save.reset();}catch(e){}
      var c=$('game-container'),t=$('title-screen');
      if(t)t.classList.add('hide');
      setTimeout(function(){
        if(t)t.style.display='none';
        if(c)c.classList.add('active');
        if(window.GameBridge&&GameBridge.startNewGame)GameBridge.startNewGame();
      },500);
      if(window.Sound)Sound.portal();
    });
    if($('btnContinue'))$('btnContinue').addEventListener('click',function(){
      var c=$('game-container'),t=$('title-screen');
      if(t)t.classList.add('hide');
      setTimeout(function(){
        if(t)t.style.display='none';
        if(c)c.classList.add('active');
        if(window.GameBridge&&GameBridge.continueGame)GameBridge.continueGame();
      },500);
      if(window.Sound)Sound.portal();
    });
    if($('btnSettings'))$('btnSettings').addEventListener('click',function(){syncSettingsUI();show('settingsScreen');});
    if($('btnAbout'))$('btnAbout').addEventListener('click',function(){show('aboutScreen');});
    if($('btnWebsite'))$('btnWebsite').addEventListener('click',function(){
      try{
        if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Browser){window.Capacitor.Plugins.Browser.open({url:SUPPORT_URL});}
        else{window.open(SUPPORT_URL,'_system');}
      }catch(e){window.open(SUPPORT_URL,'_system');}
    });
    if($('setMaster'))$('setMaster').addEventListener('input',function(){settings.master=parseInt(this.value);$('setMasterVal').textContent=this.value+'%';try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
    if($('setSFX'))$('setSFX').addEventListener('input',function(){settings.sfx=parseInt(this.value);$('setSFXVal').textContent=this.value+'%';try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
    if($('setVibration'))$('setVibration').addEventListener('change',function(){settings.vibration=this.checked;try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
    if($('setParticles'))$('setParticles').addEventListener('change',function(){settings.particles=this.checked;try{if(window.Save)Save.saveSettings(settings);}catch(e){}});
    if($('closeSettings'))$('closeSettings').addEventListener('click',function(){hide('settingsScreen');});
    if($('closeAbout'))$('closeAbout').addEventListener('click',function(){hide('aboutScreen');});
    if($('closeShop'))$('closeShop').addEventListener('click',function(){hide('shopScreen');});
    if($('closeForge'))$('closeForge').addEventListener('click',function(){hide('forgeScreen');});
    if($('pauseBtn'))$('pauseBtn').addEventListener('click',function(){
      if(window.GameBridge&&GameBridge.pause)GameBridge.pause();
      show('pauseScreen');
    });
    if($('resumeBtn'))$('resumeBtn').addEventListener('click',function(){hide('pauseScreen');if(window.GameBridge&&GameBridge.resume)GameBridge.resume();});
    if($('quitBtn'))$('quitBtn').addEventListener('click',function(){
      if(window.GameBridge&&GameBridge.save)GameBridge.save();
      if(window.GameBridge&&GameBridge.pause)GameBridge.pause();
      hide('pauseScreen');
      var c=$('game-container'),t=$('title-screen');
      if(c)c.classList.remove('active');
      if(t){t.style.display='';t.classList.remove('hide');}
    });
  }catch(e){}
}
window.Settings={get:function(){return settings;}};
window.Shop={
  open:function(gold,weaponLevel,onBuy){
    var sg=$('shopGold');if(sg)sg.textContent='💰 '+gold;
    var items=$('shopItems');if(!items)return;
    items.innerHTML='';
    var weapons=[
      {id:'w1',name:'Iron Blade',desc:'+15 damage',price:40,icon:'⚔'},
      {id:'w2',name:'Steel Edge',desc:'+30 damage',price:90,icon:'🗡'},
      {id:'w3',name:'Shadow Reaper',desc:'+50 damage',price:160,icon:'🌑'},
      {id:'w4',name:'Void Scythe',desc:'+80 damage',price:280,icon:'☠'}
    ];
    var armors=[
      {id:'a1',name:'Leather Vest',desc:'+30 HP',price:50,icon:'🛡'},
      {id:'a2',name:'Iron Plate',desc:'+60 HP',price:110,icon:'🛡'},
      {id:'a3',name:'Dragon Mail',desc:'+100 HP',price:180,icon:'🛡'}
    ];
    var all=weapons.concat(armors);
    all.forEach(function(item){
      var div=document.createElement('div');
      div.className='shop-item';
      if(gold<item.price)div.classList.add('disabled');
      div.innerHTML='<div class="shop-item__icon">'+item.icon+'</div>'+
        '<div class="shop-item__info"><div class="shop-item__name">'+item.name+'</div>'+
        '<div class="shop-item__desc">'+item.desc+'</div></div>'+
        '<div class="shop-item__price">💰 '+item.price+'</div>';
      div.addEventListener('click',function(){if(gold<item.price)return;if(onBuy)onBuy(item);});
      items.appendChild(div);
    });
    show('shopScreen');
  }
};
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
      newBtn.addEventListener('click',function(){
        if(weaponLevel>=5)return;
        if(gold<nextPrice)return;
        if(onUpgrade)onUpgrade();
      });
    }
    show('forgeScreen');
  }
};
window.Hint={show:function(){var el=$('interactHint');if(el)el.classList.add('active');},hide:function(){var el=$('interactHint');if(el)el.classList.remove('active');}};
window.BossPrompt={
  show:function(bossName,onYes,onNo){
    var nm=$('bossPromptName');if(nm)nm.textContent='⚔ '+bossName;
    var yb=$('bossAcceptBtn'),nb=$('bossDeclineBtn');
    var newY=yb.cloneNode(true);yb.parentNode.replaceChild(newY,yb);newY.id='bossAcceptBtn';
    var newN=nb.cloneNode(true);nb.parentNode.replaceChild(newN,nb);newN.id='bossDeclineBtn';
    newY.addEventListener('click',function(){hide('bossPromptScreen');if(onYes)onYes();});
    newN.addEventListener('click',function(){hide('bossPromptScreen');if(onNo)onNo();});
    show('bossPromptScreen');
  }
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
})();
