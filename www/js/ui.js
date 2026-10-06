(function(){
'use strict';

var SUPPORT_URL='https://yzn-support.netlify.app/';
var settings={master:50,sfx:70,vibration:true,particles:true,blood:true};

// قراءة الإعدادات بأمان
try{
  if(window.Save&&typeof Save.loadSettings==='function'){
    settings=Save.loadSettings();
  }
}catch(e){console.log('Save load failed:',e);}

function $(id){return document.getElementById(id);}

function spawnTitleParticles(){
  try{
    var container=$('titleParticles');
    if(!container)return;
    for(var i=0;i<30;i++){
      var p=document.createElement('div');
      p.className='title-particle';
      p.style.left=Math.random()*100+'%';
      p.style.animationDuration=(4+Math.random()*6)+'s';
      p.style.animationDelay=(Math.random()*5)+'s';
      p.style.opacity=0.3+Math.random()*0.5;
      var sz=1+Math.random()*2;
      p.style.width=sz+'px';
      p.style.height=sz+'px';
      container.appendChild(p);
    }
  }catch(e){console.log('Particles error:',e);}
}

function syncSettingsUI(){
  try{
    if($('setMaster'))$('setMaster').value=settings.master;
    if($('setMasterVal'))$('setMasterVal').textContent=settings.master+'%';
    if($('setSFX'))$('setSFX').value=settings.sfx;
    if($('setSFXVal'))$('setSFXVal').textContent=settings.sfx+'%';
    if($('setVibration'))$('setVibration').checked=settings.vibration;
    if($('setParticles'))$('setParticles').checked=settings.particles;
    if($('setBlood'))$('setBlood').checked=settings.blood;
  }catch(e){}
}

function applySettings(){
  try{
    if(window.Sound){Sound.init();if(Sound.resume)Sound.resume();}
  }catch(e){}
}

function show(id){var el=$(id);if(el)el.classList.add('active');}
function hide(id){var el=$(id);if(el)el.classList.remove('active');}

function bindUI(){
  try{
    var btnNG=$('btnNewGame');
    if(btnNG)btnNG.addEventListener('click',function(){
      try{if(window.Save)Save.reset();}catch(e){}
      var container=$('game-container');
      var title=$('title-screen');
      if(title)title.classList.add('hide');
      setTimeout(function(){
        if(title)title.style.display='none';
        if(container)container.classList.add('active');
        if(window.GameBridge&&window.GameBridge.startNewGame)window.GameBridge.startNewGame();
      },500);
      if(window.Sound)Sound.portal();
    });

    var btnC=$('btnContinue');
    if(btnC)btnC.addEventListener('click',function(){
      var container=$('game-container');
      var title=$('title-screen');
      if(title)title.classList.add('hide');
      setTimeout(function(){
        if(title)title.style.display='none';
        if(container)container.classList.add('active');
        if(window.GameBridge&&window.GameBridge.continueGame)window.GameBridge.continueGame();
      },500);
      if(window.Sound)Sound.portal();
    });

    var btnS=$('btnSettings');
    if(btnS)btnS.addEventListener('click',function(){syncSettingsUI();show('settingsScreen');});

    var btnA=$('btnAbout');
    if(btnA)btnA.addEventListener('click',function(){show('aboutScreen');});

    var btnW=$('btnWebsite');
    if(btnW)btnW.addEventListener('click',function(){
      try{
        if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Browser){
          window.Capacitor.Plugins.Browser.open({url:SUPPORT_URL});
        }else{
          window.open(SUPPORT_URL,'_system');
        }
      }catch(e){window.open(SUPPORT_URL,'_system');}
    });

    if($('setMaster'))$('setMaster').addEventListener('input',function(){
      settings.master=parseInt(this.value);
      $('setMasterVal').textContent=this.value+'%';
      try{if(window.Save)Save.saveSettings(settings);}catch(e){}
      applySettings();
    });
    if($('setSFX'))$('setSFX').addEventListener('input',function(){
      settings.sfx=parseInt(this.value);
      $('setSFXVal').textContent=this.value+'%';
      try{if(window.Save)Save.saveSettings(settings);}catch(e){}
    });
    if($('setVibration'))$('setVibration').addEventListener('change',function(){
      settings.vibration=this.checked;
      try{if(window.Save)Save.saveSettings(settings);}catch(e){}
    });
    if($('setParticles'))$('setParticles').addEventListener('change',function(){
      settings.particles=this.checked;
      try{if(window.Save)Save.saveSettings(settings);}catch(e){}
    });
    if($('setBlood'))$('setBlood').addEventListener('change',function(){
      settings.blood=this.checked;
      try{if(window.Save)Save.saveSettings(settings);}catch(e){}
    });

    if($('closeSettings'))$('closeSettings').addEventListener('click',function(){hide('settingsScreen');});
    if($('closeAbout'))$('closeAbout').addEventListener('click',function(){hide('aboutScreen');});
    if($('closeShop'))$('closeShop').addEventListener('click',function(){hide('shopScreen');});
    if($('closeForge'))$('closeForge').addEventListener('click',function(){hide('forgeScreen');});

    if($('pauseBtn'))$('pauseBtn').addEventListener('click',function(){
      if(window.GameBridge&&window.GameBridge.pause)window.GameBridge.pause();
      show('pauseScreen');
    });
    if($('resumeBtn'))$('resumeBtn').addEventListener('click',function(){
      hide('pauseScreen');
      if(window.GameBridge&&window.GameBridge.resume)window.GameBridge.resume();
    });
    if($('pauseSettingsBtn'))$('pauseSettingsBtn').addEventListener('click',function(){
      hide('pauseScreen');syncSettingsUI();show('settingsScreen');
    });
    if($('quitBtn'))$('quitBtn').addEventListener('click',function(){
      if(window.GameBridge&&window.GameBridge.save)window.GameBridge.save();
      if(window.GameBridge&&window.GameBridge.pause)window.GameBridge.pause();
      hide('pauseScreen');
      var container=$('game-container');
      var title=$('title-screen');
      if(container)container.classList.remove('active');
      if(title){title.style.display='';title.classList.remove('hide');}
    });
  }catch(e){console.log('bindUI error:',e);}
}

window.Settings={get:function(){return settings;},reload:function(){settings=Save.loadSettings();syncSettingsUI();}};

window.Shop={
  open:function(gold,weaponLevel,onBuy){
    var sGold=$('shopGold');
    if(sGold)sGold.textContent='💰 '+gold;
    var items=$('shopItems');
    if(!items)return;
    items.innerHTML='';
    var weapons=[
      {id:'w1',name:'Iron Blade',desc:'+15 damage',price:55,icon:'⚔'},
      {id:'w2',name:'Steel Edge',desc:'+30 damage',price:120,icon:'🗡'},
      {id:'w3',name:'Shadow Reaper',desc:'+50 damage',price:250,icon:'🌑'},
      {id:'w4',name:'Void Scythe',desc:'+80 damage',price:500,icon:'☠'}
    ];
    var armors=[
      {id:'a1',name:'Leather Vest',desc:'+30 HP',price:40,icon:'🛡'},
      {id:'a2',name:'Iron Plate',desc:'+60 HP',price:100,icon:'🛡'},
      {id:'a3',name:'Dragon Mail',desc:'+100 HP',price:220,icon:'🛡'},
      {id:'a4',name:'Void Armor',desc:'+180 HP',price:450,icon:'🛡'}
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
      div.addEventListener('click',function(){
        if(gold<item.price)return;
        if(onBuy)onBuy(item);
      });
      items.appendChild(div);
    });
    show('shopScreen');
  }
};

window.Forge={
  open:function(gold,weaponLevel,onUpgrade){
    var fGold=$('forgeGold');
    if(fGold)fGold.textContent='💰 '+gold;
    var info=$('forgeInfo');
    if(!info)return;
    var prices=[0,0,80,180,350,600];
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
      newBtn.id='doForge';
      newBtn.addEventListener('click',function(){
        if(weaponLevel>=5)return;
        if(gold<nextPrice)return;
        if(onUpgrade)onUpgrade();
      });
    }
    show('forgeScreen');
  }
};

window.Hint={
  show:function(){var el=$('interactHint');if(el)el.classList.add('active');},
  hide:function(){var el=$('interactHint');if(el)el.classList.remove('active');}
};

function init(){
  spawnTitleParticles();
  bindUI();
  syncSettingsUI();
  try{
    var tGold=$('titleGold');
    if(tGold&&window.Save){var data=Save.load();tGold.textContent='💰 '+data.gold;}
  }catch(e){}
  var loadEl=$('loading');
  if(loadEl)setTimeout(function(){loadEl.classList.add('hide');},300);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

console.log('UI loaded');
})();
