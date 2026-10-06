var GameMap=(function(){
'use strict';
var active=false;
var onTeleport=null;

function $(id){return document.getElementById(id);}

function show(){
  var el=$('mapScreen');
  if(el)el.classList.add('active');
  active=true;
  try{if(window.GameBridge&&GameBridge.pause)GameBridge.pause();}catch(e){}
}

function hide(){
  var el=$('mapScreen');
  if(el)el.classList.remove('active');
  active=false;
  try{if(window.GameBridge&&GameBridge.resume)GameBridge.resume();}catch(e){}
}

function teleport(target){
  hide();
  if(onTeleport)onTeleport(target);
}

function init(){
  var btn=$('mapBtn');
  var closeBtn=$('closeMap');
  if(btn)btn.addEventListener('click',function(e){e.preventDefault();show();});
  if(closeBtn)closeBtn.addEventListener('click',function(e){e.preventDefault();hide();});
  
  var hotspots=document.querySelectorAll('.map-hotspot');
  hotspots.forEach(function(hs){
    hs.addEventListener('click',function(e){
      e.preventDefault();
      var target=this.getAttribute('data-target');
      teleport(target);
    });
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

return{
  show:show,
  hide:hide,
  isActive:function(){return active;},
  setTeleportHandler:function(fn){onTeleport=fn;}
};
})();
