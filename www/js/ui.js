/* ============================================
   Shadow Blade - UI Controller
   ============================================ */
(function(){
'use strict';

var settings=Save.loadSettings();
var SUPPORT_URL='https://yzn-support.netlify.app/';

function $(id){return document.getElementById(id);}

/* ===== Title Particles ===== */
function spawnTitleParticles(){
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
}

/* ===== Settings UI ===== */
function syncSettingsUI(){
if($('setMaster'))$('setMaster').value=settings.master;
if($('setMasterVal'))$('setMasterVal').textContent=settings.master+'%';
if($('setSFX'))$('setSFX').value=settings.sfx;
if($('setSFXVal'))$('setSFXVal').textContent=settings.sfx+'%';
if($('setVibration'))$('setVibration').checked=settings.vibration;
if($('setParticles'))$('setParticles').checked=settings.particles;
if($('setBlood'))$('setBlood').checked=settings.blood;
}

function applySettings(){
Sound.init();
if(Sound.resume)Sound.resume();
if(window.AudioContext||window.webkitAudioContext){
var vol=settings.master/100;
if(window.GameBridge&&window.GameBridge.setVolume){
window.GameBridge.setVolume(vol);
}
}
}

/* ===== Modal Screens ===== */
function show(id){var el=$(id);if(el)el.classList.add('active');}
function hide(id){var el=$(id);if(el)el.classList.remove('active');}
function hideAllModals(){
['settingsScreen','aboutScreen','shopScreen','forgeScreen','pauseScreen'].forEach(hide);
}

/* ===== Bind Events ===== */
function bindUI(){
/* Title screen buttons */
var btnNG=$('btnNewGame');
if(btnNG)btnNG.addEventListener('click',function(){
Save.reset();
var container=$('game-container');
var title=$('title-screen');
if(title)title.classList.add('hide');
setTimeout(function(){
if(title)title.style.display='none';
if(container)container.classList.add('active');
if(window.GameBridge&&window.GameBridge.startNewGame){
window.GameBridge.startNewGame();
}
},500);
Sound.portal();
});

var btnC=$('btnContinue');
if(btnC)btnC.addEventListener('click',function(){
var container=$('game-container');
var title=$('title-screen');
if(title)title.classList.add('hide');
setTimeout(function(){
if(title)title.style.display='none';
if(container)container.classList.add('active');
if(window.GameBridge&&window.GameBridge.continueGame){
window.GameBridge.continueGame();
}
},500);
Sound.portal();
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

/* Settings sliders */
if($('setMaster')){
$('setMaster').addEventListener('input',function(){
settings.master=parseInt(this.value);
$('setMasterVal').textContent=this.value+'%';
Save.saveSettings(settings);
applySettings();
});
}
if($('setSFX')){
$('setSFX').addEventListener('input',function(){
settings.sfx=parseInt(this.value);
$('setSFXVal').textContent=this.value+'%';
Save.saveSettings(settings);
});
}
if($('setVibration')){
$('setVibration').addEventListener('change',function(){
settings.vibration=this.checked;
Save.saveSettings(settings);
});
}
if($('setParticles')){
$('setParticles').addEventListener('change',function(){
settings.particles=this.checked;
Save.saveSettings(settings);
});
}
if($('setBlood')){
$('setBlood').addEventListener('change',function(){
settings.blood=this.checked;
Save.saveSettings(settings);
});
}

/* Close buttons */
var closeS=$('closeSettings');
if(closeS)closeS.addEventListener('click',function(){hide('settingsScreen');});
var closeA=$('closeAbout');
if(closeA)closeA.addEventListener('click',function(){hide('aboutScreen');});
var closeSh=$('closeShop');
if(closeSh)closeSh.addEventListener('click',function(){hide('shopScreen');});
var closeF=$('closeForge');
if(closeF)closeF.addEventListener('click',function(){hide('forgeScreen');});

/* Pause */
var pauseBtn=$('pauseBtn');
if(pauseBtn)pauseBtn.addEventListener('click',function(){
if(window.GameBridge&&window.GameBridge.pause)window.GameBridge.pause();
show('pauseScreen');
});
var resumeBtn=$('resumeBtn');
if(resumeBtn)resumeBtn.addEventListener('click',function(){
hide('pauseScreen');
if(window.GameBridge&&window.GameBridge.resume)window.GameBridge.resume();
});
var pauseSet=$('pauseSettingsBtn');
if(pauseSet)pauseSet.addEventListener('click',function(){
hide('pauseScreen');
syncSettingsUI();
show('settingsScreen');
});
var quitBtn=$('quitBtn');
if(quitBtn)quitBtn.addEventListener('click',function(){
if(window.GameBridge&&window.GameBridge.save)window.GameBridge.save();
if(window.GameBridge&&window.GameBridge.pause)window.GameBridge.pause();
hide('pauseScreen');
var container=$('game-container');
var title=$('title-screen');
if(container)container.classList.remove('active');
if(title){title.style.display='';title.classList.remove('hide');}
});
}

/* ===== Settings Access API ===== */
window.Settings={
get:function(){return settings;},
reload:function(){settings=Save.loadSettings();syncSettingsUI();}
};

/* ===== Shop API ===== */
window.Shop={
open:function(gold,weaponLevel,onBuy){
var sGold=$('shopGold');
if(sGold)sGold.textContent='💰 '+gold;
var items=$('shopItems');
if(!items)return;
items.innerHTML='';
var weapons=[
{id:'w1',name:'Iron Blade',desc:'+15 damage',price:55,minLevel:1,icon:'⚔'},
{id:'w2',name:'Steel Edge',desc:'+30 damage',price:120,minLevel:2,icon:'🗡'},
{id:'w3',name:'Shadow Reaper',desc:'+50 damage',price:250,minLevel:3,icon:'🌑'},
{id:'w4',name:'Void Scythe',desc:'+80 damage',price:500,minLevel:4,icon:'☠'}
];
var armors=[
{id:'a1',name:'Leather Vest',desc:'+30 HP',price:40,minLevel:1,icon:'🛡'},
{id:'a2',name:'Iron Plate',desc:'+60 HP',price:100,minLevel:2,icon:'🛡'},
{id:'a3',name:'Dragon Mail',desc:'+100 HP',price:220,minLevel:3,icon:'🛡'},
{id:'a4',name:'Void Armor',desc:'+180 HP',price:450,minLevel:4,icon:'🛡'}
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

/* ===== Forge API ===== */
window.Forge={
open:function(gold,weaponLevel,onUpgrade){
var fGold=$('forgeGold');
if(fGold)fGold.textContent='💰 '+gold;
var info=$('forgeInfo');
if(!info)return;
var prices=[0,80,180,350,600];
var nextPrice=prices[weaponLevel]||0;
if(weaponLevel>=5){
info.innerHTML='<div class="curr">MAX LEVEL</div><div class="next">Your weapon is fully upgraded!</div>';
}else{
info.innerHTML='<div class="curr">Weapon Lv.'+weaponLevel+'</div>'+
'<div class="arrow">▼</div>'+
'<div class="curr">Weapon Lv.'+(weaponLevel+1)+'</div>'+
'<div class="next">Cost: 💰 '+nextPrice+'</div>';
}
var doBtn=$('doForge');
var newBtn=doBtn.cloneNode(true);
doBtn.parentNode.replaceChild(newBtn,doBtn);
newBtn.id='doForge';
newBtn.addEventListener('click',function(){
if(weaponLevel>=5)return;
if(gold<nextPrice)return;
if(onUpgrade)onUpgrade();
});
show('forgeScreen');
}
};

/* ===== Interact Hint ===== */
window.Hint={
show:function(){var el=$('interactHint');if(el)el.classList.add('active');},
hide:function(){var el=$('interactHint');if(el)el.classList.remove('active');}
};

/* ===== Init ===== */
function init(){
spawnTitleParticles();
bindUI();
syncSettingsUI();
var tGold=$('titleGold');
if(tGold){var data=Save.load();tGold.textContent='💰 '+data.gold;}
var loadEl=$('loading');
if(loadEl)setTimeout(function(){loadEl.classList.add('hide');},300);
}
if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',init);
}else{
init();
}
})();
