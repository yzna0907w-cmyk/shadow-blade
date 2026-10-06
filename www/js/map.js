var GameMap=(function(){
'use strict';
var active=false;
var onTeleport=null;
function $(id){return document.getElementById(id);}
function show(){
  var el=$('mapScreen');
  if(el)el.classList.add('active');
  active=true;
  refreshLocks();
  try{if(window.GameBridge&&GameBridge.pause)GameBridge.pause();}catch(e){}
}
function hide(){
  var el=$('mapScreen');
  if(el)el.classList.remove('active');
  active=false;
  try{if(window.GameBridge&&GameBridge.resume)GameBridge.resume();}catch(e){}
}
function refreshLocks(){
  if(!window.Save)return;
  var data=Save.load();
  var unlocked=data.unlockedZones||[true,false,false,false];
  var hotspots=document.querySelectorAll('.map-hotspot');
  hotspots.forEach(function(hs){
    var t=hs.getAttribute('data-target');
    if(t==='shop'||t==='forge')return;
    var idx=parseInt(t);
    if(isNaN(idx))return;
    if(unlocked[idx]){hs.classList.remove('locked');hs.setAttribute('data-locked','false');}
    else{hs.classList.add('locked');hs.setAttribute('data-locked','true');}
  });
}
function showMessage(text){
  var footer=$('mapFooter');
  if(!footer)return;
  var old=footer.textContent;
  footer.textContent=text;
  footer.style.color='#ff6b6b';
  setTimeout(function(){footer.textContent=old;footer.style.color='';},2000);
}
function teleport(target){
  if(target==='shop'||target==='forge'){
    hide();
    if(onTeleport)onTeleport(target);
    return;
  }
  var idx=parseInt(target);
  if(isNaN(idx))return;
  if(!window.Save)return;
  var data=Save.load();
  var unlocked=data.unlockedZones||[true,false,false,false];
  if(!unlocked[idx]){
    showMessage('🔒 لم تصل إلى هذه المنطقة بعد!');
    try{if(window.Sound&&Sound.hurt)Sound.hurt();}catch(e){}
    return;
  }
  hide();
  if(onTeleport)onTeleport(target);
}
function init(){
  var btn=$('mapBtn');
  var closeBtn=$('closeMap');
  if(btn)btn.addEventListener('click',function(e){e.preventDefault();show();});
  if(closeBtn)closeBtn.addEventListener('click',function(e){e.preventDefault();hide();});
  document.querySelectorAll('.map-hotspot').forEach(function(hs){
    hs.addEventListener('click',function(e){
      e.preventDefault();
      teleport(this.getAttribute('data-target'));
    });
  });
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
return{show:show,hide:hide,refreshLocks:refreshLocks,isActive:function(){return active;},setTeleportHandler:function(fn){onTeleport=fn;}};
})();
